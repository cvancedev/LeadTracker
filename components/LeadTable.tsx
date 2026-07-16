import { LeadRow } from "@/components/LeadRow";
import type { Lead } from "@/types/lead";

interface LeadTableProps {
  leads: Lead[];
  loading: boolean;
  onEdit: (lead: Lead) => void;
  onDelete: (lead: Lead) => Promise<void>;
}

export function LeadTable({ leads, loading, onEdit, onDelete }: LeadTableProps) {
  return (
    <div className="overflow-x-auto border-y border-zinc-200">
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">
        <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-600">
          <tr>
            <th scope="col" className="px-3 py-3 font-semibold sm:px-4">Project #</th>
            <th scope="col" className="px-3 py-3 font-semibold sm:px-4">Customer</th>
            <th scope="col" className="px-3 py-3 font-semibold sm:px-4">Follow-Up Date</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={3} className="px-4 py-10 text-center text-zinc-500">Loading leads...</td></tr>
          ) : leads.length === 0 ? (
            <tr><td colSpan={3} className="px-4 py-10 text-center text-zinc-500">No leads found.</td></tr>
          ) : (
            leads.map((lead) => (
              <LeadRow key={lead.id} lead={lead} onEdit={onEdit} onDelete={onDelete} />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
