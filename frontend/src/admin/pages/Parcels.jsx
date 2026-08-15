import { useEffect, useState, useMemo } from "react";

import { Link, useNavigate } from "react-router-dom";

import api from "../../api/axios";
import MainLayout from "../components/MainLayout";

import {
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiXCircle,
  FiUploadCloud,
  FiSearch,
  FiFilter,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiPlus,
  FiMapPin,
} from "react-icons/fi";

import { FaBoxesStacked } from "react-icons/fa6";

const STATUS_STYLES = {
  Received: { bg: "#FEE2E2", fg: "#DC2626", dot: "#EF4444" },
  Assigned: { bg: "#FEF3C7", fg: "#B45309", dot: "#F59E0B" },
  OutForDelivery: { bg: "#DBEAFE", fg: "#1D4ED8", dot: "#3B82F6" },
  Delivered: { bg: "#DCFCE7", fg: "#15803D", dot: "#22C55E" },
  FailedDelivery: { bg: "#FEE2E2", fg: "#B91C1C", dot: "#EF4444" },
};

function getStatusStyle(status) {
  return STATUS_STYLES[status] || STATUS_STYLES.Received;
}

const PAGE_SIZE_OPTIONS = [10, 20, 50];

function Parcels() {
  const navigate = useNavigate();

  const [parcels, setParcels] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedFilter, setSelectedFilter] = useState("All");

  const [showFailedModal, setShowFailedModal] = useState(false);

  const [selectedParcelId, setSelectedParcelId] = useState(null);

  const [failureReason, setFailureReason] = useState("");

  const [selectedParcel, setSelectedParcel] = useState(null);

  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const [showModal, setShowModal] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showPageSizeDropdown, setShowPageSizeDropdown] = useState(false);

  const fetchParcels = async () => {
    try {
      const response = await api.get("/parcels/");

      const statusOrder = {
        Received: 1,
        Assigned: 2,
        OutForDelivery: 3,
        FailedDelivery: 4,
        Delivered: 5,
      };

      const sortedParcels = response.data.sort(
        (a, b) => statusOrder[a.status] - statusOrder[b.status],
      );

      setParcels(sortedParcels);
    } catch (error) {
      console.error("Parcel Error:", error);
    }
  };

  const outForDelivery = async (parcelId) => {
    try {
      await api.patch(`/parcels/${parcelId}/out-for-delivery`);

      fetchParcels();
    } catch (error) {
      console.error(error);
    }
  };

  const markDelivered = async (parcelId) => {
    try {
      await api.patch(`/parcels/${parcelId}/delivered`);

      fetchParcels();
    } catch (error) {
      console.error(error);
    }
  };

  const reassignParcel = async (parcelId) => {
    try {
      await api.post(`/parcels/${parcelId}/reassign`);

      fetchParcels();
    } catch (error) {
      setErrorMessage(
        error.response?.data?.detail || "Failed to reassign parcel",
      );
    }
  };

  const openFailedModal = (parcelId) => {
    setSelectedParcelId(parcelId);

    setShowFailedModal(true);
  };

  const submitFailedDelivery = async () => {
    try {
      await api.patch(`/parcels/${selectedParcelId}/failed`, {
        reason: failureReason,
      });

      setShowFailedModal(false);

      fetchParcels();
    } catch (error) {
      console.error("Failed Delivery Error:", error);
    }
  };

  const viewParcelDetails = async (parcelId) => {
    try {
      const response = await api.get(`/parcels/${parcelId}`);

      setSelectedParcel(response.data);

      setShowModal(true);
    } catch (error) {
      console.error(error);
    }
  };

  const filters = [
    {
      label: (
        <>
          <FaBoxesStacked /> All Parcels
        </>
      ),
      value: "All",
    },
    {
      label: (
        <>
          <FiPackage /> Assigned
        </>
      ),
      value: "Assigned",
    },
    {
      label: (
        <>
          <FiTruck /> Out For Delivery
        </>
      ),
      value: "OutForDelivery",
    },
    {
      label: (
        <>
          <FiCheckCircle /> Delivered
        </>
      ),
      value: "Delivered",
    },
    {
      label: (
        <>
          <FiXCircle /> Failed Delivery
        </>
      ),
      value: "FailedDelivery",
    },
  ];

  useEffect(() => {
    fetchParcels();
  }, []);

  const filteredParcels = useMemo(() => {
    return parcels.filter((parcel) => {
      const matchesFilter =
        selectedFilter === "All"
          ? true
          : selectedFilter === "Reassigned"
            ? parcel.history_count > 1
            : parcel.status === selectedFilter;

      if (!matchesFilter) return false;

      if (!searchTerm.trim()) return true;

      const term = searchTerm.trim().toLowerCase();
      const tracking = String(parcel.tracking_number || "").toLowerCase();
      const customerId = String(parcel.customer_id || "").toLowerCase();

      return tracking.includes(term) || customerId.includes(term);
    });
  }, [parcels, selectedFilter, searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedFilter, searchTerm]);

  const totalParcels = filteredParcels.length;
  const totalPages = Math.max(1, Math.ceil(totalParcels / pageSize));

  const paginatedParcels = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredParcels.slice(start, start + pageSize);
  }, [filteredParcels, currentPage, pageSize]);

  const rangeStart = totalParcels === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const rangeEnd = Math.min(currentPage * pageSize, totalParcels);

  const pageNumbers = useMemo(() => {
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

  return (
    <>
      <MainLayout>
        <div style={styles.page}>
          {/* Header */}
          <div style={styles.headerRow}>
            <div style={styles.headerLeft}>
              <div style={styles.headerIconBox}>
                <FiPackage size={22} color="#2563EB" />
              </div>
              <h1 style={styles.title}>Parcels</h1>
            </div>

            <div style={styles.headerActions}>
              <button
                onClick={() => navigate("/create-parcel")}
                style={styles.createButton}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#1D4ED8")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#2563EB")}
              >
                <FiPlus size={18} />
                Create Parcel
              </button>

              <button
                onClick={() => navigate("/bulk-import")}
                style={styles.bulkButton}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#047857")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#059669")}
              >
                <FiUploadCloud size={18} />
                Bulk Import
              </button>
            </div>
          </div>

          {errorMessage && (
            <div style={styles.errorBanner}>⚠ {errorMessage}</div>
          )}

          {/* Search + Filter card */}
          <div style={styles.filterCard}>
            <div style={styles.searchWrap}>
              <FiSearch size={18} color="#94A3B8" style={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search by tracking no, customer ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.searchInput}
              />
            </div>

            <div style={styles.filterLabel}>
              <FiFilter size={16} color="#64748B" />
              <span>Filter Parcels</span>
            </div>

            <div style={styles.filterDropdownWrap}>
              <div
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                style={styles.filterDropdownButton}
              >
                <span style={styles.filterDropdownLabel}>
                  {filters.find((f) => f.value === selectedFilter)?.label}
                </span>
                <FiChevronDown
                  size={16}
                  color="#64748B"
                  style={{
                    transition: "transform 0.2s ease",
                    transform: showFilterDropdown
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                  }}
                />
              </div>

              {showFilterDropdown && (
                <div style={styles.dropdownPanel}>
                  {filters.map((filter, idx) => (
                    <div
                      key={filter.value}
                      onClick={() => {
                        setSelectedFilter(filter.value);
                        setShowFilterDropdown(false);
                      }}
                      onMouseEnter={(e) => {
                        if (selectedFilter !== filter.value)
                          e.currentTarget.style.background = "#F8FAFC";
                      }}
                      onMouseLeave={(e) => {
                        if (selectedFilter !== filter.value)
                          e.currentTarget.style.background = "white";
                      }}
                      style={{
                        ...styles.dropdownItem,
                        borderTop: idx === 0 ? "none" : "1px solid #F1F5F9",
                        background:
                          selectedFilter === filter.value
                            ? "#EFF6FF"
                            : "white",
                        color:
                          selectedFilter === filter.value
                            ? "#1D4ED8"
                            : "#0F172A",
                      }}
                    >
                      {filter.label}
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
                  <th style={styles.th}>Tracking No</th>
                  <th style={styles.th}>Customer ID</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Agent</th>
                  <th style={{ ...styles.th, whiteSpace: "nowrap" }}>
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {paginatedParcels.map((parcel) => {
                  const status = getStatusStyle(parcel.status);
                  const isAssigned = parcel.status === "Assigned";
                  const isOutForDelivery = parcel.status === "OutForDelivery";
                  const isFailed = parcel.status === "FailedDelivery";
                  const hasHistory = parcel.history_count > 1;

                  return (
                    <tr
                      key={parcel.id}
                      style={styles.tr}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "#F8FAFC")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      <td style={styles.td}>
                        <span
                          style={styles.trackingLink}
                          onClick={() => viewParcelDetails(parcel.id)}
                        >
                          {parcel.tracking_number}
                        </span>
                      </td>

                      <td style={styles.td}>{parcel.customer_id}</td>

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
                          {parcel.status}
                        </span>
                      </td>

                      <td style={styles.td}>
                        {parcel.assigned_agent_id
                          ? `Agent ${parcel.assigned_agent_id}`
                          : "-"}
                      </td>

                      <td style={styles.td}>
                        <div style={styles.actionsCell}>
                          <button
                            disabled={!isAssigned}
                            onClick={() => outForDelivery(parcel.id)}
                            style={
                              isAssigned
                                ? styles.actionSolid("#F97316")
                                : styles.actionMuted
                            }
                          >
                            Out
                          </button>

                          <button
                            disabled={!isOutForDelivery}
                            onClick={() => openFailedModal(parcel.id)}
                            style={
                              isOutForDelivery
                                ? styles.actionSolid("#EF4444", "#EF4444")
                                : styles.actionMuted
                            }
                          >
                            Failed
                          </button>

                          <button
                            disabled={!isOutForDelivery}
                            onClick={() => markDelivered(parcel.id)}
                            style={
                              isOutForDelivery
                                ? styles.actionSolid("#22C55E", "#22C55E")
                                : styles.actionMuted
                            }
                          >
                            Delivered
                          </button>

                          <button
                            disabled={!isFailed}
                            onClick={() => reassignParcel(parcel.id)}
                            style={
                              isFailed
                                ? styles.actionSolid("#2563EB", "#2563EB")
                                : styles.actionMuted
                            }
                          >
                            Reassign
                          </button>

                          {hasHistory ? (
                            <Link
                              to={`/parcel-history/${parcel.id}`}
                              style={styles.historyActive}
                            >
                              <FiClock size={13} />
                              History
                            </Link>
                          ) : (
                            <span style={styles.historyMuted}>
                              <FiClock size={13} />
                              History
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {paginatedParcels.length === 0 && (
                  <tr>
                    <td colSpan={5} style={styles.emptyState}>
                      No parcels found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Footer / pagination */}
            <div style={styles.footerRow}>
              <span style={styles.footerText}>
                {totalParcels === 0
                  ? "No parcels"
                  : `Showing ${rangeStart} to ${rangeEnd} of ${totalParcels} parcels`}
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

        {showModal && selectedParcel && (
          <div style={styles.modalOverlay}>
            <div style={styles.modalCard}>
              <div style={styles.modalHeader}>
                <h2 style={styles.modalTitle}>📦 Parcel Details</h2>
                <button
                  onClick={() => setShowModal(false)}
                  style={styles.modalCloseBtn}
                >
                  ✕
                </button>
              </div>

              <div style={styles.modalGrid}>
                <b>Tracking Number :</b>
                <span>{selectedParcel.tracking_number}</span>

                <b>Customer Name :</b>
                <span>{selectedParcel.customer_name || "-"}</span>

                <b>Customer ID :</b>
                <span>{selectedParcel.customer_id}</span>

                <b>Phone Number :</b>
                <span>{selectedParcel.phone || "-"}</span>

                <b>Delivery Address :</b>

                <div>
                  <p style={styles.addressText}>
                    {selectedParcel.address || "-"}
                  </p>

                  {selectedParcel.address && (
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        selectedParcel.address,
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={styles.mapsLink}
                    >
                      <FiMapPin size={16} />
                      Open in Google Maps
                    </a>
                  )}
                </div>

                <b>Amount :</b>
                <span>₹ {selectedParcel.amount}</span>

                <b>Payment Method :</b>
                <span>{selectedParcel.payment_method}</span>

                <b>Payment Status :</b>
                <span
                  style={{
                    color:
                      selectedParcel.payment_status === "Paid"
                        ? "#16a34a"
                        : "#dc2626",
                    fontWeight: "700",
                  }}
                >
                  {selectedParcel.payment_status}
                </span>

                <b>Status :</b>
                <span>
                  <span
                    style={{
                      padding: "8px 16px",
                      borderRadius: "999px",
                      background:
                        selectedParcel.status === "Delivered"
                          ? "#dcfce7"
                          : selectedParcel.status === "FailedDelivery"
                            ? "#fee2e2"
                            : "#fef3c7",
                      color:
                        selectedParcel.status === "Delivered"
                          ? "#16a34a"
                          : selectedParcel.status === "FailedDelivery"
                            ? "#b91c1c"
                            : "#92400e",
                      fontWeight: "700",
                    }}
                  >
                    {selectedParcel.status}
                  </span>
                </span>

                {selectedParcel.failure_reason && (
                  <>
                    <b>Failure Reason :</b>
                    <span style={{ color: "#dc2626", fontWeight: "600" }}>
                      {selectedParcel.failure_reason}
                    </span>
                  </>
                )}

                <b>Assigned Agent :</b>
                <span>
                  {selectedParcel.assigned_agent_id
                    ? `Agent ${selectedParcel.assigned_agent_id}`
                    : "-"}
                </span>

                <b>Created At :</b>
                <span>
                  {new Date(selectedParcel.created_at).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}
      </MainLayout>

      {showFailedModal && (
        <div style={styles.failedOverlay}>
          <div style={styles.failedCard}>
            <div style={styles.failedHeader}>
              <span style={{ fontSize: "28px" }}>⚠️</span>
              <div>
                <h2 style={{ margin: 0 }}>Failed Delivery</h2>
                <p style={styles.failedSubtitle}>Select a failure reason</p>
              </div>
            </div>

            <select
              value={failureReason}
              onChange={(e) => setFailureReason(e.target.value)}
              style={styles.failedSelect}
            >
              <option value="">Select Reason</option>
              <option value="Customer Not Available">
                Customer Not Available
              </option>
              <option value="Address Not Reachable">
                Address Not Reachable
              </option>
              <option value="Phone Not Reachable">Phone Not Reachable</option>
              <option value="Customer Refused Delivery">
                Customer Refused Delivery
              </option>
              <option value="Other">Other</option>
            </select>

            <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
              <button
                onClick={submitFailedDelivery}
                disabled={!failureReason}
                style={{
                  background: failureReason ? "#ef4444" : "#d1d5db",
                  color: "white",
                  border: "none",
                  padding: "10px 18px",
                  borderRadius: "10px",
                  cursor: failureReason ? "pointer" : "not-allowed",
                  fontWeight: "600",
                }}
              >
                Mark Failed
              </button>

              <button
                onClick={() => setShowFailedModal(false)}
                style={{
                  background: "#334155",
                  color: "white",
                  border: "none",
                  padding: "10px 18px",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
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
    marginBottom: "20px",
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
  headerActions: {
    display: "flex",
    gap: "12px",
  },
  createButton: {
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
  bulkButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "#059669",
    color: "white",
    border: "none",
    padding: "12px 22px",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "14.5px",
    boxShadow: "0 8px 20px rgba(5, 150, 105, 0.25)",
    transition: "background 0.2s ease",
  },
  errorBanner: {
    background: "#fee2e2",
    color: "#b91c1c",
    padding: "14px",
    borderRadius: "10px",
    marginBottom: "16px",
    fontWeight: "600",
  },
  filterCard: {
    display: "flex",
    alignItems: "center",
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
  filterLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 16px",
    borderRadius: "12px",
    border: "1px solid #E2E8F0",
    background: "#F8FAFC",
    color: "#334155",
    fontWeight: 600,
    fontSize: "14.5px",
    whiteSpace: "nowrap",
  },
  filterDropdownWrap: {
    position: "relative",
    width: "230px",
  },
  filterDropdownButton: {
    background: "white",
    padding: "12px 16px",
    borderRadius: "12px",
    border: "1px solid #E2E8F0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "14.5px",
  },
  filterDropdownLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
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
    fontWeight: 500,
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    transition: "all 0.2s ease",
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
    color: "#0F172A",
  },
  trackingLink: {
    color: "#2563EB",
    fontWeight: 700,
    cursor: "pointer",
    textDecoration: "underline",
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
    gap: "6px",
    alignItems: "center",
    flexWrap: "nowrap",
    whiteSpace: "nowrap",
  },
  actionMuted: {
    padding: "6px 10px",
    border: "1px solid #E2E8F0",
    borderRadius: "8px",
    background: "white",
    color: "#94A3B8",
    fontWeight: 600,
    fontSize: "12px",
    cursor: "not-allowed",
    whiteSpace: "nowrap",
  },
  actionSolid: (bg) => ({
    padding: "6px 10px",
    border: "none",
    borderRadius: "8px",
    background: bg,
    color: "white",
    fontWeight: 600,
    fontSize: "12px",
    cursor: "pointer",
    boxShadow: `0 4px 10px ${bg}33`,
    whiteSpace: "nowrap",
  }),
  actionOutline: (color) => ({
    padding: "6px 10px",
    border: `1.5px solid ${color}`,
    borderRadius: "8px",
    background: "white",
    color: color,
    fontWeight: 600,
    fontSize: "12px",
    cursor: "not-allowed",
    whiteSpace: "nowrap",
  }),
  historyActive: {
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
    textDecoration: "none",
    background: "#1E293B",
    color: "white",
    padding: "6px 10px",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: 600,
    whiteSpace: "nowrap",
  },
  historyMuted: {
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
    background: "white",
    border: "1px solid #E2E8F0",
    color: "#94A3B8",
    padding: "6px 10px",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: 600,
    cursor: "not-allowed",
    whiteSpace: "nowrap",
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
    background: "#2563EB",
    borderColor: "#2563EB",
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
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(15,23,42,0.45)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  modalCard: {
    background: "white",
    width: "580px",
    maxWidth: "92vw",
    maxHeight: "88vh",
    overflowY: "auto",
    padding: "30px",
    borderRadius: "20px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  modalTitle: {
    margin: 0,
    fontSize: "20px",
  },
  modalCloseBtn: {
    border: "none",
    background: "none",
    cursor: "pointer",
    fontSize: "22px",
  },
  modalGrid: {
    display: "grid",
    gridTemplateColumns: "190px 1fr",
    rowGap: "16px",
    marginTop: "25px",
  },
  addressText: {
    margin: 0,
    color: "#475569",
    lineHeight: "1.8",
  },
  mapsLink: {
    width: "fit-content",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 16px",
    background: "#eff6ff",
    color: "#2563eb",
    borderRadius: "12px",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "600",
    marginTop: "8px",
  },
  failedOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(15,23,42,0.35)",
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  failedCard: {
    background: "white",
    padding: "24px",
    borderRadius: "16px",
    width: "400px",
    maxWidth: "92vw",
  },
  failedHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "15px",
  },
  failedSubtitle: {
    margin: 0,
    color: "#6b7280",
    fontSize: "14px",
  },
  failedSelect: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    fontSize: "15px",
    marginTop: "10px",
  },
};

export default Parcels;