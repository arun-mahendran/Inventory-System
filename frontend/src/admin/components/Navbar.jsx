import "../../styles/navbar.css";

import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { FiLogOut, FiPackage } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const INK_NAVY = "#0f172a";
const SIGNAL_ORANGE = "#f97316";

function Navbar({ sidebarOpen, setSidebarOpen }) {
    const navigate = useNavigate();

    return (
        <div
            className="navbar"
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 28px",
                height: "70px",
                background: "#ffffff",
                borderBottom: "1px solid #e7e5e0",
            }}
        >
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    style={{
                        border: "none",
                        background: INK_NAVY,
                        width: "44px",
                        height: "44px",
                        borderRadius: "12px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 8px 20px rgba(15,23,42,0.25)",
                        transition: "all 0.25s ease",
                    }}
                >
                    <HiOutlineMenuAlt2 size={26} color="white" />
                </button>

                <div
                    className="navbar-title navbar-title--brand"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 700,
                        fontSize: "14px",
                        letterSpacing: "0.05em",
                        whiteSpace: "nowrap",
                    }}
                >
                    <FiPackage size={22} color={SIGNAL_ORANGE} />
                    <span style={{ color: INK_NAVY }}>
                        FINAL MILE <span style={{ color: SIGNAL_ORANGE }}>HUB</span>
                    </span>
                </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>

                <button
                    onClick={() => {
                        localStorage.clear();
                        navigate("/login");
                    }}
                    style={{
                        border: "none",
                        background: INK_NAVY,
                        color: "white",
                        padding: "11px 18px",
                        borderRadius: "12px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        fontWeight: 600,
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "14px",
                        transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#ef4444";
                        e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = INK_NAVY;
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

export default Navbar;