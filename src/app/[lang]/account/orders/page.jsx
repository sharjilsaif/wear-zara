import { LuPackage } from "react-icons/lu";

import { auth } from "@/auth";
import OrderList from "@/components/orders/orderList";
import Button from "@/components/ui/button";
import EmptyState from "@/components/ui/emptyState";
import { getI18n, pageMetadata } from "@/i18n/server";
import { getUserOrders } from "@/lib/orders";

export const generateMetadata = pageMetadata("orders", { robots: { index: false } });

export default async function OrdersPage({ params }) {
  const [{ t }, session] = await Promise.all([getI18n((await params).lang), auth()]);
  const orders = await getUserOrders(session.user.id);

  return (
    <>
      <h1 className="mb-6 text-3xl font-semibold tracking-tight">{t("account.orders")}</h1>
      {orders.length === 0 ? (
        <EmptyState icon={LuPackage} title={t("orders.emptyTitle")} description={t("orders.emptyText")} className="glass rounded-3xl">
          <Button href="/shop">{t("common.startShopping")}</Button>
        </EmptyState>
      ) : (
        <OrderList orders={orders} />
      )}
    </>
  );
}
