"use client";

import { useState, type FormEvent } from "react";
import type { LeadInput } from "@/types/lead";

interface LeadFormProps {
  initialValues?: LeadInput;
  isEditing: boolean;
  onSubmit: (input: LeadInput) => Promise<void>;
  onCancel?: () => void;
}

const emptyLead: LeadInput = {
  projectNumber: "",
  customerName: "",
  followUpDate: "",
};

export function LeadForm({ initialValues, isEditing, onSubmit, onCancel }: LeadFormProps) {
  const [values, setValues] = useState<LeadInput>(initialValues ?? emptyLead);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      await onSubmit(values);
      if (!isEditing) setValues(emptyLead);
    } catch {
      setError(`Unable to ${isEditing ? "update" : "add"} the lead. Please try again.`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border-y border-zinc-200 py-5">
      <div className="grid gap-4 md:grid-cols-[1fr_2fr_1fr_auto] md:items-end">
        <label className="grid gap-1.5 text-sm font-medium text-zinc-700">
          Project Number
          <input
            required
            value={values.projectNumber}
            onChange={(event) => setValues({ ...values, projectNumber: event.target.value })}
            className="rounded-md border border-zinc-300 px-3 py-2 font-normal outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
          />
        </label>

        <label className="grid gap-1.5 text-sm font-medium text-zinc-700">
          Customer Name
          <input
            required
            value={values.customerName}
            onChange={(event) => setValues({ ...values, customerName: event.target.value })}
            className="rounded-md border border-zinc-300 px-3 py-2 font-normal outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
          />
        </label>

        <label className="grid gap-1.5 text-sm font-medium text-zinc-700">
          Follow-Up Date
          <input
            required
            type="date"
            value={values.followUpDate}
            onChange={(event) => setValues({ ...values, followUpDate: event.target.value })}
            className="rounded-md border border-zinc-300 px-3 py-2 font-normal outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200"
          />
        </label>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : isEditing ? "Save" : "Add Lead"}
          </button>
          {isEditing && onCancel ? (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-50"
            >
              Cancel
            </button>
          ) : null}
        </div>
      </div>
      {error ? <p className="mt-3 text-sm text-red-700" role="alert">{error}</p> : null}
    </form>
  );
}
