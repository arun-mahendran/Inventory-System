import { useEffect, useState }
    from "react";

import api
    from "../../api/axios";

import AgentLayout
    from "../components/AgentLayout";

import AgentStatCard
    from "../components/AgentStatCard";


function AgentDashboard() {

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

    useEffect(() => {

        const fetchSummary =
            async () => {

                try {

                    const agentId =
                        localStorage.getItem(
                            "user_id"
                        );

                    const response =
                        await api.get(
                            `/delivery-agents/${agentId}/parcels`
                        );

                    const parcels =
                        response.data;

                    setSummary({

                        assigned:
                            parcels.length,

                        outForDelivery:
                            parcels.filter(
                                parcel =>
                                    parcel.status ===
                                    "OutForDelivery"
                            ).length,

                        delivered:
                            parcels.filter(
                                parcel =>
                                    parcel.status ===
                                    "Delivered"
                            ).length,

                        failed:
                            parcels.filter(
                                parcel =>
                                    parcel.status ===
                                    "FailedDelivery"
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

        </AgentLayout>

    );

}

export default AgentDashboard;