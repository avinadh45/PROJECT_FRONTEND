// AdminLogin.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from '../hook/useAdminAuth';

// ── Icons ──────────────────────────────────────────────────────────────────────
const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2.5"/>
    <path d="M2.5 6.5l9 6.2a1.6 1.6 0 001.9 0l9.1-6.2"/>
  </svg>
);

const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="10.5" width="16" height="10" rx="2.5"/>
    <path d="M7.5 10.5V7a4.5 4.5 0 019 0v3.5"/>
  </svg>
);

const EyeOnIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const EyeOffIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
    <path d="M20 6L9 17l-5-5"/>
  </svg>
);

const SpinIcon = () => (
  <svg style={{ animation: "adlSpin 0.75s linear infinite" }} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
  </svg>
);

const GoogleIcon = () => (
  <svg width="17" height="17" viewBox="0 0 18 18" fill="none">
    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
    <path d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
  </svg>
);

const ShieldMiniIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0a0f1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2l8 3.5v5.4c0 5-3.4 8.6-8 10.1-4.6-1.5-8-5.1-8-10.1V5.5L12 2z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

const AlertCircleIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="10" /><path d="m15 9-6 6M9 9l6 6" />
  </svg>
);

// ── Signature visual: network operations map ─────────────────────────────────
// What an admin actually does — monitor and approve service centers across
// the network — drawn as a coverage map with status-colored nodes converging
// on a central HQ, with a scanning sweep to sell "live monitoring."
type NodeStatus = "verified" | "pending" | "flagged";
const STATUS_COLOR: Record<NodeStatus, string> = {
  verified: "#34d399",
  pending: "#fbbf24",
  flagged: "#f87171",
};
const OPS_NODES: { x: number; y: number; status: NodeStatus }[] = [
  { x: 108, y: 92, status: "verified" },
  { x: 178, y: 66, status: "verified" },
  { x: 252, y: 92, status: "pending" },
  { x: 302, y: 142, status: "verified" },
  { x: 148, y: 158, status: "verified" },
  { x: 222, y: 192, status: "flagged" },
  { x: 98, y: 200, status: "pending" },
  { x: 268, y: 202, status: "verified" },
];
const HUB = { x: 200, y: 148 };

const OpsMap = () => (
  <div className="adl-map-wrap">
    <div className="adl-scanline" />
    <svg viewBox="0 0 400 300" width="100%" height="100%" style={{ maxWidth: "380px" }} aria-hidden="true">
      <defs>
        <linearGradient id="adlGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
        <radialGradient id="adlHubGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Coverage area outline */}
      <path
        d="M60 120 C40 90 70 50 120 45 C160 40 190 20 240 30 C290 40 330 60 340 110 C350 160 330 200 290 220 C260 235 230 250 190 255 C150 260 100 255 75 225 C50 195 45 160 60 120 Z"
        fill="rgba(16,185,129,0.035)" stroke="rgba(255,255,255,0.14)" strokeWidth="1.2"
      />

      {/* Lines to hub */}
      {OPS_NODES.map((n, i) => (
        <line key={`l-${i}`} x1={HUB.x} y1={HUB.y} x2={n.x} y2={n.y} stroke="rgba(16,185,129,0.18)" strokeWidth="1" strokeDasharray="2 4" />
      ))}

      {/* Nodes */}
      {OPS_NODES.map((n, i) => (
        <g key={`n-${i}`}>
          {n.status === "pending" && (
            <circle cx={n.x} cy={n.y} r="6" fill="none" stroke={STATUS_COLOR.pending} strokeWidth="1.5" className="adl-node-ping" style={{ transformOrigin: `${n.x}px ${n.y}px` }} />
          )}
          <circle cx={n.x} cy={n.y} r="5" fill="#0a0f1a" stroke={STATUS_COLOR[n.status]} strokeWidth="1.8" />
          <circle cx={n.x} cy={n.y} r="1.8" fill={STATUS_COLOR[n.status]} />
        </g>
      ))}

      {/* Hub */}
      <circle cx={HUB.x} cy={HUB.y} r="34" fill="url(#adlHubGlow)" />
      <circle cx={HUB.x} cy={HUB.y} r="16" fill="url(#adlGrad)" />
      <foreignObject x={HUB.x - 7} y={HUB.y - 7} width="14" height="14">
        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <ShieldMiniIcon />
        </div>
      </foreignObject>
    </svg>

    <div className="adl-kpi-row">
      <span><i style={{ background: STATUS_COLOR.verified }} />Verified 235</span>
      <span><i style={{ background: STATUS_COLOR.pending }} />Pending 12</span>
      <span><i style={{ background: STATUS_COLOR.flagged }} />Flagged 3</span>
    </div>
  </div>
);

