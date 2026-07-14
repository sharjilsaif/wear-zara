import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE() {
  const session = await auth();

  if (!session?.user?.email) {
    return Response.json(
      {
        success: false,
        message: "Not authenticated",
      },
      {
        status: 401,
      }
    );
  }

  await prisma.user.delete({
    where: {
      email: session.user.email,
    },
  });

  return Response.json({
    success: true,
    message: "Account deleted",
  });
}