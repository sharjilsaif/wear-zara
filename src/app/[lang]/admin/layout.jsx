import { redirect } from "next/navigation";

import { auth } from "@/auth";
import AdminGuard from "@/components/admin/adminGuard";
import AdminShell from "@/components/admin/adminShell";
import { countAdminNotifications } from "@/lib/notifications";
import { prisma } from "@/lib/prisma";

export const metadata = { robots: { index: false } };

/** Admins only — everyone else is sent straight to the home page before anything renders. */
export default async function AdminLayout({ children }) {
  const session = await auth();
  if (!session?.user?.isAdmin) redirect("/");

  const [pendingOrders, unreadMessages, notifications] = await Promise.all([
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.contactMessage.count({ where: { read: false } }),
    countAdminNotifications(),
  ]);

  const groups = [
    {
      items: [
        { href: "/admin", key: "admin.nav.overview", icon: "dashboard", exact: true },
        { href: "/admin/notifications", key: "admin.nav.notifications", icon: "bell", badge: notifications },
      ],
    },
    {
      key: "sales",
      items: [
        { href: "/admin/orders", key: "admin.nav.orders", icon: "orders", badge: pendingOrders },
        { href: "/admin/coupons", key: "admin.nav.coupons", icon: "coupons" },
      ],
    },
    {
      key: "catalog",
      items: [
        { href: "/admin/products", key: "admin.nav.products", icon: "products" },
        { href: "/admin/categories", key: "admin.nav.categories", icon: "categories" },
        { href: "/admin/reviews", key: "admin.nav.reviews", icon: "reviews" },
      ],
    },
    {
      key: "people",
      items: [
        { href: "/admin/users", key: "admin.nav.users", icon: "users" },
        { href: "/admin/messages", key: "admin.nav.messages", icon: "messages", badge: unreadMessages },
        { href: "/admin/subscribers", key: "admin.nav.subscribers", icon: "subscribers" },
      ],
    },
  ];

  const { name, email, image } = session.user;
  return (
    <AdminGuard>
      <AdminShell groups={groups} user={{ name, email, image }} notifications={notifications}>
        <div className="animate-fade-up">{children}</div>
      </AdminShell>
    </AdminGuard>
  );
}
