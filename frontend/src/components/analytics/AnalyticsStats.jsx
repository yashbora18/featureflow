import {
  HiBolt,
  HiCheckCircle,
  HiGlobeAlt,
  HiChartBar,
} from "react-icons/hi2";

import { useTranslation } from "react-i18next";

import StatsCard from "../dashboard/StatsCard";


export default function AnalyticsStats({
  analytics,
  environment
}) {

  const { t, i18n } = useTranslation();

  const formatNumber = (value) => {

  const digitMaps = {

    hi: "०१२३४५६७८९",
    mr: "०१२३४५६७८९",
    gu: "૦૧૨૩૪૫૬૭૮૯",
    bn: "০১২৩৪৫৬৭৮৯",
    te: "౦౧౨౩౪౫౬౭౮౯",
    ta: "௦௧௨௩௪௫௬௭௮௯",
    kn: "೦೧೨೩೪೫೬೭೮೯",
    ml: "൦൧൨൩൪൫൬൭൮൯",
    pa: "੦੧੨੩੪੫੬੭੮੯",
    or: "୦୧୨୩୪୫୬୭୮୯",
    as: "০১২৩৪৫৬৭৮৯",
    ur: "۰۱۲۳۴۵۶۷۸۹",
    ar: "٠١٢٣٤٥٦٧٨٩"

  };

  const digits = digitMaps[i18n.language];

  if (!digits) {

    return new Intl.NumberFormat(
      i18n.language
    ).format(value);

  }

  return String(value).replace(
    /\d/g,
    (digit) =>
      digits[Number(digit)]
  );

};


  // =====================================================
  // REAL BACKEND ANALYTICS DATA
  // =====================================================

  const totalEvaluations =
    analytics?.totalEvaluations ?? 0;


  const activeFlags =
    analytics?.activeFlags ?? 0;


  const totalFlags =
    analytics?.deploymentSafety?.totalFlags ?? 0;


  // =====================================================
  // ENABLED PERCENTAGE
  // =====================================================

  const enabledPercentage =
    totalFlags > 0
      ? Math.round(
          (activeFlags / totalFlags) * 100
        )
      : 0;


  // =====================================================
  // SELECTED ENVIRONMENT
  // =====================================================

  const selectedEnvironment =
  environment === "Development"
    ? t("environment.development")
    : environment === "Staging"
      ? t("environment.staging")
      : environment === "Production"
        ? t("environment.production")
        : environment || "-";


  // =====================================================
  // STATS
  // =====================================================

  return (

    <div className="stats-grid">


      {/* ===============================================
          FEATURE EVALUATIONS
      =============================================== */}

      <StatsCard

        title={
          t(
            "analytics.evaluations",
            {
              defaultValue:
                "Feature Evaluations"
            }
          )
        }

        value={formatNumber(totalEvaluations)}

        change={
          t(
            "analytics.totalEvaluations",
            {
              defaultValue:
                "Total Evaluations"
            }
          )
        }

        color="#FEF3C7"

        icon={
          <HiBolt color="#D97706" />
        }

      />


      {/* ===============================================
          ACTIVE FLAGS
      =============================================== */}

      <StatsCard

        title={
          t(
            "analytics.activeFlags",
            {
              defaultValue:
                "Active Flags"
            }
          )
        }

        value={formatNumber(activeFlags)}

        change={
  `${formatNumber(enabledPercentage)}% ${
            t(
              "analytics.enabled",
              {
                defaultValue:
                  "Enabled"
              }
            )
          }`
        }

        color="#ECFDF5"

        icon={
          <HiCheckCircle color="#16A34A" />
        }

      />


      {/* ===============================================
          ROLLOUT SUCCESS
      =============================================== */}

      <StatsCard

        title={
          t(
            "analytics.rolloutSuccess",
            {
              defaultValue:
                "Rollout Success"
            }
          )
        }

        value={`${formatNumber(enabledPercentage)}%`}

        change={
          t(
            "analytics.healthy",
            {
              defaultValue:
                "Healthy"
            }
          )
        }

        color="#EEF2FF"

        icon={
          <HiChartBar color="#4F46E5" />
        }

      />


      {/* ===============================================
          CURRENT ENVIRONMENT
      =============================================== */}

      <StatsCard

        title={
          t(
            "analytics.environments",
            {
              defaultValue:
                "Environment"
            }
          )
        }

        value={
          selectedEnvironment
        }

        change={
          t(
            "analytics.selectedEnvironment",
            {
              defaultValue:
                "Current Environment"
            }
          )
        }

        color="#EFF6FF"

        icon={
          <HiGlobeAlt color="#2563EB" />
        }

      />


    </div>

  );

}