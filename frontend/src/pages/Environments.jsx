import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  FaGlobe,
  FaCog,
  FaInbox,
  FaFlag,
  FaSeedling,
  FaFlask,
  FaRocket,
  FaEdit,
} from "react-icons/fa";
import "./Environments.css";

function Environments() {
  /* ==========================
          STATE
  ========================== */

  const [showOverrideModal, setShowOverrideModal] = useState(false);

const [selectedOverride, setSelectedOverride] = useState(null);

const [overrideValue, setOverrideValue] = useState("false");

  const [environments, setEnvironments] = useState([]);
  const [flags, setFlags] = useState([]);
  const [selectedFlag, setSelectedFlag] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const [overrides, setOverrides] = useState([]);

  /* ==========================
          CREATE
  ========================== */

  const [showCreateModal, setShowCreateModal] = useState(false);

  const [newEnvironment, setNewEnvironment] = useState({
    name: "",
    description: "",
  });

  const [isCreating, setIsCreating] = useState(false);

  /* ==========================
          UPDATE
  ========================== */

  const [editingEnvironment, setEditingEnvironment] =
    useState(null);

  const [editedName, setEditedName] = useState("");
const [editedDescription, setEditedDescription] = useState("");

  const [isSaving, setIsSaving] = useState(false);

  /* ==========================
          DELETE
  ========================== */

  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  const [environmentToDelete, setEnvironmentToDelete] =
    useState(null);

  const [isDeleting, setIsDeleting] = useState(false);

  /* ==========================
          DASHBOARD STATS
  ========================== */

  const totalEnvironments =
    environments.filter(
      (env) => env.name !== "Testing"
    ).length;

  const totalOverrides =
    overrides.filter(
      (o) => o.flag_id === selectedFlag
    ).length;

  const totalWithoutOverrides =
    totalEnvironments - totalOverrides;

  /* ==========================
          FILTERED ENVIRONMENTS
  ========================== */

  const filteredEnvironments = environments
    .filter((env) => env.name !== "Testing")
    .filter((env) => {

      const matchesSearch = env.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const hasOverride = overrides.some(
        (o) =>
          o.flag_id === selectedFlag &&
          o.environment_id === env.id
      );

      if (filterType === "override") {
        return matchesSearch && hasOverride;
      }

      if (filterType === "no-override") {
        return matchesSearch && !hasOverride;
      }

      return matchesSearch;
    });

  /* ==========================
          INITIAL LOAD
  ========================== */

  useEffect(() => {
    const fetchData = async () => {
      await loadEnvironments();
      await loadFlags();
      await loadOverrides();
    };

    fetchData();
  }, []);

  /* ==========================
          LOAD ENVIRONMENTS
  ========================== */

  const loadEnvironments = async () => {
    try {

      const response = await fetch(
        "http://127.0.0.1:8000/environments/"
      );

      const data = await response.json();

      setEnvironments(data);

    } catch (error) {

      console.error(
        "Failed to load environments:",
        error
      );

      toast.error("Unable to load environments.");
    }
  };

  /* ==========================
          LOAD FLAGS
  ========================== */

  const loadFlags = async () => {
    try {

      const response = await fetch(
        "http://127.0.0.1:8000/flags/"
      );

      const data = await response.json();

      setFlags(data);

      if (data.length > 0) {
        setSelectedFlag(data[0].id);
      }

    } catch (error) {

      console.error(error);

      toast.error("Unable to load flags.");
    }
  };

  /* ==========================
          LOAD OVERRIDES
  ========================== */

  const loadOverrides = async () => {
    try {

      const response = await fetch(
        "http://127.0.0.1:8000/flag-overrides/"
      );

      const data = await response.json();

      setOverrides(data);

    } catch (error) {

      console.error(error);

      toast.error("Unable to load overrides.");
    }
  };
  /* ==========================
        CREATE ENVIRONMENT
========================== */

const createEnvironment = async () => {

  if (!newEnvironment.name.trim()) {
    toast.warning("Environment name is required.");
    return;
  }

  try {

    setIsCreating(true);

    const response = await fetch(
      "http://127.0.0.1:8000/environments/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEnvironment),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to create environment");
    }

    toast.success("Environment created successfully!");

    setShowCreateModal(false);

    setNewEnvironment({
      name: "",
      description: "",
    });

    await loadEnvironments();

  } catch (error) {

    console.error(error);

    toast.error("Unable to create environment.");

  } finally {

    setIsCreating(false);

  }

};

/* ==========================
        UPDATE ENVIRONMENT
========================== */

