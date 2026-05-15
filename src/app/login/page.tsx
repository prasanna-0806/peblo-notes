import Link from "next/link";
import { AuthForm } from "@/components/AuthForm";

export default function LoginPage() {
  return (
    <section className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-4">
      <article className="w-full max-w-md space-y-6">
        <header className="text-center">
          <h1 className="text-2xl font-bold text-white">Welcome back</h1>
          <p className="text-slate-400 mt-1">Log in to your Peblo Notes workspace</p>
        </header>
        <AuthForm mode="login" />
        <p className="text-center text-sm text-slate-500">
          No account?{" "}
          <Link href="/signup" className="text-violet-400 hover:underline">
            Sign up
          </Link>
        </p>
      </article>
    </section>
  );
}
