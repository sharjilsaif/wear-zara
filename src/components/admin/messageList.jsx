"use client";

import { LuMail, LuMailOpen, LuReply } from "react-icons/lu";

import DeleteButton from "@/components/admin/deleteButton";
import Avatar from "@/components/ui/avatar";
import Button from "@/components/ui/button";
import DateText from "@/components/ui/dateText";
import EmptyState from "@/components/ui/emptyState";
import IconButton from "@/components/ui/iconButton";
import { useI18n } from "@/i18n/client";
import { cn } from "@/lib/format";
import { SITE } from "@/lib/site";
import useRequest from "@/lib/useRequest";

function Message({ message }) {
  const { t } = useI18n();
  const { send, pending } = useRequest();
  const setRead = (read) => send(`/api/admin/messages/${message.id}`, { method: "PATCH", body: { read } });
  const reply = `mailto:${message.email}?subject=${encodeURIComponent(`Re: ${SITE.name}`)}`;

  return (
    <li className={cn("glass rounded-3xl p-5 transition-all", !message.read && "ring-2 ring-brand/30")}>
      <div className="flex flex-wrap items-start gap-3">
        <Avatar name={message.name} size="md" />
        <div className="min-w-0 flex-1">
          <p className="flex flex-wrap items-center gap-2 font-semibold">
            {message.name}
            {!message.read && <span className="h-2 w-2 rounded-full bg-brand" aria-label={t("admin.messages.unread")} />}
          </p>
          <p className="text-[13px] text-fg-muted" dir="ltr">
            {message.email}
            {message.phone && ` · ${message.phone}`}
          </p>
        </div>
        <DateText value={message.createdAt} withTime className="text-xs text-fg-muted" />
      </div>

      <p className="mt-4 whitespace-pre-line text-sm leading-6">{message.message}</p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Button href={reply} size="sm" variant="secondary" onClick={() => !message.read && setRead(true)}>
          <LuReply className="rtl:-scale-x-100" /> {t("admin.messages.reply")}
        </Button>
        <IconButton
          label={t(message.read ? "admin.messages.markUnread" : "admin.messages.markRead")}
          variant="ghost"
          size="sm"
          disabled={pending}
          onClick={() => setRead(!message.read)}
        >
          {message.read ? <LuMail /> : <LuMailOpen />}
        </IconButton>
        <DeleteButton url={`/api/admin/messages/${message.id}`} title={t("admin.messages.deleteTitle")} description={t("admin.messages.deleteText")} success={t("admin.deleted")} />
      </div>
    </li>
  );
}

export default function MessageList({ messages }) {
  const { t } = useI18n();
  if (messages.length === 0) return <EmptyState icon={LuMail} title={t("admin.messages.empty")} description={t("admin.messages.emptyText")} />;

  return (
    <ul className="flex flex-col gap-3">
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
    </ul>
  );
}
