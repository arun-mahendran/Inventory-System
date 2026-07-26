import { useState, useEffect, useCallback, useMemo } from "react";

import api from "../../api/axios";

import MainLayout from "../components/MainLayout";
import { useNavigate } from "react-router-dom";
import {
  FiTruck,
  FiSearch,
  FiFilter,
  FiTrash2,
  FiX,
  FiAlertCircle,
  FiPackage,
  FiChevronLeft,
  FiChevronRight,
  FiChevronDown,
  FiPlus,
} from "react-icons/fi";
import { toast } from "react-toastify";

// Palette used for the round agent-initial avatars. Cycled by row index so
// neighbouring rows are visually distinct without any per-agent config.
const AVATAR_COLORS = [
  { bg: "#FFE8D9", fg: "#C2410C" },
  { bg: "#DBEAFE", fg: "#1D4ED8" },
  { bg: "#DCFCE7", fg: "#15803D" },
  { bg: "#EDE9FE", fg: "#6D28D9" },
  { bg: "#FEF3C7", fg: "#B45309" },
  { bg: "#FCE7F3", fg: "#BE185D" },
];

const STATUS_STYLES = {
  Available: { bg: "#DCFCE7", fg: "#15803D", dot: "#22C55E" },
  Busy: { bg: "#FEF3C7", fg: "#B45309", dot: "#F59E0B" },
  Offline: { bg: "#F1F5F9", fg: "#64748B", dot: "#94A3B8" },
};

function getStatusStyle(status) {
  return STATUS_STYLES[status] || STATUS_STYLES.Available;
}

const PAGE_SIZE_OPTIONS = [10, 20, 50];

function Shimmer({ width = "100%", height = "16px", radius = "8px", style = {} }) {
  return (
    <div
      className="skeleton-shimmer"
      style={{
        width,
        height,
        borderRadius: radius,
        background: "#E2E8F0",
        position: "relative",
        overflow: "hidden",
        ...style,
      }}
    />
  );
}

