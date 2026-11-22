"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { FaStar } from "react-icons/fa6";

import DeleteButton from "@/components/admin/deleteButton";
import Avatar from "@/components/ui/avatar";
import Button from "@/components/ui/button";
import DateText from "@/components/ui/dateText";
import FormField from "@/components/ui/formField";
import Stars from "@/components/ui/stars";
import { useI18n } from "@/i18n/client";
import { cn } from "@/lib/format";
import useRequest from "@/lib/useRequest";

function StarPicker({ value, onChange }) {
  const { t } = useI18n();
  const [hover, setHover] = useState(0);
  return (
    <div role="radiogroup" aria-label={t("reviews.rating")} className="flex gap-1" onPointerLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          role="radio"
          aria-checked={value === star}
          aria-label={t("product.rated", { value: star })}
          onPointerEnter={() => setHover(star)}
          onClick={() => onChange(star)}
          className="p-0.5 transition-transform hover:scale-110"
        >
          <FaStar className={cn("text-2xl transition-colors", star <= (hover || value) ? "text-amber-400" : "text-fg/15")} />
        </button>
      ))}
    </div>
  );
}

function ReviewForm({ productId }) {
  const { t } = useI18n();
  const { send, pending } = useRequest();
  const [rating, setRating] = useState(5);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    const result = await send("/api/reviews", { body: { ...data, productId, rating }, success: t("reviews.thanks") });
    setErrors(result.fields ?? {});
    if (result.ok) form.reset();
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="glass flex flex-col gap-4 rounded-3xl p-6">
      <h3 className="font-semibold">{t("reviews.write")}</h3>
      <StarPicker value={rating} onChange={setRating} />
      <FormField label={t("reviews.titleLabel")} name="title" maxLength={80} placeholder={t("reviews.titlePlaceholder")} />
      <FormField as="textarea" label={t("reviews.body")} name="body" required rows={4} maxLength={1000} placeholder={t("reviews.bodyPlaceholder")} inputClassName="resize-none" error={errors.body} />
      <Button type="submit" loading={pending} className="self-start">
        {t("reviews.submit")}
      </Button>
    </form>
  );
}

/** Rating summary, the review list and (for signed-in customers who haven't reviewed yet) the form.
 *  The viewer comes from the client session, so the product page itself stays statically cached. */
export default function Reviews({ productId, rating, count, reviews }) {
  const { t, format } = useI18n();
  const viewer = useSession().data?.user;
  const reviewed = viewer && reviews.some((review) => review.userId === viewer.id);

  return (
    <section id="reviews" className="mt-24 scroll-mt-28">
      <h2 className="mb-8 text-3xl font-semibold tracking-tight sm:text-4xl">{t("reviews.title")}</h2>
      <div className="grid gap-8 lg:grid-cols-[20rem_minmax(0,1fr)] lg:items-start">
        <div className="flex flex-col gap-4 lg:sticky lg:top-28">
          <div className="glass rounded-3xl p-6">
            <p className="text-5xl font-semibold tracking-tight">{format.number(rating)}</p>
            <Stars rating={rating} className="mt-2" />
            <p className="mt-2 text-sm text-fg-muted">{t("reviews.count", { count })}</p>
          </div>
          {!viewer ? (
            <p className="glass rounded-3xl p-6 text-sm text-fg-muted">
              <Link href={`/login?callbackUrl=/product/${productId}`} className="font-semibold text-link hover:underline">
                {t("nav.signIn")}
              </Link>{" "}
              {t("reviews.signIn")}
            </p>
          ) : reviewed ? (
            <p className="glass rounded-3xl p-6 text-sm text-fg-muted">{t("reviews.alreadyReviewed")}</p>
          ) : (
            <ReviewForm productId={productId} />
          )}
        </div>

        {reviews.length === 0 ? (
          <p className="glass rounded-3xl p-8 text-center text-sm text-fg-muted">{t("reviews.empty")}</p>
        ) : (
          <ul className="flex flex-col gap-4">
            {reviews.map((review) => (
              <li key={review.id} className="glass rounded-3xl p-6">
                <div className="flex items-center gap-3">
                  <Avatar src={review.image} name={review.name} />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{review.name}</p>
                    <DateText value={review.createdAt} className="text-xs text-fg-muted" />
                  </div>
                  {(viewer?.isAdmin || viewer?.id === review.userId) && (
                    <DeleteButton url={`/api/reviews/${review.id}`} title={t("reviews.deleteTitle")} description={t("reviews.deleteText")} success={t("admin.deleted")} />
                  )}
                </div>
                <Stars rating={review.rating} className="mt-4" />
                {review.title && <p className="mt-2 font-semibold">{review.title}</p>}
                <p className="mt-1 whitespace-pre-line text-[15px] leading-7 text-fg-muted">{review.body}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
