"use client";

import { useId, useState } from "react";
import { LuEye, LuEyeOff } from "react-icons/lu";

import { useI18n } from "@/i18n/client";
import { cn } from "@/lib/format";

export const inputClasses =
  "w-full rounded-xl border border-line bg-field px-4 py-3 text-[15px] text-fg shadow-[inset_0_1px_2px_rgb(0_0_0/0.04)] outline-none backdrop-blur-sm transition-all duration-200 hover:border-line-strong focus:border-brand focus:bg-field-hover focus:ring-4 focus:ring-brand/15 disabled:cursor-not-allowed disabled:opacity-55";

/**
 * Label + control + hint/error, wired with ids and aria attributes.
 * `as`: "input" (default) or "textarea". `error` is a `validation.*` code. Use <Select> for dropdowns.
 */
export default function FormField({ label, error, hint, as: Control = "input", className, inputClassName, children, ...props }) {
  const { t } = useI18n();
  const id = useId();
  const message = error ? t(`validation.${error}`) : null;
  const describedBy = cn(message && `${id}-error`, hint && `${id}-hint`) || undefined;

  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="mb-2 block text-[13px] font-medium text-fg/85">
          {label}
          {props.required && <span className="text-sale"> *</span>}
        </label>
      )}
      <div className="relative">
        <Control
          id={id}
          aria-invalid={message ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            inputClasses,
            message && "border-sale/60 focus:border-sale focus:ring-sale/15",
            inputClassName,
          )}
          {...props}
        >
          {children}
        </Control>
      </div>
      {hint && !message && (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-fg-muted">
          {hint}
        </p>
      )}
      {message && (
        <p id={`${id}-error`} className="mt-1.5 animate-fade-up text-xs text-sale">
          {message}
        </p>
      )}
    </div>
  );
}

/** Form-level banner. Renders nothing without a message. */
export function FormAlert({ children, tone = "error" }) {
  if (!children) return null;
  return (
    <p
      role={tone === "error" ? "alert" : "status"}
      className={cn("animate-fade-up rounded-xl px-4 py-3 text-sm", tone === "error" ? "bg-sale-soft text-sale" : "bg-success-soft text-success")}
    >
      {children}
    </p>
  );
}

export function PasswordField(props) {
  const { t } = useI18n();
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <FormField type={visible ? "text" : "password"} inputClassName="pe-12" {...props} />
      <button
        type="button"
        onClick={() => setVisible((value) => !value)}
        aria-label={t(visible ? "common.hidePassword" : "common.showPassword")}
        className="absolute end-2 top-[34px] flex h-8 w-8 items-center justify-center rounded-full text-lg text-fg-muted transition-colors hover:bg-fg/6 hover:text-fg"
      >
        {visible ? <LuEyeOff /> : <LuEye />}
      </button>
    </div>
  );
}

/** iOS-style on/off switch. */
export function Switch({ checked, onChange, label, disabled, className }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-[26px] w-[44px] shrink-0 items-center rounded-full p-0.5 transition-colors duration-300 disabled:opacity-50",
        checked ? "bg-success" : "bg-fg/15",
        className,
      )}
    >
      <span
        className={cn(
          "h-[22px] w-[22px] rounded-full bg-white shadow-[0_2px_6px_rgb(0_0_0/0.2)] transition-transform duration-300 ease-apple",
          checked && "translate-x-[18px] rtl:-translate-x-[18px]",
        )}
      />
    </button>
  );
}
