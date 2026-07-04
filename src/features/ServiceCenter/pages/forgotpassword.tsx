// ForgotPassword.tsx
// Matches ServiceCenterLogin branding: navy #060a14, blue #3b82f6, cyan #06b6d4

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useServiceCenterAuth } from "../hooks/useServiceCenterAuth";
// ── Icons ─────────────────────────────────────────────────────────────────────
const BoltIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M13 2L4.5 13.5H11L10 22L20.5 10H14L13 2Z"
      fill="url(#bolt2)" stroke="url(#bolt2)" strokeWidth="0.5" strokeLinejoin="round"/>
    <defs>
      <linearGradient id="bolt2" x1="4" y1="2" x2="20" y2="22" gradientUnits="userSpaceOnUse">
        <stop stopColor="#3b82f6"/>
        <stop offset="1" stopColor="#06b6d4"/>
      </linearGradient>
    </defs>
  </svg>
);

const MailIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="M2 7l10 7 10-7"/>
  </svg>
);

const ArrowLeftIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <path d="M19 12H5M12 19l-7-7 7-7"/>
  </svg>
);

const CheckCircleIcon = () => (
  <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="m9 12 2 2 4-4"/>
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);

// ── Component ─────────────────────────────────────────────────────────────────
export default function ForgotPassword() {
  const navigate = useNavigate();
const { handleforgotpassword, loading, error } = useServiceCenterAuth();
  const [email, setEmail]       = useState("");
  const [focused, setFocused]   = useState(false);
  // const [loading, setLoading]   = useState(false);
  const [sent, setSent]         = useState(false);
 // const [error, setError]       = useState<string | null>(null);

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!email.trim()) return;

  try {
    await handleforgotpassword(email); 
    setSent(true);
  } catch (err) {
    console.log(err);
  }
}

  const inputStyle: React.CSSProperties = {
    width: "100%",
    height: "46px",
    borderRadius: "8px",
    background: focused ? "rgba(59,130,246,0.05)" : "rgba(255,255,255,0.04)",
    border: focused ? "1px solid rgba(59,130,246,0.55)" : "1px solid rgba(255,255,255,0.1)",
    boxShadow: focused ? "0 0 0 3px rgba(59,130,246,0.08)" : "none",
    color: "#fff",
    fontSize: "13.5px",
    fontFamily: "'DM Sans', sans-serif",
    paddingLeft: "40px",
    paddingRight: "14px",
    outline: "none",
    transition: "border-color .18s, background .18s, box-shadow .18s",
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
          0%   { box-shadow: 0 0 0 0 rgba(59,130,246,0.35); }
          70%  { box-shadow: 0 0 0 14px rgba(59,130,246,0); }
          100% { box-shadow: 0 0 0 0 rgba(59,130,246,0); }
        }

        .fp-root {
          min-height: 100vh;
          background: #060a14;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 32px 16px 48px;
          font-family: 'DM Sans', sans-serif;
          -webkit-font-smoothing: antialiased;
          position: relative;
          overflow: hidden;
        }
        .fp-root::before {
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
        .fp-wrapper {
          position: relative; z-index: 1;
          width: 100%; max-width: 400px;
          animation: fadeUp .5s ease both;
          display: flex; flex-direction: column; align-items: center;
        }
        .fp-card {
          width: 100%;
          background: rgba(10,15,28,.92);
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 16px;
          padding: 32px 32px 28px;
          backdrop-filter: blur(16px);
          box-shadow:
            0 0 0 1px rgba(255,255,255,.04) inset,
            0 24px 64px rgba(0,0,0,.55);
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
        .submit-btn:disabled { opacity: .42; cursor: not-allowed; }
        .spin-icon { animation: spin .75s linear infinite; }

        .success-icon {
          animation: checkPop .5s cubic-bezier(.34,1.56,.64,1) both;
        }
        .success-ring {
          animation: ringPulse 1.8s ease 0.3s infinite;
        }
        .success-content {
          animation: fadeIn .4s ease .15s both;
        }

        input::placeholder { color: rgba(255,255,255,.2); }
      `}</style>

      <div className="fp-root">
        {/* Light shafts */}
        <div className="shaft" style={{ left: "22%", height: "55%", background: "linear-gradient(to bottom,rgba(59,130,246,.25),transparent)", animationDuration: "4.5s" }}/>
        <div className="shaft" style={{ left: "72%", height: "40%", background: "linear-gradient(to bottom,rgba(6,182,212,.15),transparent)", animationDuration: "6s", animationDirection: "alternate-reverse" }}/>

        <div className="fp-wrapper">

          {/* ── Logo ────────────────────────────────────────────────── */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "28px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
              <div style={{
                width: "36px", height: "36px", borderRadius: "9px",
                background: "linear-gradient(135deg,rgba(59,130,246,.18),rgba(6,182,212,.1))",
                border: "1px solid rgba(59,130,246,.35)",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
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

          {/* ── Card ─────────────────────────────────────────────────── */}
          <div className="fp-card">

            {!sent ? (
              <>
                {/* Header */}
                <div style={{ marginBottom: "24px" }}>
                  <div style={{
                    width: "46px", height: "46px", borderRadius: "12px", marginBottom: "16px",
                    background: "linear-gradient(135deg,rgba(59,130,246,.15),rgba(6,182,212,.08))",
                    border: "1px solid rgba(59,130,246,.28)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#60a5fa",
                  }}>
                    <MailIcon />
                  </div>
                  <h1 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "18px", color: "#fff", letterSpacing: "-0.3px", margin: "0 0 6px" }}>
                    Forgot your password?
                  </h1>
                  <p style={{ fontSize: "13px", color: "rgba(255,255,255,.38)", margin: 0, lineHeight: 1.6, fontFamily: "'DM Sans',sans-serif" }}>
                    No worries. Enter the email address linked to your account and we'll send you a reset link.
                  </p>
                </div>

                {/* Divider */}
                <div style={{ height: "1px", background: "rgba(255,255,255,.06)", marginBottom: "22px" }} />

                {/* Error */}
                {error && (
                  <div style={{
                    display: "flex", alignItems: "center", gap: "10px",
                    borderRadius: "8px", padding: "10px 14px", marginBottom: "16px",
                    background: "rgba(239,68,68,.08)", border: "1px solid rgba(239,68,68,.22)",
                  }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2" strokeLinecap="round">
                      <circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/>
                    </svg>
                    <span style={{ fontSize: "12.5px", color: "#f87171", fontWeight: 500, fontFamily: "'DM Sans',sans-serif" }}>
                      {error}
                    </span>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit}>
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", marginBottom: "7px", fontSize: "11.5px", fontWeight: 600, color: "rgba(255,255,255,.45)", letterSpacing: ".06em", textTransform: "uppercase", fontFamily: "'DM Sans',sans-serif" }}>
                      Email Address
                    </label>
                    <div style={{ position: "relative" }}>
                      <span style={{
                        position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)",
                        color: focused ? "#60a5fa" : "rgba(255,255,255,.25)",
                        transition: "color .18s", pointerEvents: "none",
                      }}>
                        <MailIcon />
                      </span>
                      <input
                        type="email"
                        required
                        autoComplete="email"
                        placeholder="name@gmail.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                        style={inputStyle}
                      />
                    </div>
                  </div>

                  <button type="submit" className="submit-btn" disabled={loading || !email.trim()}>
                    {loading ? (
                      <>
                        <svg className="spin-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                        </svg>
                        Sending…
                      </>
                    ) : "Send Reset Link"}
                  </button>
                </form>
              </>
            ) : (
              /* ── Success state ──────────────────────────────────── */
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "8px 0 4px" }}>
                {/* Animated check */}
                <div
                  className="success-ring"
                  style={{
                    width: "80px", height: "80px", borderRadius: "50%", marginBottom: "24px",
                    background: "linear-gradient(135deg,rgba(59,130,246,.12),rgba(6,182,212,.08))",
                    border: "1px solid rgba(59,130,246,.28)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  <div className="success-icon" style={{ color: "#60a5fa" }}>
                    <CheckCircleIcon />
                  </div>
                </div>

                <div className="success-content" style={{ textAlign: "center", width: "100%" }}>
                  <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "18px", color: "#fff", letterSpacing: "-0.3px", margin: "0 0 10px" }}>
                    Check your inbox
                  </h2>
                  <p style={{ fontSize: "13px", color: "rgba(255,255,255,.38)", margin: "0 0 6px", lineHeight: 1.65, fontFamily: "'DM Sans',sans-serif" }}>
                    We sent a password reset link to
                  </p>
                  <div style={{
                    display: "inline-block", padding: "6px 16px", borderRadius: "100px", marginBottom: "22px",
                    background: "rgba(59,130,246,.08)", border: "1px solid rgba(59,130,246,.22)",
                    fontSize: "13.5px", fontWeight: 600, color: "#93c5fd", fontFamily: "'DM Sans',sans-serif",
                    wordBreak: "break-all",
                  }}>
                    {email}
                  </div>

                  {/* Divider */}
                  <div style={{ height: "1px", background: "rgba(255,255,255,.06)", marginBottom: "18px" }} />

                  <p style={{ fontSize: "12px", color: "rgba(255,255,255,.25)", marginBottom: "18px", lineHeight: 1.6, fontFamily: "'DM Sans',sans-serif" }}>
                    Didn't receive it? Check your spam folder or{" "}
                    <button
                      type="button"
                      onClick={() => { setSent(false); setSent(false); }}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "#3b82f6", fontSize: "12px", fontWeight: 600, padding: 0, fontFamily: "'DM Sans',sans-serif" }}
                      onMouseEnter={e => (e.currentTarget.style.color = "#60a5fa")}
                      onMouseLeave={e => (e.currentTarget.style.color = "#3b82f6")}
                    >
                      try a different email
                    </button>
                    .
                  </p>

                  <button
                    type="button"
                    onClick={() => navigate("/service-center/login")}
                    className="submit-btn"
                    style={{ fontSize: "12px" } as React.CSSProperties}
                  >
                    Back to Login
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── Back to login (pre-send only) ────────────────────── */}
          {!sent && (
            <div style={{ marginTop: "20px", textAlign: "center" }}>
              <button
                type="button"
                onClick={() => navigate("/service-center/login")}
                style={{
                  display: "inline-flex", alignItems: "center", gap: "6px",
                  background: "none", border: "none", cursor: "pointer",
                  color: "rgba(255,255,255,.35)", fontSize: "13px",
                  fontFamily: "'DM Sans',sans-serif", fontWeight: 500, padding: 0,
                  transition: "color .2s",
                }}
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