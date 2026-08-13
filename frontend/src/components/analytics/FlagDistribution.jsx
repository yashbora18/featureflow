import { useTranslation } from "react-i18next";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";


export default function FlagDistribution({ analytics }) {

  const { t } = useTranslation();


  // =====================================================
  // REAL BACKEND DATA
  // =====================================================

  const lifecycle =
    analytics?.flagLifecycle || {};


  const enabledFlags =
    Number(lifecycle.active) || 0;


  const totalFlags =
    Number(lifecycle.total) || 0;


  const disabledFlags =
    Math.max(
      totalFlags - enabledFlags,
      0
    );


  // =====================================================
  // ENABLED PERCENTAGE
  // =====================================================

  const enabledPercentage =
    totalFlags > 0
      ? Math.round(
          (enabledFlags / totalFlags) * 100
        )
      : 0;


  // =====================================================
  // CHART DATA
  // =====================================================

  const data = [

    {
      name: t(
        "common.enabled",
        {
          defaultValue: "Enabled",
        }
      ),

      value: enabledFlags,

      percentage: enabledPercentage,
    },

    {
      name: t(
        "common.disabled",
        {
          defaultValue: "Disabled",
        }
      ),

      value: disabledFlags,

      percentage:
        100 - enabledPercentage,
    },

  ];


  const COLORS = [
    "#22c55e",
    "#ef4444",
  ];


  // =====================================================
  // UI
  // =====================================================

  return (

    <div className="dashboard-card flag-distribution-card">


      {/* ===============================================
          HEADER
      =============================================== */}

      <div className="section-header chart-header">

        <div>

          <h3>

            {t(
              "analytics.flagDistribution",
              {
                defaultValue:
                  "Flag Distribution",
              }
            )}

          </h3>


          <p>

            {t(
              "analytics.enabledVsDisabled",
              {
                defaultValue:
                  "Enabled vs Disabled feature flags",
              }
            )}

          </p>

        </div>

      </div>


      {/* ===============================================
          EMPTY STATE
      =============================================== */}

      {totalFlags === 0 ? (

        <div className="analytics-empty">

          {t(
            "analytics.noData",
            {
              defaultValue:
                "No analytics data available.",
            }
          )}

        </div>

      ) : (

        <>

          {/* =========================================
              PIE CHART
          ========================================= */}

          <ResponsiveContainer
            width="100%"
            height={340}
          >

            <PieChart>

              <Pie

                data={data}

                dataKey="value"

                cx="50%"

                cy="50%"

                innerRadius={70}

                outerRadius={110}

                paddingAngle={5}

              >

                {data.map(
                  (item, index) => (

                    <Cell
                      key={item.name}
                      fill={COLORS[index]}
                    />

                  )
                )}

              </Pie>


              <Tooltip

                contentStyle={{
                  background: "#ffffff",
                  border:
                    "1px solid #e2e8f0",
                  borderRadius: "14px",
                  boxShadow:
                    "0 10px 30px rgba(0,0,0,.08)",
                }}

                formatter={(value, name) => [
                  value,
                  name,
                ]}

              />


              <Legend
                verticalAlign="bottom"
                height={36}
              />

            </PieChart>

          </ResponsiveContainer>


          {/* =========================================
              CENTER VALUE
          ========================================= */}

          <div className="pie-center-value">

            <strong>
              {enabledPercentage}%
            </strong>

            <span>
              {t(
                "common.enabled",
                {
                  defaultValue:
                    "Enabled",
                }
              )}
            </span>

          </div>

        </>

      )}

    </div>

  );

}