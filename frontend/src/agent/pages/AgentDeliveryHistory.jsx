import { useEffect, useMemo, useState } from "react";

import api from "../../api/axios";

import AgentLayout from "../components/AgentLayout";

import "../../styles/agent-history.css";

import { MdHistory } from "react-icons/md";

import {
  FiDownload,
  FiFilter,
  FiRefreshCw,
  FiCalendar,
  FiUser,
  FiEye,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight,
  FiChevronUp,
  FiChevronDown,
  FiCheckCircle,
  FiXCircle,
  FiPackage,
} from "react-icons/fi";

const AVATAR_COLORS = [
  { bg: "#EFE7FE", color: "#7C3AED" },
  { bg: "#E3F9EE", color: "#0F9D58" },
];

function formatDate(dateStr) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatTime(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatShortRange(startStr, endStr) {
  if (!startStr || !endStr) return "All time";
  const start = new Date(startStr);
  const end = new Date(endStr);
  const opts = { day: "2-digit", month: "short" };
  const startLabel = start.toLocaleDateString("en-GB", opts);
  const endLabel = end.toLocaleDateString("en-GB", {
    ...opts,
    year: "numeric",
  });
  return `${startLabel} - ${endLabel}`;
}

function toInputDate(date) {
  const d = new Date(date);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function SortIcon({ active, direction }) {
  return (
    <span
      style={{
        display: "inline-flex",
        flexDirection: "column",
        marginLeft: "4px",
        lineHeight: 0,
      }}
    >
      <FiChevronUp
        size={11}
        style={{
          color: active && direction === "asc" ? "#2563eb" : "#c3c9d4",
          marginBottom: "-3px",
        }}
      />
      <FiChevronDown
        size={11}
        style={{
          color: active && direction === "desc" ? "#2563eb" : "#c3c9d4",
        }}
      />
    </span>
  );
}

function AgentDeliveryHistory() {
  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const [startDate, setStartDate] = useState(() => {
  const date = new Date();
    date.setDate(date.getDate() - 4);
    return toInputDate(date);
  });
  const [endDate, setEndDate] = useState(() => {
    return toInputDate(new Date());
  });
  const [dateError, setDateError] = useState("");

  const [sortField, setSortField] = useState("completedAt");
  const [sortDirection, setSortDirection] = useState("desc");

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [selectedParcel, setSelectedParcel] = useState(null);

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
        setLoading(true);

        const agentId = localStorage.getItem("delivery_agent_id");

        const response = await api.get(`/delivery-agents/${agentId}/parcels`);

        const completedParcels = response.data
          .filter(
            (parcel) =>
              parcel.status === "Delivered" ||
              parcel.status === "FailedDelivery",
          )
          .map((parcel) => ({
            ...parcel,
            completedAt: parcel.delivered_at || parcel.failed_at || null,
          }))
          .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));

        setHistory(completedParcels);
        setFilteredHistory(completedParcels);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const handleStartDateChange = (value) => {
    setStartDate(value);
    setDateError("");

    // Keep the end date valid relative to the new start date
    if (endDate && value && endDate < value) {
      setEndDate(value);
    }
  };

  const handleEndDateChange = (value) => {
    setEndDate(value);
    setDateError("");
  };

  const applyFilter = () => {
    if (startDate && endDate && endDate < startDate) {
      setDateError("Please choose a valid date range.");
      return;
    }

    setDateError("");

    if (!startDate || !endDate) {
      setFilteredHistory(history);
      setCurrentPage(1);
      return;
    }

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const filtered = history.filter((parcel) => {
      if (!parcel.completedAt) return false;
      const completed = new Date(parcel.completedAt);
      return completed >= start && completed <= end;
    });

    setFilteredHistory(filtered);
    setCurrentPage(1);
  };

  const resetFilter = () => {
    setStartDate("");
    setEndDate("");
    setDateError("");
    setFilteredHistory(history);
    setCurrentPage(1);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedHistory = useMemo(() => {
    if (!sortField) return filteredHistory;

    const getValue = (parcel) => {
      switch (sortField) {
        case "tracking_number":
          return parcel.tracking_number || "";
        case "customer_id":
          return parcel.customer_id ?? 0;
        case "status":
          return parcel.status || "";
        case "completedAt":
          return parcel.completedAt ? new Date(parcel.completedAt).getTime() : 0;
        default:
          return "";
      }
    };

    return [...filteredHistory].sort((a, b) => {
      const valA = getValue(a);
      const valB = getValue(b);

      if (valA < valB) return sortDirection === "asc" ? -1 : 1;
      if (valA > valB) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredHistory, sortField, sortDirection]);

  const totalDeliveries = filteredHistory.length;
  const deliveredCount = filteredHistory.filter(
    (p) => p.status === "Delivered",
  ).length;
  const failedCount = totalDeliveries - deliveredCount;
  const deliveredPct = totalDeliveries
    ? Math.round((deliveredCount / totalDeliveries) * 100)
    : 0;
  const failedPct = totalDeliveries ? 100 - deliveredPct : 0;

  const totalPages = Math.max(1, Math.ceil(sortedHistory.length / rowsPerPage));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedHistory = sortedHistory.slice(
    (safePage - 1) * rowsPerPage,
    safePage * rowsPerPage,
  );

  const rangeStart = sortedHistory.length
    ? (safePage - 1) * rowsPerPage + 1
    : 0;
  const rangeEnd = Math.min(safePage * rowsPerPage, sortedHistory.length);

  const goToPage = (page) => {
    setCurrentPage(Math.min(Math.max(1, page), totalPages));
  };

  return (
    <AgentLayout>
      <div className="history-page" style={{ paddingBottom: "40px" }}>
        {/* Header */}
        <div
          className="history-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "22px",
          }}
        >
          <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "14px",
                background: "#EDE9FE",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <MdHistory size={28} color="#2563eb" />
            </div>
            <div>
              <h1
                style={{
                  margin: 0,
                  fontSize: "26px",
                  fontWeight: 700,
                  color: "#111827",
                }}
              >
                Delivery History
              </h1>
              <p style={{ margin: "4px 0 0", color: "#6b7280", fontSize: "14px" }}>
                View and manage all your completed deliveries.
              </p>
            </div>
          </div>

          <button
            onClick={downloadPDF}
            style={{
              background: "#2563eb",
              color: "white",
              border: "none",
              padding: "12px 20px",
              borderRadius: "12px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "14px",
              fontWeight: 600,
              boxShadow: "0 1px 2px rgba(37, 99, 235, 0.3)",
            }}
          >
            <FiDownload size={16} />
            Export PDF
          </button>
        </div>

        {/* Date range filter card */}
        <div
          style={{
            background: "#fff",
            borderRadius: "16px",
            padding: "22px 24px",
            marginBottom: "20px",
            boxShadow: "0 1px 3px rgba(16, 24, 40, 0.06)",
          }}
        >
          <div
            style={{
              fontSize: "14px",
              fontWeight: 700,
              color: "#111827",
              marginBottom: "12px",
            }}
          >
            Date Range
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              flexWrap: "wrap",
            }}
          >
            <DateField
              label="Start Date"
              value={startDate}
              onChange={handleStartDateChange}
              max={endDate || undefined}
            />

            <span style={{ color: "#9ca3af", fontWeight: 600 }}>–</span>

            <DateField
              label="End Date"
              value={endDate}
              onChange={handleEndDateChange}
              min={startDate || undefined}
            />

            <button
              onClick={applyFilter}
              style={{
                background: "#2563eb",
                color: "white",
                border: "none",
                padding: "13px 20px",
                borderRadius: "10px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              <FiFilter size={15} />
              Apply Filter
            </button>

            <button
              onClick={resetFilter}
              style={{
                background: "#fff",
                color: "#374151",
                border: "1px solid #e5e7eb",
                padding: "13px 20px",
                borderRadius: "10px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              <FiRefreshCw size={15} />
              Reset
            </button>
          </div>

          {dateError && (
            <div
              style={{
                marginTop: "14px",
                background: "#EFF6FF",
                color: "#1d4ed8",
                fontSize: "13px",
                borderRadius: "10px",
                padding: "10px 14px",
              }}
            >
              {dateError}
            </div>
          )}
        </div>

        {/* Stat cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gap: "18px",
            marginBottom: "22px",
          }}
        >
          <StatCard
            icon={<FiPackage size={22} color="#7C3AED" />}
            iconBg="#EFE7FE"
            label="Total Deliveries"
            value={totalDeliveries}
          />

          <StatCard
            icon={<FiCheckCircle size={22} color="#0F9D58" />}
            iconBg="#E3F9EE"
            label="Delivered"
            value={deliveredCount}
            badge={`${deliveredPct}%`}
            badgeBg="#E3F9EE"
            badgeColor="#0F9D58"
          />

          <StatCard
            icon={<FiXCircle size={22} color="#E11D48" />}
            iconBg="#FDE8EC"
            label="Failed"
            value={failedCount}
            badge={`${failedPct}%`}
            badgeBg="#FDE8EC"
            badgeColor="#E11D48"
          />

          <StatCard
            icon={<FiCalendar size={22} color="#2563eb" />}
            iconBg="#DBEAFE"
            label="Date Range"
            value={formatShortRange(startDate, endDate)}
            valueSize="14px"
          />
        </div>

        {/* Table */}
        <div
          className="history-table-container"
          style={{
            background: "#fff",
            borderRadius: "16px",
            boxShadow: "0 1px 3px rgba(16, 24, 40, 0.06)",
            overflow: "hidden",
          }}
        >
          <div style={{ overflowX: "auto" }}>
            <table className="history-table" style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#F9FAFB" }}>
                  <SortableHeader
                    label="Tracking No"
                    field="tracking_number"
                    sortField={sortField}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                  />
                  <SortableHeader
                    label="Customer"
                    field="customer_id"
                    sortField={sortField}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                  />
                  <SortableHeader
                    label="Status"
                    field="status"
                    sortField={sortField}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                  />
                  <SortableHeader
                    label="Completed At"
                    field="completedAt"
                    sortField={sortField}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                  />
                  <th style={thStyle}>Failure Reason</th>
                  <th style={{ ...thStyle, textAlign: "right" }}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="empty-history" style={{ padding: "40px", textAlign: "center", color: "#6b7280" }}>
                      Loading delivery history...
                    </td>
                  </tr>
                ) : paginatedHistory.length > 0 ? (
                  paginatedHistory.map((parcel, index) => {
                    const avatar = AVATAR_COLORS[index % AVATAR_COLORS.length];
                    const customerName =
                      parcel.customer_name ||
                      parcel.customer?.name ||
                      `Customer ${parcel.customer_id ?? ""}`;

                    return (
                      <tr key={parcel.id} style={{ borderTop: "1px solid #F1F2F4" }}>
                        <td style={tdStyle}>
                          <span style={{ fontWeight: 600, color: "#111827" }}>
                            {parcel.tracking_number}
                          </span>
                        </td>

                        <td style={tdStyle}>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <div
                              style={{
                                width: "32px",
                                height: "32px",
                                borderRadius: "50%",
                                background: avatar.bg,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                              }}
                            >
                              <FiUser size={15} color={avatar.color} />
                            </div>
                            <div>
                              <div style={{ fontWeight: 600, color: "#111827", fontSize: "14px" }}>
                                {customerName}
                              </div>
                              <div style={{ fontSize: "12px", color: "#9ca3af" }}>
                                ID: {parcel.customer_id ?? "-"}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td style={tdStyle}>
                          <span
                            className={
                              parcel.status === "Delivered"
                                ? "status-success"
                                : "status-failed"
                            }
                            style={{
                              display: "inline-block",
                              padding: "5px 12px",
                              borderRadius: "999px",
                              fontSize: "12px",
                              fontWeight: 700,
                              background:
                                parcel.status === "Delivered" ? "#E3F9EE" : "#FDE8EC",
                              color:
                                parcel.status === "Delivered" ? "#0F9D58" : "#E11D48",
                            }}
                          >
                            {parcel.status === "Delivered" ? "Delivered" : "Failed"}
                          </span>
                        </td>

                        <td style={tdStyle}>
                          <div style={{ fontSize: "13px", color: "#111827", fontWeight: 500 }}>
                            {formatDate(parcel.completedAt)}
                          </div>
                          <div style={{ fontSize: "12px", color: "#9ca3af" }}>
                            {formatTime(parcel.completedAt)}
                          </div>
                        </td>

                        <td style={tdStyle}>
                          <span style={{ color: "#374151", fontSize: "13px" }}>
                            {parcel.failure_reason || "-"}
                          </span>
                        </td>

                        <td style={{ ...tdStyle, textAlign: "right" }}>
                          <button
                            onClick={() => setSelectedParcel(parcel)}
                            title="View details"
                            style={{
                              background: "#F3F4F6",
                              border: "none",
                              borderRadius: "8px",
                              width: "34px",
                              height: "34px",
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                            }}
                          >
                            <FiEye size={16} color="#374151" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="empty-history" style={{ padding: "40px", textAlign: "center", color: "#6b7280" }}>
                      No delivery history found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination footer */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "16px 20px",
              borderTop: "1px solid #F1F2F4",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#6b7280" }}>
              Rows per page:
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  padding: "6px 10px",
                  fontSize: "13px",
                  color: "#111827",
                  background: "#fff",
                }}
              >
                {[10, 25, 50].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <PageButton onClick={() => goToPage(1)} disabled={safePage === 1}>
                <FiChevronsLeft size={15} />
              </PageButton>
              <PageButton onClick={() => goToPage(safePage - 1)} disabled={safePage === 1}>
                <FiChevronLeft size={15} />
              </PageButton>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1)
                .reduce((acc, p, idx, arr) => {
                  if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, idx) =>
                  p === "..." ? (
                    <span key={`dots-${idx}`} style={{ padding: "0 4px", color: "#9ca3af" }}>
                      ...
                    </span>
                  ) : (
                    <PageButton
                      key={p}
                      onClick={() => goToPage(p)}
                      active={p === safePage}
                    >
                      {p}
                    </PageButton>
                  ),
                )}

              <PageButton onClick={() => goToPage(safePage + 1)} disabled={safePage === totalPages}>
                <FiChevronRight size={15} />
              </PageButton>
              <PageButton onClick={() => goToPage(totalPages)} disabled={safePage === totalPages}>
                <FiChevronsRight size={15} />
              </PageButton>
            </div>

            <div style={{ fontSize: "13px", color: "#6b7280" }}>
              {rangeStart}-{rangeEnd} of {sortedHistory.length}
            </div>
          </div>
        </div>
      </div>

      {selectedParcel && (
        <DetailModal parcel={selectedParcel} onClose={() => setSelectedParcel(null)} />
      )}
    </AgentLayout>
  );
}

function DateField({ label, value, onChange, min, max }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        border: "1px solid #e5e7eb",
        borderRadius: "10px",
        padding: "10px 14px",
        gap: "10px",
        minWidth: "190px",
      }}
    >
      <div style={{ fontSize: "12px", color: "#9ca3af", whiteSpace: "nowrap" }}>{label}</div>
      <input
        type="date"
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(e.target.value)}
        style={{
          border: "none",
          outline: "none",
          fontSize: "14px",
          fontWeight: 600,
          color: "#111827",
          width: "100%",
        }}
      />
      <FiCalendar size={15} color="#9ca3af" />
    </div>
  );
}

