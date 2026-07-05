import { useEffect, useMemo, useState } from "react";

import MainLayout from "../components/MainLayout";

import api from "../../api/axios";

import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
} from "recharts";

import {
  FiPackage,
  FiCheckCircle,
  FiAlertCircle,
  FiMapPin,
  FiTrendingUp,
  FiPieChart,
  FiCalendar,
  FiDownload,
  FiChevronDown,
  FiBell,
  FiAlertTriangle,
} from "react-icons/fi";

import { HiOutlineSparkles } from "react-icons/hi2";

const STAT_CARDS_META = [
  {
    key: "totalParcels",
    label: "Total Parcels",
    icon: FiPackage,
    iconBg: "#DBEAFE",
    iconColor: "#2563EB",
    barColor: "#2563EB",
  },
  {
    key: "delivered",
    label: "Delivered",
    icon: FiCheckCircle,
    iconBg: "#DCFCE7",
    iconColor: "#16A34A",
    barColor: "#22C55E",
  },
  {
    key: "failed",
    label: "Failed",
    icon: FiAlertCircle,
    iconBg: "#FEE2E2",
    iconColor: "#DC2626",
    barColor: "#EF4444",
  },
  {
    key: "activeZones",
    label: "Active Zones",
    icon: FiMapPin,
    iconBg: "#FEF3C7",
    iconColor: "#D97706",
    barColor: "#F59E0B",
  },
];

const PIE_COLORS = { Delivered: "#22C55E", Pending: "#F59E0B", Failed: "#EF4444" };

function formatDateShort(date) {
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
}

