"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { inputClasses } from "@/components/ui/formField";
import { cn } from "@/lib/format";

export default function SortSelect({ options, value }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleChange = (event) => {
    const params = new URLSearchParams(searchParams);
    params.set("sort", event.target.value);
    params.delete("page");
    router.push(`${pathname}?${params}`, { scroll: false });
  };

  return (
    <div className="flex items-center gap-3">
      <label htmlFor="sort" className="shrink-0 text-sm text-fg-muted">
        Sort by
      </label>
      <select id="sort" value={value} onChange={handleChange} className={cn(inputClasses, "w-auto border-line py-2 pr-8")}>
        {Object.entries(options).map(([key, label]) => (
          <option key={key} value={key}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}
