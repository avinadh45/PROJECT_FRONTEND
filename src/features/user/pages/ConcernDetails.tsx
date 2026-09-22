import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  Clock,
  Video,
  XCircle,
} from "lucide-react";
import { useUserConcernDetails } from "../queries/useConcern";
import { Navbar } from "../components/Navbar";
import { useAuth } from "../hooks/useAuth";

const navLinks = [
  { label: "Home", href: "/dashboard" },
  { label: "Add Vehicle", href: "/add-vehicle" },
  { label: "My Vehicle", href: "/my-vehicle" },
  { label: "Repair", href: "/booking" },
  { label: "History", href: "/my-bookings" },
];

type ConcernStatus = "pending" | "approved" | "rejected" | "scheduled" | "resolved";

const STATUS_STYLES: Record<ConcernStatus, { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-amber-400/10 text-amber-400 border-amber-400/20" },
  approved: { label: "Approved", className: "bg-cyan-400/10 text-cyan-400 border-cyan-400/20" },
  rejected: { label: "Rejected", className: "bg-red-400/10 text-red-400 border-red-400/20" },
  scheduled: { label: "Scheduled", className: "bg-blue-400/10 text-blue-400 border-blue-400/20" },
  resolved: { label: "Resolved", className: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20" },
};

function StatusPill({ status }: { status: ConcernStatus }) {
  const style = STATUS_STYLES[status];
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${style.className}`}
    >
      {style.label}
    </span>
  );
}

function PageShell({ children }: { children: React.ReactNode }) {
  const { logoutuser } = useAuth();
  return (
    <div className="min-h-screen w-full pb-16" style={{ background: "#060a14" }}>
      <Navbar
        links={navLinks}
        userInitials="AK"
        userName="Arun Kumar"
        userEmail="arun@email.com"
        notifications={[]}
        onLogout={logoutuser}
      />
      <div className="mx-auto max-w-4xl px-4 pt-8 sm:px-6 lg:px-8">{children}</div>
    </div>
  );
}

export default function ConcernDetailsPage() {
  const { concernId } = useParams<{ concernId: string }>();
  const navigate = useNavigate();
  const { data: concern, isLoading } =  useUserConcernDetails(concernId!);

  if (isLoading) {
    return (
      <PageShell>
        <div className="flex h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-cyan-400" />
        </div>
      </PageShell>
    );
  }

  if (!concern) {
    return (
      <PageShell>
        <div className="flex h-[60vh] flex-col items-center justify-center gap-4 text-sm text-slate-500">
          Concern not found.
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-white/40 transition-colors hover:text-white/70"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </button>
        </div>
      </PageShell>
    );
  }

  const status = concern.status as ConcernStatus;

  return (
    <PageShell>
      {/* Header */}
      <button
        onClick={() => navigate(-1)}
        className="mb-5 inline-flex items-center gap-1.5 text-xs font-medium text-white/40 transition-colors hover:text-white/70"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back
      </button>

      <div className="mb-8 flex items-center justify-between gap-4">
        <h1 className="text-3xl text-white" style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700 }}>
          Concern Details
        </h1>
        <StatusPill status={status} />
      </div>

      <div className="space-y-6">
        {/* Original Service */}
       <section className="rounded-2xl border border-white/10 bg-[#0a0f1e] p-6">
  <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-500">Original service</p>
  <div className="flex items-center gap-3">
    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-[#060a14]">
      {concern.vehiclePhotoUrl && (
        <img
          src={concern.vehiclePhotoUrl}
          alt={concern.vehicleRegistrationNumber}
          className="h-full w-full object-cover"
        />
      )}
    </div>
    <div className="min-w-0">
      <p className="truncate font-semibold text-white">
        {concern.vehicleBrand} {concern.vehicleModel}
      </p>
      <p className="truncate text-sm text-slate-400">
        {concern.categoryName} at {concern.garageName}
      </p>
    </div>
  </div>
  <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-xs text-slate-500">
    <span>{concern.originalServiceDate}</span>
    <span className="font-mono">#{concern.bookingId.slice(-8).toUpperCase()}</span>
  </div>
</section>

        {/* Your Issue */}
        <section className="rounded-2xl border border-white/10 bg-[#0a0f1e] p-6">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Your issue</p>
          <h2 className="mb-2 text-base font-semibold text-white">{concern.issueTitle}</h2>
          <p className="whitespace-pre-line text-sm leading-relaxed text-slate-400">{concern.description}</p>
        </section>

        {/* Proof */}
        {concern.proof?.length > 0 && (
  <section className="rounded-2xl border border-white/10 bg-[#0a0f1e] p-6">
    <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-500">Submitted proof</p>
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {concern.proof.map((item, i) => (
        <div key={i} className="contents">
          {item.imageUrl && (
            <div className="overflow-hidden rounded-xl border border-white/10 bg-[#060a14]">
              <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2 text-xs text-slate-500">
                <Camera className="h-3.5 w-3.5" />
                Photo
              </div>
              <img src={item.imageUrl} alt="Submitted proof" className="max-h-64 w-full object-cover" />
            </div>
          )}
          {item.videoUrl && (
            <div className="overflow-hidden rounded-xl border border-white/10 bg-[#060a14]">
              <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2 text-xs text-slate-500">
                <Video className="h-3.5 w-3.5" />
                Video
              </div>
              <video src={item.videoUrl} controls className="max-h-64 w-full" />
            </div>
          )}
        </div>
      ))}
    </div>
  </section>
)}

        {/* Garage Response */}
        <section className="rounded-2xl border border-white/10 bg-[#0a0f1e] p-6">
          <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-500">Garage response</p>

          {status === "pending" && (
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#060a14] px-4 py-3 text-sm text-slate-400">
              <Clock className="h-4 w-4 shrink-0 text-amber-400" />
              Waiting for the garage to review your concern.
            </div>
          )}

          {status === "approved" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 rounded-xl border border-cyan-400/20 bg-cyan-400/5 px-4 py-3 text-sm text-cyan-300">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                Your concern has been approved.
              </div>
              <button
                onClick={() => navigate(`/concern/${concern.id}/schedule`)}
                className="w-full rounded-xl py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #3b82f6, #06b6d4)" }}
              >
                Schedule Visit
              </button>
            </div>
          )}

{status === "rejected" && (
  <div className="flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
    <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
    <div>
      <p className="font-medium">Concern rejected</p>
      {concern.providerResponse?.rejectReason && (
        <p className="mt-1 text-red-400/80">{concern.providerResponse.rejectReason}</p>
      )}
    </div>
  </div>
)}

          {status === "scheduled" && (
            <div className="flex items-center justify-between gap-3 rounded-xl border border-blue-400/20 bg-blue-400/5 px-4 py-3 text-sm text-blue-300">
              <span>Visit scheduled.</span>
              {concern.resolutionBookingId && (
                <button
                  onClick={() => navigate(`/concern/${concern.id}/schedule`)}
                  className="rounded-lg border border-blue-400/30 px-3 py-1.5 text-xs font-semibold text-blue-300 transition-colors hover:bg-blue-400/10"
                >
                  View booking
                </button>
              )}
            </div>
          )}

          {status === "resolved" && (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/5 px-4 py-3 text-sm text-emerald-300">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              This concern has been resolved.
            </div>
          )}
        </section>

        {/* Timeline */}
        {concern.timeline?.length > 0 && (
  <section className="rounded-2xl border border-white/10 bg-[#0a0f1e] p-6">
    <p className="mb-5 text-xs font-semibold uppercase tracking-wide text-slate-500">Timeline</p>
    <div className="space-y-0">
      {concern.timeline.map((entry, index) => {
        const isLast = index === concern.timeline.length - 1;
        return (
          <div key={`${entry.status}-${entry.at}`} className="relative flex gap-3 pb-6 last:pb-0">
            {!isLast && <span className="absolute left-[5px] top-3 h-full w-px bg-white/10" aria-hidden />}
            <span className="relative mt-1.5 h-3 w-3 shrink-0 rounded-full border-2 border-cyan-400 bg-[#0a0f1e]" />
            <div>
              <p className="text-sm font-medium capitalize text-white">{entry.status}</p>
              <p className="text-xs text-slate-500">{new Date(entry.at).toLocaleString()}</p>
            </div>
          </div>
        );
      })}
    </div>
  </section>
)}
      </div>
    </PageShell>
  );
}