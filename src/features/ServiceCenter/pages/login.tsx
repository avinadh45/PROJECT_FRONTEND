import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useServiceCenterAuth } from "../hooks/useServiceCenterAuth";

// ── Icons ─────────────────────────────────────────────────────────────────────
const GoogleIcon = () => (
  <svg width="17" height="17" viewBox="0 0 18 18" fill="none">
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

const ArrowRightIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);

const AlertCircleIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#f87171" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="m15 9-6 6M9 9l6 6" />
  </svg>
);

// ── Signature visual: single-line garage illustration ────────────────────────
// A motorcycle up in a service bay, drawn in one accent gradient stroke.
// Structural elements (walls, roof, shutter, pegboard) stay faint so the bike
// itself carries the color and the eye.
const GarageLineArt = () => (
  <svg viewBox="0 0 440 400" width="100%" height="100%" style={{ maxWidth: "420px" }} aria-hidden="true">
    <defs>
      <linearGradient id="garageGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#5eb7ff" />
        <stop offset="100%" stopColor="#06b6d4" />
      </linearGradient>
      <radialGradient id="bulbGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#ffe9a8" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#ffe9a8" stopOpacity="0" />
      </radialGradient>
    </defs>

    <g stroke="rgba(255,255,255,0.14)" strokeWidth="1.3" fill="none" strokeLinecap="round" strokeLinejoin="round">
      {/* Roof + walls */}
      <path d="M30 148 L220 52 L410 148" />
      <path d="M40 148 L40 336" />
      <path d="M400 148 L400 336" />
      <path d="M14 336 L426 336" />

      {/* Rolled-up shutter door */}
      <rect x="146" y="150" width="148" height="46" />
      <path d="M146 162 H294 M146 174 H294 M146 186 H294" />
      <path d="M146 150 L146 336 M294 150 L294 336" />

      {/* Pegboard + wrench */}
      <rect x="66" y="168" width="46" height="62" rx="3" />
      <circle cx="80" cy="182" r="1.6" fill="rgba(255,255,255,0.25)" />
      <circle cx="98" cy="182" r="1.6" fill="rgba(255,255,255,0.25)" />
      <circle cx="80" cy="200" r="1.6" fill="rgba(255,255,255,0.25)" />
      <circle cx="98" cy="200" r="1.6" fill="rgba(255,255,255,0.25)" />
    </g>

    {/* Hanging bulb */}
    <g className="scl-bulb">
      <circle cx="352" cy="196" r="22" fill="url(#bulbGlow)" />
      <path d="M352 150 L352 182" stroke="rgba(255,255,255,0.2)" strokeWidth="1.3" />
      <circle cx="352" cy="190" r="8" fill="none" stroke="#ffe9a8" strokeWidth="1.4" />
    </g>

    {/* Wrench accent on pegboard */}
    <path
      d="M78 214 L92 228 M74 210 a5 5 0 117 7 M96 232 a5 5 0 11-7-7"
      stroke="url(#garageGrad)" strokeWidth="2" fill="none" strokeLinecap="round"
    />

    {/* Motorcycle — the focal element */}
    <g stroke="url(#garageGrad)" strokeWidth="2.3" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="162" cy="296" r="40" />
      <circle cx="300" cy="296" r="40" />
      <circle cx="162" cy="296" r="5" />
      <circle cx="300" cy="296" r="5" />

      <path d="M162 296 L150 248" />
      <path d="M150 248 Q170 218 206 214" />
      <path d="M206 214 L250 209" />
      <path d="M250 209 Q270 207 281 194" />
      <path d="M281 194 L281 172" />
      <path d="M281 172 L256 162" />
      <path d="M281 172 L306 162" />
      <path d="M281 194 L300 296" />
      <path d="M162 296 L120 300" />
      <path d="M120 300 L98 298" />
      <path d="M206 214 L162 248 L162 296" />
      <circle cx="291" cy="200" r="6" />
    </g>

    {/* Floor shadow */}
    <ellipse cx="231" cy="340" rx="150" ry="7" fill="rgba(0,0,0,0.35)" />
  </svg>
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
    <div className="scl-field">
      <span className="scl-field-icon" style={{ color: focused ? "#06b6d4" : "rgba(255,255,255,0.32)" }}>
        {icon}
      </span>
      <input
        id={id}
        type={type}
        required
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="scl-input"
        style={{
          borderColor: focused ? "rgba(6,182,212,0.55)" : "rgba(255,255,255,0.1)",
          background: focused ? "rgba(6,182,212,0.04)" : "rgba(255,255,255,0.03)",
          boxShadow: focused ? "0 0 0 3px rgba(6,182,212,0.08)" : "none",
        }}
      />
      <label
        htmlFor={id}
        className="scl-label"
        style={{
          top: floated ? "7px" : "50%",
          fontSize: floated ? "10.5px" : "13.5px",
          transform: floated ? "translateY(0)" : "translateY(-50%)",
          color: focused ? "#06b6d4" : "rgba(255,255,255,0.38)",
        }}
      >
        {label}
      </label>
      {rightElement && <span className="scl-field-right">{rightElement}</span>}
    </div>
  );
}

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
 // onForgot,
}: ServiceCenterLoginProps) {
  const navigate = useNavigate();
  const { login, loading, errors } = useServiceCenterAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
      navigate("/service-center/dashboard");
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');

        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes drift {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-14px, 10px); }
        }
        @keyframes cardFloat {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-10px); }
        }
        @keyframes bulbFlicker {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0.72; }
        }

        .scl-root {
          min-height: 100vh;
          background: #060a14;
          display: grid;
          grid-template-columns: 1fr;
          font-family: 'DM Sans', sans-serif;
          -webkit-font-smoothing: antialiased;
        }
        @media (min-width: 1024px) {
          .scl-root { grid-template-columns: 1.05fr 1fr; }
        }

        /* ── Brand panel ─────────────────────────────────────────── */
        .scl-brand {
          position: relative;
          display: none;
          flex-direction: column;
          justify-content: space-between;
          padding: 48px 56px;
          overflow: hidden;
          background:
            radial-gradient(ellipse 70% 60% at 25% 20%, rgba(29,78,216,0.16) 0%, transparent 60%),
            radial-gradient(ellipse 55% 55% at 85% 85%, rgba(6,182,212,0.09) 0%, transparent 60%),
            linear-gradient(180deg, #0a0f1e 0%, #070b16 100%);
          border-right: 1px solid rgba(255,255,255,0.06);
        }
        @media (min-width: 1024px) { .scl-brand { display: flex; } }

        .scl-brand-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          animation: drift 14s ease-in-out infinite;
        }

        .scl-visual-wrap {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Garage line-art illustration */
        .scl-illustration-float { animation: cardFloat 6s ease-in-out infinite; }
        .scl-bulb { animation: bulbFlicker 3.2s ease-in-out infinite; transform-origin: 352px 150px; }

        @media (prefers-reduced-motion: reduce) {
          .scl-illustration-float, .scl-bulb, .scl-brand-orb { animation: none !important; }
        }

        /* ── Form panel ──────────────────────────────────────────── */
        .scl-form-panel {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 24px 56px;
        }
        .scl-form-wrap {
          width: 100%;
          max-width: 380px;
          animation: fadeUp 0.5s ease both;
        }

        /* Google btn */
        .google-btn {
          width: 100%; height: 44px; border-radius: 10px;
          background: rgba(255,255,255,.04);
          border: 1px solid rgba(255,255,255,.12);
          color: rgba(255,255,255,.85);
          font-family: 'DM Sans', sans-serif;
          font-size: 13.5px; font-weight: 500;
          display: flex; align-items: center; justify-content: center; gap: 9px;
          cursor: pointer;
          transition: background .18s, border-color .18s;
        }
        .google-btn:hover { background: rgba(255,255,255,.08); border-color: rgba(255,255,255,.22); }

        .or-row { display: flex; align-items: center; gap: 10px; margin: 20px 0; }
        .or-line { flex: 1; height: 1px; background: rgba(255,255,255,.07); }
        .or-label { font-size: 10.5px; color: rgba(255,255,255,.28); letter-spacing: .1em; text-transform: uppercase; }

        /* Floating field */
        .scl-field { position: relative; }
        .scl-field-icon {
          position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
          display: flex; pointer-events: none; transition: color .18s;
        }
        .scl-field-right {
          position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
        }
        .scl-input {
          width: 100%; height: 52px; border-radius: 10px;
          padding: 17px 14px 6px 42px;
          color: #fff; font-size: 13.5px; font-family: 'DM Sans', sans-serif;
          border-width: 1px; border-style: solid; outline: none;
          transition: border-color .18s, background .18s, box-shadow .18s;
        }
        .scl-label {
          position: absolute; left: 42px; pointer-events: none;
          transition: top .16s ease, font-size .16s ease, color .16s ease, transform .16s ease;
          font-family: 'DM Sans', sans-serif; font-weight: 500;
        }

        /* Submit btn */
        .submit-btn {
          width: 100%; height: 48px; border-radius: 10px; border: none;
          background: linear-gradient(135deg, #1d4ed8, #06b6d4);
          background-size: 160% 160%;
          color: #fff; font-family: 'DM Sans', sans-serif;
          font-weight: 600; font-size: 13.5px;
          cursor: pointer;
          box-shadow: 0 8px 24px rgba(6,182,212,.22);
          transition: transform .18s, box-shadow .18s, background-position .3s;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .submit-btn:not(:disabled):hover {
          transform: translateY(-1px);
          box-shadow: 0 10px 28px rgba(6,182,212,.32);
          background-position: 100% 0%;
        }
        .submit-btn:not(:disabled):active { transform: translateY(0); }
        .submit-btn:disabled { opacity: .42; cursor: not-allowed; box-shadow: none; }
        .submit-btn .scl-arrow { transition: transform .18s; }
        .submit-btn:not(:disabled):hover .scl-arrow { transform: translateX(3px); }

        .spin-icon { animation: spin .75s linear infinite; display: inline-block; }

        a:focus-visible, button:focus-visible, input:focus-visible {
          outline: 2px solid rgba(6,182,212,0.6);
          outline-offset: 2px;
        }
      `}</style>

      <div className="scl-root">
        {/* ── Brand panel ──────────────────────────────────────────── */}
        <div className="scl-brand">
          <div className="scl-brand-orb" style={{ width: 260, height: 260, top: -60, left: -60, background: "rgba(29,78,216,0.35)" }} />
          <div className="scl-brand-orb" style={{ width: 220, height: 220, bottom: -40, right: -40, background: "rgba(6,182,212,0.22)", animationDelay: "3s" }} />

          <div className="flex items-center gap-2.5" style={{ position: "relative", zIndex: 1 }}>
            <div
              className="w-9 h-9 rounded-[9px] flex items-center justify-center flex-shrink-0"
              style={{ background: "linear-gradient(135deg,rgba(59,130,246,.18),rgba(6,182,212,.1))", border: "1px solid rgba(59,130,246,.35)" }}
            >
              <BoltIcon />
            </div>
            <span className="text-white text-[21px] tracking-[-0.3px]" style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800 }}>
              Moto<span style={{ color: "#06b6d4" }}>Cline</span>
            </span>
          </div>

          <div className="scl-visual-wrap" style={{ position: "relative", zIndex: 1 }}>
            <div className="scl-illustration-float"><GarageLineArt /></div>
          </div>

          <div style={{ position: "relative", zIndex: 1, maxWidth: "380px" }}>
            <h2 className="text-white" style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "26px", lineHeight: 1.2, letterSpacing: "-0.4px" }}>
              Built for the way you run your garage.
            </h2>
            <p style={{ fontSize: "13.5px", color: "rgba(255,255,255,.4)", fontFamily: "'DM Sans',sans-serif", marginTop: "10px", lineHeight: 1.6 }}>
              Bookings, mechanics, and earnings — all in one place.
            </p>
          </div>
        </div>

        {/* ── Form panel ───────────────────────────────────────────── */}
        <div className="scl-form-panel">
          <div className="scl-form-wrap">

            {/* Mobile-only compact logo */}
            <div className="flex lg:hidden items-center gap-2.5 justify-center mb-8">
              <div
                className="w-8 h-8 rounded-[8px] flex items-center justify-center flex-shrink-0"
                style={{ background: "linear-gradient(135deg,rgba(59,130,246,.18),rgba(6,182,212,.1))", border: "1px solid rgba(59,130,246,.35)" }}
              >
                <BoltIcon />
              </div>
              <span className="text-white text-[19px] tracking-[-0.3px]" style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800 }}>
                Moto<span style={{ color: "#06b6d4" }}>Cline</span>
              </span>
            </div>

            <h1 className="text-white" style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: "22px", letterSpacing: "-0.3px" }}>
              Welcome back
            </h1>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,.4)", marginTop: "5px", marginBottom: "26px" }}>
              Log in to manage your service center.
            </p>

            <button className="google-btn" type="button" onClick={() => onGoogle?.()}>
              <GoogleIcon />
              Sign in with Google
            </button>

            <div className="or-row">
              <div className="or-line" />
              <span className="or-label">or email</span>
              <div className="or-line" />
            </div>

            {errors.general && (
              <div
                className="flex items-center gap-2.5 rounded-lg px-3.5 py-2.5 mb-5"
                style={{ background: "rgba(239,68,68,.08)", border: "1px solid rgba(239,68,68,.22)" }}
              >
                <AlertCircleIcon />
                <span style={{ fontSize: "12.5px", color: "#f87171", fontWeight: 500 }}>{errors.general}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <FloatingInput
                id="sc-email"
                label="Email address"
                type="email"
                value={email}
                onChange={setEmail}
                icon={<MailIcon />}
                autoComplete="email"
              />

              <div>
                <FloatingInput
                  id="sc-password"
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
                      {showPass ? <EyeOpenIcon /> : <EyeClosedIcon />}
                    </button>
                  }
                />
                <div className="flex justify-end mt-2">
                  <button
                    type="button"
                    onClick={() => navigate("/service-center/forgot-password")}
                    style={{ fontSize: "12px", color: "#3b82f6", fontWeight: 500, background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "'DM Sans',sans-serif" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#60a5fa")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#3b82f6")}
                  >
                    Forgot password?
                  </button>
                </div>
              </div>

              <button type="submit" className="submit-btn" disabled={loading || !email || !password}>
                {loading ? (
                  <>
                    <svg className="spin-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                    </svg>
                    Signing in…
                  </>
                ) : (
                  <>
                    Log in
                    <span className="scl-arrow"><ArrowRightIcon /></span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,.35)" }}>
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/service-center/register")}
                  className="inline-flex items-center gap-1 font-semibold transition-colors"
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#3b82f6", fontSize: "13px", fontFamily: "'DM Sans',sans-serif", fontWeight: 600, padding: 0 }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#60a5fa")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#3b82f6")}
                >
                  Sign up as Service Center
                  <ArrowRightIcon />
                </button>
              </p>
            </div>

            <div className="mt-6 flex items-center justify-center gap-4">
              {["Privacy Policy", "Terms of Service", "Contact Support"].map((l) => (
                <a
                  key={l}
                  href="#"
                  style={{ fontSize: "11px", color: "rgba(255,255,255,.25)", textDecoration: "none", transition: "color .2s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,.55)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,.25)")}
                >
                  {l}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}