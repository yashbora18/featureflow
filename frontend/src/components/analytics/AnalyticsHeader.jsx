import {
  HiChartBarSquare
} from "react-icons/hi2";


import {
  FiRefreshCw
} from "react-icons/fi";


import { useTranslation } from "react-i18next";


import "./Analytics.css";



export default function AnalyticsHeader(){


  const { t } = useTranslation();




  const today = new Date()
    .toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric"
      }
    );





  return (


    <div className="page-header">






      {/* LEFT SIDE */}

      <div className="page-header-left">





        <div className="page-header-icon analytics-icon">


          <HiChartBarSquare />


        </div>







        <div className="page-header-content">


          <h1>


            {
              t(
                "analytics.title",
                {
                  defaultValue:
                  "Analytics"
                }
              )
            }


          </h1>





          <p>


            {
              t(
                "analytics.description",
                {
                  defaultValue:
                  "Monitor feature usage, rollout performance and evaluation metrics."
                }
              )
            }


          </p>




        </div>




      </div>








      {/* RIGHT SIDE */}


      <div className="page-header-actions">





        <div className="page-header-date">


          {today}


        </div>






        <button className="outline-btn">


          <FiRefreshCw />


          {
            t(
              "common.refresh",
              {
                defaultValue:
                "Refresh"
              }
            )
          }


        </button>





      </div>






    </div>


  );


}