// ── Floating-label input ──────────────────────────────────────────────────────
interface FloatingInputProps {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  icon: React.ReactNode;
  autoComplete?: string;
  rightElement?: React.ReactNode;
}

function FloatingInput({ id, label, type, value, onChange, icon, autoComplete, rightElement }: FloatingInputProps) {
  const [focused, setFocused] = useState(false);
  const floated = focused || value.length > 0;

  return (
    <div className="adl-field">
      <span className="adl-field-icon" style={{ color: focused ? "#34d399" : "rgba(255,255,255,0.32)" }}>{icon}</span>
      <input
        id={id}
        type={type}
        required
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="adl-input"
        style={{
          borderColor: focused ? "rgba(16,185,129,0.55)" : "rgba(255,255,255,0.1)",
          background: focused ? "rgba(16,185,129,0.04)" : "rgba(255,255,255,0.03)",
          boxShadow: focused ? "0 0 0 3px rgba(16,185,129,0.08)" : "none",
        }}
      />
      <label
        htmlFor={id}
        className="adl-label"
        style={{
          top: floated ? "7px" : "50%",
          fontSize: floated ? "10.5px" : "13.5px",
          transform: floated ? "translateY(0)" : "translateY(-50%)",
          color: focused ? "#34d399" : "rgba(255,255,255,0.38)",
        }}
      >
        {label}
      </label>
      {rightElement && <span className="adl-field-right">{rightElement}</span>}
    </div>
  );
}

