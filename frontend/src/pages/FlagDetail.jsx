import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import GroupTargetingPanel from "../components/GroupTargetingPanel";
import TargetingRuleModal from "../components/TargetingRuleModal";

import {
  getFlag,
  updateFlag,
} from "../services/flagService";

import {
  getTargetingRules,
  addTargetingRule,
  deleteTargetingRule,
} from "../services/targetingRuleService";

import { evaluateFlag } from "../services/flagService";

import {
  FaFlag,
  FaGlobe,
  FaChartLine,
  FaFlask,
  FaBolt,
  FaBullseye,
  FaUsers,
  FaToggleOn,
  FaCalendarAlt,
  FaRegEdit,
  FaFileAlt,
  FaArrowLeft,
  FaUser,
  FaClock,
  FaInfoCircle,

  FaDatabase,
  FaPercentage,
  FaLayerGroup,
  FaKey,
  FaProjectDiagram,

} from "react-icons/fa";

import { BsBucket } from "react-icons/bs";

import "./FlagDetail.css";

function FlagDetail() {

  const navigate = useNavigate();
  const { id } = useParams();
  console.log("Route param:", id);

  const [flag, setFlag] = useState(null);

  const [targetingRules, setTargetingRules] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [lastEvaluation, setLastEvaluation] = useState("");

  const [rolloutPercentage, setRolloutPercentage] =
    useState(100);

  const [savingRollout, setSavingRollout] =
    useState(false);

  const [evaluationType, setEvaluationType] =
    useState("user");

  const [evaluationValue, setEvaluationValue] =
    useState("");

  const [evaluationResult, setEvaluationResult] =
    useState(null);

  const [evaluating, setEvaluating] =
    useState(false);

  const hasChanges =
    flag &&
    rolloutPercentage !== flag.rollout_percentage;

  useEffect(() => {

    if (!id) return;

    loadFlag();

  }, [id]);

  const loadFlag = async () => {

    try {

      const data = await getFlag(id);

      setFlag(data);

      setRolloutPercentage(
        data.rollout_percentage
      );

      loadTargetingRules(data.id);

    } catch (error) {

      console.error(error);

      toast.error("Failed to load flag.");

    }

  };

  const loadTargetingRules = async (flagId) => {

    try {

      const rules =
        await getTargetingRules(flagId);

      setTargetingRules(rules);

    } catch (error) {

      console.error(error);

    }

  };

  const formatDateTime = (date) => {

    if (!date) return "-";

    return new Date(date).toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      }
    );

  };

  const getEnvironmentName = (id) => {

    switch (id) {

      case 1:
        return "Development";

      case 2:
        return "Staging";

      case 3:
        return "Production";

      default:
        return "Unknown";

    }

  };

  const handleAddUser = async (data) => {

    try {

      await addTargetingRule(flag.id, data);

      await loadTargetingRules(flag.id);

      setShowModal(false);

      toast.success("User added successfully!");

    } catch (error) {

      console.error(error);

      toast.error("Failed to add user.");

    }

  };

  const handleDeleteUser = async (ruleId) => {

    try {

      await deleteTargetingRule(ruleId);

      await loadTargetingRules(flag.id);

      toast.success("User removed successfully!");

    } catch (error) {

      console.error(error);

      toast.error("Failed to delete user.");

    }

  };

  const saveRollout = async () => {

    try {

      setSavingRollout(true);

      const updatedFlag = {

        ...flag,

        rollout_percentage:
          rolloutPercentage,

      };

      const response =
        await updateFlag(
          flag.flag_key,
          updatedFlag
        );

      setFlag(response);

      setRolloutPercentage(
        response.rollout_percentage
      );

      toast.success(
        "Rollout updated successfully!"
      );

    } catch (error) {

      console.error(error);

      toast.error(
        "Failed to update rollout."
      );

    } finally {

      setSavingRollout(false);

    }

  };

  const handleEvaluate = async () => {

  if (!evaluationValue.trim()) {

  toast.error(
    `Please enter ${
      evaluationType === "user"
        ? "User ID"
        : "Group Name"
    }`
  );

  return;

}

  try {

    setEvaluating(true);

    const result = await evaluateFlag(

      flag.flag_key,

      flag.environment_id,

      evaluationType,

      evaluationValue

);

    setEvaluationResult(result);

setLastEvaluation(
    new Date().toLocaleString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        day: "2-digit",
        month: "short",
        year: "numeric",
    })
);

