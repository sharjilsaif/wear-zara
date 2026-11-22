"use client";

import { useId } from "react";
import { useRouter } from "next/navigation";
import { LuSearch } from "react-icons/lu";

import { useI18n } from "@/i18n/client";
import { cn } from "@/lib/format";

/** Product search used in the navbar (desktop) and the mobile menu. */
export default function SearchForm({ className, onSearch }) {
  const { t } = useI18n();
  const router = useRouter();
  const id = useId();

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const q = new FormData(form).get("q")?.toString().trim();
    router.push(q ? `/shop?q=${encodeURIComponent(q)}` : "/shop");
    form.reset();
    onSearch?.();
  };

  return (
    <form role="search" onSubmit={handleSubmit} className={cn("relative", className)}>
      <label htmlFor={id} className="sr-only">
        {t("search.label")}
      </label>
      <button type="submit" aria-label={t("search.submit")} className="absolute start-1 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-fg-muted transition-colors hover:text-fg">
        <LuSearch />
      </button>
      <input
        id={id}
        name="q"
        type="search"
        enterKeyHint="search"
        placeholder={t("search.placeholder")}
        className="h-10 w-full rounded-full border border-transparent bg-fg/6 ps-10 pe-4 text-sm text-fg outline-none transition-all duration-200 hover:bg-fg/8 focus:border-brand focus:bg-field-hover focus:ring-4 focus:ring-brand/15"
      />
    </form>
  );
}
