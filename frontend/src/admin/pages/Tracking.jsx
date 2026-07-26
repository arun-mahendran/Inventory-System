import { useState } from "react";
import api from "../../api/axios";
import MainLayout from "../components/MainLayout";

import {
  FiClock,
  FiCheck,
  FiFileText,
  FiPackage,
  FiSearch,
  FiX,
} from "react-icons/fi";

const STATUS_BADGE = {
  Delivered: { bg: "#DCFCE7", fg: "#15803D" },
  FailedDelivery: { bg: "#FEE2E2", fg: "#B91C1C" },
  OutForDelivery: { bg: "#EDE9FE", fg: "#6D28D9" },
  Assigned: { bg: "#FEF3C7", fg: "#B45309" },
  Received: { bg: "#FEF3C7", fg: "#B45309" },
};

const STATUS_LABEL = {
  OutForDelivery: "Out For Delivery",
  FailedDelivery: "Failed Delivery",
};

function getStatusBadge(status) {
  return STATUS_BADGE[status] || STATUS_BADGE.Received;
}

// Skeleton shimmer block (same pattern used across other pages)
const Shimmer = ({ width = "100%", height = "16px", radius = "8px", style = {} }) => (
  <div
    className="skeleton-shimmer"
    style={{
      width,
      height,
      borderRadius: radius,
      background: "#e5e7eb",
      position: "relative",
      overflow: "hidden",
      ...style,
    }}
  />
);

