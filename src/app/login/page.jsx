import { redirect } from "next/navigation";

import { auth } from "@/auth";
import AuthLayout from "@/components/auth/authLayout";
import LoginForm from "@/components/auth/loginForm";
import { safeRedirect } from "@/lib/safeRedirect";

export const metadata = {
  title: "Log In",
  description: "Log in to your Wear Zara account.",
};

export default async function LoginPage({ searchParams }) {
  const { callbackUrl } = await searchParams;
  const redirectTo = safeRedirect(callbackUrl);

  const session = await auth();
  if (session?.user) redirect(redirectTo);

  return (
    <AuthLayout title="Log in to Wear Zara" subtitle="Enter your details below">
      <LoginForm redirectTo={redirectTo} />
    </AuthLayout>
  );
}
