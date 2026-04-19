import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";

/*  helpers  */
const LANG_SPEECH_MAP = { en: "en-IN", hi: "hi-IN", mr: "mr-IN" };

function timestamp() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

/*  styles object  */
const makeStyles = (dark) => ({
  /* Page wrapper */
  page: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px 16px",
    background: dark
      ? "radial-gradient(ellipse at top, #161922 0%, #0c0e16 70%)"
      : "radial-gradient(ellipse at top, #fffbeb 0%, #fafaf9 70%)",
    minHeight: "calc(100vh - 60px)",
  },

  /* Chat card */
  card: {
    width: "100%",
    maxWidth: 520,
    height: "min(700px, calc(100vh - 100px))",
    display: "flex",
    flexDirection: "column",
    borderRadius: 24,
    overflow: "hidden",
    border: `1px solid ${dark ? "#2a2f3d" : "#e7e5e4"}`,
    boxShadow: dark
      ? "0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)"
      : "0 8px 40px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.8)",
    background: dark ? "#161922" : "#ffffff",
  },

  /* Chat header */
  chatHeader: {
    padding: "16px 20px",
    borderBottom: `1px solid ${dark ? "#2a2f3d" : "#e7e5e4"}`,
    background: dark ? "#1e2130" : "#fafaf9",
    display: "flex",
    alignItems: "center",
    gap: 12,
    flexShrink: 0,
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    background: "linear-gradient(135deg, #f59e0b 0%, #10b981 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 20,
    boxShadow: "0 2px 8px rgba(245,158,11,0.3)",
  },

  avatarInfo: {
    flex: 1,
  },

  avatarName: {
    fontWeight: 700,
    fontSize: 15,
    color: dark ? "#f1f0ee" : "#1c1917",
  },

  avatarStatus: {
    fontSize: 12,
    color: "#10b981",
    fontWeight: 500,
    display: "flex",
    alignItems: "center",
    gap: 4,
  },

  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "#10b981",
    display: "inline-block",
    animation: "pulse-green 2s infinite",
  },

  /* Messages area */
  messages: {
    flex: 1,
    overflowY: "auto",
    padding: "20px 16px",
    display: "flex",
    flexDirection: "column",
    gap: 16,
    scrollBehavior: "smooth",
  },

  /* Empty state */
  empty: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: "40px 24px",
    textAlign: "center",
  },

  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    background: dark ? "#1e2130" : "#fffbeb",
    border: `2px solid ${dark ? "#2a2f3d" : "#fde68a"}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 28,
    marginBottom: 8,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: dark ? "#f1f0ee" : "#1c1917",
  },

  emptySub: {
    fontSize: 14,
    color: dark ? "#a8a29e" : "#78716c",
    maxWidth: 260,
    lineHeight: 1.6,
  },

  /* Message rows */
  rowUser: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 8,
  },

  rowBot: {
    display: "flex",
    justifyContent: "flex-start",
    gap: 8,
    alignItems: "flex-end",
  },

  botAvatarSmall: {
    width: 28,
    height: 28,
    borderRadius: 8,
    background: "linear-gradient(135deg, #f59e0b, #10b981)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
    flexShrink: 0,
  },

  bubbleUser: {
    maxWidth: "72%",
    padding: "11px 16px",
    borderRadius: "18px 18px 4px 18px",
    background: "linear-gradient(135deg, #f59e0b, #d97706)",
    color: "#fff",
    fontSize: 14,
    lineHeight: 1.6,
    wordBreak: "break-word",
    boxShadow: "0 2px 8px rgba(245,158,11,0.25)",
    fontWeight: 500,
  },

  bubbleBot: {
    maxWidth: "72%",
    padding: "11px 16px",
    borderRadius: "18px 18px 18px 4px",
    background: dark ? "#1e2130" : "#f5f5f4",
    color: dark ? "#f1f0ee" : "#1c1917",
    fontSize: 14,
    lineHeight: 1.6,
    wordBreak: "break-word",
    border: `1px solid ${dark ? "#2a2f3d" : "#e7e5e4"}`,
  },

  bubbleError: {
    background: dark ? "#2d1515" : "#fef2f2",
    color: dark ? "#fca5a5" : "#991b1b",
    border: `1px solid ${dark ? "#7f1d1d" : "#fecaca"}`,
  },

  timeStamp: {
    fontSize: 11,
    color: dark ? "#57534e" : "#a8a29e",
    marginTop: 4,
    padding: "0 4px",
  },

  /* Typing dots */
  typingWrap: {
    display: "flex",
    gap: 5,
    padding: "6px 4px",
    alignItems: "center",
  },

  /* Quick pills */
  quickBar: {
    padding: "10px 14px 8px",
    borderTop: `1px solid ${dark ? "#2a2f3d" : "#e7e5e4"}`,
    display: "flex",
    flexWrap: "wrap",
    gap: 7,
    background: dark ? "#161922" : "#ffffff",
  },

  pill: {
    padding: "6px 14px",
    borderRadius: 999,
    border: `1px solid ${dark ? "#2a2f3d" : "#e7e5e4"}`,
    background: dark ? "#1e2130" : "#fafaf9",
    color: dark ? "#d6d3d1" : "#57534e",
    fontSize: 12,
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.15s",
    whiteSpace: "nowrap",
  },

  /* Input bar */
  inputBar: {
    padding: "10px 14px 14px",
    borderTop: `1px solid ${dark ? "#2a2f3d" : "#e7e5e4"}`,
    display: "flex",
    gap: 8,
    alignItems: "flex-end",
    background: dark ? "#1e2130" : "#fafaf9",
  },

  textarea: {
    flex: 1,
    background: dark ? "#161922" : "#ffffff",
    border: `1.5px solid ${dark ? "#2a2f3d" : "#e7e5e4"}`,
    color: dark ? "#f1f0ee" : "#1c1917",
    padding: "10px 14px",
    borderRadius: 16,
    fontSize: 14,
    fontFamily: "Inter, sans-serif",
    outline: "none",
    resize: "none",
    minHeight: 44,
    maxHeight: 120,
    lineHeight: 1.5,
    transition: "border-color 0.15s, box-shadow 0.15s",
  },

  micBtn: (isListening) => ({
    width: 44,
    height: 44,
    borderRadius: 14,
    border: `1.5px solid ${isListening ? "#f59e0b" : (dark ? "#2a2f3d" : "#e7e5e4")}`,
    background: isListening
      ? "linear-gradient(135deg, #f59e0b22, #f59e0b33)"
      : (dark ? "#161922" : "#ffffff"),
    color: isListening ? "#f59e0b" : (dark ? "#a8a29e" : "#78716c"),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    flexShrink: 0,
    transition: "all 0.2s",
    position: "relative",
    overflow: "visible",
  }),

  sendBtn: (disabled) => ({
    width: 44,
    height: 44,
    borderRadius: 14,
    background: disabled
      ? (dark ? "#1e2130" : "#f5f5f4")
      : "linear-gradient(135deg, #f59e0b, #d97706)",
    border: "none",
    color: disabled ? (dark ? "#57534e" : "#c4b5a5") : "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: disabled ? "not-allowed" : "pointer",
    flexShrink: 0,
    transition: "all 0.15s",
    boxShadow: disabled ? "none" : "0 2px 8px rgba(245,158,11,0.3)",
  }),
});

/* ─────────────── main component ─────────────── */
function ChatUI({ lang, setShowBooking, darkMode }) {
  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [micError, setMicError] = useState("");

  const chatEndRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);

  const s = makeStyles(darkMode);

  /* ── speech recognition setup ── */
  const SpeechRecognition =
    typeof window !== "undefined" &&
    (window.SpeechRecognition || window.webkitSpeechRecognition);

  const startListening = useCallback(() => {
    if (!SpeechRecognition) {
      setMicError("Speech recognition is not supported in this browser. Try Chrome.");
      return;
    }

    setMicError("");
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.lang = LANG_SPEECH_MAP[lang] || "en-IN";
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setMsg(transcript);
    };

    recognition.onerror = (e) => {
      setIsListening(false);
      if (e.error === "not-allowed") {
        setMicError("Microphone access denied. Please allow mic permissions.");
      } else if (e.error !== "aborted") {
        setMicError("Mic error: " + e.error);
      }
    };

    recognition.onend = () => setIsListening(false);

    recognition.start();
  }, [lang, SpeechRecognition]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  const toggleMic = () => {
    if (isListening) stopListening();
    else startListening();
  };

  /* ── send message ── */
  const sendMessage = async (text = msg) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const userMsg = { role: "user", text: trimmed, time: timestamp() };
    setChat((prev) => [...prev, userMsg]);
    setMsg("");
    setIsLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/chat", {
        message: trimmed,
        lang,
      });
      setChat((prev) => [
        ...prev,
        { role: "bot", text: res.data.response, time: timestamp() },
      ]);
    } catch {
      setChat((prev) => [
        ...prev,
        {
          role: "bot",
          text: "Sorry, something went wrong. Please try again.",
          isError: true,
          time: timestamp(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, isLoading]);

  const quickActions = [
    { label: "📈 Best FD rates", prompt: "Best FD rates for 1 year?" },
    { label: "🛡️ Safe options", prompt: "What are the safest investment options?" },
    { label: "💡 What is FD?", prompt: "What is a Fixed Deposit and how does it work?" },
    { label: "🏦 SBI vs HDFC", prompt: "Compare SBI and HDFC FD rates" },
  ];

  const isEmpty = chat.length === 0;

  return (
    <>
      <style>{`
        @keyframes fd-slide-up {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fd-bounce {
          0%, 80%, 100% { transform: scale(0.7); opacity: 0.4; }
          40%            { transform: scale(1.1); opacity: 1; }
        }
        @keyframes pulse-green {
          0%, 100% { box-shadow: 0 0 0 0 rgba(16,185,129,0.4); }
          50%       { box-shadow: 0 0 0 5px rgba(16,185,129,0); }
        }
        @keyframes pulse-amber {
          0%, 100% { box-shadow: 0 0 0 0 rgba(245,158,11,0.5); }
          50%       { box-shadow: 0 0 0 8px rgba(245,158,11,0); }
        }
        .fd-msg-enter { animation: fd-slide-up 0.2s ease-out; }
        .fd-typing-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: ${darkMode ? "#57534e" : "#a8a29e"};
          animation: fd-bounce 1.2s infinite ease-in-out;
        }
        .fd-typing-dot:nth-child(2) { animation-delay: 0.18s; }
        .fd-typing-dot:nth-child(3) { animation-delay: 0.36s; }
        .fd-pill-btn:hover {
          background: ${darkMode ? "#2a2f3d" : "#fef3c7"} !important;
          border-color: #f59e0b !important;
          color: ${darkMode ? "#fcd34d" : "#92400e"} !important;
        }
        .fd-send:hover:not([disabled]) {
          transform: scale(1.05);
          box-shadow: 0 4px 14px rgba(245,158,11,0.45) !important;
        }
        .fd-mic-pulse {
          animation: pulse-amber 1.5s infinite;
        }
        .fd-textarea:focus {
          border-color: #f59e0b !important;
          box-shadow: 0 0 0 3px rgba(245,158,11,0.12) !important;
        }
      `}</style>

      <div style={s.page}>
        <div style={s.card}>

          {/* ── CHAT HEADER ── */}
          <div style={s.chatHeader}>
            <div style={s.avatar}>🤖</div>
            <div style={s.avatarInfo}>
              <div style={s.avatarName}>FD Assistant</div>
              <div style={s.avatarStatus}>
                <span style={s.onlineDot} />
                Online · {lang === "en" ? "English(Hinglish)" : lang === "hi" ? "हिंदी" : "मराठी"}
              </div>
            </div>
            <div style={{
              padding: "4px 10px",
              borderRadius: 8,
              background: darkMode ? "#161922" : "#fef3c7",
              border: `1px solid ${darkMode ? "#2a2f3d" : "#fde68a"}`,
              fontSize: 11,
              fontWeight: 600,
              color: darkMode ? "#fcd34d" : "#92400e",
              letterSpacing: "0.3px",
            }}>
              AI Powered
            </div>
          </div>

          {/* ── MESSAGES ── */}
          <div style={s.messages}>
            {isEmpty ? (
              <div style={s.empty}>
                <div style={s.emptyIcon}>🏦</div>
                <p style={s.emptyTitle}>FD Assistant</p>
                <p style={s.emptySub}>
                  Ask me about Fixed Deposit rates, tenures, safety, or how to get started investing.
                </p>
                <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap", justifyContent: "center" }}>
                  {["🎤 Voice input", "🌐 Multi-language", "📊 Live rates"].map((tag) => (
                    <span key={tag} style={{
                      padding: "4px 12px",
                      borderRadius: 999,
                      background: darkMode ? "#1e2130" : "#fef3c7",
                      border: `1px solid ${darkMode ? "#2a2f3d" : "#fde68a"}`,
                      fontSize: 12,
                      color: darkMode ? "#fcd34d" : "#92400e",
                      fontWeight: 500,
                    }}>{tag}</span>
                  ))}
                </div>
              </div>
            ) : (
              chat.map((m, i) => (
                <div key={i} className="fd-msg-enter" style={{ display: "flex", flexDirection: "column" }}>
                  <div style={m.role === "user" ? s.rowUser : s.rowBot}>
                    {m.role === "bot" && (
                      <div style={s.botAvatarSmall}>🤖</div>
                    )}
                    <div style={{
                      ...(m.role === "user" ? s.bubbleUser : s.bubbleBot),
                      ...(m.isError ? s.bubbleError : {}),
                    }}>
                      {m.text}
                    </div>
                  </div>
                  <div style={{ ...s.timeStamp, textAlign: m.role === "user" ? "right" : "left", paddingLeft: m.role === "bot" ? 38 : 0 }}>
                    {m.time}
                  </div>
                </div>
              ))
            )}

            {isLoading && (
              <div style={s.rowBot}>
                <div style={s.botAvatarSmall}>🤖</div>
                <div style={{ ...s.bubbleBot }}>
                  <div style={s.typingWrap}>
                    <div className="fd-typing-dot" />
                    <div className="fd-typing-dot" />
                    <div className="fd-typing-dot" />
                  </div>
                </div>
              </div>
            )}

            {micError && (
              <div style={{
                background: darkMode ? "#2d1515" : "#fef2f2",
                color: darkMode ? "#fca5a5" : "#991b1b",
                border: `1px solid ${darkMode ? "#7f1d1d" : "#fecaca"}`,
                borderRadius: 10,
                padding: "8px 12px",
                fontSize: 12,
                textAlign: "center",
              }}>{micError}</div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* ── QUICK ACTIONS ── */}
          <div style={s.quickBar}>
            {quickActions.map((a) => (
              <button
                key={a.label}
                className="fd-pill-btn"
                style={s.pill}
                onClick={() => sendMessage(a.prompt)}
                disabled={isLoading}
              >
                {a.label}
              </button>
            ))}
          </div>

          {/* ── INPUT BAR ── */}
          <div style={s.inputBar}>
            {/* Textarea */}
            <textarea
              ref={inputRef}
              className="fd-textarea"
              style={s.textarea}
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isListening ? "🎤 Listening…" : "Ask about FD rates, safety, returns…"}
              rows={1}
              disabled={isLoading}
            />

            {/* Mic button */}
            <button
              className={isListening ? "fd-mic-pulse" : ""}
              style={s.micBtn(isListening)}
              onClick={toggleMic}
              title={isListening ? "Stop recording" : "Speak your question"}
              disabled={isLoading}
            >
              {isListening ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="6" y="6" width="4" height="12" rx="1" fill="currentColor" stroke="none" />
                  <rect x="14" y="6" width="4" height="12" rx="1" fill="currentColor" stroke="none" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                  <line x1="12" y1="19" x2="12" y2="23" />
                  <line x1="8" y1="23" x2="16" y2="23" />
                </svg>
              )}
            </button>

            {/* Send button */}
            <button
              className="fd-send"
              style={s.sendBtn(!msg.trim() || isLoading)}
              onClick={() => sendMessage()}
              disabled={!msg.trim() || isLoading}
              aria-label="Send message"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </div>

        </div>
      </div>
    </>
  );
}

export default ChatUI;