"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";

import Button from "@/components/ui/button";
import FormField, { PasswordField } from "@/components/ui/formField";
import { useToast } from "@/components/ui/toast";
import { useI18n } from "@/i18n/client";
import useRequest from "@/lib/useRequest";
import { validateSignup } from "@/lib/validation";

export default function SignupForm() {
  const { t } = useI18n();
  const router = useRouter();
  const toast = useToast();
  const { send } = useRequest();
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { update } = useSession();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const values = {
      name: String(form.get("name") ?? "").trim(),
      email: String(form.get("email") ?? "").trim(),
      password: String(form.get("password") ?? ""),
    };

    const fieldErrors = validateSignup(values);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;

    setLoading(true);
    const result = await send("/api/auth/register", { body: values, refresh: false });
    if (!result.ok) {
      setErrors(result.fields ?? {});
      return setLoading(false);
    }

    // Sign the new user straight in.
    await signIn("credentials", { email: values.email, password: values.password, redirect: false });
    await update(); // refresh the header's session right away
    toast({ title: t("auth.created"), description: t("auth.welcome", { name: result.user.name.split(" ")[0] }) });
    router.replace("/");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <FormField label={t("auth.name")} name="name" autoComplete="name" placeholder={t("auth.namePlaceholder")} error={errors.name} />
      <FormField label={t("common.email")} name="email" type="email" autoComplete="email" placeholder="you@example.com" error={errors.email} dir="ltr" />
      <PasswordField
        label={t("auth.password")}
        name="password"
        autoComplete="new-password"
        placeholder={t("auth.newPasswordPlaceholder")}
        hint={t("auth.passwordHint")}
        error={errors.password}
      />

      <Button type="submit" size="lg" loading={loading} className="mt-2 w-full">
        {t("auth.createAccount")}
      </Button>

      <p className="text-center text-sm text-fg-muted">
        {t("auth.haveAccount")}{" "}
        <Link href="/login" className="font-semibold text-link hover:underline">
          {t("nav.signIn")}
        </Link>
      </p>
    </form>
  );
}
