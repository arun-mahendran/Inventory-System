import {
  useState,
  useEffect,
  useCallback
} from "react";

import api from "../../api/axios";

import MainLayout from "../components/MainLayout";
import { useNavigate } from "react-router-dom";
import { FiTruck, FiSearch, FiFilter } from "react-icons/fi";
import { toast } from "react-toastify";
import { FiTrash2, FiX, FiAlertCircle } from "react-icons/fi";

function DeliveryAgents() {
  const [agents, setAgents] = useState([]);

  const navigate = useNavigate();

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedAgentId, setSelectedAgentId] = useState(null);

  const [selectedAgentName, setSelectedAgentName] = useState("");

  const [showHubDropdown, setShowHubDropdown] = useState(false);

  const [deleting, setDeleting] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedHub, setSelectedHub] = useState("");

  const [hubs, setHubs] = useState([]);

  const fetchAgents = useCallback(async () => {
    try {
      const params = {};

      if (searchTerm.trim()) {
        params.search = searchTerm.trim();
      }

      if (selectedHub !== "") {
        params.hub_id = selectedHub;
      }

      const response = await api.get("/delivery-agents/", {
        params,
      });

      setAgents(response.data);
    } catch (error) {
      console.error("Agent Error:", error);
    }
  }, [searchTerm, selectedHub]);

  const fetchHubs = useCallback(async () => {
    try {
      const response = await api.get("/hubs/");

      setHubs(response.data);
    } catch (error) {
      console.error("Hub Error:", error);
    }
  }, []);


  useEffect(() => {
    fetchHubs();
    }, [fetchHubs]);

    useEffect(() => {
    fetchAgents();
    }, [fetchAgents]);


  const handleDelete = (agentId, agentName) => {
    setSelectedAgentId(agentId);

    setSelectedAgentName(agentName);

    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      setDeleting(true);

      await api.delete(`/delivery-agents/${selectedAgentId}`);

      toast.success("Delivery Agent deleted successfully");

      setAgents(agents.filter((agent) => agent.id !== selectedAgentId));

      setShowDeleteModal(false);
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to delete agent");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <MainLayout>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "25px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <FiTruck size={30} color="#2563eb" />

            <h1>Delivery Agents</h1>
          </div>

          <button
            onClick={() => navigate("/create-agent")}
            style={{
              background: "#2563eb",
              color: "white",
              border: "none",
              padding: "12px 20px",
              borderRadius: "10px",
              cursor: "pointer",
            }}
          >
            + Add Agent
          </button>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "15px",
            marginBottom: "20px",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              position: "relative",
              width: "320px",
            }}
          >
            <FiSearch
              size={18}
              color="#64748b"
              style={{
                position: "absolute",
                left: "16px",
                top: "50%",
                transform: "translateY(-50%)",
              }}
            />

            <input
              type="text"
              placeholder="Search by Agent Name or ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 16px 12px 45px",
                borderRadius: "12px",
                border: "1px solid #cbd5e1",
                fontSize: "15px",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div
            style={{
              position: "relative",
              width: "220px",
            }}
          >
            <div
              onClick={() => setShowHubDropdown(!showHubDropdown)}
              style={{
                background: "white",
                padding: "12px 16px",
                borderRadius: "12px",
                border: "1px solid #cbd5e1",
                cursor: "pointer",

                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",

                fontWeight: "500",

                transition: "all 0.3s ease",

                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <FiFilter color="#2563eb" />

                <span>
                  {selectedHub === ""
                    ? "All Hubs"
                    : hubs.find((hub) => hub.id === Number(selectedHub))
                        ?.hub_name}
                </span>
              </div>

              <span>{showHubDropdown ? "▲" : "▼"}</span>
            </div>

            {showHubDropdown && (
              <div
                style={{
                  position: "absolute",
                  top: "55px",

                  width: "100%",

                  background: "white",

                  borderRadius: "14px",

                  boxShadow: "0 12px 30px rgba(0,0,0,0.12)",

                  overflow: "hidden",

                  zIndex: 1000,
                }}
              >
                <div
                  onClick={() => {
                    setSelectedHub("");

                    setShowHubDropdown(false);
                  }}
                  onMouseEnter={(e) => {
                    if (selectedHub !== "") {
                      e.currentTarget.style.background = "#f8fafc";
                    }

                    e.currentTarget.style.transform = "translateX(6px)";
                  }}
                  onMouseLeave={(e) => {
                    if (selectedHub !== "") {
                      e.currentTarget.style.background = "white";
                    }

                    e.currentTarget.style.transform = "translateX(0)";
                  }}
                  style={{
                    padding: "14px 18px",

                    cursor: "pointer",

                    transition: "all 0.3s ease",

                    fontWeight: "500",

                    background: selectedHub === "" ? "#dbeafe" : "white",

                    color: selectedHub === "" ? "#1d4ed8" : "#0f172a",
                  }}
                >
                  All Hubs
                </div>

                {hubs.map((hub) => (
                  <div
                    key={hub.id}
                    onClick={() => {
                      setSelectedHub(hub.id);

                      setShowHubDropdown(false);
                    }}
                    onMouseEnter={(e) => {
                      if (Number(selectedHub) !== hub.id) {
                        e.currentTarget.style.background = "#f8fafc";
                      }

                      e.currentTarget.style.transform = "translateX(6px)";
                    }}
                    onMouseLeave={(e) => {
                      if (Number(selectedHub) !== hub.id) {
                        e.currentTarget.style.background = "white";
                      }

                      e.currentTarget.style.transform = "translateX(0)";
                    }}
                    style={{
                      padding: "14px 18px",

                      cursor: "pointer",

                      transition: "all 0.3s ease",

                      borderTop: "1px solid #f1f5f9",

                      fontWeight: "500",

                      background:
                        Number(selectedHub) === hub.id ? "#dbeafe" : "white",

                      color:
                        Number(selectedHub) === hub.id ? "#1d4ed8" : "#0f172a",
                    }}
                  >
                    {hub.hub_name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div
          style={{
            background: "white",
            padding: "24px",
            borderRadius: "18px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    textAlign: "left",
                    padding: "12px",
                  }}
                >
                  Agent
                </th>

                <th
                  style={{
                    textAlign: "left",
                    padding: "12px",
                  }}
                >
                  Pincode
                </th>

                <th
                  style={{
                    textAlign: "left",
                    padding: "12px",
                  }}
                >
                  Parcels
                </th>

                <th
                  style={{
                    textAlign: "left",
                    padding: "12px",
                  }}
                >
                  Status
                </th>

                <th
                  style={{
                    textAlign: "left",
                    padding: "12px",
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {agents.map((agent) => (
                <tr key={agent.id} className="table-row">
                  <td
                    style={{
                      padding: "12px",
                      borderTop: "1px solid #e5e7eb",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontWeight: "600",
                          color: "#0f172a",
                        }}
                      >
                        {agent.agent_name}
                      </div>

                      <div
                        style={{
                          fontSize: "13px",
                          color: "#64748b",
                          marginTop: "4px",
                        }}
                      >
                        🚚 {agent.vehicle_number}
                      </div>
                    </div>
                  </td>

                  <td
                    style={{
                      padding: "12px",
                      borderTop: "1px solid #e5e7eb",
                    }}
                  >
                    {agent.pincode}
                  </td>

                  <td
                    style={{
                      padding: "12px",
                      borderTop: "1px solid #e5e7eb",
                    }}
                  >
                    {agent.current_parcel_count}
                  </td>

                  <td
                    style={{
                      padding: "12px",
                      borderTop: "1px solid #e5e7eb",
                    }}
                  >
                    <span
                      style={{
                        background: "#dcfce7",
                        color: "#15803d",
                        padding: "6px 12px",
                        borderRadius: "999px",
                        fontWeight: "600",
                      }}
                    >
                      {agent.availability_status}
                    </span>
                  </td>

                  <td
                    style={{
                      padding: "12px",
                      borderTop: "1px solid #e5e7eb",
                    }}
                  >
                    <button
                      onClick={() => handleDelete(agent.id, agent.agent_name)}
                      style={{
                        background: "#ef4444",
                        color: "white",
                        border: "none",
                        padding: "8px 14px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: "600",
                      }}
                    >
                      🗑 Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showDeleteModal && (
          <div className="modal-overlay">
            <div className="delete-modal">
              <button
                className="close-btn"
                onClick={() => setShowDeleteModal(false)}
              >
                <FiX />
              </button>

              <div className="delete-icon-wrapper">
                <div className="delete-icon">
                  <FiTrash2 />
                </div>
              </div>

              <h2 className="delete-title">Delete Account</h2>

              <p className="delete-description">
                Are you sure you want to delete
                <span
                  style={{
                    display: "block",
                    marginTop: "12px",
                    marginBottom: "12px",
                    fontWeight: "700",
                    fontSize: "18px",
                    color: "#0f172a",
                  }}
                >
                  {selectedAgentName} ?
                </span>
              </p>

              <div className="warning-box">
                <FiAlertCircle />

                <span>This action cannot be undone</span>
              </div>

              <div className="delete-actions">
                <button
                  className="cancel-btn"
                  disabled={deleting}
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>

                <button
                  className="confirm-delete-btn"
                  onClick={confirmDelete}
                  disabled={deleting}
                >
                  <FiTrash2 />

                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </MainLayout>
    </>
  );
}

export default DeliveryAgents;
