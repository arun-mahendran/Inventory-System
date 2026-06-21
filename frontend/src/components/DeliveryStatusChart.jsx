import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer
} from "recharts";

function DeliveryStatusChart({ summary }) {

    const data = [
        {
            name: "Received",
            value: summary.received_parcels
        },
        {
            name: "Assigned",
            value: summary.assigned_parcels
        },
        {
            name: "Out For Delivery",
            value: summary.out_for_delivery_parcels
        },
        {
            name: "Delivered",
            value: summary.delivered_parcels
        },
        {
            name: "Failed",
            value: summary.failed_parcels
        }
    ];

    const COLORS = [
        "#3b82f6",
        "#f59e0b",
        "#8b5cf6",
        "#22c55e",
        "#ef4444"
    ];

    return (

        <div
            style={{
                background: "white",
                padding: "24px",
                borderRadius: "18px",
                marginTop: "30px",
                boxShadow:
                    "0 10px 25px rgba(0,0,0,0.08)"
            }}
        >

            <h2>
                📊 Delivery Analytics
            </h2>

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "30px",
                    marginTop: "20px"
                }}
            >

                <div
                    style={{
                        width: "50%",
                        minWidth: "320px",
                        height: "350px"
                    }}
                >

                    <ResponsiveContainer
                        width="99%"
                        height="100%"
                    >

                        <PieChart>

                            <text
                                x="50%"
                                y="46%"
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fontSize="18"
                                fontWeight="600"
                                fill="#64748b"
                            >
                                Total
                            </text>

                            <text
                                x="50%"
                                y="56%"
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fontSize="38"
                                fontWeight="700"
                                fill="#0f172a"
                            >
                                {summary.total_parcels}
                            </text>

                            <Pie
                                data={data}
                                dataKey="value"
                                nameKey="name"
                                innerRadius={90}
                                outerRadius={130}
                            >

                                {
                                    data.map(
                                        (
                                            entry,
                                            index
                                        ) => (

                                            <Cell
                                                key={index}
                                                fill={
                                                    COLORS[index]
                                                }
                                            />

                                        )
                                    )
                                }

                            </Pie>

                            <Tooltip />

                        </PieChart>

                    </ResponsiveContainer>

                </div>

                <div
                    style={{
                        flex: 1
                    }}
                >

                    {
                        data.map(
                            (
                                item,
                                index
                            ) => {

                                const percentage =
                                    (
                                        item.value /
                                        summary.total_parcels *
                                        100
                                    ).toFixed(1);

                                return (

                                    <div
                                        key={item.name}
                                        style={{
                                            display: "flex",
                                            justifyContent:
                                                "space-between",
                                            alignItems:
                                                "center",
                                            padding: "16px 0",
                                            borderBottom:
                                                "1px solid #e5e7eb"
                                        }}
                                    >

                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems:
                                                    "center",
                                                gap: "10px"
                                            }}
                                        >

                                            <div
                                                style={{
                                                    width: "12px",
                                                    height: "12px",
                                                    borderRadius:
                                                        "50%",
                                                    background:
                                                        COLORS[index]
                                                }}
                                            />

                                            <span
                                                style={{
                                                    fontWeight:
                                                        "600"
                                                }}
                                            >
                                                {item.name}
                                            </span>

                                        </div>

                                        <span
                                            style={{
                                                fontWeight:
                                                    "600"
                                            }}
                                        >
                                            {item.value}
                                            {" "}
                                            (
                                            {percentage}
                                            %)
                                        </span>

                                    </div>

                                );

                            }
                        )
                    }

                </div>

            </div>

        </div>

    );

}

export default DeliveryStatusChart;