import {
    useState
} from "react";

import AgentNavbar
    from "./AgentNavbar";

import AgentSidebar
    from "./AgentSidebar";


function AgentLayout({
    children
}) {

    const [sidebarOpen,
        setSidebarOpen] =
        useState(true);

    return (

        <>

            <AgentNavbar
                sidebarOpen={
                    sidebarOpen
                }

                setSidebarOpen={
                    setSidebarOpen
                }
            />

            <div
                style={{
                    display: "flex"
                }}
            >

                <AgentSidebar
                    sidebarOpen={
                        sidebarOpen
                    }
                />

                <div
                    style={{
                        marginLeft:
                            sidebarOpen
                                ? "280px"
                                : "90px",

                        marginTop: "70px",

                        width:
                            sidebarOpen
                                ? "calc(100vw - 280px)"
                                : "calc(100vw - 90px)",

                        padding: "25px",

                        transition:
                            "all 0.35s ease",

                        background:
                            "#f8fafc",

                        minHeight:
                            "calc(100vh - 70px)"
                    }}
                >

                    {children}

                </div>

            </div>

        </>

    );

}

export default AgentLayout;