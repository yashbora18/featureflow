import { useTranslation } from "react-i18next";

import {
  HiChartBar,
  HiBolt,
  HiCalendarDays,
  HiArrowTrendingUp,
} from "react-icons/hi2";


export default function EvaluationSummary({
  analytics,
  environment
}) {

  const { t } = useTranslation();


  // =====================================================
  // REAL BACKEND DATA
  // =====================================================

  const trend =
    Array.isArray(analytics?.trend)
      ? analytics.trend
      : [];


  const totalEvaluations =
    Number(analytics?.totalEvaluations) || 0;


  // =====================================================
  // SORT TREND DATA
  // =====================================================

  const sortedTrend = [...trend].sort(
    (a, b) =>
      new Date(a.date) - new Date(b.date)
  );


  // =====================================================
  // TODAY'S EVALUATIONS
  // =====================================================

  const today =
    new Date().toLocaleDateString("en-CA");


  const todayEvaluations =
    sortedTrend.find(
      item => item.date === today
    )?.count || 0;


  // =====================================================
  // AVERAGE DAILY EVALUATIONS
  // =====================================================

  const averageDaily =
    sortedTrend.length > 0
      ? Math.round(
          totalEvaluations /
          sortedTrend.length
        )
      : 0;


  // =====================================================
  // PEAK EVALUATIONS
  // =====================================================

  const peakEvaluation =
    sortedTrend.length > 0
      ? Math.max(
          ...sortedTrend.map(
            item =>
              Number(item.count) || 0
          )
        )
      : 0;


  return (

    <div className="dashboard-card evaluation-summary">


      {/* ===============================================
          HEADER
      =============================================== */}

      <div className="section-header">

        <h3>

          {t(
            "analytics.evaluationSummary",
            {
              defaultValue:
                "Evaluation Summary"
            }
          )}

        </h3>


        <p>

          {t(
            "analytics.evaluationOverview",
            {
              defaultValue:
                "Overview of feature evaluation activity."
            }
          )}

          {environment && ` - ${environment}`}

        </p>

      </div>


      {/* ===============================================
          SUMMARY GRID
      =============================================== */}

      <div className="summary-grid">


        {/* TOTAL */}

        <div className="summary-item">

          <div className="summary-icon purple">
            <HiBolt />
          </div>


          <span>

            {t(
              "analytics.totalEvaluations",
              {
                defaultValue:
                  "Total Evaluations"
              }
            )}

          </span>


          <strong>

            {totalEvaluations.toLocaleString()}

          </strong>

        </div>


        {/* TODAY */}

        <div className="summary-item">

          <div className="summary-icon green">
            <HiCalendarDays />
          </div>


          <span>

            {t(
              "analytics.todayEvaluations",
              {
                defaultValue:
                  "Today's Evaluations"
              }
            )}

          </span>


          <strong>

            {Number(
              todayEvaluations
            ).toLocaleString()}

          </strong>

        </div>


        {/* AVERAGE */}

        <div className="summary-item">

          <div className="summary-icon orange">
            <HiChartBar />
          </div>


          <span>

            {t(
              "analytics.averageDaily",
              {
                defaultValue:
                  "Average Daily Evaluations"
              }
            )}

          </span>


          <strong>

            {averageDaily.toLocaleString()}

          </strong>

        </div>


        {/* PEAK */}

        <div className="summary-item">

          <div className="summary-icon blue">
            <HiArrowTrendingUp />
          </div>


          <span>

            {t(
              "analytics.peakEvaluation",
              {
                defaultValue:
                  "Peak Evaluations"
              }
            )}

          </span>


          <strong>

            {peakEvaluation.toLocaleString()}

          </strong>

        </div>


      </div>

    </div>

  );

}
