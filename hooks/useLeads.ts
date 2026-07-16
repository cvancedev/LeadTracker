"use client";

import { useEffect, useMemo, useState } from "react";
import { subscribeToLeads } from "@/lib/firestore";
import type { Lead } from "@/types/lead";

export function useLeads(uid: string, searchTerm: string) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToLeads(
      uid,
      (nextLeads) => {
        setLeads(nextLeads);
        setError(null);
        setLoading(false);
      },
      () => {
        setError("Unable to load leads. Please try again.");
        setLoading(false);
      },
    );

    return unsubscribe;
  }, [uid]);

  const filteredLeads = useMemo(() => {
    const queryText = searchTerm.trim().toLocaleLowerCase();
    if (!queryText) return leads;

    return leads.filter(
      (lead) =>
        lead.projectNumber.toLocaleLowerCase().includes(queryText) ||
        lead.customerName.toLocaleLowerCase().includes(queryText),
    );
  }, [leads, searchTerm]);

  return { leads: filteredLeads, loading, error };
}
