import {
  FiActivity,
  FiTruck,
  FiCheckCircle,
  FiXCircle,
  FiClock,
} from "react-icons/fi";

import "../../styles/recent-activities.css";

function RecentActivities({ parcels }) {
  const activities = [...parcels]
    .sort(
      (a, b) =>
        new Date(
          b.delivered_at ||
            b.failed_at ||
            b.created_at
        ) -
        new Date(
          a.delivered_at ||
            a.failed_at ||
            a.created_at
        )
    )
    .slice(0, 3);

  return (
    <div className="activity-card">
      <div className="activity-header">
        <div className="activity-title">
          <div className="activity-icon">
            <FiActivity />
          </div>

          <div>
            <h2>Recent Activities</h2>
            <p>Your latest delivery updates</p>
          </div>
        </div>
      </div>

      <div className="activity-list">
        {activities.map((parcel) => {
          const delivered =
            parcel.status === "Delivered";

          const failed =
            parcel.status === "FailedDelivery";

          const out =
            parcel.status === "OutForDelivery";

          return (
            <div
              key={parcel.id}
              className="activity-item"
            >
              <div className="activity-left">
                <div
                  className={`activity-circle ${
                    delivered
                      ? "green"
                      : failed
                      ? "red"
                      : out
                      ? "orange"
                      : "blue"
                  }`}
                >
                  {delivered ? (
                    <FiCheckCircle />
                  ) : failed ? (
                    <FiXCircle />
                  ) : (
                    <FiTruck />
                  )}
                </div>

                <div>
                  <h4>
                    {delivered
                      ? "Delivered Successfully"
                      : failed
                      ? "Delivery Failed"
                      : out
                      ? "Out For Delivery"
                      : "Currently Assigned"}
                  </h4>

                  <span className="tracking">
                    {parcel.tracking_number}
                  </span>

                  <p>
                    <FiClock />
                    {parcel.created_at
                      ? new Date(
                          parcel.created_at
                        ).toLocaleString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          day: "numeric",
                          month: "short",
                        })
                      : "--"}
                  </p>
                </div>
              </div>

              <span
                className={`status-pill ${
                  delivered
                    ? "green"
                    : failed
                    ? "red"
                    : out
                    ? "orange"
                    : "blue"
                }`}
              >
                {delivered
                  ? "Delivered"
                  : failed
                  ? "Failed"
                  : out
                  ? "Out For Delivery"
                  : "Assigned"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RecentActivities;