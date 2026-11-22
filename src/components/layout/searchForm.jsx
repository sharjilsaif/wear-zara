"use client";

import { useId } from "react";
import { useRouter } from "next/navigation";
import { FiSearch } from "react-icons/fi";

import { cn } from "@/lib/format";

/** Product search used in the navbar (desktop and mobile menu). */
export default function SearchForm({ className, onSearch }) {
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
        Search products
      </label>
      <input
        id={id}
        name="q"
        type="search"
        placeholder="What are you looking for?"
        className="h-10 w-full rounded-full border border-line bg-surface-muted pl-4 pr-11 text-sm text-fg outline-none transition-colors placeholder:text-fg-muted focus:border-fg/40"
      />
      <button
        type="submit"
        aria-label="Search"
        className="absolute right-1 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-lg text-fg transition-colors hover:bg-line"
      >
        <FiSearch />
      </button>
    </form>
  );
}
