"use client";

import { useEffect, useState } from "react";
import { DashboardSkeleton } from "./Skeleton";
import type { Insights } from "@/types";

export function InsightsDashboard() {
  const [data, setData] = useState<Insights | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/insights")
      .then((r) => r.json())
      .then((d) => {
        if (d.total_notes !== undefined) setData(d);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <DashboardSkeleton />;

  if (!data) {
    return <p className="text-slate-500 text-center py-20">Could not load insights.</p>;
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-8 space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-white">Productivity Insights</h1>
        <p className="text-slate-400 mt-1">{data.weekly_activity.summary}</p>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total notes" value={data.total_notes} />
        <StatCard label="Archived" value={data.archived_count} />
        <StatCard label="AI generations" value={data.ai_usage.total} />
        <StatCard label="AI this week" value={data.ai_usage.this_week} />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <article className="card">
          <h2 className="text-lg font-semibold text-white mb-4">Recently edited</h2>
          <ul className="space-y-2">
            {data.recently_edited.map((note) => (
              <li
                key={note.id}
                className="flex justify-between items-center text-sm border-b border-slate-800 pb-2"
              >
                <span className="text-slate-200">{note.title}</span>
                <span className="text-slate-500 text-xs">
                  {new Date(note.updated_at).toLocaleDateString()}
                </span>
              </li>
            ))}
            {data.recently_edited.length === 0 && (
              <li className="text-slate-500 text-sm">No notes yet</li>
            )}
          </ul>
        </article>

        <article className="card">
          <h2 className="text-lg font-semibold text-white mb-4">Most used tags</h2>
          <ul className="space-y-2">
            {data.most_used_tags.map(({ tag, count }) => (
              <li key={tag} className="flex items-center gap-3">
                <span className="text-violet-400 text-sm font-medium">{tag}</span>
                <span className="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden">
                  <span
                    className="block h-full bg-violet-600 rounded-full"
                    style={{
                      width: `${Math.min(100, (count / (data.total_notes || 1)) * 100)}%`,
                    }}
                  />
                </span>
                <span className="text-slate-500 text-xs">{count}</span>
              </li>
            ))}
            {data.most_used_tags.length === 0 && (
              <li className="text-slate-500 text-sm">No tags yet</li>
            )}
          </ul>
        </article>
      </section>

      <article className="card">
        <h2 className="text-lg font-semibold text-white mb-2">Weekly activity</h2>
        <p className="text-slate-400 text-sm">
          {data.weekly_activity.notes_edited} notes edited ·{" "}
          {data.weekly_activity.ai_generations} AI runs this week
        </p>
      </article>
    </section>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <article className="card text-center">
      <p className="text-3xl font-bold text-violet-400">{value}</p>
      <p className="text-sm text-slate-400 mt-1">{label}</p>
    </article>
  );
}
