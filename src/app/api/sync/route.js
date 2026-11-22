import { fail, readJson, requireUser } from "@/lib/api";
import { getUserLists, mergeUserLists } from "@/lib/userLists";

/**
 * POST { mode: "merge", cart, wishlist } — first sync after logging in on this device.
 * POST { mode: "pull" } — just fetch the saved cart and wishlist.
 */
export async function POST(request) {
  const { user, response } = await requireUser();
  if (response) return response;

  const body = (await readJson(request)) ?? {};
  try {
    if (body.mode === "merge") {
      await mergeUserLists(user.id, {
        cart: Array.isArray(body.cart) ? body.cart : [],
        wishlist: Array.isArray(body.wishlist) ? body.wishlist : [],
      });
    }
    return Response.json(await getUserLists(user.id));
  } catch (error) {
    if (error?.code === "P2003") return fail("unauthorized", 401);
    console.error("Sync failed:", error);
    return fail("server", 500);
  }
}
