import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Phone } from "lucide-react";
import { useConcernDetail, useRespondToConcern } from "../hooks/useConcerns";

export default function ConcernDetailPage() {
  const { concernId } = useParams<{ concernId: string }>();
  const navigate = useNavigate();
  const { data: concern, isLoading } = useConcernDetail(concernId!);
  const respondMutation = useRespondToConcern(concernId!);

  const [showRejectInput, setShowRejectInput] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  if (isLoading) return <div className="min-h-screen bg-[#060a14] text-white p-6">Loading…</div>;
  if (!concern) return <div className="min-h-screen bg-[#060a14] text-white p-6">Concern not found.</div>;

  const handleApprove = () => respondMutation.mutate({ rejected: false });
  const handleReject = () => {
    if (!rejectReason.trim()) return;
    respondMutation.mutate({ rejected: true, rejectReason: rejectReason.trim() });
  };

  return (
    <div className="min-h-screen w-full pb-16" style={{ background: "#060a14" }}>
      <div className="mx-auto max-w-2xl px-4 pt-8 sm:px-6">
        <button onClick={() => navigate(-1)} className="mb-4 inline-flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70">
          <ArrowLeft className="h-3.5 w-3.5" /> Back
        </button>

        <div className="flex items-center justify-between">
          <h1 className="text-2xl text-white" style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }}>
            Concern Details
          </h1>
          <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-slate-300 capitalize">
            {concern.status}
          </span>
        </div>

        <div className="mt-6 rounded-xl border border-white/10 bg-[#0a0f1e] p-4">
          <p className="mb-2 text-xs uppercase tracking-wide text-slate-500">Original Service</p>
          <p className="text-white">{concern.vehicleRegistrationNumber} · {concern.categoryName}</p>
          <p className="text-sm text-slate-400 mt-1">{concern.originalServiceDate}</p>
        </div>

        <div className="mt-4 rounded-xl border border-white/10 bg-[#0a0f1e] p-4">
          <p className="mb-2 text-xs uppercase tracking-wide text-slate-500">Customer</p>
          <p className="text-white">{concern.customerName}</p>
          <a href={`tel:${concern.customerPhone}`} className="mt-1 flex items-center gap-1.5 text-sm text-cyan-400 hover:underline">
            <Phone className="h-3.5 w-3.5" /> {concern.customerPhone}
          </a>
        </div>

        <div className="mt-4 rounded-xl border border-white/10 bg-[#0a0f1e] p-4">
          <p className="mb-2 text-xs uppercase tracking-wide text-slate-500">Issue</p>
          <p className="font-semibold text-white">{concern.issueTitle}</p>
          <p className="mt-2 text-sm text-slate-300">{concern.description}</p>
        </div>

        {concern.proof.length > 0 && (concern.proof[0].imageUrl || concern.proof[0].videoUrl) && (
          <div className="mt-4 rounded-xl border border-white/10 bg-[#0a0f1e] p-4">
            <p className="mb-3 text-xs uppercase tracking-wide text-slate-500">Proof</p>
            {concern.proof[0].imageUrl && (
              <img src={concern.proof[0].imageUrl} alt="Concern proof" className="max-h-72 rounded-lg border border-white/10 object-cover" />
            )}
            {concern.proof[0].videoUrl && (
              <video src={concern.proof[0].videoUrl} controls className="mt-2 max-h-72 w-full rounded-lg border border-white/10" />
            )}
          </div>
        )}

        <div className="mt-4 rounded-xl border border-white/10 bg-[#0a0f1e] p-4">
          <p className="mb-3 text-xs uppercase tracking-wide text-slate-500">Response</p>

          {concern.status === "pending" && !showRejectInput && (
            <div className="flex gap-3">
              <button
                onClick={handleApprove}
                disabled={respondMutation.isPending}
                className="flex-1 rounded-lg py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                style={{ background: "linear-gradient(135deg, #3b82f6, #06b6d4)" }}
              >
                {respondMutation.isPending ? "Processing…" : "Approve"}
              </button>
              <button
                onClick={() => setShowRejectInput(true)}
                className="flex-1 rounded-lg border border-red-500/40 py-2.5 text-sm font-semibold text-red-400 hover:bg-red-500/10"
              >
                Reject
              </button>
            </div>
          )}

          {concern.status === "pending" && showRejectInput && (
            <div className="flex flex-col gap-3">
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={3}
                placeholder="Reason for rejection…"
                className="w-full resize-none rounded-lg border border-white/10 bg-[#060a14] p-3 text-sm text-white placeholder:text-slate-600 focus:border-red-400/60 focus:outline-none"
              />
              <div className="flex gap-3">
                <button
                  onClick={handleReject}
                  disabled={!rejectReason.trim() || respondMutation.isPending}
                  className="flex-1 rounded-lg bg-red-500 py-2.5 text-sm font-semibold text-white disabled:opacity-40"
                >
                  {respondMutation.isPending ? "Submitting…" : "Confirm Rejection"}
                </button>
                <button
                  onClick={() => setShowRejectInput(false)}
                  className="rounded-lg border border-white/10 px-4 py-2.5 text-sm text-slate-400 hover:bg-white/5"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {concern.status === "approved" && (
            <div className="rounded-lg bg-cyan-400/10 px-4 py-3 text-sm text-cyan-300">
              Approved{concern.providerResponse?.respondedAt && ` on ${new Date(concern.providerResponse.respondedAt).toLocaleDateString()}`}
            </div>
          )}

          {concern.status === "rejected" && (
            <div className="rounded-lg bg-red-400/10 px-4 py-3 text-sm text-red-300">
              Rejected: {concern.providerResponse?.rejectReason}
            </div>
          )}

          {(concern.status === "scheduled" || concern.status === "resolved") && (
            <div className="rounded-lg bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300">
              This concern has been {concern.status}.
            </div>
          )}
        </div>

        <div className="mt-4 rounded-xl border border-white/10 bg-[#0a0f1e] p-4">
          <p className="mb-3 text-xs uppercase tracking-wide text-slate-500">Timeline</p>
          <div className="flex flex-col gap-2">
            {concern.timeline.map((t, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="capitalize text-slate-300">{t.status}</span>
                <span className="text-xs text-slate-500">{new Date(t.at).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}