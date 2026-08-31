import React from "react";
import { FaBullseye, FaUser } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import TargetingRuleModal from "../TargetingRuleModal";


function TargetingRules({

  targetingRules,
  showModal,
  setShowModal,
  handleAddUser,
  handleDeleteUser,

}) {


  const { t } = useTranslation();



  return (

    <div className="rules-card">



      <div className="rules-header">


        <div className="rules-title">


          <h2>

            <FaBullseye className="section-icon"/>

            {t("flagDetail.targeting.title")}

          </h2>



          <p className="rules-description">

            {t("flagDetail.targeting.description")}

          </p>


        </div>




        <button

          className="add-user-btn"

          onClick={()=>setShowModal(true)}

        >

          + {t("flagDetail.targeting.addUser")}


        </button>



      </div>





      {
        targetingRules.length === 0

        ?


        <div className="empty-rules">

          {t("flagDetail.targeting.empty")}

        </div>


        :


        <div className="rules-list">


        {
          targetingRules.map((rule)=>(


            <div

              key={rule.id}

              className="rule-item"


            >


              <div className="user-rule">


                <div className="user-rule-icon">


                  <FaUser/>


                </div>



                <span>

                  {rule.rule_value}

                </span>


              </div>





              <button

                className="remove-rule-btn"

                onClick={()=>handleDeleteUser(rule.id)}

              >

                {t("flagDetail.targeting.remove")}


              </button>



            </div>


          ))
        }


        </div>

      }





      <TargetingRuleModal

        isOpen={showModal}

        onClose={()=>setShowModal(false)}

        onSave={handleAddUser}

      />



    </div>

  );

}


export default TargetingRules;
