import { redirect } from "next/navigation";

import { auth } from "@/auth";
import AuthLayout from "@/components/auth/authLayout";
import LoginForm from "@/components/auth/loginForm";
import { getI18n, pageMetadata } from "@/i18n/server";
import { safeRedirect } from "@/lib/safeRedirect";

export const generateMetadata = pageMetadata("login");

export default async function LoginPage({ params, searchParams }) {
  const [{ t }, { callbackUrl }, session] = await Promise.all([getI18n((await params).lang), searchParams, auth()]);
  const redirectTo = safeRedirect(callbackUrl);
  if (session?.user) redirect(redirectTo);

  return (
    <AuthLayout title={t("auth.loginTitle")} subtitle={t(redirectTo.startsWith("/checkout") ? "auth.checkoutHint" : "auth.loginSubtitle")}>
      <LoginForm redirectTo={redirectTo} />
    </AuthLayout>
  );
}
