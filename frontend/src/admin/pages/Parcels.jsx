import { useEffect, useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import api from "../../api/axios";
import MainLayout from "../components/MainLayout";
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";
//import { FiPackage } from "react-icons/fi";

import {
    FiPackage,
    FiTruck,
    FiCheckCircle,
    FiXCircle,
    FiUploadCloud
} from "react-icons/fi";

import { FiMapPin } from "react-icons/fi";

import { FaBoxesStacked } from "react-icons/fa6";

function Parcels() {
  const navigate = useNavigate();

  const [parcels, setParcels] = useState([]);

  const [selectedFilter, setSelectedFilter] = useState("All");

  const [showFailedModal, setShowFailedModal] = useState(false);

  const [selectedParcelId, setSelectedParcelId] = useState(null);

  const [failureReason, setFailureReason] = useState("");

  const [selectedParcel, setSelectedParcel] = useState(null);

  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const [showModal, setShowModal] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const disabledButton = {
    padding: "6px 10px",
    border: "none",
    borderRadius: "6px",
    background: "#d1d5db",
    color: "#6b7280",
    cursor: "not-allowed",
  };

  const fetchParcels = async () => {
    try {
      const response = await api.get("/parcels/");

      const statusOrder = {
        Received: 1,
        Assigned: 2,
        OutForDelivery: 3,
        FailedDelivery: 4,
        Delivered: 5,
      };

      const sortedParcels = response.data.sort(
        (a, b) => statusOrder[a.status] - statusOrder[b.status],
      );

      setParcels(sortedParcels);
    } catch (error) {
      console.error("Parcel Error:", error);
    }
  };

  const outForDelivery = async (parcelId) => {
    try {
      await api.patch(`/parcels/${parcelId}/out-for-delivery`);

      fetchParcels();
    } catch (error) {
      console.error(error);
    }
  };

  const markDelivered = async (parcelId) => {
    try {
      await api.patch(`/parcels/${parcelId}/delivered`);

      fetchParcels();
    } catch (error) {
      console.error(error);
    }
  };

  const reassignParcel = async (parcelId) => {
    try {
      await api.post(`/parcels/${parcelId}/reassign`);

      fetchParcels();
    } catch (error) {
      setErrorMessage(
        error.response?.data?.detail || "Failed to reassign parcel",
      );
    }
  };

  const openFailedModal = (parcelId) => {
    setSelectedParcelId(parcelId);

    setShowFailedModal(true);
  };

  const submitFailedDelivery = async () => {
    console.log("Selected Reason:", failureReason);

    try {
      const response = await api.patch(`/parcels/${selectedParcelId}/failed`, {
        reason: failureReason,
      });

      console.log("API Response:", response.data);

      setShowFailedModal(false);

      fetchParcels();
    } catch (error) {
      console.error("Failed Delivery Error:", error);
    }
  };

  const filteredParcels = parcels.filter((parcel) => {
    if (selectedFilter === "All") return true;

    if (selectedFilter === "Reassigned") return parcel.history_count > 1;

    return parcel.status === selectedFilter;
  });

  const viewParcelDetails = async (parcelId) => {
    try {
      const response = await api.get(`/parcels/${parcelId}`);

      setSelectedParcel(response.data);

      setShowModal(true);
    } catch (error) {
      console.error(error);
    }
  };

  const filters = [
    {
      label: (
        <>
          <FaBoxesStacked /> All Parcels
        </>
      ),
      value: "All",
    },
    {
      label: (
        <>
          <FiPackage /> Assigned
        </>
      ),
      value: "Assigned",
    },
    {
      label: (
        <>
          <FiTruck /> Out For Delivery
        </>
      ),
      value: "OutForDelivery",
    },
    {
      label: (
        <>
          <FiCheckCircle /> Delivered
        </>
      ),
      value: "Delivered",
    },
    {
      label: (
        <>
          <FiXCircle /> Failed Delivery
        </>
      ),
      value: "FailedDelivery",
    },
  ];

  useEffect(() => {
    fetchParcels();
  }, []);

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
            <FiPackage size={30} color="#2563eb" />

            <h1>Parcels</h1>
          </div>

          {errorMessage && (
            <div
              style={{
                background: "#fee2e2",
                color: "#b91c1c",
                padding: "14px",
                borderRadius: "10px",
                marginTop: "15px",
                marginBottom: "15px",
                fontWeight: "600",
              }}
            >
              ⚠ {errorMessage}
            </div>
          )}

          <div
            style={{
                display: "flex",
                gap: "12px"
            }}
        >

            <button
                onClick={() =>
                    navigate("/create-parcel")
                }

                style={{
                    background: "#2563eb",
                    color: "white",
                    border: "none",
                    padding: "12px 20px",
                    borderRadius: "10px",
                    cursor: "pointer",
                    fontWeight: "600"
                }}
            >
                + Create Parcel
            </button>

            <button
                onClick={() =>
                    navigate("/bulk-import")
                }

                style={{
                    background: "#0f172a",
                    color: "white",
                    border: "none",
                    padding: "12px 20px",
                    borderRadius: "10px",
                    cursor: "pointer",

                    display: "flex",
                    alignItems: "center",
                    gap: "8px",

                    fontWeight: "600"
                }}
            >

                <FiUploadCloud size={18} />

                Bulk Import

            </button>

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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              marginBottom: "25px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <HiOutlineAdjustmentsHorizontal size={22} color="#2563eb" />

              <span
                style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  color: "#334155",
                }}
              >
                Filter Parcels
              </span>
            </div>

            <div
              style={{
                position: "relative",
                width: "230px",
              }}
            >
              <div
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                style={{
                  background: "white",
                  padding: "14px 18px",
                  borderRadius: "16px",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "16px",
                  border: "2px solid #e2e8f0",
                }}
              >
                {filters.find((f) => f.value === selectedFilter)?.label}

                <span>{showFilterDropdown ? "▲" : "▼"}</span>
              </div>

              {showFilterDropdown && (
                <div
                  style={{
                    position: "absolute",
                    top: "60px",
                    width: "100%",
                    background: "white",
                    borderRadius: "18px",
                    boxShadow: "0 15px 35px rgba(0,0,0,0.15)",
                    overflow: "hidden",
                    zIndex: 1000,
                  }}
                >
                  {filters.map((filter) => (
                    <div
                      key={filter.value}
                      onClick={() => {
                        setSelectedFilter(filter.value);

                        setShowFilterDropdown(false);
                      }}
                      onMouseEnter={(e) => {
                        if (selectedFilter !== filter.value) {
                          e.currentTarget.style.background = "#f8fafc";
                        }

                        e.currentTarget.style.transform = "translateX(5px)";
                      }}
                      onMouseLeave={(e) => {
                        if (selectedFilter !== filter.value) {
                          e.currentTarget.style.background = "white";
                        }

                        e.currentTarget.style.transform = "translateX(0)";
                      }}
                      style={{
                        padding: "14px 18px",

                        cursor: "pointer",

                        fontWeight: "500",

                        fontSize: "15px",

                        display: "flex",

                        alignItems: "center",

                        gap: "10px",

                        transition: "all 0.3s ease",

                        background:
                          selectedFilter === filter.value ? "#eff6ff" : "white",

                        borderBottom:
                          filter.value !== "FailedDelivery"
                            ? "1px solid #f1f5f9"
                            : "none",
                      }}
                    >
                      {filter.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

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
                  Tracking No
                </th>

                <th
                  style={{
                    textAlign: "left",
                    padding: "12px",
                  }}
                >
                  Customer ID
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
                  Agent
                </th>

                <th
                  style={{
                    textAlign: "left",
                    padding: "12px",
                    width: "300px",
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredParcels.map((parcel) => (
                <tr key={parcel.id} className="table-row">
                  <td
                    style={{
                      padding: "16px",
                      color: "#2563eb",
                      fontWeight: "600",
                      cursor: "pointer",
                      textDecoration: "underline",
                    }}
                    onClick={() => viewParcelDetails(parcel.id)}
                  >
                    {parcel.tracking_number}
                  </td>

                  <td
                    style={{
                      padding: "12px",
                      borderTop: "1px solid #e5e7eb",
                    }}
                  >
                    {parcel.customer_id}
                  </td>

                  <td
                    style={{
                      padding: "12px",
                      borderTop: "1px solid #e5e7eb",
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
                      borderTop: "1px solid #e5e7eb",
                    }}
                  >
                    {parcel.assigned_agent_id
                      ? `Agent ${parcel.assigned_agent_id}`
                      : "-"}
                  </td>

                  <td
                    style={{
                      padding: "12px",
                      borderTop: "1px solid #e5e7eb",
                      minWidth: "420px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        alignItems: "center",
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
                                cursor: "pointer",
                              }
                            : disabledButton
                        }
                      >
                        Out
                      </button>

                      <button
                        disabled={parcel.status !== "OutForDelivery"}
                        onClick={() => openFailedModal(parcel.id)}
                        style={
                          parcel.status === "OutForDelivery"
                            ? {
                                padding: "6px 10px",
                                border: "none",
                                borderRadius: "6px",
                                background: "#ef4444",
                                color: "white",
                                cursor: "pointer",
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
                                cursor: "pointer",
                              }
                            : disabledButton
                        }
                      >
                        Delivered
                      </button>

                      <button
                        disabled={parcel.status !== "FailedDelivery"}
                        onClick={() => reassignParcel(parcel.id)}
                        style={
                          parcel.status === "FailedDelivery"
                            ? {
                                padding: "6px 10px",
                                border: "none",
                                borderRadius: "6px",
                                background: "#2563eb",
                                color: "white",
                                cursor: "pointer",
                              }
                            : disabledButton
                        }
                      >
                        Reassign
                      </button>

                      {parcel.history_count > 1 ? (
                        <Link
                          to={`/parcel-history/${parcel.id}`}
                          style={{
                            textDecoration: "none",
                            background: "#334155",
                            color: "white",
                            padding: "6px 10px",
                            borderRadius: "6px",
                            fontSize: "14px",
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
                            cursor: "not-allowed",
                          }}
                        >
                          📜 History
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showModal && selectedParcel && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "rgba(0,0,0,0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 9999,
            }}
          >
            <div
              style={{
                background: "white",
                width: "580px",
                padding: "30px",
                borderRadius: "20px",
                boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
              >
                <h2>📦 Parcel Details</h2>

                <button
                  onClick={() => setShowModal(false)}
                  style={{
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                    fontSize: "22px",
                  }}
                >
                  ✕
                </button>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "190px 1fr",
                  rowGap: "16px",
                  marginTop: "25px",
                }}
              >
                <b>Tracking Number :</b>
                <span>{selectedParcel.tracking_number}</span>

                <b>Customer Name :</b>
                <span>{selectedParcel.customer_name || "-"}</span>

                <b>Customer ID :</b>
                <span>{selectedParcel.customer_id}</span>

                <b>Phone Number :</b>
                <span>{selectedParcel.phone || "-"}</span>

                <b>Delivery Address :</b>

                <div>
                  <p
                    style={{
                      margin: 0,
                      color: "#475569",
                      lineHeight: "1.8",
                    }}
                  >
                    {selectedParcel.address || "-"}
                  </p>

                  {selectedParcel.address && (
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        selectedParcel.address,
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        width: "fit-content",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "10px 16px",
                        background: "#eff6ff",
                        color: "#2563eb",
                        borderRadius: "12px",
                        textDecoration: "none",
                        fontSize: "14px",
                        fontWeight: "600",
                      }}
                    >
                      <FiMapPin size={16} />
                      Open in Google Maps
                    </a>
                  )}
                </div>

                <b>Amount :</b>

                <span>₹ {selectedParcel.amount}</span>

                <b>Payment Method :</b>

                <span>{selectedParcel.payment_method}</span>

                <b>Payment Status :</b>

                <span
                  style={{
                    color:
                      selectedParcel.payment_status === "Paid"
                        ? "#16a34a"
                        : "#dc2626",

                    fontWeight: "700",
                  }}
                >
                  {selectedParcel.payment_status}
                </span>

                <b>Status :</b>

                <span>
                  <span
                    style={{
                      padding: "8px 16px",

                      borderRadius: "999px",

                      background:
                        selectedParcel.status === "Delivered"
                          ? "#dcfce7"
                          : selectedParcel.status === "FailedDelivery"
                            ? "#fee2e2"
                            : "#fef3c7",

                      color:
                        selectedParcel.status === "Delivered"
                          ? "#16a34a"
                          : selectedParcel.status === "FailedDelivery"
                            ? "#b91c1c"
                            : "#92400e",

                      fontWeight: "700",
                    }}
                  >
                    {selectedParcel.status}
                  </span>
                </span>

                {selectedParcel.failure_reason && (
                  <>
                    <b>Failure Reason :</b>

                    <span
                      style={{
                        color: "#dc2626",
                        fontWeight: "600",
                      }}
                    >
                      {selectedParcel.failure_reason}
                    </span>
                  </>
                )}

                <b>Assigned Agent :</b>

                <span>
                  {selectedParcel.assigned_agent_id
                    ? `Agent ${selectedParcel.assigned_agent_id}`
                    : "-"}
                </span>

                <b>Created At :</b>

                <span>
                  {new Date(selectedParcel.created_at).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}
      </MainLayout>

      {showFailedModal && (
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
          }}
        >
          <div
            style={{
              background: "white",
              padding: "24px",
              borderRadius: "12px",
              width: "400px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "15px",
              }}
            >
              <span
                style={{
                  fontSize: "28px",
                }}
              >
                ⚠️
              </span>

              <div>
                <h2
                  style={{
                    margin: 0,
                  }}
                >
                  Failed Delivery
                </h2>

                <p
                  style={{
                    margin: 0,
                    color: "#6b7280",
                    fontSize: "14px",
                  }}
                >
                  Select a failure reason
                </p>
              </div>
            </div>

            <select
              value={failureReason}
              onChange={(e) => setFailureReason(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "10px",
                border: "1px solid #d1d5db",
                fontSize: "15px",
                marginTop: "10px",
              }}
            >
              <option value="">Select Reason</option>

              <option value="Customer Not Available">
                Customer Not Available
              </option>

              <option value="Address Not Reachable">
                Address Not Reachable
              </option>

              <option value="Phone Not Reachable">Phone Not Reachable</option>

              <option value="Customer Refused Delivery">
                Customer Refused Delivery
              </option>

              <option value="Other">Other</option>
            </select>

            <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "15px",
              }}
            >
              <button
                onClick={submitFailedDelivery}
                disabled={!failureReason}
                style={{
                  background: failureReason ? "#ef4444" : "#d1d5db",

                  color: "white",

                  border: "none",

                  padding: "10px 18px",

                  borderRadius: "10px",

                  cursor: failureReason ? "pointer" : "not-allowed",

                  fontWeight: "600",
                }}
              >
                Mark Failed
              </button>

              <button
                onClick={() => setShowFailedModal(false)}
                style={{
                  background: "#334155",
                  color: "white",
                  border: "none",
                  padding: "10px 18px",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Parcels;