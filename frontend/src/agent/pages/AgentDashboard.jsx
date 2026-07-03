import { useEffect, useState } from "react";

import api from "../../api/axios";

import AgentLayout from "../components/AgentLayout";

import AgentStatCard from "../components/AgentStatCard";

import { useNavigate } from "react-router-dom";

import { FaTruck } from "react-icons/fa";

import "../../styles/agent-dashboard.css";

import {
  FiTruck,
  //FiZap,
  FiActivity,
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

  const [showAllPending, setShowAllPending] = useState(false);

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

          <div className="hero-road">
            <svg width="420" height="170" viewBox="0 0 420 170">
              <path
                d="
          M20 125
          C90 145
          170 55
          250 72

          C300 82
          340 95
          375 82

          C392 74
          405 52
          405 18
          "
                fill="none"
                stroke="#ff7a1a"
                strokeWidth="4"
                strokeDasharray="8 8"
                strokeLinecap="round"
              />

              <circle cx="15" cy="125" r="6" fill="white" />

              <circle cx="405" cy="20" r="8" fill="#ff7a1a" />
            </svg>

            <div className="truck">
              <FaTruck size={58} color="white" />
            </div>

            <div className="city">
              <div className="building b1"></div>

              <div className="building b2"></div>

              <div className="building b3"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="cards">
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

        <div
          style={{
            background: "white",
            padding: "30px",
            borderRadius: "24px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "25px",
            }}
          >
            <FiTruck size={34} color="#2563eb" />

            <h2
              style={{
                margin: 0,
                fontSize: "34px",
              }}
            >
              Pending Deliveries
            </h2>
          </div>

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    textAlign: "left",
                    padding: "16px",
                    color: "#64748b",
                  }}
                >
                  Tracking Number
                </th>

                <th
                  style={{
                    textAlign: "left",
                    padding: "16px",
                    color: "#64748b",
                  }}
                >
                  Customer ID
                </th>

                <th
                  style={{
                    textAlign: "left",
                    padding: "16px",
                    color: "#64748b",
                  }}
                >
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {parcels
                .filter(
                  (parcel) =>
                    parcel.status === "Assigned" ||
                    parcel.status === "OutForDelivery",
                )
                .slice(0, showAllPending ? parcels.length : 5)

                .map((parcel) => (
                  <tr key={parcel.id}>
                    <td
                      style={{
                        padding: "18px 16px",
                        borderTop: "1px solid #e2e8f0",
                      }}
                    >
                      {parcel.tracking_number}
                    </td>

                    <td
                      style={{
                        padding: "18px 16px",
                        borderTop: "1px solid #e2e8f0",
                      }}
                    >
                      {parcel.customer_id}
                    </td>

                    <td
                      style={{
                        padding: "18px 16px",
                        borderTop: "1px solid #e2e8f0",
                      }}
                    >
                      <span
                        style={{
                          padding: "8px 14px",
                          borderRadius: "10px",

                          background:
                            parcel.status === "Assigned"
                              ? "#dbeafe"
                              : "#fef3c7",

                          color:
                            parcel.status === "Assigned"
                              ? "#2563eb"
                              : "#d97706",
                        }}
                      >
                        {parcel.status}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          {parcels.filter(
            (parcel) =>
              parcel.status === "Assigned" ||
              parcel.status === "OutForDelivery",
          ).length > 5 && (
            <div
              style={{
                textAlign: "center",
                marginTop: "20px",
              }}
            >
              <button
                onClick={() => setShowAllPending(!showAllPending)}
                style={{
                  border: "none",
                  background: "#2563eb",
                  color: "white",
                  padding: "12px 24px",
                  borderRadius: "12px",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                {showAllPending ? "View Less" : "View More"}
              </button>
            </div>
          )}
        </div>

        {/* RIGHT SIDE */}

        <div>
          {/* RECENT ACTIVITIES */}

          <div
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "24px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
              height: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "20px",
              }}
            >
              <FiActivity size={30} color="#22c55e" />

              <h2
                style={{
                  margin: 0,
                  fontSize: "30px",
                }}
              >
                Recent Activities
              </h2>
            </div>

            {parcels.slice(0, 5).map((parcel) => (
              <div
                key={parcel.id}
                style={{
                  padding: "16px 0",
                  borderBottom: "1px solid #e2e8f0",
                }}
              >
                {parcel.status === "Delivered"
                  ? `✅ ${parcel.tracking_number} delivered successfully`
                  : parcel.status === "FailedDelivery"
                    ? `❌ ${parcel.tracking_number} delivery failed`
                    : `🚚 ${parcel.tracking_number} currently ${parcel.status}`}
              </div>
            ))}
          </div>
        </div>
      </div>
    </AgentLayout>
  );
}

export default AgentDashboard;
