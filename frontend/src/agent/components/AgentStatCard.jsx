import "../../styles/agent-stat-card.css";

function AgentStatCard({
    title,
    value,
    color,
    icon
}) {

    return (

        <div className="agent-card"
            style={{
                borderTop:
                    `5px solid ${color}`
            }}
        >

            <div className="agent-card-title">
                {icon} {title}
            </div>

            <div className="agent-card-value">
                {value}
            </div>

        </div>

    );

}

export default AgentStatCard;