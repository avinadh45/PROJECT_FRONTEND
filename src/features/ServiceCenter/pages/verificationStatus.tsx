import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Verification_status } from "../services/ServiceCenterService";

// ── Types ──────────────────────────────────────────────────────────────────
type VerificationStatus = "pending" | "approved" | "rejected";

interface VerificationStatusData {
  status: VerificationStatus;
  garageName: string;
  submittedAt?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  rejectionDetails?: string;
}




// ── Main Component ─────────────────────────────────────────────────────────
export default function VerificationStatusPage() {
  const navigate = useNavigate();
 const [data, setData] = useState<VerificationStatusData | null>(null);
const [loading, setLoading] = useState(true);

useEffect(()=>{

   fetchVerificationStatus();

   const interval =
      setInterval(()=>{

         fetchVerificationStatus();

      },5000);

   return ()=>{

      clearInterval(interval);

   };

},[]);
const fetchVerificationStatus  = async()=>{
     try {
        const response = await Verification_status()
        setData(response.data.data)
     } catch (error) {
        console.log(error);
     }finally{
        setLoading(false)
     }
}
    if (loading) {
   return (
      <div className="min-h-screen flex items-center justify-center text-white">
         Loading...
      </div>
   );
}

    if (!data) {
   return null;
}

  return (
   
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ background: "#07111d" }}
    >
      {/* Background layers */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, #050d18 0%, #071525 40%, #050f1c 70%, #030a12 100%)",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          top: "-180px",
          left: "-120px",
          width: "600px",
          height: "600px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(6,182,212,0.10) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: "-200px",
          right: "-150px",
          width: "700px",
          height: "700px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(37,99,235,0.09) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(34,211,238,0.035) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(34,211,238,0.035) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />
      <div
        className="absolute top-0 left-0 right-0 h-[2px] pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(34,211,238,0.5) 30%, rgba(34,211,238,0.8) 50%, rgba(34,211,238,0.5) 70%, transparent 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md mx-auto">
          {/* Brand */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
              style={{
                background:
                  "linear-gradient(135deg, rgba(6,182,212,0.2), rgba(37,99,235,0.15))",
                border: "1px solid rgba(6,182,212,0.3)",
              }}
            >
              <svg
                className="w-4 h-4 text-cyan-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <span className="text-white text-base font-bold tracking-tight">
              Moto<span className="text-cyan-400">Cline</span>
            </span>
          </div>

          {data.status === "pending" && <PendingView data={data} />}
          {data.status === "approved" && <ApprovedView data={data} navigate={navigate} />}
          {data.status === "rejected" && <RejectedView data={data} navigate={navigate} />}
        </div>
      </div>
    </div>
  );
}

// ── Pending View ───────────────────────────────────────────────────────────
function PendingView({ data }: { data: VerificationStatusData }) {
  return (
    <div className="text-center">
      {/* Animated pulse ring */}
      <div className="flex justify-center mb-8">
        <div className="relative">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center"
            style={{
              background: "rgba(251,191,36,0.08)",
              border: "1px solid rgba(251,191,36,0.25)",
              boxShadow: "0 0 48px rgba(251,191,36,0.12)",
            }}
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{
                background: "rgba(251,191,36,0.12)",
                border: "1px solid rgba(251,191,36,0.35)",
              }}
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="rgb(251,191,36)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
          </div>
          {/* Ping animation rings */}
          <div
            className="absolute inset-0 rounded-full animate-ping"
            style={{
              background: "rgba(251,191,36,0.06)",
              animationDuration: "2s",
            }}
          />
        </div>
      </div>

      <h1 className="text-white text-2xl font-bold tracking-tight mb-3">
        Under Review
      </h1>
      <p className="text-gray-400 text-sm leading-relaxed mb-2">
        Your application for{" "}
        <span className="text-white font-semibold">{data.garageName}</span> is
        being reviewed by our team.
      </p>
      <p className="text-gray-500 text-xs mb-8">
        Submitted on{" "}
        <span className="text-gray-400">{data.submittedAt}</span>
      </p>

      {/* Progress steps */}
      <div
        className="rounded-xl px-5 py-4 text-left space-y-4"
        style={{
          background: "rgba(251,191,36,0.04)",
          border: "1px solid rgba(251,191,36,0.12)",
        }}
      >
        <StatusStep
          icon={
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgb(34,211,238)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" />
            </svg>
          }
          title="Application Received"
          sub="Submitted successfully"
          badge={<Badge color="green" label="Done" />}
        />
        <StepDivider />
        <StatusStep
          icon={
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgb(251,191,36)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          }
          title="Document Verification"
          sub="License & ID proof being checked"
          badge={<Badge color="yellow" label="In Progress" />}
        />
        <StepDivider />
        <StatusStep
          icon={
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" />
            </svg>
          }
          title="Account Activation"
          sub="Start receiving bookings"
          badge={<Badge color="gray" label="Queued" />}
        />
      </div>

      <p className="text-gray-600 text-[11px] mt-6">
        Typical review takes up to{" "}
        <span className="text-amber-400 font-medium">48 hours</span>. We'll notify you by email.
      </p>
    </div>
  );
}

