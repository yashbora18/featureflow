import React from "react";
import {
  FaFlag,
  FaUser,
  FaGlobe,
  FaBolt,
  FaInfoCircle,
  FaClock,
  FaDatabase,
  FaPercentage,
  FaLayerGroup,
  FaToggleOn,
  FaKey,
  FaProjectDiagram,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";

function EvaluationResult({
  evaluationResult,
  evaluationType,
  evaluationValue,
  lastEvaluation,
  rolloutPercentage,
  flag,
  getEnvironmentName,
}) {

  const { t } = useTranslation();

  if (!evaluationResult) {
    return (
      <div className="evaluation-result-card">
        <div className="empty-evaluation">

          <h3>
            {t("flagDetail.evaluation.noEvaluation")}
          </h3>

          <p>
            {t("flagDetail.evaluation.noEvaluationDescription")}{" "}
            <strong>
              {t("flagDetail.evaluation.evaluate")}
            </strong>{" "}
            {t("flagDetail.evaluation.toTest")}
          </p>

        </div>
      </div>
    );
  }

  return (
    <div className="rules-card">

      <div className="evaluation-header">

        <h3 className="evaluation-result-title">

  <FaBolt className="result-title-icon"/>

  {t("flagDetail.evaluation.result")}

</h3>

        <span
          className={
            evaluationResult.source === "cached"
              ? "cache-badge cached"
              : "cache-badge live"
          }
        >
          {evaluationResult.source === "cached"
            ? t("flagDetail.evaluation.cached")
            : t("flagDetail.evaluation.live")}
        </span>

      </div>

      <p className="evaluation-time">
        {t("flagDetail.evaluation.lastEvaluation")}
        <strong> {lastEvaluation}</strong>
      </p>

      <div className="evaluation-grid">

        <div className="summary-item">
          <span>
            <FaFlag className="evaluation-icon" />
            {t("flagDetail.flagKey")}
          </span>

          <strong>{evaluationResult.flag_key}</strong>
        </div>

        <div className="summary-item">
          <span>
            <FaUser className="evaluation-icon" />
            {evaluationType === "user"
              ? t("flagDetail.evaluation.user")
              : t("flagDetail.evaluation.group")}
          </span>

          <strong>{evaluationValue}</strong>
        </div>

        <div className="summary-item">
          <span>
            <FaGlobe className="evaluation-icon" />
            {t("flagDetail.environment")}
          </span>

          <strong>
            {getEnvironmentName(flag.environment_id)}
          </strong>
        </div>

        <div className="summary-item">
          <span>
            <FaBolt className="evaluation-icon" />
            {t("flagDetail.status")}
          </span>

          <strong
            className={
              evaluationResult.enabled
                ? "evaluation-enabled"
                : "evaluation-disabled"
            }
          >
            {evaluationResult.enabled
              ? t("flags.enabled")
              : t("flags.disabled")}
          </strong>
        </div>

        <div className="summary-item">
          <span>
            <FaInfoCircle className="evaluation-icon" />
            {t("flagDetail.evaluation.reason")}
          </span>

          <strong>
  {t(
    `flagDetail.evaluation.reasons.${evaluationResult.reason}`,
    {
      defaultValue: evaluationResult.reason
    }
  )}
</strong>
        </div>

        <div className="summary-item">
          <span>
            <FaClock className="evaluation-icon" />
            {t("flagDetail.evaluation.responseTime")}
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
            {t("flagDetail.evaluation.source")}
          </span>

          <strong>
            {evaluationResult.source === "cached"
              ? t("flagDetail.evaluation.cachedOnly")
              : t("flagDetail.evaluation.liveOnly")}
          </strong>
        </div>

        <div className="summary-item">
          <span>
            <FaPercentage className="evaluation-icon" />
            {t("flagDetail.rollout.rollout")}
          </span>

          <strong>{rolloutPercentage}%</strong>
        </div>

        <div className="summary-item">
          <span>
            <FaLayerGroup className="evaluation-icon" />
            {t("flagDetail.evaluation.ruleType")}
          </span>

          <strong>
            {evaluationResult.reason.includes("User")
              ? t("flagDetail.evaluation.userTargeting")
              : evaluationResult.reason.includes("Group")
              ? t("flagDetail.evaluation.groupTargeting")
              : evaluationResult.reason.includes("Percentage")
              ? t("flagDetail.evaluation.percentageRollout")
              : evaluationResult.reason.includes("Environment")
              ? t("flagDetail.evaluation.environmentOverride")
              : t("flagDetail.evaluation.defaultValue")}
          </strong>
        </div>

        <div className="summary-item">
          <span>
            <FaToggleOn className="evaluation-icon" />
            {t("flagDetail.evaluation.flagType")}
          </span>

          <strong>{flag.flag_type}</strong>
        </div>

        <div className="summary-item">
          <span>
            <FaKey className="evaluation-icon" />
            {t("flagDetail.flagKey")}
          </span>

          <strong>{flag.flag_key}</strong>
        </div>

        <div className="summary-item">
          <span>
            <FaProjectDiagram className="evaluation-icon" />
            {t("flagDetail.evaluation.mode")}
          </span>

          <strong>
            {evaluationType === "user"
              ? t("flagDetail.evaluation.user")
              : t("flagDetail.evaluation.group")}
          </strong>
        </div>

      </div>

      <div className="evaluation-summary">

        <h3>
          <FaInfoCircle className="evaluation-icon" />
          {t("flagDetail.evaluation.summary")}
        </h3>

        <p>
          {t("flagDetail.evaluation.summaryPrefix")}{" "}
          <strong>{flag.flag_key}</strong>{" "}
          <strong>
            {evaluationResult.enabled
              ? t("flags.enabled")
              : t("flags.disabled")}
          </strong>{" "}
          {t("flagDetail.evaluation.summaryFor")}{" "}
          <strong>{evaluationValue}</strong>{" "}
          {t("flagDetail.evaluation.summaryIn")}{" "}
          <strong>
            {getEnvironmentName(flag.environment_id)}
          </strong>{" "}
          {t("flagDetail.evaluation.summaryBecause")}{" "}
          <strong>
  {t(`flagDetail.evaluation.reasons.${evaluationResult.reason}`)}
</strong>.
        </p>

      </div>

    </div>
  );
}

export default EvaluationResult;
