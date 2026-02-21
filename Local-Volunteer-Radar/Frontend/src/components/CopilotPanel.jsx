import { useState, useRef, useEffect } from "react";

const INITIAL_MESSAGE = {
    role: "assistant",
    content: "👋 Hi! I'm your platform assistant. Ask me anything — like how to register for an event or update your profile!",
};

const SUGGESTIONS = [
    "How do I register for an event?",
    "How do I update my profile picture?",
    "How do I message an organizer?",
    "Where can I see my registrations?",
];

export default function CopilotPanel() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([INITIAL_MESSAGE]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    const sendMessage = async (overrideText) => {
        const text = overrideText || input.trim();
        if (!text || loading) return;

        const updatedMessages = [...messages, { role: "user", content: text }];
        setMessages(updatedMessages);
        setInput("");
        setLoading(true);

        try {
            // Filter out the initial greeting before sending to API
            const apiMessages = updatedMessages
                .filter((m, i) => !(i === 0 && m.role === "assistant"))
                .map((m) => ({ role: m.role, content: m.content }));

            const res = await fetch("http://localhost:5000/api/copilot", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include", // include if you use sessions/cookies for auth
                body: JSON.stringify({ messages: apiMessages }),
            });

            const data = await res.json();
            setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
        } catch {
            setMessages((prev) => [
                ...prev,
                { role: "assistant", content: "⚠️ Couldn't connect. Please try again." },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* ---- Floating Button ---- */}
            <button onClick={() => setOpen(!open)} className="copilot-fab">
                {open ? "✕" : "✦"}
            </button>

            {/* ---- Side Panel ---- */}
            <div className={`copilot-panel ${open ? "copilot-open" : ""}`}>
                {/* Header */}
                <div className="copilot-header">
                    <div className="copilot-header-icon">✦</div>
                    <div>
                        <div className="copilot-title">Platform Assistant</div>
                        <div className="copilot-subtitle">Ask me anything</div>
                    </div>
                    <div className="copilot-status">
                        <span className="copilot-dot" /> Online
                    </div>
                </div>

                {/* Messages */}
                <div className="copilot-messages">
                    {messages.map((msg, i) => (
                        <div key={i} className={`copilot-row ${msg.role === "user" ? "copilot-row-user" : "copilot-row-ai"}`}>
                            {msg.role === "assistant" && <div className="copilot-avatar">✦</div>}
                            <div className={`copilot-bubble ${msg.role === "user" ? "bubble-user" : "bubble-ai"}`}>
                                {msg.content}
                            </div>
                        </div>
                    ))}

                    {loading && (
                        <div className="copilot-row copilot-row-ai">
                            <div className="copilot-avatar">✦</div>
                            <div className="bubble-ai copilot-bubble">
                                <span className="dot-flashing" />
                            </div>
                        </div>
                    )}
                    <div ref={bottomRef} />
                </div>

                {/* Quick Suggestions — only shown at start */}
                {messages.length === 1 && (
                    <div className="copilot-suggestions">
                        {SUGGESTIONS.map((s, i) => (
                            <button key={i} className="suggestion-chip" onClick={() => sendMessage(s)}>
                                {s}
                            </button>
                        ))}
                    </div>
                )}

                {/* Input */}
                <div className="copilot-input-bar">
                    <input
                        className="copilot-input"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        placeholder="Type your question..."
                    />
                    <button
                        className="copilot-send"
                        onClick={() => sendMessage()}
                        disabled={!input.trim() || loading}
                    >
                        ➤
                    </button>
                </div>
            </div>

            <style>{`
        .copilot-fab {
          position: fixed;
          bottom: 28px;
          right: 28px;
          width: 54px;
          height: 54px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white;
          font-size: 20px;
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 20px rgba(99,102,241,0.5);
          z-index: 1000;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .copilot-fab:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 28px rgba(99,102,241,0.7);
        }
        .copilot-panel {
          position: fixed;
          bottom: 92px;
          right: 28px;
          width: 360px;
          height: 500px;
          background: #0f0f13;
          border-radius: 16px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.08);
          display: flex;
          flex-direction: column;
          z-index: 999;
          overflow: hidden;
          opacity: 0;
          transform: translateY(16px) scale(0.96);
          pointer-events: none;
          transition: opacity 0.22s ease, transform 0.25s cubic-bezier(0.34,1.56,0.64,1);
        }
        .copilot-open {
          opacity: 1;
          transform: translateY(0) scale(1);
          pointer-events: all;
        }
        .copilot-header {
          padding: 14px 18px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }
        .copilot-header-icon {
          width: 32px; height: 32px;
          background: rgba(255,255,255,0.2);
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          color: white; font-size: 15px;
        }
        .copilot-title { color: white; font-weight: 700; font-size: 14px; }
        .copilot-subtitle { color: rgba(255,255,255,0.7); font-size: 11px; }
        .copilot-status {
          margin-left: auto;
          color: rgba(255,255,255,0.75);
          font-size: 11px;
          display: flex; align-items: center; gap: 5px;
        }
        .copilot-dot {
          display: inline-block;
          width: 6px; height: 6px;
          background: #4ade80;
          border-radius: 50%;
        }
        .copilot-messages {
          flex: 1;
          overflow-y: auto;
          padding: 14px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          scrollbar-width: thin;
          scrollbar-color: #2a2a3a transparent;
        }
        .copilot-row { display: flex; align-items: flex-end; gap: 8px; }
        .copilot-row-user { justify-content: flex-end; }
        .copilot-row-ai { justify-content: flex-start; }
        .copilot-avatar {
          width: 26px; height: 26px;
          flex-shrink: 0;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border-radius: 7px;
          display: flex; align-items: center; justify-content: center;
          color: white; font-size: 11px;
        }
        .copilot-bubble {
          max-width: 78%;
          padding: 10px 13px;
          font-size: 13px;
          line-height: 1.55;
          border-radius: 14px;
        }
        .bubble-user {
          background: linear-gradient(135deg, #6366f1, #7c3aed);
          color: white;
          border-bottom-right-radius: 4px;
        }
        .bubble-ai {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.09);
          color: #dde4f0;
          border-bottom-left-radius: 4px;
        }
        .copilot-suggestions {
          padding: 0 14px 10px;
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          flex-shrink: 0;
        }
        .suggestion-chip {
          padding: 5px 11px;
          background: rgba(99,102,241,0.12);
          border: 1px solid rgba(99,102,241,0.3);
          border-radius: 20px;
          color: #a5b4fc;
          font-size: 11px;
          cursor: pointer;
          transition: background 0.15s;
        }
        .suggestion-chip:hover { background: rgba(99,102,241,0.28); }
        .copilot-input-bar {
          padding: 10px 14px;
          border-top: 1px solid rgba(255,255,255,0.06);
          display: flex;
          gap: 8px;
          align-items: center;
          flex-shrink: 0;
          background: rgba(255,255,255,0.02);
        }
        .copilot-input {
          flex: 1;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          padding: 9px 13px;
          color: white;
          font-size: 13px;
          outline: none;
        }
        .copilot-input:focus { border-color: rgba(99,102,241,0.5); }
        .copilot-input::placeholder { color: rgba(255,255,255,0.3); }
        .copilot-send {
          width: 36px; height: 36px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border: none;
          border-radius: 10px;
          color: white;
          font-size: 14px;
          cursor: pointer;
          flex-shrink: 0;
          transition: opacity 0.2s;
        }
        .copilot-send:disabled { opacity: 0.3; cursor: not-allowed; }
        .dot-flashing {
          display: inline-flex;
          gap: 4px;
        }
        .dot-flashing::before, .dot-flashing::after,
        .dot-flashing {
          content: '';
        }
        /* Simple typing dots */
        .bubble-ai .dot-flashing {
          display: inline-block;
          width: 8px; height: 8px;
          background: #6366f1;
          border-radius: 50%;
          animation: blink 1.2s ease infinite;
        }
        @keyframes blink {
          0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1); }
        }
      `}</style>
        </>
    );
}