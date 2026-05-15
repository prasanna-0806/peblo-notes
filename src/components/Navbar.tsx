"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-50">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <Link href={user ? "/workspace" : "/"} className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 text-sm font-bold text-white">
            P
          </span>
          <span className="font-semibold text-white">Peblo Notes</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          {user ? (
            <>
              <Link
                href="/workspace"
                className="text-slate-300 hover:text-white transition"
              >
                Workspace
              </Link>
              <Link
                href="/dashboard"
                className="text-slate-300 hover:text-white transition"
              >
                Insights
              </Link>
              <span className="hidden sm:inline text-slate-500">
                {user.name}
              </span>
              <button
                onClick={logout}
                className="rounded-lg border border-slate-700 px-3 py-1.5 text-slate-300 hover:bg-slate-800 transition"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-slate-300 hover:text-white transition"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-violet-600 px-3 py-1.5 text-white hover:bg-violet-500 transition"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