function Analytics() {
  const [topZones, setTopZones] = useState([]);

  const [trendData, setTrendData] = useState([]);

  const [showAllZones, setShowAllZones] = useState(false);

  const [showCalendar, setShowCalendar] = useState(false);

  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  const [tempRange, setTempRange] = useState({ start: "", end: "" });

  const [stats, setStats] = useState({
    totalParcels: 0,
    delivered: 0,
    failed: 0,
    activeZones: 0,
  });

  const [insights, setInsights] = useState({
    success_rate: 0,
    top_zone: "",
    failure_reason: "",
    pending: 0,
  });

  const pending = Math.max(
    0,
    stats.totalParcels - stats.delivered - stats.failed,
  );

  const pieData = [
    { name: "Delivered", value: stats.delivered },
    { name: "Pending", value: pending },
    { name: "Failed", value: stats.failed },
  ];

  const pieTotal = stats.totalParcels || 1;

  const buildRangeParams = (range) => {
    const params = {};
    if (range?.start) params.start = range.start;
    if (range?.end) params.end = range.end;
    return params;
  };

  const fetchTopZones = async (range) => {
    try {
      const response = await api.get("/analytics/top-zones", {
        params: buildRangeParams(range),
      });
      setTopZones(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchSummary = async (range) => {
    try {
      const response = await api.get("/analytics/summary", {
        params: buildRangeParams(range),
      });
      setStats(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchInsights = async (range) => {
    try {
      const response = await api.get("/analytics/insights", {
        params: buildRangeParams(range),
      });
      setInsights(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTrend = async (range) => {
    try {
      const response = await api.get("/analytics/delivery-trend", {
        params: buildRangeParams(range),
      });
      setTrendData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchSummary(dateRange);
    fetchTopZones(dateRange);
    fetchInsights(dateRange);
    fetchTrend(dateRange);
  }, [dateRange]);

  const handleToggleCalendar = () => {
    setTempRange(dateRange);
    setShowCalendar((s) => !s);
  };

  const handleApplyRange = () => {
    setDateRange(tempRange);
    setShowCalendar(false);
  };

  const handleClearRange = () => {
    const cleared = { start: "", end: "" };
    setTempRange(cleared);
    setDateRange(cleared);
    setShowCalendar(false);
  };

  const dateRangeLabel = useMemo(() => {
    if (dateRange.start && dateRange.end) {
      return `${formatDateShort(new Date(dateRange.start))} – ${formatDateShort(
        new Date(dateRange.end),
      )}`;
    }
    if (trendData.length >= 2) {
      const first = trendData[0]?.date;
      const last = trendData[trendData.length - 1]?.date;
      if (first && last) return `${first} – ${last}`;
    }
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 6);
    return `${formatDateShort(start)} – ${formatDateShort(end)}`;
  }, [dateRange, trendData]);

  const maxZoneParcels = Math.max(1, ...topZones.map((z) => z.parcels || 0));
  const visibleZones = showAllZones ? topZones : topZones.slice(0, 5);

  const exportReport = () => {
    const rows = [
      ["Metric", "Value"],
      ["Total Parcels", stats.totalParcels],
      ["Delivered", stats.delivered],
      ["Failed", stats.failed],
      ["Active Zones", stats.activeZones],
      [],
      ["Top Delivery Zones"],
      ["Pincode", "Parcels"],
      ...topZones.map((z) => [z.pincode, z.parcels]),
      [],
      ["Delivery Trend"],
      ["Date", "Parcels"],
      ...trendData.map((t) => [t.date, t.parcels]),
    ];

    const csvContent = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "delivery-analytics-report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <MainLayout>
      <div style={styles.page}>
        {/* Header */}
        <div style={styles.headerRow}>
          <div style={styles.headerLeft}>
            <div style={styles.headerIconBox}>
              <FiTrendingUp size={22} color="#2563EB" />
            </div>
            <div>
              <h1 style={styles.title}>Delivery Analytics</h1>
              <p style={styles.subtitle}>
                Monitor delivery performance, operational efficiency and
                business insights.
              </p>
            </div>
          </div>

          <div style={styles.headerActions}>
            <div style={styles.calendarWrap}>
              <div
                onClick={handleToggleCalendar}
                style={{
                  ...styles.dateRangeChip,
                  cursor: "pointer",
                  borderColor: showCalendar ? "#2563EB" : "#E2E8F0",
                }}
              >
                <FiCalendar size={15} color="#64748B" />
                <span>{dateRangeLabel}</span>
                <FiChevronDown size={14} color="#94A3B8" />
              </div>

              {showCalendar && (
                <div style={styles.calendarPanel}>
                  <div style={styles.calendarField}>
                    <label style={styles.calendarLabel}>From</label>
                    <input
                      type="date"
                      value={tempRange.start}
                      max={tempRange.end || undefined}
                      onChange={(e) =>
                        setTempRange((r) => ({ ...r, start: e.target.value }))
                      }
                      style={styles.calendarInput}
                    />
                  </div>

                  <div style={styles.calendarField}>
                    <label style={styles.calendarLabel}>To</label>
                    <input
                      type="date"
                      value={tempRange.end}
                      min={tempRange.start || undefined}
                      onChange={(e) =>
                        setTempRange((r) => ({ ...r, end: e.target.value }))
                      }
                      style={styles.calendarInput}
                    />
                  </div>

                  <div style={styles.calendarActions}>
                    <button
                      onClick={handleClearRange}
                      style={styles.calendarClearBtn}
                    >
                      Clear
                    </button>
                    <button
                      onClick={handleApplyRange}
                      style={styles.calendarApplyBtn}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={exportReport}
              style={styles.exportButton}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#1D4ED8")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#2563EB")}
            >
              <FiDownload size={16} />
              Export Report
            </button>
          </div>
        </div>

        {/* Stat cards */}
        <div style={styles.statGrid}>
          {STAT_CARDS_META.map((meta) => {
            const Icon = meta.icon;
            return (
              <div
                key={meta.key}
                style={{
                  ...styles.statCard,
                  borderLeft: `3px solid ${meta.barColor}`,
                }}
              >
                <div
                  style={{
                    ...styles.statIconBox,
                    background: meta.iconBg,
                  }}
                >
                  <Icon size={24} color={meta.iconColor} />
                </div>
                <div style={styles.statTextCol}>
                  <span style={styles.statLabel}>{meta.label}</span>
                  <span style={styles.statValue}>{stats[meta.key]}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trend + Status row */}
        <div style={styles.trendStatusRow}>
          <div style={styles.card}>
            <div style={styles.cardHeaderRow}>
              <div style={styles.cardHeaderLeft}>
                <div style={styles.cardIconBoxBlue}>
                  <FiTrendingUp size={20} color="#2563EB" />
                </div>
                <div>
                  <h2 style={styles.cardTitle}>Delivery Trend (Last 7 Days)</h2>
                  <p style={styles.cardSubtitle}>
                    Daily parcel volume over the past week.
                  </p>
                </div>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <defs>
                  <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid stroke="#F1F5F9" vertical={false} />

                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94A3B8", fontSize: 12.5 }}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94A3B8", fontSize: 12.5 }}
                />

                <Area
                  type="monotone"
                  dataKey="parcels"
                  stroke="none"
                  fill="url(#trendGradient)"
                />

                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div style={styles.tooltipCard}>
                          <p style={styles.tooltipDate}>Date: {label}</p>
                          <p style={styles.tooltipValue}>
                            {payload[0].value} Parcels
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="parcels"
                  stroke="#2563EB"
                  strokeWidth={3.5}
                  dot={{ r: 5, strokeWidth: 2, fill: "white", stroke: "#2563EB" }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div style={styles.card}>
            <div style={styles.cardHeaderRowSimple}>
              <div style={styles.cardIconBoxGreen}>
                <FiPieChart size={20} color="#16A34A" />
              </div>
              <h2 style={styles.cardTitle}>Delivery Status</h2>
            </div>

            <div style={styles.donutWrap}>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry) => (
                      <Cell key={entry.name} fill={PIE_COLORS[entry.name]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>

              <div style={styles.donutCenter}>
                <span style={styles.donutCenterValue}>
                  {stats.totalParcels}
                </span>
                <span style={styles.donutCenterLabel}>Total</span>
              </div>
            </div>

            <div style={styles.legendList}>
              {pieData.map((entry) => (
                <div key={entry.name} style={styles.legendRow}>
                  <span style={styles.legendLeft}>
                    <span
                      style={{
                        ...styles.legendDot,
                        background: PIE_COLORS[entry.name],
                      }}
                    />
                    {entry.name}
                  </span>
                  <span style={styles.legendValue}>
                    {entry.value} (
                    {((entry.value / pieTotal) * 100).toFixed(1)}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Zones + Insights row */}
        <div style={styles.zonesInsightsRow}>
          <div style={styles.card}>
            <div style={styles.zonesHeaderRow}>
              <div style={styles.cardHeaderLeft}>
                <div style={styles.cardIconBoxAmber}>
                  <FiMapPin size={20} color="#D97706" />
                </div>
                <div>
                  <h2 style={styles.cardTitle}>Top Delivery Zones</h2>
                  <p style={styles.cardSubtitle}>
                    Displays the most active delivery locations based on
                    parcel volume.
                  </p>
                </div>
              </div>

              {topZones.length > 5 && (
                <button
                  onClick={() => setShowAllZones((s) => !s)}
                  style={styles.viewAllButton}
                >
                  {showAllZones ? "Show Less" : "View All"}
                </button>
              )}
            </div>

            <div style={styles.zonesGrid}>
              {visibleZones.map((zone) => (
                <div key={zone.pincode} style={styles.zoneCard}>
                  <span style={styles.zonePincode}>{zone.pincode}</span>
                  <div style={styles.zoneBarTrack}>
                    <div
                      style={{
                        ...styles.zoneBarFill,
                        width: `${(zone.parcels / maxZoneParcels) * 100}%`,
                      }}
                    />
                  </div>
                  <span style={styles.zoneCount}>{zone.parcels}</span>
                </div>
              ))}

              {visibleZones.length === 0 && (
                <p style={styles.emptyZonesText}>No zone data available.</p>
              )}
            </div>
          </div>

          <div style={styles.insightsCard}>
            <div style={styles.cardHeaderRowSimple}>
              <div style={styles.cardIconBoxPurple}>
                <HiOutlineSparkles size={20} color="#7C3AED" />
              </div>
              <h2 style={styles.cardTitle}>AI Business Insights</h2>
            </div>

            <div style={styles.insightsList}>
              <div style={styles.insightRow}>
                <FiCheckCircle size={17} color="#16A34A" style={styles.insightIcon} />
                <span>
                  Delivery success rate is{" "}
                  <b>{insights.success_rate}%</b>.
                </span>
              </div>

              <div style={styles.insightRow}>
                <FiTrendingUp size={17} color="#2563EB" style={styles.insightIcon} />
                <span>
                  <b>{insights.top_zone}</b> is the most active delivery
                  zone.
                </span>
              </div>

              <div style={styles.insightRow}>
                <FiAlertTriangle size={17} color="#D97706" style={styles.insightIcon} />
                <span>
                  <b>{insights.failure_reason}</b> is the major failure
                  reason.
                </span>
              </div>

              <div style={styles.insightRow}>
                <FiBell size={17} color="#EF4444" style={styles.insightIcon} />
                <span>
                  <b>{insights.pending}</b> parcels require immediate
                  attention.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

const styles = {
  page: {
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
    flexWrap: "wrap",
    gap: "16px",
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },
  headerIconBox: {
    width: "48px",
    height: "48px",
    borderRadius: "14px",
    background: "#EFF6FF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  title: {
    margin: 0,
    fontSize: "24px",
    fontWeight: 700,
    color: "#0F172A",
    letterSpacing: "-0.02em",
  },
  subtitle: {
    margin: "4px 0 0",
    color: "#64748B",
    fontSize: "14px",
  },
  headerActions: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  dateRangeChip: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 16px",
    borderRadius: "12px",
    border: "1px solid #E2E8F0",
    background: "white",
    fontSize: "13.5px",
    fontWeight: 600,
    color: "#334155",
    whiteSpace: "nowrap",
  },
  exportButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "#2563EB",
    color: "white",
    border: "none",
    padding: "12px 20px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "14px",
    boxShadow: "0 8px 20px rgba(37, 99, 235, 0.25)",
    transition: "background 0.2s ease",
    whiteSpace: "nowrap",
  },
  statGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "16px",
    marginBottom: "20px",
  },
  statCard: {
    background: "white",
    borderRadius: "16px",
    border: "1px solid #EEF2F6",
    boxShadow: "0 6px 16px rgba(15, 23, 42, 0.03)",
    padding: "24px 26px",
    display: "flex",
    alignItems: "center",
    gap: "18px",
  },
  statIconBox: {
    width: "52px",
    height: "52px",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  statTextCol: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    minWidth: 0,
  },
  statLabel: {
    color: "#94A3B8",
    fontSize: "13.5px",
    fontWeight: 600,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  statValue: {
    fontSize: "28px",
    fontWeight: 700,
    color: "#0F172A",
    lineHeight: 1.1,
  },
  trendStatusRow: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "20px",
    marginBottom: "20px",
    alignItems: "stretch",
  },
  card: {
    background: "white",
    padding: "26px",
    borderRadius: "18px",
    border: "1px solid #EEF2F6",
    boxShadow: "0 10px 25px rgba(15, 23, 42, 0.04)",
  },
  cardHeaderRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "20px",
    flexWrap: "wrap",
    gap: "14px",
  },
  cardHeaderRowSimple: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "18px",
  },
  cardHeaderLeft: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
  },
  cardIconBoxBlue: {
    width: "42px",
    height: "42px",
    borderRadius: "12px",
    background: "#EFF6FF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  cardIconBoxGreen: {
    width: "42px",
    height: "42px",
    borderRadius: "12px",
    background: "#F0FDF4",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  cardIconBoxAmber: {
    width: "42px",
    height: "42px",
    borderRadius: "12px",
    background: "#FFFBEB",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  cardIconBoxPurple: {
    width: "42px",
    height: "42px",
    borderRadius: "12px",
    background: "#F5F3FF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  cardTitle: {
    margin: 0,
    fontSize: "17px",
    fontWeight: 700,
    color: "#0F172A",
  },
  cardSubtitle: {
    margin: "4px 0 0",
    color: "#94A3B8",
    fontSize: "13px",
  },
  calendarWrap: {
    position: "relative",
  },
  calendarPanel: {
    position: "absolute",
    top: "52px",
    right: 0,
    background: "white",
    border: "1px solid #EEF2F6",
    borderRadius: "14px",
    boxShadow: "0 16px 36px rgba(15, 23, 42, 0.14)",
    zIndex: 100,
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    minWidth: "230px",
  },
  calendarField: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  calendarLabel: {
    fontSize: "12px",
    fontWeight: 600,
    color: "#94A3B8",
  },
  calendarInput: {
    border: "1px solid #E2E8F0",
    borderRadius: "8px",
    padding: "8px 10px",
    fontSize: "13.5px",
    color: "#334155",
    fontFamily: "inherit",
  },
  calendarActions: {
    display: "flex",
    justifyContent: "space-between",
    gap: "10px",
    marginTop: "4px",
  },
  calendarClearBtn: {
    flex: 1,
    border: "1px solid #E2E8F0",
    background: "white",
    borderRadius: "8px",
    padding: "8px 0",
    fontSize: "13px",
    fontWeight: 600,
    color: "#64748B",
    cursor: "pointer",
  },
  calendarApplyBtn: {
    flex: 1,
    border: "none",
    background: "#2563EB",
    borderRadius: "8px",
    padding: "8px 0",
    fontSize: "13px",
    fontWeight: 600,
    color: "white",
    cursor: "pointer",
  },
  tooltipCard: {
    background: "white",
    padding: "12px 14px",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
  },
  tooltipDate: {
    margin: 0,
    fontWeight: 600,
    fontSize: "13px",
    color: "#0F172A",
  },
  tooltipValue: {
    margin: "6px 0 0",
    color: "#2563EB",
    fontWeight: 600,
    fontSize: "13px",
  },
  donutWrap: {
    position: "relative",
  },
  donutCenter: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  donutCenterValue: {
    fontSize: "28px",
    fontWeight: 700,
    color: "#0F172A",
  },
  donutCenterLabel: {
    fontSize: "12.5px",
    color: "#94A3B8",
    fontWeight: 600,
  },
  legendList: {
    marginTop: "14px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  legendRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "13.5px",
  },
  legendLeft: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "#334155",
    fontWeight: 600,
  },
  legendDot: {
    width: "9px",
    height: "9px",
    borderRadius: "50%",
  },
  legendValue: {
    color: "#64748B",
    fontWeight: 600,
  },
  zonesInsightsRow: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "20px",
    alignItems: "stretch",
  },
  zonesHeaderRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "22px",
    flexWrap: "wrap",
    gap: "14px",
  },
  viewAllButton: {
    border: "1px solid #E2E8F0",
    background: "white",
    borderRadius: "10px",
    padding: "9px 16px",
    fontSize: "13.5px",
    fontWeight: 600,
    color: "#334155",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  zonesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "14px",
  },
  zoneCard: {
    border: "1px solid #EEF2F6",
    borderRadius: "14px",
    padding: "16px",
    background: "#FAFBFC",
  },
  zonePincode: {
    display: "block",
    fontWeight: 700,
    fontSize: "15px",
    color: "#0F172A",
    marginBottom: "12px",
  },
  zoneBarTrack: {
    height: "6px",
    borderRadius: "4px",
    background: "#E2E8F0",
    overflow: "hidden",
    marginBottom: "8px",
  },
  zoneBarFill: {
    height: "100%",
    borderRadius: "4px",
    background: "#2563EB",
  },
  zoneCount: {
    fontSize: "13px",
    fontWeight: 700,
    color: "#334155",
  },
  emptyZonesText: {
    color: "#94A3B8",
    fontSize: "14px",
    gridColumn: "1 / -1",
    textAlign: "center",
    padding: "20px 0",
  },
  insightsCard: {
    background: "#FAF9FF",
    padding: "26px",
    borderRadius: "18px",
    border: "1px solid #EDE9FE",
  },
  insightsList: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    marginTop: "6px",
  },
  insightRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    fontSize: "14px",
    color: "#334155",
    lineHeight: "1.5",
  },
  insightIcon: {
    marginTop: "2px",
    flexShrink: 0,
  },
};

export default Analytics;