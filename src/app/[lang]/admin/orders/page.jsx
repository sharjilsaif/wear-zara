import Form from "next/form";
import { LuSearch } from "react-icons/lu";

import { AdminHeader } from "@/components/admin/adminCard";
import OrderList from "@/components/orders/orderList";
import Pagination from "@/components/shop/pagination";
import FilterChips from "@/components/shop/filterChips";
import EmptyState from "@/components/ui/emptyState";
import { pageMetadata } from "@/i18n/server";
import { getAdminContext } from "@/lib/adminData";
import { orderListSelect } from "@/lib/orders";
import { prisma } from "@/lib/prisma";
import { ORDER_STATUSES } from "@/lib/site";

export const generateMetadata = pageMetadata("adminOrders");

const PAGE_SIZE = 15;

export default async function AdminOrders({ params, searchParams }) {
  const { t } = await getAdminContext(params);
  const query = await searchParams;
  const status = ORDER_STATUSES.includes(query.status) ? query.status : undefined;
  const q = typeof query.q === "string" ? query.q.trim().slice(0, 60) : "";
  const page = Math.max(1, Number.parseInt(query.page, 10) || 1);

  const where = {
    ...(status && { status }),
    ...(q && {
      OR: [
        { number: { contains: q, mode: "insensitive" } },
        ...[{ email: { contains: q, mode: "insensitive" } }, { customerName: { contains: q, mode: "insensitive" } }],
      ],
    }),
  };

  const [orders, total, counts] = await Promise.all([
    prisma.order.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE, select: orderListSelect }),
    prisma.order.count({ where }),
    prisma.order.groupBy({ by: ["status"], _count: true }),
  ]);
  const countOf = (value) => counts.find((row) => row.status === value)?._count ?? 0;

  const href = (overrides) => {
    const next = new URLSearchParams(Object.entries({ status, q, ...overrides }).filter(([, value]) => value));
    return `/admin/orders${next.size ? `?${next}` : ""}`;
  };

  const chips = [
    { href: href({ status: undefined }), label: t("shop.allChip"), count: counts.reduce((sum, row) => sum + row._count, 0), active: !status },
    ...ORDER_STATUSES.map((value) => ({ href: href({ status: value }), label: t(`orderStatus.${value}`), count: countOf(value), active: status === value })),
  ];

  return (
    <>
      <AdminHeader
        title={t("admin.nav.orders")}
        description={t("admin.orders.text")}
        actions={
          <Form className="relative w-full sm:w-72" action="/admin/orders">
            {status && <input type="hidden" name="status" value={status} />}
            <LuSearch aria-hidden className="absolute start-3.5 top-1/2 -translate-y-1/2 text-fg-muted" />
            <input
              name="q"
              type="search"
              defaultValue={q}
              placeholder={t("admin.orders.search")}
              aria-label={t("admin.orders.search")}
              className="h-10 w-full rounded-full border border-line bg-field ps-10 pe-4 text-sm outline-none transition-all focus:border-brand focus:ring-4 focus:ring-brand/15"
            />
          </Form>
        }
      />
      <div className="mb-6">
        <FilterChips items={chips} label={t("admin.orders.filter")} />
      </div>
      {orders.length === 0 ? (
        <EmptyState icon={LuSearch} title={t("admin.orders.empty")} className="glass rounded-3xl" />
      ) : (
        <>
          <OrderList orders={orders} baseHref="/admin/orders" />
          <Pagination page={page} hrefs={Array.from({ length: Math.ceil(total / PAGE_SIZE) }, (_, index) => href({ page: index + 1 > 1 ? index + 1 : undefined }))} />
        </>
      )}
    </>
  );
}
