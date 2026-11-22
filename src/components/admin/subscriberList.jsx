"use client";

import { LuCopy, LuDownload } from "react-icons/lu";

import AdminCard, { Table } from "@/components/admin/adminCard";
import DeleteButton from "@/components/admin/deleteButton";
import Button from "@/components/ui/button";
import DateText from "@/components/ui/dateText";
import { useToast } from "@/components/ui/toast";
import { useI18n } from "@/i18n/client";

export default function SubscriberList({ subscribers }) {
  const { t } = useI18n();
  const toast = useToast();

  const copyAll = async () => {
    await navigator.clipboard.writeText(subscribers.map((subscriber) => subscriber.email).join(", "));
    toast({ title: t("admin.subscribers.copied") });
  };

  const exportCsv = () => {
    const rows = [
      ["email", "subscribed_at"],
      ...subscribers.map((subscriber) => [subscriber.email, new Date(subscriber.createdAt).toISOString()]),
    ];
    const url = URL.createObjectURL(new Blob([rows.map((row) => row.join(",")).join("\n")], { type: "text/csv" }));
    Object.assign(document.createElement("a"), { href: url, download: "subscribers.csv" }).click();
    URL.revokeObjectURL(url);
  };

  return (
    <AdminCard
      title={t("admin.subscribers.all", { count: subscribers.length })}
      aside={
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" onClick={copyAll} disabled={subscribers.length === 0}>
            <LuCopy /> {t("admin.subscribers.copy")}
          </Button>
          <Button size="sm" onClick={exportCsv} disabled={subscribers.length === 0}>
            <LuDownload /> {t("admin.subscribers.export")}
          </Button>
        </div>
      }
    >
      <Table
        head={[t("common.email"), t("admin.subscribers.since"), ""]}
        empty={subscribers.length === 0 && <p className="py-10 text-center text-sm text-fg-muted">{t("admin.subscribers.empty")}</p>}
      >
        {subscribers.map((subscriber) => (
          <tr key={subscriber.id}>
            <td className="py-3 pe-4 font-medium" dir="ltr">
              {subscriber.email}
            </td>
            <td className="py-3 pe-4 text-fg-muted">
              <DateText value={subscriber.createdAt} />
            </td>
            <td className="py-3 text-end">
              <DeleteButton
                url={`/api/admin/subscribers/${subscriber.id}`}
                title={t("admin.subscribers.deleteTitle")}
                description={t("admin.subscribers.deleteText")}
                success={t("admin.deleted")}
              />
            </td>
          </tr>
        ))}
      </Table>
    </AdminCard>
  );
}
