
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  useState,
  useEffect,
} from "react";

import { useTranslation } from "react-i18next";

import {
  getEvaluationTrend,
} from "../../services/analyticsService";

import "../analytics/Analytics.css";


export default function EvaluationChart({
  analytics,
  environmentId,
}) {

  const { t } = useTranslation();


  const [range, setRange] = useState(7);


  const [chartData, setChartData] = useState(
    Array.isArray(analytics?.trend)
      ? analytics.trend
      : []
  );


  const [loading, setLoading] = useState(false);


  useEffect(() => {

    setChartData(
      Array.isArray(analytics?.trend)
        ? analytics.trend
        : []
    );

  }, [analytics]);


  const handleRangeChange = async (days) => {

    setRange(days);


    try {

      setLoading(true);


      const data =
        await getEvaluationTrend(
          days,
          environmentId
        );


      setChartData(
        Array.isArray(data)
          ? data
          : []
      );


    }
    catch (error) {

      console.error(
        "Evaluation Trend Error:",
        error
      );

      setChartData([]);

    }
    finally {

      setLoading(false);

    }

  };


  const formattedData = chartData.map(
    (item) => ({

      ...item,

      count:
        Number(item.count) || 0,

      displayDate:
        new Date(item.date).toLocaleDateString(
          "en-US",
          {
            month: "short",
            day: "2-digit",
          }
        ),

    })
  );


  return (

    <div className="dashboard-card evaluation-chart-card">


      <div className="chart-header">


        <div className="chart-title">

          <h3>

            {t(
              "analytics.evaluationTrend",
              {
                defaultValue:
                  "Evaluation Trend",
              }
            )}

          </h3>


          <p>

            {t(
              "analytics.evaluationOverTime",
              {
                defaultValue:
                  "Evaluations Over Time",
              }
            )}

          </p>

        </div>


        <div className="chart-filter">


          <button

            className={
              range === 7
                ? "active"
                : ""
            }

            onClick={() =>
              handleRangeChange(7)
            }

          >

            {t(
              "analytics.range.7Days",
              {
                defaultValue:
                  "7 Days",
              }
            )}

          </button>


          <button

            className={
              range === 15
                ? "active"
                : ""
            }

            onClick={() =>
              handleRangeChange(15)
            }

          >

            {t(
              "analytics.range.15Days",
              {
                defaultValue:
                  "15 Days",
              }
            )}

          </button>


          <button

            className={
              range === 30
                ? "active"
                : ""
            }

            onClick={() =>
              handleRangeChange(30)
            }

          >

            {t(
              "analytics.range.30Days",
              {
                defaultValue:
                  "30 Days",
              }
            )}

          </button>


        </div>


      </div>


      {loading ? (

        <div className="chart-loading">

          <div className="loading-line"></div>

          <div className="loading-line short"></div>

          <div className="loading-chart"></div>

        </div>

      )

      : chartData.length === 0 ? (

        <div className="chart-empty">

          <div className="empty-icon">
            📊
          </div>


          <h4>

            {t(
              "analytics.noEvaluationData",
              {
                defaultValue:
                  "No Evaluation Data",
              }
            )}

          </h4>


          <p>

            {t(
              "analytics.noFeatureEvaluations",
              {
                defaultValue:
                  "No feature evaluations available for this period.",
              }
            )}

          </p>

        </div>

      )

      : (

        <ResponsiveContainer
          width="100%"
          height={380}
        >

          <AreaChart
            data={formattedData}
          >

            <defs>

              <linearGradient
                id="evaluationGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >

                <stop
                  offset="0%"
                  stopColor="#7c3aed"
                  stopOpacity={0.35}
                />

                <stop
                  offset="100%"
                  stopColor="#7c3aed"
                  stopOpacity={0.05}
                />

              </linearGradient>

            </defs>


            <CartesianGrid
              strokeDasharray="3 3"
            />


            <XAxis
              dataKey="displayDate"
            />


            <YAxis />


            <Tooltip

              contentStyle={{
                background: "#ffffff",
                border:
                  "1px solid #e2e8f0",
                borderRadius: "14px",
                boxShadow:
                  "0 10px 30px rgba(0,0,0,.08)",
              }}

              formatter={(value) => [
                value,
                t(
                  "analytics.evaluations",
                  {
                    defaultValue:
                      "Evaluations",
                  }
                ),
              ]}

            />


            <Area

              type="monotone"

              dataKey="count"

              stroke="#7c3aed"

              strokeWidth={4}

              fill="url(#evaluationGradient)"

            />


          </AreaChart>

        </ResponsiveContainer>

      )}

    </div>

  );

}
