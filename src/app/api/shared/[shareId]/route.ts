import { prisma } from "@/lib/prisma";
import { formatNote } from "@/lib/notes";
import { handleApiError, jsonError, jsonOk } from "@/lib/api";

type Params = { params: Promise<{ shareId: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    const { shareId } = await params;
    const note = await prisma.note.findFirst({
      where: { shareId, isPublic: true },
      include: { user: { select: { name: true } } },
    });

    if (!note) return jsonError("Shared note not found", 404);

    return jsonOk({
      note: formatNote(note),
      author: note.user.name,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
