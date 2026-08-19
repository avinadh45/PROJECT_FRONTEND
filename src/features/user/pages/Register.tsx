import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

function Register() {
    const auth = useAuth()
  const navigate = useNavigate();
  const [focused, setFocused] = useState<string | null>(null);
  const [email, setEmail] = useState("");
const [name, setName] = useState("");
const [password, setPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
const [phoneNumber, setPhoneNumber] = useState("");
  const [errors, setErrors] =
  useState<Record<string, string>>({});
  return (
    <div className="min-h-screen bg-[#0a0d14] flex overflow-hidden font-sans">
      {/* ── Left panel: branding ── */}
      <div className="hidden lg:flex flex-col justify-between w-[52%] relative overflow-hidden px-16 py-12">
        {/* dark overlay on a mechanic-feel background */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=1400&q=80')",
          }}
        />
        {/* deep blue-black gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0d14]/95 via-[#0d1528]/80 to-[#0a1a3a]/70" />

        {/* grid lines for futuristic feel */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(#38bdf8 1px, transparent 1px), linear-gradient(90deg, #38bdf8 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#2563eb] flex items-center justify-center shadow-lg shadow-blue-600/40">
            <span className="text-white font-black text-lg tracking-tighter">M</span>
          </div>
          <span className="text-white font-bold text-xl tracking-wide">
            Moto<span className="text-[#38bdf8]">cline</span>
          </span>
        </div>

        {/* Hero copy */}
        <div className="relative z-10">
          <span className="inline-flex items-center gap-2 border border-[#38bdf8]/30 text-[#38bdf8] text-[11px] font-semibold tracking-[0.18em] uppercase px-4 py-2 rounded-full mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] animate-pulse" />
            What We Offer
          </span>
          <h1 className="text-5xl font-black text-white leading-[1.1] mb-6">
            Smarter Care For<br />
            Your <span className="text-[#38bdf8]">Vehicle</span>
          </h1>
          <p className="text-slate-400 text-base leading-relaxed max-w-sm mb-12">
            Experience premium automotive services with intelligent tracking,
            verified mechanics, and transparent pricing at every step.
          </p>

          {/* Stats */}
          <div className="flex items-center gap-0">
            {[
              { value: '500+', label: 'Happy Clients' },
              { value: '1200+', label: 'Services Done' },
              { value: '50k+', label: 'Miles Tracked' },
            ].map((s, i) => (
              <div key={s.label} className="flex items-center">
                <div className="pr-8">
                  <p className="text-white text-2xl font-black">{s.value}</p>
                  <p className="text-slate-500 text-[11px] font-semibold tracking-widest uppercase mt-0.5">
                    {s.label}
                  </p>
                </div>
                {i < 2 && <div className="w-px h-10 bg-slate-700 mr-8" />}
              </div>
            ))}
          </div>
        </div>

        {/* bottom decorative accent */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2563eb] via-[#38bdf8] to-transparent" />
      </div>

      {/* ── Right panel: form ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative">
        {/* subtle radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#2563eb]/5 blur-[120px] pointer-events-none" />

        <div className="relative z-10 w-full max-w-[420px]">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-9 h-9 rounded-lg bg-[#2563eb] flex items-center justify-center">
              <span className="text-white font-black text-base">M</span>
            </div>
            <span className="text-white font-bold text-lg tracking-wide">
              Moto<span className="text-[#38bdf8]">cline</span>
            </span>
          </div>

          <h2 className="text-3xl font-black text-white mb-1.5 tracking-tight">Create Account</h2>
          <p className="text-slate-500 text-sm mb-8">Join us and start your journey</p>

          {/* Alerts */}
          {auth?.errors?.general && (
  <div className="mb-5 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2">
    <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
        clipRule="evenodd"
      />
    </svg>

    {auth.errors.general}
  </div>
)}
          
          {auth?.success && (
            <div className="mb-5 px-4 py-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {auth.success}
            </div>
          )}

          <form onSubmit={(e)=>{e.preventDefault();if(password !== confirmPassword){
            setErrors({ confirmPassword: "Passwords do not match" });
           return;
          }auth.handleRegister({
            name,email,password,phoneNumber
          })}} className="space-y-4">
            {/* Email */}
            <Field
              id="email"
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              focused={focused}
              setFocused={setFocused}
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              }
            />
              {auth?.errors?.email && (
  <p className="text-red-400 text-xs mt-1">
    {auth.errors.email}
  </p>
)}
            {/* Name */}
            <Field
              id="name"
              label="Full Name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              focused={focused}
              setFocused={setFocused}
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              }
            />
              {auth?.errors?.name && (
  <p className="text-red-400 text-xs mt-1">
    {auth.errors.name}
  </p>
)}
            {/* Phone */}
            <Field
              id="phone"
              label="Phone Number"
              type="tel"
              placeholder="+91 555-555-5555"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              focused={focused}
              setFocused={setFocused}
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              }
            />

            {/* Password */}
            <Field
              id="password"
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              focused={focused}
              setFocused={setFocused}
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              }
            />
{auth?.errors?.password && (
  <p className="text-red-400 text-xs mt-1">
    {auth.errors.password}
  </p>
)}
            {/* Confirm Password */}
            <Field
              id="confirmPassword"
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              focused={focused}
              setFocused={setFocused}
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              }
            />
{auth?.errors?.confirmPassword && (
  <p className="text-red-400 text-xs mt-1">
    {auth.errors.confirmPassword}
  </p>
)}
            {/* Submit */}
            <button
              type="submit"
              className="
                w-full mt-2 py-3.5 px-6 rounded-xl font-bold text-sm text-white tracking-wide
                bg-[#2563eb] hover:bg-[#1d4ed8]
                shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50
                transition-all duration-200 active:scale-[0.98]
                relative overflow-hidden group
              "
            >
              <span className="relative z-10">Sign Up</span>
              {/* shimmer on hover */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </button>
          </form>

          {/* Switch to login */}
          <p className="mt-6 text-center text-slate-500 text-sm">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => {
                navigate('/login');
                auth?.clearMessages?.();
              }}
              className="text-[#38bdf8] font-semibold hover:text-white transition-colors duration-150"
            >
              Log in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Reusable field component ── */
interface FieldProps {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  focused: string | null;
  setFocused: (v: string | null) => void;
  icon: React.ReactNode;
}

function Field({ id, label, type, placeholder, value, onChange, focused, setFocused, icon }: FieldProps) {
  const isFocused = focused === id;
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-semibold text-slate-400 tracking-wide mb-1.5 uppercase">
        {label}
      </label>
      <div
        className={`
          flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all duration-200
          ${isFocused
            ? 'border-[#2563eb] bg-[#0d1528] shadow-md shadow-blue-600/20'
            : 'border-[#1e2a45] bg-[#0f1623] hover:border-[#2a3a5c]'}
        `}
      >
        <span className={`shrink-0 transition-colors duration-200 ${isFocused ? 'text-[#38bdf8]' : 'text-slate-600'}`}>
          {icon}
        </span>
        <input
          id={id}
          type={type}
      
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          onFocus={() => setFocused(id)}
          onBlur={() => setFocused(null)}
          className="
            flex-1 bg-transparent text-white text-sm placeholder-slate-600
            outline-none caret-[#38bdf8]
          "
        />
      </div>
    </div>
  );
}

export default Register;