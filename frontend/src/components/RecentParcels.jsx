import { useEffect, useState } from "react";

import api from "../api/axios";
import "../styles/parcelTable.css";

function RecentParcels() {

    const [parcels, setParcels] = useState([]);

    useEffect(() => {

        const loadParcels = async () => {

            try {

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

                    {parcels.map((parcel) => (

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

                    ))}

                </tbody>

            </table>

        </div>

    );
}

export default RecentParcels;