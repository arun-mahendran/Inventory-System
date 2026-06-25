import { HiOutlineMenuAlt2 } from "react-icons/hi";

import { FiLogOut, FiBell } from "react-icons/fi";

import { useNavigate } from "react-router-dom";

import { useState, useEffect } from "react";

import api from "../../api/axios";

function AgentNavbar({ sidebarOpen, setSidebarOpen }) {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);

  const [showNotifications, setShowNotifications] = useState(false);

  const fetchNotifications = async () => {
    try {
      const agentId = localStorage.getItem("delivery_agent_id");

      const response = await api.get(`/notifications/${agentId}`);

      setNotifications(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const handleClickOutside = () => {
      setShowNotifications(false);
    };

    if (showNotifications) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [showNotifications]);

  useEffect(() => {

    fetchNotifications();

    const interval = setInterval(() => {

        fetchNotifications();

    }, 10000); // every 10 seconds

    return () => clearInterval(interval);

}, []);

  return (
    <div className="navbar">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{
            border: "none",
            background: "#0f172a",
            color: "white",
            width: "45px",
            height: "45px",
            borderRadius: "12px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = "scale(1.08)")
          }
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <HiOutlineMenuAlt2 size={28} />
        </button>

        <div className="navbar-title">Delivery Agent Portal</div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "15px",
          position: "relative",
        }}
      >
        {/* Notification Bell */}

        <button
          onClick={async (e) => {

            e.stopPropagation();

            if (!showNotifications) {

                const agentId =
                    localStorage.getItem(
                        "delivery_agent_id"
                    );

                try {

                    await api.put(
                        `/notifications/${agentId}/read`
                    );

                    fetchNotifications();

                }

                catch (error) {

                    console.log(error);

                }

            }

            setShowNotifications(
                !showNotifications
            );

        }}
          style={{
            border: "none",

            background: "white",

            width: "50px",
            height: "50px",

            borderRadius: "50%",

            cursor: "pointer",

            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            position: "relative",

            boxShadow: "0 5px 15px rgba(0,0,0,0.08)",

            transition: "all 0.3s ease"
          }}

          onMouseEnter={(e) => {

            e.currentTarget.style.transform =
                "scale(1.08)";

            }}

            onMouseLeave={(e) => {

            e.currentTarget.style.transform =
                "scale(1)";

            }}
        >
            
          <FiBell size={22} />

          {notifications.filter((n) => !n.is_read).length > 0 && (
            <span
              style={{
                position: "absolute",

                top: "4px",
                right: "4px",

                width: "20px",
                height: "20px",

                borderRadius: "50%",

                background: "#ef4444",

                color: "white",

                fontSize: "12px",

                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {notifications.filter((n) => !n.is_read).length}
            </span>
          )}
        </button>

        {/* Notification Dropdown */}

        {showNotifications && (
        <>
            {/* Blur Overlay */}

            <div
            style={{
                position: "fixed",

                top: 0,
                left: 0,

                width: "100vw",
                height: "100vh",

                backdropFilter: "blur(6px)",

                background:
                "rgba(15,23,42,0.08)",

                zIndex: 998,
            }}
            />

            {/* Dropdown */}

            <div
            onClick={(e) =>
                e.stopPropagation()
            }

            style={{
                position: "absolute",

                top: "60px",
                right: "70px",

                width: "340px",

                background:
                "rgba(255,255,255,0.92)",

                backdropFilter:
                "blur(20px)",

                border:
                "1px solid rgba(255,255,255,0.3)",

                borderRadius: "22px",

                padding: "22px",

                boxShadow:
                "0 20px 40px rgba(0,0,0,0.12)",

                zIndex: 999,
            }}
            >
            <h3
                style={{
                marginBottom: "18px",

                fontSize: "20px",

                color: "#0f172a",
                }}
            >
                🔔 Notifications
            </h3>

            {notifications.length === 0 ? (

                <div
                style={{
                    textAlign: "center",

                    padding: "25px",

                    color: "#64748b",
                }}
                >
                No Notifications
                </div>

            ) : (

                notifications.map(
                (notification) => (

                    <div
                    key={notification.id}

                    style={{
                        padding: "14px",

                        marginBottom: "12px",

                        borderRadius: "14px",

                        background:
                        "rgba(248,250,252,0.8)",

                        border:
                        "1px solid #e2e8f0",

                        transition:
                        "all 0.3s ease",
                    }}
                    >
                    <div
                        style={{
                        fontSize: "14px",

                        color: "#334155",

                        lineHeight: "1.7",

                        fontWeight: "500",
                        }}
                    >
                        🔔 {notification.message}
                    </div>

                    <p
                        style={{
                        fontSize: "12px",

                        color: "#94a3b8",

                        marginTop: "8px",

                        marginBottom: 0,
                        }}
                    >
                        {new Date(
                        notification.created_at
                        ).toLocaleString()}
                    </p>
                    </div>
                )
                )

            )}
            </div>
        </>
        )}

        {/* Logout Button */}

        <button
          onClick={() => {
            localStorage.clear();

            navigate("/login");
          }}
          style={{
            border: "none",

            background: "#0f172a",

            color: "white",

            padding: "10px 16px",

            borderRadius: "12px",

            cursor: "pointer",

            display: "flex",
            alignItems: "center",
            gap: "8px",

            fontWeight: "600",

            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#ef4444";

            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#0f172a";

            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <FiLogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
}

export default AgentNavbar;
