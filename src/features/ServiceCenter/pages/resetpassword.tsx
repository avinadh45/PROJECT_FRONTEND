// ResetPassword.tsx
// Matches ServiceCenterLogin / ForgotPassword branding: navy #060a14, blue #3b82f6, cyan #06b6d4

import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useServiceCenterAuth } from "../hooks/useServiceCenterAuth";
// ── Icons ─────────────────────────────────────────────────────────────────────
const BoltIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M13 2L4.5 13.5H11L10 22L20.5 10H14L13 2Z"
      fill="url(#bolt3)" stroke="url(#bolt3)" strokeWidth="0.5" strokeLinejoin="round"/>
    <defs>
      <linearGradient id="bolt3" x1="4" y1="2" x2="20" y2="22" gradientUnits="userSpaceOnUse">
        <stop stopColor="#3b82f6"/>
        <stop offset="1" stopColor="#06b6d4"/>
      </linearGradient>
    </defs>
  </svg>
);

const LockIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/>
    <path d="M7 11V7a5 5 0 0110 0v4"/>
  </svg>
);

const ShieldIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    <path d="m9 12 2 2 4-4"/>
  </svg>
);

const EyeOpenIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const EyeClosedIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

const CheckCircleIcon = () => (
  <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="m9 12 2 2 4-4"/>
  </svg>
);

const ArrowLeftIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <path d="M19 12H5M12 19l-7-7 7-7"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="m20 6-11 11-5-5"/>
  </svg>
);

const XSmallIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

