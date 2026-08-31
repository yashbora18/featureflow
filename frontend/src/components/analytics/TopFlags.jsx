
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";


import { useTranslation } from "react-i18next";


import "../analytics/Analytics.css";


export default function TopFlags({

  topFlags,

  environment

}) {


  const { t } = useTranslation();


  const flagData = topFlags || [];


  return (


    <div className="dashboard-card top-flags-card">


      <div className="section-header chart-header">


        <h3>

          {
            t(

              "analytics.mostEvaluatedFlags",

              {

                defaultValue:

                  "Most Evaluated Feature Flags"

              }

            )

          }

        </h3>


        <p>

          {
            t(

              "analytics.mostEvaluatedDescription",

              {

                defaultValue:

                  "Top feature flags based on evaluation activity"

              }

            )

          }

        </p>


      </div>


      {

        flagData.length === 0 ? (

          <div className="analytics-empty">

            {
              t(

                "analytics.noTopFlagsData",

                {

                  defaultValue:

                    "No Data Available"

                }

              )

            }

          </div>

        ) : (

          <ResponsiveContainer

            width="100%"

            height={340}

          >

            <BarChart

              data={flagData}

              layout="vertical"

              margin={{

                top: 20,

                right: 50,

                left: 20,

                bottom: 20

              }}

            >

              <CartesianGrid

                strokeDasharray="3 3"

              />


              <XAxis

                type="number"

                allowDecimals={false}

              />


              <YAxis

                type="category"

                dataKey="flag_key"

                width={120}

                tick={{

                  fontSize: 14

                }}

              />


              <Tooltip

                contentStyle={{

                  background: "#ffffff",

                  border: "1px solid #e2e8f0",

                  borderRadius: "14px",

                  boxShadow:

                    "0 10px 30px rgba(0,0,0,.08)"

                }}

                formatter={

                  (value) => [

                    value.toLocaleString(),

                    t(

                      "analytics.evaluations",

                      {

                        defaultValue:

                          "Evaluations"

                      }

                    )

                  ]

                }

              />


              <Bar

                dataKey="evaluations"

                fill="#6366f1"

                radius={[

                  0,

                  12,

                  12,

                  0

                ]}

                barSize={32}

              >

                <LabelList

                  dataKey="evaluations"

                  position="right"

                  formatter={(value) =>

                    value.toLocaleString()

                  }

                  fill="#334155"

                  fontSize={14}

                />

              </Bar>


            </BarChart>


          </ResponsiveContainer>

        )

      }


    </div>

  );

}