const updateEnvironment = async () => {

  if (!editedName.trim()) {
    toast.warning("Environment name cannot be empty.");
    return;
  }

  try {

    setIsSaving(true);

    const response = await fetch(
      `http://127.0.0.1:8000/environments/${editingEnvironment.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
  name: editedName,
  description: editedDescription,
}),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update environment");
    }

    await loadEnvironments();

    toast.success("Environment updated successfully!");

    setEditingEnvironment(null);
    setEditedName("");

  } catch (error) {

    console.error(error);

    toast.error("Unable to update environment.");

  } finally {

    setIsSaving(false);

  }

};

/* ==========================
        DELETE ENVIRONMENT
========================== */

const deleteEnvironment = async () => {

  try {

    setIsDeleting(true);

    const response = await fetch(
      `http://127.0.0.1:8000/environments/${environmentToDelete.id}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete environment");
    }

    await loadEnvironments();
    await loadOverrides();

    toast.success("Environment deleted successfully!");

    setShowDeleteModal(false);
    setEnvironmentToDelete(null);

  } catch (error) {

    console.error(error);

    toast.error("Unable to delete environment.");

  } finally {

    setIsDeleting(false);

  }

};

/* ==========================
        HELPER FUNCTIONS
========================== */

const getOverride = (environmentId) => {

  return overrides.find(
    (override) =>
      override.flag_id === selectedFlag &&
      override.environment_id === environmentId
  );

};

const formatDate = (date) => {

  if (!date) return "--";

  return new Date(date).toLocaleString();

};

/* ==========================
        JSX START
========================== */


const saveOverride = async () => {
  try {
    const isUpdate = selectedOverride.override !== undefined &&
                     selectedOverride.override !== null;

    const url = isUpdate
      ? `http://127.0.0.1:8000/flag-overrides/${selectedOverride.override.id}`
      : "http://127.0.0.1:8000/flag-overrides/";

    const method = isUpdate ? "PUT" : "POST";

    const body = isUpdate
      ? {
          override_value: overrideValue,
        }
      : {
          flag_id: selectedFlag,
          environment_id: selectedOverride.environmentId,
          override_value: overrideValue,
        };

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error("Failed to save override");
    }

    toast.success(
      isUpdate
        ? "Override updated successfully!"
        : "Override created successfully!"
    );

    setShowOverrideModal(false);

    await loadOverrides();

  } catch (error) {
    console.error(error);
    toast.error(error.message);
  }
};

