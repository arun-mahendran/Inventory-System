import { NavLink } from "react-router-dom";

import "../styles/sidebar.css";

function Sidebar() {
    return (

        <div
            className="sidebar"
            style={{
                position: "fixed",
                left: 0,
                top: "70px",
                width: "300px",
                height: "calc(100vh - 70px)",
                overflowY: "auto",
                zIndex: 1000
            }}
        >

            <h2 className="sidebar-title">
                Menu
            </h2>

            <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                    isActive
                        ? "sidebar-link active-link"
                        : "sidebar-link"
                }
            >
                📊 Dashboard
            </NavLink>

            <NavLink
                to="/customers"
                className={({ isActive }) =>
                    isActive
                        ? "sidebar-link active-link"
                        : "sidebar-link"
                }
            >
                👥 Customers
            </NavLink>

            <NavLink
                to="/delivery-agents"
                className={({ isActive }) =>
                    isActive
                        ? "sidebar-link active-link"
                        : "sidebar-link"
                }
            >
                🚚 Agents
            </NavLink>

            <NavLink
                to="/parcels"
                className={({ isActive }) =>
                    isActive
                        ? "sidebar-link active-link"
                        : "sidebar-link"
                }
            >
                📦 Parcels
            </NavLink>

            <NavLink
                to="/tracking"
                className={({ isActive }) =>
                    isActive
                        ? "sidebar-link active-link"
                        : "sidebar-link"
                }
            >
                🔍 Tracking
            </NavLink>

        </div>

    );
}

export default Sidebar;