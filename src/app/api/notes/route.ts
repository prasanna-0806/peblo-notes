import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import {
  formatNote,
  generateNoteId,
  parseTags,
  stringifyTags,
} from "@/lib/notes";
import { handleApiError, jsonOk } from "@/lib/api";

const createSchema = z.object({
  title: z.string().optional(),
  content: z.string().optional(),
  tags: z.array(z.string()).optional(),
  category: z.string().nullable().optional(),
});

export async function GET(request: Request) {
  try {
    const userId = await requireUser();
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.toLowerCase();
    const tag = searchParams.get("tag")?.toLowerCase();
    const category = searchParams.get("category");
    const archived = searchParams.get("archived") === "true";
    const sort = searchParams.get("sort") || "updated";

    let notes = await prisma.note.findMany({
      where: { userId, archived },
      orderBy: { updatedAt: sort === "created" ? "asc" : "desc" },
    });

    if (q) {
      notes = notes.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q)
      );
    }
    if (tag) {
      notes = notes.filter((n) =>
        parseTags(n.tags).some((t) => t.toLowerCase() === tag)
      );
    }
    if (category) {
      notes = notes.filter((n) => n.category === category);
    }

    return jsonOk({ notes: notes.map(formatNote) });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const userId = await requireUser();
    const body = createSchema.parse(await request.json());

    const note = await prisma.note.create({
      data: {
        noteId: generateNoteId(),
        title: body.title || "Untitled",
        content: body.content || "",
        tags: stringifyTags(body.tags || []),
        category: body.category ?? null,
        userId,
      },
    });

    return jsonOk({ note: formatNote(note) }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
