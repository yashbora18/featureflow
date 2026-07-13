import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

function Dashboard() {
  const [flags, setFlags] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/flags/")
      .then((response) => response.json())
      .then((data) => setFlags(data))
      .catch((error) => console.error(error));
  }, []);

  const totalFlags = flags.length;
  const enabledFlags = flags.filter((flag) => flag.is_enabled).length;
  const disabledFlags = flags.filter((flag) => !flag.is_enabled).length;

  const cardStyle = {
     background: "white",
  padding: "25px",
  borderRadius: "18px",
  boxShadow: "0 10px 25px rgba(0,0,0,.08)",
  transition: "all .3s ease",
  cursor: "pointer",
};

  return (
    <>
      <Sidebar />

      <div
        style={{
          marginLeft: "280px",
          padding: "35px",
          background: "#f5f7fb",
          minHeight: "100vh",
        }}
      >
        <h1
          style={{
            fontSize: "34px",
            marginBottom: "8px",
            color: "#1e293b",
          }}
        >
          👋 Welcome Back
        </h1>

        <p
          style={{
            color: "#64748b",
            marginBottom: "35px",
          }}
        >
          Manage your Feature Flags from one place.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: "25px",
          }}
        >
          <div style={cardStyle}>
            <h3 style={{ color: "#64748b" }}>🚩 Total Flags</h3>

            <h1
              style={{
                color: "#2563eb",
                marginTop: "15px",
              }}
            >
              {totalFlags}
            </h1>
          </div>

          <div style={cardStyle}>
            <h3 style={{ color: "#64748b" }}>
              🟢 Enabled Flags
            </h3>

            <h1
              style={{
                color: "#16a34a",
                marginTop: "15px",
              }}
            >
              {enabledFlags}
            </h1>
          </div>

          <div style={cardStyle}>
            <h3 style={{ color: "#64748b" }}>
              🔴 Disabled Flags
            </h3>

            <h1
              style={{
                color: "#dc2626",
                marginTop: "15px",
              }}
            >
              {disabledFlags}
            </h1>
          </div>

          <div style={cardStyle}>
            <h3 style={{ color: "#64748b" }}>
              🌍 Environments
            </h3>

            <h1
              style={{
                color: "#7c3aed",
                marginTop: "15px",
              }}
            >
              4
            </h1>
          </div>
        </div>

        <div
          style={{
            marginTop: "35px",
            background: "white",
            borderRadius: "18px",
            padding: "30px",
            boxShadow: "0 10px 25px rgba(0,0,0,.08)",
          }}
        >
          <h2
            style={{
              marginBottom: "15px",
              color: "#1e293b",
            }}
          >
            📈 Project Overview
          </h2>

          <p
            style={{
              color: "#64748b",
              lineHeight: "30px",
            }}
          >
            This dashboard helps teams manage Feature Flags,
            monitor enabled and disabled features, evaluate
            environments, and prepare for future targeting
            rules in Milestone 2.
          </p>
        </div>
      </div>
    </>
  );
}

export default Dashboard;