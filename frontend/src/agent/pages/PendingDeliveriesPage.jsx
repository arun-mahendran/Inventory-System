import { useEffect, useState } from "react";

import api from "../../api/axios";

import { FiTruck } from "react-icons/fi";
import { MdLocationOn } from "react-icons/md";

import AgentLayout from "../components/AgentLayout";

import "../../styles/pending-deliveries-page.css";
import "../../styles/pending-deliveries.css";

function PendingDeliveriesPage() {
  const [parcels, setParcels] = useState([]);

  const pendingDeliveries = parcels
    .filter(
        (parcel) =>
            parcel.status === "Assigned" ||
            parcel.status === "OutForDelivery"
    )
    .sort(
        (a, b) =>
            new Date(b.created_at) - new Date(a.created_at)
    );

  useEffect(() => {
    const fetchParcels = async () => {
      try {
        const agentId = localStorage.getItem("delivery_agent_id");

        const response = await api.get(
          `/delivery-agents/${agentId}/parcels`,
        );

        setParcels(response.data);
      } catch (error) {
        console.error("Pending Deliveries Error:", error);
      }
    };

    fetchParcels();
  }, []);

  return (
    <AgentLayout>
      <div className="pending-page">
        {/* Hero */}
        <div className="pending-page-hero">
          <div>
            <div className="pending-page-badge">
              <FiTruck />
              Delivery Queue
            </div>

            <h1>Pending Deliveries</h1>

            <p>Track and complete your active delivery tasks.</p>
          </div>

          <div className="hero-stat">
            <span>Active Deliveries</span>

            <h2>{pendingDeliveries.length}</h2>

            <small>Active Today</small>
          </div>
        </div>

        {/* Pending Deliveries List */}
        <div className="pending-page-list">
          <div className="pending-list">
            {pendingDeliveries.length === 0 ? (
              <div className="pending-empty">
                <FiTruck size={60} />

                <h3>No Pending Deliveries</h3>

                <p>You have completed all assigned deliveries.</p>
              </div>
            ) : (
              pendingDeliveries.map((parcel) => (
                <div
                  key={parcel.id}
                  className="pending-item"
                >
                  <div className="pending-left">
                    <div className="location-badge">
                      <MdLocationOn />
                    </div>

                    <div className="customer-details">
                      <h4>
                        {parcel.customer_name || "Customer"}
                      </h4>

                      <p>{parcel.address}</p>

                      <span className="tracking-number-mobile">
                        {parcel.tracking_number}
                      </span>
                    </div>
                  </div>

                  <div className="pending-right">
                    <span className="tracking-number">
                      {parcel.tracking_number}
                    </span>

                    <span
                      className={
                        parcel.status === "OutForDelivery"
                          ? "status-orange"
                          : "status-blue"
                      }
                    >
                      {parcel.status === "OutForDelivery"
                        ? "Out For Delivery"
                        : "Assigned"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </AgentLayout>
  );
}

export default PendingDeliveriesPage;