// ── Password strength rules ───────────────────────────────────────────────────
const rules = [
  { label: "At least 8 characters",    test: (p: string) => p.length >= 8 },
  { label: "One uppercase letter",      test: (p: string) => /[A-Z]/.test(p) },
  { label: "One number",                test: (p: string) => /[0-9]/.test(p) },
  { label: "One special character",     test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

const getStrength = (p: string) => rules.filter(r => r.test(p)).length;

const strengthMeta = [
  { label: "Too weak",  color: "#ef4444", track: "rgba(239,68,68,0.35)" },
  { label: "Weak",      color: "#f97316", track: "rgba(249,115,22,0.35)" },
  { label: "Fair",      color: "#eab308", track: "rgba(234,179,8,0.35)"  },
  { label: "Good",      color: "#22c55e", track: "rgba(34,197,94,0.35)"  },
  { label: "Strong",    color: "#10b981", track: "rgba(16,185,129,0.35)" },
];

// ── Component ─────────────────────────────────────────────────────────────────
export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";
const { handleResetPassword, loading, error } = useServiceCenterAuth();
  const [newPass,     setNewPass]     = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showNew,     setShowNew]     = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [focusedF,    setFocused]     = useState<"new" | "confirm" | null>(null);
  //const [loading,     setLoading]     = useState(false);
  const [done,        setDone]        = useState(false);
  //const [error,       setError]       = useState<string | null>(null);

  const strength   = getStrength(newPass);
  const meta       = strengthMeta[strength] ?? strengthMeta[0];
  const passMatch  = confirmPass.length > 0 && newPass === confirmPass;
  const passMismatch = confirmPass.length > 0 && newPass !== confirmPass;
  const canSubmit  = strength === 4 && passMatch && !loading;

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!canSubmit) return;

  try {
    await handleResetPassword(token, newPass);

    setDone(true); 

    setTimeout(() => {
      navigate("/service-center/login");
    }, 2000);

  } catch (err) {
    console.log(err);
  }
};
  const inputStyle = (field: "new" | "confirm"): React.CSSProperties => {
    const isFocused  = focusedF === field;
    const isError    = field === "confirm" && passMismatch;
    const isSuccess  = field === "confirm" && passMatch;
    return {
      width: "100%", height: "46px", borderRadius: "8px",
      background: isFocused ? "rgba(59,130,246,0.05)" : "rgba(255,255,255,0.04)",
      border: isError
        ? "1px solid rgba(239,68,68,0.55)"
        : isSuccess
          ? "1px solid rgba(16,185,129,0.5)"
          : isFocused
            ? "1px solid rgba(59,130,246,0.55)"
            : "1px solid rgba(255,255,255,0.1)",
      boxShadow: isError
        ? "0 0 0 3px rgba(239,68,68,0.07)"
        : isSuccess
          ? "0 0 0 3px rgba(16,185,129,0.07)"
          : isFocused
            ? "0 0 0 3px rgba(59,130,246,0.08)"
            : "none",
      color: "#fff", fontSize: "13.5px",
      fontFamily: "'DM Sans', sans-serif",
      paddingLeft: "40px", paddingRight: "44px",
      outline: "none",
      transition: "border-color .18s, background .18s, box-shadow .18s",
    };
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.96); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes shaftMove {
          from { opacity: .1; transform: scaleY(.8); }
          to   { opacity: .6; transform: scaleY(1.1); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes checkPop {
          0%   { transform: scale(0.5); opacity: 0; }
          60%  { transform: scale(1.12); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes ringPulse {
          0%   { box-shadow: 0 0 0 0 rgba(16,185,129,0.35); }
          70%  { box-shadow: 0 0 0 14px rgba(16,185,129,0); }
          100% { box-shadow: 0 0 0 0 rgba(16,185,129,0); }
        }
        @keyframes barGrow {
          from { width: 0; }
          to   { width: 100%; }
        }

        .rp-root {
          min-height: 100vh;
          background: #060a14;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 32px 16px 48px;
          font-family: 'DM Sans', sans-serif;
          -webkit-font-smoothing: antialiased;
          position: relative; overflow: hidden;
        }
        .rp-root::before {
          content: '';
          position: absolute; inset: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 60% 50% at 20% 40%, rgba(29,78,216,.12) 0%, transparent 65%),
            radial-gradient(ellipse 45% 50% at 80% 70%, rgba(6,182,212,.06) 0%, transparent 60%);
        }
        .shaft {
          position: absolute; top: 0; width: 1.5px; border-radius: 1px;
          filter: blur(5px);
          animation: shaftMove ease-in-out infinite alternate;
        }
        .rp-wrapper {
          position: relative; z-index: 1;
          width: 100%; max-width: 420px;
          animation: fadeUp .5s ease both;
          display: flex; flex-direction: column; align-items: center;
        }
        .rp-card {
          width: 100%;
          background: rgba(10,15,28,.92);
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 16px;
          padding: 32px 32px 28px;
          backdrop-filter: blur(16px);
          box-shadow: 0 0 0 1px rgba(255,255,255,.04) inset, 0 24px 64px rgba(0,0,0,.55);
        }
        .submit-btn {
          width: 100%; height: 46px; border-radius: 8px; border: none;
          background: linear-gradient(135deg, #1d4ed8, #3b82f6);
          color: #fff; font-family: 'Syne', sans-serif;
          font-weight: 700; font-size: 12px; letter-spacing: .12em;
          text-transform: uppercase; cursor: pointer;
          box-shadow: 0 4px 18px rgba(59,130,246,.38);
          transition: transform .2s, box-shadow .2s;
          position: relative; overflow: hidden;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .submit-btn::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,.1), transparent);
          transform: translateX(-100%); transition: transform .5s;
        }
        .submit-btn:not(:disabled):hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 24px rgba(59,130,246,.52);
        }
        .submit-btn:not(:disabled):hover::after { transform: translateX(100%); }
        .submit-btn:disabled { opacity: .38; cursor: not-allowed; }

        .strength-bar-fill { transition: width .35s ease, background .35s ease; }
        .spin-icon { animation: spin .75s linear infinite; }

        .success-icon  { animation: checkPop .5s cubic-bezier(.34,1.56,.64,1) both; }
        .success-ring  { animation: ringPulse 1.8s ease 0.3s infinite; }
        .success-content { animation: fadeIn .4s ease .15s both; }

        input::placeholder { color: rgba(255,255,255,.2); }
      `}</style>

      <div className="rp-root">
        {/* Light shafts */}
        <div className="shaft" style={{ left: "22%", height: "55%", background: "linear-gradient(to bottom,rgba(59,130,246,.25),transparent)", animationDuration: "4.5s" }}/>
        <div className="shaft" style={{ left: "72%", height: "40%", background: "linear-gradient(to bottom,rgba(6,182,212,.15),transparent)", animationDuration: "6s", animationDirection: "alternate-reverse" }}/>

        <div className="rp-wrapper">

          {/* ── Logo ──────────────────────────────────────────────── */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "28px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
              <div style={{
                width: "36px", height: "36px", borderRadius: "9px",
                background: "linear-gradient(135deg,rgba(59,130,246,.18),rgba(6,182,212,.1))",
                border: "1px solid rgba(59,130,246,.35)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <BoltIcon />
              </div>
              <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "22px", color: "#fff", letterSpacing: "-0.3px" }}>
                Moto<span style={{ color: "#06b6d4" }}>Cline</span>
              </span>
            </div>
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,.32)", fontFamily: "'DM Sans',sans-serif", letterSpacing: "0.04em" }}>
              Garage Management Platform
            </p>
          </div>

          {/* ── Card ─────────────────────────────────────────────── */}
          <div className="rp-card">

            {!done ? (
              <>
                {/* Card header */}
                <div style={{ marginBottom: "24px" }}>
                  <div style={{
                    width: "46px", height: "46px", borderRadius: "12px", marginBottom: "16px",
                    background: "linear-gradient(135deg,rgba(59,130,246,.15),rgba(6,182,212,.08))",
                    border: "1px solid rgba(59,130,246,.28)",
                    display: "flex", alignItems: "center", justifyContent: "center", color: "#60a5fa",
                  }}>
                    <ShieldIcon />
                  </div>
                  <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "18px", color: "#fff", letterSpacing: "-0.3px", margin: "0 0 6px" }}>
                    Reset your password
                  </h1>
                  <p style={{ fontSize: "13px", color: "rgba(255,255,255,.38)", margin: 0, lineHeight: 1.6, fontFamily: "'DM Sans',sans-serif" }}>
                    Create a strong new password for your account. Make sure it's one you haven't used before.
                  </p>
                </div>

                {/* Divider */}
                <div style={{ height: "1px", background: "rgba(255,255,255,.06)", marginBottom: "22px" }} />

                {/* Error banner */}
                {error && (
                  <div style={{
                    display: "flex", alignItems: "center", gap: "10px",
                    borderRadius: "8px", padding: "10px 14px", marginBottom: "16px",
                    background: "rgba(239,68,68,.08)", border: "1px solid rgba(239,68,68,.22)",
                  }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round">
                      <circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/>
                    </svg>
                    <span style={{ fontSize: "12.5px", color: "#f87171", fontWeight: 500, fontFamily: "'DM Sans',sans-serif" }}>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit}>

                  {/* ── New Password ─────────────────────────────── */}
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", marginBottom: "7px", fontSize: "11.5px", fontWeight: 600, color: "rgba(255,255,255,.45)", letterSpacing: ".06em", textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif" }}>
                      New Password
                    </label>
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)", color: focusedF === "new" ? "#60a5fa" : "rgba(255,255,255,.25)", transition: "color .18s", pointerEvents: "none" }}>
                        <LockIcon />
                      </span>
                      <input
                        type={showNew ? "text" : "password"}
                        required
                        autoComplete="new-password"
                        placeholder="••••••••"
                        value={newPass}
                        onChange={e => setNewPass(e.target.value)}
                        onFocus={() => setFocused("new")}
                        onBlur={() => setFocused(null)}
                        style={inputStyle("new")}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNew(s => !s)}
                        style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: "2px", color: showNew ? "rgba(255,255,255,.6)" : "rgba(255,255,255,.28)", transition: "color .18s" }}
                        onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,.7)")}
                        onMouseLeave={e => (e.currentTarget.style.color = showNew ? "rgba(255,255,255,.6)" : "rgba(255,255,255,.28)")}
                      >
                        {showNew ? <EyeOpenIcon /> : <EyeClosedIcon />}
                      </button>
                    </div>

                    {/* Strength bar — only show when user has typed */}
                    {newPass.length > 0 && (
                      <div style={{ marginTop: "10px" }}>
                        {/* Track */}
                        <div style={{ display: "flex", gap: "4px", marginBottom: "8px" }}>
                          {[0, 1, 2, 3].map(i => (
                            <div key={i} style={{ flex: 1, height: "3px", borderRadius: "2px", background: "rgba(255,255,255,0.07)", overflow: "hidden" }}>
                              <div
                                className="strength-bar-fill"
                                style={{
                                  height: "100%", borderRadius: "2px",
                                  width: i < strength ? "100%" : "0%",
                                  background: meta.color,
                                }}
                              />
                            </div>
                          ))}
                        </div>

                        {/* Label + rules */}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                          <span style={{ fontSize: "11px", color: meta.color, fontWeight: 600, fontFamily: "'DM Sans',sans-serif" }}>
                            {meta.label}
                          </span>
                          <span style={{ fontSize: "11px", color: "rgba(255,255,255,.25)", fontFamily: "'DM Sans',sans-serif" }}>
                            {strength}/4 requirements
                          </span>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5px" }}>
                          {rules.map(r => {
                            const pass = r.test(newPass);
                            return (
                              <div key={r.label} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                <span style={{
                                  width: "16px", height: "16px", borderRadius: "50%", flexShrink: 0,
                                  display: "flex", alignItems: "center", justifyContent: "center",
                                  background: pass ? "rgba(16,185,129,0.15)" : "rgba(255,255,255,0.05)",
                                  border: `1px solid ${pass ? "rgba(16,185,129,0.35)" : "rgba(255,255,255,0.1)"}`,
                                  color: pass ? "#10b981" : "rgba(255,255,255,0.25)",
                                  transition: "all .2s",
                                }}>
                                  {pass ? <CheckIcon /> : <XSmallIcon />}
                                </span>
                                <span style={{ fontSize: "11px", color: pass ? "rgba(255,255,255,.55)" : "rgba(255,255,255,.25)", transition: "color .2s", fontFamily: "'DM Sans',sans-serif" }}>
                                  {r.label}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ── Confirm Password ─────────────────────────── */}
                  <div style={{ marginBottom: "22px" }}>
                    <label style={{ display: "block", marginBottom: "7px", fontSize: "11.5px", fontWeight: 600, color: "rgba(255,255,255,.45)", letterSpacing: ".06em", textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif" }}>
                      Confirm Password
                    </label>
                    <div style={{ position: "relative" }}>
                      <span style={{ position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)", color: passMatch ? "#10b981" : focusedF === "confirm" ? "#60a5fa" : "rgba(255,255,255,.25)", transition: "color .18s", pointerEvents: "none" }}>
                        <LockIcon />
                      </span>
                      <input
                        type={showConfirm ? "text" : "password"}
                        required
                        autoComplete="new-password"
                        placeholder="••••••••"
                        value={confirmPass}
                        onChange={e => setConfirmPass(e.target.value)}
                        onFocus={() => setFocused("confirm")}
                        onBlur={() => setFocused(null)}
                        style={inputStyle("confirm")}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(s => !s)}
                        style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: "2px", color: showConfirm ? "rgba(255,255,255,.6)" : "rgba(255,255,255,.28)", transition: "color .18s" }}
                        onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,.7)")}
                        onMouseLeave={e => (e.currentTarget.style.color = showConfirm ? "rgba(255,255,255,.6)" : "rgba(255,255,255,.28)")}
                      >
                        {showConfirm ? <EyeOpenIcon /> : <EyeClosedIcon />}
                      </button>
                    </div>

                    {/* Match / mismatch hint */}
                    {confirmPass.length > 0 && (
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "8px" }}>
                        <span style={{
                          width: "16px", height: "16px", borderRadius: "50%", flexShrink: 0,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          background: passMatch ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.1)",
                          border: `1px solid ${passMatch ? "rgba(16,185,129,0.35)" : "rgba(239,68,68,0.3)"}`,
                          color: passMatch ? "#10b981" : "#f87171",
                        }}>
                          {passMatch ? <CheckIcon /> : <XSmallIcon />}
                        </span>
                        <span style={{ fontSize: "11.5px", color: passMatch ? "#10b981" : "#f87171", fontFamily: "'DM Sans',sans-serif", fontWeight: 500 }}>
                          {passMatch ? "Passwords match" : "Passwords do not match"}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Submit */}
                  <button type="submit" className="submit-btn" disabled={!canSubmit}>
                    {loading ? (
                      <>
                        <svg className="spin-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                        </svg>
                        Updating…
                      </>
                    ) : "Reset Password"}
                  </button>

                </form>
              </>
            ) : (
              /* ── Success state ──────────────────────────────────── */
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "8px 0 4px" }}>
                <div
                  className="success-ring"
                  style={{
                    width: "80px", height: "80px", borderRadius: "50%", marginBottom: "24px",
                    background: "linear-gradient(135deg,rgba(16,185,129,.12),rgba(6,182,212,.08))",
                    border: "1px solid rgba(16,185,129,.3)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  <div className="success-icon" style={{ color: "#34d399" }}>
                    <CheckCircleIcon />
                  </div>
                </div>

                <div className="success-content" style={{ textAlign: "center", width: "100%" }}>
                  <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "18px", color: "#fff", letterSpacing: "-0.3px", margin: "0 0 10px" }}>
                    Password updated!
                  </h2>
                  <p style={{ fontSize: "13px", color: "rgba(255,255,255,.38)", margin: "0 0 24px", lineHeight: 1.65, fontFamily: "'DM Sans',sans-serif" }}>
                    Your password has been reset successfully. You can now sign in with your new password.
                  </p>

                  {/* Divider */}
                  <div style={{ height: "1px", background: "rgba(255,255,255,.06)", marginBottom: "22px" }} />

                  <button
                    type="button"
                    onClick={() => navigate("/service-center/login")}
                    className="submit-btn"
                  >
                    Sign In Now
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── Back to login ─────────────────────────────────────── */}
          {!done && (
            <div style={{ marginTop: "20px", textAlign: "center" }}>
              <button
                type="button"
                onClick={() => navigate("/service-center/login")}
                style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,.35)", fontSize: "13px", fontFamily: "'DM Sans',sans-serif", fontWeight: 500, padding: 0, transition: "color .2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,.65)")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,.35)")}
              >
                <ArrowLeftIcon />
                Back to Login
              </button>
            </div>
          )}

          {/* ── Footer links ──────────────────────────────────────── */}
          <div style={{ marginTop: "24px", display: "flex", alignItems: "center", gap: "16px" }}>
            {["Privacy Policy", "Terms of Service", "Contact Support"].map(l => (
              <a
                key={l} href="#"
                style={{ fontSize: "11.5px", color: "rgba(255,255,255,.25)", textDecoration: "none", transition: "color .2s", fontFamily: "'DM Sans',sans-serif" }}
                onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,.55)")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,.25)")}
              >
                {l}
              </a>
            ))}
          </div>

        </div>
      </div>
    </>
  );
}