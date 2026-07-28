import { HiOutlineCube, HiOutlineCheckCircle, HiOutlineXCircle } from "react-icons/hi";
import { TbTruckDelivery } from "react-icons/tb";

const cardConfig = [
  {
    key: "total_parcels",
    label: "Total Parcels",
    Icon: HiOutlineCube,
    accent: "#2563eb",     // blue
    bg: "#eff6ff",
  },
  {
    key: "delivered_parcels",
    label: "Delivered",
    Icon: HiOutlineCheckCircle,
    accent: "#16a34a",     // green
    bg: "#f0fdf4",
  },
  {
    key: "failed_parcels",
    label: "Failed",
    Icon: HiOutlineXCircle,
    accent: "#dc2626",     // red
    bg: "#fef2f2",
  },
  {
    key: "available_agents",
    label: "Available Agents",
    Icon: TbTruckDelivery,
    accent: "#f97316",     // orange (brand accent)
    bg: "#fff7ed",
  },
];

function DashboardCards({ summary }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "20px",
        marginBottom: "24px",
      }}
    >
      {cardConfig.map(({ key, label, Icon, accent, bg }) => (
        <div
          key={key}
          style={{
            position: "relative",
            background: "white",
            borderRadius: "18px",
            padding: "22px",
            boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
            overflow: "hidden",
          }}
        >
          {/* top accent bar, replaces the old colored border trick */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "4px",
              background: accent,
            }}
          />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "12px",
                background: bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Icon size={22} style={{ color: accent }} />
            </div>

            <span
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "#475569",
              }}
            >
              {label}
            </span>
          </div>

          <div
            style={{
              fontSize: "30px",
              fontWeight: 700,
              color: "#0f172a",
            }}
          >
            {summary?.[key] ?? 0}
          </div>
        </div>
      ))}
    </div>
  );
}

export default DashboardCards;