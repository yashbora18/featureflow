import { useLocation, useNavigate } from "react-router-dom";
import "./FlagDetail.css";

function FlagDetail() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const flag = state?.flag;

  const formatDateTime = (date) => {
    if (!date) return "-";

    return new Date(date + "Z").toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "medium",
    });
  };

  const getEnvironmentName = (id) => {
    switch (id) {
      case 1:
        return "🟢 Development";
      case 2:
        return "🟡 Staging";
      case 3:
        return "🔴 Production";
      default:
        return "Unknown";
    }
  };

  if (!flag) {
    return (
      <div className="flag-detail-page">
        <h2>No Flag Selected</h2>

        <button
          className="back-btn"
          onClick={() => navigate("/")}
        >
          ← Back
        </button>
      </div>
    );
  }
    return (
    <div className="flag-detail-page">

      <div className="detail-header">

        <h1>🚩 Feature Flag Details</h1>

        <button
          className="back-btn"
          onClick={() => navigate("/")}
        >
          ← Back to Flags
        </button>

      </div>

      <div className="details-grid">

        <div className="info-card">
          <h4>🚩 Flag Key</h4>
          <p>{flag.flag_key}</p>
        </div>

        <div className="info-card">
          <h4>🌍 Environment</h4>
          <p>{getEnvironmentName(flag.environment_id)}</p>
        </div>

        <div className="info-card">
          <h4>⚡ Type</h4>
          <p>{flag.flag_type}</p>
        </div>

        <div className="info-card">
          <h4>🎯 Default Value</h4>

          <span
            className={
              flag.default_value
                ? "status-enabled"
                : "status-disabled"
            }
          >
            {flag.default_value ? "True" : "False"}
          </span>

        </div>

        <div className="info-card">
          <h4>👥 Owner Team</h4>
          <p>{flag.owner_team}</p>
        </div>

        <div className="info-card">
          <h4>📌 Status</h4>

          <span
            className={
              flag.enabled
                ? "status-enabled"
                : "status-disabled"
            }
          >
            {flag.enabled ? "Enabled" : "Disabled"}
          </span>

        </div>

        <div className="info-card">
          <h4>📅 Created At</h4>
          <p>{formatDateTime(flag.created_at)}</p>
        </div>

        <div className="info-card">
          <h4>📝 Updated At</h4>
          <p>{formatDateTime(flag.updated_at)}</p>
        </div>

        <div className="info-card description-card">
          <h4>📄 Description</h4>

          <p>
            {flag.description || "No description available."}
          </p>

        </div>

      </div>

      <div className="rules-card">

        <h2>🎯 Targeting Rules</h2>

        <p>
          This section will be implemented in
          <strong> Milestone 2</strong>.
        </p>

      </div>

    </div>
  );
}

export default FlagDetail;