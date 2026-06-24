import {
    HiOutlineMenuAlt2
} from "react-icons/hi";

import {
    FiLogOut
} from "react-icons/fi";

import { useNavigate } from "react-router-dom";


function AgentNavbar({
    sidebarOpen,
    setSidebarOpen
}) {

    const navigate = useNavigate();

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
                        transition:
                            "all 0.3s ease"
                    }}

                    onMouseEnter={(e) =>
                        e.currentTarget.style.transform =
                            "scale(1.08)"
                    }

                    onMouseLeave={(e) =>
                        e.currentTarget.style.transform =
                            "scale(1)"
                    }

                >

                    <HiOutlineMenuAlt2
                        size={28}
                    />

                </button>

                <div className="navbar-title">

                    Delivery Agent Portal

                </div>

            </div>

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

        transition: "all 0.3s ease"
    }}

    onMouseEnter={(e) => {

        e.currentTarget.style.background =
            "#1e293b";

        e.currentTarget.style.transform =
            "translateY(-2px)";

    }}

    onMouseLeave={(e) => {

        e.currentTarget.style.background =
            "#ef4444";

        e.currentTarget.style.transform =
            "translateY(0)";

    }}
>

    <FiLogOut size={18} />

    Logout

</button>

        </div>

    );

}

export default AgentNavbar;