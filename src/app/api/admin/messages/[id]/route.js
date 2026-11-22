import { readJson, requireAdmin } from "@/lib/api";
import { prisma } from "@/lib/prisma";

/** PATCH { read } marks a message read / unread. */
export async function PATCH(request, { params }) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  const body = await readJson(request);
  await prisma.contactMessage.updateMany({ where: { id }, data: { read: Boolean(body?.read) } });
  return Response.json({ success: true });
}

export async function DELETE(request, { params }) {
  const { response } = await requireAdmin();
  if (response) return response;

  const { id } = await params;
  await prisma.contactMessage.deleteMany({ where: { id } });
  return Response.json({ success: true });
}
