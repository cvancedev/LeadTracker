"use client";

import { signInWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { useState, type FormEvent } from "react";
import { getFirebaseAuth } from "@/lib/firebase";

export function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await signInWithEmailAndPassword(getFirebaseAuth(), email, password);
    } catch (signInError: unknown) {
      if (process.env.NODE_ENV === "development" && signInError instanceof FirebaseError) {
        setError(`${signInError.code}: ${signInError.message}`);
      } else {
        setError("Unable to sign in. Check your email and password.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-md px-4 py-16 sm:px-6">
      <h1 className="mb-8 text-2xl font-semibold tracking-tight">Lead Tracker</h1>
      <form onSubmit={handleSubmit} className="grid gap-4 border-y border-zinc-200 py-6">
        <label className="grid gap-1.5 text-sm font-medium text-zinc-700">
          Email
          <input
            required
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="rounded-md border border-zinc-300 px-3 py-2 font-normal outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
          />
        </label>
        <label className="grid gap-1.5 text-sm font-medium text-zinc-700">
          Password
          <input
            required
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="rounded-md border border-zinc-300 px-3 py-2 font-normal outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
          />
        </label>
        {error ? <p className="text-sm text-red-700" role="alert">{error}</p> : null}
        <button
          type="submit"
          disabled={loading}
          className="justify-self-start rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </main>
  );
}
