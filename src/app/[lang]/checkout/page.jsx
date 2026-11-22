import { redirect } from "next/navigation";

import { auth } from "@/auth";
import CheckoutForm from "@/components/cart/checkoutForm";
import Breadcrumb from "@/components/ui/breadcrumb";
import { getI18n, pageMetadata } from "@/i18n/server";
import { prisma } from "@/lib/prisma";

export const generateMetadata = pageMetadata("checkout", { robots: { index: false } });

export default async function CheckoutPage({ params }) {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=/checkout");

  const [{ t }, user, lastOrder] = await Promise.all([
    getI18n((await params).lang),
    prisma.user.findUnique({ where: { id: session.user.id }, select: { name: true, email: true, phone: true } }),
    prisma.order.findFirst({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      select: { customerName: true, email: true, phone: true, company: true, street: true, apartment: true, city: true },
    }),
  ]);
  if (!user) redirect("/login?callbackUrl=/checkout");

  // Pre-fill from the last order, falling back to the profile.
  const defaults = {
    name: lastOrder?.customerName ?? user.name,
    email: lastOrder?.email ?? user.email,
    phone: lastOrder?.phone ?? user.phone ?? "",
    company: lastOrder?.company ?? "",
    street: lastOrder?.street ?? "",
    apartment: lastOrder?.apartment ?? "",
    city: lastOrder?.city ?? "",
  };

  return (
    <div className="container-page py-10">
      <Breadcrumb items={[{ label: t("nav.cart"), href: "/cart" }, { label: t("checkout.title") }]} />
      <CheckoutForm defaults={defaults} />
    </div>
  );
}
