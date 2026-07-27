import { useState } from "react";
import { createPortal } from "react-dom";
import Select from "react-select";
import "./GroupTargetingModal.css";

function GroupTargetingModal({ onClose, onSave }) {
    const options = [
        {
            value: "beta_users",
            label: "Beta Users",
        },
        {
            value: "premium_plan",
            label: "Premium Plan",
        },
        {
            value: "internal_team",
            label: "Internal Team",
        },
    ];

    const [group, setGroup] = useState(options[0]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        await onSave({
            rule_value: group.value,
        });

        onClose();
    };

    return createPortal(
        <div className="modal-overlay">
            <div className="modal-card">
                <h2>Add Target Group</h2>

                <form onSubmit={handleSubmit}>
                    <label>Select Group</label>

                    <Select
                        options={options}
                        value={group}
                        onChange={setGroup}
                        isSearchable={false}
                        styles={{
                            control: (base, state) => ({
                                ...base,
                                minHeight: 50,
                                borderRadius: 12,
                                borderColor: state.isFocused
                                    ? "#2563eb"
                                    : "#cbd5e1",
                                boxShadow: state.isFocused
                                    ? "0 0 0 3px rgba(37,99,235,.15)"
                                    : "none",
                                "&:hover": {
                                    borderColor: "#2563eb",
                                },
                            }),

                            menu: (base) => ({
                                ...base,
                                borderRadius: 12,
                                overflow: "hidden",
                                zIndex: 999999,
                            }),

                            option: (base, state) => ({
                                ...base,
                                backgroundColor: state.isSelected
                                    ? "#2563eb"
                                    : state.isFocused
                                    ? "#eff6ff"
                                    : "#fff",
                                color: state.isSelected
                                    ? "#fff"
                                    : "#1e293b",
                                cursor: "pointer",
                                padding: 14,
                            }),
                        }}
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
        </div>,
        document.body
    );
}

export default GroupTargetingModal;