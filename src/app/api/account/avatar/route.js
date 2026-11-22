import { fail, requireUser } from "@/lib/api";
import { AVATAR_MAX_BYTES, AVATAR_TYPES } from "@/lib/avatar";
import { prisma } from "@/lib/prisma";

/** Upload a profile picture. The browser sends an already-cropped square image as the raw body. */
export async function PUT(request) {
  const { user, response } = await requireUser();
  if (response) return response;

  const mimeType = (request.headers.get("content-type") ?? "").split(";")[0].trim();
  if (!AVATAR_TYPES.includes(mimeType)) return fail("imageType", 415);

  const data = Buffer.from(await request.arrayBuffer());
  if (data.length === 0) return fail("badRequest");
  if (data.length > AVATAR_MAX_BYTES) return fail("imageTooLarge", 413);

  try {
    await prisma.avatar.upsert({
      where: { userId: user.id },
      create: { userId: user.id, data, mimeType },
      update: { data, mimeType },
    });
    return Response.json({ success: true });
  } catch (error) {
    console.error("Avatar upload failed:", error);
    return fail("server", 500);
  }
}

export async function DELETE() {
  const { user, response } = await requireUser();
  if (response) return response;

  await prisma.avatar.deleteMany({ where: { userId: user.id } });
  return Response.json({ success: true });
}
