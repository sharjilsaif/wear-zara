import { prisma } from "@/lib/prisma";

/** Serves a profile picture. URLs carry ?v=<timestamp>, so versioned requests can be cached forever. */
export async function GET(request, { params }) {
  const { userId } = await params;
  const avatar = await prisma.avatar.findUnique({ where: { userId }, select: { data: true, mimeType: true } });
  if (!avatar) return new Response("Not found", { status: 404 });

  const versioned = new URL(request.url).searchParams.has("v");
  return new Response(avatar.data, {
    headers: {
      "Content-Type": avatar.mimeType,
      "Cache-Control": versioned ? "public, max-age=31536000, immutable" : "public, max-age=60",
    },
  });
}
