import { useEffect, useState } from "react";
import api from "../../api/axios";
import { HiOutlineUserGroup, HiOutlineTrophy, HiOutlineExclamationTriangle } from "react-icons/hi2";

const Shimmer = ({ width = "100%", height = "16px", radius = "8px", style = {} }) => (
  <div
    className="skeleton-shimmer"
    style={{
      width,
      height,
      borderRadius: radius,
      background: "rgba(255,255,255,0.35)",
      position: "relative",
      overflow: "hidden",
      ...style,
    }}
  />
);

const ShimmerLight = ({ width = "100%", height = "16px", radius = "8px", style = {} }) => (
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

function AgentPerformance() {

    const [agents, setAgents] =
        useState([]);

    const [topAgent, setTopAgent] =
        useState(null);

    const [worstAgent, setWorstAgent] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {

    const loadData = async () => {

            try {

                setLoading(true);

                const performance =
                    await api.get(
                        "/dashboard/agent-performance"
                    );

                const top =
                    await api.get(
                        "/dashboard/top-agent"
                    );

                const worst =
                    await api.get(
                        "/dashboard/worst-agent"
                    );

                setAgents(
                    performance.data
                );

                setTopAgent(
                    top.data
                );

                setWorstAgent(
                    worst.data
                );

            } catch (error) {

                console.error(error);

            } finally {

                setLoading(false);

            }

        };

        loadData();

    }, []);

    return (

        <div
            style={{
                marginTop: "30px"
            }}
        >

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

            <h2
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    color: "#0f172a"
                }}
            >
                <HiOutlineUserGroup size={22} style={{ color: "#f97316" }} />
                Top 5 Agent Performance
            </h2>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "1fr 1fr",
                    gap: "20px",
                    marginTop: "20px"
                }}
            >

                <div
                    style={{
                        background: "linear-gradient(135deg,#22c55e,#16a34a)",
                        color: "white",
                        padding: "28px",
                        borderRadius: "20px",
                        boxShadow:
                            "0 12px 30px rgba(34,197,94,0.25)"
                    }}
                >
                    <h3
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            marginBottom: "20px",
                            fontSize: "24px"
                        }}
                    >
                        <HiOutlineTrophy size={24} />
                        Top Performer
                    </h3>

                    {loading ? (
                        <>
                            <Shimmer width="140px" height="20px" style={{ marginBottom: "12px" }} />
                            <Shimmer width="90px" height="36px" style={{ marginBottom: "8px" }} />
                            <Shimmer width="100px" height="14px" />
                        </>
                    ) : (
                        topAgent &&
                        (
                            <>
                                <p
                                    style={{
                                        fontSize: "22px",
                                        fontWeight: "700",
                                        marginBottom: "10px"
                                    }}
                                >
                                    {topAgent.agent_name}
                                </p>

                                <p
                                    style={{
                                        fontSize: "42px",
                                        fontWeight: "800",
                                        margin: "0"
                                    }}
                                >
                                    {topAgent.success_rate}%
                                </p>

                                <p>
                                    Success Rate
                                </p>
                            </>
                        )
                    )}

                </div>

                <div
                    style={{
                        background: "linear-gradient(135deg,#ef4444,#dc2626)",
                        color: "white",
                        padding: "28px",
                        borderRadius: "20px",
                        boxShadow:
                            "0 12px 30px rgba(239,68,68,0.25)"
                    }}
                >
                    <h3
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            marginBottom: "20px",
                            fontSize: "24px"
                        }}
                    >
                        <HiOutlineExclamationTriangle size={24} />
                        Needs Attention
                    </h3>

                    {loading ? (
                        <>
                            <Shimmer width="140px" height="20px" style={{ marginBottom: "12px" }} />
                            <Shimmer width="90px" height="36px" style={{ marginBottom: "8px" }} />
                            <Shimmer width="100px" height="14px" />
                        </>
                    ) : (
                        worstAgent &&
                        (
                            <>
                                <p
                                    style={{
                                        fontSize: "22px",
                                        fontWeight: "700",
                                        marginBottom: "10px"
                                    }}
                                >
                                    {worstAgent.agent_name}
                                </p>

                                <p
                                    style={{
                                        fontSize: "42px",
                                        fontWeight: "800",
                                        margin: "0"
                                    }}
                                >
                                    {worstAgent.success_rate}%
                                </p>

                                <p>
                                    Success Rate
                                </p>
                            </>
                        )
                    )}

                </div>

            </div>

            <div
                style={{
                    background: "white",
                    padding: "24px",
                    borderRadius: "18px",
                    marginTop: "20px",
                    boxShadow:
                        "0 10px 25px rgba(0,0,0,0.08)"
                }}
            >

                <table
                    style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        textAlign: "center"
                    }}
                >

                    <thead>

                        <tr>

                            <th style={{padding:"16px", textAlign:"left"}}>
                                Agent
                            </th>

                            <th style={{padding:"16px", textAlign:"center"}}>
                                Active
                            </th>

                            <th style={{padding:"16px", textAlign:"center"}}>
                                Delivered
                            </th>

                            <th style={{padding:"16px", textAlign:"center"}}>
                                Failed
                            </th>

                            <th style={{padding:"16px", textAlign:"center"}}>
                                Success %
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {loading ? (

                            Array.from({ length: 5 }).map((_, i) => (

                                <tr key={`skeleton-${i}`}>

                                    <td
                                        style={{
                                            padding: "16px",
                                            textAlign: "left",
                                            borderTop: "1px solid #e5e7eb"
                                        }}
                                    >
                                        <ShimmerLight width="120px" height="14px" />
                                    </td>

                                    <td
                                        style={{
                                            padding: "16px",
                                            textAlign: "center",
                                            borderTop: "1px solid #e5e7eb"
                                        }}
                                    >
                                        <ShimmerLight width="30px" height="14px" style={{ margin: "0 auto" }} />
                                    </td>

                                    <td
                                        style={{
                                            padding: "16px",
                                            textAlign: "center",
                                            borderTop: "1px solid #e5e7eb"
                                        }}
                                    >
                                        <ShimmerLight width="30px" height="14px" style={{ margin: "0 auto" }} />
                                    </td>

                                    <td
                                        style={{
                                            padding: "16px",
                                            textAlign: "center",
                                            borderTop: "1px solid #e5e7eb"
                                        }}
                                    >
                                        <ShimmerLight width="30px" height="14px" style={{ margin: "0 auto" }} />
                                    </td>

                                    <td
                                        style={{
                                            padding: "16px",
                                            textAlign: "center",
                                            borderTop: "1px solid #e5e7eb"
                                        }}
                                    >
                                        <ShimmerLight width="50px" height="14px" style={{ margin: "0 auto" }} />
                                    </td>

                                </tr>

                            ))

                        ) : (

                            agents.map(
                                (agent) => (

                                    <tr
                                        key={
                                            agent.agent_id
                                        }
                                    >

                                        <td
                                            style={{
                                                padding: "16px",
                                                textAlign: "left",
                                                borderTop: "1px solid #e5e7eb",
                                                fontWeight: "600"
                                            }}
                                        >
                                            {agent.agent_name}
                                        </td>

                                        <td
                                            style={{
                                                padding: "16px",
                                                textAlign: "center",
                                                borderTop: "1px solid #e5e7eb"
                                            }}
                                        >
                                            {agent.active_parcels}
                                        </td>

                                        <td
                                            style={{
                                                padding: "16px",
                                                textAlign: "center",
                                                borderTop: "1px solid #e5e7eb"
                                            }}
                                        >
                                            {agent.delivered_parcels}
                                        </td>

                                        <td
                                            style={{
                                                padding: "16px",
                                                textAlign: "center",
                                                borderTop: "1px solid #e5e7eb"
                                            }}
                                        >
                                            {agent.failed_parcels}
                                        </td>

                                        <td
                                            style={{
                                                padding: "16px",
                                                textAlign: "center",
                                                borderTop: "1px solid #e5e7eb",
                                                fontWeight: "700",
                                                color:
                                                    agent.success_rate >= 90
                                                        ? "#16a34a"
                                                        : agent.success_rate >= 70
                                                        ? "#ca8a04"
                                                        : "#dc2626"
                                            }}
                                        >
                                            {agent.success_rate}%
                                        </td>

                                    </tr>

                                )
                            )

                        )}

                    </tbody>

                </table>

            </div>

        </div>

    );

}

export default AgentPerformance;