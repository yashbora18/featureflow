
import { useTranslation } from "react-i18next";


export default function EvaluationTrendSummary({ analytics }) {

    const { t } = useTranslation();


    const trend =
        Array.isArray(analytics?.trend)
            ? analytics.trend
            : [];


    const total =
        analytics?.totalEvaluations ?? 0;


    const peak =
        trend.length > 0
            ? Math.max(
                ...trend.map(
                    item => Number(item.count) || 0
                )
            )
            : 0;


    const peakDay =
        trend.find(
            item =>
                Number(item.count) === peak
        )?.date || "-";


    const first =
        trend.length > 0
            ? Number(trend[0]?.count) || 0
            : 0;


    const last =
        trend.length > 0
            ? Number(
                trend[trend.length - 1]?.count
              ) || 0
            : 0;


    const trendDirection =
        last >= first
            ? t(
                "analytics.increasing",
                {
                    defaultValue:
                        "Increasing"
                }
              )
            : t(
                "analytics.decreasing",
                {
                    defaultValue:
                        "Decreasing"
                }
              );


    return (

        <div className="trend-summary">


            <div className="trend-card">

                <span>
                    {t(
                        "analytics.peakDay",
                        {
                            defaultValue:
                                "Peak Day"
                        }
                    )}
                </span>

                <strong>
                    {peakDay}
                </strong>

            </div>


            <div className="trend-card">

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
                    {Number(total).toLocaleString()}
                </strong>

            </div>


            <div className="trend-card">

                <span>
                    {t(
                        "analytics.growthTrend",
                        {
                            defaultValue:
                                "Growth Trend"
                        }
                    )}
                </span>

                <strong>
                    {trendDirection}
                </strong>

            </div>


        </div>

    );

}

