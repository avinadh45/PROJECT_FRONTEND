import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";
import { useChatConversation } from "../hook/useChatConversation";

function initialsFrom(label: string) {
  const parts = label.trim().split(/\s+/);
  return (parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "");
}

export default function ChatPanel({
  bookingId,
  concernId,
  currentUserId,
  currentUserRole,
  otherParticipantLabel,
}: {
  bookingId?: string;
  concernId?: string;
  currentUserId: string;
  currentUserRole: "user" | "serviceCenter" | "mechanic";
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
    return (
      <div className="flex h-full items-center justify-center rounded-xl border border-white/10 bg-[#0a0f1e]">
        <p className="text-sm text-slate-500">Connecting…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center rounded-xl border border-white/10 bg-[#0a0f1e] px-6 text-center">
        <p className="text-sm text-slate-500">
          {error === "Chat will be available once a mechanic is assigned."
            ? error
            : "Chat is currently unavailable."}
        </p>
      </div>
    );
  }

  function handleSend() {
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  }

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-white/10 bg-[#0a0f1e]">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-white/10 bg-white/[0.02] px-5 py-3.5">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
          style={{ background: "linear-gradient(135deg, #3b82f6, #06b6d4)" }}
        >
          {initialsFrom(otherParticipantLabel)}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">{otherParticipantLabel}</p>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <p className="text-xs text-white/40">Online</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4">
        {hasMore && (
          <button
            onClick={loadMore}
            className="mb-4 w-full rounded-lg border border-white/10 py-1.5 text-center text-xs text-cyan-400 hover:bg-white/5"
          >
            Load earlier messages
          </button>
        )}

        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center py-10">
            <p className="text-sm text-slate-500">Start the conversation — say hello!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {messages.map((m) => {
              const isOwn = m.senderRole === currentUserRole;
              return (
                <div key={m.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[70%] px-3.5 py-2 text-sm shadow-sm ${
                      isOwn
                        ? "rounded-2xl rounded-br-sm text-white"
                        : "rounded-2xl rounded-bl-sm border border-white/5 bg-white/5 text-slate-200"
                    }`}
                    style={isOwn ? { background: "linear-gradient(135deg, #3b82f6, #06b6d4)" } : undefined}
                  >
                    <p className="whitespace-pre-wrap break-words leading-relaxed">{m.text}</p>
                    <p className={`mt-1 text-[10px] ${isOwn ? "text-white/70" : "text-white/40"} text-right`}>
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

      {/* Input */}
      <div className="border-t border-white/10 bg-white/[0.02] p-3">
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-[#060a14] px-2 py-1.5 focus-within:border-cyan-400/60">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type a message"
            className="flex-1 bg-transparent px-2 text-sm text-white placeholder:text-slate-600 focus:outline-none"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white transition-opacity disabled:opacity-30"
            style={{ background: "linear-gradient(135deg, #3b82f6, #06b6d4)" }}
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}