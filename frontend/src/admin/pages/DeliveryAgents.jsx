import { useEffect, useState } from "react";

import api from "../../api/axios";

import MainLayout from "../components/MainLayout";
import { useNavigate } from "react-router-dom";
import { FiTruck } from "react-icons/fi";
import { toast } from "react-toastify";
import {
    FiTrash2,
    FiX,
    FiAlertCircle
} from "react-icons/fi";

function DeliveryAgents() {

    const [agents, setAgents] = useState([]);

    const navigate = useNavigate();

    const [showDeleteModal, setShowDeleteModal] =
        useState(false);

    const [selectedAgentId, setSelectedAgentId] =
        useState(null);

    const [selectedAgentName, setSelectedAgentName] =
        useState("");

    const [deleting, setDeleting] =
        useState(false);
        

    useEffect(() => {

        const fetchAgents = async () => {

            try {

                const response = await api.get(
                    "/delivery-agents/"
                );

                setAgents(
                    response.data
                );

            } catch (error) {

                console.error(
                    "Agent Error:",
                    error
                );

            }

        };

        fetchAgents();

    }, []);

    const handleDelete = (
    agentId,
    agentName
) => {

    setSelectedAgentId(
        agentId
    );

    setSelectedAgentName(
        agentName
    );

    setShowDeleteModal(
        true
    );

};


const confirmDelete = async () => {

    try {

        setDeleting(true);

        await api.delete(
            `/delivery-agents/${selectedAgentId}`
        );

        toast.success(
            "Delivery Agent deleted successfully"
        );

        setAgents(
            agents.filter(
                agent =>
                    agent.id !==
                    selectedAgentId
            )
        );

        setShowDeleteModal(
            false
        );

    } catch (error) {

        toast.error(
            error.response?.data?.detail
            ||
            "Failed to delete agent"
        );

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
                            marginBottom: "25px"
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px"
                            }}
                        >
                            <FiTruck
                                size={30}
                                color="#2563eb"
                            />

                            <h1>Delivery Agents</h1>

                        </div>

                        <button
                            onClick={() =>
                                navigate("/create-agent")
                            }

                            style={{
                                background: "#2563eb",
                                color: "white",
                                border: "none",
                                padding: "12px 20px",
                                borderRadius: "10px",
                                cursor: "pointer"
                            }}
                        >
                            + Add Agent
                        </button>

                    </div>

                    <div
                        style={{
                            background: "white",
                            padding: "24px",
                            borderRadius: "18px",
                            boxShadow:
                                "0 10px 25px rgba(0,0,0,0.08)"
                        }}
                    >

                        <table
                            style={{
                                width: "100%",
                                borderCollapse: "collapse"
                            }}
                        >

                            <thead>

                                <tr>

                                    <th
                                        style={{
                                            textAlign: "left",
                                            padding: "12px"
                                        }}
                                    >
                                        Agent
                                    </th>

                                    <th
                                        style={{
                                            textAlign: "left",
                                            padding: "12px"
                                        }}
                                    >
                                        Pincode
                                    </th>

                                    <th
                                        style={{
                                            textAlign: "left",
                                            padding: "12px"
                                        }}
                                    >
                                        Parcels
                                    </th>

                                    <th
                                        style={{
                                            textAlign: "left",
                                            padding: "12px"
                                        }}
                                    >
                                        Status
                                    </th>

                                    <th
                                        style={{
                                            textAlign: "left",
                                            padding: "12px"
                                        }}
                                    >
                                        Actions
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {agents.map((agent) => (

                                    <tr
                                        key={agent.id}
                                        className="table-row"
                                    >

                                        <td
                                            style={{
                                                padding: "12px",
                                                borderTop:
                                                    "1px solid #e5e7eb"
                                            }}
                                        >

                                            <div>

                                                <div
                                                    style={{
                                                        fontWeight: "600",
                                                        color: "#0f172a"
                                                    }}
                                                >
                                                    {agent.agent_name}
                                                </div>

                                                <div
                                                    style={{
                                                        fontSize: "13px",
                                                        color: "#64748b",
                                                        marginTop: "4px"
                                                    }}
                                                >
                                                    🚚 {agent.vehicle_number}
                                                </div>

                                            </div>

                                        </td>

                                        <td
                                            style={{
                                                padding: "12px",
                                                borderTop:
                                                    "1px solid #e5e7eb"
                                            }}
                                        >
                                            {agent.pincode}
                                        </td>

                                        <td
                                            style={{
                                                padding: "12px",
                                                borderTop:
                                                    "1px solid #e5e7eb"
                                            }}
                                        >
                                            {agent.current_parcel_count}
                                        </td>

                                        <td
                                            style={{
                                                padding: "12px",
                                                borderTop:
                                                    "1px solid #e5e7eb"
                                            }}
                                        >
                                            <span
                                                style={{
                                                    background:
                                                        "#dcfce7",
                                                    color:
                                                        "#15803d",
                                                    padding:
                                                        "6px 12px",
                                                    borderRadius:
                                                        "999px",
                                                    fontWeight:
                                                        "600"
                                                }}
                                            >
                                                {agent.availability_status}
                                            </span>
                                        </td>

                                        <td
                                            style={{
                                                padding: "12px",
                                                borderTop:
                                                    "1px solid #e5e7eb"
                                            }}
                                        >

                                            <button
                                                onClick={() =>
                                                    handleDelete(
                                                        agent.id,
                                                        agent.agent_name
                                                    )
                                                }

                                                style={{
                                                    background: "#ef4444",
                                                    color: "white",
                                                    border: "none",
                                                    padding: "8px 14px",
                                                    borderRadius: "8px",
                                                    cursor: "pointer",
                                                    fontWeight: "600"
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

                    {
                        showDeleteModal && (

                            <div className="modal-overlay">

                                <div className="delete-modal">

                                    <button
                                        className="close-btn"
                                        onClick={() =>
                                            setShowDeleteModal(false)
                                        }
                                    >
                                        <FiX />
                                    </button>

                                    <div className="delete-icon-wrapper">

                                        <div className="delete-icon">
                                            <FiTrash2 />
                                        </div>

                                    </div>

                                    <h2 className="delete-title">

                                        Delete Account

                                    </h2>

                                   <p className="delete-description">
                                        Are you sure you want to delete

                                        <span
                                            style={{
                                                display: "block",
                                                marginTop: "12px",
                                                marginBottom: "12px",
                                                fontWeight: "700",
                                                fontSize: "18px",
                                                color: "#0f172a"
                                            }}
                                        >
                                            {selectedAgentName} ?
                                        </span>

                                    </p>

                                    <div className="warning-box">

                                        <FiAlertCircle />

                                        <span>
                                            This action cannot be undone
                                        </span>

                                    </div>

                                    <div className="delete-actions">

                                        <button
                                            className="cancel-btn"
                                            disabled={deleting}
                                            onClick={() =>
                                                setShowDeleteModal(false)
                                            }
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            className="confirm-delete-btn"
                                            onClick={confirmDelete}
                                            disabled={deleting}
                                        >
                                            <FiTrash2 />

                                                {
                                                    deleting
                                                        ? "Deleting..."
                                                        : "Delete"
                                                }
                                        </button>

                                    </div>

                                </div>

                            </div>

                        )
                    }

                </MainLayout>

        </>
    );
}

export default DeliveryAgents;