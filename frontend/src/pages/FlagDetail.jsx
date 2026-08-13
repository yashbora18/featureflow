import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

import GroupTargetingPanel from "../components/GroupTargetingPanel";
import FlagHeader from "../components/flagDetail/FlagHeader";
import FlagInfoCard from "../components/flagDetail/FlagInfoCard";
import TargetingRules from "../components/flagDetail/TargetingRules";
import RolloutSection from "../components/flagDetail/RolloutSection";
import EvaluationPanel from "../components/flagDetail/EvaluationPanel";
import EvaluationResult from "../components/flagDetail/EvaluationResult";
import AnalyticsChart from "../components/flagDetail/AnalyticsChart";

import { getEvaluationAnalytics } from "../services/analyticsService";

import {
  getFlag,
  updateFlag,
  evaluateFlag,
} from "../services/flagService";

import {
  getTargetingRules,
  addTargetingRule,
  deleteTargetingRule,
} from "../services/targetingRuleService";

import "./FlagDetail.css";

function FlagDetail() {
  const navigate = useNavigate();
  const { id, environmentId } = useParams();

const flagKey = decodeURIComponent(id);

  const { t, i18n } = useTranslation();

  const [flag, setFlag] = useState(null);

  const [targetingRules, setTargetingRules] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [lastEvaluation, setLastEvaluation] =
    useState("");

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

  const [analytics, setAnalytics] = useState([]);

  const hasChanges =
    flag &&
    rolloutPercentage !== flag.rollout_percentage;

  useEffect(() => {

 if (!id || !environmentId) return;

 loadFlag();

}, [id, environmentId]);

  useEffect(() => {

  if (!flag) return;


  loadAnalytics(
    flag.flag_key,
    flag.environment_id
  );


}, [flag]);

  const loadFlag = async () => {
    try {
      const data = await getFlag(
      flagKey,
      Number(environmentId)
    );

      setFlag(data);

      setRolloutPercentage(
        data.rollout_percentage
      );

      loadTargetingRules(data.id);
    } catch (error) {
      console.error(error);

      toast.error(
        t("flagDetail.messages.loadFailed")
      );
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

  const loadAnalytics = async (
  flagKey,
  environmentId
) => {

  try {

    const data =
      await getEvaluationAnalytics(
        flagKey,
        environmentId
      );


    setAnalytics(data);


  } catch (error) {


    console.error(
      "Failed to fetch analytics",
      error
    );


  }

};

  const formatDateTime = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleString(
      i18n.language,
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
        return t("environment.development");

      case 2:
        return t("environment.staging");

      case 3:
        return t("environment.production");

      default:
        return t("common.unknown");
    }
  };

  const handleAddUser = async (data) => {
    try {
      await addTargetingRule(flag.id, data);

      await loadTargetingRules(flag.id);

      setShowModal(false);

      toast.success(
        t("flagDetail.messages.userAdded")
      );
    } catch (error) {
      console.error(error);

      toast.error(
        t("flagDetail.messages.addUserFailed")
      );
    }
  };

  const handleDeleteUser = async (ruleId) => {
    try {
      await deleteTargetingRule(ruleId);

      await loadTargetingRules(flag.id);

      toast.success(
        t("flagDetail.messages.userDeleted")
      );
    } catch (error) {
      console.error(error);

      toast.error(
        t("flagDetail.messages.deleteUserFailed")
      );
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

      const response = await updateFlag(
  flag.flag_key,
  flag.environment_id,
  updatedFlag
);

      setFlag(response);

      setRolloutPercentage(
        response.rollout_percentage
      );

      toast.success(
        t("flagDetail.messages.rolloutUpdated")
      );
    } catch (error) {
      console.error(error);

      toast.error(
        t("flagDetail.messages.rolloutFailed")
      );
    } finally {
      setSavingRollout(false);
    }
  };

  const handleEvaluate = async () => {
    if (!evaluationValue.trim()) {
      toast.error(
        evaluationType === "user"
          ? t("flagDetail.messages.enterUserId")
          : t("flagDetail.messages.enterGroupName")
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
        new Date().toLocaleString(
          i18n.language,
          {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            day: "2-digit",
            month: "short",
            year: "numeric",
          }
        )
      );

      toast.success(
        t(
          "flagDetail.messages.evaluationCompleted"
        )
      );
    } catch (error) {
      console.error(error);

      toast.error(
        t("flagDetail.messages.evaluationFailed")
      );
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
    <div className="flag-detail-page">

      <FlagHeader
        flag={flag}
        navigate={navigate}
      />

      <FlagInfoCard
        flag={flag}
        formatDateTime={formatDateTime}
        getEnvironmentName={getEnvironmentName}
      />

      <div className="targeting-container">

  <div className="targeting-column">

    <TargetingRules
      targetingRules={targetingRules}
      showModal={showModal}
      setShowModal={setShowModal}
      handleAddUser={handleAddUser}
      handleDeleteUser={handleDeleteUser}
    />

  </div>


  <div className="targeting-column">

    <GroupTargetingPanel
      flagId={flag.id}
    />

  </div>

</div>
      <RolloutSection
        rolloutPercentage={rolloutPercentage}
        setRolloutPercentage={setRolloutPercentage}
        hasChanges={hasChanges}
        savingRollout={savingRollout}
        saveRollout={saveRollout}
        flag={flag}
        getEnvironmentName={getEnvironmentName}
      />

      <EvaluationPanel
        evaluationType={evaluationType}
        setEvaluationType={setEvaluationType}
        evaluationValue={evaluationValue}
        setEvaluationValue={setEvaluationValue}
        evaluating={evaluating}
        handleEvaluate={handleEvaluate}
      />

      <EvaluationResult
        evaluationResult={evaluationResult}
        evaluationType={evaluationType}
        evaluationValue={evaluationValue}
        lastEvaluation={lastEvaluation}
        rolloutPercentage={rolloutPercentage}
        flag={flag}
        getEnvironmentName={getEnvironmentName}
      />

      <AnalyticsChart
        analytics={analytics}
      />

    </div>
  );
}

export default FlagDetail;


