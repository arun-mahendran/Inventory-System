import { useState, useEffect } from "react";
import AgentNavbar from "./AgentNavbar";
import AgentSidebar from "./AgentSidebar";
import "../../styles/agent-layout.css";

function AgentLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const savedState = localStorage.getItem("agent_sidebar_open");
    return savedState !== null ? JSON.parse(savedState) : true;
  });

  useEffect(() => {
    localStorage.setItem("agent_sidebar_open", JSON.stringify(sidebarOpen));
  }, [sidebarOpen]);

  return (
    <>
      <AgentNavbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="agent-shell">
        <AgentSidebar sidebarOpen={sidebarOpen} />

        <div
          className={
            "agent-main " + (sidebarOpen ? "is-expanded" : "is-collapsed")
          }
        >
          {children}
        </div>
      </div>
    </>
  );
}

export default AgentLayout;