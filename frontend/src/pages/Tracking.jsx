import { useState } from "react";
import api from "../api/axios";
import MainLayout from "../components/MainLayout";

function Tracking() {

    const [trackingNumber, setTrackingNumber] =
        useState("");

    const [parcel, setParcel] =
        useState(null);

    const searchParcel = async () => {

        try {

            const response = await api.get(
                `/parcels/tracking/${trackingNumber}`
            );

            setParcel(
                response.data
            );

        } catch (error) {

            console.error(
                "Tracking Error:",
                error
            );

            alert(
                "Parcel not found"
            );

        }

    };

    return (
        <>
            <MainLayout>

                    <h1>
                        Parcel Tracking
                    </h1>

                    <div
                        style={{
                            marginTop: "20px",
                            display: "flex",
                            gap: "10px"
                        }}
                    >

                        <input
                            type="text"
                            placeholder="Enter Tracking Number"
                            value={trackingNumber}
                            onChange={(e) =>
                                setTrackingNumber(
                                    e.target.value
                                )
                            }
                            style={{
                                padding: "12px",
                                width: "300px",
                                borderRadius: "10px",
                                border: "1px solid #ccc"
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
                                cursor: "pointer"
                            }}
                        >
                            Search
                        </button>

                    </div>

                    {parcel && (

                        <div
                            style={{
                                background: "white",
                                padding: "30px",
                                borderRadius: "20px",
                                marginTop: "30px",
                                boxShadow:
                                    "0 10px 25px rgba(0,0,0,0.08)"
                            }}
                        >

                            <h2
                                style={{
                                    marginBottom: "25px",
                                    color: "#0f172a"
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
                                    alignItems: "center"
                                }}
                            >

                                <b>Tracking Number</b>

                                <span
                                    style={{
                                        fontWeight: "600",
                                        color: "#2563eb"
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
                                                : "#f59e0b"
                                    }}
                                >
                                    {parcel.status}
                                </span>

                                <b>Customer ID</b>

                                <span>
                                    {parcel.customer_id}
                                </span>

                                <b>Assigned Agent</b>

                                <span>
                                    {parcel.assigned_agent_id || "-"}
                                </span>

                                {
                                    parcel.status === "FailedDelivery" &&
                                    parcel.failure_reason && (
                                        <>
                                            <b>Failure Reason</b>

                                            <span
                                                style={{
                                                    color: "#dc2626",
                                                    fontWeight: "600"
                                                }}
                                            >
                                                {parcel.failure_reason}
                                            </span>
                                        </>
                                    )
                                }

                                <b>Created At</b>

                                <span>
                                    {new Date(
                                        parcel.created_at
                                    ).toLocaleString()}
                                </span>

                            </div>

                        </div>

                    )}

               </MainLayout>
        </>
    );
}

export default Tracking;