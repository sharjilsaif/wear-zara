"use client";

import { useState } from "react";
import { LuSendHorizontal } from "react-icons/lu";

import Spinner from "@/components/ui/spinner";
import { useToast } from "@/components/ui/toast";
import { EMAIL_PATTERN } from "@/lib/validation";

export default function NewsletterForm() {
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!EMAIL_PATTERN.test(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }

    setError("");
    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setSubmitting(false);
    setEmail("");
    toast({ title: "You're subscribed!", description: "Use code WELCOME10 for 10% off your first order." });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="w-full max-w-64">
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <div className="flex items-center rounded-md border border-white/30 focus-within:border-white">
        <input
          id="newsletter-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Enter your email"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "newsletter-error" : undefined}
          className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm text-white outline-none placeholder:text-neutral-400"
        />
        <button
          type="submit"
          aria-label="Subscribe"
          disabled={submitting}
          className="flex h-10 w-10 items-center justify-center text-lg text-white transition-colors hover:text-neutral-300"
        >
          {submitting ? <Spinner /> : <LuSendHorizontal />}
        </button>
      </div>
      {error && (
        <p id="newsletter-error" className="mt-2 text-xs text-red-400">
          {error}
        </p>
      )}
    </form>
  );
}
