"use client";

import { LuSearch } from "react-icons/lu";

import Button from "@/components/ui/button";
import EmptyState from "@/components/ui/emptyState";
import { useI18n } from "@/i18n/client";

export default function NotFound() {
  const { t } = useI18n();

  return (
    <div className="container-page py-10">
      <title>{t("notFound.title")}</title>
      <EmptyState icon={LuSearch} title={t("notFound.title")} description={t("notFound.text")} className="py-28">
        <Button href="/" size="lg">
          {t("common.backHome")}
        </Button>
        <Button href="/shop" size="lg" variant="secondary">
          {t("common.browseProducts")}
        </Button>
      </EmptyState>
    </div>
  );
}
