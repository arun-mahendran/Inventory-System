import { useEffect, useState } from "react";

import MainLayout from "../components/MainLayout";

import api from "../../api/axios";

import "../../styles/analytics.css";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";

import {
    FiPackage,
    FiCheckCircle,
    FiAlertCircle,
    FiMapPin
} from "react-icons/fi";

function Analytics() {

    const [topZones, setTopZones] =
        useState([]);

    const [stats, setStats] = useState({
        totalParcels: 0,
        delivered: 0,
        failed: 0,
        activeZones: 0
    });

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

    const fetchSummary = async () => {

        try {

            const response =
                await api.get(
                    "/analytics/summary"
                );

            setStats(
                response.data
            );

        }

        catch (error) {

            console.log(error);

        }

    };

    useEffect(() => {

        fetchSummary();
        fetchTopZones();

    }, []);

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
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit,minmax(220px,1fr))",
                        gap: "25px",
                        marginBottom: "30px"
                    }}
                >

                    <div className="analytics-card">
                        <FiPackage size={30} />
                        <h3>Total Parcels</h3>
                        <h1>{stats.totalParcels}</h1>
                    </div>

                    <div className="analytics-card">
                        <FiCheckCircle size={30} />
                        <h3>Delivered</h3>
                        <h1>{stats.delivered}</h1>
                    </div>

                    <div className="analytics-card">
                        <FiAlertCircle size={30} />
                        <h3>Failed</h3>
                        <h1>{stats.failed}</h1>
                    </div>

                    <div className="analytics-card">
                        <FiMapPin size={30} />
                        <h3>Active Zones</h3>
                        <h1>{stats.activeZones}</h1>
                    </div>

                </div>

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