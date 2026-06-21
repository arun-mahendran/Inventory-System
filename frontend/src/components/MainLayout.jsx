import {useState, useEffect} from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import PageContainer from "./PageContainer";

function MainLayout({ children }) {

    const [sidebarOpen, setSidebarOpen] =
        useState(() => {

            const savedState =
                localStorage.getItem(
                    "sidebarOpen"
                );

            return savedState !== null
                ? JSON.parse(savedState)
                : true;

        });

    useEffect(() => {

        localStorage.setItem(
            "sidebarOpen",
            JSON.stringify(sidebarOpen)
        );

    }, [sidebarOpen]);

    return (
        <>
            <Navbar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
            />

            <div
                style={{
                    display: "flex"
                }}
            >
                <Sidebar
                    sidebarOpen={sidebarOpen}
                />

                <PageContainer
                    sidebarOpen={sidebarOpen}
                >
                    {children}
                </PageContainer>

            </div>

        </>
    );
}

export default MainLayout;