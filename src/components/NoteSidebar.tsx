"use client";

import type { Note } from "@/types";

type Props = {
  notes: Note[];
  selectedId: string | null;
  search: string;
  tagFilter: string;
  showArchived: boolean;
  onSearchChange: (v: string) => void;
  onTagFilterChange: (v: string) => void;
  onShowArchivedChange: (v: boolean) => void;
  onSelect: (id: string) => void;
  onCreate: () => void;
};

export function NoteSidebar({
  notes,
  selectedId,
  search,
  tagFilter,
  showArchived,
  onSearchChange,
  onTagFilterChange,
  onShowArchivedChange,
  onSelect,
  onCreate,
}: Props) {
  const allTags = Array.from(new Set(notes.flatMap((n) => n.tags))).sort();

  return (
    <aside className="w-full md:w-72 border-r border-slate-800 flex flex-col bg-slate-950/30">
      <header className="p-3 space-y-2 border-b border-slate-800">
        <button onClick={onCreate} className="btn-primary w-full">
          + New note
        </button>
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search notes…"
          className="input text-sm"
        />
        <select
          value={tagFilter}
          onChange={(e) => onTagFilterChange(e.target.value)}
          className="input text-sm"
        >
          <option value="">All tags</option>
          {allTags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer">
          <input
            type="checkbox"
            checked={showArchived}
            onChange={(e) => onShowArchivedChange(e.target.checked)}
            className="rounded"
          />
          Show archived
        </label>
      </header>
      <ul className="flex-1 overflow-y-auto p-2 space-y-1">
        {notes.length === 0 ? (
          <li className="text-sm text-slate-500 p-3 text-center">No notes found</li>
        ) : (
          notes.map((note) => (
            <li key={note.id}>
              <button
                onClick={() => onSelect(note.id)}
                className={`w-full text-left rounded-lg px-3 py-2.5 transition ${
                  selectedId === note.id
                    ? "bg-violet-600/20 border border-violet-600/50"
                    : "hover:bg-slate-800/60 border border-transparent"
                }`}
              >
                <p className="font-medium text-sm text-white truncate">{note.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {new Date(note.updated_at).toLocaleDateString()}
                </p>
                {note.tags.length > 0 && (
                  <p className="text-xs text-violet-400/80 mt-1 truncate">
                    {note.tags.join(" · ")}
                  </p>
                )}
              </button>
            </li>
          ))
        )}
      </ul>
    </aside>
  );
}
