"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { NoteSidebar } from "./NoteSidebar";
import { NoteEditor } from "./NoteEditor";
import { WorkspaceSkeleton } from "./Skeleton";
import type { Note } from "@/types";

export function Workspace() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [loading, setLoading] = useState(true);

  const selected = notes.find((n) => n.id === selectedId) ?? null;

  const fetchNotes = useCallback(async () => {
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (tagFilter) params.set("tag", tagFilter);
    params.set("archived", String(showArchived));
    params.set("sort", "updated");

    const res = await fetch(`/api/notes?${params}`);
    const data = await res.json();
    if (res.ok) {
      setNotes(data.notes);
      setSelectedId((prev) => {
        if (prev && data.notes.some((n: Note) => n.id === prev)) return prev;
        return data.notes[0]?.id ?? null;
      });
    }
    setLoading(false);
  }, [search, tagFilter, showArchived]);

  useEffect(() => {
    const t = setTimeout(fetchNotes, 300);
    return () => clearTimeout(t);
  }, [fetchNotes]);

  const createNote = async () => {
    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Untitled",
        content: "",
        tags: [],
      }),
    });
    const data = await res.json();
    if (res.ok) {
      setNotes((prev) => [data.note, ...prev]);
      setSelectedId(data.note.id);
      toast.success("Note created");
    }
  };

  const handleUpdate = (note: Note) => {
    setNotes((prev) => prev.map((n) => (n.id === note.id ? note : n)));
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/notes/${id}`, { method: "DELETE" });
    setNotes((prev) => prev.filter((n) => n.id !== id));
    setSelectedId(null);
  };

  if (loading) return <WorkspaceSkeleton />;

  return (
    <section className="flex flex-col md:flex-row flex-1 overflow-hidden min-h-[calc(100vh-3.5rem)]">
      <NoteSidebar
        notes={notes}
        selectedId={selectedId}
        search={search}
        tagFilter={tagFilter}
        showArchived={showArchived}
        onSearchChange={setSearch}
        onTagFilterChange={setTagFilter}
        onShowArchivedChange={setShowArchived}
        onSelect={setSelectedId}
        onCreate={createNote}
      />
      <NoteEditor
        note={selected}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
    </section>
  );
}
