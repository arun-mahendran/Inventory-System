import { useEffect, useMemo, useState } from "react";

import api from "../../api/axios";

import AgentLayout from "../components/AgentLayout";

import { FiChevronUp, FiChevronDown } from "react-icons/fi";

import { toast } from "react-toastify";

import {
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiXCircle,
  FiFilter,
  FiMapPin,
  FiSearch,
  FiDownload,
  FiCalendar,
  FiSend,
  FiCheck,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

import { FaBoxesStacked } from "react-icons/fa6";

const PAGE_SIZE = 6;

const Shimmer = ({ width = "100%", height = "16px", radius = "8px", style = {} }) => (
  <div
    className="skeleton-shimmer"
    style={{
      width,
      height,
      borderRadius: radius,
      background: "#e5e7eb",
      position: "relative",
      overflow: "hidden",
      ...style,
    }}
  />
);

function MyParcels() {
  const [parcels, setParcels] = useState([]);

  // Only show skeleton if this is the first load in this session
  const hasLoadedBefore = sessionStorage.getItem("myParcelsLoaded") === "true";

  const [loading, setLoading] = useState(!hasLoadedBefore);

  const [filterStatus, setFilterStatus] = useState("All");

  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const [selectedParcel, setSelectedParcel] = useState(null);

  const [showModal, setShowModal] = useState(false);

  const [showFailureModal, setShowFailureModal] = useState(false);

  const [selectedParcelId, setSelectedParcelId] = useState(null);

  const [failureReason, setFailureReason] = useState("");

  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

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
          <FiXCircle /> Failed
        </>
      ),
      value: "FailedDelivery",
    },
  ];

  const fetchParcels = async (isInitial = false) => {
    try {
      if (isInitial && !hasLoadedBefore) {
        setLoading(true);
      }

      const agentId = localStorage.getItem("delivery_agent_id");

      if (!agentId) {
        console.error("Delivery Agent ID not found");
        setLoading(false);
        return;
      }

      const response = await api.get("/parcels/", {
        params: {
          agent_id: agentId,
        },
      });

      const statusOrder = {
        Assigned: 1,
        OutForDelivery: 2,
        FailedDelivery: 3,
        Delivered: 4,
      };

      const sortedParcels = response.data.sort(
        (a, b) => statusOrder[a.status] - statusOrder[b.status],
      );

      setParcels(sortedParcels);

      // Mark that we've successfully loaded once this session
      sessionStorage.setItem("myParcelsLoaded", "true");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParcels(true);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus, searchTerm]);

  const startDelivery = async (parcelId) => {
    try {
      await api.patch(`/parcels/${parcelId}/out-for-delivery`);

      fetchParcels();
    } catch (error) {
      console.log(error);
    }
  };

  const markDelivered = async (parcelId) => {
    try {
      await api.patch(`/parcels/${parcelId}/delivered`);

      toast.success("Parcel Delivered Successfully");

      fetchParcels();
    } catch (error) {
      console.log(error);
    }
  };

  const collectPayment = async (parcelId) => {
    try {
      await api.patch(`/parcels/${parcelId}/collect-payment`);

      toast.success("Payment Collected Successfully");

      setParcels((prev) =>
        prev.map((parcel) =>
          parcel.id === parcelId
            ? {
                ...parcel,
                payment_status: "Paid",
              }
            : parcel,
        ),
      );
    } catch (error) {
      console.log(error);

      toast.error("Unable to collect payment");
    }
  };

  const reportFailure = (parcelId) => {
    setSelectedParcelId(parcelId);

    setShowFailureModal(true);
  };

  const submitFailure = async () => {
    if (!failureReason.trim()) {
      alert("Please enter failure reason");

      return;
    }

    try {
      await api.patch(`/parcels/${selectedParcelId}/failed`, {
        reason: failureReason,
      });

      setShowFailureModal(false);

      setFailureReason("");

      toast.error("Parcel Marked as Failed");

      fetchParcels();
    } catch (error) {
      console.log(error);
    }
  };

  const viewParcelDetails = (parcel) => {
    setSelectedParcel(parcel);

    setShowModal(true);
  };

  const exportParcels = () => {
    if (!filteredParcels.length) {
      toast.info("No parcels to export");

      return;
    }

    const headers = [
      "Tracking No",
      "Customer ID",
      "Status",
      "Created At",
      "Payment Status",
    ];

    const rows = filteredParcels.map((p) => [
      p.tracking_number,
      p.customer_id,
      p.status,
      new Date(p.created_at).toLocaleDateString(),
      p.payment_status,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell ?? ""}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.setAttribute("download", "my-parcels.csv");

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  };

  // ---- Derived data ----

  const stats = useMemo(() => {
    return {
      total: parcels.length,
      outForDelivery: parcels.filter((p) => p.status === "OutForDelivery")
        .length,
      delivered: parcels.filter((p) => p.status === "Delivered").length,
      failed: parcels.filter((p) => p.status === "FailedDelivery").length,
    };
  }, [parcels]);

  const filteredParcels = (() => {

   let list =
      filterStatus === "All"
         ? parcels
         : parcels.filter(parcel => parcel.status === filterStatus);

   if (searchTerm.trim()) {

      const term = searchTerm.trim().toLowerCase();

      list = list.filter(
         parcel =>
            parcel.tracking_number &&
            parcel.tracking_number.toLowerCase().includes(term)
      );
   }

   return list;

})();

  const totalPages = Math.max(
    1,
    Math.ceil(filteredParcels.length / PAGE_SIZE),
  );

  const paginatedParcels = filteredParcels.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const rangeStart = filteredParcels.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;

  const rangeEnd = Math.min(currentPage * PAGE_SIZE, filteredParcels.length);

  const getPageNumbers = () => {
    const pages = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);

      return pages;
    }

    pages.push(1);

    if (currentPage > 3) pages.push("...");

    const start = Math.max(2, currentPage - 1);

    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) pages.push(i);

    if (currentPage < totalPages - 2) pages.push("...");

    pages.push(totalPages);

    return pages;
  };

  // ---- Style helpers ----

  const statusColors = {
    Delivered: { bg: "#dcfce7", text: "#16a34a" },
    FailedDelivery: { bg: "#fee2e2", text: "#dc2626" },
    OutForDelivery: { bg: "#fef3c7", text: "#d97706" },
    Assigned: { bg: "#e0e7ff", text: "#4338ca" },
  };

  const statusLabels = {
    Delivered: "Delivered",
    FailedDelivery: "Failed",
    OutForDelivery: "Out for Delivery",
    Assigned: "Assigned",
  };

  const statusBadge = (status) => {
    const colors = statusColors[status] || { bg: "#f1f5f9", text: "#475569" };

    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          padding: "6px 14px",
          borderRadius: "20px",
          fontWeight: "600",
          fontSize: "13px",
          background: colors.bg,
          color: colors.text,
        }}
      >
        <span
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: colors.text,
            display: "inline-block",
          }}
        />
        {statusLabels[status] || status}
      </span>
    );
  };

  const actionButtonStyle = (color, disabled) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "4px",
    flex: 1,
    padding: "7px 8px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    background: "white",
    color: disabled ? "#cbd5e1" : color,
    fontWeight: "600",
    fontSize: "12px",
    cursor: disabled ? "not-allowed" : "pointer",
    whiteSpace: "nowrap",
    minWidth: 0,
  });

  const statCards = [
    {
      key: "total",
      label: "Total Parcels",
      sub: "All assigned parcels",
      value: stats.total,
      icon: <FiPackage size={22} color="#2563eb" />,
      iconBg: "#dbeafe",
      cardBg: "#f5f8ff",
      valueColor: "#2563eb",
    },
    {
      key: "out",
      label: "Out for Delivery",
      sub: "Currently on the way",
      value: stats.outForDelivery,
      icon: <FiTruck size={22} color="#f97316" />,
      iconBg: "#fed7aa",
      cardBg: "#fff8f1",
      valueColor: "#f97316",
    },
    {
      key: "delivered",
      label: "Delivered",
      sub: "Successfully delivered",
      value: stats.delivered,
      icon: <FiCheckCircle size={22} color="#16a34a" />,
      iconBg: "#bbf7d0",
      cardBg: "#f2fbf5",
      valueColor: "#16a34a",
    },
    {
      key: "failed",
      label: "Failed Delivery",
      sub: "Delivery failed",
      value: stats.failed,
      icon: <FiXCircle size={22} color="#dc2626" />,
      iconBg: "#fecaca",
      cardBg: "#fdf3f3",
      valueColor: "#dc2626",
    },
  ];

  return (
    <AgentLayout>
      <style>{`
        .skeleton-shimmer::after {
          content: "";
          position: absolute;
          inset: 0;
          transform: translateX(-100%);
          background: linear-gradient(
            90deg,
            rgba(255,255,255,0) 0%,
            rgba(255,255,255,0.6) 50%,
            rgba(255,255,255,0) 100%
          );
          animation: skeleton-shimmer 1.4s infinite;
        }
        @keyframes skeleton-shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          marginBottom: "4px",
        }}
      >
        <FiPackage size={30} color="#2563eb" />

        <h1 style={{ margin: 0, fontSize: "28px" }}>My Parcels</h1>
      </div>

      <p
        style={{
          color: "#64748b",
          fontSize: "15px",
          marginTop: "4px",
          marginBottom: "24px",
        }}
      >
        View and manage all your assigned parcels.
      </p>

      {/* Stat Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
          marginBottom: "24px",
        }}
      >
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                style={{
                  background: "#f8fafc",
                  borderRadius: "18px",
                  padding: "22px",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    marginBottom: "14px",
                  }}
                >
                  <Shimmer width="46px" height="46px" radius="12px" />
                  <Shimmer width="120px" height="14px" />
                </div>
                <Shimmer width="60px" height="30px" style={{ marginBottom: "8px" }} />
                <Shimmer width="140px" height="13px" />
              </div>
            ))
          : statCards.map((card) => (
              <div
                key={card.key}
                style={{
                  background: card.cardBg,
                  borderRadius: "18px",
                  padding: "22px",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    marginBottom: "14px",
                  }}
                >
                  <div
                    style={{
                      width: "46px",
                      height: "46px",
                      borderRadius: "12px",
                      background: card.iconBg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {card.icon}
                  </div>

                  <span style={{ fontWeight: "600", color: "#334155" }}>
                    {card.label}
                  </span>
                </div>

                <div
                  style={{
                    fontSize: "30px",
                    fontWeight: "700",
                    color: card.valueColor,
                    lineHeight: 1,
                  }}
                >
                  {card.value}
                </div>

                <div
                  style={{
                    fontSize: "13px",
                    color: "#64748b",
                    marginTop: "6px",
                  }}
                >
                  {card.sub}
                </div>
              </div>
            ))}
      </div>

      {/* Main Card */}
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
            gap: "14px",
            marginBottom: "22px",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              flex: "1 1 260px",
              position: "relative",
              minWidth: "220px",
            }}
          >
            <FiSearch
              size={18}
              color="#94a3b8"
              style={{
                position: "absolute",
                left: "14px",
                top: "50%",
                transform: "translateY(-50%)",
              }}
            />

            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search tracking number..."
              style={{
                width: "100%",
                padding: "12px 14px 12px 40px",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                fontSize: "14px",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <button
            onClick={() => setShowFilterDropdown((prev) => !prev)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 18px",
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              background: "white",
              fontWeight: "600",
              color: "#334155",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            <FiFilter size={16} />
            Filter
          </button>

          <div style={{ position: "relative", width: "220px" }}>
            <div
              onClick={() => setShowFilterDropdown((prev) => !prev)}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 16px",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                background: "white",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "14px",
                color: "#334155",
              }}
            >
              {filters.find((f) => f.value === filterStatus)?.label}

              <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                {showFilterDropdown ? "▲" : "▼"}
              </span>
            </div>

            {showFilterDropdown && (
              <div
                style={{
                  position: "absolute",
                  top: "54px",
                  right: 0,
                  width: "230px",
                  background: "white",
                  borderRadius: "14px",
                  boxShadow: "0 15px 35px rgba(0,0,0,0.15)",
                  overflow: "hidden",
                  zIndex: 1000,
                }}
              >
                {filters.map((filter) => (
                  <div
                    key={filter.value}
                    onClick={() => {
                      setFilterStatus(filter.value);

                      setShowFilterDropdown(false);
                    }}
                    style={{
                      padding: "12px 16px",
                      cursor: "pointer",
                      fontWeight: "500",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      fontSize: "14px",
                      background:
                        filterStatus === filter.value ? "#eff6ff" : "white",
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

          <button
            onClick={exportParcels}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "12px 18px",
              borderRadius: "12px",
              border: "1px solid #0f172a",
              background: "white",
              fontWeight: "600",
              color: "#0f172a",
              cursor: "pointer",
              fontSize: "14px",
              marginLeft: "auto",
            }}
          >
            <FiDownload size={16} />
            Export
          </button>
        </div>

        <div style={{ width: "100%" }}>
          <table
            style={{
              width: "100%",
              tableLayout: "fixed",
              borderCollapse: "collapse",
            }}
          >
            <colgroup>
              <col style={{ width: "14%" }} />
              <col style={{ width: "14%" }} />   {/* Customer ID: 11% → 14% */}
              <col style={{ width: "15%" }} />
              <col style={{ width: "13%" }} />
              <col style={{ width: "13%" }} />
              <col style={{ width: "31%" }} />   {/* Actions: 34% → 31% */}
            </colgroup>

            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {[
                  { label: "Tracking No", sortable: true },
                  { label: "Customer ID", sortable: true, extraPad: true },
                  { label: "Status", sortable: true },
                  { label: "Created At", sortable: true },
                  { label: "Payment", sortable: false },
                  { label: "Actions", sortable: false },
                ].map((col) => (
                  <th
                    key={col.label}
                    style={{
                      padding: "14px 20px",
                      paddingRight: col.extraPad ? "40px" : "20px",
                      textAlign: "left",
                      borderBottom: "1px solid #e5e7eb",
                      color: "#64748b",
                      fontWeight: "700",
                      fontSize: "12.5px",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      {col.label}

                      {col.sortable && (
                        <span
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            lineHeight: 0,
                            marginTop: "-2px",
                          }}
                        >
                          <FiChevronUp size={11} style={{ color: "#3b5bfd" }} />
                          <FiChevronDown
                            size={11}
                            style={{ color: "#cbd5e1", marginTop: "-3px" }}
                          />
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                Array.from({ length: PAGE_SIZE }).map((_, i) => (
                  <tr key={`skeleton-${i}`}>
                    <td style={{ padding: "14px 20px", borderBottom: "1px solid #e5e7eb" }}>
                      <Shimmer width="90%" height="14px" />
                    </td>
                    <td style={{ padding: "14px 20px", borderBottom: "1px solid #e5e7eb" }}>
                      <Shimmer width="70%" height="14px" />
                    </td>
                    <td style={{ padding: "14px 20px", borderBottom: "1px solid #e5e7eb" }}>
                      <Shimmer width="100px" height="24px" radius="20px" />
                    </td>
                    <td style={{ padding: "14px 20px", borderBottom: "1px solid #e5e7eb" }}>
                      <Shimmer width="80px" height="14px" />
                    </td>
                    <td style={{ padding: "14px 20px", borderBottom: "1px solid #e5e7eb" }}>
                      <Shimmer width="90px" height="24px" radius="20px" />
                    </td>
                    <td style={{ padding: "14px 20px", borderBottom: "1px solid #e5e7eb" }}>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <Shimmer width="100%" height="30px" radius="8px" />
                        <Shimmer width="100%" height="30px" radius="8px" />
                        <Shimmer width="100%" height="30px" radius="8px" />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <>
                  {paginatedParcels.map((parcel) => (
                    <tr key={parcel.id}>
                      <td
                        style={{
                          padding: "14px 20px",
                          borderBottom: "1px solid #e5e7eb",
                          verticalAlign: "middle",
                          color: "#2563eb",
                          fontWeight: "600",
                          cursor: "pointer",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                        onClick={() => viewParcelDetails(parcel)}
                        title={parcel.tracking_number}
                      >
                        {parcel.tracking_number}
                      </td>

                      <td
                        style={{
                          padding: "14px 20px",
                          paddingRight: "40px",
                          borderBottom: "1px solid #e5e7eb",
                          verticalAlign: "middle",
                          color: "#334155",
                        }}
                      >
                        {parcel.customer_id}
                      </td>

                      <td
                        style={{
                          padding: "14px 20px",
                          borderBottom: "1px solid #e5e7eb",
                          verticalAlign: "middle",
                        }}
                      >
                        {statusBadge(parcel.status)}
                      </td>

                      <td
                        style={{
                          padding: "14px 20px",
                          borderBottom: "1px solid #e5e7eb",
                          verticalAlign: "middle",
                          color: "#475569",
                        }}
                      >
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <FiCalendar size={14} color="#94a3b8" />
                          {new Date(parcel.created_at).toLocaleDateString(
                            "en-US",
                          )}
                        </span>
                      </td>

                      <td
                        style={{
                          padding: "14px 20px",
                          borderBottom: "1px solid #e5e7eb",
                          verticalAlign: "middle",
                        }}
                      >
                        {parcel.payment_method === "Prepaid" ||
                        parcel.payment_status !== "Pending" ? (
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "6px",
                              padding: "6px 14px",
                              borderRadius: "20px",
                              fontWeight: "600",
                              fontSize: "13px",
                              background: "#dcfce7",
                              color: "#16a34a",
                            }}
                          >
                            <FiCheck size={13} />
                            Paid
                          </span>
                        ) : (
                          <button
                            disabled={parcel.status !== "OutForDelivery"}
                            onClick={() => collectPayment(parcel.id)}
                            style={actionButtonStyle(
                              "#8b5cf6",
                              parcel.status !== "OutForDelivery",
                            )}
                          >
                            Collect ₹{parcel.amount}
                          </button>
                        )}
                      </td>

                      <td
                        style={{
                          padding: "14px 20px",
                          borderBottom: "1px solid #e5e7eb",
                          verticalAlign: "middle",
                        }}
                      >
                        <div style={{ display: "flex", gap: "6px" }}>
                          <button
                            disabled={parcel.status !== "Assigned"}
                            onClick={() => startDelivery(parcel.id)}
                            style={actionButtonStyle(
                              "#2563eb",
                              parcel.status !== "Assigned",
                            )}
                          >
                            <FiSend size={14} />
                            Out
                          </button>

                          <button
                            disabled={
                              parcel.status !== "OutForDelivery" ||
                              (parcel.payment_method === "CashOnDelivery" &&
                                parcel.payment_status === "Paid")
                            }
                            onClick={() => reportFailure(parcel.id)}
                            title={
                              parcel.payment_method === "CashOnDelivery" &&
                              parcel.payment_status === "Paid"
                                ? "Cash already collected — delivery can't be marked as failed"
                                : undefined
                            }
                            style={actionButtonStyle(
                              "#dc2626",
                              parcel.status !== "OutForDelivery" ||
                                (parcel.payment_method === "CashOnDelivery" &&
                                  parcel.payment_status === "Paid"),
                            )}
                          >
                            <FiXCircle size={14} />
                            Failed
                          </button>

                          <button
                            disabled={
                              parcel.status !== "OutForDelivery" ||
                              (parcel.payment_method === "CashOnDelivery" &&
                                parcel.payment_status !== "Paid")
                            }
                            onClick={() => markDelivered(parcel.id)}
                            style={actionButtonStyle(
                              "#16a34a",
                              parcel.status !== "OutForDelivery" ||
                                (parcel.payment_method === "CashOnDelivery" &&
                                  parcel.payment_status !== "Paid"),
                            )}
                          >
                            <FiCheckCircle size={14} />
                            Delivered
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {paginatedParcels.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        style={{
                          padding: "40px 18px",
                          textAlign: "center",
                          color: "#94a3b8",
                        }}
                      >
                        No parcels found.
                      </td>
                    </tr>
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "20px",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <span style={{ color: "#64748b", fontSize: "14px" }}>
            Showing {rangeStart} to {rangeEnd} of {filteredParcels.length}{" "}
            parcels
          </span>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                border: "1px solid #e2e8f0",
                background: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: currentPage === 1 ? "not-allowed" : "pointer",
                color: currentPage === 1 ? "#cbd5e1" : "#334155",
              }}
            >
              <FiChevronLeft size={16} />
            </button>

            {getPageNumbers().map((page, idx) =>
              page === "..." ? (
                <span
                  key={`ellipsis-${idx}`}
                  style={{ padding: "0 4px", color: "#94a3b8" }}
                >
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    border:
                      page === currentPage
                        ? "none"
                        : "1px solid #e2e8f0",
                    background: page === currentPage ? "#2563eb" : "white",
                    color: page === currentPage ? "white" : "#334155",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  {page}
                </button>
              ),
            )}

            <button
              onClick={() =>
                setCurrentPage((p) => Math.min(totalPages, p + 1))
              }
              disabled={currentPage === totalPages}
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                border: "1px solid #e2e8f0",
                background: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor:
                  currentPage === totalPages ? "not-allowed" : "pointer",
                color: currentPage === totalPages ? "#cbd5e1" : "#334155",
              }}
            >
              <FiChevronRight size={16} />
            </button>
          </div>
        </div>
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
                gridTemplateColumns: "180px 1fr",
                rowGap: "15px",
                marginTop: "20px",
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

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <span
                  style={{
                    lineHeight: "1.8",
                    color: "#475569",
                    wordBreak: "break-word",
                  }}
                >
                  {selectedParcel.address || "-"}
                </span>
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
                  fontWeight: "600",
                }}
              >
                {selectedParcel.payment_status}
              </span>

              <b>Status :</b>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  minHeight: "40px",
                }}
              >
                {statusBadge(selectedParcel.status)}
              </div>

              {selectedParcel.status === "FailedDelivery" && (
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

              <b>Created At :</b>

              <span>
                {new Date(selectedParcel.created_at).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}

      {showFailureModal && (
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
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "white",
              padding: "30px",
              borderRadius: "20px",
              width: "450px",
              boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                marginBottom: "20px",
              }}
            >
              <span style={{ fontSize: "34px" }}>⚠️</span>

              <div>
                <h2 style={{ margin: 0, fontSize: "28px" }}>
                  Failed Delivery
                </h2>

                <p
                  style={{
                    margin: 0,
                    color: "#64748b",
                    fontSize: "15px",
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
                padding: "16px",
                borderRadius: "14px",
                border: "2px solid #e2e8f0",
                fontSize: "16px",
                outline: "none",
                marginBottom: "25px",
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

            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={submitFailure}
                disabled={!failureReason}
                style={{
                  flex: 1,
                  background: failureReason ? "#ef4444" : "#d1d5db",
                  color: "white",
                  border: "none",
                  padding: "14px",
                  borderRadius: "12px",
                  fontWeight: "600",
                  cursor: failureReason ? "pointer" : "not-allowed",
                }}
              >
                Mark Failed
              </button>

              <button
                onClick={() => {
                  setShowFailureModal(false);

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
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </AgentLayout>
  );
}

export default MyParcels;