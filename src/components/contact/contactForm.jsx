"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

import Button from "@/components/ui/button";
import FormField from "@/components/ui/formField";
import { useToast } from "@/components/ui/toast";
import { useI18n } from "@/i18n/client";
import useRequest from "@/lib/useRequest";
import { validateContact } from "@/lib/validation";

/** Saves the message to the admin inbox (pre-filled for signed-in users). */
export default function ContactForm() {
  const { t } = useI18n();
  const toast = useToast();
  const { data: session } = useSession();
  const { send, pending } = useRequest();
  const [errors, setErrors] = useState({});

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries([...new FormData(form)].map(([key, value]) => [key, String(value).trim()]));

    const fieldErrors = validateContact(data);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;

    const result = await send("/api/contact", { body: data, refresh: false });
    if (!result.ok) return setErrors(result.fields ?? {});
    form.reset();
    toast({ title: t("contact.sent"), description: t("contact.sentText") });
  };

  return (
    <form key={session?.user?.email ?? "guest"} onSubmit={handleSubmit} noValidate className="flex h-full flex-col gap-5">
      <div className="grid gap-5 md:grid-cols-3">
        <FormField label={t("auth.name")} name="name" required autoComplete="name" placeholder={t("auth.namePlaceholder")} defaultValue={session?.user?.name ?? ""} error={errors.name} />
        <FormField label={t("common.email")} name="email" type="email" required autoComplete="email" placeholder="you@example.com" defaultValue={session?.user?.email ?? ""} error={errors.email} dir="ltr" />
        <FormField label={t("checkout.phone")} name="phone" type="tel" autoComplete="tel" placeholder={t("common.optional")} error={errors.phone} />
      </div>
      <FormField
        as="textarea"
        label={t("contact.message")}
        name="message"
        required
        rows={8}
        maxLength={2000}
        placeholder={t("contact.messagePlaceholder")}
        inputClassName="resize-none flex-1"
        className="flex flex-1 flex-col"
        error={errors.message}
      />
      <Button type="submit" size="lg" loading={pending} className="self-end">
        {t("contact.send")}
      </Button>
    </form>
  );
}
