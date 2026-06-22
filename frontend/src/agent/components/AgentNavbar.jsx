import {
    HiOutlineMenuAlt2
} from "react-icons/hi";


function AgentNavbar({
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

            <div className="navbar-user">

                Welcome 👋

            </div>

        </div>

    );

}

export default AgentNavbar;