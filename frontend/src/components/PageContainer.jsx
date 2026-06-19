function PageContainer({ children }) {

    return (
        <div
            style={{
                marginLeft: "300px",
                marginTop: "70px",
                width: "calc(100vw - 300px)",
                padding: "25px",
                background: "#f8fafc",
                height: "calc(100vh - 70px)",
                overflowY: "auto"
            }}
        >
            {children}
        </div>
    );

}

export default PageContainer;