function Tracking() {
  const [trackingNumber, setTrackingNumber] = useState("");

  const [parcel, setParcel] = useState(null);

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const searchParcel = async () => {
    setLoading(true);
    setError("");
    setParcel(null);

    try {
      const response = await api.get(`/parcels/tracking/${trackingNumber}`);

      setParcel(response.data);

      setError("");
    } catch (error) {
      console.error("Tracking Error:", error);

      setParcel(null);

      setError("Parcel not found");
    } finally {
      setLoading(false);
    }
  };

  const badge = parcel ? getStatusBadge(parcel.status) : null;

  const progressWidth = parcel
    ? parcel.status === "Delivered"
      ? "100%"
      : parcel.status === "FailedDelivery"
        ? parcel.out_for_delivery_at
          ? "75%"
          : "50%"
        : parcel.status === "OutForDelivery"
          ? "75%"
          : parcel.status === "Assigned"
            ? "50%"
            : "25%"
    : "0%";

  return (
    <>
      <MainLayout>
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

        <div style={styles.page}>
          {/* Header */}
          <div style={styles.headerRow}>
            <div style={styles.headerIconBox}>
              <FiPackage size={22} color="#2563EB" />
            </div>
            <h1 style={styles.title}>Parcel Tracking</h1>
          </div>

          {/* Search card */}
          <div style={styles.searchCard}>
            <div style={styles.searchRow}>
              <div style={styles.searchInputWrap}>
                <FiSearch size={18} color="#94A3B8" style={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Enter Tracking Number"
                  value={trackingNumber}
                  onChange={(e) => {
                    const value = e.target.value;
                    setTrackingNumber(value);
                    setError("");
                    setParcel(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      searchParcel();
                    }
                  }}
                  style={styles.searchInput}
                />
              </div>

              <button
                onClick={searchParcel}
                disabled={loading}
                style={{
                  ...styles.searchButton,
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? "not-allowed" : "pointer",
                }}
                onMouseEnter={(e) =>
                  !loading && (e.currentTarget.style.background = "#1D4ED8")
                }
                onMouseLeave={(e) =>
                  !loading && (e.currentTarget.style.background = "#2563EB")
                }
              >
                <FiSearch size={17} />
                {loading ? "Searching..." : "Search"}
              </button>
            </div>
          </div>

          {/* Loading skeleton */}
          {loading && (
            <div style={styles.resultsGrid}>
              {/* TRACKING RESULT SKELETON */}
              <div style={styles.card}>
                <div style={styles.cardHeaderRow}>
                  <div style={styles.cardIconBox}>
                    <FiPackage size={24} color="#2563EB" />
                  </div>
                  <h2 style={styles.cardTitle}>Tracking Result</h2>
                </div>

                <div style={styles.infoGrid}>
                  <span style={styles.infoLabel}>Tracking Number</span>
                  <Shimmer width="160px" height="16px" />

                  <span style={styles.infoLabel}>Status</span>
                  <Shimmer width="110px" height="24px" radius="999px" />

                  <span style={styles.infoLabel}>Customer ID</span>
                  <Shimmer width="120px" height="16px" />

                  <span style={styles.infoLabel}>Assigned Agent ID</span>
                  <Shimmer width="90px" height="16px" />

                  <span style={styles.infoLabel}>Created At</span>
                  <Shimmer width="180px" height="16px" />
                </div>
              </div>

              {/* DELIVERY PROGRESS SKELETON */}
              <div style={styles.card}>
                <div style={styles.progressHeaderRow}>
                  <div style={styles.progressHeaderLeft}>
                    <div style={styles.progressIconBox}>
                      <FiClock size={22} color="#B45309" />
                    </div>
                    <h2 style={styles.cardTitle}>Delivery Progress</h2>
                  </div>

                  <Shimmer width="120px" height="30px" radius="999px" />
                </div>

                <div style={{ marginBottom: "26px" }}>
                  <Shimmer width="260px" height="20px" />
                </div>

                <div style={styles.stepperWrap}>
                  <div style={styles.stepperTrack} />

                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} style={styles.stepItem}>
                      <Shimmer
                        width="48px"
                        height="48px"
                        radius="50%"
                        style={{ margin: "0 auto 14px" }}
                      />
                      <div style={{ display: "flex", justifyContent: "center", marginBottom: "6px" }}>
                        <Shimmer width="70px" height="14px" />
                      </div>
                      <div style={{ display: "flex", justifyContent: "center" }}>
                        <Shimmer width="90px" height="12px" />
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ ...styles.notesCard, borderColor: "#E2E8F0" }}>
                  <div style={styles.notesHeader}>
                    <Shimmer width="20px" height="20px" radius="6px" />
                    <Shimmer width="120px" height="16px" />
                  </div>
                  <Shimmer width="90%" height="14px" />
                </div>
              </div>
            </div>
          )}

          {/* Not found */}
          {!loading && error && (
            <div style={styles.notFoundCard}>
              <div style={styles.notFoundIconBox}>
                <FiX size={32} color="#EF4444" />
              </div>

              <h2 style={styles.notFoundTitle}>Parcel Not Found</h2>

              <p style={styles.notFoundText}>
                No parcel found with tracking number
              </p>

              <p style={styles.notFoundTracking}>{trackingNumber}</p>
            </div>
          )}

          {/* Empty state before any search */}
          {!loading && !parcel && !error && (
            <div style={styles.emptyCard}>
              <div style={styles.emptyIconBox}>
                <FiPackage size={40} color="#93C5FD" />
              </div>

              <h2 style={styles.emptyTitle}>Track a Parcel</h2>

              <p style={styles.emptyText}>
                Enter a tracking number above to view its live delivery
                status, timeline, and agent details.
              </p>

              <div style={styles.emptyChipsRow}>
                <span style={styles.emptyChip}>
                  <FiSearch size={13} /> Search by tracking number
                </span>
                <span style={styles.emptyChip}>
                  <FiClock size={13} /> View delivery timeline
                </span>
                <span style={styles.emptyChip}>
                  <FiFileText size={13} /> See delivery notes
                </span>
              </div>
            </div>
          )}

          {!loading && parcel && (
            <div style={styles.resultsGrid}>
              {/* TRACKING RESULT CARD */}
              <div style={styles.card}>
                <div style={styles.cardHeaderRow}>
                  <div style={styles.cardIconBox}>
                    <FiPackage size={24} color="#2563EB" />
                  </div>
                  <h2 style={styles.cardTitle}>Tracking Result</h2>
                </div>

                <div style={styles.infoGrid}>
                  <span style={styles.infoLabel}>Tracking Number</span>
                  <span style={styles.trackingValue}>
                    {parcel.tracking_number}
                  </span>

                  <span style={styles.infoLabel}>Status</span>
                  <span
                    style={{
                      ...styles.statusPill,
                      background: badge.bg,
                      color: badge.fg,
                    }}
                  >
                    {STATUS_LABEL[parcel.status] || parcel.status}
                  </span>

                  <span style={styles.infoLabel}>Customer ID</span>
                  <span style={styles.infoValue}>{parcel.customer_id}</span>

                  <span style={styles.infoLabel}>Assigned Agent ID</span>
                  <span style={styles.infoValue}>
                    {parcel.assigned_agent_id || "-"}
                  </span>

                  {parcel.status === "FailedDelivery" &&
                    parcel.failure_reason && (
                      <>
                        <span style={styles.infoLabel}>Failure Reason</span>
                        <span style={styles.failureValue}>
                          {parcel.failure_reason}
                        </span>
                      </>
                    )}

                  <span style={styles.infoLabel}>Created At</span>
                  <span style={styles.infoValue}>
                    {new Date(parcel.created_at).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* DELIVERY PROGRESS CARD */}
              <div style={styles.card}>
                <div style={styles.progressHeaderRow}>
                  <div style={styles.progressHeaderLeft}>
                    <div style={styles.progressIconBox}>
                      <FiClock size={22} color="#B45309" />
                    </div>
                    <h2 style={styles.cardTitle}>Delivery Progress</h2>
                  </div>

                  <span
                    style={{
                      ...styles.statusPillLg,
                      background: badge.bg,
                      color: badge.fg,
                    }}
                  >
                    {STATUS_LABEL[parcel.status] || parcel.status}
                  </span>
                </div>

                <h3
                  style={{
                    ...styles.progressHeadline,
                    color:
                      parcel.status === "Delivered"
                        ? "#16A34A"
                        : parcel.status === "FailedDelivery"
                          ? "#DC2626"
                          : "#2563EB",
                  }}
                >
                  {parcel.status === "Delivered"
                    ? "Parcel Delivered Successfully"
                    : parcel.status === "FailedDelivery"
                      ? "Delivery Attempt Failed"
                      : parcel.status === "OutForDelivery"
                        ? "Parcel is out for delivery"
                        : parcel.status === "Assigned"
                          ? "Parcel assigned to delivery agent"
                          : "Parcel order has been created"}
                </h3>

                <div style={styles.stepperWrap}>
                  <div style={styles.stepperTrack} />

                  <div
                    style={{
                      ...styles.stepperFill,
                      width: progressWidth,
                    }}
                  />

                  {parcel.status === "FailedDelivery" &&
                    parcel.out_for_delivery_at && (
                      <div style={styles.stepperFailedSegment} />
                    )}

                  {[
                    { title: "Ordered", date: parcel.created_at },
                    { title: "Assigned", date: parcel.created_at },
                    {
                      title: "Out For Delivery",
                      date: parcel.out_for_delivery_at,
                    },
                    { title: "Delivered", date: parcel.delivered_at },
                  ].map((step, index) => {
                    const isFailedNode =
                      parcel.status === "FailedDelivery" && index === 3;
                    const isLastGoodNode =
                      parcel.status === "FailedDelivery" &&
                      index === (parcel.out_for_delivery_at ? 2 : 1);
                    const isDone = isLastGoodNode || Boolean(step.date);

                    return (
                      <div key={index} style={styles.stepItem}>
                        <div
                          style={{
                            ...styles.stepCircle,
                            background: isFailedNode
                              ? "#EF4444"
                              : isDone
                                ? "#22C55E"
                                : "#E2E8F0",
                            color: isDone || isFailedNode ? "white" : "#94A3B8",
                          }}
                        >
                          {isFailedNode ? (
                            <FiX size={20} />
                          ) : isDone ? (
                            <FiCheck size={20} />
                          ) : (
                            index + 1
                          )}
                        </div>

                        <h3 style={styles.stepTitle}>{step.title}</h3>

                        <p style={styles.stepDate}>
                          {step.date
                            ? new Date(step.date).toLocaleString()
                            : "-"}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div
                  style={{
                    ...styles.notesCard,
                    background: parcel.failure_reason ? "#FEF2F2" : "#F0FDF4",
                    borderColor: parcel.failure_reason
                      ? "#FECACA"
                      : "#BBF7D0",
                  }}
                >
                  <div style={styles.notesHeader}>
                    <FiFileText
                      size={20}
                      color={parcel.failure_reason ? "#DC2626" : "#16A34A"}
                    />
                    <h3 style={styles.notesTitle}>Delivery Notes</h3>
                  </div>

                  <p
                    style={{
                      ...styles.notesText,
                      color: parcel.failure_reason ? "#991B1B" : "#166534",
                    }}
                  >
                    {parcel.failure_reason
                      ? `Delivery Failed: ${parcel.failure_reason}`
                      : "No delivery issues reported."}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
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
    alignItems: "center",
    gap: "14px",
    marginBottom: "22px",
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
  searchCard: {
    background: "white",
    padding: "20px",
    borderRadius: "18px",
    border: "1px solid #EEF2F6",
    boxShadow: "0 10px 25px rgba(15, 23, 42, 0.04)",
  },
  searchRow: {
    display: "flex",
    gap: "14px",
    alignItems: "center",
    flexWrap: "wrap",
  },
  searchInputWrap: {
    position: "relative",
    flex: "1 1 320px",
    minWidth: "240px",
  },
  searchIcon: {
    position: "absolute",
    left: "16px",
    top: "50%",
    transform: "translateY(-50%)",
  },
  searchInput: {
    width: "100%",
    padding: "13px 16px 13px 45px",
    borderRadius: "12px",
    border: "1px solid #E2E8F0",
    fontSize: "15px",
    outline: "none",
    boxSizing: "border-box",
    background: "#F8FAFC",
  },
  searchButton: {
    display: "flex",
    alignItems: "center",
    gap: "9px",
    background: "#2563EB",
    color: "white",
    border: "none",
    padding: "13px 24px",
    borderRadius: "12px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: 600,
    boxShadow: "0 8px 20px rgba(37, 99, 235, 0.25)",
    transition: "background 0.2s ease",
  },
  notFoundCard: {
    marginTop: "20px",
    background: "white",
    borderRadius: "18px",
    padding: "48px 30px",
    textAlign: "center",
    border: "1px solid #EEF2F6",
    boxShadow: "0 10px 25px rgba(15, 23, 42, 0.04)",
  },
  notFoundIconBox: {
    width: "64px",
    height: "64px",
    borderRadius: "50%",
    background: "#FEE2E2",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 20px",
  },
  notFoundTitle: {
    color: "#DC2626",
    marginBottom: "8px",
    fontSize: "20px",
  },
  notFoundText: {
    color: "#64748B",
    fontSize: "15px",
    margin: 0,
  },
  notFoundTracking: {
    color: "#2563EB",
    fontWeight: 700,
    fontSize: "17px",
    marginTop: "8px",
  },
  emptyCard: {
    marginTop: "20px",
    background: "white",
    borderRadius: "18px",
    padding: "64px 30px",
    textAlign: "center",
    border: "1px solid #EEF2F6",
    boxShadow: "0 10px 25px rgba(15, 23, 42, 0.04)",
  },
  emptyIconBox: {
    width: "84px",
    height: "84px",
    borderRadius: "22px",
    background: "#EFF6FF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 22px",
  },
  emptyTitle: {
    margin: "0 0 10px",
    fontSize: "20px",
    fontWeight: 700,
    color: "#0F172A",
  },
  emptyText: {
    margin: "0 auto",
    maxWidth: "440px",
    color: "#64748B",
    fontSize: "14.5px",
    lineHeight: "1.6",
  },
  emptyChipsRow: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: "10px",
    marginTop: "26px",
  },
  emptyChip: {
    display: "inline-flex",
    alignItems: "center",
    gap: "7px",
    padding: "9px 16px",
    borderRadius: "999px",
    background: "#F8FAFC",
    border: "1px solid #E2E8F0",
    color: "#475569",
    fontSize: "13px",
    fontWeight: 600,
  },
  resultsGrid: {
    display: "grid",
    gap: "20px",
    marginTop: "20px",
  },
  card: {
    background: "white",
    padding: "28px",
    borderRadius: "18px",
    border: "1px solid #EEF2F6",
    boxShadow: "0 10px 25px rgba(15, 23, 42, 0.04)",
  },
  cardHeaderRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "22px",
  },
  cardIconBox: {
    width: "48px",
    height: "48px",
    borderRadius: "14px",
    background: "#EFF6FF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  cardTitle: {
    margin: 0,
    fontSize: "18.5px",
    fontWeight: 700,
    color: "#0F172A",
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "200px 1fr",
    rowGap: "16px",
    fontSize: "14.5px",
    alignItems: "center",
  },
  infoLabel: {
    fontWeight: 600,
    color: "#64748B",
    fontSize: "13.5px",
    textTransform: "uppercase",
    letterSpacing: "0.03em",
  },
  infoValue: {
    color: "#0F172A",
    fontWeight: 500,
  },
  trackingValue: {
    fontWeight: 700,
    color: "#2563EB",
    fontSize: "15.5px",
  },
  failureValue: {
    color: "#DC2626",
    fontWeight: 600,
  },
  statusPill: {
    display: "inline-flex",
    width: "fit-content",
    padding: "6px 14px",
    borderRadius: "999px",
    fontWeight: 700,
    fontSize: "13px",
  },
  statusPillLg: {
    padding: "10px 20px",
    borderRadius: "999px",
    fontWeight: 700,
    fontSize: "14px",
  },
  progressHeaderRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "26px",
    flexWrap: "wrap",
    gap: "12px",
  },
  progressHeaderLeft: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  progressIconBox: {
    width: "48px",
    height: "48px",
    borderRadius: "14px",
    background: "#FEF3C7",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  progressHeadline: {
    marginBottom: "26px",
    fontSize: "18px",
    fontWeight: 700,
  },
  stepperWrap: {
    position: "relative",
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "32px",
  },
  stepperTrack: {
    position: "absolute",
    top: "24px",
    left: 0,
    right: 0,
    height: "5px",
    background: "#E2E8F0",
    borderRadius: "3px",
    zIndex: 1,
  },
  stepperFill: {
    position: "absolute",
    top: "24px",
    left: 0,
    height: "5px",
    borderRadius: "3px",
    background: "#22C55E",
    zIndex: 2,
    transition: "width 0.4s ease",
  },
  stepperFailedSegment: {
    position: "absolute",
    top: "24px",
    left: "75%",
    width: "25%",
    height: "5px",
    borderRadius: "3px",
    background: "#EF4444",
    zIndex: 3,
  },
  stepItem: {
    position: "relative",
    zIndex: 2,
    textAlign: "center",
    flex: 1,
    padding: "0 6px",
  },
  stepCircle: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 14px",
    fontSize: "16px",
    fontWeight: 700,
  },
  stepTitle: {
    margin: "0 0 4px",
    fontSize: "14.5px",
    fontWeight: 700,
    color: "#0F172A",
  },
  stepDate: {
    margin: 0,
    color: "#94A3B8",
    fontSize: "12.5px",
  },
  notesCard: {
    padding: "18px 20px",
    borderRadius: "14px",
    border: "1px solid",
  },
  notesHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "8px",
  },
  notesTitle: {
    margin: 0,
    fontSize: "15px",
    fontWeight: 700,
    color: "#0F172A",
  },
  notesText: {
    margin: 0,
    fontSize: "14px",
    lineHeight: "1.6",
  },
};

export default Tracking;