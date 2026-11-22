import { LuCircleCheck } from "react-icons/lu";

import { auth } from "@/auth";
import OrderDetail from "@/components/orders/orderDetail";
import Button from "@/components/ui/button";
import EmptyState from "@/components/ui/emptyState";
import { getI18n, pageMetadata } from "@/i18n/server";
import { getUserOrder } from "@/lib/orders";

export const generateMetadata = pageMetadata("orderConfirmed", { robots: { index: false } });

export default async function OrderSuccessPage({ params, searchParams }) {
  const [{ t }, { order: number }, session] = await Promise.all([getI18n((await params).lang), searchParams, auth()]);
  const order = typeof number === "string" ? await getUserOrder(session?.user?.id, number) : null;

  return (
    <div className="container-page py-10">
      <EmptyState icon={LuCircleCheck} title={t("success.title")} description={order ? t("success.text", { number: order.number }) : t("success.generic")} className="pt-10 pb-12">
        {order && <Button href={`/account/orders/${order.number}`}>{t("success.track")}</Button>}
        <Button href="/shop" variant="secondary">
          {t("common.continueShopping")}
        </Button>
      </EmptyState>
      {order && <OrderDetail order={order} />}
    </div>
  );
}
