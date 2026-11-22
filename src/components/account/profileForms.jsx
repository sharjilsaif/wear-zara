"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

import { logout } from "@/components/layout/accountMenu";
import Button from "@/components/ui/button";
import FormField, { PasswordField } from "@/components/ui/formField";
import { ConfirmDialog } from "@/components/ui/modal";
import { useI18n } from "@/i18n/client";
import useRequest from "@/lib/useRequest";
import { validateName, validatePassword, validatePhone } from "@/lib/validation";

const formData = (form) => Object.fromEntries([...new FormData(form)].map(([key, value]) => [key, String(value).trim()]));

function Card({ title, description, children }) {
  return (
    <section className="glass rounded-3xl p-6 sm:p-8">
      <h2 className="text-lg font-semibold">{title}</h2>
      {description && <p className="mt-1 text-sm text-fg-muted">{description}</p>}
      <div className="mt-6">{children}</div>
    </section>
  );
}

export function ProfileForm({ user }) {
  const { t } = useI18n();
  const { update } = useSession();
  const { send, pending } = useRequest();
  const [errors, setErrors] = useState({});

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = formData(event.currentTarget);
    const fieldErrors = Object.fromEntries(
      Object.entries({ name: validateName(data.name), phone: validatePhone(data.phone, { required: false }) }).filter(([, code]) => code),
    );
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length) return;

    const result = await send("/api/account", { method: "PATCH", body: data, success: t("account.saved") });
    if (result.ok) await update({});
    else setErrors(result.fields ?? {});
  };

  return (
    <Card title={t("account.details")} description={t("account.detailsText")}>
      <form onSubmit={handleSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
        <FormField label={t("auth.name")} name="name" defaultValue={user.name} autoComplete="name" placeholder={t("auth.namePlaceholder")} error={errors.name} />
        <FormField label={t("checkout.phone")} name="phone" type="tel" defaultValue={user.phone ?? ""} autoComplete="tel" placeholder="+92 300 1234567" error={errors.phone} dir="ltr" />
        <FormField label={t("common.email")} defaultValue={user.email} disabled hint={t("account.emailHint")} className="sm:col-span-2" dir="ltr" />
        <div className="sm:col-span-2">
          <Button type="submit" loading={pending}>
            {t("common.save")}
          </Button>
        </div>
      </form>
    </Card>
  );
}

export function PasswordForm() {
  const { t } = useI18n();
  const { send, pending } = useRequest();
  const [errors, setErrors] = useState({});

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = formData(form);
    const fieldErrors = {};
    if (!data.current) fieldErrors.current = "passwordRequired";
    const nextError = validatePassword(data.next);
    if (nextError) fieldErrors.next = nextError;
    if (!fieldErrors.next && data.next !== data.confirm) fieldErrors.confirm = "passwordMismatch";
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length) return;

    const result = await send("/api/account/password", { method: "PUT", body: data, success: t("account.passwordChanged"), refresh: false });
    if (result.ok) form.reset();
    else setErrors(result.fields ?? {});
  };

  return (
    <Card title={t("account.password")} description={t("account.passwordText")}>
      <form onSubmit={handleSubmit} noValidate className="grid gap-5 sm:grid-cols-3">
        <PasswordField label={t("account.currentPassword")} name="current" autoComplete="current-password" placeholder="••••••••" error={errors.current} />
        <PasswordField label={t("account.newPassword")} name="next" autoComplete="new-password" placeholder={t("auth.newPasswordPlaceholder")} error={errors.next} />
        <PasswordField label={t("account.confirmPassword")} name="confirm" autoComplete="new-password" placeholder={t("account.confirmPlaceholder")} error={errors.confirm} />
        <div className="sm:col-span-3">
          <Button type="submit" variant="dark" loading={pending}>
            {t("account.updatePassword")}
          </Button>
        </div>
      </form>
    </Card>
  );
}

export function DeleteAccount() {
  const { t } = useI18n();
  const { send, pending } = useRequest();
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    const result = await send("/api/account", { method: "DELETE", refresh: false });
    if (result.ok) await logout();
  };

  return (
    <Card title={t("account.deleteTitle")} description={t("account.deleteText")}>
      <Button variant="danger-soft" onClick={() => setOpen(true)}>
        {t("account.delete")}
      </Button>
      <ConfirmDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDelete}
        loading={pending}
        title={t("account.deleteConfirmTitle")}
        description={t("account.deleteConfirmText")}
        confirmLabel={t("account.delete")}
      />
    </Card>
  );
}
