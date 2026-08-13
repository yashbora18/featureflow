import { useState } from "react";
import { useTranslation } from "react-i18next";

import "./TargetingRuleModal.css";

function TargetingRuleModal({
  isOpen,
  onClose,
  onSave,
}) {
  const { t } = useTranslation();

  const [userId, setUserId] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId.trim()) return;

    await onSave({
      rule_type: "user",
      rule_value: userId,
    });

    setUserId("");
    onClose();
  };

  return (
    <div className="modal-overlay">

      <div className="modal-card">

        <h2>
          {t("targetingModal.title")}
        </h2>

        <form onSubmit={handleSubmit}>

          <label>
            {t("targetingModal.userId")}
          </label>

          <input
            type="text"
            placeholder={t("targetingModal.placeholder")}
            value={userId}
            onChange={(e) =>
              setUserId(e.target.value)
            }
          />

          <div className="modal-actions">

            <button
              type="button"
              className="cancel-btn"
              onClick={onClose}
            >
              {t("common.cancel")}
            </button>

            <button
              type="submit"
              className="save-btn"
            >
              {t("common.save")}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default TargetingRuleModal;