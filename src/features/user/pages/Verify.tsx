// function Verify({ auth }: any) {
//   return (
//     <div className="auth-container">
//       <h2>Verify Email</h2>
//       <p className="subtitle">Enter the code sent to your email</p>

//       {auth.error && <div className="error-msg">{auth.error}</div>}
//       {auth.success && <div className="success-msg">{auth.success}</div>}

//       <form onSubmit={auth.handleVerify}>
//         <div className="input-group">
//           <label>Email</label>
//           <input type="email" required value={auth.email} onChange={e => auth.setEmail(e.target.value)} placeholder="you@example.com" readOnly />
//         </div>
//         <div className="input-group">
//           <label>OTP Code</label>
//           <input type="text" required value={auth.otp} onChange={e => auth.setOtp(e.target.value)} placeholder="123456" />
//         </div>
//         <button type="submit" className="primary">Verify OTP</button>
//       </form>
//     </div>
//   );
// }
// export default Verify;


// OTPVerification.tsx
// Matches Motocline login page design — same dark navy, Syne + DM Sans, blue brand accent
// Drop into the same Vite + React + TypeScript + Tailwind project

import { useState, useRef, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import type { KeyboardEvent, ClipboardEvent } from "react";
import { useAuth } from "../hooks/useAuth";

const DIGITS = 6;

export default function  Verify() {
  const auth = useAuth()
  const email = localStorage.getItem("verifyEmail") || ""; 
  //  const navigate = useNavigate();
  const [otp, setOtp]  = useState<string[]>(Array(DIGITS).fill(""));
  const [status, setStatus]  = useState<"idle" | "loading" | "success" | "error">("idle");
  // const [timer, setTimer]       = useState(59);
  const [timer, setTimer] = useState<number>(() => {
  const storedTime = Number(localStorage.getItem("otp_sent_time"));
  if (!storedTime) return 59;

  const elapsed = Math.floor((Date.now() - storedTime) / 1000);
  const remaining = 59 - elapsed;

  return remaining > 0 ? remaining : 0;
});
  const [canResend, setCanResend] = useState(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // countdown
//   useEffect(() => {
//   const storedTime = localStorage.getItem("otp_sent_time");

//   if (!storedTime) {
//     localStorage.setItem("otp_sent_time", Date.now().toString());
//   }
// }, []);

useEffect(() => {

  const calculateTimer = () => {
    const sentTime = Number(localStorage.getItem("otp_sent_time"));
    const now = Date.now();

    const elapsed = Math.floor((now - sentTime) / 1000);
    const remaining = 59 - elapsed;

   if (remaining <= 0) {
  setTimer(0);
  setCanResend(true);
} else {
  setTimer(remaining);
  setCanResend(false);
}
  };

  calculateTimer();

  const interval = setInterval(calculateTimer, 1000);

  return () => clearInterval(interval);

}, []);

  const focusAt = (i: number) => inputsRef.current[i]?.focus();

  const handleChange = (i: number, val: string) => {
    const digit = val.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[i] = digit;
    setOtp(next);
    // auth.setOtp(next.join(""));
    if (digit && i < DIGITS - 1) focusAt(i + 1);
  };

  const handleKey = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (otp[i]) {
        const next = [...otp]; next[i] = ""; setOtp(next);
      } else if (i > 0) {
        focusAt(i - 1);
      }
    } else if (e.key === "ArrowLeft" && i > 0) {
      focusAt(i - 1);
    } else if (e.key === "ArrowRight" && i < DIGITS - 1) {
      focusAt(i + 1);
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, DIGITS);
    const next = [...otp];
    text.split("").forEach((d, idx) => { next[idx] = d; });
    setOtp(next);
    focusAt(Math.min(text.length, DIGITS - 1));
  };

  const handleVerify = async () => {
  try {
    setStatus("loading")
    const finalOtp = otp.join("")
    await auth.handleVerify({email,otp:finalOtp});
    setStatus("success")

    // setTimeout(() => {
    //   navigate("/dashboard")
    // }, 2000)
  } catch (error) {
     setStatus("error");
  }
  };

 const handleResend = async () => {
  await auth.handleResendOtp(email);

  localStorage.setItem("otp_sent_time", Date.now().toString());

  setOtp(Array(DIGITS).fill(""));
  setTimer(59);
  setCanResend(false);

  focusAt(0);
};

  const filled = otp.filter(Boolean).length;
  const isReady = filled === DIGITS;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { height: 100%; }
        body { font-family: 'DM Sans', sans-serif; background: #060a14; color: #fff; -webkit-font-smoothing: antialiased; }
        @keyframes floatUp   { from { opacity:0; transform:translateY(28px) } to { opacity:1; transform:translateY(0) } }
        @keyframes shaftAnim { from { opacity:.12; transform:scaleY(.8) }     to { opacity:.7; transform:scaleY(1.1) } }
        @keyframes pulseDot  { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.3;transform:scale(1.5)} }
        @keyframes spin      { to { transform: rotate(360deg) } }
        @keyframes shake     { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-6px)} 40%,80%{transform:translateX(6px)} }
        @keyframes pop       { 0%{transform:scale(.9)} 60%{transform:scale(1.05)} 100%{transform:scale(1)} }
        .shaft { position:absolute; top:0; width:1.5px; border-radius:1px; filter:blur(4px); animation:shaftAnim ease-in-out infinite alternate; }
        .animate-float  { animation: floatUp .65s ease both; }
        .animate-shake  { animation: shake .4s ease; }
        .animate-pop    { animation: pop .35s ease; }
      `}</style>

      {/* Page wrapper */}
      <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center px-4"
           style={{ background: "#060a14" }}>

        {/* Background radial glow */}
        <div className="absolute inset-0 pointer-events-none"
             style={{ background: "radial-gradient(ellipse 70% 60% at 50% 40%, rgba(29,78,216,0.14) 0%, transparent 70%)" }} />

        {/* Light shafts */}
        <div className="shaft" style={{ left:"28%", height:"55%", background:"linear-gradient(to bottom,rgba(59,130,246,0.3),transparent)", animationDuration:"4s" }} />
        <div className="shaft" style={{ left:"72%", height:"42%", background:"linear-gradient(to bottom,rgba(6,182,212,0.18),transparent)", animationDuration:"6s", animationDirection:"alternate-reverse" }} />
        <div className="shaft" style={{ left:"50%", height:"35%", background:"linear-gradient(to bottom,rgba(59,130,246,0.12),transparent)", animationDuration:"5s" }} />

        {/* Logo */}
        <div className="animate-float relative z-10 mb-10" style={{ animationDelay: "0ms" }}>
          <a href="/" className="flex items-center gap-2 no-underline">
            <div className="w-8 h-8 rounded-[7px] flex items-center justify-center font-syne font-black text-sm text-white"
                 style={{ background: "linear-gradient(135deg,#3b82f6,#06b6d4)", fontFamily: "'Syne',sans-serif" }}>M</div>
            <span style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 18, color: "#fff", letterSpacing: "-.4px" }}>
              Moto<span style={{ color: "#3b82f6" }}>cline</span>
            </span>
          </a>
        </div>

        {/* Card */}
        <div className="animate-float relative z-10 w-full"
             style={{ maxWidth: 480, animationDelay: "80ms" }}>
          <div className="rounded-2xl px-8 py-10 border border-white/[0.07]"
               style={{ background: "linear-gradient(160deg,rgba(13,20,44,0.97),rgba(8,14,30,0.99))" }}>

            {/* ── Success state ── */}
            {status === "success" ? (
              <div className="text-center py-4 animate-pop">
                {/* Checkmark circle */}
                <div className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center"
                     style={{ background: "linear-gradient(135deg,rgba(16,185,129,0.2),rgba(6,182,212,0.1))", border: "1px solid rgba(16,185,129,0.35)" }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 24, color: "#fff", letterSpacing: "-.5px", marginBottom: 10 }}>
                  Verified!
                </h2>
                <p className="text-white/45 text-sm leading-relaxed mb-8">
                  Your identity has been confirmed.<br />Redirecting you to your dashboard…
                </p>
                <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
                  <div className="h-full rounded-full animate-[shimmerBar_1.4s_ease_forwards]"
                       style={{ background: "linear-gradient(90deg,#10b981,#06b6d4)", width: "100%", animation: "none", transition: "width 1.4s ease", transformOrigin:"left" }} />
                </div>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="text-center mb-8">
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-2xl mx-auto mb-5 flex items-center justify-center"
                       style={{ background: "linear-gradient(135deg,rgba(59,130,246,0.18),rgba(6,182,212,0.09))", border: "1px solid rgba(59,130,246,0.28)" }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="4" width="20" height="16" rx="3"/>
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7"/>
                    </svg>
                  </div>
                  <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 26, color: "#fff", letterSpacing: "-.5px", marginBottom: 8 }}>
                    Check your email
                  </h2>
                  <p className="text-white/42 text-sm leading-[1.65]">
                    We sent a 6-digit verification code to
                  </p>
                  <p className="text-white/75 text-sm font-semibold mt-1">
                   {email}
                  </p>
                </div>

                {/* OTP inputs */}
                <div className={`flex justify-center gap-3 mb-3 ${status === "error" ? "animate-shake" : ""}`}
                     key={status === "error" ? "err" : "ok"}>
                  {Array.from({ length: DIGITS }).map((_, i) => (
                    <input
                      key={i}
                      ref={el => { inputsRef.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={otp[i]}
                      onChange={e => handleChange(i, e.target.value)}
                      onKeyDown={e => handleKey(i, e)}
                      onPaste={handlePaste}
                      onFocus={e => e.target.select()}
                      className="text-center font-syne font-bold text-xl text-white outline-none transition-all duration-200"
                      style={{
                        fontFamily: "'Syne',sans-serif",
                        width: 52, height: 60,
                        borderRadius: 12,
                        background: otp[i]
                          ? "rgba(59,130,246,0.1)"
                          : "rgba(255,255,255,0.04)",
                        border: otp[i]
                          ? "1.5px solid rgba(59,130,246,0.6)"
                          : status === "error"
                          ? "1.5px solid rgba(239,68,68,0.6)"
                          : "1.5px solid rgba(255,255,255,0.1)",
                        boxShadow: otp[i]
                          ? "0 0 0 3px rgba(59,130,246,0.1)"
                          : "none",
                        caretColor: "#3b82f6",
                        fontSize: otp[i] ? 22 : 14,
                        color: otp[i] ? "#fff" : "rgba(255,255,255,0.25)",
                      }}
                    />
                  ))}
                </div>

                {/* Error message */}
                <div className="text-center mb-6 h-5">
                  {status === "error" && (
                    <p className="text-red-400 text-xs font-medium animate-float">
                      Incorrect code. Please try again.
                    </p>
                  )}
                </div>

                {/* Progress dots */}
                <div className="flex justify-center gap-1.5 mb-7">
                  {Array.from({ length: DIGITS }).map((_, i) => (
                    <div key={i} className="rounded-full transition-all duration-200"
                         style={{
                           width: otp[i] ? 20 : 6,
                           height: 6,
                           background: otp[i]
                             ? "linear-gradient(90deg,#3b82f6,#06b6d4)"
                             : "rgba(255,255,255,0.1)",
                         }} />
                  ))}
                </div>

                {/* Verify button */}
                <button
                  onClick={handleVerify}
                  disabled={!isReady || status === "loading"}
                  className="w-full h-[50px] rounded-xl font-bold text-white text-[14.5px] relative overflow-hidden transition-all duration-200"
                  style={{
                    fontFamily: "'Syne',sans-serif",
                    letterSpacing: ".04em",
                    background: isReady
                      ? "linear-gradient(135deg,#1d4ed8,#3b82f6)"
                      : "rgba(255,255,255,0.05)",
                    border: isReady ? "none" : "1px solid rgba(255,255,255,0.1)",
                    color: isReady ? "#fff" : "rgba(255,255,255,0.25)",
                    boxShadow: isReady ? "0 4px 20px rgba(59,130,246,0.4)" : "none",
                    cursor: isReady ? "pointer" : "not-allowed",
                  }}
                >
                  {status === "loading" ? (
                    <span className="flex items-center justify-center gap-2.5">
                      <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white"
                            style={{ animation: "spin .7s linear infinite" }} />
                      Verifying…
                    </span>
                  ) : (
                    "Verify Code"
                  )}
                </button>

                {/* Resend */}
                <div className="text-center mt-6 text-[13.5px]">
                  {canResend ? (
                    <span className="text-white/38">
                      Didn't receive it?{" "}
                      <button onClick={handleResend}
                              className="text-brand font-semibold bg-none border-none cursor-pointer transition-colors hover:text-blue-400"
                              style={{ color: "#3b82f6", background: "none", border: "none", fontFamily: "'DM Sans',sans-serif", fontSize: 13.5, fontWeight: 600 }}>
                        Resend code
                      </button>
                    </span>
                  ) : (
                    <span className="text-white/35">
                      Resend code in{" "}
                      <span className="font-semibold" style={{ color: "#3b82f6" }}>
                        0:{String(timer).padStart(2, "0")}
                      </span>
                    </span>
                  )}
                </div>

                {/* Back link */}
                <div className="text-center mt-4">
                  <a href="/login"
                     className="inline-flex items-center gap-1.5 text-[13px] text-white/30 hover:text-white/60 no-underline transition-colors"
                     style={{ textDecoration: "none" }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M19 12H5M12 5l-7 7 7 7"/>
                    </svg>
                    Back to sign in
                  </a>
                </div>
              </>
            )}
          </div>

          {/* Bottom hint */}
          {status !== "success" && (
            <div className="flex items-center justify-center gap-2 mt-5">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.8" strokeLinecap="round">
                <rect x="3" y="11" width="18" height="11" rx="2"/>
                <path d="M7 11V7a5 5 0 0110 0v4"/>
              </svg>
              <span className="text-white/25 text-[12px]">Secured with 256-bit encryption</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="relative z-10 mt-10 text-center" style={{ color: "rgba(255,255,255,0.2)", fontSize: 12 }}>
          © 2026 Motocline Inc.
          <a href="#" style={{ color: "rgba(255,255,255,0.3)", textDecoration: "none", margin: "0 6px" }}
             className="hover:text-white/60 transition-colors">Privacy Policy</a>·
          <a href="#" style={{ color: "rgba(255,255,255,0.3)", textDecoration: "none", margin: "0 6px" }}
             className="hover:text-white/60 transition-colors">Terms of Service</a>
        </div>

      </div>
    </>
  );
}