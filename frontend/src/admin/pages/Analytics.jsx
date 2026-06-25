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
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
  Area,
} from "recharts";

import {
  FiPackage,
  FiCheckCircle,
  FiAlertCircle,
  FiMapPin,
} from "react-icons/fi";

import {
  FiTrendingUp,
  FiPieChart,
  FiStar,
} from "react-icons/fi";

import {
  MdOutlineAnalytics
} from "react-icons/md";


function Analytics() {
  const [topZones, setTopZones] = useState([]);

  const [trendData, setTrendData] =
    useState([]);

  const [stats, setStats] = useState({
    totalParcels: 0,
    delivered: 0,
    failed: 0,
    activeZones: 0,
  });

  const pieData = [
    {
      name: "Delivered",
      value: stats.delivered,
    },
    {
      name: "Failed",
      value: stats.failed,
    },
    {
      name: "Pending",
      value: stats.totalParcels - stats.delivered - stats.failed,
    },
  ];

  const COLORS = ["#22c55e", "#ef4444", "#f59e0b"];

  const fetchTopZones = async () => {
    try {
      const response = await api.get("/analytics/top-zones");

      setTopZones(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const [insights, setInsights] = useState({
    success_rate: 0,
    top_zone: "",
    failure_reason: "",
    pending: 0,
  });

  const fetchSummary = async () => {
    try {
      const response = await api.get("/analytics/summary");

      setStats(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchInsights = async () => {
    try {
      const response = await api.get("/analytics/insights");

      setInsights(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchTrend = async () => {

    try {

        const response =
            await api.get(
                "/analytics/delivery-trend"
            );

        setTrendData(
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
    fetchInsights();
    fetchTrend();
  }, []);

  return (
    <MainLayout>
      <div>
        <div
          style={{
            marginBottom: "35px",
          }}
        >
          <div
  style={{
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "10px",
  }}
>
  <MdOutlineAnalytics
    size={42}
    color="#2563eb"
  />

  <h1
    style={{
      fontSize: "42px",
      fontWeight: "700",
      color: "#0f172a",
      margin: 0,
    }}
  >
    Delivery Analytics
  </h1>
</div>

          <p
            style={{
              color: "#64748b",
              fontSize: "18px",
            }}
          >
            Monitor delivery performance, operational efficiency and business
            insights.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: "25px",
            marginBottom: "30px",
          }}
        >
          <div className="analytics-card">
            <div
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "18px",
                background: "#dbeafe",

                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FiPackage size={30} color="#2563eb" />
            </div>

            <h3
              style={{
                color: "#64748b",
                fontSize: "14px",
                fontWeight: "600",
                margin: 0,
              }}
            >
              Total Parcels
            </h3>

            <h1
              style={{
                fontSize: "34px",
                fontWeight: "700",
                color: "#0f172a",
                margin: 0,
              }}
            >
              {stats.totalParcels}
            </h1>
          </div>

          <div className="analytics-card">
            <div
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "18px",
                background: "#dcfce7",

                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FiCheckCircle size={30} color="#16a34a" />
            </div>

            <h3
              style={{
                color: "#64748b",
                fontSize: "14px",
                fontWeight: "600",
                margin: 0,
              }}
            >
              Delivered
            </h3>

            <h1
              style={{
                fontSize: "34px",
                fontWeight: "700",
                color: "#0f172a",
                margin: 0,
              }}
            >
              {stats.delivered}
            </h1>
          </div>

          <div className="analytics-card">
            <div
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "18px",
                background: "#fee2e2",

                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FiAlertCircle size={30} color="#dc2626" />
            </div>

            <h3
              style={{
                color: "#64748b",
                fontSize: "14px",
                fontWeight: "600",
                margin: 0,
              }}
            >
              Failed
            </h3>

            <h1
              style={{
                fontSize: "34px",
                fontWeight: "700",
                color: "#0f172a",
                margin: 0,
              }}
            >
              {stats.failed}
            </h1>
          </div>

          <div className="analytics-card">
            <div
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "18px",
                background: "#fef3c7",

                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FiMapPin size={30} color="#d97706" />
            </div>


            <h3
              style={{
                color: "#64748b",
                fontSize: "14px",
                fontWeight: "600",
                margin: 0,
              }}
            >
              Active Zones
            </h3>

            <h1
              style={{
                fontSize: "34px",
                fontWeight: "700",
                color: "#0f172a",
                margin: 0,
              }}
            >
              {stats.activeZones}
            </h1>
          </div>
        </div>

        <div
  style={{
    background: "white",
    padding: "35px",
    borderRadius: "28px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 15px 35px rgba(0,0,0,0.06)",
    marginBottom: "30px",
  }}
>
  <div
  style={{
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "15px",
  }}
>
  <FiTrendingUp
    size={26}
    color="#2563eb"
  />

  <h2 style={{ margin: 0 }}>
    Delivery Trend (Last 7 Days)
  </h2>
</div>

  <p
    style={{
      color: "#64748b",
      marginTop: "10px",
      marginBottom: "20px",
    }}
  >
    Daily parcel volume over the past week.
  </p>

  <ResponsiveContainer width="100%" height={350}>
    <LineChart data={trendData}>

        <defs>
  <linearGradient
    id="trendGradient"
    x1="0"
    y1="0"
    x2="0"
    y2="1"
  >
    <stop
      offset="5%"
      stopColor="#2563eb"
      stopOpacity={0.3}
    />

    <stop
      offset="95%"
      stopColor="#2563eb"
      stopOpacity={0}
    />
  </linearGradient>
</defs>

      <CartesianGrid
        stroke="#e2e8f0"
        vertical={false}
      />

      <XAxis
        dataKey="date"
        axisLine={false}
        tickLine={false}
      />

      <YAxis
        axisLine={false}
        tickLine={false}
      />

      <Area
  type="monotone"
  dataKey="parcels"
  stroke="none"
  fill="url(#trendGradient)"
/>

      <Tooltip
  formatter={(value) => `${value} Parcels`}
  labelFormatter={(label) => `Date: ${label}`}

  content={({ active, payload, label }) => {

    if (active && payload && payload.length) {

      return (
        <div
          style={{
            background: "white",
            padding: "12px",
            borderRadius: "12px",
            boxShadow:
              "0 10px 25px rgba(0,0,0,0.12)"
          }}
        >
          <p
            style={{
              margin: 0,
              fontWeight: "600"
            }}
          >
            Date: {label}
          </p>

          <p
            style={{
              marginTop: "8px",
              color: "#2563eb"
            }}
          >
            Delivered: {payload[0].value} Parcels
          </p>
        </div>
      );
    }

    return null;
  }}
/>

      <Line
  type="monotone"
  dataKey="parcels"
  stroke="#2563eb"
  strokeWidth={5}
  dot={{
    r: 7,
    strokeWidth: 3,
    fill: "white"
  }}
  activeDot={{
    r: 9
  }}
/>
    </LineChart>
  </ResponsiveContainer>
</div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "25px",
            marginTop: "30px",
          }}
        >

        
          {/* Top Delivery Zones */}

          <div
            style={{
              background: "white",
              padding: "35px",
              borderRadius: "28px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 15px 35px rgba(0,0,0,0.06)",
            }}
          >
            <div
  style={{
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "25px",
  }}
>
  <FiMapPin
    size={24}
    color="#d97706"
  />

  <h2 style={{ margin: 0 }}>
    Top Delivery Zones
  </h2>
</div>

            <p
              style={{
                color: "#64748b",
                marginBottom: "25px",
              }}
            >
              Displays the most active delivery locations based on parcel
              volume.
            </p>

            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={topZones}>
                <defs>
                  <linearGradient
                    id="colorGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#3b82f6" />

                    <stop offset="100%" stopColor="#1d4ed8" />
                  </linearGradient>
                </defs>

                <CartesianGrid stroke="#e2e8f0" vertical={false} />

                <XAxis
                  dataKey="pincode"
                  tick={{
                    fill: "#64748b",
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  tick={{
                    fill: "#64748b",
                    fontSize: 13,
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  cursor={{
                    fill: "rgba(37,99,235,0.08)",
                  }}
                  contentStyle={{
                    borderRadius: "16px",
                    border: "none",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
                  }}
                />

                <Bar
                  dataKey="parcels"
                  fill="url(#colorGradient)"
                  radius={[12, 12, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Delivery Status */}

          <div
            style={{
              background: "white",
              padding: "35px",
              borderRadius: "28px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 15px 35px rgba(0,0,0,0.06)",
            }}
          >
            <div
  style={{
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "15px",
  }}
>
  <FiPieChart
    size={24}
    color="#22c55e"
  />

  <h2 style={{ margin: 0 }}>
    Delivery Status
  </h2>
</div>

            <p
              style={{
                color: "#64748b",
                marginTop: "10px",
                marginBottom: "20px",
              }}
            >
              Distribution of parcel delivery statuses.
            </p>

            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>

                <Tooltip />

                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Insights */}

        <div
          style={{
            background: "linear-gradient(135deg,#1e293b,#0f172a)",

            color: "white",

            padding: "35px",

            borderRadius: "28px",

            marginTop: "30px",

            boxShadow: "0 20px 40px rgba(15,23,42,0.3)",
          }}
        >
          <div
  style={{
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "15px",
  }}
>
  <FiStar
    size={24}
    color="#facc15"
  />

  <h2 style={{ margin: 0 }}>
    AI Business Insights
  </h2>
</div>

          <ul
  style={{
    marginTop: "30px",
    paddingLeft: "28px",
    lineHeight: "2.5",
    fontSize: "18px",
  }}
>
            <li>
  Delivery success rate is{" "}
  {insights.success_rate}%.
</li>

<li>
  {insights.top_zone}{" "}
  is the most active delivery zone.
</li>

<li>
  {insights.failure_reason}{" "}
  is the major failure reason.
</li>

<li>
  {insights.pending}{" "}
  parcels require immediate attention.
</li>
          </ul>
        </div>
      </div>
    </MainLayout>
  );
}

export default Analytics;
