import Link from "next/link";
import { LuBell, LuMessageSquare, LuPackageX, LuShoppingCart, LuStar, LuTriangleAlert, LuUserPlus } from "react-icons/lu";

import AdminCard, { AdminHeader } from "@/components/admin/adminCard";
import DateText from "@/components/ui/dateText";
import EmptyState from "@/components/ui/emptyState";
import { pageMetadata } from "@/i18n/server";
import { getAdminContext } from "@/lib/adminData";
import { cn, displayName } from "@/lib/format";
import { getAdminNotifications } from "@/lib/notifications";

export const generateMetadata = pageMetadata("adminNotifications");

const ICONS = { newOrder: LuShoppingCart, message: LuMessageSquare, outOfStock: LuPackageX, lowStock: LuTriangleAlert, review: LuStar, customer: LuUserPlus };

export default async function AdminNotifications({ params }) {
  const [{ t, format }, items] = await Promise.all([getAdminContext(params), getAdminNotifications()]);
  const text = ({ kind, vars }) =>
    t(`admin.notifications.${kind}`, {
      ...vars,
      ...(vars.total !== undefined && { total: format.price(vars.total) }),
      ...(vars.product && { product: displayName(vars.product) }),
      ...(["outOfStock", "lowStock"].includes(kind) && { name: displayName(vars.name) }),
    });

  return (
    <>
      <AdminHeader title={t("admin.nav.notifications")} description={t("admin.notifications.text")} />
      {items.length === 0 ? (
        <EmptyState icon={LuBell} title={t("admin.notifications.empty")} className="glass rounded-3xl" />
      ) : (
        <AdminCard>
          <ul className="divide-y divide-line">
            {items.map((item) => {
              const Icon = ICONS[item.kind];
              return (
                <li key={item.id}>
                  <Link href={item.href} className="-mx-2 flex items-center gap-4 rounded-2xl px-2 py-3.5 transition-colors hover:bg-fg/4">
                    <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-lg", item.urgent ? "bg-brand text-white" : "bg-fg/6 text-fg-muted")}>
                      <Icon aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium">{text(item)}</span>
                      <DateText value={item.date} className="block text-xs text-fg-muted" />
                    </span>
                    {item.urgent && <span className="shrink-0 rounded-full bg-brand-soft px-2.5 py-1 text-[11px] font-semibold text-brand">{t("admin.notifications.needsAction")}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </AdminCard>
      )}
    </>
  );
}
