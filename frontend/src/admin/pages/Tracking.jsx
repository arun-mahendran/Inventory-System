import { useState } from "react";
import api from "../../api/axios";
import MainLayout from "../components/MainLayout";

import {
  FiClock,
  FiCheck,
  FiFileText,
  FiPackage,
  FiSearch,
} from "react-icons/fi";

function Tracking() {
  const [trackingNumber, setTrackingNumber] = useState("");

  const [parcel, setParcel] = useState(null);

  const [error, setError] = useState("");

  const searchParcel = async () => {
    try {
      const response = await api.get(`/parcels/tracking/${trackingNumber}`);

      setParcel(response.data);

      setError("");
    } catch (error) {
      console.error("Tracking Error:", error);

      setParcel(null);

      setError("Parcel not found");
    }
  };

  return (
    <>
      <MainLayout>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "20px",
          }}
        >
          <FiPackage size={36} color="#2563eb" />

          <h1
            style={{
              margin: 0,
            }}
          >
            Parcel Tracking
          </h1>
        </div>

        <div
          style={{
            background: "white",
            padding: "35px",
            borderRadius: "24px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.06)",
            marginTop: "30px",
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
                borderRadius: "18px",
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
        </div>

        {error && (
          <div
            style={{
              marginTop: "30px",
              background: "white",
              borderRadius: "20px",
              padding: "50px 30px",
              textAlign: "center",
              boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
            }}
          >
            <FiSearch
              size={60}
              color="#ef4444"
              style={{
                marginBottom: "20px",
              }}
            />

            <h2
              style={{
                color: "#dc2626",
                marginBottom: "10px",
              }}
            >
              Parcel Not Found
            </h2>

            <p
              style={{
                color: "#64748b",
                fontSize: "16px",
                margin: 0,
              }}
            >
              No parcel found with tracking number
            </p>

            <p
              style={{
                color: "#2563eb",
                fontWeight: "600",
                fontSize: "18px",
                marginTop: "10px",
              }}
            >
              {trackingNumber}
            </p>
          </div>
        )}

        {parcel && (
          <div
            style={{
              display: "grid",
              gap: "25px",
              marginTop: "30px",
            }}
          >
            {/* TRACKING RESULT CARD */}
            <div
              style={{
                background: "white",
                padding: "30px",
                borderRadius: "20px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "25px",
                }}
              >
                <div
                  style={{
                    width: "52px",
                    height: "52px",
                    borderRadius: "14px",
                    background: "#dbeafe",

                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FiPackage size={26} color="#2563eb" />
                </div>

                <h2
                  style={{
                    margin: 0,
                    color: "#0f172a",
                  }}
                >
                  Tracking Result
                </h2>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "220px 1fr",
                  rowGap: "18px",
                  fontSize: "17px",
                  alignItems: "center",
                }}
              >
                <b>Tracking Number</b>
                <span
                  style={{
                    fontWeight: "600",
                    color: "#2563eb",
                  }}
                >
                  {parcel.tracking_number}
                </span>

                <b>Status</b>
                <span
                  style={{
                    display: "inline-block",
                    width: "fit-content",
                    padding: "6px 14px",
                    borderRadius: "999px",
                    fontWeight: "600",
                    color: "white",
                    background:
                      parcel.status === "Delivered"
                        ? "#22c55e"
                        : parcel.status === "FailedDelivery"
                          ? "#ef4444"
                          : parcel.status === "OutForDelivery"
                            ? "#8b5cf6"
                            : "#f59e0b",
                  }}
                >
                  {parcel.status === "OutForDelivery"
                    ? "Out For Delivery"
                    : parcel.status === "FailedDelivery"
                      ? "Failed Delivery"
                      : parcel.status}
                </span>

                <b>Customer ID</b>
                <span>{parcel.customer_id}</span>

                <b>Assigned Agent</b>
                <span>{parcel.assigned_agent_id || "-"}</span>

                {parcel.status === "FailedDelivery" &&
                  parcel.failure_reason && (
                    <>
                      <b>Failure Reason</b>
                      <span
                        style={{
                          color: "#dc2626",
                          fontWeight: "600",
                        }}
                      >
                        {parcel.failure_reason}
                      </span>
                    </>
                  )}

                <b>Created At</b>
                <span>{new Date(parcel.created_at).toLocaleString()}</span>
              </div>
            </div>

            {/* DELIVERY PROGRESS CARD */}
            <div
              style={{
                background: "white",
                padding: "30px",
                borderRadius: "20px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
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
                  <FiClock size={30} color="#f59e0b" />
                  <h2 style={{ margin: 0 }}>Delivery Progress</h2>
                </div>

                <span
                  style={{
                    padding: "12px 24px",
                    borderRadius: "999px",
                    fontWeight: "600",
                    background:
                      parcel.status === "Delivered"
                        ? "#dcfce7"
                        : parcel.status === "FailedDelivery"
                          ? "#fee2e2"
                          : "#dbeafe",
                    color:
                      parcel.status === "Delivered"
                        ? "#166534"
                        : parcel.status === "FailedDelivery"
                          ? "#991b1b"
                          : "#1d4ed8",
                  }}
                >
                  {parcel.status}
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

                  marginBottom: "20px",
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
                  marginBottom: "50px",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "28px",
                    left: "0",
                    right: "0",
                    height: "6px",
                    background: "#e2e8f0",
                    zIndex: 1,
                  }}
                />

                <div
                  style={{
                    position: "absolute",
                    top: "28px",
                    left: "0",
                    height: "6px",

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

                    background: "#22c55e",

                    zIndex: 2,
                    transition: "0.4s ease",
                  }}
                />

                {parcel.status === "FailedDelivery" &&
                  parcel.out_for_delivery_at && (
                    <div
                      style={{
                        position: "absolute",

                        top: "28px",

                        left: "75%", // starts after Out For Delivery

                        width: "25%", // goes till Delivered

                        height: "6px",

                        background: "#ef4444",

                        zIndex: 3,
                      }}
                    />
                  )}

                {[
                  {
                    title: "Ordered",
                    date: parcel.created_at,
                  },
                  {
                    title: "Assigned",
                    date: parcel.created_at,
                  },
                  {
                    title: "Out For Delivery",
                    date: parcel.out_for_delivery_at,
                  },
                  {
                    title: "Delivered",
                    date: parcel.delivered_at,
                  },
                ].map((step, index) => (
                  <div
                    key={index}
                    style={{
                      zIndex: 2,
                      textAlign: "center",
                      width: "180px",
                      flex: 1,
                    }}
                  >
                    <div
                      style={{
                        width: "56px",
                        height: "56px",

                        borderRadius: "50%",

                        background:
                          parcel.status === "FailedDelivery" && index === 3
                            ? "#ef4444"
                            : parcel.status === "FailedDelivery" &&
                                index === (parcel.out_for_delivery_at ? 2 : 1)
                              ? "#22c55e"
                              : step.date
                                ? "#22c55e"
                                : "#e2e8f0",

                        color: "white",

                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",

                        margin: "0 auto 20px",

                        fontSize: "30px",
                      }}
                    >
                      {parcel.status === "FailedDelivery" && index === 3 ? (
                        "✕"
                      ) : parcel.status === "FailedDelivery" &&
                        index === (parcel.out_for_delivery_at ? 2 : 1) ? (
                        <FiCheck />
                      ) : step.date ? (
                        <FiCheck />
                      ) : (
                        index + 1
                      )}
                    </div>

                    <h3>{step.title}</h3>

                    <p
                      style={{
                        color: "#64748b",
                      }}
                    >
                      {step.date ? new Date(step.date).toLocaleString() : "-"}
                    </p>
                  </div>
                ))}
              </div>

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
      </MainLayout>
    </>
  );
}

export default Tracking;
