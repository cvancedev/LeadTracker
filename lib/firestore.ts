import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  type FirestoreError,
  type Unsubscribe,
} from "firebase/firestore";
import { getDb } from "@/lib/firebase";
import type { Lead, LeadDocument, LeadInput } from "@/types/lead";

function getLeadsCollection(uid: string) {
  return collection(getDb(), "users", uid, "leads");
}

export function subscribeToLeads(
  uid: string,
  onLeads: (leads: Lead[]) => void,
  onError: (error: FirestoreError) => void,
): Unsubscribe {
  const leadsQuery = query(getLeadsCollection(uid), orderBy("followUpDate", "asc"));

  return onSnapshot(
    leadsQuery,
    (snapshot) => {
      const leads = snapshot.docs.map((snapshotDocument) => ({
        id: snapshotDocument.id,
        ...(snapshotDocument.data() as LeadDocument),
      }));
      onLeads(leads);
    },
    onError,
  );
}

export async function createLead(uid: string, input: LeadInput): Promise<void> {
  const now = Timestamp.now();
  const lead: LeadDocument = {
    projectNumber: input.projectNumber.trim(),
    customerName: input.customerName.trim(),
    followUpDate: input.followUpDate,
    completed: false,
    createdAt: now,
    updatedAt: now,
  };

  await addDoc(getLeadsCollection(uid), lead);
}

export async function updateLead(uid: string, id: string, input: LeadInput): Promise<void> {
  await updateDoc(doc(getDb(), "users", uid, "leads", id), {
    projectNumber: input.projectNumber.trim(),
    customerName: input.customerName.trim(),
    followUpDate: input.followUpDate,
    updatedAt: Timestamp.now(),
  });
}

export async function removeLead(uid: string, id: string): Promise<void> {
  await deleteDoc(doc(getDb(), "users", uid, "leads", id));
}
