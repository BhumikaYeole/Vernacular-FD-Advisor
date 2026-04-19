import { useState } from "react";
import axios from "axios";
import translations from "../utils/translations";
import FDCompareCharts from "./FDCompareCharts";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const TYPE_BADGE = {
  "Public": { bg: "#dbeafe", color: "#1e40af", label: "Public" },
  "Private": { bg: "#fef3c7", color: "#92400e", label: "Private" },
  "Small Finance": { bg: "#d1fae5", color: "#065f46", label: "Small Finance" },
};

function BookingFlow({ lang, setShowBooking, darkMode }) {
  const t = translations[lang];

  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState(50000);
  const [tenure, setTenure] = useState(12);
  const [risk, setRisk] = useState("medium");

  const [fds, setFds] = useState([]);
  const [best, setBest] = useState(null);
  const [insight, setInsight] = useState("");
  const [loading, setLoading] = useState(false);

  const [selectedFD, setSelectedFD] = useState(null);
  const [name, setName] = useState("");
  const [pan, setPan] = useState("");
  const [result, setResult] = useState(null);

  const dark = darkMode;

  /* colors  */
  const bg = dark ? "#0c0e16" : "#fafaf9";
  const surface = dark ? "#161922" : "#ffffff";
  const card = dark ? "#1e2130" : "#ffffff";
  const border = dark ? "#2a2f3d" : "#e7e5e4";
  const text = dark ? "#f1f0ee" : "#1c1917";
  const muted = dark ? "#a8a29e" : "#78716c";

  const fetchFDs = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${API_BASE_URL}/fd-options?tenure=${tenure}&risk=${risk}&lang=${lang}`
      );
      setFds(res.data.all_options);
      setBest(res.data.best_option);
      setInsight(res.data.insight);
      setStep(3);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const calculateReturns = async (fd) => {
    const res = await axios.post(`${API_BASE_URL}/calculate`, {
      amount,
      rate: fd.rate,
      time: tenure / 12,
    });
    setResult(res.data);
  };

  const STEPS = ["Amount", "Tenure", "Compare", "Details", "Done"];

  const inputStyle = {
    width: "100%",
    background: dark ? "#161922" : "#f5f5f4",
    border: `1.5px solid ${border}`,
    color: text,
    padding: "12px 16px",
    borderRadius: 12,
    fontSize: 15,
    fontFamily: "Inter, sans-serif",
    outline: "none",
    transition: "border-color 0.15s, box-shadow 0.15s",
    boxSizing: "border-box",
  };

  const primaryBtn = {
    width: "100%",
    padding: "14px",
    borderRadius: 14,
    border: "none",
    background: "linear-gradient(135deg, #f59e0b, #d97706)",
    color: "#fff",
    fontWeight: 700,
    fontSize: 15,
    fontFamily: "Inter, sans-serif",
    cursor: "pointer",
    boxShadow: "0 4px 14px rgba(245,158,11,0.35)",
    transition: "transform 0.15s, box-shadow 0.15s",
    letterSpacing: "0.2px",
  };

  const outlineBtn = {
    padding: "10px 20px",
    borderRadius: 12,
    border: `1.5px solid ${border}`,
    background: "transparent",
    color: muted,
    fontWeight: 600,
    fontSize: 14,
    fontFamily: "Inter, sans-serif",
    cursor: "pointer",
    transition: "all 0.15s",
  };

  return (
    <>
      <style>{`
        .bf-input:focus { border-color: #f59e0b !important; box-shadow: 0 0 0 3px rgba(245,158,11,0.12) !important; }
        .bf-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(245,158,11,0.45) !important; }
        .bf-primary:active { transform: scale(0.98); }
        .bf-tenure-btn:hover { border-color: #f59e0b !important; color: #f59e0b !important; }
        .bf-fd-card:hover { border-color: #f59e0b !important; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.12) !important; }
        .bf-select-btn:hover { background: linear-gradient(135deg, #10b981, #059669) !important; color: #fff !important; border-color: transparent !important; }
        @keyframes bf-success-pop {
          0%   { transform: scale(0.8); opacity: 0; }
          60%  { transform: scale(1.08); }
          100% { transform: scale(1); opacity: 1; }
        }
        .bf-success-icon { animation: bf-success-pop 0.5s ease-out; }
        @keyframes bf-shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>

      <div style={{ flex: 1, background: bg, overflowY: "auto", padding: "24px 16px 40px" }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>

          {/* BACK */}
          <button
            style={{ ...outlineBtn, marginBottom: 20, display: "flex", alignItems: "center", gap: 6, padding: "8px 16px" }}
            onClick={() => setShowBooking(false)}
          >
            ← Back to Chat
          </button>

          {/* MAIN CARD */}
          <div style={{
            background: surface,
            border: `1px solid ${border}`,
            borderRadius: 24,
            overflow: "hidden",
            boxShadow: dark ? "0 8px 40px rgba(0,0,0,0.4)" : "0 8px 40px rgba(0,0,0,0.08)",
          }}>
            {/* Card Header */}
            <div style={{
              padding: "20px 24px",
              borderBottom: `1px solid ${border}`,
              background: dark ? "#1e2130" : "#fffbeb",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}>
              <div style={{
                width: 42, height: 42, borderRadius: 12,
                background: "linear-gradient(135deg, #f59e0b, #10b981)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 20, boxShadow: "0 2px 8px rgba(245,158,11,0.25)",
              }}>💰</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16, color: text }}>Book a Fixed Deposit</div>
                <div style={{ fontSize: 12, color: muted, marginTop: 1 }}>Compare & invest in minutes</div>
              </div>
            </div>

            {/* STEPPER */}
            <div style={{ padding: "20px 24px 0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
                {STEPS.map((label, idx) => {
                  const stepNum = idx + 1;
                  const isActive = step === stepNum;
                  const isDone = step > stepNum;
                  return (
                    <div key={label} style={{ display: "flex", alignItems: "center", flex: idx < STEPS.length - 1 ? 1 : 0 }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                        <div style={{
                          width: 30, height: 30,
                          borderRadius: "50%",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 12, fontWeight: 700,
                          background: isDone
                            ? "#10b981"
                            : isActive
                              ? "linear-gradient(135deg, #f59e0b, #d97706)"
                              : (dark ? "#1e2130" : "#f5f5f4"),
                          color: isDone || isActive ? "#fff" : muted,
                          boxShadow: isActive ? "0 2px 8px rgba(245,158,11,0.35)" : "none",
                          transition: "all 0.3s",
                          border: `2px solid ${isDone ? "#059669" : isActive ? "#f59e0b" : border}`,
                        }}>
                          {isDone ? "✓" : stepNum}
                        </div>
                        <div style={{ fontSize: 10, color: isActive ? "#f59e0b" : muted, fontWeight: isActive ? 600 : 400, whiteSpace: "nowrap" }}>
                          {label}
                        </div>
                      </div>
                      {idx < STEPS.length - 1 && (
                        <div style={{
                          flex: 1,
                          height: 2,
                          background: isDone ? "#10b981" : (dark ? "#2a2f3d" : "#e7e5e4"),
                          margin: "0 4px",
                          marginBottom: 16,
                          transition: "background 0.3s",
                        }} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* STEP CONTENT */}
            <div style={{ padding: "24px" }}>

              {/* ── STEP 1: Amount ── */}
              {step === 1 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 18, color: text, marginBottom: 4 }}>
                      {t.amount}
                    </div>
                    <div style={{ fontSize: 13, color: muted }}>Enter the amount you want to invest in FD</div>
                  </div>

                  <div style={{ position: "relative" }}>
                    <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontWeight: 700, fontSize: 18, color: muted }}>₹</span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="bf-input"
                      style={{ ...inputStyle, paddingLeft: 36 }}
                    />
                  </div>

                  {/* Quick amount presets */}
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {[10000, 25000, 50000, 100000].map((amt) => (
                      <button
                        key={amt}
                        onClick={() => setAmount(amt)}
                        style={{
                          padding: "6px 14px",
                          borderRadius: 10,
                          border: `1.5px solid ${amount == amt ? "#f59e0b" : border}`,
                          background: amount == amt ? (dark ? "#451a0340" : "#fef3c7") : "transparent",
                          color: amount == amt ? "#f59e0b" : muted,
                          fontSize: 13,
                          fontWeight: 500,
                          cursor: "pointer",
                          transition: "all 0.15s",
                          fontFamily: "Inter, sans-serif",
                        }}
                      >
                        ₹{(amt / 1000)}K
                      </button>
                    ))}
                  </div>

                  <button className="bf-primary" style={primaryBtn} onClick={() => setStep(2)}>
                    Continue →
                  </button>
                </div>
              )}

              {/* ── STEP 2: Tenure ── */}
              {step === 2 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 18, color: text, marginBottom: 4 }}>{t.tenure}</div>
                    <div style={{ fontSize: 13, color: muted }}>How long do you want to lock your funds?</div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
                    {[
                      { val: 6, icon: "", sub: "Short term" },
                      { val: 12, icon: "", sub: "Popular" },
                      { val: 24, icon: "", sub: "Long term" },
                      { val: 36, icon: "", sub: "Best returns" },
                    ].map(({ val: tVal, icon, sub }) => (
                      <button
                        key={tVal}
                        className="bf-tenure-btn"
                        onClick={() => setTenure(tVal)}
                        style={{
                          padding: "14px 8px",
                          borderRadius: 14,
                          border: `2px solid ${tenure == tVal ? "#f59e0b" : border}`,
                          background: tenure == tVal ? (dark ? "#451a0320" : "#fffbeb") : "transparent",
                          color: tenure == tVal ? "#f59e0b" : text,
                          fontWeight: 700,
                          fontSize: 15,
                          cursor: "pointer",
                          transition: "all 0.2s",
                          fontFamily: "Inter, sans-serif",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 3,
                        }}
                      >
                        <span style={{ fontSize: 22 }}>{icon}</span>
                        <span>{tVal} Months</span>
                        <span style={{ fontSize: 11, fontWeight: 400, color: muted }}>{sub}</span>
                      </button>
                    ))}
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: text, marginBottom: 8 }}>
                      Risk Preference
                    </label>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                      {[
                        { value: "low", label: " Safe", sub: "Low risk" },
                        { value: "medium", label: " Balanced", sub: "Medium risk" },
                        { value: "high", label: " High Return", sub: "Higher risk" },
                      ].map((r) => (
                        <button
                          key={r.value}
                          onClick={() => setRisk(r.value)}
                          style={{
                            padding: "10px 6px",
                            borderRadius: 12,
                            border: `2px solid ${risk === r.value ? "#10b981" : border}`,
                            background: risk === r.value ? (dark ? "#06402020" : "#d1fae5") : "transparent",
                            color: risk === r.value ? "#059669" : text,
                            fontWeight: 600,
                            fontSize: 12,
                            cursor: "pointer",
                            transition: "all 0.15s",
                            fontFamily: "Inter, sans-serif",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 2,
                          }}
                        >
                          <span style={{ fontSize: 16 }}>{r.label.split(" ")[0]}</span>
                          <span>{r.label.split(" ").slice(1).join(" ")}</span>
                          <span style={{ fontSize: 10, color: muted, fontWeight: 400 }}>{r.sub}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    className="bf-primary"
                    style={{ ...primaryBtn, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
                    onClick={fetchFDs}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: "spin 1s linear infinite" }}>
                          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                        </svg>
                        Finding best rates…
                      </>
                    ) : `🔍 ${t.findFD}`}
                  </button>

                  <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
                </div>
              )}

              {/* ── STEP 3: Compare ── */}
              {step === 3 && (
                <div>
                  <div style={{ fontWeight: 700, fontSize: 18, color: text, marginBottom: 4 }}>{t.compare}</div>
                  <div style={{ fontSize: 13, color: muted, marginBottom: 16 }}>Choose the best FD for your needs</div>

                  {/* AI INSIGHT */}
                  {insight && (
                    <div style={{
                      padding: "14px 16px",
                      borderRadius: 14,
                      background: dark ? "#1a1f0e" : "#f0fdf4",
                      border: `1px solid ${dark ? "#2a3a1e" : "#bbf7d0"}`,
                      marginBottom: 16,
                    }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#10b981", marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
                        <span>✨</span> AI Recommendation
                      </div>
                      <div style={{ fontSize: 13, color: dark ? "#d1fae5" : "#065f46", lineHeight: 1.6 }}>{insight}</div>
                    </div>
                  )}

                  {/* BEST BADGE */}
                  {best && (
                    <div style={{
                      padding: "12px 16px",
                      borderRadius: 14,
                      background: "linear-gradient(135deg, #f59e0b15, #10b98115)",
                      border: "1px solid #f59e0b40",
                      marginBottom: 20,
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}>
                      <span style={{ fontSize: 22 }}>⭐</span>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: "#f59e0b" }}>TOP PICK</div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: text }}>{best.bank} · {best.rate}% p.a.</div>
                      </div>
                    </div>
                  )}

                  {/* ── CHARTS ── */}
                  {fds.length > 0 && <FDCompareCharts fds={fds} darkMode={darkMode} />}

                  {/* FD CARDS */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 8 }}>
                    {fds.map((fd, i) => {
                      const badge = TYPE_BADGE[fd.type] || TYPE_BADGE["Public"];
                      return (
                        <div
                          key={i}
                          className="bf-fd-card"
                          style={{
                            padding: "16px",
                            border: `1.5px solid ${border}`,
                            borderRadius: 16,
                            background: card,
                            cursor: "pointer",
                            transition: "all 0.2s",
                            boxShadow: dark ? "0 2px 8px rgba(0,0,0,0.2)" : "0 2px 8px rgba(0,0,0,0.04)",
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                            <div>
                              <div style={{ fontWeight: 700, fontSize: 15, color: text }}>{fd.bank}</div>
                              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                                <span style={{
                                  padding: "2px 8px",
                                  borderRadius: 6,
                                  background: badge.bg,
                                  color: badge.color,
                                  fontSize: 11,
                                  fontWeight: 600,
                                }}>{badge.label}</span>
                                <span style={{ fontSize: 12, color: muted }}>• {fd.risk}</span>
                              </div>
                            </div>
                            <div style={{
                              fontWeight: 800,
                              fontSize: 22,
                              color: "#f59e0b",
                              lineHeight: 1,
                            }}>{fd.rate}%<span style={{ fontSize: 12, fontWeight: 500, color: muted }}> p.a.</span></div>
                          </div>

                          <button
                            className="bf-select-btn"
                            onClick={() => {
                              setSelectedFD(fd);
                              calculateReturns(fd);
                              setStep(4);
                            }}
                            style={{
                              width: "100%",
                              padding: "10px",
                              borderRadius: 10,
                              border: `1.5px solid ${border}`,
                              background: "transparent",
                              color: text,
                              fontWeight: 600,
                              fontSize: 14,
                              cursor: "pointer",
                              transition: "all 0.2s",
                              fontFamily: "Inter, sans-serif",
                            }}
                          >
                            {t.select} →
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ── STEP 4: Details ── */}
              {step === 4 && selectedFD && (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 18, color: text }}>Confirm your FD</div>
                    <div style={{ fontSize: 13, color: muted, marginTop: 2 }}>Review details before booking</div>
                  </div>

                  {/* Summary card */}
                  <div style={{
                    padding: "16px",
                    borderRadius: 16,
                    background: dark ? "#1a1f0e" : "#f0fdf4",
                    border: `1px solid ${dark ? "#2a3a1e" : "#bbf7d0"}`,
                  }}>
                    <div style={{ fontWeight: 700, fontSize: 16, color: text, marginBottom: 12 }}>
                      {selectedFD.bank} · {selectedFD.rate}% p.a.
                    </div>
                    {result && (
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                        {[
                          { label: "Principal", value: `₹${Number(amount).toLocaleString()}` },
                          { label: "Maturity", value: `₹${Number(result.maturity).toLocaleString()}` },
                          { label: "Interest Earned", value: `₹${Number(result.interest).toLocaleString()}` },
                          { label: "Tenure", value: `${tenure} months` },
                        ].map(({ label, value }) => (
                          <div key={label}>
                            <div style={{ fontSize: 11, color: muted, marginBottom: 2 }}>{label}</div>
                            <div style={{ fontSize: 15, fontWeight: 700, color: label === "Interest Earned" ? "#10b981" : text }}>{value}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <input
                      className="bf-input"
                      style={inputStyle}
                      placeholder={t.name}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <input
                      className="bf-input"
                      style={{ ...inputStyle, textTransform: "uppercase" }}
                      placeholder={t.pan + " (e.g. ABCDE1234F)"}
                      value={pan}
                      onChange={(e) => setPan(e.target.value.toUpperCase())}
                      maxLength={10}
                    />
                  </div>

                  <button
                    className="bf-primary"
                    style={primaryBtn}
                    onClick={() => setStep(5)}
                    disabled={!name || pan.length < 10}
                  >
                    ✅ {t.confirm}
                  </button>
                </div>
              )}

              {/* ── STEP 5: Success ── */}
              {step === 5 && (
                <div style={{ textAlign: "center", padding: "20px 0 10px" }}>
                  <div className="bf-success-icon" style={{
                    width: 80, height: 80,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #10b981, #059669)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 36,
                    margin: "0 auto 16px",
                    boxShadow: "0 8px 24px rgba(16,185,129,0.4)",
                  }}>✅</div>

                  <div style={{ fontWeight: 800, fontSize: 20, color: "#10b981", marginBottom: 6 }}>
                    {t.success}!
                  </div>
                  <div style={{ fontSize: 14, color: muted, marginBottom: 24, lineHeight: 1.6 }}>
                    Your FD has been booked with {selectedFD?.bank}
                  </div>

                  <div style={{
                    background: dark ? "#1e2130" : "#f5f5f4",
                    borderRadius: 16,
                    padding: "16px",
                    border: `1px solid ${border}`,
                    textAlign: "left",
                    marginBottom: 20,
                  }}>
                    {[
                      { label: "Name", value: name },
                      { label: "Bank", value: selectedFD?.bank },
                      { label: "Amount", value: `₹${Number(amount).toLocaleString()}` },
                      { label: "Rate", value: `${selectedFD?.rate}% p.a.` },
                      { label: "Maturity", value: result ? `₹${Number(result.maturity).toLocaleString()}` : "—" },
                    ].map(({ label, value }) => (
                      <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${border}` }}>
                        <span style={{ fontSize: 13, color: muted }}>{label}</span>
                        <span style={{ fontSize: 13, fontWeight: 600, color: text }}>{value}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    style={{ ...primaryBtn, background: "linear-gradient(135deg, #10b981, #059669)", boxShadow: "0 4px 14px rgba(16,185,129,0.35)" }}
                    onClick={() => { setShowBooking(false); }}
                  >
                    ← Back to Chat
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default BookingFlow;