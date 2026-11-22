import { AdminHeader } from "@/components/admin/adminCard";
import CouponManager from "@/components/admin/couponManager";
import { pageMetadata } from "@/i18n/server";
import { getAdminContext } from "@/lib/adminData";
import { prisma } from "@/lib/prisma";

export const generateMetadata = pageMetadata("adminCoupons");

export default async function AdminCoupons({ params }) {
  const [{ t }, coupons] = await Promise.all([getAdminContext(params), prisma.coupon.findMany({ orderBy: { createdAt: "desc" } })]);
  return (
    <>
      <AdminHeader title={t("admin.nav.coupons")} description={t("admin.coupons.text")} />
      <CouponManager coupons={coupons} />
    </>
  );
}
