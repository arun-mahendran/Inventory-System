import { useEffect, useState } from "react";

import api from "../api/axios";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import PageContainer from "../components/PageContainer";
import { useNavigate } from "react-router-dom";

function DeliveryAgents() {

    const [agents, setAgents] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {

        const fetchAgents = async () => {

            try {

                const response = await api.get(
                    "/delivery-agents/"
                );

                setAgents(
                    response.data
                );

            } catch (error) {

                console.error(
                    "Agent Error:",
                    error
                );

            }

        };

        fetchAgents();

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

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "25px"
                        }}
                    >
                        <h1>
                            Delivery Agents
                        </h1>

                        <button
                            onClick={() =>
                                navigate("/create-agent")
                            }

                            style={{
                                background: "#2563eb",
                                color: "white",
                                border: "none",
                                padding: "12px 20px",
                                borderRadius: "10px",
                                cursor: "pointer"
                            }}
                        >
                            + Add Agent
                        </button>

                    </div>

                    <div
                        style={{
                            background: "white",
                            padding: "24px",
                            borderRadius: "18px",
                            boxShadow:
                                "0 10px 25px rgba(0,0,0,0.08)"
                        }}
                    >

                        <table
                            style={{
                                width: "100%",
                                borderCollapse: "collapse"
                            }}
                        >

                            <thead>

                                <tr>

                                    <th
                                        style={{
                                            textAlign: "left",
                                            padding: "12px"
                                        }}
                                    >
                                        Agent
                                    </th>

                                    <th
                                        style={{
                                            textAlign: "left",
                                            padding: "12px"
                                        }}
                                    >
                                        Pincode
                                    </th>

                                    <th
                                        style={{
                                            textAlign: "left",
                                            padding: "12px"
                                        }}
                                    >
                                        Parcels
                                    </th>

                                    <th
                                        style={{
                                            textAlign: "left",
                                            padding: "12px"
                                        }}
                                    >
                                        Status
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {agents.map((agent) => (

                                    <tr
                                        key={agent.id}
                                        className="table-row"
                                    >

                                        <td
                                            style={{
                                                padding: "12px",
                                                borderTop:
                                                    "1px solid #e5e7eb"
                                            }}
                                        >

                                            <div>

                                                <div
                                                    style={{
                                                        fontWeight: "600",
                                                        color: "#0f172a"
                                                    }}
                                                >
                                                    {agent.agent_name}
                                                </div>

                                                <div
                                                    style={{
                                                        fontSize: "13px",
                                                        color: "#64748b",
                                                        marginTop: "4px"
                                                    }}
                                                >
                                                    🚚 {agent.vehicle_number}
                                                </div>

                                            </div>

                                        </td>

                                        <td
                                            style={{
                                                padding: "12px",
                                                borderTop:
                                                    "1px solid #e5e7eb"
                                            }}
                                        >
                                            {agent.pincode}
                                        </td>

                                        <td
                                            style={{
                                                padding: "12px",
                                                borderTop:
                                                    "1px solid #e5e7eb"
                                            }}
                                        >
                                            {agent.current_parcel_count}
                                        </td>

                                        <td
                                            style={{
                                                padding: "12px",
                                                borderTop:
                                                    "1px solid #e5e7eb"
                                            }}
                                        >
                                            <span
                                                style={{
                                                    background:
                                                        "#dcfce7",
                                                    color:
                                                        "#15803d",
                                                    padding:
                                                        "6px 12px",
                                                    borderRadius:
                                                        "999px",
                                                    fontWeight:
                                                        "600"
                                                }}
                                            >
                                                {agent.availability_status}
                                            </span>
                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                </PageContainer>

            </div>

        </>
    );
}

export default DeliveryAgents;