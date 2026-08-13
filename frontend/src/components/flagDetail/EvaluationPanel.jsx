import React from "react";
import { FaFlask } from "react-icons/fa";
import { useTranslation } from "react-i18next";

function EvaluationPanel({
  evaluationType,
  setEvaluationType,
  evaluationValue,
  setEvaluationValue,
  evaluating,
  handleEvaluate,
}) {

  const { t } = useTranslation();

  return (
    <div className="evaluation-card">

      <div className="rollout-header">

        <div>

          <h2>
  <FaFlask />{" "}
  {t("flagDetail.evaluation.title")}
</h2>

          <p className="rules-description">
            {t("flagDetail.evaluation.description")}
          </p>

        </div>

      </div>

      <div className="evaluation-form">

        <div className="evaluation-field">

          <label>
            {t("flagDetail.evaluation.evaluateBy")}
          </label>

          <select
            value={evaluationType}
            onChange={(e) => {
              setEvaluationType(e.target.value);
              setEvaluationValue("");
            }}
          >
            <option value="user">
              {t("flagDetail.evaluation.user")}
            </option>

            <option value="group">
              {t("flagDetail.evaluation.group")}
            </option>
          </select>

        </div>

        <div className="evaluation-field">

          <label>
            {evaluationType === "user"
              ? t("flagDetail.evaluation.userId")
              : t("flagDetail.evaluation.groupName")}
          </label>

          <input
            type="text"
            placeholder={
              evaluationType === "user"
                ? t("flagDetail.evaluation.enterUser")
                : t("flagDetail.evaluation.enterGroup")
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
              {t("flagDetail.evaluation.evaluating")}
            </>
          ) : (
            t("flagDetail.evaluation.evaluate")
          )}
        </button>

      </div>

    </div>
  );
}

export default EvaluationPanel;