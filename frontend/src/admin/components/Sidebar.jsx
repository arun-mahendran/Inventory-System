import { NavLink } from "react-router-dom";

import {
    FiHome,
    FiUsers,
    FiTruck,
    FiPackage,
    FiMapPin,
    FiBarChart2,
    FiCpu,
    FiFileText,
} from "react-icons/fi";

import { FaUserShield } from "react-icons/fa";

import "../../styles/sidebar.css";

const INK_NAVY = "#0f172a";
const INK_NAVY_SOFT = "#16213a";
const SIGNAL_ORANGE = "#f97316";

const NAV_ITEMS = [
    { to: "/dashboard", label: "Dashboard", icon: FiHome },
    { to: "/customers", label: "Customers", icon: FiUsers },
    { to: "/delivery-agents", label: "Agents", icon: FiTruck },
    { to: "/parcels", label: "Parcels", icon: FiPackage },
    { to: "/tracking", label: "Tracking", icon: FiMapPin },
    { to: "/analytics", label: "Analytics", icon: FiBarChart2 },
    { to: "/ai-assistant", label: "AI Assistant", icon: FiCpu },
    { to: "/reports", label: "Reports", icon: FiFileText },
];

function Sidebar({ sidebarOpen }) {
    return (
        <>
        <style>{`
            .fm-sidebar-link {
                display: flex !important;
            }
            .fm-sidebar-icon {
                display: flex !important;
                align-items: center;
                justify-content: center;
                min-width: 20px;
                width: 20px;
                height: 20px;
                flex-shrink: 0;
                visibility: visible !important;
                opacity: 1 !important;
            }
        `}</style>
        <div
            className="sidebar"
            style={{
                position: "fixed",
                left: 0,
                top: "70px",
                width: sidebarOpen ? "280px" : "90px",
                height: "calc(100vh - 70px)",
                background: INK_NAVY,
                overflowY: "auto",
                overflowX: "hidden",
                zIndex: 1000,
                transition: "all 0.35s ease",
                display: "flex",
                flexDirection: "column",
                paddingTop: "22px",
            }}
        >

            <div
                style={{
                    height: "1px",
                    background: "rgba(255,255,255,0.08)",
                    margin: "0 24px 24px",
                }}
            />

            {/* Profile */}
            <div
                style={{
                    textAlign: "center",
                    marginBottom: "26px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <div
                    style={{
                        width: "58px",
                        height: "58px",
                        borderRadius: "50%",
                        background: INK_NAVY_SOFT,
                        border: `2px solid ${SIGNAL_ORANGE}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.35s ease",
                    }}
                >
                    <FaUserShield size={26} color={SIGNAL_ORANGE} />
                </div>

                {sidebarOpen && (
                    <>
                        <h3
                            style={{
                                color: "white",
                                marginTop: "12px",
                                fontFamily: "'Big Shoulders Display', sans-serif",
                                fontWeight: 700,
                                fontSize: "18px",
                                letterSpacing: "0.04em",
                                textTransform: "uppercase",
                                margin: "12px 0 2px",
                            }}
                        >
                            Arun
                        </h3>
                        <p
                            style={{
                                color: "#94a3b8",
                                fontFamily: "'Inter', sans-serif",
                                fontSize: "13px",
                                margin: 0,
                            }}
                        >
                            Administrator
                        </p>
                    </>
                )}
            </div>

            {/* Nav links */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", padding: "0 14px" }}>
                {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
                    <NavLink
                        key={to}
                        to={to}
                        title={!sidebarOpen ? label : ""}
                        className="fm-sidebar-link"
                        style={({ isActive }) => ({
                            display: "flex",
                            alignItems: "center",
                            justifyContent: sidebarOpen ? "flex-start" : "center",
                            gap: "14px",
                            padding: sidebarOpen ? "12px 16px" : "12px",
                            borderRadius: "12px",
                            textDecoration: "none",
                            fontFamily: "'Inter', sans-serif",
                            fontWeight: 600,
                            fontSize: "14.5px",
                            whiteSpace: "nowrap",
                            transition: "all 0.25s ease",
                            background: isActive ? SIGNAL_ORANGE : "transparent",
                            color: isActive ? "#ffffff" : "#94a3b8",
                            boxShadow: isActive ? "0 8px 20px rgba(249,115,22,0.35)" : "none",
                        })}
                        onMouseEnter={(e) => {
                            if (!e.currentTarget.classList.contains("active")) {
                                e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                                e.currentTarget.style.color = "#ffffff";
                            }
                        }}
                        onMouseLeave={(e) => {
                            const isActive = e.currentTarget.getAttribute("aria-current") === "page";
                            if (!isActive) {
                                e.currentTarget.style.background = "transparent";
                                e.currentTarget.style.color = "#94a3b8";
                            }
                        }}
                    >
                        <span className="fm-sidebar-icon">
                            <Icon size={20} />
                        </span>
                        {sidebarOpen && <span>{label}</span>}
                    </NavLink>
                ))}
            </div>
        </div>
        </>
    );
}

export default Sidebar;