import { useEffect, useState } from "react";

import api from "../../api/axios";

import AgentLayout from "../components/AgentLayout";

import "../../styles/agent-history.css";

import { MdHistory } from "react-icons/md";

import { FiDownload } from "react-icons/fi";

function AgentDeliveryHistory() {
  const [history, setHistory] = useState([]);

  const downloadPDF = async () => {
    try {
      const agentId = localStorage.getItem("delivery_agent_id");

      const response = await api.get(`/agent-reports/${agentId}/download-pdf`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));

      const link = document.createElement("a");

      link.href = url;

      link.setAttribute("download", "delivery_history.pdf");

      document.body.appendChild(link);

      link.click();

      link.remove();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const agentId = localStorage.getItem("delivery_agent_id");

        const response = await api.get(`/delivery-agents/${agentId}/parcels`);

        const completedParcels = response.data
          .filter(
            (parcel) =>
              parcel.status === "Delivered" ||
              parcel.status === "FailedDelivery",
          )
          .sort((a, b) => {
            const dateA = new Date(a.delivered_at || a.failed_at);

            const dateB = new Date(b.delivered_at || b.failed_at);

            return dateB - dateA;
          });

        setHistory(completedParcels);
      } catch (error) {
        console.log(error);
      }
    };

    fetchHistory();
  }, []);

  return (
    <AgentLayout>
      <div className="history-page">
        <div
          className="history-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "25px",
          }}
        >
          <div>
            <h1
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <MdHistory size={38} color="#2563eb" />
              Delivery History
            </h1>

            <p>View all completed deliveries.</p>
          </div>

          <button
            onClick={downloadPDF}
            style={{
              background: "#2563eb",

              color: "white",

              border: "none",

              padding: "14px 22px",

              borderRadius: "14px",

              cursor: "pointer",

              display: "flex",

              alignItems: "center",

              gap: "10px",

              fontSize: "15px",

              fontWeight: "600",
            }}
          >
            <FiDownload size={18} />
            Export PDF
          </button>
        </div>

        <div className="history-table-container">
          <table className="history-table">
            <thead>
              <tr>
                <th>Tracking No</th>

                <th>Customer ID</th>

                <th>Status</th>

                <th>Completed At</th>

                <th>Failure Reason</th>
              </tr>
            </thead>

            <tbody>
              {history.length > 0 ? (
                history.map((parcel) => (
                  <tr key={parcel.id}>
                    <td>{parcel.tracking_number}</td>

                    <td>{parcel.customer_id}</td>

                    <td>
                      <span
                        className={
                          parcel.status === "Delivered"
                            ? "status-success"
                            : "status-failed"
                        }
                      >
                        {parcel.status === "Delivered" ? "Delivered" : "Failed"}
                      </span>
                    </td>

                    <td>
                      {parcel.delivered_at
                        ? new Date(parcel.delivered_at).toLocaleDateString()
                        : parcel.failed_at
                          ? new Date(parcel.failed_at).toLocaleDateString()
                          : "-"}
                    </td>

                    <td>{parcel.failure_reason || "-"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="empty-history">
                    No delivery history found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AgentLayout>
  );
}

export default AgentDeliveryHistory;
