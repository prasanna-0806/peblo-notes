import Link from "next/link";

export default function HomePage() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-violet-950/40 via-slate-950 to-slate-950" />
      <div className="absolute top-20 left-1/4 h-72 w-72 rounded-full bg-violet-600/20 blur-3xl" />
      <section className="relative mx-auto max-w-4xl px-4 py-24 text-center">
        <p className="text-violet-400 text-sm font-medium tracking-wide uppercase mb-4">
          Peblo Full Stack Challenge
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight">
          Collaborative AI Notes Workspace
        </h1>
        <p className="mt-6 text-lg text-slate-400 max-w-2xl mx-auto">
          Create notes, organize with tags, generate AI summaries, share publicly,
          and track your productivity — all in one place.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link href="/signup" className="btn-primary px-8 py-3 text-base">
            Get started free
          </Link>
          <Link href="/login" className="btn-secondary px-8 py-3 text-base">
            Log in
          </Link>
        </div>
        <ul className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left max-w-3xl mx-auto">
          {[
            { title: "AI summaries", desc: "Summaries, action items & title suggestions" },
            { title: "Smart search", desc: "Filter by tags, keywords, and date" },
            { title: "Public sharing", desc: "Share notes with a clean public page" },
          ].map((f) => (
            <li key={f.title} className="card">
              <h3 className="font-semibold text-white">{f.title}</h3>
              <p className="text-sm text-slate-400 mt-1">{f.desc}</p>
            </li>
          ))}
        </ul>
      </section>
    </section>
  );
}
