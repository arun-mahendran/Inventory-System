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

                    style={{
                        border: "none",
                        background: "transparent",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center"
                    }}
                >

                    <HiOutlineMenuAlt2
                        size={30}
                        color="#334155"
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