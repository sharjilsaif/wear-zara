"use client";

import { useState } from "react";
import { LuArrowRight } from "react-icons/lu";

import Spinner from "@/components/ui/spinner";
import { useToast } from "@/components/ui/toast";
import { useI18n } from "@/i18n/client";
import useRequest from "@/lib/useRequest";
import { validateEmail } from "@/lib/validation";

export default function NewsletterForm() {
  const { t } = useI18n();
  const toast = useToast();
  const { send, pending } = useRequest();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateEmail(email)) return setError(t("validation.email"));

    setError("");
    const result = await send("/api/newsletter", { body: { email }, refresh: false });
    if (!result.ok) return;
    setEmail("");
    toast(
      result.existing
        ? { type: "info", title: t("newsletter.already") }
        : { title: t("newsletter.success"), description: t("newsletter.successText") },
    );
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="w-full max-w-72">
      <label htmlFor="newsletter-email" className="sr-only">
        {t("common.email")}
      </label>
      <div className="flex items-center rounded-full border border-line bg-field p-1 ps-4 transition-all focus-within:border-brand focus-within:ring-4 focus-within:ring-brand/15">
        <input
          id="newsletter-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder={t("newsletter.placeholder")}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "newsletter-error" : undefined}
          className="min-w-0 flex-1 bg-transparent py-1.5 text-sm text-fg outline-none"
        />
        <button
          type="submit"
          aria-label={t("newsletter.submit")}
          disabled={pending}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand text-white transition-all hover:bg-brand-hover active:scale-90"
        >
          {pending ? <Spinner /> : <LuArrowRight className="rtl:-scale-x-100" />}
        </button>
      </div>
      {error && (
        <p id="newsletter-error" className="mt-2 text-xs text-sale">
          {error}
        </p>
      )}
    </form>
  );
}
