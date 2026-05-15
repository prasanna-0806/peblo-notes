"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import type { Note } from "@/types";

export default function SharedNotePage() {
  const { shareId } = useParams<{ shareId: string }>();
  const [note, setNote] = useState<Note | null>(null);
  const [author, setAuthor] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!shareId) return;
    fetch(`/api/shared/${shareId}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Note not found");
          return;
        }
        setNote(data.note);
        setAuthor(data.author);
      })
      .catch(() => setError("Failed to load note"))
      .finally(() => setLoading(false));
  }, [shareId]);

  if (loading) {
    return (
      <p className="text-center text-slate-500 py-20">Loading shared note…</p>
    );
  }

  if (error || !note) {
    return (
      <section className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h1 className="text-xl font-semibold text-white">Note unavailable</h1>
        <p className="text-slate-400 mt-2">{error || "This note may be private or removed."}</p>
      </section>
    );
  }

  return (
    <section className="min-h-[calc(100vh-3.5rem)] bg-gradient-to-b from-slate-950 to-violet-950/20">
      <article className="max-w-3xl mx-auto px-4 py-12">
        <header className="mb-8 border-b border-slate-800 pb-6">
          <p className="text-sm text-violet-400 mb-2">Shared by {author}</p>
          <h1 className="text-3xl font-bold text-white">{note.title}</h1>
          <p className="text-slate-500 text-sm mt-2">
            Updated {new Date(note.updated_at).toLocaleString()}
          </p>
          {note.tags.length > 0 && (
            <p className="flex flex-wrap gap-2 mt-3">
              {note.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs rounded-full bg-violet-600/20 text-violet-300 px-2 py-0.5"
                >
                  {tag}
                </span>
              ))}
            </p>
          )}
        </header>
        <section className="prose prose-invert max-w-none">
          <pre className="whitespace-pre-wrap font-sans text-slate-300 leading-relaxed">
            {note.content}
          </pre>
        </section>
        {note.summary && (
          <aside className="mt-10 card">
            <h2 className="text-sm font-medium text-violet-400 mb-2">AI Summary</h2>
            <p className="text-slate-300 text-sm">{note.summary}</p>
            {note.action_items.length > 0 && (
              <ul className="mt-3 list-disc list-inside text-sm text-slate-400">
                {note.action_items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </aside>
        )}
        <footer className="mt-12 text-center text-sm text-slate-600">
          Powered by Peblo Notes
        </footer>
      </article>
    </section>
  );
}
