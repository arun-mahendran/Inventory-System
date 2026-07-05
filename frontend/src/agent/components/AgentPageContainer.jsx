import "../../styles/agent-layout.css";

function AgentPageContainer({ title, subtitle, actions, children }) {
  return (
    <div className="agent-page">
      {(title || actions) && (
        <div className="agent-page-header">
          <div>
            {title && <h1 className="agent-page-title">{title}</h1>}
            {subtitle && <p className="agent-page-subtitle">{subtitle}</p>}
          </div>

          {actions && <div className="agent-page-actions">{actions}</div>}
        </div>
      )}

      <div className="agent-page-body">{children}</div>
    </div>
  );
}

export default AgentPageContainer;