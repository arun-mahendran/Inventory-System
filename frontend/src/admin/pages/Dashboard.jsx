import { useEffect, useState } from "react";

import api from "../../api/axios";

import MainLayout from "../components/MainLayout";
import DashboardCards from "../components/DashboardCards";
import RecentParcels from "../components/RecentParcels";
import AgentPerformance from "../components/AgentPerformance";
import DeliveryStatusChart from "../components/DeliveryStatusChart";

const Shimmer = ({ width = "100%", height = "16px", radius = "8px", style = {} }) => (
  <div
    className="skeleton-shimmer"
    style={{
      width,
      height,
      borderRadius: radius,
      background: "#e5e7eb",
      position: "relative",
      overflow: "hidden",
      ...style,
    }}
  />
);

function Dashboard() {

    const [summary, setSummary] = useState({
        total_parcels: 0,
        delivered_parcels: 0,
        failed_parcels: 0,
        available_agents: 0
    });

    const [dashboardLoading, setDashboardLoading] = useState(true);

    const [selectedPincode, setSelectedPincode] =
    useState(null);

    const [pincodeParcels, setPincodeParcels] =
    useState([]);

    const [searchPincode, setSearchPincode] =
    useState("");

    const [pincodeLoading, setPincodeLoading] =
    useState(false);


    const fetchParcelsByPincode =
    async (pincode) => {

        try {

            setPincodeLoading(true);

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

        } finally {

            setPincodeLoading(false);

        }

    };

    useEffect(() => {

        const loadDashboard = async () => {

            try {

                setDashboardLoading(true);

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

            } finally {

                setDashboardLoading(false);

            }

        };

        loadDashboard();

    }, []);

   return (
        <>
            <style>{`
                .skeleton-shimmer::after {
                    content: "";
                    position: absolute;
                    inset: 0;
                    transform: translateX(-100%);
                    background: linear-gradient(
                        90deg,
                        rgba(255,255,255,0) 0%,
                        rgba(255,255,255,0.6) 50%,
                        rgba(255,255,255,0) 100%
                    );
                    animation: skeleton-shimmer 1.4s infinite;
                }
                @keyframes skeleton-shimmer {
                    100% { transform: translateX(100%); }
                }
            `}</style>

            <MainLayout>

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

                    {dashboardLoading ? (
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(4, 1fr)",
                                gap: "20px",
                                marginBottom: "24px",
                            }}
                        >
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div
                                    key={i}
                                    style={{
                                        background: "white",
                                        borderRadius: "18px",
                                        padding: "22px",
                                        boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
                                    }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "14px",
                                            marginBottom: "14px",
                                        }}
                                    >
                                        <Shimmer width="46px" height="46px" radius="12px" />
                                        <Shimmer width="120px" height="14px" />
                                    </div>
                                    <Shimmer width="60px" height="28px" style={{ marginBottom: "8px" }} />
                                    <Shimmer width="140px" height="13px" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <DashboardCards
                            summary={summary}
                        />
                    )}

                    {dashboardLoading ? (
                        <div
                            style={{
                                background: "white",
                                padding: "24px",
                                borderRadius: "18px",
                                boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
                                marginBottom: "24px",
                            }}
                        >
                            <Shimmer width="200px" height="20px" style={{ marginBottom: "20px" }} />
                            <Shimmer width="100%" height="220px" radius="12px" />
                        </div>
                    ) : (
                        <DeliveryStatusChart
                            summary={summary}
                        />
                    )}

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
                                disabled={pincodeLoading}
                                style={{
                                    background: pincodeLoading ? "#93c5fd" : "#2563eb",
                                    color: "white",
                                    border: "none",
                                    padding: "10px 20px",
                                    borderRadius: "10px",
                                    cursor: pincodeLoading ? "not-allowed" : "pointer"
                                }}
                            >
                                {pincodeLoading ? "Searching..." : "Search"}
                            </button>

                        </div>


                    </div>

                    {pincodeLoading && (

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

                            <Shimmer width="220px" height="22px" style={{ marginBottom: "20px" }} />

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

                                    {Array.from({ length: 4 }).map((_, i) => (

                                        <tr key={i}>

                                            <td
                                                style={{
                                                    padding: "14px",
                                                    borderBottom: "1px solid #f1f5f9"
                                                }}
                                            >
                                                <Shimmer width="90px" height="14px" />
                                            </td>

                                            <td
                                                style={{
                                                    padding: "14px",
                                                    borderBottom: "1px solid #f1f5f9"
                                                }}
                                            >
                                                <Shimmer width="80px" height="20px" radius="20px" />
                                            </td>

                                            <td
                                                style={{
                                                    padding: "14px",
                                                    borderBottom: "1px solid #f1f5f9"
                                                }}
                                            >
                                                <Shimmer width="70px" height="14px" />
                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    )}

                    {
                        selectedPincode && !pincodeLoading && (

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

               </MainLayout>
        </>
    );
}

export default Dashboard;