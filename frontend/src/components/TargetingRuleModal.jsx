import { useState } from "react";
import "./TargetingRuleModal.css";

function TargetingRuleModal({ isOpen, onClose, onSave }) {
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

        <h2>Add Target User</h2>

        <form onSubmit={handleSubmit}>

          <label>User ID</label>

          <input
            type="text"
            placeholder="Enter User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />

          <div className="modal-actions">

            <button
              type="button"
              className="cancel-btn"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save-btn"
            >
              Save
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}

export default TargetingRuleModal;