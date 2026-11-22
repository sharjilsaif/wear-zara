"use client";

import { useState } from "react";

import AdminCard from "@/components/admin/adminCard";
import DeleteButton from "@/components/admin/deleteButton";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import DateText from "@/components/ui/dateText";
import FormField, { Switch } from "@/components/ui/formField";
import Select from "@/components/ui/select";
import { useI18n } from "@/i18n/client";
import useRequest from "@/lib/useRequest";

const EMPTY = { code: "", description: "", type: "PERCENT", value: "", minSubtotal: "", maxUses: "", expiresAt: "" };

function CouponRow({ coupon }) {
  const { t, format } = useI18n();
  const { send } = useRequest();
  const [active, setActive] = useState(coupon.active);
  const expired = coupon.expiresAt && new Date(coupon.expiresAt) < new Date();

  // Optimistic: flip instantly, save in the background, flip back only if the save fails.
  const toggle = async (next) => {
    setActive(next);
    const { ok } = await send(`/api/admin/coupons/${coupon.id}`, { method: "PATCH", body: { active: next }, refresh: false, success: t(next ? "admin.coupons.enabled" : "admin.coupons.disabled") });
    if (!ok) setActive(!next);
  };
  const usedUp = coupon.maxUses != null && coupon.usedCount >= coupon.maxUses;

  // One self-contained row: wraps on narrow screens instead of scrolling sideways like a table.
  return (
    <li className="flex items-center gap-4 py-4">
      <div className="min-w-0 flex-1">
        <p className="flex flex-wrap items-baseline gap-x-2">
          <span className="font-semibold" dir="ltr">{coupon.code}</span>
          <span className="text-sm font-medium text-brand">{coupon.type === "PERCENT" ? `${coupon.value}%` : format.price(coupon.value)}</span>
        </p>
        {coupon.description && <p className="truncate text-xs text-fg-muted">{coupon.description}</p>}
        <p className="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-fg-muted">
          {coupon.minSubtotal > 0 && <span>{t("admin.coupons.minShort", { amount: format.price(coupon.minSubtotal) })}</span>}
          <span className="tabular-nums">
            {t("admin.coupons.uses")}: {coupon.usedCount}
            {coupon.maxUses != null && ` / ${coupon.maxUses}`}
          </span>
          <span>
            {t("admin.coupons.expires")}: {coupon.expiresAt ? <DateText value={coupon.expiresAt} /> : t("admin.coupons.never")}
          </span>
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        {expired ? <Badge tone="danger">{t("admin.coupons.expired")}</Badge> : usedUp ? <Badge tone="warning">{t("admin.coupons.usedUp")}</Badge> : (
          <Switch checked={active} label={t("admin.coupons.active")} onChange={toggle} />
        )}
        <DeleteButton
          url={`/api/admin/coupons/${coupon.id}`}
          title={t("admin.coupons.deleteTitle")}
          description={t("admin.coupons.deleteText", { code: coupon.code })}
          success={t("admin.deleted")}
        />
      </div>
    </li>
  );
}

export default function CouponManager({ coupons }) {
  const { t } = useI18n();
  const { send, pending } = useRequest();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const field = (name) => ({ name, value: form[name], error: errors[name], onChange: (event) => setForm({ ...form, [name]: event.target.value }) });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const result = await send("/api/admin/coupons", { body: form, success: t("admin.coupons.created") });
    setErrors(result.fields ?? {});
    if (result.ok) setForm(EMPTY);
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[22rem_minmax(0,1fr)] xl:items-start">
      <AdminCard title={t("admin.coupons.new")} description={t("admin.coupons.newText")}>
        <form onSubmit={handleSubmit} noValidate className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
          <FormField label={t("admin.coupons.code")} required placeholder="SUMMER25" inputClassName="uppercase placeholder:normal-case" maxLength={20} dir="ltr" {...field("code")} />
          <FormField label={t("admin.coupons.description")} placeholder={t("admin.coupons.descriptionPlaceholder")} maxLength={120} {...field("description")} />
          <Select
            label={t("admin.coupons.type")}
            value={form.type}
            onChange={(type) => setForm({ ...form, type })}
            options={[
              { value: "PERCENT", label: t("admin.coupons.percent") },
              { value: "FIXED", label: t("admin.coupons.fixed") },
            ]}
          />
          <FormField label={t(form.type === "PERCENT" ? "admin.coupons.valuePercent" : "admin.coupons.valueFixed")} required type="number" min="1" step="0.01" placeholder={form.type === "PERCENT" ? "15" : "10.00"} dir="ltr" {...field("value")} />
          <FormField label={t("admin.coupons.minSubtotal")} type="number" min="0" step="0.01" placeholder="0" dir="ltr" {...field("minSubtotal")} />
          <FormField label={t("admin.coupons.maxUses")} type="number" min="1" placeholder={t("admin.coupons.unlimited")} dir="ltr" {...field("maxUses")} />
          <FormField label={t("admin.coupons.expires")} type="date" hint={t("admin.coupons.expiresHint")} className="sm:col-span-2 xl:col-span-1" {...field("expiresAt")} />
          <Button type="submit" loading={pending} className="sm:col-span-2 xl:col-span-1">
            {t("admin.coupons.create")}
          </Button>
        </form>
      </AdminCard>

      <AdminCard title={t("admin.coupons.all", { count: coupons.length })}>
        {coupons.length === 0 ? (
          <p className="py-10 text-center text-sm text-fg-muted">{t("admin.coupons.empty")}</p>
        ) : (
          <ul className="-mt-2 divide-y divide-line">
            {coupons.map((coupon) => (
              <CouponRow key={coupon.id} coupon={coupon} />
            ))}
          </ul>
        )}
      </AdminCard>
    </div>
  );
}
