import "../../styles/dashboard.css";

function DashboardCards({ summary }) {
    return (
        <div className="cards">

            <div className="card card-blue">
                <div className="card-title">
                    📦 Total Parcels
                </div>

                <div className="card-value">
                    {summary.total_parcels}
                </div>
            </div>

            <div className="card card-green">
                <div className="card-title">
                    ✅ Delivered
                </div>

                <div className="card-value">
                    {summary.delivered_parcels}
                </div>
            </div>

            <div className="card card-red">
                <div className="card-title">
                    ❌ Failed
                </div>

                <div className="card-value">
                    {summary.failed_parcels}
                </div>
            </div>

            <div className="card card-orange">
                <div className="card-title">
                    🚚 Available Agents
                </div>

                <div className="card-value">
                    {summary.available_agents}
                </div>
            </div>

        </div>
    );
}

export default DashboardCards;