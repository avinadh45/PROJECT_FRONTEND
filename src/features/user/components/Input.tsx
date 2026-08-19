import { useState } from "react";

export const Input = ({ label, error, className = "", ...props }: any) => {
  const [focused, setFocused] = useState(false);
  return (
    <div className="mb-4">
      {label && <label className="block mb-2 text-sm text-white/60 font-medium">{label}</label>}
      <input
        className={`w-full h-12 bg-white/[0.04] border rounded-xl text-white text-sm px-4 outline-none transition-colors placeholder:text-white/20 hover:border-white/20 hover:bg-white/[0.06] ${
          focused ? "border-blue-500/60 bg-blue-500/[0.04] ring-2 ring-blue-500/10" : "border-white/10"
        } ${className}`}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...props}
      />
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
};