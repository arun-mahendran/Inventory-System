import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import api from "../api/axios";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import PageContainer from "../components/PageContainer";

function ParcelHistory() {

    const { id } = useParams();

    const [history, setHistory] = useState([]);

    useEffect(() => {

        const fetchHistory = async () => {

            try {

                console.log(
                    "Parcel ID:",
                    id
                );

                const response = await api.get(
                    `/parcels/${id}/history`
                );

                console.log(
                    "History Response:",
                    response.data
                );

                setHistory(
                    response.data
                );

            } catch (error) {

                console.error(
                    "History Error:",
                    error
                );

            }

        };

        fetchHistory();

    }, [id]);

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
                        Parcel History
                    </h1>

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

                        <p
                            style={{
                                marginBottom: "20px",
                                color: "#64748b"
                            }}
                        >
                            Records Found: {history.length}
                        </p>

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
                                        Agent ID
                                    </th>

                                    <th
                                        style={{
                                            textAlign: "left",
                                            padding: "12px"
                                        }}
                                    >
                                        Assigned At
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {history.map((record) => (

                                    <tr
                                        key={record.id}
                                    >

                                        <td
                                            style={{
                                                padding: "12px",
                                                borderTop:
                                                    "1px solid #e5e7eb"
                                            }}
                                        >
                                            Agent {record.agent_id}
                                        </td>

                                        <td
                                            style={{
                                                padding: "12px",
                                                borderTop:
                                                    "1px solid #e5e7eb"
                                            }}
                                        >
                                            {new Date(
                                                record.assigned_at
                                            ).toLocaleString()}
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

export default ParcelHistory;