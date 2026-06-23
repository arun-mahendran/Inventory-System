import { useEffect, useState } from "react";

import api from "../../api/axios";

import AgentLayout
    from "../components/AgentLayout";

function AgentDeliveryHistory() {

    const [history, setHistory] =
        useState([]);

    useEffect(() => {

        const fetchHistory = async () => {

            try {

                const agentId =
                    localStorage.getItem(
                        "user_id"
                    );

                const response =
                    await api.get(
                        `/delivery-agents/${agentId}/parcels`
                    );

                const completedParcels =
                    response.data.filter(
                        parcel =>
                            parcel.status ===
                            "Delivered"
                            ||
                            parcel.status ===
                            "FailedDelivery"
                    );

                setHistory(
                    completedParcels
                );

            } catch (error) {

                console.log(error);

            }

        };

        fetchHistory();

    }, []);


    return (

        <AgentLayout>

            <div
                style={{
                    marginBottom: "25px"
                }}
            >
                <h1>
                    📜 Delivery History
                </h1>

                <p
                    style={{
                        color: "#64748b"
                    }}
                >
                    View all completed deliveries.
                </p>
            </div>

            <div
                className="table-container"
            >

                <table
                    className="data-table"
                >

                    <thead>

                        <tr>

                            <th>
                                Tracking No
                            </th>

                            <th>
                                Customer ID
                            </th>

                            <th>
                                Status
                            </th>

                            <th>
                                Completed At
                            </th>

                            <th>
                                Failure Reason
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {
                            history.map(
                                parcel => (

                                    <tr
                                        key={
                                            parcel.id
                                        }
                                    >

                                        <td>
                                            {
                                                parcel.tracking_number
                                            }
                                        </td>

                                        <td>
                                            {
                                                parcel.customer_id
                                            }
                                        </td>

                                        <td>

                                            {
                                                parcel.status
                                            }

                                        </td>

                                        <td>

                                            {
                                                parcel.delivered_at
                                                    ?

                                                    new Date(
                                                        parcel.delivered_at
                                                    ).toLocaleDateString()

                                                    :

                                                    parcel.failed_at

                                                        ?

                                                        new Date(
                                                            parcel.failed_at
                                                        ).toLocaleDateString()

                                                        :

                                                        "-"
                                            }

                                        </td>

                                        <td>

                                            {
                                                parcel.failure_reason
                                                    || "-"
                                            }

                                        </td>

                                    </tr>

                                )
                            )
                        }

                    </tbody>

                </table>

            </div>

        </AgentLayout>

    );

}

export default AgentDeliveryHistory;