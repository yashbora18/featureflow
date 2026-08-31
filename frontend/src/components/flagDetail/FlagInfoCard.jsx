import React from "react";
import { useTranslation } from "react-i18next";

import {
  FaFlag,
  FaBolt,
  FaToggleOn,
  FaUsers,
  FaGlobe,
  FaFileAlt,
  FaCalendarAlt,
  FaRegEdit,
} from "react-icons/fa";


function FlagInfoCard({
  flag,
  formatDateTime,
  getEnvironmentName,
}) {


  const { t } = useTranslation();



  const items = [

    {
      icon:<FaFlag/>,
      label:t("flagDetail.flagKey"),
      value:flag.flag_key
    },


    {
      icon:<FaBolt/>,
      label:t("flagDetail.type"),
      value:flag.flag_type
    },


    {
      icon:<FaToggleOn/>,
      label:t("flagDetail.status"),
      value:
      flag.enabled
      ?
      t("flags.enabled")
      :
      t("flags.disabled")
    },


    {
      icon:<FaUsers/>,
      label:t("flagDetail.ownerTeam"),
      value:flag.owner_team
    },


    {
      icon:<FaGlobe/>,
      label:t("flagDetail.environment"),
      value:getEnvironmentName(flag.environment_id)
    },


    {
      icon:<FaFileAlt/>,
      label:t("flagDetail.description"),
      value:flag.description
    },


    {
      icon:<FaCalendarAlt/>,
      label:t("flagDetail.created"),
      value:formatDateTime(flag.created_at)
    },


    {
      icon:<FaRegEdit/>,
      label:t("flagDetail.updated"),
      value:formatDateTime(flag.updated_at)
    }

  ];



  return (

    <div className="details-card">


      <div className="details-grid">


      {
        items.map((item,index)=>(


          <div
            className="detail-item"
            key={index}
          >


            <div className="detail-icon">

              {item.icon}

            </div>



            <div>


              <span>

                {item.label}

              </span>



              <strong>

                {item.value || "-"}

              </strong>


            </div>



          </div>


        ))
      }


      </div>


    </div>

  );

}


export default FlagInfoCard;
