export const Spinner = () => (
  <svg width="56" height="56" viewBox="0 0 50 50" fill="none">
    <defs>
      <linearGradient id="spinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3b82f6" />
        <stop offset="100%" stopColor="#06b6d4" />
      </linearGradient>
    </defs>
    <circle cx="25" cy="25" r="20" stroke="rgba(255,255,255,0.08)" strokeWidth="4" fill="none" />
    <circle cx="25" cy="25" r="20" stroke="url(#spinGrad)" strokeWidth="4" fill="none" strokeLinecap="round" strokeDasharray="90 40">
      <animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="0.9s" repeatCount="indefinite" />
    </circle>
  </svg>
);