toast.success("Evaluation completed.");

  } catch (error) {

    console.error(error);

    toast.error("Evaluation failed.");

  } finally {

    setEvaluating(false);

  }

};

if (!flag) {
  return (
    <div className="flag-skeleton">

      <div className="skeleton-header"></div>

      <div className="skeleton-grid">

        <div className="skeleton-card"></div>
        <div className="skeleton-card"></div>
        <div className="skeleton-card"></div>
        <div className="skeleton-card"></div>

      </div>

    </div>
  );
}

return (
  <>
    <div className="flag-detail-page">

      {/* ==========================
          HEADER
      ========================== */}

      <div className="detail-header">

  <div className="header-left">

    <button
      className="back-btn"
      onClick={() => navigate(-1)}
    >
      <FaArrowLeft />
      Back
    </button>

    <div className="header-info">

      <h1>{flag.flag_key}</h1>

      <p>
        Feature Flag Details & Configuration
      </p>

    </div>

  </div>

  <div className="header-right">

    <span
      className={
        flag.enabled
          ? "status-pill enabled"
          : "status-pill disabled"
      }
    >
      {flag.enabled ? "Enabled" : "Disabled"}
    </span>

  </div>

</div>

    {/* ==========================
        DETAILS CARD
    ========================== */}

    <div className="details-card">

      <div className="details-grid">

        <div className="detail-item">
          <FaFlag className="detail-icon" />
          <div>
            <span>Flag Key</span>
            <strong>{flag.flag_key}</strong>
          </div>
        </div>

        <div className="detail-item">
          <FaBolt className="detail-icon" />
          <div>
            <span>Type</span>
            <strong>{flag.flag_type}</strong>
          </div>
        </div>

        <div className="detail-item">
          <FaToggleOn className="detail-icon" />
          <div>
            <span>Status</span>
            <strong>
              {flag.enabled ? "Enabled" : "Disabled"}
            </strong>
          </div>
        </div>

        <div className="detail-item">
          <FaUsers className="detail-icon" />
          <div>
            <span>Owner Team</span>
            <strong>{flag.owner_team}</strong>
          </div>
        </div>

        <div className="detail-item">
          <FaGlobe className="detail-icon" />
          <div>
            <span>Environment</span>
            <strong>
              {getEnvironmentName(flag.environment_id)}
            </strong>
          </div>
        </div>

        <div className="detail-item">
          <FaFileAlt className="detail-icon" />
          <div>
            <span>Description</span>
            <strong>{flag.description}</strong>
          </div>
        </div>

        <div className="detail-item">
          <FaCalendarAlt className="detail-icon" />
          <div>
            <span>Created</span>
            <strong>
              {formatDateTime(flag.created_at)}
            </strong>
          </div>
        </div>

        <div className="detail-item">
          <FaRegEdit className="detail-icon" />
          <div>
            <span>Updated</span>
            <strong>
              {formatDateTime(flag.updated_at)}
            </strong>
          </div>
        </div>

      </div>

    </div>

    {/* ==========================
        TARGETING RULES
    ========================== */}

    <div className="rules-card">

      <div className="rules-header">

        <div>
          <h2>
  <FaBullseye className="section-icon" />
  Targeting Rules
</h2>

          <p className="rules-description">
            Enable this feature for selected users.
          </p>
        </div>

        <button
          className="add-user-btn"
          onClick={() => setShowModal(true)}
        >
          + Add User
        </button>

      </div>

      {targetingRules.length === 0 ? (

        <div className="empty-rules">
          No targeting rules found.
        </div>

      ) : (

        <div className="rules-list">

          {targetingRules.map((rule) => (

            <div
              className="rule-item"
              key={rule.id}
            >

              <div className="user-rule">
  <FaUser className="user-rule-icon" />
  <span>{rule.rule_value}</span>
</div>

              <button
    className="remove-rule-btn"
    onClick={() => handleDeleteUser(rule.id)}
>
    Remove
</button>

            </div>

          ))}

        </div>

      )}
      

      <TargetingRuleModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleAddUser}
      />

    </div>

    {/* ==========================
        GROUP TARGETING
    ========================== */}

    <GroupTargetingPanel
      flagId={flag.id}
    />
        {/* ==========================================
    PERCENTAGE ROLLOUT
========================================== */}

