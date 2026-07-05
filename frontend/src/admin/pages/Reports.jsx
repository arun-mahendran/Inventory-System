import { useState, useRef, useEffect } from "react";

import MainLayout from "../components/MainLayout";

import api from "../../api/axios";

import {
  FiDownload,
  FiFileText,
  FiCalendar,
  FiUser,
  FiFile,
  FiPackage,
  FiPieChart,
  FiTrash2,
  FiClock,
  FiMail,
  FiSettings,
  FiChevronRight,
} from "react-icons/fi";

const TYPE_META = {
  Delivery: { bg: "#DBEAFE", color: "#2563EB" },
  Parcels: { bg: "#FFEDD5", color: "#EA580C" },
  Agents: { bg: "#DCFCE7", color: "#16A34A" },
  Analytics: { bg: "#EDE9FE", color: "#7C3AED" },
};

// Icons aren't JSON-serializable, so reports are stored with just a `type`
// string and the icon is looked up from here whenever a row is rendered.
const ICONS_BY_TYPE = {
  Delivery: FiFileText,
  Parcels: FiPackage,
  Agents: FiUser,
  Analytics: FiPieChart,
};

const STORAGE_KEYS = {
  REPORTS: "reports.recentReports",
  COUNTER: "reports.counter",
  SCHEDULE: "reports.scheduleConfig",
  EMAIL: "reports.emailConfig",
  SETTINGS: "reports.settings",
};

function loadJSON(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    console.log(`Failed to read ${key} from storage`, error);
    return fallback;
  }
}

function saveJSON(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.log(`Failed to save ${key} to storage`, error);
  }
}

// No more hardcoded demo rows — the table starts empty and only ever shows
// reports that were actually downloaded (persisted in localStorage so a
// page refresh doesn't wipe them).
function loadStoredReports() {
  const stored = loadJSON(STORAGE_KEYS.REPORTS, []);
  return stored.map((r) => ({ ...r, icon: ICONS_BY_TYPE[r.type] || FiFileText }));
}

// key doubles as the identifier used to open the matching modal below
const QUICK_ACTIONS = [
  {
    key: "scheduled",
    title: "Scheduled Reports",
    subtitle: "Set up automated reports",
    icon: FiClock,
    iconBg: "#EDE9FE",
    iconColor: "#7C3AED",
  },
  {
    key: "email",
    title: "Email Reports",
    subtitle: "Receive reports in email",
    icon: FiMail,
    iconBg: "#DCFCE7",
    iconColor: "#16A34A",
  },
  {
    key: "settings",
    title: "Report Settings",
    subtitle: "Manage preferences",
    icon: FiSettings,
    iconBg: "#DBEAFE",
    iconColor: "#2563EB",
  },
];

