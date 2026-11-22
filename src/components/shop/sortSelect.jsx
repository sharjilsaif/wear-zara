"use client";

import { useRouter, useSearchParams } from "next/navigation";

import Select from "@/components/ui/select";
import { useI18n } from "@/i18n/client";

export default function SortSelect({ options, value }) {
  const { t } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (sort) => {
    const params = new URLSearchParams(searchParams);
    params.set("sort", sort);
    params.delete("page");
    router.push(`/shop?${params}`, { scroll: false });
  };

  return (
    <div className="flex items-center gap-3">
      <span className="shrink-0 text-sm text-fg-muted">{t("shop.sortBy")}</span>
      <Select
        value={value}
        onChange={handleChange}
        align="end"
        buttonClassName="h-10 rounded-full py-0 text-sm font-medium"
        className="w-52"
        options={options.map((key) => ({ value: key, label: t(`shop.sort.${key}`) }))}
      />
    </div>
  );
}
