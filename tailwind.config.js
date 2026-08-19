
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // theme: {
  //   extend: {
  //     colors: {
  //       user: { primary: '#3b82f6', accent: '#06b6d4' },
  //       admin: { primary: '#06b6d4', accent: '#0891b2' },
  //       mechanic: { primary: '#3b82f6', accent: '#2563eb' },
  //       service: { primary: '#3b82f6', accent: '#1d4ed8' },
  //     },
  //     fontFamily: {
  //       display: ['Syne', 'sans-serif'],
  //       body: ['DM Sans', 'sans-serif'],
  //     },
  //     keyframes: {
  //       floatUp: {
  //         from: { opacity: 0, transform: 'translateY(32px)' },
  //         to: { opacity: 1, transform: 'translateY(0)' },
  //       },
  //       pulseDot: {
  //         '0%, 100%': { opacity: 1, transform: 'scale(1)' },
  //         '50%': { opacity: 0.3, transform: 'scale(1.5)' },
  //       },
  //     },
  //     animation: {
  //       floatUp: 'floatUp .7s ease both',
  //       pulseDot: 'pulseDot 2s infinite',
  //     },
  //   },
  // },
  theme: {
  extend: {
    colors: {
      user: { primary: '#3b82f6', accent: '#06b6d4' },
      admin: { primary: '#06b6d4', accent: '#0891b2' },
      mechanic: { primary: '#3b82f6', accent: '#2563eb' },
      service: { primary: '#3b82f6', accent: '#1d4ed8' },
      status: {
  active:    '#10b981',
  inactive:  '#94a3b8',
  suspended: '#f87171',
  pending:   '#fbbf24',
},
    },
    fontFamily: {
      syne: ['Syne', 'sans-serif'],
      dm: ['DM Sans', 'sans-serif'],
    },
    keyframes: {
      floatUp: { from: { opacity: 0, transform: 'translateY(32px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
      pulseDot: { '0%, 100%': { opacity: 1, transform: 'scale(1)' }, '50%': { opacity: 0.3, transform: 'scale(1.5)' } },
      motoclineShaft: { '0%': { opacity: 0.2, transform: 'scaleY(0.8)' }, '100%': { opacity: 0.85, transform: 'scaleY(1.1)' } },
      motoclineShimmer: { '0%': { backgroundPosition: '0% 50%' }, '100%': { backgroundPosition: '200% 50%' } },
      motoclineFloat: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-6px)' } },
      motoclineFloatSlow: { '0%, 100%': { transform: 'translate(0,0)' }, '50%': { transform: 'translate(10px,-14px)' } },
      motoclineRingPulse: {
        '0%': { boxShadow: '0 0 0 0 rgba(59,130,246,0.45)' },
        '70%': { boxShadow: '0 0 0 14px rgba(59,130,246,0)' },
        '100%': { boxShadow: '0 0 0 0 rgba(59,130,246,0)' },
      },
      motoclineDropdownIn: {
        from: { opacity: 0, transform: 'translateY(-6px) scale(0.97)' },
        to: { opacity: 1, transform: 'translateY(0) scale(1)' },
      },
    },
    animation: {
      floatUp: 'floatUp .7s ease both',
      pulseDot: 'pulseDot 2s infinite',
      motoclineShaft: 'motoclineShaft 4.5s ease-in-out infinite alternate',
      motoclineShimmer: 'motoclineShimmer 4.5s linear infinite',
      motoclineFloat: 'motoclineFloat 5s ease-in-out infinite',
      motoclineFloatSlow: 'motoclineFloatSlow 8s ease-in-out infinite',
      motoclineRingPulse: 'motoclineRingPulse 2.6s ease-out infinite',
      motoclineDropdownIn: 'motoclineDropdownIn 0.18s cubic-bezier(0.16,1,0.3,1)',
    },
  },
},
  plugins: [],
}