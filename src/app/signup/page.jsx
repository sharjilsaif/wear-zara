import { redirect } from "next/navigation";

import { auth } from "@/auth";
import AuthLayout from "@/components/auth/authLayout";
import SignupForm from "@/components/auth/signupForm";

export const metadata = {
  title: "Create an Account",
  description: "Join Wear Zara to save your wishlist and check out faster.",
};

export default async function SignupPage() {
  const session = await auth();
  if (session?.user) redirect("/");

  return (
    <AuthLayout title="Create an account" subtitle="Enter your details below">
      <SignupForm />
    </AuthLayout>
  );
}
