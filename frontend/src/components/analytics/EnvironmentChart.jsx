import { useTranslation } from "react-i18next";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";


export default function EnvironmentChart({ analytics }) {

  const { t } = useTranslation();


  const distribution =
    Array.isArray(
      analytics?.environmentDistribution
    )
      ? analytics.environmentDistribution
      : [];


  const environmentNames = {

    1: t(
      "environment.development",
      {
        defaultValue: "Development",
      }
    ),

    2: t(
      "environment.staging",
      {
        defaultValue: "Staging",
      }
    ),

    3: t(
      "environment.production",
      {
        defaultValue: "Production",
      }
    ),

  };


  const data = [1, 2, 3].map(
    (environmentId) => {

      const environment =
        distribution.find(
          item =>
            Number(item.environment_id) ===
            environmentId
        );


      return {

        name:
          environmentNames[
            environmentId
          ],

        flags:
          Number(
            environment?.flags
          ) || 0,

      };

    }
  );


  return (

    <div className="dashboard-card environment-chart-card">

      <div className="section-header chart-header">

        <div>

          <h3>

            {t(
              "analytics.environmentDistribution",
              {
                defaultValue:
                  "Environment Distribution",
              }
            )}

          </h3>


          <p>

            {t(
              "analytics.flagUsage",
              {
                defaultValue:
                  "Feature flags across environments",
              }
            )}

          </p>

        </div>

      </div>


      <ResponsiveContainer
        width="100%"
        height={340}
      >

        <BarChart

          data={data}

          margin={{
            top: 20,
            right: 20,
            left: 0,
            bottom: 10,
          }}

        >

          <CartesianGrid
            strokeDasharray="3 3"
          />


          <XAxis
            dataKey="name"
            tick={{
              fontSize: 14,
            }}
          />


          <YAxis
            allowDecimals={false}
          />


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
                "analytics.flags",
                {
                  defaultValue: "Flags",
                }
              ),
            ]}

          />


          <Bar

            dataKey="flags"

            fill="#6366f1"

            radius={[
              12,
              12,
              0,
              0,
            ]}

            barSize={55}

          />

        </BarChart>

      </ResponsiveContainer>

    </div>

  );

}
