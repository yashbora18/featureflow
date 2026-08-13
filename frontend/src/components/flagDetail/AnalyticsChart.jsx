import React, { useState } from "react";
import { FaChartBar } from "react-icons/fa";
import { useTranslation } from "react-i18next";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";


function AnalyticsChart({ analytics }) {

  const { t } = useTranslation();

  const [range, setRange] = useState(7);


  /* =====================================================
     PREPARE CHART DATA
  ===================================================== */

  const chartData = (analytics || []).map((item) => ({

    date: item.date,

    count: Number(item.count) || 0,

    formattedDate: new Date(item.date).toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "2-digit",
      }
    ),

  }));


  /* =====================================================
     FILTER DATA
  ===================================================== */

  const filteredData = chartData.slice(-range);


  console.log("Chart Data:", filteredData);


  return (

    <div className="analytics-chart-card">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="rollout-header">

        <div>

          <h2>

            <FaChartBar className="section-icon" />

            {t("flagDetail.analytics.title")}

          </h2>


          <p className="rules-description">

            {t("flagDetail.analytics.description")}

          </p>

        </div>

      </div>


      {/* =================================================
          DATE FILTER
      ================================================= */}

      <div className="analytics-filter">

        <button
          className={range === 7 ? "active" : ""}
          onClick={() => setRange(7)}
        >
          {t("flagDetail.analytics.last7Days")}
        </button>


        <button
          className={range === 15 ? "active" : ""}
          onClick={() => setRange(15)}
        >
          {t("flagDetail.analytics.last15Days")}
        </button>


        <button
          className={range === 30 ? "active" : ""}
          onClick={() => setRange(30)}
        >
          {t("flagDetail.analytics.last30Days")}
        </button>

      </div>


      {/* =================================================
          CHART
      ================================================= */}

      <div className="analytics-chart-container">

        {filteredData.length === 0 ? (

          <div className="empty-state">

            {t("flagDetail.analytics.noData")}

          </div>

        ) : (

          <ResponsiveContainer
            width="100%"
            height="100%"
          >

            <BarChart
              data={filteredData}
              margin={{
                top: 20,
                right: 30,
                left: 30,
                bottom: 20,
              }}
            >

              {/* GRID */}

              <CartesianGrid
                stroke="#334155"
                strokeDasharray="3 3"
                vertical={false}
              />


              {/* X AXIS */}

              <XAxis
                dataKey="formattedDate"
                tick={{
                  fill: "#94a3b8",
                  fontSize: 13,
                }}
                tickMargin={10}
                axisLine={{
                  stroke: "#334155",
                }}
                tickLine={false}
              />


              {/* Y AXIS */}

              <YAxis
                allowDecimals={false}
                tick={{
                  fill: "#94a3b8",
                  fontSize: 13,
                }}
                axisLine={false}
                tickLine={false}
              />


              {/* TOOLTIP */}

              <Tooltip
                cursor={{
                  fill: "rgba(124,58,237,0.08)",
                }}
              />


              {/* BAR */}

              <Bar
                dataKey="count"
                fill="#7c3aed"
                radius={[8, 8, 0, 0]}
                barSize={80}
              />

            </BarChart>

          </ResponsiveContainer>

        )}

      </div>

    </div>

  );

}


export default AnalyticsChart;