import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  HiChartBar,
} from "react-icons/hi2";

import {
  FiRefreshCw,
  FiDownload,
  FiFileText,
} from "react-icons/fi";

import AnalyticsStats from "../components/analytics/AnalyticsStats";
import EvaluationChart from "../components/analytics/EvaluationChart";
import EnvironmentChart from "../components/analytics/EnvironmentChart";
import FlagDistribution from "../components/analytics/FlagDistribution";
import TopFlags from "../components/analytics/TopFlags";
import EvaluationSummary from "../components/analytics/EvaluationSummary";
import AnalyticsInsights from "../components/analytics/AnalyticsInsights";
import EvaluationTrendSummary from "../components/analytics/EvaluationTrendSummary";
import SkeletonLoader from "../components/common/SkeletonLoader";

import {
  exportAnalyticsCSV
} from "../utils/exportAnalytics";

import {
  exportAnalyticsPDF
} from "../utils/exportAnalyticsPDF";

import {
  getDashboardAnalytics,
  getTopFlags
} from "../services/analyticsService";

import "../components/analytics/Analytics.css";


export default function Analytics({ environment }) {

  const { t } = useTranslation();


  const [analytics, setAnalytics] = useState({

    totalEvaluations: 0,

    activeFlags: 0,

    environments: 0,

    trend: []

  });


  const [topFlags, setTopFlags] = useState([]);


  const [range, setRange] = useState(7);


  const [loading, setLoading] = useState(true);


  /*
    Environment Mapping

    Development -> 1
    Staging     -> 2
    Production  -> 3
  */

  const environmentMap = {

    development: 1,

    staging: 2,

    production: 3

  };


  const environmentId =
    environmentMap[
      environment?.toLowerCase()
    ];


  const loadAnalytics = async () => {

    if (!environmentId) {

      return;

    }


    try {

      setLoading(true);


      const [

        dashboardData,

        topFlagData

      ] = await Promise.all([

        getDashboardAnalytics(

          range,

          environmentId

        ),

        getTopFlags(

          environmentId

        )

      ]);


      setAnalytics(

        dashboardData || {

          totalEvaluations: 0,

          activeFlags: 0,

          environments: 0,

          trend: []

        }

      );


      setTopFlags(

        topFlagData || []

      );


    }

    catch (error) {

      console.error(

        "Analytics Error:",

        error

      );


      setAnalytics({

        totalEvaluations: 0,

        activeFlags: 0,

        environments: 0,

        trend: []

      });


      setTopFlags([]);

    }


    finally {

      setLoading(false);

    }

  };


  useEffect(() => {

    loadAnalytics();

  }, [environmentId, range]);


  if (loading) {

    return <SkeletonLoader />;

  }


  return (

    <div className="analytics-page">


      {/* HEADER */}

      <div className="analytics-header">


        <div className="analytics-header-left">


          <div className="analytics-page-icon">

            <HiChartBar />

          </div>


          <div className="analytics-header-content">


            <h1>

              {t("analytics.title")}

            </h1>


            <p>

              {t("analytics.description")}

            </p>


          </div>


        </div>


        <div className="analytics-header-actions">


          <button

            className="analytics-export-btn"

            onClick={() =>
              exportAnalyticsCSV(

                analytics,

                topFlags

              )
            }

          >

            <FiDownload size={18} />

            {t("analytics.exportCSV")}

          </button>


          <button

            className="analytics-pdf-btn"

            onClick={() =>
              exportAnalyticsPDF(

                analytics,

                topFlags

              )
            }

          >

            <FiFileText size={18} />

            {t("analytics.exportPDF")}

          </button>


          <button

            className="analytics-refresh-btn"

            onClick={loadAnalytics}

          >

            <FiRefreshCw size={18} />

            {t("common.refresh")}

          </button>


        </div>

      </div>


      {/* RANGE FILTER */}

      <div className="analytics-filter">


        <button

          className={
            range === 7
              ? "active"
              : ""
          }

          onClick={() => setRange(7)}

        >

          {t("analytics.range.7Days")}

        </button>


        <button

          className={
            range === 15
              ? "active"
              : ""
          }

          onClick={() => setRange(15)}

        >

          {t("analytics.range.15Days")}

        </button>


        <button

          className={
            range === 30
              ? "active"
              : ""
          }

          onClick={() => setRange(30)}

        >

          {t("analytics.range.30Days")}

        </button>


      </div>


      {/* KEY METRICS */}

      <AnalyticsStats
        analytics={analytics}
        environment={environment}
      />


      {/* EVALUATION TREND */}

      <div className="analytics-chart-section">


        <EvaluationTrendSummary

          analytics={analytics}

        />


        <EvaluationChart

          analytics={analytics}

          environmentId={environmentId}

        />


      </div>


      {/* FEATURE INSIGHTS */}

      <div className="analytics-two-column">


        <FlagDistribution

          analytics={analytics}

        />


        <TopFlags

          topFlags={topFlags}

        />


      </div>


      {/* ENVIRONMENT DISTRIBUTION */}

      <div className="analytics-environment-section">


        <EnvironmentChart

          analytics={analytics}

        />


      </div>


      {/* SUMMARY */}

      <div className="analytics-summary-section">


        <EvaluationSummary

          analytics={analytics}

        />


      </div>


      {/* INSIGHTS */}

      <AnalyticsInsights

        analytics={analytics}

        topFlags={topFlags}

        environment={environment}

      />


    </div>

  );

}

