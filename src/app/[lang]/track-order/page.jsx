import TrackOrderForm from "@/components/orders/trackOrderForm";
import Breadcrumb from "@/components/ui/breadcrumb";
import SectionHeader from "@/components/ui/sectionHeader";
import { getI18n } from "@/i18n/server";

export async function generateMetadata({ params }) {
  const { t } = await getI18n((await params).lang);
  return { title: t("pages.trackOrder.title"), description: t("pages.trackOrder.description") };
}

export default async function TrackOrderPage({ params }) {
  const { t } = await getI18n((await params).lang);

  return (
    <div className="container-page max-w-4xl py-10">
      <Breadcrumb items={[{ label: t("pages.trackOrder.title") }]} />
      <SectionHeader as="h1" eyebrow={t("footer.help")} title={t("pages.trackOrder.title")} />
      <p className="-mt-4 mb-8 text-[17px] leading-8 text-fg-muted">{t("pages.trackOrder.intro")}</p>
      <TrackOrderForm />
    </div>
  );
}
