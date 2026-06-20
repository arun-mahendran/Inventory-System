import { useEffect, useState } from "react";

import {
    Link,
    useNavigate
} from "react-router-dom";

import api from "../api/axios";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import PageContainer from "../components/PageContainer";

function Parcels() {

    const navigate = useNavigate();

    const [parcels, setParcels] = useState([]);

    const [selectedFilter, setSelectedFilter] =
    useState("All");

    const [showFailedModal, setShowFailedModal] =
    useState(false);

    const [selectedParcelId, setSelectedParcelId] =
        useState(null);

    const [failureReason, setFailureReason] =
        useState("");

    const [selectedParcel, setSelectedParcel] =
        useState(null);

    const [showModal, setShowModal] =
        useState(false);

const disabledButton = {
    padding: "6px 10px",
    border: "none",
    borderRadius: "6px",
    background: "#d1d5db",
    color: "#6b7280",
    cursor: "not-allowed"
};

const fetchParcels = async () => {

    try {

        const response = await api.get(
            "/parcels/"
        );

        const statusOrder = {
            Received: 1,
            Assigned: 2,
            OutForDelivery: 3,
            FailedDelivery: 4,
            Delivered: 5
        };

        const sortedParcels =
            response.data.sort(
                (a, b) =>
                    statusOrder[a.status] -
                    statusOrder[b.status]
            );

        setParcels(
            sortedParcels
        );

    } catch (error) {

        console.error(
            "Parcel Error:",
            error
        );

    }

};


const outForDelivery = async (parcelId) => {

    try {

        await api.patch(
            `/parcels/${parcelId}/out-for-delivery`
        );

        fetchParcels();

    } catch (error) {

        console.error(error);

    }

};

const markDelivered = async (parcelId) => {
    try {

        await api.patch(
            `/parcels/${parcelId}/delivered`
        );

        fetchParcels();

    } catch (error) {

        console.error(error);

    }

};

const reassignParcel = async (
    parcelId
) => {

    try {

        await api.post(
            `/parcels/${parcelId}/reassign`
        );

        fetchParcels();

    } catch (error) {

        console.error(
            "Reassign Error:",
            error
        );

    }

};

const openFailedModal = (parcelId) => {

    setSelectedParcelId(parcelId);

    setShowFailedModal(true);

};


const submitFailedDelivery = async () => {

    console.log(
        "Selected Reason:",
        failureReason
    );

    try {
        const response = await api.patch(
        `/parcels/${selectedParcelId}/failed`,
        {
            reason: failureReason
        }
    );

    console.log(
        "API Response:",
        response.data
    );

    setShowFailedModal(false);

    fetchParcels();

    } catch (error) {

        console.error(
            "Failed Delivery Error:",
            error
        );

    }

};

const filteredParcels =
    parcels.filter((parcel) => {

        if (
            selectedFilter === "All"
        )
            return true;

        if (
            selectedFilter === "Reassigned"
        )
            return (
                parcel.history_count > 1
            );

        return (
            parcel.status ===
            selectedFilter
        );

    });


const viewParcelDetails = async (
    parcelId
) => {

    try {

        const response =
            await api.get(
                `/parcels/${parcelId}`
            );

        setSelectedParcel(
            response.data
        );

        setShowModal(
            true
        );

    } catch (error) {

        console.error(error);

    }

};

    useEffect(() => {

    fetchParcels();

}, []);

    return (
        <>
            <Navbar />

            <div
                style={{
                    display: "flex"
                }}
            >
                <Sidebar />

                    <PageContainer>

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "25px"
                        }}
                    >

                        <h1>
                            Parcels
                        </h1>

                        <button
                            onClick={() =>
                                navigate(
                                    "/create-parcel"
                                )
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
                            + Create Parcel
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

                    <div
                        style={{
                            display: "flex",
                            gap: "10px",
                            marginBottom: "20px",
                            flexWrap: "wrap"
                        }}
                    >

                        {
                            [
                                "All",
                                "Assigned",
                                "OutForDelivery",
                                "Delivered",
                                "FailedDelivery",
                                "Reassigned"
                            ].map((filter) => (

                                <button
                                    key={filter}
                                    onClick={() =>
                                        setSelectedFilter(filter)
                                    }
                                    style={{
                                        padding: "8px 14px",
                                        border: "none",
                                        borderRadius: "8px",
                                        cursor: "pointer",
                                        background:
                                            selectedFilter === filter
                                            ? "#2563eb"
                                            : "#e5e7eb",
                                        color:
                                            selectedFilter === filter
                                            ? "white"
                                            : "#374151"
                                    }}
                                >
                                    {filter}
                                </button>

                            ))
                        }

                    </div>

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
                                        Tracking No
                                    </th>

                                    <th
                                        style={{
                                            textAlign: "left",
                                            padding: "12px"
                                        }}
                                    >
                                        Customer ID
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
                                        Agent
                                    </th>

                                    <th
                                        style={{
                                            textAlign: "left",
                                            padding: "12px",
                                            width: "300px"
                                        }}
                                    >
                                        Actions
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {filteredParcels.map((parcel) => (

                                    <tr
                                        key={parcel.id}
                                        className="table-row"
                                    >

                                        <td
                                            style={{
                                                padding: "16px",
                                                color: "#2563eb",
                                                fontWeight: "600",
                                                cursor: "pointer",
                                                textDecoration: "underline"
                                            }}
                                            onClick={() =>
                                                viewParcelDetails(
                                                    parcel.id
                                                )
                                            }
                                        >
                                            {parcel.tracking_number}
                                        </td>

                                        <td
                                            style={{
                                                padding: "12px",
                                                borderTop:
                                                    "1px solid #e5e7eb"
                                            }}
                                        >
                                            {parcel.customer_id}
                                        </td>

                                        <td
                                            style={{
                                                padding: "12px",
                                                borderTop:
                                                    "1px solid #e5e7eb"
                                            }}
                                        >
                                            <span
                                                className={
                                                    parcel.status === "Delivered"
                                                        ? "status status-delivered"
                                                        : parcel.status === "Assigned"
                                                        ? "status status-assigned"
                                                        : "status status-failed"
                                                }
                                            >
                                                {parcel.status}
                                            </span>
                                        </td>

                                        <td
                                            style={{
                                                padding: "12px",
                                                borderTop:
                                                    "1px solid #e5e7eb"
                                            }}
                                        >
                                            {
                                                parcel.assigned_agent_id
                                                    ? `Agent ${parcel.assigned_agent_id}`
                                                    : "-"
                                            }
                                        </td>

                                        <td
                                            style={{
                                                padding: "12px",
                                                borderTop: "1px solid #e5e7eb",
                                                minWidth: "420px"
                                            }}
                                        >

                                            <div
                                                style={{
                                                    display: "flex",
                                                    gap: "8px",
                                                    alignItems: "center"
                                                }}
                                            >

                                                <button
                                                    disabled={parcel.status !== "Assigned"}
                                                    onClick={() => outForDelivery(parcel.id)}
                                                    style={
                                                        parcel.status === "Assigned"
                                                        ? {
                                                            padding: "6px 10px",
                                                            border: "none",
                                                            borderRadius: "6px",
                                                            background: "#f59e0b",
                                                            color: "white",
                                                            cursor: "pointer"
                                                        }
                                                        : disabledButton
                                                    }
                                                >
                                                    Out
                                                </button>

                                                <button
                                                    disabled={
                                                        parcel.status !==
                                                        "OutForDelivery"
                                                    }
                                                    onClick={() =>
                                                        openFailedModal(parcel.id)
                                                    }
                                                    style={
                                                        parcel.status ===
                                                        "OutForDelivery"
                                                        ? {
                                                            padding: "6px 10px",
                                                            border: "none",
                                                            borderRadius: "6px",
                                                            background: "#ef4444",
                                                            color: "white",
                                                            cursor: "pointer"
                                                        }
                                                        : disabledButton
                                                    }
                                                >
                                                    Failed
                                                </button>

                                                <button
                                                    disabled={parcel.status !== "OutForDelivery"}
                                                    onClick={() => markDelivered(parcel.id)}
                                                    style={
                                                        parcel.status === "OutForDelivery"
                                                        ? {
                                                            padding: "6px 10px",
                                                            border: "none",
                                                            borderRadius: "6px",
                                                            background: "#22c55e",
                                                            color: "white",
                                                            cursor: "pointer"
                                                        }
                                                        : disabledButton
                                                    }
                                                >
                                                    Delivered
                                                </button>

                                                <button
                                                    disabled={
                                                        parcel.status !==
                                                        "FailedDelivery"
                                                    }
                                                    onClick={() =>
                                                        reassignParcel(parcel.id)
                                                    }
                                                    style={
                                                        parcel.status ===
                                                        "FailedDelivery"
                                                        ? {
                                                            padding: "6px 10px",
                                                            border: "none",
                                                            borderRadius: "6px",
                                                            background: "#2563eb",
                                                            color: "white",
                                                            cursor: "pointer"
                                                        }
                                                        : disabledButton
                                                    }
                                                >
                                                    Reassign
                                                </button>

                                                {
                                                    parcel.history_count > 1 ? (

                                                        <Link
                                                            to={`/parcel-history/${parcel.id}`}
                                                            style={{
                                                                textDecoration: "none",
                                                                background: "#334155",
                                                                color: "white",
                                                                padding: "6px 10px",
                                                                borderRadius: "6px",
                                                                fontSize: "14px"
                                                            }}
                                                        >
                                                            📜 History
                                                        </Link>

                                                    ) : (

                                                        <span
                                                            style={{
                                                                background: "#d1d5db",
                                                                color: "#6b7280",
                                                                padding: "6px 10px",
                                                                borderRadius: "6px",
                                                                fontSize: "14px",
                                                                cursor: "not-allowed"
                                                            }}
                                                        >
                                                            📜 History
                                                        </span>

                                                    )
                                                }

                                            </div>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                    {
                        showModal &&
                        selectedParcel && (

                            <div
                                style={{
                                    position: "fixed",
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    height: "100%",
                                    background:
                                        "rgba(0,0,0,0.5)",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    zIndex: 9999
                                }}
                            >

                                <div
                                    style={{
                                        background: "white",
                                        width: "500px",
                                        padding: "30px",
                                        borderRadius: "20px",
                                        boxShadow:
                                            "0 20px 40px rgba(0,0,0,0.2)"
                                    }}
                                >

                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent:
                                                "space-between",
                                            alignItems:
                                                "center",
                                            marginBottom: "20px"
                                        }}
                                    >

                                        <h2>
                                            📦 Parcel Details
                                        </h2>

                                        <button
                                            onClick={() =>
                                                setShowModal(
                                                    false
                                                )
                                            }
                                            style={{
                                                border: "none",
                                                background: "none",
                                                cursor: "pointer",
                                                fontSize: "22px"
                                            }}
                                        >
                                            ✕
                                        </button>

                                    </div>

                                    <div
                                        style={{
                                            display: "grid",
                                            gridTemplateColumns: "170px 1fr",
                                            rowGap: "10px",
                                            marginTop: "20px"
                                        }}
                                    >

                                        <b>Tracking Number</b>
                                        <span>{selectedParcel.tracking_number}</span>

                                        <b>Status</b>
                                        <span>{selectedParcel.status}</span>

                                        <b>Customer ID</b>
                                        <span>{selectedParcel.customer_id}</span>

                                        <b>Assigned Agent</b>
                                        <span>
                                            {
                                                selectedParcel.assigned_agent_id || "-"
                                            }
                                        </span>

                                        {
                                            selectedParcel.failure_reason && (

                                                <>
                                                    <b>
                                                        Failure Reason
                                                    </b>

                                                    <span
                                                        style={{
                                                            color: "#dc2626",
                                                            fontWeight: "600"
                                                        }}
                                                    >
                                                        {
                                                            selectedParcel.failure_reason
                                                        }
                                                    </span>
                                                </>

                                            )
                                        }

                                        <b>Created At</b>
                                        <span>
                                            {
                                                new Date(
                                                    selectedParcel.created_at
                                                ).toLocaleString()
                                            }
                                        </span>

                                    </div>

                                </div>

                            </div>

                        )
                    }

                </PageContainer>

            </div>

            {
                showFailedModal && (

                    <div
                        style={{
                            position: "fixed",
                            inset: 0,
                            background: "rgba(15,23,42,0.35)",
                            backdropFilter: "blur(8px)",
                            WebkitBackdropFilter: "blur(8px)",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                    >

                        <div
                            style={{
                                background: "white",
                                padding: "24px",
                                borderRadius: "12px",
                                width: "400px"
                            }}
                        >

                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                    marginBottom: "15px"
                                }}
                            >
                                <span
                                    style={{
                                        fontSize: "28px"
                                    }}
                                >
                                    ⚠️
                                </span>

                                <div>

                                    <h2
                                        style={{
                                            margin: 0
                                        }}
                                    >
                                        Failed Delivery
                                    </h2>

                                    <p
                                        style={{
                                            margin: 0,
                                            color: "#6b7280",
                                            fontSize: "14px"
                                        }}
                                    >
                                        Select a failure reason
                                    </p>

                                </div>

                            </div>

                            <select
                                value={failureReason}
                                onChange={(e) =>
                                    setFailureReason(
                                        e.target.value
                                    )
                                }
                                style={{
                                    width: "100%",
                                    padding: "12px",
                                    borderRadius: "10px",
                                    border: "1px solid #d1d5db",
                                    fontSize: "15px",
                                    marginTop: "10px"
                                }}
                            >

                                <option value="">
                                    Select Reason
                                </option>

                                <option value="Customer Not Available">
                                    Customer Not Available
                                </option>

                                <option value="Address Not Reachable">
                                    Address Not Reachable
                                </option>

                                <option value="Phone Not Reachable">
                                    Phone Not Reachable
                                </option>

                                <option value="Customer Refused Delivery">
                                    Customer Refused Delivery
                                </option>

                                <option value="Other">
                                    Other
                                </option>

                            </select>

                            <div
                                style={{
                                    display: "flex",
                                    gap: "10px",
                                    marginTop: "15px"
                                }}
                            >

                                <button
                                    onClick={submitFailedDelivery}
                                    disabled={!failureReason}
                                    style={{
                                        background:
                                            failureReason
                                                ? "#ef4444"
                                                : "#d1d5db",

                                        color: "white",

                                        border: "none",

                                        padding: "10px 18px",

                                        borderRadius: "10px",

                                        cursor:
                                            failureReason
                                                ? "pointer"
                                                : "not-allowed",

                                        fontWeight: "600"
                                    }}
                                >
                                    Mark Failed
                                </button>

                                <button
                                    onClick={() =>
                                        setShowFailedModal(false)
                                    }
                                    style={{
                                        background: "#334155",
                                        color: "white",
                                        border: "none",
                                        padding: "10px 18px",
                                        borderRadius: "10px",
                                        cursor: "pointer",
                                        fontWeight: "600"
                                    }}
                                >
                                    Cancel
                                </button>

                            </div>

                        </div>

                    </div>

                )
            }

        </>
    );
}

export default Parcels;