function DeliveryAgents() {
  const [agents, setAgents] = useState([]);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState(null);
  const [selectedAgentName, setSelectedAgentName] = useState("");
  const [showHubDropdown, setShowHubDropdown] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedHub, setSelectedHub] = useState("");
  const [hubs, setHubs] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showPageSizeDropdown, setShowPageSizeDropdown] = useState(false);

  const fetchAgents = useCallback(async () => {
    try {
      setLoading(true);

      const params = {};

      if (searchTerm.trim()) {
        params.search = searchTerm.trim();
      }

      if (selectedHub !== "") {
        params.hub_id = selectedHub;
      }

      const response = await api.get("/delivery-agents/", { params });

      setAgents(response.data);
      setCurrentPage(1);
    } catch (error) {
      console.error("Agent Error:", error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedHub]);

  const fetchHubs = useCallback(async () => {
    try {
      const response = await api.get("/hubs/");
      setHubs(response.data);
    } catch (error) {
      console.error("Hub Error:", error);
    }
  }, []);

  useEffect(() => {
    fetchHubs();
  }, [fetchHubs]);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  const totalAgents = agents.length;
  const totalPages = Math.max(1, Math.ceil(totalAgents / pageSize));

  const paginatedAgents = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return agents.slice(start, start + pageSize);
  }, [agents, currentPage, pageSize]);

  const rangeStart = totalAgents === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const rangeEnd = Math.min(currentPage * pageSize, totalAgents);

  const pageNumbers = useMemo(() => {
    // Compact pagination: first, last, current +/-1, with ellipses.
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 1 && i <= currentPage + 1)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }
    return pages;
  }, [totalPages, currentPage]);

  const handleDelete = (agentId, agentName) => {
    setSelectedAgentId(agentId);
    setSelectedAgentName(agentName);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      setDeleting(true);
      await api.delete(`/delivery-agents/${selectedAgentId}`);
      toast.success("Delivery Agent deleted successfully");
      setAgents(agents.filter((agent) => agent.id !== selectedAgentId));
      setShowDeleteModal(false);
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to delete agent");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <style>{`
        .skeleton-shimmer::after {
          content: "";
          position: absolute;
          inset: 0;
          transform: translateX(-100%);
          background: linear-gradient(
            90deg,
            rgba(255,255,255,0) 0%,
            rgba(255,255,255,0.6) 50%,
            rgba(255,255,255,0) 100%
          );
          animation: skeleton-shimmer 1.4s infinite;
        }
        @keyframes skeleton-shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>

      <MainLayout>
        <div style={styles.page}>
          {/* Header */}
          <div style={styles.headerRow}>
            <div style={styles.headerLeft}>
              <div style={styles.headerIconBox}>
                <FiTruck size={22} color="#2563EB" />
              </div>
              <div>
                <h1 style={styles.title}>Delivery Agents</h1>
                {/* <div style={styles.breadcrumb}>
                  <span style={styles.breadcrumbMuted}>Dashboard</span>
                  <span style={styles.breadcrumbMuted}> &gt; </span>
                  <span style={styles.breadcrumbActive}>Delivery Agents</span>
                </div> */}
              </div>
            </div>

            <button
              onClick={() => navigate("/create-agent")}
              style={styles.addButton}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#1D4ED8")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#2563EB")}
            >
              <FiPlus size={18} />
              Add Agent
            </button>
          </div>

          {/* Search + Filter card */}
          <div style={styles.filterCard}>
            <div style={styles.searchWrap}>
              <FiSearch size={18} color="#94A3B8" style={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search by Agent Name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.searchInput}
              />
            </div>

            <div style={styles.hubFilterWrap}>
              <div
                onClick={() => setShowHubDropdown(!showHubDropdown)}
                style={styles.hubFilterButton}
              >
                <div style={styles.hubFilterLabel}>
                  <FiFilter size={16} color="#2563EB" />
                  <span>
                    {selectedHub === ""
                      ? "All Hubs"
                      : hubs.find((hub) => hub.id === Number(selectedHub))
                          ?.hub_name}
                  </span>
                </div>
                <FiChevronDown
                  size={16}
                  color="#64748B"
                  style={{
                    transition: "transform 0.2s ease",
                    transform: showHubDropdown
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                  }}
                />
              </div>

              {showHubDropdown && (
                <div style={styles.dropdownPanel}>
                  <div
                    onClick={() => {
                      setSelectedHub("");
                      setShowHubDropdown(false);
                    }}
                    onMouseEnter={(e) => {
                      if (selectedHub !== "")
                        e.currentTarget.style.background = "#F8FAFC";
                    }}
                    onMouseLeave={(e) => {
                      if (selectedHub !== "")
                        e.currentTarget.style.background = "white";
                    }}
                    style={{
                      ...styles.dropdownItem,
                      background: selectedHub === "" ? "#DBEAFE" : "white",
                      color: selectedHub === "" ? "#1D4ED8" : "#0F172A",
                    }}
                  >
                    All Hubs
                  </div>

                  {hubs.map((hub) => (
                    <div
                      key={hub.id}
                      onClick={() => {
                        setSelectedHub(hub.id);
                        setShowHubDropdown(false);
                      }}
                      onMouseEnter={(e) => {
                        if (Number(selectedHub) !== hub.id)
                          e.currentTarget.style.background = "#F8FAFC";
                      }}
                      onMouseLeave={(e) => {
                        if (Number(selectedHub) !== hub.id)
                          e.currentTarget.style.background = "white";
                      }}
                      style={{
                        ...styles.dropdownItem,
                        borderTop: "1px solid #F1F5F9",
                        background:
                          Number(selectedHub) === hub.id ? "#DBEAFE" : "white",
                        color:
                          Number(selectedHub) === hub.id
                            ? "#1D4ED8"
                            : "#0F172A",
                      }}
                    >
                      {hub.hub_name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Table card */}
          <div style={styles.tableCard}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Agent</th>
                  <th style={styles.th}>Agent ID</th>
                  <th style={styles.th}>Hub / Pincode</th>
                  <th style={styles.th}>Parcels Assigned</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  Array.from({ length: pageSize }).map((_, i) => (
                    <tr key={`skeleton-${i}`} style={styles.tr}>
                      <td style={styles.td}>
                        <div style={styles.agentCell}>
                          <Shimmer width="42px" height="42px" radius="50%" />
                          <div style={{ flex: 1 }}>
                            <Shimmer width="110px" height="14px" style={{ marginBottom: "6px" }} />
                            <Shimmer width="80px" height="12px" />
                          </div>
                        </div>
                      </td>

                      <td style={styles.td}>
                        <Shimmer width="80px" height="14px" />
                      </td>

                      <td style={styles.td}>
                        <Shimmer width="60px" height="14px" style={{ marginBottom: "6px" }} />
                        <Shimmer width="90px" height="12px" />
                      </td>

                      <td style={styles.td}>
                        <Shimmer width="60px" height="14px" />
                      </td>

                      <td style={styles.td}>
                        <Shimmer width="90px" height="26px" radius="999px" />
                      </td>

                      <td style={styles.td}>
                        <Shimmer width="36px" height="36px" radius="10px" />
                      </td>
                    </tr>
                  ))
                ) : (
                  <>
                    {paginatedAgents.map((agent, index) => {
                      const avatar = AVATAR_COLORS[index % AVATAR_COLORS.length];
                      const status = getStatusStyle(agent.availability_status);
                      const hubName =
                        agent.hub_name ||
                        hubs.find((h) => h.id === agent.hub_id)?.hub_name ||
                        "—";

                      return (
                        <tr
                          key={agent.id}
                          style={styles.tr}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.background = "#F8FAFC")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.background = "transparent")
                          }
                        >
                          <td style={styles.td}>
                            <div style={styles.agentCell}>
                              <div
                                style={{
                                  ...styles.avatar,
                                  background: avatar.bg,
                                  color: avatar.fg,
                                }}
                              >
                                {agent.agent_name?.charAt(0)?.toUpperCase() || "A"}
                              </div>
                              <div>
                                <div style={styles.agentName}>
                                  {agent.agent_name}
                                </div>
                                <div style={styles.agentSub}>
                                  {agent.vehicle_number}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td style={styles.td}>
                            <span style={styles.agentIdText}>
                              {`AGT-${String(agent.id).padStart(4, "0")}`}
                            </span>
                          </td>

                          <td style={styles.td}>
                            <div style={styles.pincodeText}>{agent.pincode}</div>
                            <div style={styles.hubText}>{hubName}</div>
                          </td>

                          <td style={styles.td}>
                            <div style={styles.parcelsCell}>
                              <span>{agent.current_parcel_count}</span>
                              <div style={styles.parcelIconBox}>
                                <FiPackage size={14} color="#4F46E5" />
                              </div>
                            </div>
                          </td>

                          <td style={styles.td}>
                            <span
                              style={{
                                ...styles.statusBadge,
                                background: status.bg,
                                color: status.fg,
                              }}
                            >
                              <span
                                style={{
                                  ...styles.statusDot,
                                  background: status.dot,
                                }}
                              />
                              {agent.availability_status}
                            </span>
                          </td>

                          <td style={styles.td}>
                            <div style={styles.actionsCell}>
                              <button
                                onClick={() =>
                                  handleDelete(agent.id, agent.agent_name)
                                }
                                style={styles.iconButtonDanger}
                                title="Delete agent"
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.background = "#FEF2F2";
                                  e.currentTarget.style.borderColor = "#FECACA";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background = "white";
                                  e.currentTarget.style.borderColor = "#E2E8F0";
                                }}
                              >
                                <FiTrash2 size={15} color="#EF4444" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}

                    {paginatedAgents.length === 0 && (
                      <tr>
                        <td colSpan={6} style={styles.emptyState}>
                          No delivery agents found.
                        </td>
                      </tr>
                    )}
                  </>
                )}
              </tbody>
            </table>

            {/* Footer / pagination */}
            <div style={styles.footerRow}>
              <span style={styles.footerText}>
                {loading
                  ? "Loading agents..."
                  : totalAgents === 0
                  ? "No agents"
                  : `Showing ${rangeStart} to ${rangeEnd} of ${totalAgents} agents`}
              </span>

              <div style={styles.paginationControls}>
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  style={{
                    ...styles.pageArrowButton,
                    opacity: currentPage === 1 ? 0.4 : 1,
                    cursor: currentPage === 1 ? "not-allowed" : "pointer",
                  }}
                >
                  <FiChevronLeft size={16} />
                </button>

                {pageNumbers.map((p, idx) =>
                  p === "..." ? (
                    <span key={`ellipsis-${idx}`} style={styles.ellipsis}>
                      …
                    </span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setCurrentPage(p)}
                      style={{
                        ...styles.pageNumberButton,
                        ...(p === currentPage
                          ? styles.pageNumberButtonActive
                          : {}),
                      }}
                    >
                      {p}
                    </button>
                  )
                )}

                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  style={{
                    ...styles.pageArrowButton,
                    opacity: currentPage === totalPages ? 0.4 : 1,
                    cursor:
                      currentPage === totalPages ? "not-allowed" : "pointer",
                  }}
                >
                  <FiChevronRight size={16} />
                </button>

                <div style={styles.pageSizeWrap}>
                  <div
                    onClick={() => setShowPageSizeDropdown((s) => !s)}
                    style={styles.pageSizeButton}
                  >
                    <span>{pageSize} / page</span>
                    <FiChevronDown size={14} color="#64748B" />
                  </div>

                  {showPageSizeDropdown && (
                    <div style={styles.pageSizeDropdown}>
                      {PAGE_SIZE_OPTIONS.map((size) => (
                        <div
                          key={size}
                          onClick={() => {
                            setPageSize(size);
                            setCurrentPage(1);
                            setShowPageSizeDropdown(false);
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.background = "#F8FAFC")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.background = "white")
                          }
                          style={{
                            ...styles.pageSizeOption,
                            fontWeight: size === pageSize ? 700 : 500,
                            color: size === pageSize ? "#1D4ED8" : "#0F172A",
                          }}
                        >
                          {size} / page
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {showDeleteModal && (
          <div className="modal-overlay">
            <div className="delete-modal">
              <button
                className="close-btn"
                onClick={() => setShowDeleteModal(false)}
              >
                <FiX />
              </button>

              <div className="delete-icon-wrapper">
                <div className="delete-icon">
                  <FiTrash2 />
                </div>
              </div>

              <h2 className="delete-title">Delete Agent</h2>

              <p className="delete-description">
                Are you sure you want to delete
                <span
                  style={{
                    display: "block",
                    marginTop: "12px",
                    marginBottom: "12px",
                    fontWeight: "700",
                    fontSize: "18px",
                    color: "#0f172a",
                  }}
                >
                  {selectedAgentName} ?
                </span>
              </p>

              <div className="warning-box">
                <FiAlertCircle />
                <span>This action cannot be undone</span>
              </div>

              <div className="delete-actions">
                <button
                  className="cancel-btn"
                  disabled={deleting}
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>

                <button
                  className="confirm-delete-btn"
                  onClick={confirmDelete}
                  disabled={deleting}
                >
                  <FiTrash2 />
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </MainLayout>
    </>
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
  breadcrumb: {
    fontSize: "13.5px",
    marginTop: "2px",
  },
  breadcrumbMuted: {
    color: "#94A3B8",
  },
  breadcrumbActive: {
    color: "#F97316",
    fontWeight: 600,
  },
  addButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "#2563EB",
    color: "white",
    border: "none",
    padding: "12px 22px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "14.5px",
    boxShadow: "0 8px 20px rgba(37, 99, 235, 0.25)",
    transition: "background 0.2s ease",
  },
  filterCard: {
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
    marginBottom: "20px",
    flexWrap: "wrap",
    background: "white",
    padding: "18px",
    borderRadius: "16px",
    border: "1px solid #EEF2F6",
  },
  searchWrap: {
    position: "relative",
    flex: "1 1 320px",
    minWidth: "260px",
  },
  searchIcon: {
    position: "absolute",
    left: "16px",
    top: "50%",
    transform: "translateY(-50%)",
  },
  searchInput: {
    width: "100%",
    padding: "12px 16px 12px 45px",
    borderRadius: "12px",
    border: "1px solid #E2E8F0",
    fontSize: "14.5px",
    boxSizing: "border-box",
    outline: "none",
    background: "#F8FAFC",
  },
  hubFilterWrap: {
    position: "relative",
    width: "220px",
  },
  hubFilterButton: {
    background: "#F8FAFC",
    padding: "12px 16px",
    borderRadius: "12px",
    border: "1px solid #E2E8F0",
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontWeight: 500,
    fontSize: "14.5px",
    transition: "all 0.2s ease",
  },
  hubFilterLabel: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    color: "#0F172A",
  },
  dropdownPanel: {
    position: "absolute",
    top: "52px",
    width: "100%",
    background: "white",
    borderRadius: "14px",
    boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
    overflow: "hidden",
    zIndex: 1000,
    border: "1px solid #EEF2F6",
  },
  dropdownItem: {
    padding: "12px 16px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    fontWeight: 500,
    fontSize: "14px",
  },
  tableCard: {
    background: "white",
    padding: "8px 24px 20px",
    borderRadius: "18px",
    border: "1px solid #EEF2F6",
    boxShadow: "0 10px 25px rgba(15, 23, 42, 0.04)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    textAlign: "left",
    padding: "18px 12px 14px",
    fontSize: "12.5px",
    fontWeight: 700,
    color: "#94A3B8",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    borderBottom: "1px solid #F1F5F9",
  },
  tr: {
    transition: "background 0.15s ease",
  },
  td: {
    padding: "16px 12px",
    borderTop: "1px solid #F1F5F9",
    verticalAlign: "middle",
    fontSize: "14.5px",
  },
  agentCell: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  avatar: {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: "15px",
    flexShrink: 0,
  },
  agentName: {
    fontWeight: 600,
    color: "#0F172A",
  },
  agentSub: {
    fontSize: "12.5px",
    color: "#94A3B8",
    marginTop: "2px",
  },
  agentIdText: {
    color: "#475569",
    fontWeight: 500,
  },
  pincodeText: {
    fontWeight: 600,
    color: "#0F172A",
  },
  hubText: {
    fontSize: "12.5px",
    color: "#2563EB",
    marginTop: "2px",
    fontWeight: 500,
  },
  parcelsCell: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontWeight: 600,
    color: "#0F172A",
  },
  parcelIconBox: {
    width: "26px",
    height: "26px",
    borderRadius: "8px",
    background: "#EEF2FF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  statusBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "7px",
    padding: "6px 14px",
    borderRadius: "999px",
    fontWeight: 600,
    fontSize: "13px",
  },
  statusDot: {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
  },
  actionsCell: {
    display: "flex",
    gap: "8px",
  },
  iconButton: {
    width: "36px",
    height: "36px",
    borderRadius: "10px",
    border: "1px solid #E2E8F0",
    background: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.15s ease",
  },
  iconButtonDanger: {
    width: "36px",
    height: "36px",
    borderRadius: "10px",
    border: "1px solid #E2E8F0",
    background: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.15s ease",
  },
  emptyState: {
    textAlign: "center",
    padding: "48px 12px",
    color: "#94A3B8",
    fontSize: "14.5px",
  },
  footerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "12px",
    paddingTop: "18px",
    marginTop: "6px",
    borderTop: "1px solid #F1F5F9",
  },
  footerText: {
    fontSize: "13.5px",
    color: "#64748B",
  },
  paginationControls: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  pageArrowButton: {
    width: "34px",
    height: "34px",
    borderRadius: "9px",
    border: "1px solid #E2E8F0",
    background: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#475569",
  },
  pageNumberButton: {
    minWidth: "34px",
    height: "34px",
    padding: "0 10px",
    borderRadius: "9px",
    border: "1px solid #E2E8F0",
    background: "white",
    color: "#334155",
    fontWeight: 600,
    fontSize: "13.5px",
    cursor: "pointer",
  },
  pageNumberButtonActive: {
    background: "#F97316",
    borderColor: "#F97316",
    color: "white",
  },
  ellipsis: {
    color: "#94A3B8",
    padding: "0 4px",
  },
  pageSizeWrap: {
    position: "relative",
    marginLeft: "6px",
  },
  pageSizeButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    border: "1px solid #E2E8F0",
    borderRadius: "9px",
    padding: "8px 12px",
    fontSize: "13.5px",
    fontWeight: 600,
    color: "#334155",
    cursor: "pointer",
    background: "white",
  },
  pageSizeDropdown: {
    position: "absolute",
    bottom: "42px",
    right: 0,
    background: "white",
    border: "1px solid #EEF2F6",
    borderRadius: "10px",
    boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
    overflow: "hidden",
    zIndex: 1000,
    minWidth: "110px",
  },
  pageSizeOption: {
    padding: "10px 14px",
    fontSize: "13.5px",
    cursor: "pointer",
  },
};

export default DeliveryAgents;