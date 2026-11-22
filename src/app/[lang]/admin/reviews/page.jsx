import Link from "next/link";
import { LuMessageSquareText } from "react-icons/lu";

import AdminCard, { AdminHeader } from "@/components/admin/adminCard";
import DeleteButton from "@/components/admin/deleteButton";
import Avatar from "@/components/ui/avatar";
import DateText from "@/components/ui/dateText";
import EmptyState from "@/components/ui/emptyState";
import Stars from "@/components/ui/stars";
import { pageMetadata } from "@/i18n/server";
import { getAdminContext } from "@/lib/adminData";
import { displayName } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export const generateMetadata = pageMetadata("adminReviews");

export default async function AdminReviews({ params }) {
  const [{ t, person }, reviews] = await Promise.all([
    getAdminContext(params),
    prisma.review.findMany({
      orderBy: { createdAt: "desc" },
      take: 200,
      select: {
        id: true,
        rating: true,
        title: true,
        body: true,
        createdAt: true,
        product: { select: { id: true, name: true } },
        user: { select: { id: true, name: true, email: true, avatar: { select: { updatedAt: true } } } },
      },
    }),
  ]);

  return (
    <>
      <AdminHeader title={t("admin.nav.reviews")} description={t("admin.reviews.text")} />
      {reviews.length === 0 ? (
        <EmptyState icon={LuMessageSquareText} title={t("admin.reviews.empty")} className="glass rounded-3xl" />
      ) : (
        <AdminCard title={t("admin.reviews.all", { count: reviews.length })}>
          <ul className="-my-4 divide-y divide-line">
            {reviews.map((review) => {
              const author = person(review.user);
              return (
                <li key={review.id} className="flex gap-4 py-4">
                  <Link href={`/admin/users/${author.id}`}>
                    <Avatar src={author.image} name={author.name} />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                      <Link href={`/admin/users/${author.id}`} className="font-medium hover:text-brand">
                        {author.name}
                      </Link>
                      <Stars rating={review.rating} />
                      <DateText value={review.createdAt} className="text-xs text-fg-muted" />
                    </div>
                    <Link href={`/product/${review.product.id}#reviews`} className="mt-1 block text-xs text-link hover:underline">
                      {displayName(review.product.name)}
                    </Link>
                    {review.title && <p className="mt-2 text-sm font-semibold">{review.title}</p>}
                    <p className="mt-1 text-sm text-fg-muted">{review.body}</p>
                  </div>
                  <DeleteButton url={`/api/reviews/${review.id}`} title={t("reviews.deleteTitle")} description={t("reviews.deleteText")} success={t("admin.deleted")} />
                </li>
              );
            })}
          </ul>
        </AdminCard>
      )}
    </>
  );
}
