import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { parseTags, formatNote } from "@/lib/notes";
import { handleApiError, jsonOk } from "@/lib/api";

export async function GET() {
  try {
    const userId = await requireUser();

    const [notes, aiLogs] = await Promise.all([
      prisma.note.findMany({
        where: { userId, archived: false },
        orderBy: { updatedAt: "desc" },
      }),
      prisma.aiUsageLog.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    const tagCounts: Record<string, number> = {};
    for (const note of notes) {
      for (const tag of parseTags(note.tags)) {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      }
    }

    const mostUsedTags = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([tag, count]) => ({ tag, count }));

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const weeklyActivity = notes.filter(
      (n) => n.updatedAt >= weekAgo
    ).length;

    const aiThisWeek = aiLogs.filter((l) => l.createdAt >= weekAgo).length;

    return jsonOk({
      total_notes: notes.length,
      archived_count: await prisma.note.count({
        where: { userId, archived: true },
      }),
      recently_edited: notes.slice(0, 5).map(formatNote),
      most_used_tags: mostUsedTags,
      ai_usage: {
        total: aiLogs.length,
        this_week: aiThisWeek,
      },
      weekly_activity: {
        notes_edited: weeklyActivity,
        ai_generations: aiThisWeek,
        summary: `${weeklyActivity} notes edited and ${aiThisWeek} AI generations this week`,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
