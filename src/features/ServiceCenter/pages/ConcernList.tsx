import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useServiceCenterConcerns } from "../hooks/useConcerns";

const PAGE_SIZE = 10;

const STATUS_TABS = [
  { label: "All", value: undefined },
  { label: "Pending", value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
  { label: "Scheduled", value: "scheduled" },
  { label: "Resolved", value: "resolved" },
];

const STATUS_BADGE: Record<string, string> = {
  pending: "bg-amber-400/15 text-amber-300",
  approved: "bg-cyan-400/15 text-cyan-300",
  rejected: "bg-red-400/15 text-red-300",
  scheduled: "bg-blue-400/15 text-blue-300",
  resolved: "bg-emerald-400/15 text-emerald-300",
};

export default function ConcernsListPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);

  const { data, isLoading } = useServiceCenterConcerns(page, PAGE_SIZE, statusFilter);
  const concerns = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className="min-h-screen w-full px-6 py-8" style={{ background: "#060a14" }}>
      <div className="mx-auto max-w-5xl">
        <h1 className="text-2xl text-white" style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }}>
          Concerns
        </h1>
        <p className="mt-1 text-sm text-slate-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          Review and respond to customer-reported issues.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.label}
              onClick={() => { setStatusFilter(tab.value); setPage(1); }}
              className={`rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
                statusFilter === tab.value ? "bg-cyan-500 text-black" : "border border-white/10 text-slate-400 hover:border-white/25"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-6 overflow-hidden rounded-xl border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-[#0a0f1e] text-left text-xs uppercase tracking-wide text-slate-500">
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Vehicle</th>
                <th className="px-4 py-3">Issue Title</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date Raised</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-white/5">
                    <td colSpan={6} className="px-4 py-4">
                      <div className="h-4 w-full animate-pulse rounded bg-white/5" />
                    </td>
                  </tr>
                ))
              ) : concerns.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-slate-500">No concerns raised yet.</td></tr>
              ) : (
                concerns.map((c) => (
                  <tr key={c.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                    <td className="px-4 py-3 text-white">{c.customerName}</td>
                    <td className="px-4 py-3 text-slate-300">{c.vehicleRegistrationNumber}</td>
                    <td className="px-4 py-3 text-slate-300">{c.issueTitle}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_BADGE[c.status]}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400">{new Date(c.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => navigate(`/service-center/concern/concern-detail/${c.id}`)}
                        className="rounded-lg border border-cyan-400/40 px-3 py-1.5 text-xs font-semibold text-cyan-400 hover:bg-cyan-400/10"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
            <span>Showing {concerns.length} of {total}</span>
            <div className="flex gap-2">
              <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="rounded-lg border border-white/10 px-3 py-1.5 disabled:opacity-30">Prev</button>
              <span className="px-2 py-1.5">{page} / {totalPages}</span>
              <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="rounded-lg border border-white/10 px-3 py-1.5 disabled:opacity-30">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}