import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

/** Deletes the signed-in user's account. */
export async function DELETE() {
  const session = await auth();
  if (!session?.user?.email) {
    return Response.json({ error: "Not authenticated." }, { status: 401 });
  }

  try {
    await prisma.user.delete({ where: { email: session.user.email } });
    return Response.json({ success: true });
  } catch (error) {
    if (error?.code === "P2025") {
      return Response.json({ error: "Account not found." }, { status: 404 });
    }
    console.error("Delete account failed:", error);
    return Response.json({ error: "Could not delete account." }, { status: 500 });
  }
}
