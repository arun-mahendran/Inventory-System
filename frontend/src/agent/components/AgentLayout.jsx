import {
    useState,
    useEffect
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
    useState(() => {

        const savedState =
            localStorage.getItem(
                "agent_sidebar_open"
            );

        return savedState !== null
            ? JSON.parse(savedState)
            : true;

    });

    useEffect(() => {

        localStorage.setItem(
            "agent_sidebar_open",
            JSON.stringify(sidebarOpen)
        );

    }, [sidebarOpen]);

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