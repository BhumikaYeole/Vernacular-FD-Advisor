import { useState, useEffect } from "react";
import ChatUI from "../components/ChatUI";
import BookingFlow from "../components/BookingFlow";

function Home() {
  const [lang, setLang] = useState("en");
  const [showBooking, setShowBooking] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [darkMode]);

  const langLabels = {
    en: { flag: "🇬🇧", label: "EN" },
    hi: { flag: "🇮🇳", label: "HI" },
    mr: { flag: "🇮🇳", label: "MR" },
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: darkMode ? "#0c0e16" : "#fafaf9" }}>

      {/* ── HEADER ── */}
      <header style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        borderBottom: `1px solid ${darkMode ? "#2a2f3d" : "#e7e5e4"}`,
        background: darkMode ? "rgba(12,14,22,0.85)" : "rgba(250,250,249,0.85)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        padding: "0 24px",
        height: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: "linear-gradient(135deg, #f59e0b 0%, #10b981 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
            boxShadow: "0 2px 12px rgba(245,158,11,0.35)",
          }}>🏦</div>
          <div>
            <div style={{
              fontWeight: 700,
              fontSize: 16,
              color: darkMode ? "#f1f0ee" : "#1c1917",
              lineHeight: 1.2,
              letterSpacing: "-0.3px",
            }}>Vernacular</div>
            <div style={{
              fontSize: 11,
              color: "#f59e0b",
              fontWeight: 600,
              letterSpacing: "0.5px",
              textTransform: "uppercase",
            }}>FD Advisor</div>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>

          {/* Language Switcher */}
          <div style={{ display: "flex", gap: 4, background: darkMode ? "#161922" : "#f5f5f4", borderRadius: 10, padding: 3 }}>
            {Object.entries(langLabels).map(([code, { flag, label }]) => (
              <button
                key={code}
                onClick={() => setLang(code)}
                style={{
                  padding: "4px 10px",
                  borderRadius: 8,
                  border: "none",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.15s",
                  background: lang === code ? (darkMode ? "#f59e0b" : "#f59e0b") : "transparent",
                  color: lang === code ? "#fff" : (darkMode ? "#a8a29e" : "#78716c"),
                }}
              >
                {flag} {label}
              </button>
            ))}
          </div>

          {/* Book FD shortcut (only in chat view) */}
          {!showBooking && (
            <button
              onClick={() => setShowBooking(true)}
              style={{
                padding: "7px 14px",
                borderRadius: 10,
                border: "none",
                background: "linear-gradient(135deg, #10b981, #059669)",
                color: "#fff",
                fontWeight: 600,
                fontSize: 13,
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(16,185,129,0.3)",
                transition: "transform 0.15s, box-shadow 0.15s",
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
              onMouseEnter={e => { e.target.style.transform = "translateY(-1px)"; e.target.style.boxShadow = "0 4px 12px rgba(16,185,129,0.4)"; }}
              onMouseLeave={e => { e.target.style.transform = ""; e.target.style.boxShadow = "0 2px 8px rgba(16,185,129,0.3)"; }}
            >
              💰 Book FD
            </button>
          )}

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            title={darkMode ? "Switch to Light" : "Switch to Dark"}
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              border: `1px solid ${darkMode ? "#2a2f3d" : "#e7e5e4"}`,
              background: darkMode ? "#161922" : "#fff",
              color: darkMode ? "#f1f0ee" : "#1c1917",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 17,
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {!showBooking ? (
          <ChatUI lang={lang} setShowBooking={setShowBooking} darkMode={darkMode} />
        ) : (
          <BookingFlow lang={lang} setShowBooking={setShowBooking} darkMode={darkMode} />
        )}
      </main>
    </div>
  );
}

export default Home;