import { useState } from "react";

import api from "../api/axios";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import PageContainer from "../components/PageContainer";

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
            <Navbar />

            <div
                style={{
                    display: "flex"
                }}
            >
                <Sidebar />

                <PageContainer>

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
                                marginTop: "30px",
                                background: "white",
                                padding: "24px",
                                borderRadius: "18px",
                                boxShadow:
                                    "0 10px 25px rgba(0,0,0,0.08)"
                            }}
                        >

                            <h2>
                                Tracking Result
                            </h2>

                            <p>
                                <b>Tracking Number:</b>{" "}
                                {parcel.tracking_number}
                            </p>

                            <p>
                                <b>Status:</b>{" "}
                                {parcel.status}
                            </p>

                            <p>
                                <b>Customer ID:</b>{" "}
                                {parcel.customer_id}
                            </p>

                            <p>
                                <b>Assigned Agent:</b>{" "}
                                {parcel.assigned_agent_id || "-"}
                            </p>

                            <p>
                                <b>Created At:</b>{" "}
                                {parcel.created_at}
                            </p>

                        </div>

                    )}

                </PageContainer>

            </div>
        </>
    );
}

export default Tracking;