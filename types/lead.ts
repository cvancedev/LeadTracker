import type { Timestamp } from "firebase/firestore";

export interface LeadDocument {
  projectNumber: string;
  customerName: string;
  followUpDate: string;
  completed: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Lead extends LeadDocument {
  id: string;
}

export interface LeadInput {
  projectNumber: string;
  customerName: string;
  followUpDate: string;
}
