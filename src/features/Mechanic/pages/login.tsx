// MechanicLogin.tsx
// Matches reference: dark #0d1117 bg, centered card, cyan #06b6d4 accent
// Stack: React + TypeScript + Tailwind + inline styles for custom tokens

import React, { useState, useEffect } from "react";
import { useMechanicAuth } from '../hooks/useMechanicAuth';
import { useNavigate } from "react-router-dom";

// ── Icons ─────────────────────────────────────────────────────────────────────
const MailIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7"/>
  </svg>
);

const LockIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/>
    <path d="M7 11V7a5 5 0 0110 0v4"/>
  </svg>
);

const EyeOnIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const EyeOffIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);

const HelpIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

const BoltIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
    <path d="M13 2L4.5 13.5H11L10 22L20.5 10H14L13 2Z"
      fill="url(#bolt)" stroke="url(#bolt)" strokeWidth="0.5" strokeLinejoin="round"/>
    <defs>
      <linearGradient id="bolt" x1="4" y1="2" x2="20" y2="22" gradientUnits="userSpaceOnUse">
        <stop stopColor="#3b82f6"/><stop offset="1" stopColor="#06b6d4"/>
      </linearGradient>
    </defs>
  </svg>
);

const ShieldIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
    stroke="#06b6d4" strokeWidth="1.8" strokeLinecap="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    <path d="m9 12 2 2 4-4"/>
  </svg>
);

