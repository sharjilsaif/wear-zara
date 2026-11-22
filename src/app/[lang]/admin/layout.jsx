import { redirect } from "next/navigation";

import { auth } from "@/auth";
import AdminGuard from "@/components/admin/adminGuard";
import SideNav from "@/components/ui/sideNav";
import { getI18n } from "@/i18n/server";
import { prisma } from "@/lib/prisma";

export const metadata = { robots: { index: false } };

/** Admins only — everyone else is sent straight to the home page before anything renders. */
export default async function AdminLayout({ children, params }) {
  const [{ t }, session] = await Promise.all([getI18n((await params).lang), auth()]);
  if (!session?.user?.isAdmin) redirect("/");

  const [pendingOrders, unreadMessages] = await Promise.all([
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.contactMessage.count({ where: { read: false } }),
  ]);

  const nav = [
    { href: "/admin", key: "admin.nav.overview", icon: "dashboard", exact: true },
    { href: "/admin/orders", key: "admin.nav.orders", icon: "orders", badge: pendingOrders },
    { href: "/admin/products", key: "admin.nav.products", icon: "products" },
    { href: "/admin/categories", key: "admin.nav.categories", icon: "categories" },
    { href: "/admin/coupons", key: "admin.nav.coupons", icon: "coupons" },
    { href: "/admin/users", key: "admin.nav.users", icon: "users" },
    { href: "/admin/reviews", key: "admin.nav.reviews", icon: "reviews" },
    { href: "/admin/messages", key: "admin.nav.messages", icon: "messages", badge: unreadMessages },
    { href: "/admin/subscribers", key: "admin.nav.subscribers", icon: "subscribers" },
  ];

  return (
    <AdminGuard>
      <div className="container-page py-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[14rem_minmax(0,1fr)] lg:items-start lg:gap-8">
          <SideNav items={nav} label={t("admin.title")} />
          <div className="min-w-0 animate-fade-up">{children}</div>
        </div>
      </div>
    </AdminGuard>
  );
}
