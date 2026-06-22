function PageContainer({
    children,
    sidebarOpen
}) {

    return (
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
                background: "#f8fafc",
                height: "calc(100vh - 70px)",
                overflowY: "auto",
                transition:
                    "all 0.35s ease"
            }}
        >
            {children}
        </div>
    );
}

export default PageContainer;