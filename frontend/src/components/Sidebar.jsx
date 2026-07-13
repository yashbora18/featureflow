import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();

  const menuStyle = (path) => ({
    color: "white",
    textDecoration: "none",
    padding: "14px 18px",
    borderRadius: "12px",
    background:
      location.pathname === path ? "rgba(255,255,255,0.15)" : "transparent",
    transition: "0.3s",
    fontWeight: location.pathname === path ? "600" : "400",
  });

  return (
    <div
      style={{
        width: "260px",
        height: "100vh",
        background: "linear-gradient(180deg,#0f172a,#1e3a8a)",
        color: "white",
        position: "fixed",
        left: 0,
        top: 0,
        padding: "30px 20px",
        boxSizing: "border-box",
        boxShadow: "4px 0 20px rgba(0,0,0,0.15)",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          marginBottom: "40px",
          fontSize: "24px",
          fontWeight: "700",
        }}
      >
        🚩 Feature Flag
      </h2>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        <Link to="/" style={menuStyle("/")}>
          🏠 Dashboard
        </Link>

        <Link to="/flags" style={menuStyle("/flags")}>
          🚩 Feature Flags
        </Link>

        <Link to="/environments" style={menuStyle("/environments")}>
          🌍 Environments
        </Link>

        <Link to="/auditlogs" style={menuStyle("/auditlogs")}>
          📜 Audit Logs
        </Link>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: "25px",
          left: "20px",
          right: "20px",
          padding: "15px",
          borderRadius: "12px",
          background: "rgba(255,255,255,0.08)",
          textAlign: "center",
          fontSize: "14px",
        }}
      >
        <div style={{ fontWeight: "600" }}>Milestone 1</div>
        <div style={{ color: "#bfdbfe" }}>Completed ✅</div>
      </div>
    </div>
  );
}

export default Sidebar;