// ── Component ──────────────────────────────────────────────────────────────────
export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { login, loading, error } = useAdminAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
      window.location.href = "/admin/dashboard";
    } catch (err) {
      console.error(err);
    }
  };

  const canSubmit = email.trim().length > 0 && password.length > 0 && !loading;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');

        @keyframes adlFadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes adlSpin { to { transform: rotate(360deg); } }
        @keyframes adlDrift {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-14px, 10px); }
        }
        @keyframes adlScan {
          0%   { top: 6%; opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { top: 92%; opacity: 0; }
        }
        @keyframes adlPing {
          0%   { transform: scale(0.9); opacity: 0.9; }
          80%  { transform: scale(2.6); opacity: 0; }
          100% { transform: scale(2.6); opacity: 0; }
        }

        .adl-root {
          min-height: 100vh;
          background: #060a0f;
          display: grid;
          grid-template-columns: 1fr;
          font-family: 'DM Sans', sans-serif;
          -webkit-font-smoothing: antialiased;
        }
        @media (min-width: 1024px) { .adl-root { grid-template-columns: 1.05fr 1fr; } }

        /* ── Brand panel ─────────────────────────────────────────── */
        .adl-brand {
          position: relative;
          display: none;
          flex-direction: column;
          justify-content: space-between;
          padding: 48px 56px;
          overflow: hidden;
          background:
            radial-gradient(ellipse 70% 55% at 25% 15%, rgba(5,150,105,0.16) 0%, transparent 60%),
            radial-gradient(ellipse 55% 55% at 85% 90%, rgba(6,182,212,0.08) 0%, transparent 60%),
            linear-gradient(180deg, #0a120e 0%, #070b0a 100%);
          border-right: 1px solid rgba(255,255,255,0.06);
        }
        @media (min-width: 1024px) { .adl-brand { display: flex; } }
        .adl-brand-orb { position: absolute; border-radius: 50%; filter: blur(60px); animation: adlDrift 14s ease-in-out infinite; }

        .adl-visual-wrap { flex: 1; display: flex; align-items: center; justify-content: center; }

        /* Ops map */
        .adl-map-wrap { position: relative; display: flex; flex-direction: column; align-items: center; gap: 14px; }
        .adl-scanline {
          position: absolute; left: 6%; right: 6%; height: 1.5px;
          background: linear-gradient(90deg, transparent, rgba(52,211,153,0.7), transparent);
          animation: adlScan 4s ease-in-out infinite;
          filter: blur(0.3px);
        }
        .adl-node-ping { animation: adlPing 2.4s ease-out infinite; }
        .adl-kpi-row { display: flex; gap: 16px; font-family: 'DM Sans', sans-serif; }
        .adl-kpi-row span { display: flex; align-items: center; gap: 6px; font-size: 11px; color: rgba(255,255,255,0.45); }
        .adl-kpi-row i { width: 6px; height: 6px; border-radius: 50%; display: inline-block; }

        @media (prefers-reduced-motion: reduce) {
          .adl-brand-orb, .adl-scanline, .adl-node-ping { animation: none !important; }
        }

        /* ── Form panel ──────────────────────────────────────────── */
        .adl-form-panel { display: flex; align-items: center; justify-content: center; padding: 40px 24px 56px; }
        .adl-form-wrap { width: 100%; max-width: 380px; animation: adlFadeUp 0.5s ease both; }

        .adl-badge {
          display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 999px;
          background: rgba(16,185,129,0.08); border: 1px solid rgba(16,185,129,0.25);
          font-size: 10.5px; font-weight: 600; color: rgba(52,211,153,0.85);
          letter-spacing: 0.07em; text-transform: uppercase; font-family: 'DM Sans', sans-serif;
        }

        .google-btn {
          width: 100%; height: 44px; border-radius: 10px;
          background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.12);
          color: rgba(255,255,255,.85); font-family: 'DM Sans', sans-serif;
          font-size: 13.5px; font-weight: 500;
          display: flex; align-items: center; justify-content: center; gap: 9px;
          cursor: pointer; transition: background .18s, border-color .18s;
        }
        .google-btn:hover { background: rgba(255,255,255,.08); border-color: rgba(255,255,255,.22); }

        .or-row { display: flex; align-items: center; gap: 10px; margin: 20px 0; }
        .or-line { flex: 1; height: 1px; background: rgba(255,255,255,.07); }
        .or-label { font-size: 10.5px; color: rgba(255,255,255,.28); letter-spacing: .1em; text-transform: uppercase; }

        .adl-field { position: relative; }
        .adl-field-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); display: flex; pointer-events: none; transition: color .18s; }
        .adl-field-right { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); }
        .adl-input {
          width: 100%; height: 52px; border-radius: 10px;
          padding: 17px 14px 6px 42px;
          color: #fff; font-size: 13.5px; font-family: 'DM Sans', sans-serif;
          border-width: 1px; border-style: solid; outline: none;
          transition: border-color .18s, background .18s, box-shadow .18s;
        }
        .adl-label {
          position: absolute; left: 42px; pointer-events: none;
          transition: top .16s ease, font-size .16s ease, color .16s ease, transform .16s ease;
          font-family: 'DM Sans', sans-serif; font-weight: 500;
        }

        .adl-submit {
          width: 100%; height: 48px; border-radius: 10px; border: none;
          background: linear-gradient(135deg, #059669, #06b6d4);
          background-size: 160% 160%;
          color: #fff; font-family: 'Syne', sans-serif;
          font-weight: 700; font-size: 13px; letter-spacing: 0.03em;
          cursor: pointer; box-shadow: 0 8px 24px rgba(16,185,129,.25);
          transition: transform .18s, box-shadow .18s, background-position .3s, opacity .18s;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .adl-submit:not(:disabled):hover {
          transform: translateY(-1px);
          box-shadow: 0 10px 28px rgba(16,185,129,.36);
          background-position: 100% 0%;
        }
        .adl-submit:not(:disabled):active { transform: translateY(0); }
        .adl-submit:disabled { opacity: .38; cursor: not-allowed; box-shadow: none; }

        a:focus-visible, button:focus-visible, input:focus-visible {
          outline: 2px solid rgba(52,211,153,0.6);
          outline-offset: 2px;
        }
      `}</style>

      <div className="adl-root">
        {/* ── Brand panel ──────────────────────────────────────────── */}
        <div className="adl-brand">
          <div className="adl-brand-orb" style={{ width: 260, height: 260, top: -60, left: -60, background: "rgba(5,150,105,0.35)" }} />
          <div className="adl-brand-orb" style={{ width: 220, height: 220, bottom: -40, right: -40, background: "rgba(6,182,212,0.2)", animationDelay: "3s" }} />

          <div className="flex items-center gap-2.5" style={{ position: "relative", zIndex: 1 }}>
            <div
              className="w-9 h-9 rounded-[9px] flex items-center justify-center flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #22d3ee, #0891b2)", fontWeight: 800, fontSize: 16, color: "#000", fontFamily: "'Syne',sans-serif" }}
            >
              M
            </div>
            <span className="text-white text-[21px] tracking-[-0.3px]" style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800 }}>
              Moto<span style={{ color: "#22d3ee" }}>Cline</span>
            </span>
          </div>

          <div className="adl-visual-wrap" style={{ position: "relative", zIndex: 1 }}>
            <OpsMap />
          </div>

          <div style={{ position: "relative", zIndex: 1, maxWidth: "380px" }}>
            <h2 className="text-white" style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "26px", lineHeight: 1.2, letterSpacing: "-0.4px" }}>
              Oversight for every service center.
            </h2>
            <p style={{ fontSize: "13.5px", color: "rgba(255,255,255,.4)", fontFamily: "'DM Sans',sans-serif", marginTop: "10px", lineHeight: 1.6 }}>
              Approve, monitor, and manage the whole network from one place.
            </p>
          </div>
        </div>

        {/* ── Form panel ───────────────────────────────────────────── */}
        <div className="adl-form-panel">
          <div className="adl-form-wrap">

            {/* Mobile-only compact logo */}
            <div className="flex lg:hidden items-center gap-2.5 justify-center mb-8">
              <div
                className="w-8 h-8 rounded-[8px] flex items-center justify-center flex-shrink-0"
                style={{ background: "linear-gradient(135deg, #22d3ee, #0891b2)", fontWeight: 800, fontSize: 15, color: "#000", fontFamily: "'Syne',sans-serif" }}
              >
                M
              </div>
              <span className="text-white text-[19px] tracking-[-0.3px]" style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800 }}>
                Moto<span style={{ color: "#22d3ee" }}>Cline</span>
              </span>
            </div>

            <div className="flex items-center gap-2.5 mb-1.5">
              <h1 className="text-white" style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "22px", letterSpacing: "-0.3px" }}>
                Welcome back
              </h1>
              <span className="adl-badge">Admin</span>
            </div>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,.4)", marginBottom: "26px" }}>
              Sign in to the operations console.
            </p>

            <button className="google-btn" type="button">
              <GoogleIcon />
              Continue with Google
            </button>

            <div className="or-row">
              <div className="or-line" />
              <span className="or-label">or email</span>
              <div className="or-line" />
            </div>

            {error && (
              <div className="flex items-center gap-2.5 rounded-lg px-3.5 py-2.5 mb-5" style={{ background: "rgba(239,68,68,.08)", border: "1px solid rgba(239,68,68,.22)" }}>
                <AlertCircleIcon />
                <span style={{ fontSize: "12.5px", color: "#f87171", fontWeight: 500 }}>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
              <FloatingInput id="admin-email" label="Email address" type="email" value={email} onChange={setEmail} icon={<MailIcon />} autoComplete="email" />

              <div>
                <FloatingInput
                  id="admin-pass"
                  label="Password"
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={setPassword}
                  icon={<LockIcon />}
                  autoComplete="current-password"
                  rightElement={
                    <button
                      type="button"
                      onClick={() => setShowPass((s) => !s)}
                      style={{ background: "none", border: "none", cursor: "pointer", padding: "2px", color: showPass ? "rgba(255,255,255,.6)" : "rgba(255,255,255,.3)" }}
                      aria-label={showPass ? "Hide password" : "Show password"}
                    >
                      {showPass ? <EyeOnIcon /> : <EyeOffIcon />}
                    </button>
                  }
                />
                <div className="flex justify-end mt-2">
                  <button
                    type="button"
                    onClick={() => navigate("/admin/forgot-password")}
                    style={{ fontSize: "12px", color: "#34d399", fontWeight: 500, background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "'DM Sans',sans-serif" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#6ee7b7")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#34d399")}
                  >
                    Forgot password?
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setRemember((r) => !r)}
                  style={{
                    width: "17px", height: "17px", borderRadius: "5px",
                    background: remember ? "linear-gradient(135deg,#10b981,#06b6d4)" : "rgba(255,255,255,0.05)",
                    border: remember ? "1px solid rgba(16,185,129,0.6)" : "1px solid rgba(255,255,255,0.14)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", flexShrink: 0, color: "#fff",
                    boxShadow: remember ? "0 0 8px rgba(16,185,129,0.3)" : "none",
                    transition: "all 0.18s",
                  }}
                >
                  {remember && <CheckIcon />}
                </button>
                <span onClick={() => setRemember((r) => !r)} style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", cursor: "pointer", userSelect: "none" }}>
                  Remember this device
                </span>
              </div>

              <button type="submit" className="adl-submit" disabled={!canSubmit}>
                {loading ? (<><SpinIcon /> Signing in…</>) : "Sign in"}
              </button>
            </form>

            <div className="mt-7 flex items-center justify-center gap-4">
              {["Privacy Policy", "Terms of Service", "Help Center"].map((l) => (
                <a
                  key={l} href="#"
                  style={{ fontSize: "11px", color: "rgba(255,255,255,.25)", textDecoration: "none", transition: "color .2s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,.55)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,.25)")}
                >
                  {l}
                </a>
              ))}
            </div>
            <p className="text-center mt-3" style={{ fontSize: "10.5px", color: "rgba(255,255,255,.15)", letterSpacing: "0.05em", textTransform: "uppercase" }}>
              © 2026 Motocline International
            </p>
          </div>
        </div>
      </div>
    </>
  );
}