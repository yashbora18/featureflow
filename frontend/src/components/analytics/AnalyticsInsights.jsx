
import { useTranslation } from "react-i18next";

import {
  HiFire,
  HiBuildingOffice,
  HiGlobeAlt,
  HiCheckCircle,
} from "react-icons/hi2";

import "./Analytics.css";


export default function AnalyticsInsights({
  analytics,
  topFlags,
  environment
}) {

  const { t } = useTranslation();


  // =====================================================
  // REAL BACKEND DATA
  // =====================================================

  const lifecycle =
    analytics?.flagLifecycle || {};


  const totalFlags =
    Number(lifecycle.total) || 0;


  const activeFlags =
    Number(lifecycle.active) || 0;


  const activePercentage =
    totalFlags > 0
      ? Math.round(
          (activeFlags / totalFlags) * 100
        )
      : 0;


  // =====================================================
  // MOST USED FEATURE
  // =====================================================

  const mostUsedFlag =
    Array.isArray(topFlags) &&
    topFlags.length > 0
      ? topFlags[0]
      : null;


  // =====================================================
  // INSIGHT MESSAGE
  // =====================================================

  const insightMessage =
    mostUsedFlag
      ? t(
          "analytics.mostEvaluatedFeature",
          {
            flag: mostUsedFlag.flag_key
          }
        )
      : t(
          "analytics.noEvaluationActivity"
        );


  return (

    <div className="analytics-insights">


      {/* ===============================================
          HEADER
      =============================================== */}

      <div className="insights-header">

        <h3>

          {t(
            "analytics.insights",
            {
              defaultValue:
                "Analytics Insights"
            }
          )}

        </h3>


        <p>

          {t(
            "analytics.insightsDescription",
            {
              defaultValue:
                "Feature performance overview and usage patterns"
            }
          )}

        </p>

      </div>


      {/* ===============================================
          INSIGHTS GRID
      =============================================== */}

      <div className="insights-grid">


        {/* MOST USED FEATURE */}

        <div className="insight-item">

          <div className="insight-icon purple">

            <HiFire />

          </div>


          <div>

            <span>

              {t(
                "analytics.mostUsedFeature",
                {
                  defaultValue:
                    "Most Used Feature"
                }
              )}

            </span>


            <strong>

              {mostUsedFlag
                ? mostUsedFlag.flag_key
                : t("analytics.noData")}

            </strong>

          </div>

        </div>


        {/* CURRENT ENVIRONMENT */}

        <div className="insight-item">

          <div className="insight-icon green">

            <HiBuildingOffice />

          </div>


          <div>

            <span>

              {t(
                "analytics.environment",
                {
                  defaultValue:
                    "Environment"
                }
              )}

            </span>


            <strong>

              {environment ||
                t("analytics.noData")}

            </strong>

          </div>

        </div>


        {/* TOTAL FLAGS */}

        <div className="insight-item">

          <div className="insight-icon blue">

            <HiGlobeAlt />

          </div>


          <div>

            <span>

              {t(
                "analytics.totalFlags",
                {
                  defaultValue:
                    "Total Flags"
                }
              )}

            </span>


            <strong>

              {totalFlags}

            </strong>

          </div>

        </div>


        {/* ACTIVE FLAGS */}

        <div className="insight-item">

          <div className="insight-icon orange">

            <HiCheckCircle />

          </div>


          <div>

            <span>

              {t(
                "analytics.activeFlags",
                {
                  defaultValue:
                    "Active Flags"
                }
              )}

            </span>


            <strong>

              {activeFlags} ({activePercentage}%)

            </strong>

          </div>

        </div>


      </div>


      {/* ===============================================
          MESSAGE
      =============================================== */}

      <div className="insight-message">

        💡

        <span>

          {insightMessage}

        </span>

      </div>


    </div>

  );

}
