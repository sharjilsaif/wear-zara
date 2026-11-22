"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

import Button from "@/components/ui/button";
import FormField, { FormAlert, PasswordField } from "@/components/ui/formField";
import { useToast } from "@/components/ui/toast";
import { EMAIL_PATTERN } from "@/lib/validation";

export default function LoginForm({ redirectTo = "/" }) {
  const router = useRouter();
  const toast = useToast();
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");

    const nextErrors = {};
    if (!EMAIL_PATTERN.test(email)) nextErrors.email = "Please enter a valid email address.";
    if (!password) nextErrors.password = "Please enter your password.";
    setErrors(nextErrors);
    setFormError("");
    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);
    try {
      const result = await signIn("credentials", { email, password, redirect: false });
      if (!result?.ok || result.error) {
        setFormError("Incorrect email or password.");
        setLoading(false);
        return;
      }
      toast({ title: "Welcome back!" });
      router.replace(redirectTo);
      router.refresh();
    } catch {
      setFormError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <FormField label="Email" name="email" type="email" autoComplete="email" placeholder="you@example.com" error={errors.email} />
      <PasswordField label="Password" name="password" autoComplete="current-password" placeholder="Your password" error={errors.password} />

      <FormAlert>{formError}</FormAlert>

      <Button type="submit" size="lg" loading={loading} className="mt-2 w-full">
        Log In
      </Button>

      <p className="text-center text-sm text-fg-muted">
        New to Wear Zara?{" "}
        <Link href="/signup" className="font-semibold text-fg hover:text-brand">
          Create an account
        </Link>
      </p>
    </form>
  );
}
