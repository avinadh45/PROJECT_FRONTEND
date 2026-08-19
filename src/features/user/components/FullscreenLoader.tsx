import { Spinner } from "./Spinner";

export const FullScreenLoader = ({ text = "Loading..." }: { text?: string }) => (
  <div className="fixed inset-0 z-[999] bg-[#060a14]/85 backdrop-blur-md flex flex-col items-center justify-center gap-4">
    <Spinner />
    <div className="font-display font-bold text-sm tracking-widest uppercase bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
      {text}
    </div>
  </div>
);