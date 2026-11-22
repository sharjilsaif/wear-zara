import { redirect } from "next/navigation";

import { auth } from "@/auth";
import AuthLayout from "@/components/auth/authLayout";
import SignupForm from "@/components/auth/signupForm";
import { getI18n, pageMetadata } from "@/i18n/server";

export const generateMetadata = pageMetadata("signup");

export default async function SignupPage({ params }) {
  const [{ t }, session] = await Promise.all([getI18n((await params).lang), auth()]);
  if (session?.user) redirect("/");

  return (
    <AuthLayout title={t("auth.signupTitle")} subtitle={t("auth.signupSubtitle")}>
      <SignupForm />
    </AuthLayout>
  );
}
