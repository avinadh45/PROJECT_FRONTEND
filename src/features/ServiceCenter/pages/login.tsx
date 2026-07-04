// ServiceCenterLogin.tsx
// Matches reference screenshot layout + Motocline branding (navy #060a14, blue #3b82f6, cyan #06b6d4)
// Stack: React + TypeScript + Tailwind

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useServiceCenterAuth } from "../hooks/useServiceCenterAuth";

// ── Icons ─────────────────────────────────────────────────────────────────────
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
    <path d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
  </svg>
);

const BoltIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M13 2L4.5 13.5H11L10 22L20.5 10H14L13 2Z"
      fill="url(#bolt)" stroke="url(#bolt)" strokeWidth="0.5" strokeLinejoin="round"/>
    <defs>
      <linearGradient id="bolt" x1="4" y1="2" x2="20" y2="22" gradientUnits="userSpaceOnUse">
        <stop stopColor="#3b82f6"/>
        <stop offset="1" stopColor="#06b6d4"/>
      </linearGradient>
    </defs>
  </svg>
);

const EyeOpenIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const EyeClosedIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.2" strokeLinecap="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);

// ── Props ─────────────────────────────────────────────────────────────────────
interface ServiceCenterLoginProps {
  onSubmit?:   (email: string, password: string) => void;
  onGoogle?:   () => void;
  onForgot?:   () => void;
  onRegister?: () => void;
  loading?:    boolean;
  error?:      string;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function ServiceCenterLogin({
  onGoogle,
  onForgot,
}: ServiceCenterLoginProps) {
  const navigate = useNavigate();
  const { login, loading, errors } = useServiceCenterAuth();

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [focusedField, setFocused] = useState<"email" | "pass" | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
    
      navigate("/service-center/dashboard"); 
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  
  const inputStyle = (field: "email" | "pass"): React.CSSProperties => ({
    width: "100%",
    height: "44px",
    borderRadius: "8px",
    background: focusedField === field
      ? "rgba(59,130,246,0.05)"
      : "rgba(255,255,255,0.04)",
    border: focusedField === field
      ? "1px solid rgba(59,130,246,0.55)"
      : "1px solid rgba(255,255,255,0.1)",
    boxShadow: focusedField === field
      ? "0 0 0 3px rgba(59,130,246,0.08)"
      : "none",
    color: "#fff",
    fontSize: "13.5px",
    fontFamily: "'DM Sans', sans-serif",
    paddingLeft: "14px",
    paddingRight: field === "pass" ? "42px" : "14px",
    outline: "none",
    transition: "border-color .18s, background .18s, box-shadow .18s",
  });

  return (
    <>
      {/* ── Global styles ─────────────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shaftMove {
          from { opacity: .1; transform: scaleY(.8); }
          to   { opacity: .6; transform: scaleY(1.1); }
        }
        @keyframes shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .login-root {
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

        /* Radial glows */
        .login-root::before {
          content: '';
          position: absolute; inset: 0; pointer-events: none;
          background:
            radial-gradient(ellipse 60% 50% at 20% 40%, rgba(29,78,216,.12) 0%, transparent 65%),
            radial-gradient(ellipse 45% 50% at 80% 70%, rgba(6,182,212,.06) 0%, transparent 60%);
        }

        /* Light shafts */
        .shaft {
          position: absolute; top: 0; width: 1.5px; border-radius: 1px;
          filter: blur(5px);
          animation: shaftMove ease-in-out infinite alternate;
        }

        /* Wrapper that animates in */
        .login-wrapper {
          position: relative; z-index: 1;
          width: 100%; max-width: 400px;
          animation: fadeUp .5s ease both;
          display: flex; flex-direction: column; align-items: center;
        }

        /* Card */
        .login-card {
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

        /* Google btn */
        .google-btn {
          width: 100%; height: 42px; border-radius: 8px;
          background: rgba(255,255,255,.05);
          border: 1px solid rgba(255,255,255,.12);
          color: rgba(255,255,255,.82);
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px; font-weight: 500;
          display: flex; align-items: center; justify-content: center; gap: 9px;
          cursor: pointer;
          transition: background .2s, border-color .2s;
        }
        .google-btn:hover {
          background: rgba(255,255,255,.09);
          border-color: rgba(255,255,255,.2);
        }

        /* OR divider */
        .or-row {
          display: flex; align-items: center; gap: 10px;
          margin: 18px 0;
        }
        .or-line { flex: 1; height: 1px; background: rgba(255,255,255,.07); }
        .or-label {
          font-size: 11px; color: rgba(255,255,255,.25);
          letter-spacing: .08em; text-transform: uppercase;
        }

        /* Submit btn */
        .submit-btn {
          width: 100%; height: 44px; border-radius: 8px; border: none;
          background: linear-gradient(135deg, #1d4ed8, #3b82f6);
          color: #fff; font-family: 'Syne', sans-serif;
          font-weight: 700; font-size: 12px; letter-spacing: .12em;
          text-transform: uppercase; cursor: pointer;
          box-shadow: 0 4px 18px rgba(59,130,246,.38);
          transition: transform .2s, box-shadow .2s;
          position: relative; overflow: hidden;
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
        .submit-btn:not(:disabled):active { transform: translateY(0); }
        .submit-btn:disabled { opacity: .42; cursor: not-allowed; }

        /* Spinner */
        .spin-icon { animation: spin .75s linear infinite; display: inline-block; }

        input::placeholder { color: rgba(255,255,255,.2); }
      `}</style>

      {/* ── Page ─────────────────────────────────────────────────── */}
      <div className="login-root">
        {/* Shafts */}
        <div className="shaft" style={{ left:"22%", height:"55%", background:"linear-gradient(to bottom,rgba(59,130,246,.25),transparent)", animationDuration:"4.5s" }}/>
        <div className="shaft" style={{ left:"72%", height:"40%", background:"linear-gradient(to bottom,rgba(6,182,212,.15),transparent)", animationDuration:"6s", animationDirection:"alternate-reverse" }}/>

        <div className="login-wrapper">

          {/* ── Logo ─────────────────────────────────────────────── */}
          <div className="flex flex-col items-center mb-7">
            {/* Logo mark */}
            <div className="flex items-center gap-2.5 mb-1.5">
              {/* Bolt box */}
              <div
                className="w-9 h-9 rounded-[9px] flex items-center justify-center flex-shrink-0"
                style={{ background: "linear-gradient(135deg,rgba(59,130,246,.18),rgba(6,182,212,.1))", border: "1px solid rgba(59,130,246,.35)" }}
              >
                <BoltIcon />
              </div>
              {/* Wordmark */}
              <span
                className="text-white text-[22px] tracking-[-0.3px]"
                style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800 }}
              >
                Moto<span style={{ color: "#06b6d4" }}>Cline</span>
              </span>
            </div>
            {/* Tagline */}
            <p className="text-[12px] tracking-[0.04em]" style={{ color: "rgba(255,255,255,.32)", fontFamily: "'DM Sans',sans-serif" }}>
              Garage Management Platform
            </p>
          </div>

          {/* ── Card ─────────────────────────────────────────────── */}
          <div className="login-card">

            {/* Title */}
            <h1
              className="text-white text-center mb-6"
              style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "18px", letterSpacing: "-0.3px" }}
            >
              Log in to your account
            </h1>

            {/* Google */}
            <button className="google-btn" type="button" onClick={() => onGoogle?.()}>
              <GoogleIcon />
              Sign in with Google
            </button>

            {/* OR */}
            <div className="or-row">
              <div className="or-line"/>
              <span className="or-label">or email</span>
              <div className="or-line"/>
            </div>

            {/* Error banner */}
          {errors.general && (
  <div
    className="flex items-center gap-2.5 rounded-lg px-3.5 py-2.5 mb-4"
    style={{
      background: "rgba(239,68,68,.08)",
      border: "1px solid rgba(239,68,68,.22)",
    }}
  >
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="m15 9-6 6M9 9l6 6" />
    </svg>

    <span
      style={{
        fontSize: "12.5px",
        color: "#f87171",
        fontWeight: 500,
      }}
    >
      {errors.general}
    </span>
  </div>
)}

            {/* Form */}
            <form onSubmit={handleSubmit}>

              {/* Email */}
              <div className="mb-4">
                <label
                  htmlFor="sc-email"
                  className="block mb-1.5"
                  style={{ fontSize:"11.5px", fontWeight:600, color:"rgba(255,255,255,.45)", letterSpacing:".06em", textTransform:"uppercase" }}
                >
                  Email Address
                </label>
                <input
                  id="sc-email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="name@gmail.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused(null)}
                  style={inputStyle("email")}
                />
              </div>

              {/* Password */}
              <div className="mb-5">
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="sc-password"
                    style={{ fontSize:"11.5px", fontWeight:600, color:"rgba(255,255,255,.45)", letterSpacing:".06em", textTransform:"uppercase" }}
                  >
                    Password
                  </label>
                  <button
                    type="button"
                     onClick={() => navigate("/service-center/forgot-password")}
                    style={{ fontSize:"12px", color:"#3b82f6", fontWeight:500, background:"none", border:"none", cursor:"pointer", padding:0, fontFamily:"'DM Sans',sans-serif" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#60a5fa")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#3b82f6")}
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    id="sc-password"
                    type={showPass ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onFocus={() => setFocused("pass")}
                    onBlur={() => setFocused(null)}
                    style={inputStyle("pass")}  
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                    style={{ background:"none", border:"none", cursor:"pointer", padding:"2px", color: showPass ? "rgba(255,255,255,.6)" : "rgba(255,255,255,.3)" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,.7)")}
                    onMouseLeave={e => (e.currentTarget.style.color = showPass ? "rgba(255,255,255,.6)" : "rgba(255,255,255,.3)")}
                  >
                    {showPass ? <EyeOpenIcon /> : <EyeClosedIcon />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="submit-btn"
                disabled={loading || !email || !password}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="spin-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                    </svg>
                    Signing in…
                  </span>
                ) : "Confirm Login"}
              </button>

            </form>
          </div>

          {/* ── Below card ────────────────────────────────────────── */}
          <div className="mt-5 text-center">
            <p style={{ fontSize:"13px", color:"rgba(255,255,255,.35)" }}>
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/service-center/register")}
                className="inline-flex items-center gap-1 font-semibold transition-colors"
                style={{ background:"none", border:"none", cursor:"pointer", color:"#3b82f6", fontSize:"13px", fontFamily:"'DM Sans',sans-serif", fontWeight:600, padding:0 }}
                onMouseEnter={e => (e.currentTarget.style.color = "#60a5fa")}
                onMouseLeave={e => (e.currentTarget.style.color = "#3b82f6")}
              >
                Sign up as Service Center
                <ArrowRightIcon />
              </button>
            </p>
          </div>

          {/* ── Footer links ──────────────────────────────────────── */}
          <div className="mt-5 flex items-center gap-4">
            {["Privacy Policy", "Terms of Service", "Contact Support"].map((l) => (
              <a
                key={l}
                href="#"
                style={{ fontSize:"11.5px", color:"rgba(255,255,255,.25)", textDecoration:"none", transition:"color .2s" }}
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