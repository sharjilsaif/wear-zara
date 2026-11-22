import { redirect } from "next/navigation";

import { auth } from "@/auth";
import AvatarUploader from "@/components/account/avatarUploader";
import { DeleteAccount, PasswordForm, ProfileForm } from "@/components/account/profileForms";
import { getI18n, pageMetadata } from "@/i18n/server";
import { avatarUrl } from "@/lib/avatar";
import { prisma } from "@/lib/prisma";

export const generateMetadata = pageMetadata("account", { robots: { index: false } });

export default async function AccountPage({ params }) {
  const [{ t, format }, session] = await Promise.all([getI18n((await params).lang), auth()]);
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      createdAt: true,
      avatar: { select: { updatedAt: true } },
      _count: { select: { orders: true, wishlistItems: true } },
    },
  });
  if (!user) redirect("/login");

  const stats = [
    { label: t("account.orders"), value: format.number(user._count.orders) },
    { label: t("nav.wishlist"), value: format.number(user._count.wishlistItems) },
    { label: t("account.memberSince"), value: format.date(user.createdAt) },
  ];

  return (
    <div className="flex flex-col gap-6">
      <section className="glass rounded-3xl p-6 sm:p-8">
        <h1 className="mb-6 text-2xl sm:text-3xl font-semibold tracking-tight">{t("account.hello", { name: user.name.split(" ")[0] })}</h1>
        <AvatarUploader name={user.name} image={avatarUrl(user.id, user.avatar)} />
        <dl className="mt-8 grid grid-cols-3 gap-3">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl bg-fg/4 p-4">
              <dt className="text-xs text-fg-muted">{stat.label}</dt>
              <dd className="mt-1 truncate text-lg font-semibold">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </section>
      <ProfileForm user={user} />
      <PasswordForm />
      <DeleteAccount />
    </div>
  );
}
