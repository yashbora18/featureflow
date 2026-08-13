import React from "react";
import {
  FaChartLine,
  FaGlobe,
  FaToggleOn,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";

function RolloutSection({
  rolloutPercentage,
  setRolloutPercentage,
  hasChanges,
  savingRollout,
  saveRollout,
  flag,
  getEnvironmentName,
}) {

  const { t } = useTranslation();

  return (
    <div className="rollout-card">

      <div className="rollout-header">

        <div className="rollout-title">

          <h2>
            <FaChartLine className="section-icon" />
            {t("flagDetail.rollout.title")}
          </h2>

          <p className="rules-description">
            {t("flagDetail.rollout.description")}
          </p>

        </div>

        {hasChanges && (
          <div className="unsaved-container">
            <span className="unsaved-badge">
              {t("flagDetail.rollout.unsaved")}
            </span>
          </div>
        )}

      </div>

      <div className="rollout-content">

        <div className="rollout-status">

          <div
            className="rollout-circle"
            style={{
              "--percentage": rolloutPercentage,
            }}
          >
            <span>{rolloutPercentage}%</span>
          </div>

          <div className="rollout-info">

            <h3>
              {t("flagDetail.rollout.current")}
            </h3>

            <p>
              {t("flagDetail.rollout.currentDescription")}
            </p>

          </div>

        </div>

        <input
          type="range"
          min="0"
          max="100"
          value={rolloutPercentage}
          onChange={(e) =>
            setRolloutPercentage(
              Number(e.target.value)
            )
          }
          className="rollout-slider"
        />

        <div className="rollout-labels">

          <span>0%</span>
          <span>25%</span>
          <span>50%</span>
          <span>75%</span>
          <span>100%</span>

        </div>

        <div className="quick-rollout">

          {[0, 10, 25, 50, 75, 100].map(
            (value) => (
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
            )
          )}

        </div>

        <div className="rollout-summary">

          <h3>
            {t("flagDetail.rollout.summary")}
          </h3>

          <div className="summary-grid">

            <div className="summary-item">

              <div className="summary-title">

                <FaGlobe className="summary-icon" />

                <span>
                  {t("flagDetail.environment")}
                </span>

              </div>

              <strong>
                {getEnvironmentName(flag.environment_id)}
              </strong>

            </div>

            <div className="summary-item">

              <div className="summary-title">

                <FaToggleOn className="summary-icon" />

                <span>
                  {t("flagDetail.status")}
                </span>

              </div>

              <strong>
                {flag.enabled
                  ? t("flags.enabled")
                  : t("flags.disabled")}
              </strong>

            </div>

            <div className="summary-item">

              <div className="summary-title">

                <FaChartLine className="summary-icon" />

                <span>
                  {t("flagDetail.rollout.rollout")}
                </span>

              </div>

              <strong>
                {rolloutPercentage}%
              </strong>

            </div>

          </div>

        </div>

        <div className="save-rollout-container">

          <button
            className="save-rollout-btn"
            onClick={saveRollout}
            disabled={
              savingRollout ||
              !hasChanges
            }
          >
            {savingRollout ? (
              <>
                <span className="btn-spinner"></span>
                {t("flagDetail.rollout.saving")}
              </>
            ) : (
              t("flagDetail.rollout.save")
            )}
          </button>

        </div>

      </div>

    </div>
  );
}

export default RolloutSection;