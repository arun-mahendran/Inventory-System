import { useEffect, useState } from "react";

import api from "../api/axios";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import DashboardCards from "../components/DashboardCards";
import RecentParcels from "../components/RecentParcels";
import PageContainer from "../components/PageContainer";
import AgentPerformance from "../components/AgentPerformance";
import DeliveryStatusChart from "../components/DeliveryStatusChart";

function Dashboard() {

    const [summary, setSummary] = useState({
        total_parcels: 0,
        delivered_parcels: 0,
        failed_parcels: 0,
        available_agents: 0
    });

    const [selectedPincode, setSelectedPincode] =
    useState(null);

    const [pincodeParcels, setPincodeParcels] =
    useState([]);

    const [searchPincode, setSearchPincode] =
    useState("");


    const fetchParcelsByPincode =
    async (pincode) => {

        try {

            const response =
                await api.get(
                    `/dashboard/pincode/${pincode}`
                );

            setPincodeParcels(
                response.data
            );

            setSelectedPincode(
                pincode
            );

        } catch (error) {

            console.error(
                error
            );

        }

    };

    useEffect(() => {

        const loadDashboard = async () => {

            try {

                const response = await api.get(
                    "/dashboard/summary"
                );

                console.log(
                    "Dashboard API Response:",
                    response.data
                );

                setSummary(
                    response.data
                );

            } catch (error) {

                console.error(
                    "Dashboard Error:",
                    error
                );

            }

        };

        loadDashboard();

    }, []);

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

                    <h1
                        style={{
                            fontSize: "34px",
                            marginBottom: "10px",
                            color: "#0f172a"
                        }}
                    >
                        Good Afternoon, Arun 👋
                    </h1>

                    <p
                        style={{
                            color: "#64748b",
                            marginBottom: "25px",
                            fontSize: "16px"
                        }}
                    >
                        Manage parcel deliveries, agents and tracking
                        from a single dashboard.
                    </p>

                    <DashboardCards
                        summary={summary}
                    />

                    <DeliveryStatusChart
                        summary={summary}
                    />

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
                            📍 Pincode Analytics
                        </h2>

                        <div
                           style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "15px",
                                marginTop: "20px",
                                marginBottom: "20px"
                            }}
                        >

                            <input
                                type="text"
                                placeholder="Enter Pincode"
                                value={searchPincode}
                                onChange={(e) =>
                                    setSearchPincode(
                                        e.target.value
                                    )
                                }
                                style={{
                                    padding: "10px",
                                    border: "1px solid #d1d5db",
                                    borderRadius: "10px",
                                    width: "220px"
                                }}
                            />

                            <button
                                onClick={() => {
                                    if (
                                        !searchPincode.trim()
                                    ) {
                                        alert(
                                            "Enter Pincode"
                                        );
                                        return;
                                    }

                                    fetchParcelsByPincode(
                                        searchPincode
                                    );

                                }}
                                style={{
                                    background: "#2563eb",
                                    color: "white",
                                    border: "none",
                                    padding: "10px 20px",
                                    borderRadius: "10px",
                                    cursor: "pointer"
                                }}
                            >
                                Search
                            </button>

                        </div>


                    </div>

                    {
                        selectedPincode && (

                            <div
                                style={{
                                    marginTop: "25px",
                                    background: "white",
                                    padding: "24px",
                                    borderRadius: "18px",
                                    boxShadow:
                                        "0 10px 25px rgba(0,0,0,0.08)"
                                }}
                            >

                                <h2>
                                    Parcels in
                                    {" "}
                                    {selectedPincode}
                                </h2>

                                <table
                                    style={{
                                        width: "100%",
                                        borderCollapse: "collapse",
                                        marginTop: "20px"
                                    }}
                                >

                                    <thead>

                                        <tr>

                                            <th
                                                style={{
                                                    textAlign: "left",
                                                    padding: "14px",
                                                    borderBottom: "2px solid #e5e7eb"
                                                }}
                                            >
                                                Tracking Number
                                            </th>

                                            <th
                                                style={{
                                                    textAlign: "left",
                                                    padding: "14px",
                                                    borderBottom: "2px solid #e5e7eb"
                                                }}
                                            >
                                                Status
                                            </th>

                                            <th
                                                style={{
                                                    textAlign: "left",
                                                    padding: "14px",
                                                    borderBottom: "2px solid #e5e7eb"
                                                }}
                                            >
                                                Agent
                                            </th>

                                        </tr>

                                    </thead>

                                    <tbody>

                                        {pincodeParcels.map((parcel) => (

                                            <tr
                                                key={parcel.id}
                                            >

                                                <td
                                                    style={{
                                                        padding: "14px",
                                                        borderBottom:
                                                            "1px solid #f1f5f9"
                                                    }}
                                                >
                                                    {parcel.tracking_number}
                                                </td>

                                                <td
                                                    style={{
                                                        padding: "14px",
                                                        borderBottom:
                                                            "1px solid #f1f5f9"
                                                    }}
                                                >
                                                    {parcel.status}
                                                </td>

                                                <td
                                                    style={{
                                                        padding: "14px",
                                                        borderBottom:
                                                            "1px solid #f1f5f9"
                                                    }}
                                                >
                                                    Agent {
                                                        parcel.assigned_agent_id
                                                        || "-"
                                                    }
                                                </td>

                                            </tr>

                                        ))}

                                    </tbody>

                                </table>

                            </div>

                        )
                    }
                    <AgentPerformance />

                    <RecentParcels />

                </PageContainer>

            </div>
        </>
    );
}

export default Dashboard;