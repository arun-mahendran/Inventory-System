import { useEffect, useState } from "react";

import api from "../../api/axios";

import AgentLayout
    from "../components/AgentLayout";

import { FiPackage }
    from "react-icons/fi";

// import {
//     FiTruck,
//     FiCheckCircle,
//     FiAlertCircle
// } from "react-icons/fi";

import { FiFilter } from "react-icons/fi";


function MyParcels() {

    const [parcels, setParcels] =
        useState([]);

    const [filterStatus, setFilterStatus] =
    useState("All");

    const [selectedParcel,
        setSelectedParcel] =
        useState(null);

    const [showModal,
        setShowModal] =
        useState(false);

    const [showFailureModal,
        setShowFailureModal] =
        useState(false);

    const [selectedParcelId,
        setSelectedParcelId] =
        useState(null);

    const [failureReason,
        setFailureReason] =
        useState("");

    const [showFilterDropdown, setShowFilterDropdown] =
    useState(false);

    const filters = [
    {
        label: "📦 All Parcels",
        value: "All"
    },
    {
        label: "🟡 Assigned",
        value: "Assigned"
    },
    {
        label: "🚚 Out For Delivery",
        value: "OutForDelivery"
    },
    {
        label: "✅ Delivered",
        value: "Delivered"
    },
    {
        label: "❌ Failed Delivery",
        value: "FailedDelivery"
    }
];

    useEffect(() => {

        const fetchParcels =
            async () => {

                try {

                    const agentId =
                        localStorage.getItem(
                            "delivery_agent_id"
                        );

                    const response =
                        await api.get(
                            `/delivery-agents/${agentId}/parcels`
                        );

                    setParcels(
                        response.data
                    );

                } catch (error) {

                    console.error(
                        error
                    );

                }

            };

        fetchParcels();

    }, []);

    const startDelivery =
    async (parcelId) => {

        try {

            await api.patch(
                `/parcels/${parcelId}/out-for-delivery`
            );

            window.location.reload();

        } catch (error) {

            console.log(error);

        }

    };

    const markDelivered =
    async (parcelId) => {

        try {

            await api.patch(
                `/parcels/${parcelId}/delivered`
            );

            window.location.reload();

        } catch (error) {

            console.log(error);

        }

    };

    const reportFailure =
        (parcelId) => {

            setSelectedParcelId(
                parcelId
            );

            setShowFailureModal(
                true
            );

        };

    
        const submitFailure =
            async () => {

                if (
                    !failureReason.trim()
                ) {

                    alert(
                        "Please enter failure reason"
                    );

                    return;

                }

                try {

                    await api.patch(
                        `/parcels/${selectedParcelId}/failed`,
                        {
                            reason:
                                failureReason
                        }
                    );

                    setShowFailureModal(
                        false
                    );

                    setFailureReason(
                        ""
                    );

                    window.location.reload();

                } catch (error) {

                    console.log(error);

                }

            };

    const filteredParcels =
    filterStatus === "All"

        ? parcels

        : parcels.filter(
            parcel =>
                parcel.status ===
                filterStatus
        );

        const disabledButton = {
            padding: "6px 10px",
            border: "none",
            borderRadius: "6px",
            background: "#d1d5db",
            color: "#6b7280",
            cursor: "not-allowed"
        };


    const viewParcelDetails =
    (parcel) => {

        console.log(parcel);

        setSelectedParcel(
            parcel
        );

        setShowModal(
            true
        );

    };

    return (

        <AgentLayout>

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "25px"
                }}
            >

                <FiPackage
                    size={30}
                    color="#2563eb"
                />

                <h1>
                    My Parcels
                </h1>

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
                        alignItems: "center",
                        gap: "20px",
                        marginBottom: "-5px"
                    }}
                >

                   <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "20px",
                        marginBottom: "25px"
                    }}
                >

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px"
                        }}
                    >

                        <FiFilter
                            size={22}
                            color="#2563eb"
                        />

                        <span
                            style={{
                                fontSize: "16px",
                                fontWeight: "600",
                                color: "#334155"
                            }}
                        >
                            Filter Parcels
                        </span>

                    </div>

                    <div
                        style={{
                            position: "relative",
                            width: "230px"
                        }}
                    >

                        <div
                            onClick={() =>
                                setShowFilterDropdown(
                                    !showFilterDropdown
                                )
                            }

                            style={{
                                background: "white",
                                padding: "14px 18px",
                                borderRadius: "16px",
                                boxShadow:
                                    "0 8px 20px rgba(0,0,0,0.08)",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                cursor: "pointer",
                                fontWeight: "600",
                                fontSize: "16px",
                                border: "2px solid #e2e8f0"
                            }}
                        >

                            {
                                filters.find(
                                    f => f.value === filterStatus
                                )?.label
                            }

                            <span>
                                {
                                    showFilterDropdown
                                        ? "▲"
                                        : "▼"
                                }
                            </span>

                        </div>

                        {
                            showFilterDropdown && (

                                <div
                                    style={{
                                        position: "absolute",
                                        top: "60px",
                                        width: "100%",
                                        background: "white",
                                        borderRadius: "18px",
                                        boxShadow:
                                            "0 15px 35px rgba(0,0,0,0.15)",
                                        overflow: "hidden",
                                        zIndex: 1000
                                    }}
                                >

                                    {
                                        filters.map((filter) => (

                                            <div
                                                key={filter.value}

                                                onClick={() => {

                                                    setFilterStatus(
                                                        filter.value
                                                    );

                                                    setShowFilterDropdown(
                                                        false
                                                    );

                                                }}

                                                style={{
                                                    padding: "12px 18px",
                                                    cursor: "pointer",
                                                    fontWeight: "500",

                                                    background:
                                                        filterStatus === filter.value
                                                            ? "#eff6ff"
                                                            : "white",

                                                    borderBottom:
                                                        filter.value !== "FailedDelivery"
                                                            ? "1px solid #f1f5f9"
                                                            : "none"
                                                }}
                                            >

                                                {filter.label}

                                            </div>

                                        ))
                                    }

                                </div>

                            )
                        }

                    </div>

                </div>
                    
                </div>

                <table
                    style={{
                        width: "100%",
                        borderCollapse:
                            "collapse"
                    }}
                >

                    <thead>

                        <tr>

                            <th
                                style={{
                                    padding: "12px",
                                    textAlign: "left",
                                    borderBottom:
                                        "1px solid #e5e7eb",
                                    color: "#0f172a",
                                    fontWeight: "700"
                                }}
                            >
                                Tracking No
                            </th>

                            <th
                                style={{
                                    padding: "18px",
                                    textAlign: "left",
                                    borderBottom:
                                        "1px solid #e5e7eb",
                                    color: "#0f172a",
                                    fontWeight: "700"
                                }}
                            >
                                Customer ID
                            </th>

                            <th
                                style={{
                                    padding: "18px",
                                    textAlign: "left",
                                    borderBottom:
                                        "1px solid #e5e7eb",
                                    color: "#0f172a",
                                    fontWeight: "700"
                                }}
                            >
                                Status
                            </th>

                            <th
                                style={{
                                    padding: "18px",
                                    textAlign: "left",
                                    borderBottom:
                                        "1px solid #e5e7eb",
                                    color: "#0f172a",
                                    fontWeight: "700"
                                }}
                            >
                                Created At
                            </th>

                            <th
                                style={{
                                    padding: "18px",
                                    textAlign: "left",
                                    borderBottom:
                                        "1px solid #e5e7eb",
                                    color: "#0f172a",
                                    fontWeight: "700"
                                    
                                }}
                            >
                                Actions
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {
                            filteredParcels.map(
                                (parcel) => (

                                    <tr key={parcel.id}>

                                       <td
                                            style={{
                                                padding: "20px 18px",
                                                borderBottom:
                                                    "1px solid #e5e7eb",
                                                verticalAlign:
                                                    "middle",

                                                color: "#2563eb",

                                                fontWeight: "600",

                                                cursor: "pointer",

                                                textDecoration:
                                                    "underline"
                                            }}

                                            onClick={() =>
                                                viewParcelDetails(
                                                    parcel
                                                )
                                            }
                                        >
                                            {parcel.tracking_number}
                                        </td>

                                        <td
                                            style={{
                                                padding: "20px 18px",
                                                borderBottom:
                                                    "1px solid #e5e7eb",
                                                verticalAlign:
                                                    "middle"
                                            }}
                                        >
                                            {parcel.customer_id}
                                        </td>

                                        <td
                                            style={{
                                                padding: "20px 18px",
                                                borderBottom:
                                                    "1px solid #e5e7eb",
                                                verticalAlign:
                                                    "middle"
                                            }}
                                        >

                                            <span
                                                style={{

                                                    padding: "8px 14px",

                                                    borderRadius: "20px",

                                                    fontWeight: "600",

                                                    fontSize: "14px",

                                                    background:

                                                        parcel.status ===
                                                        "Delivered"

                                                            ? "#dcfce7"

                                                            : parcel.status ===
                                                            "FailedDelivery"

                                                            ? "#fee2e2"

                                                            : parcel.status ===
                                                            "OutForDelivery"

                                                            ? "#fef3c7"

                                                            : "#dbeafe",

                                                    color:

                                                        parcel.status ===
                                                        "Delivered"

                                                            ? "#166534"

                                                            : parcel.status ===
                                                            "FailedDelivery"

                                                            ? "#991b1b"

                                                            : parcel.status ===
                                                            "OutForDelivery"

                                                            ? "#92400e"

                                                            : "#1d4ed8"

                                                }}
                                            >

                                                {parcel.status}

                                            </span>

                                        </td>

                                        <td
                                            style={{
                                                padding: "20px 18px",
                                                borderBottom:
                                                    "1px solid #e5e7eb",
                                                verticalAlign:
                                                    "middle"
                                            }}
                                        >
                                            {
                                                new Date(
                                                    parcel.created_at
                                                ).toLocaleDateString()
                                            }
                                        </td>

                                        <td
                                            style={{
                                                padding: "12px",
                                                borderTop: "1px solid #e5e7eb",
                                                minWidth: "280px"
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
                                                    onClick={() =>
                                                        startDelivery(parcel.id)
                                                    }
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
                                                        reportFailure(parcel.id)
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
                                                    disabled={
                                                        parcel.status !==
                                                        "OutForDelivery"
                                                    }

                                                    onClick={() =>
                                                        markDelivered(parcel.id)
                                                    }

                                                    style={
                                                        parcel.status ===
                                                        "OutForDelivery"

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

                                            </div>

                                        </td>

                                    </tr>

                                )
                            )
                        }

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

                            justifyContent:
                                "center",

                            alignItems:
                                "center",

                            zIndex: 9999
                        }}
                    >

                        <div
                            style={{
                                background: "white",

                                width: "500px",

                                padding: "30px",

                                borderRadius:
                                    "20px",

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

                                    marginBottom:
                                        "20px"
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

                                        background:
                                            "none",

                                        cursor:
                                            "pointer",

                                        fontSize:
                                            "22px"
                                    }}
                                >
                                    ✕
                                </button>

                            </div>

                            <div
                                style={{
                                    display: "grid",

                                    gridTemplateColumns:
                                        "170px 1fr",

                                    rowGap: "14px"
                                }}
                            >

                                <b>Tracking Number</b>
                                <span>{selectedParcel.tracking_number}</span>

                                <b>Customer Name</b>
                                <span>
                                    {selectedParcel.customer_name || "-"}
                                </span>

                                <b>Phone Number</b>
                                <span>
                                    {selectedParcel.phone || "-"}
                                </span>

                                <b>Customer ID</b>
                                <span>{selectedParcel.customer_id}</span>

                                <b>Delivery Address</b>

                                <span
                                    style={{
                                        whiteSpace: "pre-wrap",
                                        lineHeight: "1.6"
                                    }}
                                >
                                    {selectedParcel.address || "-"}
                                </span>

                                <b>Status</b>
                                <span>{selectedParcel.status}</span>

                                <b>Assigned Agent</b>
                                <span>
                                    {
                                        selectedParcel.assigned_agent_id
                                            ? `Agent ${selectedParcel.assigned_agent_id}`
                                            : "-"
                                    }
                                </span>

                                <b>Failure Reason</b>
                                <span>
                                    {selectedParcel.failure_reason || "-"}
                                </span>

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

            {
                showFailureModal && (

                    <div
                        style={{
                            position: "fixed",
                            inset: 0,
                            background: "rgba(15,23,42,0.35)",
                            backdropFilter: "blur(8px)",
                            WebkitBackdropFilter: "blur(8px)",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            zIndex: 9999
                        }}
                    >

                        <div
                            style={{
                                background: "white",
                                padding: "30px",
                                borderRadius: "20px",
                                width: "450px",
                                boxShadow:
                                    "0 20px 40px rgba(0,0,0,0.15)"
                            }}
                        >

                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "14px",
                                    marginBottom: "20px"
                                }}
                            >

                                <span
                                    style={{
                                        fontSize: "34px"
                                    }}
                                >
                                    ⚠️
                                </span>

                                <div>

                                    <h2
                                        style={{
                                            margin: 0,
                                            fontSize: "34px"
                                        }}
                                    >
                                        Failed Delivery
                                    </h2>

                                    <p
                                        style={{
                                            margin: 0,
                                            color: "#64748b",
                                            fontSize: "15px"
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
                                    padding: "16px",
                                    borderRadius: "14px",
                                    border: "2px solid #e2e8f0",
                                    fontSize: "16px",
                                    outline: "none",
                                    marginBottom: "25px"
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
                                    gap: "12px"
                                }}
                            >

                                <button
                                    onClick={
                                        submitFailure
                                    }

                                    disabled={
                                        !failureReason
                                    }

                                    style={{
                                        flex: 1,

                                        background:
                                            failureReason
                                                ? "#ef4444"
                                                : "#d1d5db",

                                        color: "white",

                                        border: "none",

                                        padding: "14px",

                                        borderRadius: "12px",

                                        fontWeight: "600",

                                        cursor:
                                            failureReason
                                                ? "pointer"
                                                : "not-allowed"
                                    }}
                                >
                                    Mark Failed
                                </button>

                                <button
                                    onClick={() => {

                                        setShowFailureModal(
                                            false
                                        );

                                        setFailureReason("");

                                    }}

                                    style={{
                                        flex: 1,
                                        background: "#334155",
                                        color: "white",
                                        border: "none",
                                        padding: "14px",
                                        borderRadius: "12px",
                                        fontWeight: "600",
                                        cursor: "pointer"
                                    }}
                                >
                                    Cancel
                                </button>

                            </div>

                        </div>

                    </div>

                )
            }

        </AgentLayout>

    );

}

export default MyParcels;