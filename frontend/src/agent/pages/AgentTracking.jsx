import { useState } from "react";

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
} from "react-icons/fi";

function AgentTracking() {
  const [trackingNumber, setTrackingNumber] = useState("");

  const [parcel, setParcel] = useState(null);

  const [error, setError] = useState("");

  const searchParcel = async () => {
    if (!trackingNumber) return;

    try {
      const response = await api.get(`/parcels/tracking/${trackingNumber}`);

      setParcel(response.data);

      setError("");
    } catch (error) {
      setParcel(null);

      setError("Parcel not found");
    }
  };

  return (
    <AgentLayout>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "25px",
        }}
      >
        <FiPackage size={30} color="#2563eb" />

        <h1>Parcel Tracking</h1>
      </div>

      <div
        style={{
          background: "white",
          padding: "24px",

          borderRadius: "18px",

          boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "16px",
            alignItems: "center",
          }}
        >
          <input
            type="text"
            placeholder="Enter Tracking Number"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            style={{
              flex: 1,
              padding: "14px 18px",
              borderRadius: "16px",
              border: "2px solid #e2e8f0",
              fontSize: "16px",
              outline: "none",
              transition: "0.3s ease",
            }}
          />

          <button
            onClick={searchParcel}
            style={{
              background: "linear-gradient(135deg,#2563eb,#3b82f6)",

              color: "white",

              border: "none",

              padding: "14px 24px",

              borderRadius: "16px",

              cursor: "pointer",

              display: "flex",

              alignItems: "center",

              gap: "10px",

              fontSize: "16px",

              fontWeight: "600",
            }}
          >
            <FiSearch size={18} />
            Search
          </button>
        </div>

        {error && (
          <div
            style={{
              color: "#dc2626",
              fontWeight: "600",
            }}
          >
            {error}
          </div>
        )}

        {parcel && (
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

                <h2
                  style={{
                    margin: 0,
                  }}
                >
                  Parcel Information
                </h2>
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
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <FiUser />
                  {parcel.customer_name}
                </span>

                <b>Phone :</b>

                <span>{parcel.phone}</span>

                <b>Status :</b>

                <span
                  style={{
                    width: "fit-content",

                    padding: "8px 14px",

                    borderRadius: "20px",

                    fontWeight: "600",

                    background:
                      parcel.status === "Delivered"
                        ? "#dcfce7"
                        : parcel.status === "FailedDelivery"
                          ? "#fee2e2"
                          : parcel.status === "OutForDelivery"
                            ? "#fef3c7"
                            : "#ede9fe",

                    color:
                      parcel.status === "Delivered"
                        ? "#166534"
                        : parcel.status === "FailedDelivery"
                          ? "#991b1b"
                          : parcel.status === "OutForDelivery"
                            ? "#92400e"
                            : "#6d28d9",
                  }}
                >
                  {parcel.status}
                </span>

                <b>Address :</b>

                <div>
                  <div
                    style={{
                      whiteSpace: "pre-wrap",
                      lineHeight: "1.8",
                      color: "#475569",
                      marginBottom: "20px",
                    }}
                  >
                    {parcel.address?.split(",").join(",\n")}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      flexWrap: "wrap",
                    }}
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
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  <FiClock size={28} color="#f59e0b" />

                  <h2
                    style={{
                      margin: 0,
                    }}
                  >
                    Delivery Progress
                  </h2>
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
                {/* LINE */}

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
                    style={{
                      zIndex: 2,
                      textAlign: "center",
                      width: "150px",
                    }}
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

                    <div
                      style={{
                        marginTop: "15px",
                        fontWeight: "600",
                      }}
                    >
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

                  <h3
                    style={{
                      margin: 0,
                    }}
                  >
                    Delivery Notes
                  </h3>
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
        )}
      </div>
    </AgentLayout>
  );
}

export default AgentTracking;