// ── Approved View ──────────────────────────────────────────────────────────
function ApprovedView({
  data,
  navigate,
}: {
  data: VerificationStatusData;
  navigate: (path: string) => void;
}) {
  return (
    <div className="text-center">
      <div className="flex justify-center mb-8">
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center"
          style={{
            background: "rgba(6,182,212,0.08)",
            border: "1px solid rgba(6,182,212,0.25)",
            boxShadow: "0 0 48px rgba(6,182,212,0.15)",
          }}
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{
              background: "rgba(6,182,212,0.12)",
              border: "1px solid rgba(6,182,212,0.35)",
            }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgb(34,211,238)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
        </div>
      </div>

      <h1 className="text-white text-2xl font-bold tracking-tight mb-3">
        Account Approved!
      </h1>
      <p className="text-gray-400 text-sm leading-relaxed mb-8">
        <span className="text-white font-semibold">{data.garageName}</span> has
        been verified. You can now log in and start managing bookings.
      </p>

      <button
        onClick={() => navigate("/service-center/login")}
        className="relative w-full overflow-hidden group"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-xl transition-all duration-300 group-hover:from-cyan-400 group-hover:to-cyan-300" />
        <div className="relative flex items-center justify-center gap-2 py-3 text-black font-semibold text-sm tracking-wide">
          Go to Login
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </div>
      </button>
    </div>
  );
}

