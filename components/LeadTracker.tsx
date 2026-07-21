"use client";

import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { useEffect, useState } from "react";
import { AuthForm } from "@/components/AuthForm";
import { LeadForm } from "@/components/LeadForm";
import { LeadTable } from "@/components/LeadTable";
import { SearchBar } from "@/components/SearchBar";
import { useLeads } from "@/hooks/useLeads";
import { getFirebaseAuth, isFirebaseConfigured } from "@/lib/firebase";
import { createLead, removeLead, updateLead } from "@/lib/firestore";
import type { Lead, LeadInput } from "@/types/lead";

interface LeadWorkspaceProps {
  uid: string;
}

function LeadWorkspace({ uid }: LeadWorkspaceProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const { leads, totalLeads, loading, error } = useLeads(uid, searchTerm);

  const initialValues = editingLead
    ? {
        projectNumber: editingLead.projectNumber,
        customerName: editingLead.customerName,
        followUpDate: editingLead.followUpDate,
      }
    : undefined;

  async function handleSubmit(input: LeadInput) {
    if (editingLead) {
      await updateLead(uid, editingLead.id, input);
      setEditingLead(null);
      return;
    }
    await createLead(uid, input);
  }

  async function handleDelete(lead: Lead) {
    setActionError(null);
    try {
      await removeLead(uid, lead.id);
      if (editingLead?.id === lead.id) setEditingLead(null);
    } catch {
      setActionError("Unable to delete the lead. Please try again.");
    }
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">Lead Tracker</h1>
        <button onClick={() => signOut(getFirebaseAuth())} className="text-sm text-zinc-600 underline-offset-2 hover:underline">
          Sign Out
        </button>
      </header>

      <section className="mb-5 w-full border border-zinc-200 p-4 sm:max-w-48" aria-label="Lead statistics">
        <p className="text-sm font-medium text-zinc-600">Total Leads</p>
        <p className="mt-1 text-2xl font-semibold text-zinc-900">{totalLeads}</p>
      </section>

      <LeadForm
        key={editingLead?.id ?? "new-lead"}
        initialValues={initialValues}
        isEditing={Boolean(editingLead)}
        onSubmit={handleSubmit}
        onCancel={() => setEditingLead(null)}
      />

      <div className="my-5 flex items-center justify-between gap-4">
        <SearchBar value={searchTerm} onChange={setSearchTerm} />
      </div>

      {(error || actionError) ? (
        <p className="mb-4 text-sm text-red-700" role="alert">{error ?? actionError}</p>
      ) : null}

      <LeadTable leads={leads} loading={loading} onEdit={setEditingLead} onDelete={handleDelete} />
    </main>
  );
}

export function LeadTracker() {
  const [user, setUser] = useState<User | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      return;
    }

    return onAuthStateChanged(getFirebaseAuth(), (nextUser) => {
      setUser(nextUser);
      setCheckingAuth(false);
    });
  }, []);

  if (!isFirebaseConfigured) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <h1 className="mb-4 text-2xl font-semibold">Lead Tracker</h1>
        <p className="text-sm text-zinc-700">Firebase configuration is missing. Add the required values to .env.local.</p>
      </main>
    );
  }

  if (checkingAuth) {
    return <main className="mx-auto max-w-5xl px-4 py-16 text-sm text-zinc-500 sm:px-6">Loading...</main>;
  }

  return user ? <LeadWorkspace uid={user.uid} /> : <AuthForm />;
}
