import Link from "next/link";
import { notFound } from "next/navigation";
import { LuArrowLeft } from "react-icons/lu";

import { auth } from "@/auth";
import CancelOrderButton from "@/components/orders/cancelOrderButton";
import OrderDetail from "@/components/orders/orderDetail";
import { getI18n } from "@/i18n/server";
import { CANCELLABLE, getUserOrder } from "@/lib/orders";

export async function generateMetadata({ params }) {
  const { number } = await params;
  return { title: number, robots: { index: false } };
}

export default async function OrderPage({ params }) {
  const { lang, number } = await params;
  const [{ t }, session] = await Promise.all([getI18n(lang), auth()]);
  const order = await getUserOrder(session.user.id, number);
  if (!order) notFound();

  return (
    <>
      <Link href="/account/orders" className="mb-6 inline-flex items-center gap-1.5 text-sm text-link hover:underline">
        <LuArrowLeft className="rtl:-scale-x-100" /> {t("orders.back")}
      </Link>
      <OrderDetail order={order} actions={CANCELLABLE.includes(order.status) && <CancelOrderButton number={order.number} />} />
    </>
  );
}
