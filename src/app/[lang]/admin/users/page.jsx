import Form from "next/form";
import Link from "next/link";
import { LuSearch } from "react-icons/lu";

import AdminCard, { AdminHeader, Table } from "@/components/admin/adminCard";
import Avatar from "@/components/ui/avatar";
import Badge from "@/components/ui/badge";
import DateText from "@/components/ui/dateText";
import { pageMetadata } from "@/i18n/server";
import { adminEmails } from "@/lib/admin";
import { getAdminContext } from "@/lib/adminData";
import { prisma } from "@/lib/prisma";

export const generateMetadata = pageMetadata("adminUsers");

export default async function AdminUsers({ params, searchParams }) {
  const { t, format, person, me } = await getAdminContext(params);
  const { q: rawQ } = await searchParams;
  const q = typeof rawQ === "string" ? rawQ.trim().slice(0, 60) : "";

  const admins = adminEmails();
  const [users, spent, staff] = await Promise.all([
    prisma.user.findMany({
      // Customers only: admins run the store and are listed separately.
      where: {
        email: { notIn: admins },
        ...(q && { OR: [{ name: { contains: q, mode: "insensitive" } }, { email: { contains: q, mode: "insensitive" } }] }),
      },
      orderBy: { createdAt: "desc" },
      take: 200,
      select: { id: true, name: true, email: true, phone: true, createdAt: true, avatar: { select: { updatedAt: true } }, _count: { select: { orders: true } } },
    }),
    prisma.order.groupBy({ by: ["userId"], where: { status: { not: "CANCELLED" }, userId: { not: null } }, _sum: { total: true } }),
    prisma.user.findMany({
      where: { email: { in: admins } },
      orderBy: { createdAt: "asc" },
      select: { id: true, name: true, email: true, phone: true, createdAt: true, avatar: { select: { updatedAt: true } } },
    }),
  ]);
  const spentBy = Object.fromEntries(spent.map((row) => [row.userId, row._sum.total ?? 0]));

  return (
    <>
      <AdminHeader
        title={t("admin.nav.users")}
        description={t("admin.users.text")}
        actions={
          <Form action="/admin/users" className="relative w-full sm:w-72">
            <LuSearch aria-hidden className="absolute start-3.5 top-1/2 -translate-y-1/2 text-fg-muted" />
            <input
              name="q"
              type="search"
              defaultValue={q}
             
              placeholder={t("admin.users.search")}
              aria-label={t("admin.users.search")}
              className="h-10 w-full rounded-full border border-line bg-field ps-10 pe-4 text-sm outline-none transition-all focus:border-brand focus:ring-4 focus:ring-brand/15 disabled:opacity-60"
            />
          </Form>
        }
      />

      {staff.length > 1 && (
        <AdminCard title={t("admin.users.admins")} description={t("admin.users.adminsText", { count: staff.length })} className="mb-6">
          <ul className="grid gap-3 sm:grid-cols-2">
            {staff.map(person).map((admin) => (
              <li key={admin.id}>
                <Link href={`/admin/users/${admin.id}`} className="flex items-center gap-3 rounded-2xl bg-fg/4 p-3 transition-colors hover:bg-fg/6">
                  <Avatar src={admin.image} name={admin.name} />
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-2 font-medium">
                      <span className="truncate">{admin.name}</span>
                      {admin.id === me.id && <Badge tone="brand">{t("admin.users.you")}</Badge>}
                    </p>
                    <p className="truncate text-xs text-fg-muted" dir="ltr">
                      {admin.email}
                      {admin.phone && ` · ${admin.phone}`}
                    </p>
                    <p className="text-xs text-fg-muted">
                      {t("admin.users.joined")} <DateText value={admin.createdAt} />
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </AdminCard>
      )}

      <AdminCard title={t("admin.users.all", { count: users.length })}>
        <Table
          head={[t("admin.users.customer"), t("admin.users.joined"), t("admin.stats.orders"), t("admin.users.spent")]}
          empty={users.length === 0 && <p className="py-10 text-center text-sm text-fg-muted">{t("admin.noMatches", { query: q })}</p>}
        >
          {users.map(person).map((user) => (
            <tr key={user.id} className="transition-colors hover:bg-fg/2">
              <td className="py-3 pe-4">
                <Link href={`/admin/users/${user.id}`} className="flex items-center gap-3">
                  <Avatar src={user.image} name={user.name} />
                  <div className="min-w-0">
                    <p className="font-medium hover:text-brand">{user.name}</p>
                    <p className="truncate text-xs text-fg-muted">{user.email}</p>
                  </div>
                </Link>
              </td>
              <td className="py-3 pe-4 text-fg-muted">
                <DateText value={user.createdAt} />
              </td>
              <td className="py-3 pe-4 tabular-nums">{format.number(user._count.orders)}</td>
              <td className="py-3 font-medium tabular-nums">{format.price(spentBy[user.id] ?? 0)}</td>
            </tr>
          ))}
        </Table>
      </AdminCard>
    </>
  );
}
