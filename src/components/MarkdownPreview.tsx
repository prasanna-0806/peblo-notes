"use client";

import ReactMarkdown from "react-markdown";

export function MarkdownPreview({ content }: { content: string }) {
  return (
    <article className="prose prose-invert prose-sm max-w-none prose-headings:text-white prose-p:text-slate-300 prose-li:text-slate-300 prose-strong:text-white">
      <ReactMarkdown>{content || "*Nothing to preview yet.*"}</ReactMarkdown>
    </article>
  );
}
