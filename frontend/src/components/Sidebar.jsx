import { NavLink } from "react-router-dom";

import {
    FiHome,
    FiUsers,
    FiTruck,
    FiPackage,
    FiMapPin,
    FiBarChart2,
    //FiMoon,
    FiSearch,
    FiFileText
} from "react-icons/fi";

import {FaUserCircle} from "react-icons/fa";

import "../styles/sidebar.css";

function Sidebar({
    sidebarOpen
}) {
    return (

        <div
            className="sidebar"
            style={{
                position: "fixed",
                left: 0,
                top: "70px",
                width:
                    sidebarOpen
                    ? "300px"
                    : "90px",

                height: "calc(100vh - 70px)",
                overflowY: "auto",
                overflowX: "hidden",
                zIndex: 1000,
                transition:
                    "all 0.35s ease"
            }}
        >

            <div
                style={{
                    textAlign: "center",
                    marginBottom: "35px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center"
                }}
            >

                <FaUserCircle
                    size={70}
                    color="#60a5fa"

                    style={{
                        marginLeft:
                            sidebarOpen
                                ? "0"
                                : "-8px",

                        transition:
                            "all 0.35s ease"
                    }}
                />

                {sidebarOpen && (

                    <>

                        <h3
                            style={{
                                color: "white",
                                marginTop: "12px"
                            }}
                        >
                            Arun
                        </h3>

                        <p
                            style={{
                                color: "#94a3b8"
                            }}
                        >
                            Admin
                        </p>

                    </>

                )}

            </div>

            {sidebarOpen && (

                <div className="sidebar-search">

                    <FiSearch
                        size={18}

                        color="#94a3b8"

                        style={{
                            position: "absolute",
                            left: "15px",
                            top: "15px"
                        }}
                    />

                    <input
                        type="text"
                        placeholder="Search..."
                    />

                </div>

            )}

            <NavLink
                to="/dashboard"

                title={!sidebarOpen ? "Dashboard" : ""}

                className={({ isActive }) =>
                    isActive
                        ? "sidebar-link active-link"
                        : "sidebar-link"
                }
            >

                <FiHome size={22} />

                {sidebarOpen && (
                    <span>
                        Dashboard
                    </span>
                )}

            </NavLink>

            <NavLink
                to="/customers"

                title={!sidebarOpen ? "Customers" : ""}

                className={({ isActive }) =>
                    isActive
                        ? "sidebar-link active-link"
                        : "sidebar-link"
                }
            >

                <FiUsers size={22} />

                {sidebarOpen && (
                    <span>
                        Customers
                    </span>
                )}

            </NavLink>

            <NavLink
                to="/delivery-agents"

                title={!sidebarOpen ? "Agents" : ""}

                className={({ isActive }) =>
                    isActive
                        ? "sidebar-link active-link"
                        : "sidebar-link"
                }
            >

                <FiTruck size={22} />

                {sidebarOpen && (
                    <span>
                        Agents
                    </span>
                )}

            </NavLink>

            <NavLink
                to="/parcels"

                title={!sidebarOpen ? "Parcels" : ""}

                className={({ isActive }) =>
                    isActive
                        ? "sidebar-link active-link"
                        : "sidebar-link"
                }
            >

                <FiPackage size={22} />

                {sidebarOpen && (
                    <span>
                        Parcels
                    </span>
                )}

            </NavLink>

            <NavLink
                to="/tracking"

                title={!sidebarOpen ? "Tracking" : ""}

                className={({ isActive }) =>
                    isActive
                        ? "sidebar-link active-link"
                        : "sidebar-link"
                }
            >

                <FiMapPin size={22} />

                {sidebarOpen && (
                    <span>
                        Tracking
                    </span>
                )}

            </NavLink>

            <NavLink
                to="/analytics"

                title={!sidebarOpen ? "Analytics" : ""}

                className={({ isActive }) =>
                    isActive
                        ? "sidebar-link active-link"
                        : "sidebar-link"
                }
            >

                <FiBarChart2 size={22} />

                {sidebarOpen && (
                    <span>
                        Analytics
                    </span>
                )}

            </NavLink>


            <NavLink
                to="/reports"

                title={!sidebarOpen ? "Reports" : ""}

                className={({ isActive }) =>
                    isActive
                        ? "sidebar-link active-link"
                        : "sidebar-link"
                }
            >

                <FiFileText size={22} />

                {sidebarOpen && (
                    <span>
                        Reports
                    </span>
                )}

            </NavLink>

        </div>

    );
}

export default Sidebar;