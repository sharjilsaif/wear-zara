"use client";

import { useState } from "react";

import Button from "@/components/ui/button";
import FormField from "@/components/ui/formField";
import { useToast } from "@/components/ui/toast";
import { EMAIL_PATTERN } from "@/lib/validation";

export default function ContactForm() {
  const toast = useToast();
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(Array.from(new FormData(form).entries()).map(([key, value]) => [key, String(value).trim()]));

    const nextErrors = {};
    if (!data.name) nextErrors.name = "Please enter your name.";
    if (!EMAIL_PATTERN.test(data.email)) nextErrors.email = "Please enter a valid email address.";
    if (data.message.length < 10) nextErrors.message = "Please write at least 10 characters.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSending(true);
    await new Promise((resolve) => setTimeout(resolve, 900));
    setSending(false);
    form.reset();
    toast({ title: "Message sent", description: "Thanks for reaching out — we'll reply within 24 hours." });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex h-full flex-col gap-5">
      <div className="grid gap-5 md:grid-cols-3">
        <FormField label="Name" name="name" required autoComplete="name" error={errors.name} />
        <FormField label="Email" name="email" type="email" required autoComplete="email" error={errors.email} />
        <FormField label="Phone" name="phone" type="tel" autoComplete="tel" />
      </div>
      <FormField as="textarea" label="Message" name="message" required rows={8} inputClassName="resize-none flex-1" className="flex flex-1 flex-col" error={errors.message} />
      <Button type="submit" size="lg" loading={sending} className="self-end">
        Send Message
      </Button>
    </form>
  );
}
