
import { useEffect,useRef,useState } from "react";
import { Send } from "lucide-react";
import { useChatConversation } from "../hook/useChatConversation";

export default function ChatPanel({
  bookingId,
  concernId,
  currentUserId,
  otherParticipantLabel,
}: {
  bookingId?: string;
  concernId?: string;
  currentUserId: string;
  otherParticipantLabel: string;
}) {
  const { messages, isJoining, error, hasMore, loadMore, sendMessage, markRead } = useChatConversation({
    bookingId,
    concernId,
    currentUserId,
  });

  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    markRead();
  }, [messages]);

  if (isJoining) {
    return <div className="p-6 text-center text-sm text-slate-500">Connecting…</div>;
  }

  if (error) {
    return (
      <div className="p-6 text-center text-sm text-slate-500">
        {error === "Chat will be available once a mechanic is assigned."
          ? error
          : "Chat is currently unavailable."}
      </div>
    );
  }

  function handleSend() {
    sendMessage(input);
    setInput("");
  }

  return (
    <div className="flex h-full flex-col rounded-xl border border-white/10 bg-[#0a0f1e]">
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
        <span className="h-2 w-2 rounded-full bg-emerald-400" />
        <p className="text-sm font-semibold text-white">Chat with {otherParticipantLabel}</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3">
        {hasMore && (
          <button onClick={loadMore} className="mb-3 w-full text-center text-xs text-cyan-400 hover:underline">
            Load earlier messages
          </button>
        )}

        {messages.length === 0 ? (
          <p className="py-10 text-center text-sm text-slate-500">Start the conversation — say hello!</p>
        ) : (
          <div className="flex flex-col gap-2">
            {messages.map((m) => {
              const isOwn = m.id === currentUserId;
              return (
                <div key={m.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[75%] rounded-xl px-3 py-2 text-sm ${
                      isOwn ? "text-white" : "bg-white/5 text-slate-200"
                    }`}
                    style={isOwn ? { background: "linear-gradient(135deg, #3b82f6, #06b6d4)" } : undefined}
                  >
                    <p>{m.text}</p>
                    <p className="mt-1 text-[10px] opacity-60">
                      {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 border-t border-white/10 p-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a message…"
          className="flex-1 rounded-lg border border-white/10 bg-[#060a14] px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:border-cyan-400/60 focus:outline-none"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          className="rounded-lg p-2 text-white disabled:opacity-40"
          style={{ background: "linear-gradient(135deg, #3b82f6, #06b6d4)" }}
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}