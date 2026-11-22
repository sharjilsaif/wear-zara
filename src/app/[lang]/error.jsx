"use client";

import { useEffect } from "react";
import { LuTriangleAlert } from "react-icons/lu";

import Button from "@/components/ui/button";
import EmptyState from "@/components/ui/emptyState";
import { useI18n } from "@/i18n/client";

export default function Error({ error, reset }) {
  const { t } = useI18n();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container-page py-10">
      <EmptyState icon={LuTriangleAlert} title={t("errorPage.title")} description={t("errorPage.text")} className="py-28">
        <Button onClick={reset} size="lg">
          {t("errorPage.retry")}
        </Button>
        <Button href="/" variant="secondary" size="lg">
          {t("common.backHome")}
        </Button>
      </EmptyState>
    </div>
  );
}
