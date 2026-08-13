import { useEffect, useState } from "react";
import { FaUsers } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import GroupTargetingModal from "./GroupTargetingModal";

import {
  getGroupRules,
  addGroupRule,
  deleteGroupRule,
} from "../services/groupTargetingService";

function GroupTargetingPanel({ flagId }) {

  const { t } = useTranslation();

  const [groupRules, setGroupRules] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!flagId) return;
    loadGroups();
  }, [flagId]);

  const loadGroups = async () => {
    try {
      const data = await getGroupRules(flagId);
      setGroupRules(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddGroup = async (group) => {
  try {

    await addGroupRule(flagId, group);

    await loadGroups();

    setShowModal(false);

    toast.success(
      t("flagDetail.groupTargeting.addSuccess")
    );

  } catch(error){

    toast.error(
      t("flagDetail.groupTargeting.addFailed")
    );

  }
};

  const handleDeleteGroup = async(ruleId)=>{
 try{

   await deleteGroupRule(ruleId);

   await loadGroups();

   toast.success(
     t("flagDetail.groupTargeting.deleteSuccess")
   );

 }catch(error){

   toast.error(
     t("flagDetail.groupTargeting.deleteFailed")
   );

 }
};

  const getGroupName = (group) => {

  switch (group) {

    case "beta_users":
      return t("flagDetail.groups.betaUsers");

    case "premium_plan":
      return t("flagDetail.groups.premiumPlan");

    case "internal_team":
      return t("flagDetail.groups.internalTeam");

    default:
      return group;

  }

};
  return (
    <div className="rules-card">

      <div className="rules-header">

        <div>

          <h2>
            <FaUsers className="section-icon" />
            {t("flagDetail.groupTargeting.title")}
          </h2>

          <p className="rules-description">
            {t("flagDetail.groupTargeting.description")}
          </p>

        </div>

        <button
          className="add-user-btn"
          onClick={() => setShowModal(true)}
        >
          + {t("flagDetail.groupTargeting.addGroup")}
        </button>

      </div>

      {groupRules.length === 0 ? (

        <div className="empty-state">
          {t("flagDetail.groupTargeting.empty")}
        </div>

      ) : (

        <div className="group-list">

  {groupRules.map((rule) => (

    <div
      key={rule.id}
      className="rule-item"
    >

              <div className="group-item-left">

                <div className="group-icon">
                  <FaUsers size={22} />
                </div>

                <div className="group-name">
                  {getGroupName(rule.rule_value)}
                </div>

              </div>

              <button
                className="delete-group-btn"
                onClick={() => handleDeleteGroup(rule.id)}
              >
                {t("common.delete")}
              </button>

                </div>

  ))}

</div>

      )}

      {showModal && (
        <GroupTargetingModal
          onClose={() => setShowModal(false)}
          onSave={handleAddGroup}
        />
      )}

    </div>
  );
}

export default GroupTargetingPanel;