export const Button = ({ colorClass = "from-blue-700 to-blue-500 shadow-blue-500/40 hover:shadow-blue-500/55", children, ...props }: any) => (
  <button
    className={`w-full h-[50px] rounded-xl bg-gradient-to-br ${colorClass} font-display font-bold text-sm tracking-wide shadow-lg hover:-translate-y-px active:translate-y-0 transition-all disabled:opacity-60 disabled:cursor-not-allowed`}
    {...props}
  >
    {children}
  </button>
);