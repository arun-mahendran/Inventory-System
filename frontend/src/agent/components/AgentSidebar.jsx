import { NavLink } from "react-router-dom";
import { FiHome, FiPackage, FiMapPin, FiClock } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";
import "../../styles/sidebar.css";
import { useNavigate } from "react-router-dom";
import { useAgentProfile } from "../../context/AgentProfileContext";

const NAV_ITEMS = [
  { to: "/agent-dashboard", label: "Dashboard", icon: FiHome },
  { to: "/my-parcels", label: "My Parcels", icon: FiPackage },
  { to: "/agent-tracking", label: "Tracking", icon: FiMapPin },
  { to: "/delivery-history", label: "History", icon: FiClock },
];

function AgentSidebar({ sidebarOpen }) {

  const navigate = useNavigate();
  const { photo } = useAgentProfile();

  return (
    <div
      className={"sidebar" + (sidebarOpen ? "" : " is-collapsed")}
      style={{ width: sidebarOpen ? "280px" : "90px" }}
    >
      <div
        className="sidebar-profile"
        onClick={() => navigate("/profile")}
      >
        <div className="sidebar-avatar">
          {photo ? (
            <img
              src={photo}
              alt="Profile"
              style={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                objectFit: "cover",
                display: "block"
              }}
            />
          ) : (
            <FaUserCircle size={30} />
          )}
        </div>

        {sidebarOpen && (
          <>
            <h3>Agent</h3>
            <p>Delivery Agent</p>
          </>
        )}
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              isActive ? "sidebar-link active-link" : "sidebar-link"
            }
          >
            <Icon size={20} />
            {sidebarOpen && label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

export default AgentSidebar;