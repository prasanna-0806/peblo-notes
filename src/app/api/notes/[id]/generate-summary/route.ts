import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { generateNoteInsights } from "@/lib/ai";
import { formatNote } from "@/lib/notes";
import { handleApiError, jsonError, jsonOk } from "@/lib/api";

type Params = { params: Promise<{ id: string }> };

export async function POST(_request: Request, { params }: Params) {
  try {
    const userId = await requireUser();
    const { id } = await params;

    const note = await prisma.note.findFirst({
      where: {
        userId,
        OR: [{ id }, { noteId: id }],
      },
    });
    if (!note) return jsonError("Note not found", 404);

    const ai = await generateNoteInsights(note.content, userId, note.id);

    const updated = await prisma.note.update({
      where: { id: note.id },
      data: {
        summary: ai.summary,
        actionItems: JSON.stringify(ai.action_items),
        suggestedTitle: ai.suggested_title,
      },
    });

    return jsonOk({
      ...ai,
      note: formatNote(updated),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
