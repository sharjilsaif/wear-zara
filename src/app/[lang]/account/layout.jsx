import { redirect } from "next/navigation";

import { auth } from "@/auth";
import Breadcrumb from "@/components/ui/breadcrumb";
import SideNav from "@/components/ui/sideNav";
import { getI18n } from "@/i18n/server";

const NAV = [
  { href: "/account", key: "account.profile", icon: "user", exact: true },
  { href: "/account/orders", key: "account.orders", icon: "package" },
  { href: "/wishlist", key: "nav.wishlist", icon: "heart" },
];

export default async function AccountLayout({ children, params }) {
  const [{ t }, session] = await Promise.all([getI18n((await params).lang), auth()]);
  if (!session?.user) redirect("/login?callbackUrl=/account");

  // Admins only manage their profile here; orders and wishlist are for shoppers.
  const nav = session.user.isAdmin ? [NAV[0], { href: "/admin", key: "admin.title", icon: "dashboard" }] : NAV;

  return (
    <div className="container-page py-10">
      <Breadcrumb items={[{ label: t("account.title") }]} />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[15rem_minmax(0,1fr)] lg:items-start">
        <SideNav items={nav} label={t("account.title")} />
        <div className="min-w-0 animate-fade-up">{children}</div>
      </div>
    </div>
  );
}
