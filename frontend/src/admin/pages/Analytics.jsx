import { useEffect, useState } from "react";

import MainLayout from "../components/MainLayout";

import api from "../../api/axios";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";

function Analytics() {

    const [topZones, setTopZones] =
        useState([]);

    useEffect(() => {

        fetchTopZones();

    }, []);

    const fetchTopZones = async () => {

        try {

            const response =
                await api.get(
                    "/analytics/top-zones"
                );

            setTopZones(
                response.data
            );

        }

        catch (error) {

            console.log(error);

        }

    };

    return (

        <MainLayout>

            <div>

                <h1
                    style={{
                        marginBottom: "30px"
                    }}
                >
                    📊 Analytics Dashboard
                </h1>

                <div
                    style={{
                        background: "white",

                        padding: "30px",

                        borderRadius: "20px",

                        boxShadow:
                            "0 10px 25px rgba(0,0,0,0.08)"
                    }}
                >

                    <h2
                        style={{
                            marginBottom: "25px"
                        }}
                    >
                        📍 Top Delivery Zones
                    </h2>

                    <ResponsiveContainer
                        width="100%"
                        height={400}
                    >

                        <BarChart
                            data={topZones}
                        >

                            <CartesianGrid
                                strokeDasharray="3 3"
                            />

                            <XAxis
                                dataKey="pincode"
                            />

                            <YAxis />

                            <Tooltip />

                            <Bar
                                dataKey="parcels"
                                radius={[
                                    8,
                                    8,
                                    0,
                                    0
                                ]}
                            />

                        </BarChart>

                    </ResponsiveContainer>

                </div>

            </div>

        </MainLayout>

    );

}

export default Analytics;