<div className="rules-card">

    <div className="rollout-header">

    <div className="rollout-title">

        <h2>
            <FaChartLine className="section-icon" />
            Percentage Rollout
        </h2>

        <p className="rules-description">
            Gradually release this feature to a percentage of users.
        </p>

    </div>

    {hasChanges && (
        <div className="unsaved-container">
            <span className="unsaved-badge">
                Unsaved Changes
            </span>
        </div>
    )}

</div>

    <div className="rollout-content">

        {/* Rollout Circle */}

        <div className="rollout-status">

            <div
                className="rollout-circle"
                style={{ "--percentage": rolloutPercentage }}
            >
                <span>{rolloutPercentage}%</span>
            </div>

            <div className="rollout-info">
                <h3>Current Rollout</h3>
                <p>
                    Users receiving this feature based on the current rollout percentage.
                </p>
            </div>

        </div>

        {/* Slider */}

        <input
            type="range"
            min="0"
            max="100"
            value={rolloutPercentage}
            onChange={(e) =>
                setRolloutPercentage(Number(e.target.value))
            }
            className="rollout-slider"
        />

        {/* Labels */}

        <div className="rollout-labels">
            <span>0%</span>
            <span>25%</span>
            <span>50%</span>
            <span>75%</span>
            <span>100%</span>
        </div>

        {/* Quick Buttons */}

        <div className="quick-rollout">

            {[0, 10, 25, 50, 75, 100].map((value) => (

                <button
                    key={value}
                    className={
                        rolloutPercentage === value
                            ? "quick-btn active"
                            : "quick-btn"
                    }
                    onClick={() =>
                        setRolloutPercentage(value)
                    }
                >
                    {value}%
                </button>

            ))}

        </div>

        {/* Summary */}

        <div className="rollout-summary">

            <h3>Rollout Summary</h3>

            <div className="summary-grid">

                <div className="summary-item">

                    <div className="summary-title">
                        <FaGlobe className="summary-icon" />
                        <span>Environment</span>
                    </div>

                    <strong>
                        {getEnvironmentName(flag.environment_id)}
                    </strong>

                </div>

                <div className="summary-item">

                    <div className="summary-title">
                        <FaToggleOn className="summary-icon" />
                        <span>Status</span>
                    </div>

                    <strong>
                        {flag.enabled ? "Enabled" : "Disabled"}
                    </strong>

                </div>

                <div className="summary-item">

                    <div className="summary-title">
                        <FaChartLine className="summary-icon" />
                        <span>Rollout</span>
                    </div>

                    <strong>{rolloutPercentage}%</strong>

                </div>

            </div>

        </div>

        {/* Save Button */}

        {/* Save Button */}

<div className="save-rollout-container">

    <button
        className="save-rollout-btn"
        onClick={saveRollout}
        disabled={savingRollout || !hasChanges}
    >
        {savingRollout ? (
            <>
                <span className="btn-spinner"></span>
                Saving...
            </>
        ) : (
            "Save Rollout"
        )}
    </button>

</div>

    </div>

</div>
        {/* ==========================================
        EVALUATION TEST PANEL
    ========================================== */}

    <div className="rules-card">

      <div className="rollout-header">

        <div>

          <h2>
  <FaFlask className="section-icon" />
  Evaluation Test Panel
</h2>

          <p className="rules-description">
            Test how this feature flag resolves for a specific user.
          </p>

        </div>

      </div>

      <div className="evaluation-form">

        <div className="evaluation-field">

  <label>Evaluate By</label>

  <select
    value={evaluationType}
    onChange={(e) => {
      setEvaluationType(e.target.value);
      setEvaluationValue("");
    }}
  >
    <option value="user">User</option>
    <option value="group">User Group</option>
  </select>

</div>

<div className="evaluation-field">

  <label>
    {evaluationType === "user"
      ? "User ID"
      : "Group Name"}
  </label>

  <input
    type="text"
    placeholder={
      evaluationType === "user"
        ? "Enter User ID"
        : "Enter Group Name"
    }
    value={evaluationValue}
    onChange={(e) =>
      setEvaluationValue(e.target.value)
    }
  />

