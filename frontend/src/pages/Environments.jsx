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
  FaCheckCircle,
  FaTimesCircle,
  FaServer,
} from "react-icons/fa";


import "./Environments.css";
import { useTranslation } from "react-i18next";
import PageHeader from "../components/common/PageHeader";
import {
  FiGlobe,
  FiPlus,
  FiSearch, 
  FiFilter,
  FiRefreshCw,
} from "react-icons/fi";


function Environments() {
  const { t } = useTranslation();
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

  const [isRefreshing, setIsRefreshing] = useState(false);

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

    const activeEnvironments =
    environments.filter(
      (env)=> env.name !== "Testing"
    ).length;

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
}, [t]);

  /* ==========================
          LOAD ENVIRONMENTS
  ========================== */

  const loadEnvironments = async () => {
    try {

      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/environments/`
      );

      const data = await response.json();

      setEnvironments(data);

    } catch (error) {

      console.error(
        "Failed to load environments:",
        error
      );

      toast.error(t("environment.messages.loadFailed"));
    }
  };

  /* ==========================
          LOAD FLAGS
  ========================== */

  const loadFlags = async () => {
    try {

      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/flags/`
      );

      const data = await response.json();

      setFlags(data);

      if (data.length > 0) {
        setSelectedFlag(data[0].id);
      }

    } catch (error) {

      console.error(error);

      toast.error(t("environment.messages.flagsLoadFailed"));
    }
  };

  /* ==========================
          LOAD OVERRIDES
  ========================== */

  const loadOverrides = async () => {
    try {

      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/flag-overrides/`
      );

      const data = await response.json();

      setOverrides(data);

    } catch (error) {

      console.error(error);

      toast.error(t("environment.messages.overridesLoadFailed"));
    }
  };

  const refreshEnvironmentData = async () => {

  try {

    setIsRefreshing(true);


    await Promise.all([
      loadEnvironments(),
      loadFlags(),
      loadOverrides()
    ]);


    toast.success("Environment data refreshed successfully");


  } catch(error){

    console.error(error);

    toast.error("Failed to refresh data");


  } finally {

    setIsRefreshing(false);

  }

};
  /* ==========================
        CREATE ENVIRONMENT
========================== */

const createEnvironment = async () => {

  if (!newEnvironment.name.trim()) {
    toast.warning(t("environment.messages.nameRequired"));
    return;
  }

  try {

    setIsCreating(true);

    const response = await fetch(
      `${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/environments/`,
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

    toast.success(t("environment.messages.created"));

    setShowCreateModal(false);

    setNewEnvironment({
      name: "",
      description: "",
    });

    await loadEnvironments();

  } catch (error) {

    console.error(error);

    toast.error(t("environment.messages.createFailed"));

  } finally {

    setIsCreating(false);

  }

};

/* ==========================
        UPDATE ENVIRONMENT
========================== */

const updateEnvironment = async () => {

  if (!editedName.trim()) {
    toast.warning(t("environment.messages.nameEmpty"));
    return;
  }

  try {

    setIsSaving(true);

    const response = await fetch(
      `${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/environments/${editingEnvironment.id}`,
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

    toast.success(t("environment.messages.updated"));

    setEditingEnvironment(null);
    setEditedName("");

  } catch (error) {

    console.error(error);

    toast.error(t("environment.messages.updateFailed"));

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
      `${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/environments/${environmentToDelete.id}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete environment");
    }

    await loadEnvironments();
    await loadOverrides();

    toast.success(t("environment.messages.deleted"));

    setShowDeleteModal(false);
    setEnvironmentToDelete(null);

  } catch (error) {

    console.error(error);

    toast.error(t("environment.messages.deleteFailed"));

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
      ? `${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/flag-overrides/${selectedOverride.override.id}`
      : `${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/flag-overrides/`;

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
    ? t("environment.messages.overrideUpdated")
    : t("environment.messages.overrideCreated")
);

    setShowOverrideModal(false);

    await loadOverrides();

  } catch (error) {
    console.error(error);
    toast.error(t("environment.messages.overrideFailed"));
  }
};

return (

<div className="environment-page">

  <PageHeader

icon={<FiGlobe />}

title={t("environment.pageTitle")}

description={t("environment.pageDescription")}

action={
<>
<button
className="primary-btn"
onClick={() => setShowCreateModal(true)}
>

<FiPlus />

{t("environment.createEnvironment")}

</button>


<button
className="primary-btn"
onClick={refreshEnvironmentData}
disabled={isRefreshing}
>

<FiRefreshCw
className={isRefreshing ? "rotate-icon" : ""}
/>

{
isRefreshing
? "Refreshing..."
: "Refresh"
}

</button>

</>
}

/>

  {/* ===========================
          DASHBOARD STATISTICS
=========================== */}

<div className="stats-grid">


{/* TOTAL ENVIRONMENTS */}

<div className="stat-card">

  <div className="stat-icon">
    <FaGlobe />
  </div>


  <div className="stat-content">

    <div className="stat-value">
      {totalEnvironments}
    </div>


    <div className="stat-title">
      {t("environment.totalEnvironments")}
    </div>


    <div className="stat-description">

      {environments
        .filter((env)=>env.name !== "Testing")
        .map((env)=>
          env.name === "Development"
          ? t("environment.development")
          : env.name === "Staging"
          ? t("environment.staging")
          : env.name === "Production"
          ? t("environment.production")
          : env.name
        )
        .join(" • ")}

    </div>

  </div>

</div>




{/* ACTIVE ENVIRONMENTS */}

<div className="stat-card">

  <div className="stat-icon">
    <FaServer />
  </div>


  <div className="stat-content">

    <div className="stat-value">
      {activeEnvironments}
    </div>


   <div className="stat-title">
  {t("environment.activeEnvironments")}
</div>

<div className="stat-description">
  {t("environment.allEnvironmentsAvailable")}
</div>

  </div>

</div>




{/* ENVIRONMENT OVERRIDES */}

<div className="stat-card">

  <div className="stat-icon">
    <FaCog />
  </div>


  <div className="stat-content">

    <div className="stat-value">
      {totalOverrides}
    </div>


    <div className="stat-title">
      {t("environment.environmentOverride")}
    </div>


    <div className="stat-description">
      {t("environment.customOverridesConfigured")}
    </div>

  </div>

</div>




{/* DEFAULT CONFIGURATIONS */}

<div className="stat-card">

  <div className="stat-icon">
    <FaInbox />
  </div>


  <div className="stat-content">

    <div className="stat-value">
      {totalWithoutOverrides}
    </div>


    <div className="stat-title">
  {t("environment.defaultConfigurations")}
</div>

<div className="stat-description">
  {t("environment.usingDefaultValues")}
</div>

  </div>

</div>


</div>

  <div className="toolbar">

  <div className="toolbar-left">

    <div className="search-box">

      <FiSearch className="search-icon" />

      <input
        type="text"
        placeholder={t("environment.searchPlaceholder")}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

    </div>

    <div className="filter-box">

      <FiFilter className="filter-icon" />

      <select
        value={filterType}
        onChange={(e) => setFilterType(e.target.value)}
      >
        <option value="all">
          {t("environment.all")}
        </option>

        <option value="override">
          {t("environment.onlyOverrides")}
        </option>

        <option value="no-override">
          {t("environment.noOverrideFilter")}
        </option>

      </select>

    </div>

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

       <h3>{t("environment.featureFlag")}</h3>
        

        <p>{t("environment.featureFlagDescription")}</p>

        <span className="environment-count">

          {t("environment.showing")}{" "}
<strong>{filteredEnvironments.length}</strong>{" "}
{t("environment.environments")}

        </span>

      </div>

    </div>

    <div className="flag-dropdown">

      <label>{t("environment.selectFeature")}</label>

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

      <div className="table-title">

    <div className="table-title-icon">
        <FiGlobe />
    </div>

    <h3>
        {t("environment.environmentList")}
    </h3>

</div>

      <p>
  {t("environment.showing")}{" "}
  <strong>{filteredEnvironments.length}</strong>{" "}
  {t("environment.environments")} /{" "}
  <strong>{totalEnvironments}</strong>
</p>

    </div>

    

  </div>

  <table className="environment-table">

    <thead>

      <tr>

        <th>{t("environment.table.id")}</th>
<th>{t("environment.table.environment")}</th>
<th>{t("environment.table.description")}</th>
<th>{t("environment.table.status")}</th>
<th>{t("environment.table.action")}</th>

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

                {
  env.name === "Development"
    ? t("environment.development")
    : env.name === "Staging"
    ? t("environment.staging")
    : env.name === "Production"
    ? t("environment.production")
    : env.name
}

              </div>

            </td>

            <td>{env.description || "--"}</td>

            <td>

              <span className="status-enabled">
  <FaCheckCircle />
  {t("environment.active")}
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
                  {t("common.edit")}
                </button>

                <button
                  className="delete-btn"
                  onClick={() => {
                    setEnvironmentToDelete(env);
                    setShowDeleteModal(true);
                  }}
                >
                  {t("common.delete")}
                </button>

              </div>

            </td>

          </tr>

        ))

      ) : (

        <tr>

          <td colSpan="5">
  {t("environment.emptyTable")}
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

    <h2>{t("environment.createEnvironment")}</h2>

    <input
      type="text"
      placeholder={t("environment.environmentName")}
      value={newEnvironment.name}
      onChange={(e) =>
        setNewEnvironment({
          ...newEnvironment,
          name: e.target.value,
        })
      }
    />

    <textarea
  placeholder={t("environment.environmentDescription")}
  rows="4"
  value={newEnvironment.description}
  onChange={(e) =>
    setNewEnvironment({
      ...newEnvironment,
      description: e.target.value,
    })
  }
  style={{ marginTop: "15px" }}
></textarea>

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
        {t("common.cancel")}
      </button>

      <button
        className="save-btn"
        onClick={createEnvironment}
        disabled={isCreating}
      >
        {isCreating
  ? t("environment.creating")
  : t("environment.create")}
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

      <div className="table-title">

    <div className="table-title-icon">
        <FiRefreshCw />
    </div>

    <h3>
        {t("environment.overrideTitle")}
    </h3>

</div>

      <p>{t("environment.overrideDescription")}</p>

    </div>

  </div>

  <table className="environment-table">

    <thead>

      <tr>

        <th>{t("environment.table.environment")}</th>
<th>{t("environment.overrideValue")}</th>
<th>{t("environment.table.status")}</th>
<th>{t("environment.lastUpdated")}</th>
<th>{t("environment.table.action")}</th>

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

                  {
  env.name === "Development"
    ? t("environment.development")
    : env.name === "Staging"
    ? t("environment.staging")
    : env.name === "Production"
    ? t("environment.production")
    : env.name
}

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
  <FaCheckCircle />
  {t("environment.overridden")}
</span>

                ) : (

                  <span className="status-disabled">
  <FaTimesCircle />
  {t("environment.default")}
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
                  
<span>{t("common.edit")}</span>
                </button>

              </td>

            </tr>

          );

        })

      ) : (

        <tr>

          <td colSpan="5">
            {t("environment.emptyOverrides")}
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
    <strong>{t("environment.overrideInfoTitle")}</strong>

    <p>{t("environment.overrideInfoDescription")}</p>
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

    <h2>{t("environment.editEnvironment")}</h2>

    <input
      type="text"
      value={editedName}
      onChange={(e) =>
        setEditedName(e.target.value)
      }
    />

    <textarea
  rows="4"
  placeholder={t("environment.environmentDescription")}
  value={editedDescription}
  onChange={(e) => setEditedDescription(e.target.value)}
  style={{ marginTop: "15px" }}
></textarea>

    <div className="modal-actions">

      <button
        className="cancel-btn"
        onClick={() => {

          setEditingEnvironment(null);
          setEditedName("");

        }}
      >
        {t("common.cancel")}
      </button>

      <button
        className="save-btn"
        onClick={updateEnvironment}
        disabled={isSaving}
      >
        {isSaving
  ? t("environment.saving")
  : t("common.save")}
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

    <h2>{t("environment.deleteTitle")}</h2>

    <p className="delete-message">

      {t("environment.deleteConfirm")}

      <strong>
  {environmentToDelete?.name === "Development"
    ? t("environment.development")
    : environmentToDelete?.name === "Staging"
    ? t("environment.staging")
    : environmentToDelete?.name === "Production"
    ? t("environment.production")
    : environmentToDelete?.name}
</strong>
      ?

    </p>

    <p className="delete-warning">
      {t("environment.deleteWarning")}
    </p>

    <div className="modal-actions">

      <button
        className="cancel-btn"
        onClick={() => {

          setShowDeleteModal(false);
          setEnvironmentToDelete(null);

        }}
      >
        {t("common.cancel")}
      </button>

      <button
        className="confirm-delete-btn"
        onClick={deleteEnvironment}
        disabled={isDeleting}
      >
        {isDeleting
  ? t("environment.deleting")
  : t("common.delete")}
      </button>

    </div>

  </div>

</div>

)}

{showOverrideModal && (
  <div className="custom-modal-overlay">
    <div className="custom-modal">

      <h2>{t("environment.editOverride")}</h2>

      <div className="form-group">
        <label>{t("environment.overrideValue")}</label>

        <select
          value={overrideValue}
          onChange={(e) => setOverrideValue(e.target.value)}
        >
          <option value="true">{t("environment.enabledTrue")}</option>
          <option value="false">{t("environment.disabledFalse")}</option>
        </select>
      </div>

      <div className="modal-buttons">

        <button
          className="secondary-button"
          onClick={() => setShowOverrideModal(false)}
        >
          {t("common.cancel")}
        </button>

        <button
          className="primary-button"
          onClick={saveOverride}
        >
          {t("common.save")}
              </button>

      </div>

    </div>

  </div>

)}

</div>

);

}


export default Environments;
