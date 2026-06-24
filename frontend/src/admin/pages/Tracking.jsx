import { useState } from "react";
import api from "../../api/axios";
import MainLayout from "../components/MainLayout";

import { FiClock, FiCheck, FiFileText } from "react-icons/fi";

function Tracking() {
  const [trackingNumber, setTrackingNumber] = useState("");

  const [parcel, setParcel] = useState(null);

  const searchParcel = async () => {
    try {
      const response = await api.get(`/parcels/tracking/${trackingNumber}`);

      setParcel(response.data);
    } catch (error) {
      console.error("Tracking Error:", error);

      alert("Parcel not found");
    }
  };

  return (
    <>
      <MainLayout>
        <h1>Parcel Tracking</h1>

        <div
          style={{
            marginTop: "20px",
            display: "flex",
            gap: "10px",
          }}
        >
          <input
            type="text"
            placeholder="Enter Tracking Number"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            style={{
              padding: "12px",
              width: "300px",
              borderRadius: "10px",
              border: "1px solid #ccc",
            }}
          />

          <button
            onClick={searchParcel}
            style={{
              background: "#2563eb",
              color: "white",
              border: "none",
              padding: "12px 20px",
              borderRadius: "10px",
              cursor: "pointer",
            }}
          >
            Search
          </button>
        </div>

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
              <h2
                style={{
                  marginBottom: "25px",
                  color: "#0f172a",
                }}
              >
                📦 Tracking Result
              </h2>

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
                  {parcel.status}
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
        zIndex: 1
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
        transition: "0.4s ease"
    }}
/>

{
    parcel.status === "FailedDelivery" &&
    parcel.out_for_delivery_at && (

        <div
            style={{
                position: "absolute",

                top: "28px",

                left: "75%",   // starts after Out For Delivery

                width: "25%",  // goes till Delivered

                height: "6px",

                background: "#ef4444",

                zIndex: 3
            }}
        />

    )
}

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
                            parcel.status === "FailedDelivery" &&
                            index === 3

                                ? "#ef4444"

                                : parcel.status === "FailedDelivery" &&
                                index === (
                                    parcel.out_for_delivery_at ? 2 : 1
                                )

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
                      {
                        parcel.status === "FailedDelivery" &&
                        index === 3

                            ? "✕"

                            : parcel.status === "FailedDelivery" &&
                            index === (
                                parcel.out_for_delivery_at ? 2 : 1
                            )

                            ? <FiCheck />

                            : step.date
                            ? <FiCheck />

                            : index + 1
                    }
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
