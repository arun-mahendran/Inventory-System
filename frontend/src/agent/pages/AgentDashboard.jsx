import { useEffect, useState } from "react";

import api from "../../api/axios";

import AgentLayout from "../components/AgentLayout";

import AgentStatCard from "../components/AgentStatCard";

import PendingDeliveries from "../components/PendingDeliveries";

import { useNavigate } from "react-router-dom";

import "../../styles/agent-dashboard.css";

import RecentActivities from "../components/RecentActivities";

import {
  //FiTruck,
  //FiZap,
  //FiActivity,
  //FiPackage,
  //FiSearch,
  //FiClock,
  FiTrendingUp,
} from "react-icons/fi";

import {
  MdOutlineAssignment,
  MdOutlineLocalShipping,
  MdOutlineDoneAll,
  MdOutlineCancel,
} from "react-icons/md";

function AgentDashboard() {
  const navigate = useNavigate();

  const fullName = localStorage.getItem("full_name");

  const [currentTime, setCurrentTime] = useState(new Date());

  const [summary, setSummary] = useState({
    assigned: 0,
    outForDelivery: 0,
    delivered: 0,
    failed: 0,
  });

  const [parcels, setParcels] = useState([]);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const agentId = localStorage.getItem("delivery_agent_id");

        const response = await api.get(`/delivery-agents/${agentId}/parcels`);

        const parcelData = response.data;

        setParcels(parcelData);

        const today = new Date().toDateString();

        setSummary({
          assigned: parcelData.filter((parcel) => parcel.status === "Assigned")
            .length,

          outForDelivery: parcelData.filter(
            (parcel) => parcel.status === "OutForDelivery",
          ).length,

          delivered: parcelData.filter(
            (parcel) =>
              parcel.status === "Delivered" &&
              parcel.delivered_at &&
              new Date(parcel.delivered_at).toDateString() === today,
          ).length,

          failed: parcelData.filter(
            (parcel) =>
              parcel.status === "FailedDelivery" &&
              parcel.failed_at &&
              new Date(parcel.failed_at).toDateString() === today,
          ).length,
        });
      } catch (error) {
        console.error("Agent Dashboard Error:", error);
      }
    };

    fetchSummary();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const totalCompleted = summary.delivered + summary.failed;

  const successRate =
    totalCompleted > 0
      ? Math.round((summary.delivered / totalCompleted) * 100)
      : 0;

  return (
    <AgentLayout>
      <div className="agent-hero">
        <div className="hero-decoration">
          <span className="circle c1"></span>

          <span className="circle c2"></span>

          <span className="circle c3"></span>
        </div>

        <div className="hero-left">
          <div className="hero-status">
            <span className="status-dot"></span>
            ON DUTY
          </div>

          <h1>Welcome back, {fullName}</h1>

          <p>Here's your delivery run for today.</p>
        </div>

        <div className="hero-right">
          <div className="hero-time">
            <h2>
              {currentTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </h2>

            <p>
              {currentTime.toLocaleDateString([], {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>

      <div className="agent-cards">
        <AgentStatCard
          title="Assigned Parcels"
          value={summary.assigned}
          color="#2563eb"
          icon={<MdOutlineAssignment size={28} />}
        />

        <AgentStatCard
          title="Out For Delivery"
          value={summary.outForDelivery}
          color="#f59e0b"
          icon={<MdOutlineLocalShipping size={28} />}
        />

        <AgentStatCard
          title="Delivered Today"
          value={summary.delivered}
          color="#22c55e"
          icon={<MdOutlineDoneAll size={28} />}
        />

        <AgentStatCard
          title="Failed Deliveries"
          value={summary.failed}
          color="#ef4444"
          icon={<MdOutlineCancel size={28} />}
        />
      </div>

      <div
        style={{
          marginTop: "35px",
          background: "white",
          padding: "30px",
          borderRadius: "20px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "15px",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "16px",
              background: "#eff6ff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FiTrendingUp size={32} color="#2563eb" />
          </div>

          <h2
            style={{
              margin: 0,
              fontSize: "34px",
              color: "#0f172a",
            }}
          >
            Today's Performance
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: "20px",
          }}
        >
          <div>
            <h3
              style={{
                color: "#64748b",
                fontSize: "15px",
                marginBottom: "10px",
              }}
            >
              Success Rate
            </h3>

            <p
              style={{
                fontSize: "32px",
                fontWeight: "700",
                color: "#22c55e",
              }}
            >
              {successRate}%
            </p>
          </div>

          <div>
            <h3
              style={{
                color: "#64748b",
                fontSize: "15px",
                marginBottom: "10px",
              }}
            >
              Delivered Today
            </h3>

            <p
              style={{
                fontSize: "32px",
                fontWeight: "700",
                color: "#2563eb",
              }}
            >
              {summary.delivered}
            </p>
          </div>

          <div>
            <h3
              style={{
                color: "#64748b",
                fontSize: "15px",
                marginBottom: "10px",
              }}
            >
              Failed Today
            </h3>

            <p
              style={{
                fontSize: "32px",
                fontWeight: "700",
                color: "#ef4444",
              }}
            >
              {summary.failed}
            </p>
          </div>

          <div>
            <h3
              style={{
                color: "#64748b",
                fontSize: "15px",
                marginBottom: "10px",
              }}
            >
              Total Completed
            </h3>

            <p
              style={{
                fontSize: "32px",
                fontWeight: "700",
                color: "#0f172a",
              }}
            >
              {totalCompleted}
            </p>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.3fr 1fr",
          gap: "25px",
          marginTop: "35px",
        }}
      >
        {/* LEFT SIDE */}

        <PendingDeliveries parcels={parcels} />

        {/* RIGHT SIDE */}

        <RecentActivities parcels={parcels} />
      </div>
    </AgentLayout>
  );
}

export default AgentDashboard;
