import { useEffect, useState } from "react";

import api from "../../api/axios";

import AgentLayout from "../components/AgentLayout";

import {
  FiPackage,
  FiSearch,
  FiUser,
  FiPhone,
  FiMapPin,
  FiClock,
  FiFileText,
  FiCheckCircle,
  FiXCircle,
  FiChevronRight,
  FiShield,
  FiHeadphones,
  FiArrowLeft,
} from "react-icons/fi";

import { FaMotorcycle } from "react-icons/fa";

function AgentTracking() {
  const [trackingNumber, setTrackingNumber] = useState("");

  const [parcel, setParcel] = useState(null);

  const [error, setError] = useState("");

  const [searching, setSearching] = useState(false);

  const [recentParcels, setRecentParcels] = useState([]);

  const getRecentKey = () => {
    const agentId = localStorage.getItem("delivery_agent_id");

    return `recent_tracking_${agentId}`;
  };

  const loadRecent = () => {
    try {
      const raw = localStorage.getItem(getRecentKey());

      setRecentParcels(raw ? JSON.parse(raw) : []);
    } catch (err) {
      setRecentParcels([]);
    }
  };

  const pushToRecent = (p) => {
    try {
      const existing = recentParcels.filter(
        (item) => item.tracking_number !== p.tracking_number,
      );

      const updated = [p, ...existing].slice(0, 5);

      localStorage.setItem(getRecentKey(), JSON.stringify(updated));

      setRecentParcels(updated);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadRecent();
  }, []);

  const runSearch = async (value) => {
    const query = (value ?? trackingNumber).trim();

    if (!query) {
      setParcel(null);
      setError("");

      return;
    }

    setSearching(true);

    try {
      const agentId = localStorage.getItem("delivery_agent_id");

      const response = await api.get(`/delivery-agents/${agentId}/parcels`);

      const match = response.data.find(
        (item) =>
          item.tracking_number &&
          item.tracking_number.toLowerCase() === query.toLowerCase(),
      );

      if (match) {
        setParcel(match);

        setError("");

        pushToRecent({
          ...match,
          viewed_at: new Date().toISOString(),
        });
      } else {
        setParcel(null);

        setError("Parcel not found among your assigned parcels");
      }
    } catch (err) {
      setParcel(null);

      setError("Parcel not found among your assigned parcels");
    } finally {
      setSearching(false);
    }
  };

  const searchParcel = () => runSearch();

  const trackFromRecent = (number) => {
    setTrackingNumber(number);

    runSearch(number);
  };

  const resetView = () => {
    setTrackingNumber("");

    setParcel(null);

    setError("");
  };

  // ---- Status display helpers ----

  const statusMeta = {
    Assigned: {
      label: "Booked",
      bg: "#ede9fe",
      color: "#6d28d9",
      icon: <FiPackage size={18} />,
    },
    OutForDelivery: {
      label: "Out for Delivery",
      bg: "#ffedd5",
      color: "#c2410c",
      icon: <FaMotorcycle size={17} />,
    },
    Delivered: {
      label: "Delivered",
      bg: "#dcfce7",
      color: "#16a34a",
      icon: <FiCheckCircle size={18} />,
    },
    FailedDelivery: {
      label: "Failed",
      bg: "#fee2e2",
      color: "#dc2626",
      icon: <FiXCircle size={18} />,
    },
  };

  const getStatusMeta = (status) =>
    statusMeta[status] || {
      label: status || "Unknown",
      bg: "#f1f5f9",
      color: "#475569",
      icon: <FiPackage size={18} />,
    };

  const formatDateTime = (dateStr) =>
    new Date(dateStr).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const getSubtext = (p) => {
    if (p.status === "Delivered") {
      return null;
    }

    if (p.status === "OutForDelivery") {
      return null;
    }

    if (p.status === "FailedDelivery") {
      return p.updated_at
        ? `Delivery attempt failed on ${formatDateTime(p.updated_at)}`
        : null;
    }

    return p.created_at
      ? `Booked on ${formatDateTime(p.created_at)}`
      : null;
  };

  const getTimeLabel = (dateStr) => {
    if (!dateStr) return "-";

    const date = new Date(dateStr);

    const now = new Date();

    const isSameDay = date.toDateString() === now.toDateString();

    const yesterday = new Date(now);

    yesterday.setDate(now.getDate() - 1);

    const isYesterday = date.toDateString() === yesterday.toDateString();

    const time = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    if (isSameDay) return `Today, ${time}`;

    if (isYesterday) return "Yesterday";

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const showOverview = !parcel && !error;

  return (
    <AgentLayout>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "4px",
        }}
      >
        <FiMapPin size={30} color="#2563eb" />

        <h1 style={{ margin: 0, fontSize: "28px" }}>Track Assigned Parcel</h1>
      </div>

      <p
        style={{
          color: "#64748b",
          fontSize: "15px",
          marginTop: "4px",
          marginBottom: "24px",
        }}
      >
        Search and track real-time updates for parcels assigned to you.
      </p>

      {/* SEARCH BAR */}
      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "18px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "16px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <div style={{ position: "relative", flex: "1 1 320px" }}>
            <FiSearch
              size={18}
              color="#94a3b8"
              style={{
                position: "absolute",
                left: "18px",
                top: "50%",
                transform: "translateY(-50%)",
              }}
            />

            <input
              type="text"
              placeholder="Enter Tracking Number (e.g., AMZ10025)"
              value={trackingNumber}
              onChange={(e) => {
                const value = e.target.value;

                setTrackingNumber(value);

                setError("");

                setParcel(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") searchParcel();
              }}
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "14px 18px 14px 44px",
                borderRadius: "14px",
                border: "2px solid #e2e8f0",
                fontSize: "15px",
                outline: "none",
                transition: "0.3s ease",
              }}
            />
          </div>

          <button
            onClick={searchParcel}
            disabled={searching}
            style={{
              background: searching
                ? "#93c5fd"
                : "linear-gradient(135deg,#2563eb,#3b82f6)",
              color: "white",
              border: "none",
              padding: "14px 26px",
              borderRadius: "14px",
              cursor: searching ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              fontSize: "15px",
              fontWeight: "600",
            }}
          >
            <FiSearch size={18} />
            {searching ? "Searching..." : "Search"}
          </button>
        </div>

        <p
          style={{
            margin: "12px 2px 0",
            color: "#94a3b8",
            fontSize: "13px",
          }}
        >
          Search only covers parcels currently assigned to you.
        </p>
      </div>

      {showOverview && (
        <>
          {/* RECENT TRACKING */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "12px",
              padding: "0 2px",
            }}
          >
            <FiClock size={18} color="#334155" />

            <h3 style={{ margin: 0, fontSize: "16px", color: "#0f172a" }}>
              Recent Tracking
            </h3>
          </div>

          <div
            style={{
              background: "white",
              borderRadius: "18px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
              marginBottom: "24px",
              overflow: "hidden",
            }}
          >
            {recentParcels.length === 0 && (
              <div
                style={{ padding: "30px", textAlign: "center", color: "#94a3b8" }}
              >
                No parcels tracked yet. Search a tracking number above to get
                started.
              </div>
            )}

            {recentParcels.map((p, idx) => {
              const meta = getStatusMeta(p.status);

              return (
                <div
                  key={p.id}
                  onClick={() => trackFromRecent(p.tracking_number)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    padding: "18px 24px",
                    borderBottom:
                      idx !== recentParcels.length - 1
                        ? "1px solid #f1f5f9"
                        : "none",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      background: meta.bg,
                      color: meta.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {meta.icon}
                  </div>

                  <div style={{ minWidth: "130px" }}>
                    <div
                      style={{
                        color: "#2563eb",
                        fontWeight: "700",
                        fontSize: "14px",
                      }}
                    >
                      {p.tracking_number}
                    </div>

                    <div
                      style={{
                        color: meta.color,
                        fontWeight: "600",
                        fontSize: "13px",
                        marginTop: "2px",
                      }}
                    >
                      {meta.label === "Booked"
                        ? "Parcel Booked"
                        : meta.label === "Failed"
                          ? "Failed Delivery"
                          : meta.label}
                    </div>
                  </div>

                  <div style={{ flex: 1, minWidth: "180px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        fontWeight: "600",
                        color: "#0f172a",
                        fontSize: "14px",
                      }}
                    >
                      <FiMapPin size={13} color="#94a3b8" />
                      <span
                        style={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {p.address || "-"}
                      </span>
                    </div>

                    {getSubtext(p) && (
                      <div
                        style={{
                          color: "#94a3b8",
                          fontSize: "13px",
                          marginTop: "2px",
                        }}
                      >
                        {getSubtext(p)}
                      </div>
                    )}
                  </div>

                  <span
                    style={{
                      padding: "6px 14px",
                      borderRadius: "20px",
                      background: meta.bg,
                      color: meta.color,
                      fontWeight: "600",
                      fontSize: "13px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {meta.label}
                  </span>

                  <span
                    style={{
                      color: "#64748b",
                      fontSize: "13px",
                      minWidth: "110px",
                      textAlign: "right",
                    }}
                  >
                    {getTimeLabel(p.viewed_at || p.updated_at || p.created_at)}
                  </span>

                  <FiChevronRight size={18} color="#cbd5e1" />
                </div>
              );
            })}
          </div>

          {/* SUPPORT BANNER */}
          <div
            style={{
              background: "#eef2ff",
              border: "1px solid #e0e7ff",
              borderRadius: "16px",
              padding: "20px 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "10px",
                  background: "#dbeafe",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <FiShield size={18} color="#2563eb" />
              </div>

              <div>
                <div
                  style={{
                    color: "#1d4ed8",
                    fontWeight: "700",
                    fontSize: "15px",
                  }}
                >
                  Need help with your tracking?
                </div>

                <div
                  style={{
                    color: "#475569",
                    fontSize: "13px",
                    marginTop: "2px",
                  }}
                >
                  Contact support if your parcel is delayed or you have any
                  questions.
                </div>
              </div>
            </div>

            <a
              href="mailto:support@finalmilehub.com"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "white",
                color: "#0f172a",
                border: "1px solid #0f172a",
                padding: "10px 18px",
                borderRadius: "12px",
                fontWeight: "600",
                fontSize: "14px",
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}
            >
              <FiHeadphones size={16} />
              Contact Support
            </a>
          </div>
        </>
      )}

      {error && (
        <div
          style={{
            background: "white",
            padding: "24px",
            borderRadius: "18px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
          }}
        >
          <button
            onClick={resetView}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: "none",
              border: "none",
              color: "#2563eb",
              fontWeight: "600",
              cursor: "pointer",
              padding: 0,
              marginBottom: "20px",
              fontSize: "14px",
            }}
          >
            <FiArrowLeft size={16} />
            Back to overview
          </button>

          <div
            style={{
              background: "#f8fafc",
              padding: "70px 30px",
              borderRadius: "20px",
              border: "1px solid #e2e8f0",
              textAlign: "center",
            }}
          >
            <FiSearch
              size={70}
              color="#ef4444"
              style={{ marginBottom: "20px" }}
            />

            <h2 style={{ color: "#dc2626", marginBottom: "15px" }}>
              Parcel Not Found
            </h2>

            <p
              style={{
                color: "#64748b",
                fontSize: "16px",
                marginBottom: "10px",
              }}
            >
              No parcel assigned to you was found with tracking number
            </p>

            <p
              style={{
                color: "#2563eb",
                fontWeight: "600",
                fontSize: "18px",
                margin: 0,
              }}
            >
              {trackingNumber}
            </p>
          </div>
        </div>
      )}

      {parcel && (
        <div
          style={{
            background: "white",
            padding: "24px",
            borderRadius: "18px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
          }}
        >
          <button
            onClick={resetView}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: "none",
              border: "none",
              color: "#2563eb",
              fontWeight: "600",
              cursor: "pointer",
              padding: 0,
              marginBottom: "20px",
              fontSize: "14px",
            }}
          >
            <FiArrowLeft size={16} />
            Back to overview
          </button>

          <div
            style={{
              display: "grid",
              gap: "25px",
            }}
          >
            {/* PARCEL INFORMATION */}

            <div
              style={{
                background: "#f8fafc",
                padding: "30px",
                borderRadius: "18px",
                border: "1px solid #e2e8f0",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "25px",
                }}
              >
                <FiPackage size={26} color="#2563eb" />

                <h2 style={{ margin: 0 }}>Parcel Information</h2>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "180px 1fr",
                  rowGap: "20px",
                }}
              >
                <b>Tracking No :</b>
                <span>{parcel.tracking_number}</span>

                <b>Customer :</b>

                <span
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <FiUser />
                  {parcel.customer_name}
                </span>

                <b>Phone :</b>

                <span>{parcel.phone}</span>

                <b>Status :</b>

                <div>
                  <span
                    style={{
                      width: "fit-content",
                      padding: "8px 14px",
                      borderRadius: "20px",
                      fontWeight: "600",
                      display: "inline-block",
                      background: getStatusMeta(parcel.status).bg,
                      color: getStatusMeta(parcel.status).color,
                    }}
                  >
                    {getStatusMeta(parcel.status).label === "Booked"
                      ? "Assigned"
                      : getStatusMeta(parcel.status).label}
                  </span>

                  {getSubtext(parcel) && (
                    <div
                      style={{
                        color: "#64748b",
                        fontSize: "13px",
                        marginTop: "8px",
                      }}
                    >
                      {getSubtext(parcel)}
                    </div>
                  )}
                </div>

                <b>Address :</b>

                <div>
                  <div
                    style={{
                      color: "#475569",
                      marginBottom: "20px",
                      lineHeight: "1.6",
                    }}
                  >
                    {parcel.address}
                  </div>

                  <div
                    style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}
                  >
                    <a
                      href={`tel:${parcel.phone}`}
                      style={{
                        textDecoration: "none",
                        background: "#dcfce7",
                        color: "#166534",
                        padding: "10px 18px",
                        borderRadius: "12px",
                        fontWeight: "600",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <FiPhone />
                      Call Customer
                    </a>

                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(parcel.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        textDecoration: "none",
                        background: "#dbeafe",
                        color: "#1d4ed8",
                        padding: "10px 18px",
                        borderRadius: "12px",
                        fontWeight: "600",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <FiMapPin />
                      Open in Maps
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* DELIVERY PROGRESS */}

            <div
              style={{
                background: "#f8fafc",
                padding: "35px",
                borderRadius: "20px",
                border: "1px solid #e2e8f0",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "35px",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "12px" }}
                >
                  <FiClock size={28} color="#f59e0b" />

                  <h2 style={{ margin: 0 }}>Delivery Progress</h2>
                </div>

                <span
                  style={{
                    padding: "10px 18px",
                    borderRadius: "30px",
                    background:
                      parcel.status === "Delivered"
                        ? "#dcfce7"
                        : parcel.status === "FailedDelivery"
                          ? "#fee2e2"
                          : "#fef3c7",
                    color:
                      parcel.status === "Delivered"
                        ? "#166534"
                        : parcel.status === "FailedDelivery"
                          ? "#991b1b"
                          : "#92400e",
                    fontWeight: "600",
                  }}
                >
                  {parcel.status === "Delivered"
                    ? "Delivered"
                    : parcel.status === "FailedDelivery"
                      ? "Delivery Failed"
                      : "Arriving Today"}
                </span>
              </div>

              <h2
                style={{
                  color:
                    parcel.status === "Delivered"
                      ? "#16a34a"
                      : parcel.status === "FailedDelivery"
                        ? "#dc2626"
                        : "#2563eb",
                  marginBottom: "30px",
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
              </h2>

              <div
                style={{
                  position: "relative",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "40px",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "18px",
                    left: "0",
                    right: "0",
                    height: "6px",
                    background: "#e2e8f0",
                    zIndex: 0,
                  }}
                />

                <div
                  style={{
                    position: "absolute",
                    top: "18px",
                    left: "0",
                    width:
                      parcel.status === "Delivered"
                        ? "100%"
                        : parcel.status === "FailedDelivery"
                          ? parcel.out_for_delivery_at
                            ? "75%"
                            : "50%"
                          : parcel.status === "OutForDelivery"
                            ? "75%"
                            : parcel.status === "Assigned"
                              ? "50%"
                              : "25%",
                    height: "6px",
                    background: "#16a34a",
                    zIndex: 1,
                  }}
                />

                {parcel.status === "FailedDelivery" &&
                  parcel.out_for_delivery_at && (
                    <div
                      style={{
                        position: "absolute",
                        top: "18px",
                        left: "75%",
                        width: "25%",
                        height: "6px",
                        background: "#ef4444",
                        zIndex: 2,
                      }}
                    />
                  )}

                {[
                  {
                    label: "Ordered",
                    active: true,
                    date: parcel.created_at,
                  },
                  {
                    label: "Assigned",
                    active: !!parcel.assigned_agent_id,
                    date: parcel.created_at,
                  },
                  {
                    label: "Out For Delivery",
                    active: !!parcel.out_for_delivery_at,
                    date: parcel.out_for_delivery_at,
                  },
                  {
                    label: "Delivered",
                    active: !!parcel.delivered_at,
                    date: parcel.delivered_at,
                  },
                ].map((step, index) => (
                  <div
                    key={index}
                    style={{ zIndex: 2, textAlign: "center", width: "150px" }}
                  >
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        background:
                          parcel.status === "FailedDelivery" && index === 3
                            ? "#ef4444"
                            : step.active
                              ? "#16a34a"
                              : "#ffffff",
                        border: step.active ? "none" : "3px solid #cbd5e1",
                        color: "white",
                        margin: "0 auto",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "700",
                      }}
                    >
                      {parcel.status === "FailedDelivery" && index === 3
                        ? "✕"
                        : step.active
                          ? "✓"
                          : ""}
                    </div>

                    <div style={{ marginTop: "15px", fontWeight: "600" }}>
                      {step.label}
                    </div>

                    <div
                      style={{
                        color: "#64748b",
                        fontSize: "13px",
                        marginTop: "6px",
                      }}
                    >
                      {step.date ? new Date(step.date).toLocaleString() : "-"}
                    </div>
                  </div>
                ))}
              </div>

              {/* DELIVERY NOTES */}

              <div
                style={{
                  marginTop: "30px",
                  padding: "20px",
                  borderRadius: "16px",
                  background: parcel.failure_reason ? "#fef2f2" : "#f0fdf4",
                  border: parcel.failure_reason
                    ? "1px solid #fecaca"
                    : "1px solid #bbf7d0",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "10px",
                  }}
                >
                  <FiFileText
                    size={22}
                    color={parcel.failure_reason ? "#dc2626" : "#16a34a"}
                  />

                  <h3 style={{ margin: 0 }}>Delivery Notes</h3>
                </div>

                <p
                  style={{
                    margin: 0,
                    color: parcel.failure_reason ? "#991b1b" : "#166534",
                    lineHeight: "1.8",
                  }}
                >
                  {parcel.failure_reason
                    ? `Delivery Failed: ${parcel.failure_reason}`
                    : "No delivery issues reported."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </AgentLayout>
  );
}

export default AgentTracking;