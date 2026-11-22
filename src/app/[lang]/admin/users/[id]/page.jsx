import Link from "next/link";
import { notFound } from "next/navigation";
import { LuArrowLeft } from "react-icons/lu";

import AdminCard from "@/components/admin/adminCard";
import DeleteButton from "@/components/admin/deleteButton";
import OrderList from "@/components/orders/orderList";
import ProductImage from "@/components/product/productImage";
import Avatar from "@/components/ui/avatar";
import Badge from "@/components/ui/badge";
import DateText from "@/components/ui/dateText";
import { getAdminContext } from "@/lib/adminData";
import { displayName } from "@/lib/format";
import { orderListSelect } from "@/lib/orders";
import { prisma } from "@/lib/prisma";

const productSelect = { product: { select: { id: true, name: true, price: true, imageUrl: true } } };

/** Thumbnail list for the customer's cart / wishlist. */
function ProductList({ items, empty, format }) {
  if (items.length === 0) return <p className="text-sm text-fg-muted">{empty}</p>;
  return (
    <ul className="flex flex-col gap-3">
      {items.map(({ product, quantity }) => (
        <li key={product.id}>
          <Link href={`/product/${product.id}`} className="flex items-center gap-3 hover:text-brand">
            <span className="relative h-12 w-10 shrink-0 overflow-hidden rounded-lg bg-surface">
              <ProductImage src={product.imageUrl} alt="" fill sizes="40px" className="object-cover" />
            </span>
            <span className="line-clamp-1 flex-1 text-sm">{displayName(product.name)}</span>
            <span className="text-xs text-fg-muted tabular-nums">
              {quantity ? `${quantity} × ` : ""}
              {format.price(product.price)}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default async function AdminUser({ params }) {
  const { id } = await params;
  const { t, format, person } = await getAdminContext(params);
  const record = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      createdAt: true,
      avatar: { select: { updatedAt: true } },
      orders: { orderBy: { createdAt: "desc" }, select: orderListSelect },
      cartItems: { select: { quantity: true, ...productSelect } },
      wishlistItems: { select: productSelect },
      messages: { orderBy: { createdAt: "desc" }, select: { id: true, message: true, createdAt: true } },
    },
  });
  if (!record) notFound();

  const user = person(record);
  const spent = record.orders.filter((order) => order.status !== "CANCELLED").reduce((sum, order) => sum + order.total, 0);
  const stats = [
    [t("admin.stats.orders"), format.number(record.orders.length)],
    [t("admin.users.spent"), format.price(spent)],
    [t("nav.cart"), format.number(record.cartItems.length)],
    [t("nav.wishlist"), format.number(record.wishlistItems.length)],
  ];

  return (
    <>
      <title>{user.name}</title>
      <Link href="/admin/users" className="mb-6 inline-flex items-center gap-1.5 text-sm text-link hover:underline">
        <LuArrowLeft className="rtl:-scale-x-100" /> {t("admin.users.back")}
      </Link>

      <section className="glass mb-6 flex flex-col gap-6 rounded-3xl p-6 sm:flex-row sm:items-center">
        <Avatar src={user.image} name={user.name} size="xl" />
        <div className="min-w-0 flex-1">
          <h1 className="flex flex-wrap items-center gap-2 text-2xl font-semibold tracking-tight">
            {user.name} {user.isAdmin && <Badge tone="brand">{t("admin.users.admin")}</Badge>}
          </h1>
          <p className="mt-1 text-sm text-fg-muted" dir="ltr">
            {user.email}
            {record.phone && ` · ${record.phone}`}
          </p>
          <p className="mt-1 text-xs text-fg-muted">
            {t("account.memberSince")} <DateText value={record.createdAt} />
          </p>
        </div>
        <DeleteButton
          url={`/api/admin/users/${record.id}`}
          label={t("admin.users.delete")}
          disabled={user.isAdmin}
          title={t("admin.users.deleteTitle")}
          description={t("admin.users.deleteText", { name: user.name })}
          success={t("admin.deleted")}
          redirectTo="/admin/users"
        />
      </section>

      <dl className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map(([label, value]) => (
          <div key={label} className="glass rounded-3xl p-5">
            <dt className="text-xs text-fg-muted">{label}</dt>
            <dd className="mt-1 text-xl font-semibold">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem] xl:items-start">
        <AdminCard title={t("account.orders")}>
          {record.orders.length ? <OrderList orders={record.orders} baseHref="/admin/orders" /> : <p className="text-sm text-fg-muted">{t("orders.emptyTitle")}</p>}
        </AdminCard>
        <div className="flex flex-col gap-6">
          <AdminCard title={t("nav.cart")}>
            <ProductList items={record.cartItems} empty={t("cart.emptyTitle")} format={format} />
          </AdminCard>
          <AdminCard title={t("nav.wishlist")}>
            <ProductList items={record.wishlistItems} empty={t("wishlist.emptyTitle")} format={format} />
          </AdminCard>
          <AdminCard title={t("admin.nav.messages")}>
            {record.messages.length === 0 ? (
              <p className="text-sm text-fg-muted">{t("admin.messages.empty")}</p>
            ) : (
              <ul className="flex flex-col gap-3">
                {record.messages.map((message) => (
                  <li key={message.id} className="rounded-2xl bg-fg/4 p-3 text-sm">
                    <p className="line-clamp-3">{message.message}</p>
                    <DateText value={message.createdAt} className="mt-1 block text-xs text-fg-muted" />
                  </li>
                ))}
              </ul>
            )}
          </AdminCard>
        </div>
      </div>
    </>
  );
}
