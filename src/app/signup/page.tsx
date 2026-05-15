import Link from "next/link";
import { AuthForm } from "@/components/AuthForm";

export default function SignupPage() {
  return (
    <section className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-4">
      <article className="w-full max-w-md space-y-6">
        <header className="text-center">
          <h1 className="text-2xl font-bold text-white">Create your account</h1>
          <p className="text-slate-400 mt-1">Start organizing notes with AI</p>
        </header>
        <AuthForm mode="signup" />
        <p className="text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link href="/login" className="text-violet-400 hover:underline">
            Log in
          </Link>
        </p>
      </article>
    </section>
  );
}
