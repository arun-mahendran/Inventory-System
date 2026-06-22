import { NavLink } from "react-router-dom";

import {
    FiHome,
    FiPackage,
    FiMapPin,
    FiClock,
    FiUser,
    FiLock,
    FiLogOut
} from "react-icons/fi";

import { FaUserCircle } from "react-icons/fa";

import "../../styles/sidebar.css";


function AgentSidebar({
    sidebarOpen
}) {

    return (

        <div
            className="sidebar"
            style={{
                width:
                    sidebarOpen
                        ? "280px"
                        : "90px"
            }}
        >

            <div
                style={{
                    textAlign: "center",
                    marginBottom: "40px"
                }}
            >

                <FaUserCircle
                    size={55}
                    color="#60a5fa"
                />

                {
                    sidebarOpen && (

                        <>
                            <h3
                                style={{
                                    marginTop: "10px",
                                    marginBottom: "5px"
                                }}
                            >
                                Agent
                            </h3>

                            <p
                                style={{
                                    color: "#94a3b8",
                                    fontSize: "14px"
                                }}
                            >
                                Delivery Agent
                            </p>
                        </>

                    )
                }

            </div>

            <NavLink
                to="/agent-dashboard"
                className={({ isActive }) =>
                    isActive
                        ? "sidebar-link active-link"
                        : "sidebar-link"
                }
            >
                <FiHome size={20} />

                {
                    sidebarOpen &&
                    "Dashboard"
                }

            </NavLink>

            <NavLink
                to="/my-parcels"
                className={({ isActive }) =>
                    isActive
                        ? "sidebar-link active-link"
                        : "sidebar-link"
                }
            >
                <FiPackage size={20} />

                {
                    sidebarOpen &&
                    "My Parcels"
                }

            </NavLink>

            <NavLink
                to="/agent-tracking"
                className={({ isActive }) =>
                    isActive
                        ? "sidebar-link active-link"
                        : "sidebar-link"
                }
            >
                <FiMapPin size={20} />

                {
                    sidebarOpen &&
                    "Tracking"
                }

            </NavLink>

            <NavLink
                to="/delivery-history"
                className={({ isActive }) =>
                    isActive
                        ? "sidebar-link active-link"
                        : "sidebar-link"
                }
            >
                <FiClock size={20} />

                {
                    sidebarOpen &&
                    "History"
                }

            </NavLink>

            <NavLink
                to="/profile"
                className={({ isActive }) =>
                    isActive
                        ? "sidebar-link active-link"
                        : "sidebar-link"
                }
            >
                <FiUser size={20} />

                {
                    sidebarOpen &&
                    "Profile"
                }

            </NavLink>

            <NavLink
                to="/change-password"
                className={({ isActive }) =>
                    isActive
                        ? "sidebar-link active-link"
                        : "sidebar-link"
                }
            >
                <FiLock size={20} />

                {
                    sidebarOpen &&
                    "Change Password"
                }

            </NavLink>

            <NavLink
                to="/login"
                className="sidebar-link"
                onClick={() => {

                    localStorage.clear();

                }}
            >
                <FiLogOut size={20} />

                {
                    sidebarOpen &&
                    "Logout"
                }

            </NavLink>

        </div>

    );

}

export default AgentSidebar;