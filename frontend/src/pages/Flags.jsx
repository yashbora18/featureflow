import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FiFlag,
  FiCheckCircle,
  FiUsers,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";

import { FaToggleOff } from "react-icons/fa";
import { toast } from "react-toastify";

import "./Flags.css";

import {
  getFlags,
  deleteFlag,
} from "../services/flagService";

import FlagForm from "../components/FlagForm";
function Flags({
  environment,
  showForm,
  setShowForm,
}) {

  const navigate = useNavigate();

  const [flags, setFlags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFlag, setSelectedFlag] = useState(null);
    useEffect(() => {
    loadFlags();
  }, []);

  const loadFlags = async () => {
    try {
      setLoading(true);

      const data = await getFlags();

      console.log("API Response:", data);

      setFlags(data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Unable to fetch feature flags.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (flagKey) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${flagKey}"?`
    );

    if (!confirmDelete) return;

    try {
      await deleteFlag(flagKey);

      toast.success("Feature Flag Deleted Successfully!");

      loadFlags();
    } catch (error) {
      console.error(error);

      toast.error("Failed to Delete Feature Flag!");
    }
  };
    const filteredFlags = flags.filter((flag) => {
    const matchesSearch =
      flag.flag_key
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      flag.owner_team
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      flag.flag_type
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "enabled"
        ? flag.enabled
        : !flag.enabled;

    return matchesSearch && matchesStatus;
  });

  const totalFlags = filteredFlags.length;

  const enabledFlags = filteredFlags.filter(
    (flag) => flag.enabled
  ).length;

  const disabledFlags = filteredFlags.filter(
    (flag) => !flag.enabled
  ).length;

  const teams = [
    ...new Set(
      filteredFlags.map((flag) => flag.owner_team)
    ),
  ].length;

  const lastUpdated =
    filteredFlags.length > 0
      ? [...filteredFlags]
          .sort(
            (a, b) =>
              new Date(b.updated_at) -
              new Date(a.updated_at)
          )[0].updated_at
      : null;

  const activeEnvironment = environment;
    return (
    <div className="flags-page">
      

      {/* ================= PAGE HEADER ================= */}

      <div className="page-header">

        <div>

          <h1 className="page-title">
            Feature Flags
          </h1>

          <p className="page-subtitle">
            Manage feature flags across environments.
          </p>

        </div>

      </div>

      {/* ================= WELCOME ================= */}

      <div className="welcome-banner">

        <div className="welcome-content">

          <h2>
            Welcome Back 👋
          </h2>

          <p>
            Manage and monitor feature flags across
            Development, Staging and Production
            environments.
          </p>

        </div>

      </div>

      {/* ================= DASHBOARD ================= */}

      <div className="dashboard-cards">

        {/* Total */}

        <div className="dashboard-card total">

          <div className="card-icon total-icon">
            <FiFlag />
          </div>

          <h3>{totalFlags}</h3>

          <p>Total Flags</p>

          <small>
            Manage all feature flags
          </small>

        </div>

        {/* Enabled */}

        <div className="dashboard-card enabled">

          <div className="card-icon enabled-icon">
            <FiCheckCircle />
          </div>

          <h3>{enabledFlags}</h3>

          <p>Enabled</p>

          <small>
            Currently active
          </small>

        </div>

        {/* Disabled */}

        <div className="dashboard-card disabled">

          <div className="card-icon disabled-icon">
            <FaToggleOff />
          </div>

          <h3>{disabledFlags}</h3>

          <p>Disabled</p>

          <small>
            Currently inactive
          </small>

        </div>

        {/* Teams */}

        <div className="dashboard-card team">

          <div className="card-icon team-icon">
            <FiUsers />
          </div>

          <h3>{teams}</h3>

          <p>Teams</p>

          <small>
            Managing feature flags
          </small>

        </div>

        {/* Last Updated */}

        <div className="dashboard-card updated">

          <div className="card-icon updated-icon">
            🕒
          </div>

          <h3>
  {lastUpdated
    ? new Date(lastUpdated).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "-"}
</h3>

          <p>Last Updated</p>

          <small>
            Most recently modified flag
          </small>

        </div>

        {/* Active Environment */}

        <div className="dashboard-card environment">

          <div className="card-icon environment-icon">
            🌍
          </div>

          <h3>{activeEnvironment}</h3>

          <p>Environment</p>

          <small>
            Current selected environment
          </small>

        </div>

      </div>
            {/* ================= TABLE TOOLBAR ================= */}

      <div className="table-toolbar">

        <div className="filter-buttons">

          <button
            className={`filter-btn ${
              statusFilter === "all"
                ? "active-filter"
                : ""
            }`}
            onClick={() => setStatusFilter("all")}
          >
            <FiFlag />
            All
          </button>

          <button
            className={`filter-btn ${
              statusFilter === "enabled"
                ? "active-filter"
                : ""
            }`}
            onClick={() => setStatusFilter("enabled")}
          >
            <FiCheckCircle />
            Enabled
          </button>

          <button
            className={`filter-btn ${
              statusFilter === "disabled"
                ? "active-filter"
                : ""
            }`}
            onClick={() => setStatusFilter("disabled")}
          >
            <FaToggleOff />
            Disabled
          </button>

        </div>

        <div className="search-container">

          <span className="search-icon">
            🔍
          </span>

          <input
            type="text"
            className="search-box"
            placeholder="Search feature flags..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
          />

        </div>

      </div>
            {/* ================= MODAL ================= */}

      {showForm && (

        <div className="modal-overlay">

          <div className="modal-content">

            <FlagForm
              flag={selectedFlag}

              onClose={() => {
                setSelectedFlag(null);
                setShowForm(false);
              }}

              onFlagCreated={() => {
                loadFlags();
                setSelectedFlag(null);
                setShowForm(false);
              }}

            />

          </div>

        </div>

      )}
            {/* ================= LOADING ================= */}

      {loading && (
        <p className="loading">
          Loading Feature Flags...
        </p>
      )}

      {/* ================= ERROR ================= */}

      {!loading && error && (
        <p className="error">
          {error}
        </p>
      )}
            {/* ================= TABLE ================= */}

      {!loading && !error && (

        <table className="flag-table">

          <thead>

            <tr>

              <th>Flag Key</th>
              <th>Type</th>
              <th>Status</th>
              <th>Owner Team</th>
              <th>Action</th>

            </tr>

          </thead>

          <tbody>

            {filteredFlags.length > 0 ? (

              filteredFlags.map((flag) => (

                <tr key={flag.id}>

                  <td>
  <span
    className="flag-key"
    onClick={() =>
      navigate(`/flag/${flag.id}`, {
        state: { flag },
      })
    }
  >
    {flag.flag_key}
  </span>
</td>

                  <td>

                    <span className="type-badge">
                      {flag.flag_type}
                    </span>

                  </td>

                  <td>

                    <span
                      className={
                        flag.enabled
                          ? "status-enabled"
                          : "status-disabled"
                      }
                    >
                      {flag.enabled
                        ? "Enabled"
                        : "Disabled"}
                    </span>

                  </td>

                  <td>

                    <span className="owner-badge">
                      {flag.owner_team}
                    </span>

                  </td>

                  <td className="action-buttons">

                    <button
                      className="icon-btn edit-btn"
                      title="Edit Flag"
                      onClick={() => {
                        setSelectedFlag(flag);
                        setShowForm(true);
                      }}
                    >
                      <FiEdit2 />
                    </button>

                    <button
                      className="icon-btn delete-btn"
                      title="Delete Flag"
                      onClick={() =>
                        handleDelete(flag.flag_key)
                      }
                    >
                      <FiTrash2 />
                    </button>

                  </td>

                </tr>

              ))

            ) : (

              <tr>

                <td colSpan="5" className="empty">
  <div>
    <h3>🔍 No Feature Flags Found</h3>

    <p>
      Try changing your search or filter.
    </p>
  </div>
</td>

              </tr>

            )}

          </tbody>

        </table>

      )}
          </div>
  );
}

export default Flags;