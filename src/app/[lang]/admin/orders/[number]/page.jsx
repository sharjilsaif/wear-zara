import Link from "next/link";
import { notFound } from "next/navigation";
import { LuArrowLeft } from "react-icons/lu";

import AdminCard from "@/components/admin/adminCard";
import OrderStatusControl from "@/components/admin/orderStatusControl";
import OrderDetail from "@/components/orders/orderDetail";
import Avatar from "@/components/ui/avatar";
import { getAdminContext } from "@/lib/adminData";
import { orderDetailInclude } from "@/lib/orders";
import { prisma } from "@/lib/prisma";

export async function generateMetadata({ params }) {
  return { title: (await params).number };
}

export default async function AdminOrder({ params }) {
  const { t, person } = await getAdminContext(params);
  const order = await prisma.order.findUnique({ where: { number: (await params).number }, include: orderDetailInclude });
  if (!order) notFound();

  const customer = order.user ? person(order.user) : null;

  return (
    <>
      <Link href="/admin/orders" className="mb-6 inline-flex items-center gap-1.5 text-sm text-link hover:underline">
        <LuArrowLeft className="rtl:-scale-x-100" /> {t("admin.orders.back")}
      </Link>
      <OrderDetail
        order={order}
        aside={
          <>
            <OrderStatusControl number={order.number} status={order.status} />
            <AdminCard title={t("admin.orders.customer")}>
              {customer ? (
                <Link href={`/admin/users/${customer.id}`} className="flex items-center gap-3 rounded-2xl p-1 transition-colors hover:bg-fg/4">
                  <Avatar src={customer.image} name={customer.name} />
                  <div className="min-w-0">
                    <p className="truncate font-medium">{customer.name}</p>
                    <p className="truncate text-xs text-fg-muted">{customer.email}</p>
                  </div>
                </Link>
              ) : (
                <p className="text-sm text-fg-muted">{t("admin.orders.deletedCustomer")}</p>
              )}
            </AdminCard>
          </>
        }
      />
    </>
  );
}
