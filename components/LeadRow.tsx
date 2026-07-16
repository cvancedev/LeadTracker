"use client";

import type { Lead } from "@/types/lead";

interface LeadRowProps {
  lead: Lead;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => Promise<void>;
}

function getTodayDateString(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDate(dateString: string): string {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

export function LeadRow({ lead, onEdit, onDelete }: LeadRowProps) {
  const today = getTodayDateString();
  const isOverdue = lead.followUpDate < today;
  const isToday = lead.followUpDate === today;

  async function handleDelete() {
    const confirmed = window.confirm(
      `Delete follow-up for ${lead.customerName}? This cannot be undone.`,
    );
    if (confirmed) await onDelete(lead);
  }

  return (
    <tr className="border-b border-zinc-200 last:border-b-0">
      <td className="px-3 py-3 align-middle font-medium text-zinc-900 sm:px-4">
        {lead.projectNumber}
      </td>
      <td className="px-3 py-3 align-middle text-zinc-700 sm:px-4">{lead.customerName}</td>
      <td className="px-3 py-3 align-middle sm:px-4">
        <div className="flex min-w-48 items-center justify-between gap-4">
          <time
            dateTime={lead.followUpDate}
            className={`rounded px-2 py-1 text-sm ${
              isOverdue
                ? "bg-red-100 font-medium text-red-800"
                : isToday
                  ? "bg-yellow-100 font-medium text-yellow-900"
                  : "text-zinc-700"
            }`}
          >
            {formatDate(lead.followUpDate)}
          </time>
          <span className="flex gap-3 text-sm">
            <button onClick={() => onEdit(lead)} className="text-zinc-700 underline-offset-2 hover:underline">
              Edit
            </button>
            <button onClick={handleDelete} className="text-red-700 underline-offset-2 hover:underline">
              Delete
            </button>
          </span>
        </div>
      </td>
    </tr>
  );
}
