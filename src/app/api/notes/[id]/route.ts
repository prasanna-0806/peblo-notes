import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { formatNote, stringifyTags } from "@/lib/notes";
import { handleApiError, jsonError, jsonOk } from "@/lib/api";
import { nanoid } from "nanoid";

const patchSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  tags: z.array(z.string()).optional(),
  category: z.string().nullable().optional(),
  archived: z.boolean().optional(),
  is_public: z.boolean().optional(),
});

type Params = { params: Promise<{ id: string }> };

async function getOwnedNote(id: string, userId: string) {
  return prisma.note.findFirst({
    where: {
      userId,
      OR: [{ id }, { noteId: id }],
    },
  });
}

export async function GET(_request: Request, { params }: Params) {
  try {
    const userId = await requireUser();
    const { id } = await params;
    const note = await getOwnedNote(id, userId);
    if (!note) return jsonError("Note not found", 404);
    return jsonOk({ note: formatNote(note) });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const userId = await requireUser();
    const { id } = await params;
    const body = patchSchema.parse(await request.json());

    const existing = await getOwnedNote(id, userId);
    if (!existing) return jsonError("Note not found", 404);

    let shareId = existing.shareId;
    if (body.is_public === true && !shareId) {
      shareId = nanoid(12);
    }
    if (body.is_public === false) {
      shareId = null;
    }

    const note = await prisma.note.update({
      where: { id: existing.id },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.content !== undefined && { content: body.content }),
        ...(body.tags !== undefined && { tags: stringifyTags(body.tags) }),
        ...(body.category !== undefined && { category: body.category }),
        ...(body.archived !== undefined && { archived: body.archived }),
        ...(body.is_public !== undefined && {
          isPublic: body.is_public,
          shareId,
        }),
      },
    });

    return jsonOk({ note: formatNote(note) });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const userId = await requireUser();
    const { id } = await params;
    const existing = await getOwnedNote(id, userId);
    if (!existing) return jsonError("Note not found", 404);

    await prisma.note.delete({ where: { id: existing.id } });
    return jsonOk({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
