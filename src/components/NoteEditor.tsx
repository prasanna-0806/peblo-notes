"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { MarkdownPreview } from "./MarkdownPreview";
import type { Note } from "@/types";

type Props = {
  note: Note | null;
  onUpdate: (note: Note) => void;
  onDelete: (id: string) => void;
};

export function NoteEditor({ note, onUpdate, onDelete }: Props) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [category, setCategory] = useState("");
  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [aiResult, setAiResult] = useState<{
    summary: string;
    action_items: string[];
    suggested_title: string;
  } | null>(null);
  const [aiWarning, setAiWarning] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!note) {
      setTitle("");
      setContent("");
      setTagsInput("");
      setCategory("");
      setAiResult(null);
      setAiWarning(null);
      setAiError(null);
      setShareUrl(null);
      return;
    }
    setTitle(note.title);
    setContent(note.content);
    setTagsInput(note.tags.join(", "));
    setCategory(note.category || "");
    setAiResult(
      note.summary
        ? {
            summary: note.summary,
            action_items: note.action_items,
            suggested_title: note.suggested_title || note.title,
          }
        : null
    );
    if (note.is_public && note.share_id) {
      setShareUrl(`${window.location.origin}/shared/${note.share_id}`);
    } else {
      setShareUrl(null);
    }
  }, [note]);

  const save = useCallback(
    async (payload: Record<string, unknown>) => {
      if (!note) return;
      setSaving(true);
      try {
        const res = await fetch(`/api/notes/${note.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (res.ok) onUpdate(data.note);
      } finally {
        setSaving(false);
      }
    },
    [note, onUpdate]
  );

  const scheduleSave = useCallback(
    (payload: Record<string, unknown>) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => save(payload), 600);
    },
    [save]
  );

  const handleTitle = (v: string) => {
    setTitle(v);
    scheduleSave({ title: v });
  };

  const handleContent = (v: string) => {
    setContent(v);
    scheduleSave({ content: v });
  };

  const handleTags = (v: string) => {
    setTagsInput(v);
    const tags = v
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    scheduleSave({ tags });
  };

  const handleCategory = (v: string) => {
    setCategory(v);
    scheduleSave({ category: v || null });
  };

  const generateAi = async () => {
    if (!note) return;
    setAiLoading(true);
    setAiWarning(null);
    setAiError(null);
    try {
      await save({
        title,
        content,
        tags: tagsInput.split(",").map((t) => t.trim()).filter(Boolean),
        category: category || null,
      });
      const res = await fetch(`/api/notes/${note.id}/generate-summary`, {
        method: "POST",
      });
      const data = await res.json();
      if (res.ok) {
        setAiResult({
          summary: data.summary,
          action_items: data.action_items,
          suggested_title: data.suggested_title,
        });
        setAiWarning(data.warning ?? null);
        onUpdate(data.note);
        if (data.warning) toast(data.warning, { icon: "⚠️" });
        else toast.success("AI summary generated");
      } else {
        const msg = data.error || "AI summary failed. Please try again.";
        setAiError(msg);
        toast.error(msg);
      }
    } catch {
      setAiError("Network error. Could not reach the server.");
      toast.error("Network error");
    } finally {
      setAiLoading(false);
    }
  };

  const applySuggestedTitle = () => {
    if (!aiResult?.suggested_title) return;
    handleTitle(aiResult.suggested_title);
  };

  const toggleShare = async () => {
    if (!note) return;
    const next = !note.is_public;
    setSaving(true);
    try {
      const res = await fetch(`/api/notes/${note.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_public: next }),
      });
      const data = await res.json();
      if (res.ok) {
        onUpdate(data.note);
        if (data.note.is_public && data.note.share_id) {
          setShareUrl(`${window.location.origin}/shared/${data.note.share_id}`);
          toast.success("Note is now public");
        } else {
          setShareUrl(null);
          toast.success("Note is now private");
        }
      }
    } finally {
      setSaving(false);
    }
  };

  const archiveNote = async () => {
    if (!note) return;
    await save({ archived: !note.archived });
    toast.success(note.archived ? "Note restored" : "Note archived");
  };

  if (!note) {
    return (
      <section className="flex flex-1 items-center justify-center text-slate-500 p-8">
        <p>Select a note or create a new one</p>
      </section>
    );
  }

  return (
    <section className="flex flex-1 flex-col overflow-hidden">
      <header className="flex flex-wrap items-center gap-2 border-b border-slate-800 px-4 py-3">
        <input
          value={title}
          onChange={(e) => handleTitle(e.target.value)}
          className="flex-1 min-w-[200px] bg-transparent text-xl font-semibold text-white outline-none"
          placeholder="Note title"
        />
        <span className="text-xs text-slate-500">
          {saving ? "Saving…" : "Saved"}
        </span>
        <button onClick={generateAi} disabled={aiLoading} className="btn-secondary text-sm">
          {aiLoading ? "AI…" : "✨ AI Summary"}
        </button>
        <button onClick={toggleShare} className="btn-secondary text-sm">
          {note.is_public ? "Unshare" : "Share"}
        </button>
        <button onClick={archiveNote} className="btn-secondary text-sm">
          {note.archived ? "Unarchive" : "Archive"}
        </button>
        <button
          onClick={() => {
            if (confirm("Delete this note?")) onDelete(note.id);
          }}
          className="btn-danger text-sm"
        >
          Delete
        </button>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-0 flex-1 overflow-hidden">
        <section className="lg:col-span-2 flex flex-col p-4 gap-3 overflow-y-auto">
          <div className="flex items-center justify-between">
            <label className="text-xs text-slate-500 uppercase tracking-wide">Content</label>
            <button
              type="button"
              onClick={() => setPreviewMode((p) => !p)}
              className="text-xs text-violet-400 hover:text-violet-300"
            >
              {previewMode ? "Edit" : "Preview markdown"}
            </button>
          </div>
          {previewMode ? (
            <div className="flex-1 min-h-[300px] rounded-xl border border-slate-800 bg-slate-900/50 p-4 overflow-y-auto">
              <MarkdownPreview content={content} />
            </div>
          ) : (
            <textarea
              value={content}
              onChange={(e) => handleContent(e.target.value)}
              className="flex-1 min-h-[300px] resize-none rounded-xl border border-slate-800 bg-slate-900/50 p-4 text-slate-100 outline-none focus:border-violet-600"
              placeholder="Start writing… (markdown supported)"
            />
          )}
          <section className="grid grid-cols-2 gap-3">
            <fieldset className="space-y-1 border-0 p-0">
              <label className="text-xs text-slate-500">Tags (comma-separated)</label>
              <input
                value={tagsInput}
                onChange={(e) => handleTags(e.target.value)}
                className="input"
                placeholder="work, meeting"
              />
            </fieldset>
            <fieldset className="space-y-1 border-0">
              <label className="text-xs text-slate-500">Category</label>
              <input
                value={category}
                onChange={(e) => handleCategory(e.target.value)}
                className="input"
                placeholder="Personal"
              />
            </fieldset>
          </section>
        </section>

        <aside className="border-l border-slate-800 p-4 overflow-y-auto space-y-4 bg-slate-950/50">
          <h3 className="text-sm font-medium text-violet-400">AI Insights</h3>
          {aiWarning && (
            <p className="text-xs text-amber-300/90 bg-amber-950/40 border border-amber-800/50 rounded-lg px-3 py-2">
              {aiWarning}
            </p>
          )}
          {aiError && (
            <p className="text-xs text-red-300 bg-red-950/40 border border-red-900/50 rounded-lg px-3 py-2">
              {aiError}
            </p>
          )}
          {aiResult ? (
            <>
              <article className="card-sm">
                <h4 className="text-xs text-slate-500 mb-1">Summary</h4>
                <p className="text-sm text-slate-300">{aiResult.summary}</p>
              </article>
              <article className="card-sm">
                <h4 className="text-xs text-slate-500 mb-2">Action items</h4>
                <ul className="list-disc list-inside text-sm text-slate-300 space-y-1">
                  {aiResult.action_items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
              <button onClick={applySuggestedTitle} className="btn-secondary w-full text-sm">
                Use title: &quot;{aiResult.suggested_title}&quot;
              </button>
            </>
          ) : (
            <p className="text-sm text-slate-500">
              Generate an AI summary to see insights here.
            </p>
          )}

          {shareUrl && (
            <article className="card-sm">
              <h4 className="text-xs text-slate-500 mb-2">Public link</h4>
              <input readOnly value={shareUrl} className="input text-xs" />
              <button
                className="btn-secondary w-full mt-2 text-sm"
                onClick={() => {
                  navigator.clipboard.writeText(shareUrl);
                  toast.success("Link copied");
                }}
              >
                Copy link
              </button>
            </article>
          )}
        </aside>
      </section>
    </section>
  );
}
