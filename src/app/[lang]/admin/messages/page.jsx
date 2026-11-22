import { AdminHeader } from "@/components/admin/adminCard";
import MessageList from "@/components/admin/messageList";
import FilterChips from "@/components/shop/filterChips";
import { pageMetadata } from "@/i18n/server";
import { getAdminContext } from "@/lib/adminData";
import { prisma } from "@/lib/prisma";

export const generateMetadata = pageMetadata("adminMessages");

export default async function AdminMessages({ params, searchParams }) {
  const { t } = await getAdminContext(params);
  const unreadOnly = (await searchParams).filter === "unread";

  const [messages, unread, total] = await Promise.all([
    prisma.contactMessage.findMany({ where: unreadOnly ? { read: false } : undefined, orderBy: { createdAt: "desc" }, take: 200 }),
    prisma.contactMessage.count({ where: { read: false } }),
    prisma.contactMessage.count(),
  ]);

  return (
    <>
      <AdminHeader title={t("admin.nav.messages")} description={t("admin.messages.text")} />
      <div className="mb-6">
        <FilterChips
          label={t("admin.messages.filter")}
          items={[
            { href: "/admin/messages", label: t("shop.allChip"), count: total, active: !unreadOnly },
            { href: "/admin/messages?filter=unread", label: t("admin.messages.unread"), count: unread, active: unreadOnly },
          ]}
        />
      </div>
      <MessageList messages={messages} />
    </>
  );
}