</div>

        <button
          className="save-rollout-btn"
          onClick={handleEvaluate}
          disabled={evaluating}
        >
          {evaluating ? (
    <>
        <span className="btn-spinner"></span>
        Evaluating...
    </>
) : (
    "Evaluate"
)}
        </button>

      </div>

      {!evaluationResult ? (

  <div className="empty-evaluation">

    <h3>No Evaluation Yet</h3>

    <p>
      Enter a User ID and click
      <strong> Evaluate </strong>
      to test this feature flag.
    </p>

  </div>

) : (

        <div className="rollout-summary">

  <div className="evaluation-header">

    <h3>Evaluation Result</h3>

    <span
      className={
        evaluationResult.source === "cached"
          ? "cache-badge cached"
          : "cache-badge live"
      }
    >
      {evaluationResult.source === "cached"
        ? "⚡ Cached"
        : "🟢 Live"}
    </span>

  </div>

  <p className="evaluation-time">
  Last evaluated:
  <strong> {lastEvaluation}</strong>
</p>

  <div className="evaluation-grid">

    <div className="summary-item">

      <span>
  <FaFlag className="evaluation-icon" />
  Flag
</span>

      <strong>{evaluationResult.flag_key}</strong>

    </div>

    <div className="summary-item">

  <span>
    <FaUser className="evaluation-icon" />
    {evaluationType === "user" ? "User" : "Group"}
  </span>

  <strong>{evaluationValue}</strong>

</div>

    <div className="summary-item">

      <span>
  <FaGlobe className="evaluation-icon" />
  Environment
</span>

      <strong>
        {getEnvironmentName(flag.environment_id)}
      </strong>

    </div>

    <div className="summary-item">

      <span>
  <FaBolt className="evaluation-icon" />
  Status
</span>

      <strong
  className={
    evaluationResult.enabled
      ? "evaluation-enabled"
      : "evaluation-disabled"
  }
>
  {evaluationResult.enabled
    ? "Enabled"
    : "Disabled"}
</strong>

    </div>

    <div className="summary-item">

      <span>
  <FaInfoCircle className="evaluation-icon" />
  Reason
</span>

      <strong>{evaluationResult.reason}</strong>

</div>

<div className="summary-item">

      <span>
        <FaClock className="evaluation-icon" />
        Response Time
      </span>

      <strong>
        {evaluationResult.response_time
          ? `${evaluationResult.response_time} ms`
          : evaluationResult.source === "cached"
          ? "< 1 ms"
          : "~15 ms"}
      </strong>

</div>

<div className="summary-item">

      <span>
        <FaDatabase className="evaluation-icon" />
        Source
      </span>

      <strong>
        {evaluationResult.source === "cached"
          ? "Cached"
          : "Live"}
      </strong>

</div>

<div className="summary-item">

      <span>
        <FaPercentage className="evaluation-icon" />
        Rollout
      </span>

      <strong>{rolloutPercentage}%</strong>

</div>

<div className="summary-item">

      <span>
        <FaLayerGroup className="evaluation-icon" />
        Rule Type
      </span>

      <strong>
        {evaluationResult.reason.includes("User")
          ? "User Targeting"
          : evaluationResult.reason.includes("Group")
          ? "Group Targeting"
          : evaluationResult.reason.includes("Percentage")
          ? "Percentage Rollout"
          : evaluationResult.reason.includes("Environment")
          ? "Environment Override"
          : "Default Value"}
      </strong>

</div>

<div className="summary-item">

      <span>
        <FaToggleOn className="evaluation-icon" />
        Flag Type
      </span>

      <strong>{flag.flag_type}</strong>

</div>

<div className="summary-item">

      <span>
        <FaKey className="evaluation-icon" />
        Flag Key
      </span>

      <strong>{flag.flag_key}</strong>

</div>

<div className="summary-item">

      <span>
        <FaProjectDiagram className="evaluation-icon" />
        Evaluation Mode
      </span>

      <strong>
        {evaluationType === "user"
          ? "User"
          : "User Group"}
      </strong>

</div>

  </div>

<div className="evaluation-summary">

  <h3>
    <FaInfoCircle className="evaluation-icon" />
    Evaluation Summary
  </h3>

  <p>
  The feature flag{" "}
  <strong>{flag.flag_key}</strong>{" "}
  was{" "}
  <strong>
    {evaluationResult.enabled ? "ENABLED" : "DISABLED"}
  </strong>{" "}
  for the{" "}
  <strong>
    {evaluationType === "user" ? "user" : "group"}
  </strong>{" "}
  <strong>{evaluationValue}</strong>{" "}
  in the{" "}
  <strong>{getEnvironmentName(flag.environment_id)}</strong>{" "}
  environment because it{" "}
  <strong>{evaluationResult.reason}</strong>.
</p>

</div>

</div>

   )}


    </div>

      </div>

  </>
);

}

export default FlagDetail;