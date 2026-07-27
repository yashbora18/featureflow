import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import {
  FiFlag,
  FiCheckCircle,
  FiUsers,
} from "react-icons/fi";

import { MdEdit, MdDelete } from "react-icons/md";
import { FaToggleOff } from "react-icons/fa";
import { toast } from "react-toastify";

import "./Flags.css";

import {
  getFlags,
  deleteFlag,
} from "../services/flagService";

import FlagForm from "../components/FlagForm";
import SuccessModal from "../components/SuccessModal";
import CustomModal from "../components/CustomModal";

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

  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  const [flagToDelete, setFlagToDelete] =
    useState(null);

    const [showSuccessModal, setShowSuccessModal] =
  useState(false);

const [successMessage, setSuccessMessage] =
  useState("");

  useEffect(() => {
    loadFlags();
  }, []);

  const loadFlags = async () => {
    try {

      setLoading(true);

      const data = await getFlags();

      setFlags(data);

      setError("");

    } catch (err) {

      console.error(err);

      setError(
        "Unable to fetch feature flags."
      );

    } finally {

      setLoading(false);

    }
  };

  const handleDeleteClick = (flag) => {
  console.log("handleDeleteClick");

  setFlagToDelete(flag);

  console.log("Setting modal true");

  setShowDeleteModal(true);
};

  const confirmDelete = async () => {

    try {

      await deleteFlag(flagToDelete.flag_key);

      setShowDeleteModal(false);

setFlagToDelete(null);

loadFlags();

setSuccessMessage("Feature Flag Deleted Successfully!");

setShowSuccessModal(true);

    } catch (error) {

      console.error(error);

      toast.error(
        "Failed to Delete Feature Flag!"
      );
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

  const enabledFlags =
    filteredFlags.filter(
      (flag) => flag.enabled
    ).length;

  const disabledFlags =
    filteredFlags.filter(
      (flag) => !flag.enabled
    ).length;

  const teams = [
    ...new Set(
      filteredFlags.map(
        (flag) => flag.owner_team
      )
    ),
  ].length;

  return (    <div className="flags-page">

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

          <div
    className="card-icon"
    style={{ background: "#eef4ff" }}
>
    <FiFlag size={30} color="#64748b" />
</div>

          <h3>{totalFlags}</h3>

          <p>Total Flags</p>

          <small>
            Manage all feature flags
          </small>

        </div>

        {/* Enabled */}

        <div className="dashboard-card enabled">

          <div
    className="card-icon"
    style={{ background: "#ecfdf5" }}
>
    <FiCheckCircle size={30} color="#22c55e" />
</div>

          <h3>{enabledFlags}</h3>

          <p>Enabled</p>

          <small>
            Currently active
          </small>

        </div>

        {/* Disabled */}

        <div className="dashboard-card disabled">

          <div
    className="card-icon"
    style={{ background: "#fef2f2" }}
>
    <FaToggleOff size={30} color="#ef4444" />
</div>

          <h3>{disabledFlags}</h3>

          <p>Disabled</p>

          <small>
            Currently inactive
          </small>

        </div>

        {/* Teams */}

        <div className="dashboard-card team">

          <div
    className="card-icon"
    style={{ background: "#f5f3ff" }}
>
    <FiUsers size={30} color="#8b5cf6" />
</div>

          <h3>{teams}</h3>

          <p>Teams</p>

          <small>
            Managing feature flags
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

<button
  className="create-flag-btn"
  onClick={() => {
    setSelectedFlag(null);
    setShowForm(true);
  }}
>
  + Create Flag
</button>

      </div>

      {/* ================= CREATE / EDIT MODAL ================= */}

      {showForm && (

        <div className="modal-overlay">

          <div className="modal-content">

            <FlagForm
              flag={selectedFlag}

              onClose={() => {
                setSelectedFlag(null);
                setShowForm(false);
              }}

              onFlagCreated={(message) => {

  loadFlags();

  setSelectedFlag(null);

  setShowForm(false);

  setSuccessMessage(message);

  setShowSuccessModal(true);

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
    <th>FLAG ID</th>
    <th>FLAG KEY</th>
    <th>TYPE</th>
    <th>STATUS</th>
    <th>OWNER TEAM</th>
    <th>ACTIONS</th>
  </tr>
</thead>

          <tbody>
  {filteredFlags.length > 0 ? (

    filteredFlags.map((flag) => (

      <tr key={flag.id}>

        {/* Flag ID */}
        <td>
          <span className="flag-id">
            {flag.id}
          </span>
        </td>

        {/* Flag Key */}
        <td>
  <span
    className="flag-key"
    onClick={() => {
      navigate(`/flag/${flag.flag_key}`);
    }}
  >
    {flag.flag_key}
  </span>
</td>

        {/* Flag Type */}
        <td>
          <span className="type-badge">
            {flag.flag_type}
          </span>
        </td>

        {/* Status */}
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

        {/* Owner */}
        <td>
          <span className="owner-badge">
            {flag.owner_team}
          </span>
        </td>

        {/* Actions */}
        <td className="action-buttons">

          <button
  className="icon-btn edit-btn"
  title="Edit Flag"
  onClick={() => {
    setSelectedFlag(flag);
    setShowForm(true);
  }}
>
  <MdEdit size={10} />
</button>

<button
  className="icon-btn delete-btn"
  title="Delete Flag"
  onClick={() => {
    handleDeleteClick(flag);
  }}
>
  <MdDelete size={10} />
</button>

        </td>

      </tr>

    ))

  ) : (

    <tr>

      <td colSpan="6" className="empty">

        <div>

          <h3>🔍 No Feature Flags Found</h3>

          <p>Try changing your search or filter.</p>

        </div>

      </td>

    </tr>

  )}
</tbody>

        </table>

      )}

      {showDeleteModal && (
  <CustomModal
    isOpen={showDeleteModal}
    title="Delete this flag?"
    message={
      flagToDelete
        ? `"${flagToDelete.flag_key}" will be permanently deleted.`
        : ""
    }
    confirmText="Delete"
    cancelText="Cancel"
    danger={true}
    onConfirm={confirmDelete}
    onCancel={() => {
      setShowDeleteModal(false);
      setFlagToDelete(null);
    }}
  />
)}

<SuccessModal
  isOpen={showSuccessModal}
  title="Success!"
  message={successMessage}
  buttonText="OK"
  onClose={() => setShowSuccessModal(false)}
/>

    </div>

  );
}

export default Flags;