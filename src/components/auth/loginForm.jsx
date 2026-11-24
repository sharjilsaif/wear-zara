"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";

import Button from "@/components/ui/button";
import FormField, { FormAlert, PasswordField } from "@/components/ui/formField";
import { useToast } from "@/components/ui/toast";
import { useI18n } from "@/i18n/client";
import { validateEmail } from "@/lib/validation";

export default function LoginForm({ redirectTo = "/" }) {
  const { t } = useI18n();
  const router = useRouter();
  const toast = useToast();
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const { update } = useSession();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");

    const fieldErrors = {};
    if (validateEmail(email)) fieldErrors.email = "email";
    if (!password) fieldErrors.password = "passwordRequired";
    setErrors(fieldErrors);
    setFormError("");
    if (Object.keys(fieldErrors).length > 0) return;

    setLoading(true);
    try {
      const result = await signIn("credentials", { email, password, redirect: false });
      if (!result?.ok || result.error) throw new Error("invalid");
      // update() (not getSession) also refreshes the header's session, so it switches to the signed-in view at once.
      const user = (await update())?.user;
      const firstName = user?.name?.trim().split(/\s+/)[0];
      toast({ title: user?.isAdmin ? t("auth.welcomeAdmin") : firstName ? t("auth.welcomeBackName", { name: firstName }) : t("auth.welcomeBack") });
      router.replace(redirectTo);
      router.refresh();
    } catch (error) {
      setFormError(t(error.message === "invalid" ? "auth.invalid" : "errors.server"));
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <FormField label={t("common.email")} name="email" type="email" autoComplete="email" placeholder="you@example.com" error={errors.email} dir="ltr" />
      <PasswordField label={t("auth.password")} name="password" autoComplete="current-password" placeholder={t("auth.passwordPlaceholder")} error={errors.password} />

      <FormAlert>{formError}</FormAlert>

      <Button type="submit" size="lg" loading={loading} className="mt-2 w-full">
        {t("nav.signIn")}
      </Button>

      <p className="text-center text-sm text-fg-muted">
        {t("auth.newHere")}{" "}
        <Link href="/signup" className="font-semibold text-link hover:underline">
          {t("auth.createAccount")}
        </Link>
      </p>
    </form>
  );
}
