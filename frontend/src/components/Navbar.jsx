import "../styles/navbar.css";

import {
    HiOutlineMenuAlt2
} from "react-icons/hi";

function Navbar({
    sidebarOpen,
    setSidebarOpen
}) {

    return (

        <div className="navbar">

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "20px"
                }}
            >

                <button
                    onClick={() =>
                        setSidebarOpen(
                            !sidebarOpen
                        )
                    }

                    onMouseEnter={(e) =>
                        e.currentTarget.style.transform =
                            "scale(1.08)"
                    }

                    onMouseLeave={(e) =>
                        e.currentTarget.style.transform =
                            "scale(1)"
                    }

                    style={{

                        border: "none",
                        background: "#0f172a",

                        width: "44px",
                        height: "44px",
                        borderRadius: "12px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow:
                            "0 8px 20px rgba(15,23,42,0.25)",
                        transition:
                            "all 0.25s ease"

                    }}
                >

                    <HiOutlineMenuAlt2
                        size={28}
                        color="white"
                    />

                </button>

                <div className="navbar-title">
                    Final Mile Delivery Hub
                </div>

            </div>

            <div className="navbar-user">
                Welcome Arun 👋
            </div>

        </div>

    );

}

export default Navbar;