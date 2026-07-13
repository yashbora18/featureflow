import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

function FlagDetail() {
  const { flagKey } = useParams();

  const [flag, setFlag] = useState(null);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/flags/${flagKey}`)
      .then((response) => response.json())
      .then((data) => setFlag(data))
      .catch((error) => console.error(error));
  }, [flagKey]);

  if (!flag) {
    return (
      <>
        <Sidebar />
        <div
          style={{
            marginLeft: "280px",
            padding: "40px",
          }}
        >
          <h2>Loading...</h2>
        </div>
      </>
    );
  }

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
            color: "#1e293b",
            marginBottom: "30px",
          }}
        >
          🚩 Feature Flag Details
        </h1>

        <div
          style={{
            background: "white",
            padding: "30px",
            borderRadius: "18px",
            boxShadow: "0 8px 25px rgba(0,0,0,.08)",
            marginBottom: "25px",
          }}
        >
          <h2 style={{ marginBottom: "20px" }}>
            📋 Flag Information
          </h2>

          <p><b>Flag Key:</b> {flag.flag_key}</p>
          <p><b>Name:</b> {flag.name}</p>
          <p><b>Type:</b> {flag.flag_type}</p>
          <p><b>Default Value:</b> {flag.default_value}</p>
          <p><b>Owner Team:</b> {flag.owner_team}</p>

          <p>
            <b>Status:</b>{" "}
            <span
              style={{
                background: flag.is_enabled
                  ? "#dcfce7"
                  : "#fee2e2",
                color: flag.is_enabled
                  ? "#15803d"
                  : "#dc2626",
                padding: "6px 14px",
                borderRadius: "20px",
                fontWeight: "600",
              }}
            >
              {flag.is_enabled
                ? "🟢 Enabled"
                : "🔴 Disabled"}
            </span>
          </p>
        </div>

        <div
          style={{
            background: "white",
            padding: "30px",
            borderRadius: "18px",
            boxShadow: "0 8px 25px rgba(0,0,0,.08)",
            marginBottom: "25px",
          }}
        >
          <h2 style={{ marginBottom: "15px" }}>
            📝 Description
          </h2>

          <p
            style={{
              color: "#64748b",
              lineHeight: "28px",
            }}
          >
            {flag.description || "No Description Available"}
          </p>
        </div>

        <div
          style={{
            background: "white",
            padding: "30px",
            borderRadius: "18px",
            boxShadow: "0 8px 25px rgba(0,0,0,.08)",
          }}
        >
          <h2 style={{ marginBottom: "20px" }}>
            🎯 Targeting Rules
          </h2>

          <div
            style={{
              padding: "25px",
              border: "2px dashed #cbd5e1",
              borderRadius: "12px",
              background: "#f8fafc",
              color: "#64748b",
              textAlign: "center",
              fontSize: "17px",
            }}
          >
            🚀 Targeting Rules will be implemented in
            <b> Milestone 2</b>.
          </div>
        </div>
      </div>
    </>
  );
}

export default FlagDetail;