// ── Rejected View ──────────────────────────────────────────────────────────
function RejectedView({
  data,
  navigate,
}: {
  data: VerificationStatusData;
  navigate: (path: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      {/* Icon */}
      <div className="flex justify-center mb-8">
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center"
          style={{
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.25)",
            boxShadow: "0 0 48px rgba(239,68,68,0.12)",
          }}
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{
              background: "rgba(239,68,68,0.12)",
              border: "1px solid rgba(239,68,68,0.35)",
            }}
          >
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="rgb(248,113,113)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M15 9l-6 6M9 9l6 6" />
            </svg>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-white text-2xl font-bold tracking-tight mb-3">
          Verification Rejected
        </h1>
        <p className="text-gray-400 text-sm leading-relaxed">
          Your application for{" "}
          <span className="text-white font-semibold">{data.garageName}</span>{" "}
          was reviewed on{" "}
          <span className="text-gray-300">{data.reviewedAt}</span> and could not
          be approved.
        </p>
      </div>

      {/* Rejection reason card */}
      <div
        className="rounded-xl px-5 py-4 mb-4"
        style={{
          background: "rgba(239,68,68,0.06)",
          border: "1px solid rgba(239,68,68,0.2)",
        }}
      >
        {/* Reason header */}
        <div className="flex items-center gap-2.5 mb-3">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
            style={{
              background: "rgba(239,68,68,0.12)",
              border: "1px solid rgba(239,68,68,0.25)",
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgb(248,113,113)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <div>
            <p className="text-red-400 text-[11px] font-semibold tracking-wider uppercase">
              Rejection Reason
            </p>
            <p className="text-white text-sm font-semibold leading-tight mt-0.5">
              {data.rejectionReason}
            </p>
          </div>
        </div>

        {/* Details */}
        <div
          className="rounded-lg px-4 py-3 text-gray-300 text-xs leading-relaxed"
          style={{ background: "rgba(0,0,0,0.2)" }}
        >
          {data.rejectionDetails}
        </div>
      </div>

      {/* What to fix guide */}
      <div
        className="rounded-xl px-5 py-4 mb-6"
        style={{
          background: "rgba(6,182,212,0.04)",
          border: "1px solid rgba(6,182,212,0.12)",
        }}
      >
        <button
          type="button"
          className="w-full flex items-center justify-between"
          onClick={() => setExpanded((s) => !s)}
        >
          <div className="flex items-center gap-2">
            <svg className="w-3.5 h-3.5 text-cyan-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="text-cyan-400 text-xs font-semibold">
              How to fix & resubmit
            </span>
          </div>
          <svg
            className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {expanded && (
          <div className="mt-3 space-y-2.5">
            {[
              "Ensure your garage license is current and not expired",
              "Upload clear, high-resolution scans of all documents",
              "Make sure ID proof matches the owner name on the form",
              "All files must be under 10MB in JPG, PNG, or PDF format",
            ].map((tip, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <div
                  className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[9px] font-bold text-cyan-400"
                  style={{
                    background: "rgba(6,182,212,0.1)",
                    border: "1px solid rgba(6,182,212,0.2)",
                    fontFamily: "monospace",
                  }}
                >
                  {i + 1}
                </div>
                <p className="text-gray-400 text-[11px] leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CTA */}
      <button
        onClick={() => navigate("/service-center/application")}
        className="relative w-full overflow-hidden group mb-3"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-xl transition-all duration-300 group-hover:from-cyan-400 group-hover:to-cyan-300" />
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"
          style={{ boxShadow: "0 0 24px rgba(34,211,238,0.5)" }}
        />
        <div className="relative flex items-center justify-center gap-2 py-3 text-black font-semibold text-sm tracking-wide">
          Update & Resubmit Application
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </div>
      </button>

      <p className="text-center text-gray-600 text-[11px]">
        Need help?{" "}
        <span className="text-cyan-500 cursor-pointer hover:text-cyan-400 transition-colors">
          Contact support
        </span>
      </p>
    </div>
  );
}

// ── Helpers ────────────────────────────────────────────────────────────────
function StatusStep({
  icon,
  title,
  sub,
  badge,
}: {
  icon: React.ReactNode;
  title: string;
  sub: string;
  badge: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3.5">
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
        style={{
          background: "rgba(6,182,212,0.08)",
          border: "1px solid rgba(6,182,212,0.2)",
        }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white text-xs font-semibold leading-tight">{title}</p>
        <p className="text-gray-500 text-[11px] mt-0.5">{sub}</p>
      </div>
      <div className="ml-auto shrink-0">{badge}</div>
    </div>
  );
}

function StepDivider() {
  return (
    <div className="flex items-center gap-3.5 pl-4">
      <div
        className="w-px h-3"
        style={{ background: "rgba(34,211,238,0.2)", marginLeft: "-1px" }}
      />
    </div>
  );
}

function Badge({
  color,
  label,
}: {
  color: "green" | "yellow" | "gray" | "red";
  label: string;
}) {
  const styles: Record<string, React.CSSProperties> = {
    green: {
      background: "rgba(34,197,94,0.1)",
      border: "1px solid rgba(34,197,94,0.25)",
      color: "#4ade80",
    },
    yellow: {
      background: "rgba(251,191,36,0.1)",
      border: "1px solid rgba(251,191,36,0.25)",
      color: "#fbbf24",
    },
    gray: {
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.1)",
      color: "rgba(255,255,255,0.3)",       
    },
    red: {
      background: "rgba(239,68,68,0.1)",
      border: "1px solid rgba(239,68,68,0.25)",
      color: "#f87171",
    },
  };

  return (
    <span
      className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
      style={styles[color]}
    >
      {label}
    </span>
  );
}