"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

import Button from "@/components/ui/button";
import FormField, { FormAlert, PasswordField } from "@/components/ui/formField";
import { useToast } from "@/components/ui/toast";
import { validateSignup } from "@/lib/validation";

export default function SignupForm() {
  const router = useRouter();
  const toast = useToast();
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const values = {
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? "").trim(),
      password: String(form.get("password") ?? ""),
    };

    const nextErrors = validateSignup(values);
    setErrors(nextErrors);
    setFormError("");
    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setErrors(data.errors ?? {});
        setFormError(data.errors ? "" : data.error ?? "Could not create your account.");
        setLoading(false);
        return;
      }

      // Sign the new user straight in.
      await signIn("credentials", { email: values.email, password: values.password, redirect: false });
      toast({ title: "Account created", description: `Welcome to Wear Zara, ${data.user.name.split(" ")[0]}!` });
      router.replace("/");
      router.refresh();
    } catch {
      setFormError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <FormField label="Name" name="name" autoComplete="name" placeholder="Your full name" error={errors.name} />
      <FormField label="Email" name="email" type="email" autoComplete="email" placeholder="you@example.com" error={errors.email} />
      <PasswordField
        label="Password"
        name="password"
        autoComplete="new-password"
        placeholder="At least 8 characters"
        hint="Use 8+ characters with at least one letter and one number."
        error={errors.password}
      />

      <FormAlert>{formError}</FormAlert>

      <Button type="submit" size="lg" loading={loading} className="mt-2 w-full">
        Create Account
      </Button>

      <p className="text-center text-sm text-fg-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-fg hover:text-brand">
          Log in
        </Link>
      </p>
    </form>
  );
}