return (

<div className="environment-page">

  {/* ===========================
          PAGE HEADER
  =========================== */}

  <div className="page-header">

    <h1>Environment Management</h1>

    <p>
      Manage all environments used in your Feature Flag System.
    </p>

  </div>

  {/* ===========================
          DASHBOARD STATISTICS
  =========================== */}

  <div className="stats-grid">

    {/* Total Environments */}

    <div className="stat-card">

      <div className="stat-icon">
        <FaGlobe />
      </div>

      <h2>{totalEnvironments}</h2>

      <p>Total Environments</p>

      <span className="stat-description">

        {environments
          .filter((env) => env.name !== "Testing")
          .map((env) => env.name)
          .join(" • ")}

      </span>

    </div>

    {/* Overrides */}

    <div className="stat-card">

      <div className="stat-icon">
        <FaCog />
      </div>

      <h2>{totalOverrides}</h2>

      <p>Environment Overrides</p>

      <span className="stat-description">
        Custom override values configured
      </span>

    </div>

    {/* No Overrides */}

    <div className="stat-card">

      <div className="stat-icon">
        <FaInbox />
      </div>

      <h2>{totalWithoutOverrides}</h2>

      <p>No Overrides</p>

      <span className="stat-description">
        Using feature flag default values
      </span>

    </div>

  </div>

  {/* ===========================
          SEARCH & FILTER
  =========================== */}

  <div className="toolbar">

    <div className="search-box">

      <input
        type="text"
        placeholder="🔍 Search Environment..."
        value={searchTerm}
        onChange={(e) =>
          setSearchTerm(e.target.value)
        }
      />


    </div>

    <div className="filter-box">

      <label>Filter</label>

      <select
        value={filterType}
        onChange={(e) =>
          setFilterType(e.target.value)
        }
      >

        <option value="all">
          All
        </option>

        <option value="override">
          Only Overrides
        </option>

        <option value="no-override">
          No Overrides
        </option>

      </select>

    </div>

  </div>

  {/* ===========================
          FEATURE FLAG SELECTOR
  =========================== */}

  <div className="flag-selector">

    <div className="flag-info">

      <div className="flag-icon">
        <FaFlag />
      </div>

      <div className="flag-content">

        <h3>Feature Flag</h3>

        <p>
          Manage environment overrides for the selected feature.
        </p>

        <span className="environment-count">

          Showing <strong>{filteredEnvironments.length}</strong> environments

        </span>

      </div>

    </div>

    <div className="flag-dropdown">

      <label>Select Feature</label>

      <select
        value={selectedFlag ?? ""}
        onChange={(e) =>
          setSelectedFlag(Number(e.target.value))
        }
      >

        {flags.map((flag) => (

          <option
            key={flag.id}
            value={flag.id}
          >
            {flag.flag_key}
          </option>

        ))}

      </select>

    </div>

  </div>

  {/* ===========================
        ENVIRONMENT TABLE
=========================== */}

<div className="environment-card">

  <div className="table-header">

    <div>

      <h3>Environment List</h3>

      <p>
        Showing <strong>{filteredEnvironments.length}</strong> of{" "}
        <strong>{totalEnvironments}</strong> environments
      </p>

    </div>

    <button
      className="add-environment-btn"
      onClick={() => setShowCreateModal(true)}
    >
      + Add Environment
    </button>

  </div>

  <table className="environment-table">

    <thead>

      <tr>

        <th>ID</th>
        <th>Environment</th>
        <th>Description</th>
        <th>Status</th>
        <th>Action</th>

      </tr>

    </thead>

    <tbody>

      {filteredEnvironments.length > 0 ? (

        filteredEnvironments.map((env) => (

          <tr key={env.id}>

            <td>{env.id}</td>

            <td>

              <div className="environment-name">

                <span className="environment-icon">

                  {env.name === "Development" && <FaSeedling />}

                  {env.name === "Staging" && <FaFlask />}

                  {env.name === "Production" && <FaRocket />}

                </span>

                {env.name}

              </div>

            </td>

            <td>{env.description || "--"}</td>

            <td>

              <span className="status-enabled">
                Active
              </span>

            </td>

            <td>

              <div className="action-buttons">

                <button
                  className="edit-btn"
                  onClick={() => {
                    setEditingEnvironment(env);
setEditedName(env.name);
setEditedDescription(env.description || "");
                  }}
                >
                  Edit
                </button>

                <button
                  className="delete-btn"
                  onClick={() => {
                    setEnvironmentToDelete(env);
                    setShowDeleteModal(true);
                  }}
                >
                  Delete
                </button>

              </div>

            </td>

          </tr>

        ))

      ) : (

        <tr>

          <td colSpan="5">
            No environments found.
          </td>

        </tr>

      )}

    </tbody>

  </table>

</div>

{/* ===========================
        CREATE ENVIRONMENT MODAL
=========================== */}

{showCreateModal && (

<div
  className="modal-overlay"
  onClick={() => {

    setShowCreateModal(false);

    setNewEnvironment({
      name: "",
      description: "",
    });

  }}
>

  <div
    className="modal"
    onClick={(e) => e.stopPropagation()}
  >

    <h2>Create Environment</h2>

    <input
      type="text"
      placeholder="Environment Name"
      value={newEnvironment.name}
      onChange={(e) =>
        setNewEnvironment({
          ...newEnvironment,
          name: e.target.value,
        })
      }
    />

    <textarea
      placeholder="Environment Description"
      rows="4"
      value={newEnvironment.description}
      onChange={(e) =>
        setNewEnvironment({
          ...newEnvironment,
          description: e.target.value,
        })
      }
      style={{ marginTop: "15px" }}
    />

    <div className="modal-actions">

      <button
        className="cancel-btn"
        onClick={() => {

          setShowCreateModal(false);

          setNewEnvironment({
            name: "",
            description: "",
          });

        }}
      >
        Cancel
      </button>

      <button
        className="save-btn"
        onClick={createEnvironment}
        disabled={isCreating}
      >
        {isCreating ? "Creating..." : "Create"}
      </button>

    </div>

  </div>

</div>

)}

{/* ===========================
        FLAG OVERRIDES BY ENVIRONMENT
=========================== */}

<div className="override-card">

  <div className="table-header">

    <div>

      <h3>Flag Overrides by Environment</h3>

      <p>
        Configure override values for the selected feature flag
        in each environment.
      </p>

    </div>

  </div>

  <table className="environment-table">

    <thead>

      <tr>

        <th>Environment</th>
        <th>Override Value</th>
        <th>Status</th>
        <th>Last Updated</th>
        <th>Action</th>

      </tr>

    </thead>

    <tbody>

      {filteredEnvironments.length > 0 ? (

        filteredEnvironments.map((env) => {

          const override = getOverride(env.id);

          return (

            <tr key={`override-${env.id}`}>

              <td>

                <div className="environment-name">

                  <span className="environment-icon">

                    {env.name === "Development" && <FaSeedling />}
                    {env.name === "Staging" && <FaFlask />}
                    {env.name === "Production" && <FaRocket />}

                  </span>

                  {env.name}

                </div>

              </td>

              <td>

                <label className="switch">

                  <input
                    type="checkbox"
                    checked={override?.override_value === "true"}
                    readOnly
                  />

                  <span className="slider"></span>

                </label>

              </td>

              <td>

                {override ? (

                  <span className="status-enabled">
                    Overridden
                  </span>

                ) : (

                  <span className="status-disabled">
                    Default
                  </span>

                )}

              </td>

              <td>

                {override?.updated_at
                  ? formatDate(override.updated_at)
                  : "--"}

              </td>

              <td>

                <button
                  className="edit-btn"
                  onClick={() => {
  setSelectedOverride({
    environmentId: env.id,
    override: override,
  });

  setOverrideValue(override?.override_value ?? "false");

  setShowOverrideModal(true);
}}
                >
                  <FaEdit size={16} />
<span>Edit</span>
                </button>

              </td>

            </tr>

          );

        })

      ) : (

        <tr>

          <td colSpan="5">
            No override records available.
          </td>

        </tr>

      )}

    </tbody>

  </table>

  <div className="override-info-box">
  <div className="override-info-icon">
    ℹ️
  </div>

  <div className="override-info-content">
    <strong>Environment Overrides</strong>

    <p>
      Override values apply only to the selected environment.
      If no override is configured, the feature flag will use its
      default value during evaluation.
    </p>
  </div>
</div>

</div>

{/* ===========================
        EDIT ENVIRONMENT MODAL
=========================== */}

{editingEnvironment && (

<div
  className="modal-overlay"
  onClick={() => {

    setEditingEnvironment(null);
    setEditedName("");

  }}
>

  <div
    className="modal"
    onClick={(e) => e.stopPropagation()}
  >

    <h2>Edit Environment</h2>

    <input
      type="text"
      value={editedName}
      onChange={(e) =>
        setEditedName(e.target.value)
      }
    />

    <textarea
  rows="4"
  placeholder="Environment Description"
  value={editedDescription}
  onChange={(e) => setEditedDescription(e.target.value)}
  style={{ marginTop: "15px" }}
/>

    <div className="modal-actions">

      <button
        className="cancel-btn"
        onClick={() => {

          setEditingEnvironment(null);
          setEditedName("");

        }}
      >
        Cancel
      </button>

      <button
        className="save-btn"
        onClick={updateEnvironment}
        disabled={isSaving}
      >
        {isSaving ? "Saving..." : "Save"}
      </button>

    </div>

  </div>

</div>

)}

{/* ===========================
        DELETE ENVIRONMENT MODAL
=========================== */}

{showDeleteModal && (

<div
  className="modal-overlay"
  onClick={() => {

    setShowDeleteModal(false);
    setEnvironmentToDelete(null);

  }}
>

  <div
    className="modal"
    onClick={(e) => e.stopPropagation()}
  >

    <h2>Delete Environment</h2>

    <p className="delete-message">

      Are you sure you want to delete

      <strong>
        {" "}
        {environmentToDelete?.name}
      </strong>
      ?

    </p>

    <p className="delete-warning">
      This action cannot be undone.
    </p>

    <div className="modal-actions">

      <button
        className="cancel-btn"
        onClick={() => {

          setShowDeleteModal(false);
          setEnvironmentToDelete(null);

        }}
      >
        Cancel
      </button>

      <button
        className="confirm-delete-btn"
        onClick={deleteEnvironment}
        disabled={isDeleting}
      >
        {isDeleting ? "Deleting..." : "Delete"}
      </button>

    </div>

  </div>

</div>

)}

{showOverrideModal && (
  <div className="custom-modal-overlay">
    <div className="custom-modal">

      <h2>Edit Override</h2>

      <div className="form-group">
        <label>Override Value</label>

        <select
          value={overrideValue}
          onChange={(e) => setOverrideValue(e.target.value)}
        >
          <option value="true">Enabled (True)</option>
          <option value="false">Disabled (False)</option>
        </select>
      </div>

      <div className="modal-buttons">

        <button
          className="secondary-button"
          onClick={() => setShowOverrideModal(false)}
        >
          Cancel
        </button>

        <button
          className="primary-button"
          onClick={saveOverride}
        >
          Save
        </button>

      </div>

    </div>
  </div>
)}

</div>

);

}

export default Environments;