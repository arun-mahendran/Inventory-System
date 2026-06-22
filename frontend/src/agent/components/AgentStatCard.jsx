import "../../styles/dashboard.css";

function AgentStatCard({
    title,
    value,
    color,
    icon
}) {

    return (

        <div
            className="card"
            style={{
                borderTop:
                    `5px solid ${color}`
            }}
        >

            <div
                className="card-title"
            >
                {icon} {title}
            </div>

            <div
                className="card-value"
            >
                {value}
            </div>

        </div>

    );

}

export default AgentStatCard;