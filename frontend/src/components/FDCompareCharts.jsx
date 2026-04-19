import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
} from "recharts";

const CHART_COLORS = ["#f59e0b", "#10b981", "#f87171", "#14b8a6", "#fb923c", "#a78bfa"];

const CustomBarTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: "#1e2130",
        border: "1px solid #2a2f3d",
        borderRadius: 10,
        padding: "10px 14px",
        color: "#f1f0ee",
        fontSize: 13,
        boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
      }}>
        <div style={{ fontWeight: 700, marginBottom: 4 }}>{label}</div>
        <div style={{ color: "#f59e0b", fontWeight: 600 }}>
          {payload[0].value}% p.a.
        </div>
      </div>
    );
  }
  return null;
};

const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: "#1e2130",
        border: "1px solid #2a2f3d",
        borderRadius: 10,
        padding: "10px 14px",
        color: "#f1f0ee",
        fontSize: 13,
        boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
      }}>
        <div style={{ fontWeight: 700, marginBottom: 4 }}>{payload[0].name}</div>
        <div style={{ color: payload[0].payload.fill, fontWeight: 600 }}>
          {payload[0].value}% p.a.
        </div>
      </div>
    );
  }
  return null;
};

function FDCompareCharts({ fds, darkMode }) {
  const data = fds.map((fd) => ({ name: fd.bank, rate: fd.rate }));

  const textColor = darkMode ? "#a8a29e" : "#78716c";
  const gridColor = darkMode ? "#2a2f3d" : "#e7e5e4";
  const bgCard = darkMode ? "#1e2130" : "#ffffff";
  const border = darkMode ? "#2a2f3d" : "#e7e5e4";

  return (
    <div style={{ marginTop: 24, marginBottom: 8, display: "flex", flexDirection: "column", gap: 20 }}>

      {/* ── BAR CHART ── */}
      <div style={{
        background: bgCard,
        border: `1px solid ${border}`,
        borderRadius: 16,
        padding: "20px 16px 12px",
        boxShadow: darkMode ? "0 4px 20px rgba(0,0,0,0.3)" : "0 2px 12px rgba(0,0,0,0.06)",
      }}>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: darkMode ? "#f1f0ee" : "#1c1917" }}>
            📊 Rate Comparison
          </div>
          <div style={{ fontSize: 12, color: textColor, marginTop: 2 }}>Interest rate (% per annum) by bank</div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data} margin={{ top: 4, right: 8, left: -20, bottom: 4 }} barCategoryGap="30%">
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: textColor, fontFamily: "Inter" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[5, 10]}
              tick={{ fontSize: 11, fill: textColor, fontFamily: "Inter" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip content={<CustomBarTooltip />} cursor={{ fill: darkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)" }} />
            <Bar dataKey="rate" radius={[6, 6, 0, 0]}>
              {data.map((_, index) => (
                <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ── PIE CHART ── */}
      <div style={{
        background: bgCard,
        border: `1px solid ${border}`,
        borderRadius: 16,
        padding: "20px 16px 12px",
        boxShadow: darkMode ? "0 4px 20px rgba(0,0,0,0.3)" : "0 2px 12px rgba(0,0,0,0.06)",
      }}>
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: darkMode ? "#f1f0ee" : "#1c1917" }}>
            🥧 Rate Distribution
          </div>
          <div style={{ fontSize: 12, color: textColor, marginTop: 2 }}>Proportional rate share across banks</div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={data.map((d, i) => ({ ...d, fill: CHART_COLORS[i % CHART_COLORS.length] }))}
              cx="50%"
              cy="45%"
              outerRadius={80}
              dataKey="rate"
              nameKey="name"
              paddingAngle={3}
              animationBegin={0}
              animationDuration={600}
            >
              {data.map((_, index) => (
                <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} stroke="none" />
              ))}
            </Pie>
            <Tooltip content={<CustomPieTooltip />} />
            <Legend
              iconType="circle"
              iconSize={8}
              formatter={(value) => (
                <span style={{ fontSize: 12, color: textColor, fontFamily: "Inter" }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default FDCompareCharts;
