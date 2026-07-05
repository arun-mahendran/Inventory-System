import { useState, useEffect } from "react";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { FiLogOut, FiBell, FiPackage } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import "../../styles/navbar.css";

function AgentNavbar({ sidebarOpen, setSidebarOpen }) {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const fetchNotifications = async () => {
    const agentId = localStorage.getItem("delivery_agent_id");

    if (!agentId || agentId === "null") {
      return;
    }

    try {
      const response = await api.get(`/notifications/${agentId}`);
      setNotifications(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const handleClickOutside = () => setShowNotifications(false);

    if (showNotifications) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => document.removeEventListener("click", handleClickOutside);
  }, [showNotifications]);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000); // every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const handleBellClick = async (e) => {
    e.stopPropagation();

    if (!showNotifications) {
      const agentId = localStorage.getItem("delivery_agent_id");

      try {
        await api.put(`/notifications/${agentId}/read`);
        fetchNotifications();
      } catch (error) {
        console.log(error);
      }
    }

    setShowNotifications(!showNotifications);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="navbar">
      <div className="navbar-left">
        <button
          className="navbar-toggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          <HiOutlineMenuAlt2 size={24} />
        </button>

        <div className="navbar-title navbar-title--brand">
          <FiPackage className="navbar-brand-icon" />
          <span>
            FINAL MILE <span className="navbar-brand-accent">HUB</span>
          </span>
        </div>
      </div>

      <div className="navbar-right">
        <button
          className="navbar-icon-btn"
          onClick={handleBellClick}
          aria-label="Notifications"
        >
          <FiBell size={20} />
          {unreadCount > 0 && (
            <span className="navbar-badge">{unreadCount}</span>
          )}
        </button>

        {showNotifications && (
          <>
            <div className="navbar-overlay" />

            <div
              className="navbar-dropdown"
              onClick={(e) => e.stopPropagation()}
            >
              <h3>
                <FiBell size={16} />
                Notifications
              </h3>

              {notifications.length === 0 ? (
                <div className="navbar-dropdown-empty">No notifications</div>
              ) : (
                notifications
                  .sort(
                    (a, b) =>
                      new Date(b.created_at) - new Date(a.created_at),
                  )
                  .slice(0, 3)
                  .map((notification) => (
                    <div
                      key={notification.id}
                      className="navbar-dropdown-item"
                    >
                      <div className="navbar-dropdown-message">
                        {notification.message}
                      </div>
                      <p className="navbar-dropdown-time">
                        {new Date(notification.created_at).toLocaleString()}
                      </p>
                    </div>
                  ))
              )}

              {notifications.length > 3 && (
                <p className="navbar-dropdown-footer">
                  Showing latest 3 notifications
                </p>
              )}
            </div>
          </>
        )}

        <button className="navbar-logout" onClick={handleLogout}>
          <FiLogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  );
}

export default AgentNavbar;