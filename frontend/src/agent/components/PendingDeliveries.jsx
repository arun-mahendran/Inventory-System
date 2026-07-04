import {
    MdOutlineAssignment,
    MdLocationOn
} from "react-icons/md";

import "../../styles/pending-deliveries.css";

import { useNavigate } from "react-router-dom";


function PendingDeliveries({
    parcels
}) {

    const navigate = useNavigate();

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

    return (

        <div className="pending-card">

            <div className="pending-header">

                <div className="pending-title">

                    <div className="pending-icon">

                        <MdOutlineAssignment />

                    </div>

                    <div>

                        <h2>Pending Deliveries</h2>

                        <p>Next stops on your route</p>

                    </div>

                </div>

                <button
                    className="view-all-btn"
                    onClick={() =>
                        navigate("/agent/pending-deliveries")
                    }
                >
                    View All
                </button>

            </div>

            <div className="pending-list">

                {pendingDeliveries.slice(0, 3)
                    .map((parcel) => (

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

                                    <p>
                                        {parcel.address}
                                    </p>

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

                    ))}

            </div>

        </div>

    );

}

export default PendingDeliveries;