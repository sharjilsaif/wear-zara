import Link from "next/link";

import AdminCard, { AdminHeader, StatCard } from "@/components/admin/adminCard";
import OrderList from "@/components/orders/orderList";
import Avatar from "@/components/ui/avatar";
import DateText from "@/components/ui/dateText";
import { pageMetadata } from "@/i18n/server";
import { adminEmails } from "@/lib/admin";
import { getAdminContext } from "@/lib/adminData";
import { orderListSelect } from "@/lib/orders";
import { prisma } from "@/lib/prisma";

export const generateMetadata = pageMetadata("admin");

export default async function AdminOverview({ params }) {
  const { t, format, person } = await getAdminContext(params);

  const customers = { email: { notIn: adminEmails() } };
  const [revenue, orders, pending, users, products, unread, subscribers, recentOrders, recentUsers] = await Promise.all([
    prisma.order.aggregate({ where: { status: { not: "CANCELLED" } }, _sum: { total: true } }),
    prisma.order.count(),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.user.count({ where: customers }),
    prisma.product.count(),
    prisma.contactMessage.count({ where: { read: false } }),
    prisma.newsletterSubscriber.count(),
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 5, select: orderListSelect }),
    prisma.user.findMany({ where: customers, orderBy: { createdAt: "desc" }, take: 5, select: { id: true, name: true, email: true, createdAt: true, avatar: { select: { updatedAt: true } } } }),
  ]);

  const stats = [
    { label: t("admin.stats.revenue"), value: format.price(revenue._sum.total ?? 0), href: "/admin/orders", tone: "success" },
    { label: t("admin.stats.orders"), value: format.number(orders), hint: t("admin.stats.pending", { count: pending }), href: "/admin/orders", tone: "brand" },
    { label: t("admin.stats.customers"), value: format.number(users), href: "/admin/users", tone: "brand" },
    { label: t("admin.stats.products"), value: format.number(products), href: "/admin/products", tone: "warning" },
    { label: t("admin.stats.messages"), value: format.number(unread), hint: t("admin.stats.unread"), href: "/admin/messages", tone: "danger" },
    { label: t("admin.stats.subscribers"), value: format.number(subscribers), href: "/admin/subscribers", tone: "brand" },
  ];

  const viewAll = (href) => (
    <Link href={href} className="text-sm font-medium text-link hover:underline">
      {t("common.viewAll")}
    </Link>
  );

  return (
    <>
      <AdminHeader title={t("admin.nav.overview")} description={t("admin.overviewText")} />
      <div className="mb-6 grid grid-cols-2 gap-4 xl:grid-cols-3">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <AdminCard title={t("admin.recentOrders")} aside={viewAll("/admin/orders")}>
          {recentOrders.length ? <OrderList orders={recentOrders} baseHref="/admin/orders" /> : <p className="py-8 text-center text-sm text-fg-muted">{t("admin.orders.empty")}</p>}
        </AdminCard>

        <AdminCard title={t("admin.newCustomers")} aside={viewAll("/admin/users")}>
          <ul className="flex flex-col gap-1">
            {recentUsers.map(person).map((user) => (
              <li key={user.id}>
                <Link href={`/admin/users/${user.id}`} className="flex items-center gap-3 rounded-2xl p-2 transition-colors hover:bg-fg/4">
                  <Avatar src={user.image} name={user.name} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{user.name}</p>
                    <p className="truncate text-xs text-fg-muted">{user.email}</p>
                  </div>
                  <DateText value={user.createdAt} className="shrink-0 text-xs text-fg-muted" />
                </Link>
              </li>
            ))}
          </ul>
        </AdminCard>
      </div>
    </>
  );
}
