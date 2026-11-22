import { requireAdmin } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export async function DELETE(request, { params }) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  await prisma.newsletterSubscriber.deleteMany({ where: { id } });
  return Response.json({ success: true });
}
