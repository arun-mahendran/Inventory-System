import { useEffect, useState } from "react";

import api from "../../api/axios";

import AgentLayout from "../components/AgentLayout";

import AgentStatCard from "../components/AgentStatCard";

import PendingDeliveries from "../components/PendingDeliveries";

import { useNavigate } from "react-router-dom";

import "../../styles/agent-dashboard.css";

import RecentActivities from "../components/RecentActivities";

import deliveryRoute from "../../assets/delivery-route.png";

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

      <div className="performance-card">

  <div className="performance-content">

    {/* LEFT SIDE */}

    <div className="performance-left">

      <div className="performance-header">

        <div className="performance-title">

          <div className="performance-icon">
            <FiTrendingUp size={24} color="#2563eb" />
          </div>

          <div>
            <h2>Today's Performance</h2>
          </div>

        </div>

      </div>

      <div className="performance-grid">

        <div className="performance-stat">

          <h4>Success Rate</h4>

          <h2 className="green">
            {successRate}%
          </h2>

          <span className="performance-badge success">
            Success Today
          </span>

        </div>

        <div className="performance-divider"></div>

        <div className="performance-stat">

          <h4>Delivered Today</h4>

          <h2 className="blue">
            {summary.delivered}
          </h2>

          <span className="performance-badge delivered">
            Completed
          </span>

        </div>

        <div className="performance-divider"></div>

        <div className="performance-stat">

          <h4>Failed Today</h4>

          <h2 className="red">
            {summary.failed}
          </h2>

          <span className="performance-badge failed">
            Failed Attempts
          </span>

        </div>

        <div className="performance-divider"></div>

        <div className="performance-stat">

          <h4>Total Completed</h4>

          <h2 className="dark">
            {totalCompleted}
          </h2>

          <span className="performance-badge total">
            Overall Today
          </span>

        </div>

      </div>

    </div>

    {/* RIGHT SIDE */}

    <div className="performance-right">

      <img
        src={deliveryRoute}
        alt="Delivery Route"
        className="performance-image"
      />

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
