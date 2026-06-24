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
    FiFileText
} from "react-icons/fi";

function AgentTracking() {

    const [trackingNumber,
        setTrackingNumber] =
        useState("");

    const [parcel,
        setParcel] =
        useState(null);

    const [error,
        setError] =
        useState("");

    const searchParcel =
        async () => {

            if (!trackingNumber) return;

            try {

                const response =
                    await api.get(
                        `/parcels/tracking/${trackingNumber}`
                    );

                setParcel(
                    response.data
                );

                setError("");

            } catch (error) {

                setParcel(null);

                setError(
                    "Parcel not found"
                );

            }

        };

    return (

        <AgentLayout>

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "25px"
                }}
            >

                <FiPackage
                    size={30}
                    color="#2563eb"
                />

                <h1>
                    Parcel Tracking
                </h1>

            </div>

            <div
                style={{
                    background: "white",
                    padding: "30px",
                    borderRadius: "18px",
                    boxShadow:
                        "0 10px 25px rgba(0,0,0,0.08)"
                }}
            >

                <div
                    style={{
                        display: "flex",
                        gap: "15px",
                        marginBottom: "30px"
                    }}
                >

                    <input

                        type="text"

                        placeholder=
                            "Enter Tracking Number"

                        value={trackingNumber}

                        onChange={(e) =>
                            setTrackingNumber(
                                e.target.value
                            )
                        }

                        style={{
                            flex: 1,
                            padding: "14px",
                            borderRadius: "12px",
                            border:
                                "2px solid #e2e8f0",
                            fontSize: "16px"
                        }}
                    />

                    <button

                        onClick={
                            searchParcel
                        }

                        style={{
                            background:
                                "#2563eb",
                            color: "white",
                            border: "none",
                            padding:
                                "14px 20px",
                            borderRadius:
                                "12px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems:
                                "center",
                            gap: "8px"
                        }}
                    >

                        <FiSearch />

                        Search

                    </button>

                </div>

                {
                    error && (

                        <div
                            style={{
                                color: "#dc2626",
                                fontWeight: "600"
                            }}
                        >
                            {error}
                        </div>

                    )
                }

                {
                    parcel && (

                        <div
                            style={{
                                display: "grid",
                                gap: "25px"
                            }}
                        >

                            {/* PARCEL INFORMATION */}

                            <div
                                style={{
                                    background: "#f8fafc",
                                    padding: "30px",
                                    borderRadius: "18px",
                                    border: "1px solid #e2e8f0"
                                }}
                            >

                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "10px",
                                        marginBottom: "25px"
                                    }}
                                >

                                    <FiPackage
                                        size={26}
                                        color="#2563eb"
                                    />

                                    <h2
                                        style={{
                                            margin: 0
                                        }}
                                    >
                                        Parcel Information
                                    </h2>

                                </div>

                                <div
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns:
                                            "180px 1fr",
                                        rowGap: "20px"
                                    }}
                                >

                                    <b>Tracking No :</b>
                                    <span>
                                        {parcel.tracking_number}
                                    </span>

                                    <b>Customer :</b>

                                    <span
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "8px"
                                        }}
                                    >
                                        <FiUser />
                                        {parcel.customer_name}
                                    </span>

                                    <b>Phone :</b>

                                    <span>
                                        {parcel.phone}
                                    </span>

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

                                                    : "#6d28d9"
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
                                                marginBottom: "20px"
                                            }}
                                        >
                                            {
                                                parcel.address
                                                    ?.split(",")
                                                    .join(",\n")
                                            }
                                        </div>

                                        <div
                                            style={{
                                                display: "flex",
                                                gap: "12px",
                                                flexWrap: "wrap"
                                            }}
                                        >

                                            <a
                                                href={`tel:${parcel.phone}`}
                                                style={{
                                                    textDecoration: "none",

                                                    background: "#dcfce7",

                                                    color: "#166534",

                                                    padding:
                                                        "10px 18px",

                                                    borderRadius: "12px",

                                                    fontWeight: "600",

                                                    display: "flex",

                                                    alignItems: "center",

                                                    gap: "8px"
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

                                                    padding:
                                                        "10px 18px",

                                                    borderRadius: "12px",

                                                    fontWeight: "600",

                                                    display: "flex",

                                                    alignItems: "center",

                                                    gap: "8px"
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
                                    padding: "30px",
                                    borderRadius: "18px",
                                    border: "1px solid #e2e8f0"
                                }}
                            >

                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "10px",
                                        marginBottom: "25px"
                                    }}
                                >

                                    <FiClock
                                        size={26}
                                        color="#f59e0b"
                                    />

                                    <h2
                                        style={{
                                            margin: 0
                                        }}
                                    >
                                        Delivery Progress
                                    </h2>

                                </div>

                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "20px"
                                    }}
                                >

                                    <div>
                                        ✅ Parcel Created
                                    </div>

                                    <div>
                                        {
                                            parcel.assigned_agent_id
                                                ? "✅ Assigned"
                                                : "⭕ Assigned"
                                        }
                                    </div>

                                    <div>
                                        {
                                            parcel.out_for_delivery_at
                                                ? "✅ Out For Delivery"
                                                : "⭕ Out For Delivery"
                                        }
                                    </div>

                                    <div>
                                        {
                                            parcel.delivered_at
                                                ? "✅ Delivered"
                                                : "⭕ Delivered"
                                        }
                                    </div>

                                </div>

                            </div>

                            {/* DELIVERY NOTES */}

                            <div
                                style={{
                                    background: "#f8fafc",
                                    padding: "30px",
                                    borderRadius: "18px",
                                    border: "1px solid #e2e8f0"
                                }}
                            >

                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "10px",
                                        marginBottom: "20px"
                                    }}
                                >

                                    <FiFileText
                                        size={26}
                                        color="#22c55e"
                                    />

                                    <h2
                                        style={{
                                            margin: 0
                                        }}
                                    >
                                        Delivery Notes
                                    </h2>

                                </div>

                                <p
                                    style={{
                                        color: "#475569",
                                        margin: 0
                                    }}
                                >

                                    {
                                        parcel.failure_reason

                                            ? `Delivery Failed: ${parcel.failure_reason}`

                                            : "No failure reported."
                                    }

                                </p>

                            </div>

                        </div>

                    )
                }

                </div>

        </AgentLayout>

    );

}

export default AgentTracking;