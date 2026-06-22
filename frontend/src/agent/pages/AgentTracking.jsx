import { useState } from "react";

import api from "../../api/axios";

import AgentLayout from "../components/AgentLayout";

import {
    FiPackage,
    FiSearch
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
                                background:
                                    "#f8fafc",

                                padding: "25px",

                                borderRadius:
                                    "16px",

                                border:
                                    "1px solid #e2e8f0"
                            }}
                        >

                            <h2>
                                Parcel Details
                            </h2>

                            <div
                                style={{
                                    display: "grid",

                                    gridTemplateColumns:
                                        "180px 1fr",

                                    rowGap: "15px",

                                    marginTop: "20px"
                                }}
                            >

                                <b>
                                    Tracking Number
                                </b>

                                <span>
                                    {
                                        parcel.tracking_number
                                    }
                                </span>

                                <b>
                                    Customer ID
                                </b>

                                <span>
                                    {
                                        parcel.customer_id
                                    }
                                </span>

                                <b>
                                    Status
                                </b>

                                <span>
                                    {parcel.status}
                                </span>

                                <b>
                                    Assigned Agent
                                </b>

                                <span>
                                    {
                                        parcel.assigned_agent_id
                                            ? `Agent ${parcel.assigned_agent_id}`
                                            : "-"
                                    }
                                </span>

                                <b>
                                    Failure Reason
                                </b>

                                <span>
                                    {
                                        parcel.failure_reason
                                        || "-"
                                    }
                                </span>

                                <b>
                                    Created At
                                </b>

                                <span>
                                    {
                                        new Date(
                                            parcel.created_at
                                        ).toLocaleString()
                                    }
                                </span>

                            </div>

                        </div>

                    )
                }

            </div>

        </AgentLayout>

    );

}

export default AgentTracking;