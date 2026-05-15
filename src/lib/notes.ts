import type { Note } from "@prisma/client";

export function parseTags(tagsJson: string): string[] {
  try {
    const parsed = JSON.parse(tagsJson);
    return Array.isArray(parsed) ? parsed.filter((t) => typeof t === "string") : [];
  } catch {
    return [];
  }
}

export function stringifyTags(tags: string[]) {
  return JSON.stringify(tags);
}

export function parseActionItems(json: string | null): string[] {
  if (!json) return [];
  try {
    const parsed = JSON.parse(json);
    return Array.isArray(parsed) ? parsed.filter((t) => typeof t === "string") : [];
  } catch {
    return [];
  }
}

export function formatNote(note: Note) {
  return {
    note_id: note.noteId,
    id: note.id,
    title: note.title,
    content: note.content,
    tags: parseTags(note.tags),
    category: note.category,
    archived: note.archived,
    is_public: note.isPublic,
    share_id: note.shareId,
    summary: note.summary,
    action_items: parseActionItems(note.actionItems),
    suggested_title: note.suggestedTitle,
    updated_at: note.updatedAt.toISOString(),
    created_at: note.createdAt.toISOString(),
  };
}

export function generateNoteId() {
  const num = Math.floor(100000 + Math.random() * 900000);
  return `NOTE_${num}`;
}
