import { useEffect, useState }
    from "react";

import api
    from "../../api/axios";

import AgentLayout
    from "../components/AgentLayout";

import AgentStatCard
    from "../components/AgentStatCard";

import { useNavigate }
    from "react-router-dom";


function AgentDashboard() {

    const navigate = useNavigate();

    const fullName =
    localStorage.getItem(
        "full_name"
    );

    const [summary, setSummary] =
        useState({
            assigned: 0,
            outForDelivery: 0,
            delivered: 0,
            failed: 0
        });

    const [parcels, setParcels] =
        useState([]);

    useEffect(() => {

        const fetchSummary =
            async () => {

                try {

                    const agentId =
                        localStorage.getItem(
                            "delivery_agent_id"
                        );

                    const response =
                        await api.get(
                            `/delivery-agents/${agentId}/parcels`
                        );

                    const parcelData =
                        response.data;

                    setParcels(
                        parcelData
                    );

                    const today =
                        new Date().toDateString();

                    setSummary({

                        assigned:
                            parcelData.filter(
                                parcel =>
                                    parcel.status ===
                                    "Assigned"
                            ).length,

                        outForDelivery:
                            parcelData.filter(
                                parcel =>
                                    parcel.status ===
                                    "OutForDelivery"
                            ).length,

                        delivered:
                            parcelData.filter(parcel =>

                                parcel.status ===
                                "Delivered"

                                &&

                                parcel.delivered_at

                                &&

                                new Date(
                                    parcel.delivered_at
                                ).toDateString() === today

                            ).length,

                        failed:
                            parcelData.filter(parcel =>

                                parcel.status ===
                                "FailedDelivery"

                                &&

                                parcel.failed_at

                                &&

                                new Date(
                                    parcel.failed_at
                                ).toDateString() === today

                            ).length

                    });

                } catch (error) {

                    console.error(
                        "Agent Dashboard Error:",
                        error
                    );

                }

            };

        fetchSummary();

    }, []);

    const totalCompleted =
        summary.delivered +
        summary.failed;

    const successRate =
        totalCompleted > 0

            ?

            Math.round(
                (
                    summary.delivered /
                    totalCompleted
                ) * 100
            )

            : 0;

    return (

        <AgentLayout>

            <div
                style={{
                    marginBottom: "30px"
                }}
            >

                <h1
                    style={{
                        fontSize: "36px",
                        fontWeight: "700",
                        marginBottom: "8px",
                        color: "#0f172a"
                    }}
                >
                    👋 Welcome, {fullName}!
                </h1>

                <p
                    style={{
                        fontSize: "18px",
                        color: "#64748b",
                        margin: 0
                    }}
                >
                    Here's your delivery overview for today.
                </p>

            </div>

            <div className="cards">

                <AgentStatCard
                    title="Assigned Parcels"
                    value={summary.assigned}
                    color="#2563eb"
                    icon="📦"
                />

                <AgentStatCard
                    title="Out For Delivery"
                    value={summary.outForDelivery}
                    color="#f59e0b"
                    icon="🚚"
                />

                <AgentStatCard
                    title="Delivered Today"
                    value={summary.delivered}
                    color="#22c55e"
                    icon="✅"
                />

                <AgentStatCard
                    title="Failed Deliveries"
                    value={summary.failed}
                    color="#ef4444"
                    icon="❌"
                />

            </div>

            <div
                style={{
                    marginTop: "35px",
                    background: "white",
                    padding: "30px",
                    borderRadius: "20px",
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
                    📊 Today's Performance
                </h2>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(4,1fr)",
                        gap: "20px"
                    }}
                >

                    <div>

                        <h3
                            style={{
                                color: "#64748b",
                                fontSize: "15px",
                                marginBottom: "10px"
                            }}
                        >
                            Success Rate
                        </h3>

                        <p
                            style={{
                                fontSize: "32px",
                                fontWeight: "700",
                                color: "#22c55e"
                            }}
                        >
                            {successRate}%
                        </p>

                    </div>

                    <div>

                        <h3
                            style={{
                                color: "#64748b",
                                fontSize: "15px",
                                marginBottom: "10px"
                            }}
                        >
                            Delivered Today
                        </h3>

                        <p
                            style={{
                                fontSize: "32px",
                                fontWeight: "700",
                                color: "#2563eb"
                            }}
                        >
                            {summary.delivered}
                        </p>

                    </div>

                    <div>

                        <h3
                            style={{
                                color: "#64748b",
                                fontSize: "15px",
                                marginBottom: "10px"
                            }}
                        >
                            Failed Today
                        </h3>

                        <p
                            style={{
                                fontSize: "32px",
                                fontWeight: "700",
                                color: "#ef4444"
                            }}
                        >
                            {summary.failed}
                        </p>

                    </div>

                    <div>

                        <h3
                            style={{
                                color: "#64748b",
                                fontSize: "15px",
                                marginBottom: "10px"
                            }}
                        >
                            Total Completed
                        </h3>

                        <p
                            style={{
                                fontSize: "32px",
                                fontWeight: "700",
                                color: "#0f172a"
                            }}
                        >
                            {totalCompleted}
                        </p>

                    </div>

                </div>

            </div>

            <div
                style={{
                    marginTop: "35px",
                    background: "white",
                    padding: "30px",
                    borderRadius: "20px",
                    boxShadow:
                        "0 10px 25px rgba(0,0,0,0.08)"
                }}
            >

                <h2>
                    🚚 Pending Deliveries
                </h2>

                <table
                    style={{
                        width: "100%",
                        marginTop: "20px",
                        borderCollapse: "collapse"
                    }}
                >

                    <thead>

                        <tr>

                            <th>Tracking Number</th>
                            <th>Customer ID</th>
                            <th>Status</th>

                        </tr>

                    </thead>

                    <tbody>

                        {
                            parcels

                                .filter(
                                    parcel =>

                                        parcel.status ===
                                        "Assigned"

                                        ||

                                        parcel.status ===
                                        "OutForDelivery"
                                )

                                .slice(0, 5)

                                .map(parcel => (

                                    <tr key={parcel.id}>

                                        <td
                                            style={{
                                                padding: "15px"
                                            }}
                                        >
                                            {parcel.tracking_number}
                                        </td>

                                        <td>
                                            {parcel.customer_id}
                                        </td>

                                        <td>
                                            {parcel.status}
                                        </td>

                                    </tr>

                                ))
                        }

                    </tbody>

                </table>

            </div>

            <div
                style={{
                    marginTop: "35px"
                }}
            >

                <h2
                    style={{
                        marginBottom: "20px",
                        color: "#0f172a"
                    }}
                >
                    ⚡ Quick Actions
                </h2>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(3, 1fr)",
                        gap: "20px"
                    }}
                >

                    <button

                        onClick={() =>
                            navigate("/my-parcels")
                        }

                        style={{
                            padding: "20px",
                            border: "none",
                            borderRadius: "18px",
                            background: "#2563eb",
                            color: "white",
                            fontSize: "16px",
                            fontWeight: "600",
                            cursor: "pointer"
                        }}
                    >
                        📦 My Parcels
                    </button>

                    <button

                        onClick={() =>
                            navigate(
                                "/agent-tracking"
                            )
                        }

                        style={{
                            padding: "20px",
                            border: "none",
                            borderRadius: "18px",
                            background: "#22c55e",
                            color: "white",
                            fontSize: "16px",
                            fontWeight: "600",
                            cursor: "pointer"
                        }}
                    >
                        🔍 Track Parcel
                    </button>

                    <button

                        onClick={() =>
                            navigate(
                                "/delivery-history"
                            )
                        }

                        style={{
                            padding: "20px",
                            border: "none",
                            borderRadius: "18px",
                            background: "#f59e0b",
                            color: "white",
                            fontSize: "16px",
                            fontWeight: "600",
                            cursor: "pointer"
                        }}
                    >
                        📜 History
                    </button>

                </div>

            </div>

            <div
                style={{
                    marginTop: "35px",
                    background: "white",
                    padding: "30px",
                    borderRadius: "20px",
                    boxShadow:
                        "0 10px 25px rgba(0,0,0,0.08)"
                }}
            >

                <h2>
                    📜 Recent Activities
                </h2>

                <div
                    style={{
                        marginTop: "20px"
                    }}
                >

                    {
                        parcels
                            .slice(0, 5)
                            .map(parcel => (

                                <div

                                    key={parcel.id}

                                    style={{
                                        padding: "15px 0",
                                        borderBottom:
                                            "1px solid #e2e8f0"
                                    }}
                                >

                                    {

                                        parcel.status ===
                                        "Delivered"

                                            ?

                                            `✅ ${parcel.tracking_number} delivered successfully`

                                            :

                                            parcel.status ===
                                            "FailedDelivery"

                                                ?

                                                `❌ ${parcel.tracking_number} delivery failed`

                                                :

                                                `🚚 ${parcel.tracking_number} currently ${parcel.status}`
                                    }
                                </div>
                            ))
                    }

                </div>

            </div>

        </AgentLayout>

    );

}

export default AgentDashboard;