function formatDateTime(date) {
  const datePart = date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const timePart = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${datePart}, ${timePart}`;
}

function Reports() {
  const [recentReports, setRecentReports] = useState(loadStoredReports);

  // Keeps generating unique, ever-increasing numbers for auto report names.
  // Restored from storage too, so numbering keeps climbing after a refresh
  // instead of restarting at 1 and risking duplicate names.
  const reportCounterRef = useRef(loadJSON(STORAGE_KEYS.COUNTER, 0));

  const [toast, setToast] = useState("");
  const [activeModal, setActiveModal] = useState(null); // "scheduled" | "email" | "settings" | null

  const [scheduleConfig, setScheduleConfig] = useState(() =>
    loadJSON(STORAGE_KEYS.SCHEDULE, {
      enabled: false,
      frequency: "Daily",
      time: "09:00",
      reportType: "Delivery",
    })
  );
  const [emailConfig, setEmailConfig] = useState(() =>
    loadJSON(STORAGE_KEYS.EMAIL, { enabled: false, email: "", frequency: "Daily" })
  );
  const [reportSettings, setReportSettings] = useState(() =>
    loadJSON(STORAGE_KEYS.SETTINGS, {
      defaultReportType: "Delivery",
      autoOpenAfterDownload: true,
    })
  );

  // Persist every time the underlying data actually changes.
  useEffect(() => {
    // icon is a component reference and gets dropped by JSON.stringify
    // automatically, which is fine since we rebuild it from `type` on load.
    saveJSON(STORAGE_KEYS.REPORTS, recentReports);
  }, [recentReports]);

  useEffect(() => saveJSON(STORAGE_KEYS.SCHEDULE, scheduleConfig), [scheduleConfig]);
  useEffect(() => saveJSON(STORAGE_KEYS.EMAIL, emailConfig), [emailConfig]);
  useEffect(() => saveJSON(STORAGE_KEYS.SETTINGS, reportSettings), [reportSettings]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 2500);
    return () => clearTimeout(timer);
  }, [toast]);

  const generatedOn = formatDateTime(new Date());

  const downloadPDF = async () => {
    try {
      const response = await api.get("/reports/download-pdf", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));

      const link = document.createElement("a");

      link.href = url;

      link.setAttribute("download", "delivery_report.pdf");

      document.body.appendChild(link);

      link.click();

      link.remove();

      // Backend doesn't support custom report names yet, so we auto-generate
      // one (Delivery Report #N) and stamp it with the current date/time.
      reportCounterRef.current += 1;
      saveJSON(STORAGE_KEYS.COUNTER, reportCounterRef.current);

      const newReport = {
        id: Date.now(),
        name: `Delivery Report #${reportCounterRef.current}`,
        type: "Delivery",
        icon: FiFileText,
        generatedOn: formatDateTime(new Date()),
        generatedBy: "Admin User",
      };

      setRecentReports((prev) => [newReport, ...prev]);
    } catch (error) {
      console.log(error);

      alert("Unable to download report");
    }
  };

  // Row-level "download" just re-fetches the file for an already-listed
  // report — it should NOT add another row to the table.
  const redownloadReport = async () => {
    try {
      const response = await api.get("/reports/download-pdf", {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "delivery_report.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.log(error);
      alert("Unable to download report");
    }
  };

  const handleDeleteReport = (id) => {
    setRecentReports((prev) => prev.filter((r) => r.id !== id));
  };

  const openModal = (key) => setActiveModal(key);
  const closeModal = () => setActiveModal(null);

  const handleSaveSchedule = () => {
    closeModal();
    setToast("Schedule preferences saved");
  };

  const handleSaveEmail = () => {
    closeModal();
    setToast("Email preferences saved");
  };

  const handleSaveSettings = () => {
    closeModal();
    setToast("Report settings saved");
  };

  return (
    <MainLayout>
      <div style={styles.page}>
        {/* Header */}
        <div style={styles.headerRow}>
          <div style={styles.headerLeft}>
            <div style={styles.headerIconBox}>
              <FiFileText size={26} color="#4F46E5" />
            </div>
            <div>
              <h1 style={styles.title}>Reports Dashboard</h1>
              <p style={styles.subtitle}>
                Generate and download operational reports with ease.
              </p>
            </div>
          </div>

          <div style={styles.illustrationWrap}>
            <div style={styles.illustrationBlob} />
            <div style={styles.illustrationCard}>
              <div style={styles.illustrationPie} />
              <div style={styles.illustrationLines}>
                <span style={{ ...styles.illustrationLine, width: "70%" }} />
                <span style={{ ...styles.illustrationLine, width: "55%" }} />
                <span style={{ ...styles.illustrationLine, width: "62%" }} />
              </div>
              <div style={styles.illustrationBars}>
                <span style={{ ...styles.illustrationBar, height: "18px" }} />
                <span style={{ ...styles.illustrationBar, height: "30px" }} />
                <span style={{ ...styles.illustrationBar, height: "22px" }} />
                <span style={{ ...styles.illustrationBar, height: "38px" }} />
              </div>
            </div>
            <div style={styles.illustrationBadge}>
              <FiDownload size={16} color="white" />
            </div>
          </div>
        </div>

        {/* Delivery Reports card */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Delivery Reports</h2>
          <p style={styles.cardSubtitle}>
            Download delivery analytics and operational reports.
          </p>

          <div style={styles.infoBox}>
            <div style={styles.infoItem}>
              <div style={{ ...styles.infoIconBox, background: "#EDE9FE" }}>
                <FiFileText size={20} color="#7C3AED" />
              </div>
              <div>
                <span style={styles.infoLabel}>Report Type</span>
                <p style={styles.infoValue}>Delivery Operations Report</p>
              </div>
            </div>

            <div style={styles.infoDivider} />

            <div style={styles.infoItem}>
              <div style={{ ...styles.infoIconBox, background: "#DCFCE7" }}>
                <FiFile size={20} color="#16A34A" />
              </div>
              <div>
                <span style={styles.infoLabel}>Format</span>
                <p style={styles.infoValue}>PDF Document</p>
              </div>
            </div>

            <div style={styles.infoDivider} />

            <div style={styles.infoItem}>
              <div style={{ ...styles.infoIconBox, background: "#FEF3C7" }}>
                <FiUser size={20} color="#D97706" />
              </div>
              <div>
                <span style={styles.infoLabel}>Generated By</span>
                <p style={styles.infoValue}>Admin User</p>
              </div>
            </div>

            <div style={styles.infoDivider} />

            <div style={styles.infoItem}>
              <div style={{ ...styles.infoIconBox, background: "#FEE2E2" }}>
                <FiCalendar size={20} color="#DC2626" />
              </div>
              <div>
                <span style={styles.infoLabel}>Generated On</span>
                <p style={styles.infoValue}>{generatedOn}</p>
              </div>
            </div>
          </div>

          <button
            onClick={downloadPDF}
            style={styles.downloadButton}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
          >
            <FiDownload size={18} />
            Download PDF Report
          </button>
        </div>

        {/* Recent Reports card */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Recent Reports</h2>

          <div style={styles.tableWrap}>
            <div style={styles.tableHeaderRow}>
              <span style={{ ...styles.tableHeaderCell, flex: 2.4 }}>
                Report Name
              </span>
              <span style={{ ...styles.tableHeaderCell, flex: 1 }}>Type</span>
              <span style={{ ...styles.tableHeaderCell, flex: 0.8 }}>
                Format
              </span>
              <span style={{ ...styles.tableHeaderCell, flex: 1.4 }}>
                Generated On
              </span>
              <span style={{ ...styles.tableHeaderCell, flex: 1.1 }}>
                Generated By
              </span>
              <span
                style={{
                  ...styles.tableHeaderCell,
                  flex: 0.9,
                  textAlign: "right",
                }}
              >
                Action
              </span>
            </div>

            {recentReports.map((report) => {
              const Icon = report.icon;
              const meta = TYPE_META[report.type];

              return (
                <div key={report.id} style={styles.tableRow}>
                  <div style={{ ...styles.tableCell, flex: 2.4, gap: "10px" }}>
                    <div
                      style={{
                        ...styles.rowIconBox,
                        background: meta.bg,
                      }}
                    >
                      <Icon size={16} color={meta.color} />
                    </div>
                    <span style={styles.rowName}>{report.name}</span>
                  </div>

                  <div style={{ ...styles.tableCell, flex: 1 }}>
                    <span
                      style={{
                        ...styles.typePill,
                        background: meta.bg,
                        color: meta.color,
                      }}
                    >
                      {report.type}
                    </span>
                  </div>

                  <div style={{ ...styles.tableCell, flex: 0.8, gap: "6px" }}>
                    <FiFile size={15} color="#DC2626" />
                    <span style={styles.rowMuted}>PDF</span>
                  </div>

                  <div style={{ ...styles.tableCell, flex: 1.4 }}>
                    <span style={styles.rowMuted}>{report.generatedOn}</span>
                  </div>

                  <div style={{ ...styles.tableCell, flex: 1.1 }}>
                    <span style={styles.rowMuted}>{report.generatedBy}</span>
                  </div>

                  <div
                    style={{
                      ...styles.tableCell,
                      flex: 0.9,
                      justifyContent: "flex-end",
                      gap: "8px",
                    }}
                  >
                    <button
                      onClick={redownloadReport}
                      style={styles.actionIconBtnBlue}
                      title="Download"
                    >
                      <FiDownload size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteReport(report.id)}
                      style={styles.actionIconBtnRed}
                      title="Delete"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}

            {recentReports.length === 0 && (
              <p style={styles.emptyRowsText}>No recent reports.</p>
            )}
          </div>
        </div>

        {/* Quick actions */}
        <div style={styles.quickGrid}>
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.key}
                style={styles.quickCard}
                onClick={() => openModal(action.key)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#CBD5E1";
                  e.currentTarget.style.boxShadow =
                    "0 10px 25px rgba(15, 23, 42, 0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#EEF2F6";
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(15, 23, 42, 0.03)";
                }}
              >
                <div style={styles.quickLeft}>
                  <div
                    style={{
                      ...styles.quickIconBox,
                      background: action.iconBg,
                    }}
                  >
                    <Icon size={19} color={action.iconColor} />
                  </div>
                  <div style={styles.quickTextCol}>
                    <span style={styles.quickTitle}>{action.title}</span>
                    <span style={styles.quickSubtitle}>{action.subtitle}</span>
                  </div>
                </div>
                <FiChevronRight size={18} color="#94A3B8" />
              </button>
            );
          })}
        </div>

        {/* Toast */}
        {toast && <div style={styles.toast}>{toast}</div>}

        {/* Scheduled Reports modal */}
        {activeModal === "scheduled" && (
          <div style={styles.modalOverlay} onClick={closeModal}>
            <div style={styles.modalCard} onClick={(e) => e.stopPropagation()}>
              <h3 style={styles.modalTitle}>Scheduled Reports</h3>
              <p style={styles.modalSubtitle}>
                Automatically generate a report on a recurring basis.
              </p>

              <label style={styles.modalCheckboxRow}>
                <input
                  type="checkbox"
                  checked={scheduleConfig.enabled}
                  onChange={(e) =>
                    setScheduleConfig((prev) => ({ ...prev, enabled: e.target.checked }))
                  }
                />
                Enable scheduled generation
              </label>

              <div style={styles.modalField}>
                <span style={styles.modalLabel}>Report Type</span>
                <select
                  style={styles.modalInput}
                  value={scheduleConfig.reportType}
                  onChange={(e) =>
                    setScheduleConfig((prev) => ({ ...prev, reportType: e.target.value }))
                  }
                >
                  {Object.keys(ICONS_BY_TYPE).map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div style={styles.modalField}>
                <span style={styles.modalLabel}>Frequency</span>
                <select
                  style={styles.modalInput}
                  value={scheduleConfig.frequency}
                  onChange={(e) =>
                    setScheduleConfig((prev) => ({ ...prev, frequency: e.target.value }))
                  }
                >
                  <option>Daily</option>
                  <option>Weekly</option>
                  <option>Monthly</option>
                </select>
              </div>

              <div style={styles.modalField}>
                <span style={styles.modalLabel}>Time</span>
                <input
                  type="time"
                  style={styles.modalInput}
                  value={scheduleConfig.time}
                  onChange={(e) =>
                    setScheduleConfig((prev) => ({ ...prev, time: e.target.value }))
                  }
                />
              </div>

              <p style={styles.modalNote}>
                Saved on this device for now. Actual automatic generation and
                delivery will start working once the backend adds schedule
                support.
              </p>

              <div style={styles.modalActions}>
                <button style={styles.modalCancelBtn} onClick={closeModal}>
                  Cancel
                </button>
                <button style={styles.modalSaveBtn} onClick={handleSaveSchedule}>
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Email Reports modal */}
        {activeModal === "email" && (
          <div style={styles.modalOverlay} onClick={closeModal}>
            <div style={styles.modalCard} onClick={(e) => e.stopPropagation()}>
              <h3 style={styles.modalTitle}>Email Reports</h3>
              <p style={styles.modalSubtitle}>
                Get reports delivered straight to an inbox.
              </p>

              <label style={styles.modalCheckboxRow}>
                <input
                  type="checkbox"
                  checked={emailConfig.enabled}
                  onChange={(e) =>
                    setEmailConfig((prev) => ({ ...prev, enabled: e.target.checked }))
                  }
                />
                Enable email delivery
              </label>

              <div style={styles.modalField}>
                <span style={styles.modalLabel}>Email address</span>
                <input
                  type="email"
                  style={styles.modalInput}
                  placeholder="name@company.com"
                  value={emailConfig.email}
                  onChange={(e) =>
                    setEmailConfig((prev) => ({ ...prev, email: e.target.value }))
                  }
                />
              </div>

              <div style={styles.modalField}>
                <span style={styles.modalLabel}>Frequency</span>
                <select
                  style={styles.modalInput}
                  value={emailConfig.frequency}
                  onChange={(e) =>
                    setEmailConfig((prev) => ({ ...prev, frequency: e.target.value }))
                  }
                >
                  <option>Daily</option>
                  <option>Weekly</option>
                  <option>Monthly</option>
                </select>
              </div>

              <p style={styles.modalNote}>
                Saved on this device for now. Actual emails will start going
                out once the backend adds an email-delivery endpoint.
              </p>

              <div style={styles.modalActions}>
                <button style={styles.modalCancelBtn} onClick={closeModal}>
                  Cancel
                </button>
                <button style={styles.modalSaveBtn} onClick={handleSaveEmail}>
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Report Settings modal */}
        {activeModal === "settings" && (
          <div style={styles.modalOverlay} onClick={closeModal}>
            <div style={styles.modalCard} onClick={(e) => e.stopPropagation()}>
              <h3 style={styles.modalTitle}>Report Settings</h3>
              <p style={styles.modalSubtitle}>Manage default report preferences.</p>

              <div style={styles.modalField}>
                <span style={styles.modalLabel}>Default report type</span>
                <select
                  style={styles.modalInput}
                  value={reportSettings.defaultReportType}
                  onChange={(e) =>
                    setReportSettings((prev) => ({
                      ...prev,
                      defaultReportType: e.target.value,
                    }))
                  }
                >
                  {Object.keys(ICONS_BY_TYPE).map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <label style={styles.modalCheckboxRow}>
                <input
                  type="checkbox"
                  checked={reportSettings.autoOpenAfterDownload}
                  onChange={(e) =>
                    setReportSettings((prev) => ({
                      ...prev,
                      autoOpenAfterDownload: e.target.checked,
                    }))
                  }
                />
                Automatically open the file after download
              </label>

              <p style={styles.modalNote}>
                These preferences are saved on this device. Syncing them
                across devices will need a backend settings endpoint.
              </p>

              <div style={styles.modalActions}>
                <button style={styles.modalCancelBtn} onClick={closeModal}>
                  Cancel
                </button>
                <button style={styles.modalSaveBtn} onClick={handleSaveSettings}>
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

const styles = {
  page: {
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    maxWidth: "1300px",
    margin: "0 auto",
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
    gap: "20px",
    flexWrap: "wrap",
  },
  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  headerIconBox: {
    width: "56px",
    height: "56px",
    borderRadius: "16px",
    background: "#EEF2FF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  title: {
    margin: 0,
    fontSize: "28px",
    fontWeight: 700,
    color: "#0F172A",
    letterSpacing: "-0.02em",
  },
  subtitle: {
    margin: "6px 0 0",
    color: "#64748B",
    fontSize: "14.5px",
  },
  illustrationWrap: {
    position: "relative",
    width: "140px",
    height: "110px",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  illustrationBlob: {
    position: "absolute",
    width: "140px",
    height: "140px",
    borderRadius: "50%",
    background:
      "radial-gradient(circle at 50% 40%, #DBEAFE 0%, #EFF6FF 70%, rgba(239,246,255,0) 100%)",
  },
  illustrationCard: {
    position: "relative",
    width: "90px",
    height: "104px",
    background: "white",
    borderRadius: "12px",
    boxShadow: "0 14px 26px rgba(15, 23, 42, 0.12)",
    transform: "rotate(-6deg)",
    padding: "12px 10px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  illustrationPie: {
    width: "26px",
    height: "26px",
    borderRadius: "50%",
    background:
      "conic-gradient(#2563EB 0deg 150deg, #7C3AED 150deg 230deg, #F59E0B 230deg 360deg)",
  },
  illustrationLines: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  illustrationLine: {
    display: "block",
    height: "4px",
    borderRadius: "2px",
    background: "#E2E8F0",
  },
  illustrationBars: {
    display: "flex",
    alignItems: "flex-end",
    gap: "4px",
    height: "38px",
    marginTop: "auto",
  },
  illustrationBar: {
    width: "8px",
    borderRadius: "3px",
    background: "linear-gradient(180deg, #60A5FA, #2563EB)",
    display: "block",
  },
  illustrationBadge: {
    position: "absolute",
    bottom: "2px",
    right: "6px",
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    background: "#F59E0B",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 8px 18px rgba(245, 158, 11, 0.4)",
    border: "3px solid white",
  },
  card: {
    background: "white",
    padding: "28px",
    borderRadius: "20px",
    marginBottom: "22px",
    border: "1px solid #EEF2F6",
    boxShadow: "0 10px 30px rgba(15, 23, 42, 0.04)",
  },
  cardTitle: {
    margin: 0,
    fontSize: "19px",
    fontWeight: 700,
    color: "#0F172A",
  },
  cardSubtitle: {
    margin: "6px 0 24px",
    color: "#64748B",
    fontSize: "14px",
  },
  infoBox: {
    background: "#F8FAFC",
    border: "1px solid #E2E8F0",
    borderRadius: "16px",
    padding: "22px 24px",
    marginBottom: "26px",
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "22px",
  },
  infoItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flex: 1,
    minWidth: "190px",
  },
  infoIconBox: {
    width: "42px",
    height: "42px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  infoLabel: {
    display: "block",
    fontSize: "12.5px",
    fontWeight: 600,
    color: "#94A3B8",
    marginBottom: "3px",
  },
  infoValue: {
    margin: 0,
    fontSize: "14.5px",
    fontWeight: 700,
    color: "#0F172A",
  },
  infoDivider: {
    width: "1px",
    height: "40px",
    background: "#E2E8F0",
    flexShrink: 0,
  },
  downloadButton: {
    background: "#2563EB",
    color: "white",
    border: "none",
    padding: "15px 28px",
    borderRadius: "14px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "15px",
    fontWeight: 700,
    transition: "transform 0.2s ease",
    boxShadow: "0 10px 22px rgba(37, 99, 235, 0.3)",
  },
  tableWrap: {
    marginTop: "22px",
    overflowX: "auto",
  },
  tableHeaderRow: {
    display: "flex",
    padding: "0 14px 12px",
    borderBottom: "1px solid #EEF2F6",
    minWidth: "760px",
  },
  tableHeaderCell: {
    fontSize: "12.5px",
    fontWeight: 700,
    color: "#94A3B8",
    textTransform: "uppercase",
    letterSpacing: "0.03em",
  },
  tableRow: {
    display: "flex",
    alignItems: "center",
    padding: "16px 14px",
    borderBottom: "1px solid #F8FAFC",
    minWidth: "760px",
  },
  tableCell: {
    display: "flex",
    alignItems: "center",
    fontSize: "14px",
    color: "#334155",
  },
  rowIconBox: {
    width: "32px",
    height: "32px",
    borderRadius: "9px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  rowName: {
    fontWeight: 600,
    color: "#0F172A",
  },
  rowMuted: {
    color: "#64748B",
    fontSize: "13.5px",
  },
  typePill: {
    fontSize: "12.5px",
    fontWeight: 700,
    padding: "5px 12px",
    borderRadius: "999px",
    whiteSpace: "nowrap",
  },
  actionIconBtnBlue: {
    width: "30px",
    height: "30px",
    borderRadius: "8px",
    border: "1px solid #BFDBFE",
    background: "#EFF6FF",
    color: "#2563EB",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  actionIconBtnRed: {
    width: "30px",
    height: "30px",
    borderRadius: "8px",
    border: "1px solid #FECACA",
    background: "#FEF2F2",
    color: "#DC2626",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  emptyRowsText: {
    color: "#94A3B8",
    fontSize: "14px",
    textAlign: "center",
    padding: "24px 0",
  },
  quickGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "16px",
  },
  quickCard: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "white",
    border: "1px solid #EEF2F6",
    borderRadius: "16px",
    padding: "18px 20px",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(15, 23, 42, 0.03)",
    transition: "border-color 0.15s ease, box-shadow 0.15s ease",
    fontFamily: "inherit",
    textAlign: "left",
  },
  quickLeft: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    minWidth: 0,
  },
  quickIconBox: {
    width: "40px",
    height: "40px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  quickTextCol: {
    display: "flex",
    flexDirection: "column",
    gap: "3px",
    minWidth: 0,
  },
  quickTitle: {
    fontSize: "14px",
    fontWeight: 700,
    color: "#0F172A",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  quickSubtitle: {
    fontSize: "12.5px",
    color: "#94A3B8",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  toast: {
    position: "fixed",
    bottom: "24px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "#0F172A",
    color: "white",
    padding: "12px 20px",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: 600,
    boxShadow: "0 10px 30px rgba(15, 23, 42, 0.25)",
    zIndex: 1000,
  },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(15, 23, 42, 0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
    padding: "20px",
  },
  modalCard: {
    background: "white",
    borderRadius: "18px",
    padding: "28px",
    width: "100%",
    maxWidth: "420px",
    boxShadow: "0 25px 60px rgba(15, 23, 42, 0.25)",
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  modalTitle: {
    margin: 0,
    fontSize: "18px",
    fontWeight: 700,
    color: "#0F172A",
  },
  modalSubtitle: {
    margin: "6px 0 20px",
    fontSize: "13.5px",
    color: "#64748B",
  },
  modalField: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    marginBottom: "16px",
  },
  modalLabel: {
    fontSize: "12.5px",
    fontWeight: 600,
    color: "#334155",
  },
  modalInput: {
    padding: "10px 12px",
    borderRadius: "10px",
    border: "1px solid #E2E8F0",
    fontSize: "14px",
    fontFamily: "inherit",
    color: "#0F172A",
    outline: "none",
  },
  modalCheckboxRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    color: "#334155",
    marginBottom: "18px",
    cursor: "pointer",
  },
  modalNote: {
    fontSize: "12.5px",
    color: "#94A3B8",
    lineHeight: 1.5,
    margin: "4px 0 20px",
  },
  modalActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
  },
  modalCancelBtn: {
    padding: "10px 18px",
    borderRadius: "10px",
    border: "1px solid #E2E8F0",
    background: "white",
    color: "#334155",
    fontWeight: 600,
    fontSize: "14px",
    cursor: "pointer",
  },
  modalSaveBtn: {
    padding: "10px 18px",
    borderRadius: "10px",
    border: "none",
    background: "#2563EB",
    color: "white",
    fontWeight: 600,
    fontSize: "14px",
    cursor: "pointer",
  },
};

export default Reports;