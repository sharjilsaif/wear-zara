"use client";

import { useId, useState } from "react";
import { BiHide, BiShow } from "react-icons/bi";

import { cn } from "@/lib/format";

export const inputClasses =
  "w-full rounded-lg border bg-surface-muted px-4 py-3 text-sm text-fg outline-none transition-colors duration-200 placeholder:text-fg-muted/70 focus:border-fg/40 focus:bg-surface disabled:opacity-60";

/**
 * Label + control + error message, wired up with ids and aria attributes.
 * `as` can be "input" (default), "textarea" or "select".
 */
export default function FormField({ label, error, hint, as: Control = "input", className, inputClassName, children, ...props }) {
  const id = useId();
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="mb-2 block text-sm font-medium">
          {label}
          {props.required && <span className="text-brand"> *</span>}
        </label>
      )}
      <Control
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={cn(error && errorId, hint && hintId) || undefined}
        className={cn(inputClasses, error ? "border-red-400" : "border-line", inputClassName)}
        {...props}
      >
        {children}
      </Control>
      {hint && !error && (
        <p id={hintId} className="mt-1.5 text-xs text-fg-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="mt-1.5 text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}

/** Form-level error banner (e.g. "Incorrect email or password"). Renders nothing without a message. */
export function FormAlert({ children }) {
  if (!children) return null;
  return (
    <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400">
      {children}
    </p>
  );
}

export function PasswordField(props) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <FormField type={visible ? "text" : "password"} inputClassName="pr-12" {...props} />
      <button
        type="button"
        onClick={() => setVisible((value) => !value)}
        aria-label={visible ? "Hide password" : "Show password"}
        className="absolute right-2 top-8.5 flex h-8 w-8 items-center justify-center rounded-full text-lg text-fg-muted transition-colors hover:text-fg"
      >
        {visible ? <BiHide /> : <BiShow />}
      </button>
    </div>
  );
}
