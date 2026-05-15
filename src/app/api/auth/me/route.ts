import { getSessionUserId } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { handleApiError, jsonError, jsonOk } from "@/lib/api";

export async function GET() {
  try {
    const userId = await getSessionUserId();
    if (!userId) return jsonError("Unauthorized", 401);

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return jsonError("Unauthorized", 401);

    return jsonOk({
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
