import { AdminHeader } from "@/components/admin/adminCard";
import SubscriberList from "@/components/admin/subscriberList";
import { pageMetadata } from "@/i18n/server";
import { getAdminContext } from "@/lib/adminData";
import { prisma } from "@/lib/prisma";

export const generateMetadata = pageMetadata("adminSubscribers");

export default async function AdminSubscribers({ params }) {
  const [{ t }, subscribers] = await Promise.all([
    getAdminContext(params),
    prisma.newsletterSubscriber.findMany({ orderBy: { createdAt: "desc" } }),
  ]);
  return (
    <>
      <AdminHeader title={t("admin.nav.subscribers")} description={t("admin.subscribers.text")} />
      <SubscriberList subscribers={subscribers} />
    </>
  );
}
