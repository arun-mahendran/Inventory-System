import { useEffect, useState } from "react";

import api from "../../api/axios";
import "../../styles/parcelTable.css";

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

function RecentParcels() {

    const [parcels, setParcels] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const loadParcels = async () => {

            try {

                setLoading(true);

                const response = await api.get(
                    "/dashboard/recent-parcels"
                );

                console.log(
                    "Parcels API Response:",
                    response.data
                );

                setParcels(
                    response.data
                );

            } catch (error) {

                console.error(
                    "Parcel Error:",
                    error
                );

            } finally {

                setLoading(false);

            }

        };

        loadParcels();

    }, []);

    return (

        <div
            style={{
                background: "white",
                marginTop: "30px",
                padding: "24px",
                borderRadius: "18px",
                boxShadow:
                    "0 10px 25px rgba(0,0,0,0.08)"
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
                    marginBottom: "20px"
                }}
            >
                Recent Parcels
            </h2>

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
                            Tracking No
                        </th>

                        <th
                            style={{
                                textAlign: "left",
                                padding: "12px"
                            }}
                        >
                            Status
                        </th>

                        <th
                            style={{
                                textAlign: "left",
                                padding: "12px"
                            }}
                        >
                            Agent
                        </th>

                    </tr>

                </thead>

                <tbody>

                    {loading ? (

                        Array.from({ length: 5 }).map((_, i) => (

                            <tr key={`skeleton-${i}`}>

                                <td
                                    style={{
                                        padding: "12px",
                                        borderTop: "1px solid #e5e7eb"
                                    }}
                                >
                                    <Shimmer width="100px" height="14px" />
                                </td>

                                <td
                                    style={{
                                        padding: "12px",
                                        borderTop: "1px solid #e5e7eb"
                                    }}
                                >
                                    <Shimmer width="90px" height="22px" radius="20px" />
                                </td>

                                <td
                                    style={{
                                        padding: "12px",
                                        borderTop: "1px solid #e5e7eb"
                                    }}
                                >
                                    <Shimmer width="70px" height="14px" />
                                </td>

                            </tr>

                        ))

                    ) : (

                        parcels.map((parcel) => (

                            <tr
                                key={parcel.id}
                                className="parcel-row"
                            >

                                <td
                                    style={{
                                        padding: "12px",
                                        borderTop:
                                            "1px solid #e5e7eb"
                                    }}
                                >
                                    {parcel.tracking_number}
                                </td>

                                <td
                                    style={{
                                        padding: "12px",
                                        borderTop:
                                            "1px solid #e5e7eb"
                                    }}
                                >
                                    <span
                                        className={`status ${
                                            parcel.status === "Delivered"
                                                ? "status-delivered"
                                                : parcel.status === "Assigned"
                                                ? "status-assigned"
                                                : "status-failed"
                                        }`}
                                    >
                                        {parcel.status}
                                    </span>
                                </td>

                                <td
                                    style={{
                                        padding: "12px",
                                        borderTop:
                                            "1px solid #e5e7eb"
                                    }}
                                >
                                    {parcel.assigned_agent_id
                                        ? `Agent ${parcel.assigned_agent_id}`
                                        : "-"
                                    }
                                </td>

                            </tr>

                        ))

                    )}

                </tbody>

            </table>

        </div>

    );
}

export default RecentParcels;