function StatCard({ icon, iconBg, label, value, badge, badgeBg, badgeColor, valueSize }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "16px",
        padding: "18px 20px",
        boxShadow: "0 1px 3px rgba(16, 24, 40, 0.06)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "12px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <div
          style={{
            width: "46px",
            height: "46px",
            borderRadius: "12px",
            background: iconBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
        <div>
          <div style={{ fontSize: "13px", color: "#6b7280", marginBottom: "2px" }}>{label}</div>
          <div
            style={{
              fontSize: valueSize || "22px",
              fontWeight: 700,
              color: "#111827",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {value}
          </div>
        </div>
      </div>

      {badge && (
        <span
          style={{
            fontSize: "12px",
            fontWeight: 700,
            padding: "5px 10px",
            borderRadius: "999px",
            background: badgeBg,
            color: badgeColor,
            whiteSpace: "nowrap",
          }}
        >
          {badge}
        </span>
      )}
    </div>
  );
}

const thStyle = {
  textAlign: "left",
  padding: "14px 20px",
  fontSize: "12px",
  fontWeight: 700,
  color: "#6b7280",
  textTransform: "uppercase",
  letterSpacing: "0.02em",
  whiteSpace: "nowrap",
};

const tdStyle = {
  padding: "16px 20px",
  fontSize: "14px",
  verticalAlign: "middle",
};

function SortableHeader({ label, field, sortField, sortDirection, onSort }) {
  return (
    <th style={thStyle}>
      <button
        onClick={() => onSort(field)}
        style={{
          background: "none",
          border: "none",
          padding: 0,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          fontSize: "12px",
          fontWeight: 700,
          color: "#6b7280",
          textTransform: "uppercase",
          letterSpacing: "0.02em",
        }}
      >
        {label}
        <SortIcon active={sortField === field} direction={sortDirection} />
      </button>
    </th>
  );
}

function PageButton({ children, onClick, disabled, active }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        minWidth: "32px",
        height: "32px",
        borderRadius: "8px",
        border: active ? "none" : "1px solid #e5e7eb",
        background: active ? "#2563eb" : "#fff",
        color: active ? "#fff" : disabled ? "#d1d5db" : "#374151",
        fontSize: "13px",
        fontWeight: 600,
        cursor: disabled ? "not-allowed" : "pointer",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
    </button>
  );
}

function DetailModal({ parcel, onClose }) {
  const isDelivered = parcel.status === "Delivered";

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(17, 24, 39, 0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: "16px",
          padding: "24px",
          width: "380px",
          maxWidth: "90vw",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 700, color: "#111827" }}>
            Parcel Details
          </h3>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}
          >
            <FiX size={20} />
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "14px" }}>
          <Row label="Tracking No" value={parcel.tracking_number} />
          <Row label="Customer ID" value={parcel.customer_id} />
          <Row
            label="Status"
            value={
              <span style={{ color: isDelivered ? "#0F9D58" : "#E11D48", fontWeight: 700 }}>
                {isDelivered ? "Delivered" : "Failed"}
              </span>
            }
          />
          <Row label="Completed At" value={`${formatDate(parcel.completedAt)} ${formatTime(parcel.completedAt)}`} />
          {!isDelivered && <Row label="Failure Reason" value={parcel.failure_reason || "-"} />}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
      <span style={{ color: "#6b7280" }}>{label}</span>
      <span style={{ color: "#111827", fontWeight: 600, textAlign: "right" }}>{value}</span>
    </div>
  );
}

export default AgentDeliveryHistory;