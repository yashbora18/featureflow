import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CreateFlagForm from "../components/CreateFlagForm";
import Sidebar from "../components/Sidebar";

function Flags() {
  const [flags, setFlags] = useState([]);
  const [search, setSearch] = useState("");

  const loadFlags = () => {
    fetch("http://127.0.0.1:8000/flags/")
      .then((response) => response.json())
      .then((data) => setFlags(data))
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    loadFlags();
  }, []);

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
            marginBottom: "5px",
          }}
        >
          🚩 Feature Flags
        </h1>

        <p
          style={{
            color: "#64748b",
            marginBottom: "30px",
          }}
        >
          Create, manage and monitor your feature flags.
        </p>

        <div
          style={{
            background: "white",
            padding: "25px",
            borderRadius: "18px",
            boxShadow: "0 8px 25px rgba(0,0,0,.08)",
            marginBottom: "30px",
          }}
        >
          <CreateFlagForm onFlagCreated={loadFlags} />
        </div>

        <div
          style={{
            background: "white",
            borderRadius: "18px",
            padding: "25px",
            boxShadow: "0 8px 25px rgba(0,0,0,.08)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <h2
              style={{
                margin: 0,
                color: "#1e293b",
              }}
            >
              Available Flags
            </h2>

            <input
              type="text"
              placeholder="Search by Key, Name or Owner..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                padding: "12px 16px",
                borderRadius: "10px",
                border: "1px solid #d1d5db",
                width: "280px",
                fontSize: "15px",
                outline: "none",
              }}
            />
          </div>

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr
                style={{
                  background: "#2563eb",
                  color: "white",
                }}
              >
                <th style={{ padding: "15px" }}>Flag Key</th>
                <th>Name</th>
                <th>Owner Team</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {flags
                .filter(
                  (flag) =>
                    flag.flag_key
                      .toLowerCase()
                      .includes(search.toLowerCase()) ||
                    flag.name
                      .toLowerCase()
                      .includes(search.toLowerCase()) ||
                    flag.owner_team
                      .toLowerCase()
                      .includes(search.toLowerCase())
                )
                .map((flag) => (
                  <tr
                    key={flag.id}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#f8fafc";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "white";
                    }}
                    style={{
                      borderBottom: "1px solid #e5e7eb",
                      transition: "all 0.25s ease",
                    }}
                  >
                    <td style={{ padding: "18px" }}>
                      <Link
                        to={`/flags/${flag.flag_key}`}
                        style={{
                          color: "#2563eb",
                          textDecoration: "none",
                          fontWeight: "600",
                        }}
                      >
                        {flag.flag_key}
                      </Link>
                    </td>

                    <td>{flag.name}</td>

                    <td>{flag.owner_team}</td>

                    <td>
                      <span
                        style={{
                          background: flag.is_enabled
                            ? "#dcfce7"
                            : "#fee2e2",
                          color: flag.is_enabled
                            ? "#15803d"
                            : "#dc2626",
                          padding: "8px 14px",
                          borderRadius: "30px",
                          fontWeight: "600",
                          fontSize: "14px",
                        }}
                      >
                        {flag.is_enabled
                          ? "🟢 Enabled"
                          : "🔴 Disabled"}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Flags;