// ── Component ─────────────────────────────────────────────────────────────────
export default function MechanicLogin() {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [focused,  setFocused]  = useState<"email" | "pass" | null>(null);
  const [mounted,  setMounted]  = useState(false);

  const { login, loading, error } = useMechanicAuth();
  const navigate = useNavigate();

  useEffect(() => {
   
    const t = setTimeout(() => setMounted(true), 30);
    return () => clearTimeout(t);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
      // Redirect to mechanic dashboard
      navigate("/mechanic/dashboard");
    } catch (err) {
   
    }
  };


  const inputBox = (field: "email" | "pass"): React.CSSProperties => ({
    display:        "flex",
    alignItems:     "center",
    gap:            "10px",
    height:         "46px",
    borderRadius:   "10px",
    padding:        "0 14px",
    background:     focused === field
      ? "rgba(6,182,212,0.05)"
      : "rgba(255,255,255,0.04)",
    border: focused === field
      ? "1px solid rgba(6,182,212,0.55)"
      : "1px solid rgba(255,255,255,0.09)",
    boxShadow: focused === field
      ? "0 0 0 3px rgba(6,182,212,0.08)"
      : "none",
    transition: "all 0.18s ease",
    cursor:     "text",
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          font-family: 'DM Sans', sans-serif;
          background: #0c1117;
          -webkit-font-smoothing: antialiased;
        }
        input::placeholder { color: rgba(255,255,255,0.2); }
        input:focus { outline: none; }

        @keyframes cardIn {
          from { opacity: 0; transform: translateY(22px) scale(0.985); }
          to   { opacity: 1; transform: translateY(0)    scale(1); }
        }
        @keyframes shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes pulseDot {
          0%,100% { opacity:1; transform:scale(1); }
          50%     { opacity:0.3; transform:scale(1.6); }
        }
        @keyframes bgPulse {
          0%,100% { opacity: 0.6; }
          50%     { opacity: 1; }
        }

        .card-animate {
          animation: cardIn 0.5s cubic-bezier(0.22,1,0.36,1) both;
        }
        .submit-shimmer::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent);
          transform: translateX(-100%);
          transition: transform 0.55s ease;
        }
        .submit-shimmer:not(:disabled):hover::after {
          transform: translateX(100%);
        }
      `}</style>

      {/* ── Full-page shell ───────────────────────────────────────── */}
      <div
        className="min-h-screen flex flex-col"
        style={{ background: "#0c1117", position: "relative", overflow: "hidden" }}
      >
        {/* Subtle radial glows */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse 55% 45% at 50% 50%, rgba(6,182,212,0.055) 0%, transparent 65%)",
          animation: "bgPulse 6s ease-in-out infinite",
        }}/>
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse 35% 30% at 20% 20%, rgba(59,130,246,0.06) 0%, transparent 60%)",
        }}/>
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse 30% 28% at 80% 80%, rgba(6,182,212,0.04) 0%, transparent 55%)",
        }}/>

        {/* ── Top nav bar ─────────────────────────────────────────── */}
        <header
          className="flex items-center justify-between px-6 flex-shrink-0"
          style={{
            height: "52px",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            position: "relative", zIndex: 10,
          }}
        >
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div
              className="flex items-center justify-center rounded-lg"
              style={{
                width: "28px", height: "28px",
                background: "linear-gradient(135deg,rgba(59,130,246,0.2),rgba(6,182,212,0.12))",
                border: "1px solid rgba(59,130,246,0.3)",
              }}
            >
              <BoltIcon />
            </div>
            <span
              className="text-white font-extrabold text-[15px] tracking-tight"
              style={{ fontFamily: "'Syne',sans-serif", letterSpacing: "-0.3px" }}
            >
              Moto<span style={{ color: "#06b6d4" }}>cline</span>
            </span>
          </div>

          {/* Help */}
          <button
            style={{
              width: "32px", height: "32px", borderRadius: "8px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.4)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", transition: "color 0.2s, border-color 0.2s",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.75)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.18)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.4)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.08)";
            }}
          >
            <HelpIcon />
          </button>
        </header>

        {/* ── Centered content ────────────────────────────────────── */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">

          {/* Role badge */}
          <div
            className={`flex items-center gap-2 mb-6 transition-all duration-500 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
            style={{
              background: "rgba(6,182,212,0.08)",
              border: "1px solid rgba(6,182,212,0.2)",
              borderRadius: "100px",
              padding: "5px 14px",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "#06b6d4", animation: "pulseDot 2s infinite" }}
            />
            <span
              className="text-[11.5px] font-semibold tracking-wider uppercase"
              style={{ color: "#06b6d4", fontFamily: "'DM Sans',sans-serif", letterSpacing: "0.09em" }}
            >
              Mechanic Portal
            </span>
          </div>

          {/* Heading */}
          <div
            className={`text-center mb-8 transition-all duration-500 delay-75 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}
          >
            <h1
              className="text-white font-extrabold tracking-tight mb-2"
              style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(1.6rem,4vw,2.1rem)", letterSpacing: "-0.5px" }}
            >
              Welcome back
            </h1>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.38)", fontFamily: "'DM Sans',sans-serif" }}>
              Sign in to your Motocline mechanic account
            </p>
          </div>

          {/* ── Card ──────────────────────────────────────────────── */}
          <div
            className={`w-full card-animate ${mounted ? "" : "opacity-0"}`}
            style={{
              maxWidth: "420px",
              background: "linear-gradient(160deg, rgba(18,26,44,0.95) 0%, rgba(12,18,30,0.98) 100%)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "18px",
              padding: "32px 30px 28px",
              backdropFilter: "blur(16px)",
              boxShadow: "0 24px 64px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04) inset",
            }}
          >
            {/* Error banner */}
            {error && (
              <div
                className="flex items-center gap-2.5 rounded-xl px-4 py-3 mb-5"
                style={{
                  background: "rgba(239,68,68,0.09)",
                  border: "1px solid rgba(239,68,68,0.25)",
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                  stroke="#f87171" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/>
                </svg>
                <span style={{ fontSize: "13px", color: "#f87171", fontFamily: "'DM Sans',sans-serif" }}>
                  {error}
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>

              {/* Email */}
              <div className="mb-4">
                <label
                  className="block mb-2"
                  style={{
                    fontSize: "11px", fontWeight: 700,
                    color: "rgba(255,255,255,0.4)",
                    letterSpacing: "0.09em", textTransform: "uppercase",
                    fontFamily: "'DM Sans',sans-serif",
                  }}
                >
                  Email Address
                </label>
                <div
                  style={inputBox("email")}
                  onClick={() => (document.getElementById("mc-email") as HTMLInputElement)?.focus()}
                >
                  <span style={{ color: focused === "email" ? "rgba(6,182,212,0.75)" : "rgba(255,255,255,0.25)", flexShrink: 0, transition: "color 0.18s" }}>
                    <MailIcon />
                  </span>
                  <input
                    id="mc-email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onFocus={() => setFocused("email")}
                    onBlur={() => setFocused(null)}
                    placeholder="mechanic@motocline.com"
                    autoComplete="email"
                    required
                    style={{
                      background: "transparent", border: "none", outline: "none",
                      color: "#fff", fontSize: "13.5px", flex: 1,
                      fontFamily: "'DM Sans',sans-serif",
                    }}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="mb-1.5">
                <label
                  className="block mb-2"
                  style={{
                    fontSize: "11px", fontWeight: 700,
                    color: "rgba(255,255,255,0.4)",
                    letterSpacing: "0.09em", textTransform: "uppercase",
                    fontFamily: "'DM Sans',sans-serif",
                  }}
                >
                  Password
                </label>
                <div
                  style={inputBox("pass")}
                  onClick={() => (document.getElementById("mc-pass") as HTMLInputElement)?.focus()}
                >
                  <span style={{ color: focused === "pass" ? "rgba(6,182,212,0.75)" : "rgba(255,255,255,0.25)", flexShrink: 0, transition: "color 0.18s" }}>
                    <LockIcon />
                  </span>
                  <input
                    id="mc-pass"
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onFocus={() => setFocused("pass")}
                    onBlur={() => setFocused(null)}
                    placeholder="••••••••••"
                    autoComplete="current-password"
                    required
                    style={{
                      background: "transparent", border: "none", outline: "none",
                      color: "#fff", fontSize: "13.5px", flex: 1,
                      fontFamily: "'DM Sans',sans-serif",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(s => !s)}
                    style={{
                      background: "none", border: "none", cursor: "pointer", padding: "2px",
                      color: showPass ? "rgba(6,182,212,0.7)" : "rgba(255,255,255,0.28)",
                      flexShrink: 0, display: "flex", alignItems: "center",
                      transition: "color 0.18s",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.65)")}
                    onMouseLeave={e => (e.currentTarget.style.color = showPass ? "rgba(6,182,212,0.7)" : "rgba(255,255,255,0.28)")}
                  >
                    {showPass ? <EyeOnIcon /> : <EyeOffIcon />}
                  </button>
                </div>
              </div>

              {/* Forgot */}
              <div className="flex justify-end mb-6">
                <button
                  type="button"
                  onClick={() => console.log("Forgot password clicked")}
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    fontSize: "12.5px", color: "#06b6d4", fontWeight: 500,
                    fontFamily: "'DM Sans',sans-serif", padding: 0,
                    transition: "color 0.18s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#22d3ee")}
                  onMouseLeave={e => (e.currentTarget.style.color = "#06b6d4")}
                >
                  
                </button>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || !email || !password}
                className="submit-shimmer"
                style={{
                  width: "100%", height: "48px",
                  borderRadius: "11px", border: "none",
                  background: loading || !email || !password
                    ? "rgba(6,182,212,0.35)"
                    : "linear-gradient(135deg, #0891b2 0%, #06b6d4 60%, #22d3ee 100%)",
                  color: "#fff",
                  fontFamily: "'Syne',sans-serif",
                  fontWeight: 700, fontSize: "14px", letterSpacing: "0.03em",
                  cursor: loading || !email || !password ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "9px",
                  boxShadow: loading || !email || !password
                    ? "none"
                    : "0 4px 22px rgba(6,182,212,0.38), 0 0 0 1px rgba(6,182,212,0.2)",
                  transition: "transform 0.2s, box-shadow 0.2s, background 0.2s",
                  position: "relative", overflow: "hidden",
                }}
                onMouseEnter={e => {
                  if (!loading && email && password) {
                    (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 28px rgba(6,182,212,0.52), 0 0 0 1px rgba(6,182,212,0.3)";
                  }
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 22px rgba(6,182,212,0.38), 0 0 0 1px rgba(6,182,212,0.2)";
                }}
              >
                {loading ? (
                  <>
                    <svg
                      style={{ animation: "spin 0.75s linear infinite" }}
                      width="16" height="16" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2.5"
                    >
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                    </svg>
                    Signing in…
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRightIcon />
                  </>
                )}
              </button>

            </form>
          </div>

          {/* Security note */}
          <div
            className={`flex items-center gap-2 mt-6 transition-all duration-500 delay-150 ${mounted ? "opacity-100" : "opacity-0"}`}
          >
            <ShieldIcon />
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.25)", fontFamily: "'DM Sans',sans-serif" }}>
              Secured with end-to-end encryption
            </span>
          </div>

        </div>

        {/* ── Footer ──────────────────────────────────────────────── */}
        <footer
          className="flex items-center justify-center gap-5 py-4 flex-shrink-0"
          style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
        >
          {["Privacy Policy", "Terms of Service", "Support"].map(l => (
            <a
              key={l}
              href="#"
              style={{
                fontSize: "11.5px", color: "rgba(255,255,255,0.22)",
                textDecoration: "none", transition: "color 0.18s",
                fontFamily: "'DM Sans',sans-serif",
              }}
              onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.22)")}
            >
              {l}
            </a>
          ))}
        </footer>

      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </>
  );
}