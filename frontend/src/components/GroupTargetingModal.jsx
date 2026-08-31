import { useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import Select from "react-select";

import "./GroupTargetingModal.css";

function GroupTargetingModal({ onClose, onSave }) {
    const { t } = useTranslation();

    const options = [
        {
            value: "beta_users",
            label: t("groups.betaUsers"),
        },
        {
            value: "premium_plan",
            label: t("groups.premiumPlan"),
        },
        {
            value: "internal_team",
            label: t("groups.internalTeam"),
        },
    ];

    const [group, setGroup] = useState(options[0]);

    const isDarkMode =
        document.documentElement.classList.contains("dark");

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

                <h2>
                    {t("groupTargetingModal.title")}
                </h2>

                <form onSubmit={handleSubmit}>

                    <label>
                        {t("groupTargetingModal.selectGroup")}
                    </label>

                    <Select
                        options={options}
                        value={group}
                        onChange={setGroup}
                        isSearchable={false}
                        styles={{

                            /* =========================
                               SELECT CONTROL
                            ========================= */

                            control: (base, state) => ({
                                ...base,

                                minHeight: 50,

                                borderRadius: 12,

                                backgroundColor: isDarkMode
                                    ? "#172033"
                                    : "#ffffff",

                                borderColor: state.isFocused
                                    ? "#7c3aed"
                                    : isDarkMode
                                    ? "#334155"
                                    : "#cbd5e1",

                                boxShadow: state.isFocused
                                    ? "0 0 0 3px rgba(124,58,237,.20)"
                                    : "none",

                                "&:hover": {
                                    borderColor: "#7c3aed",
                                },
                            }),


                            /* =========================
                               SELECTED VALUE
                            ========================= */

                            singleValue: (base) => ({
                                ...base,

                                color: isDarkMode
                                    ? "#f8fafc"
                                    : "#1e293b",
                            }),


                            /* =========================
                               DROPDOWN MENU
                            ========================= */

                            menu: (base) => ({
                                ...base,

                                backgroundColor: isDarkMode
                                    ? "#172033"
                                    : "#ffffff",

                                borderRadius: 12,

                                overflow: "hidden",

                                zIndex: 999999,

                                border: isDarkMode
                                    ? "1px solid #334155"
                                    : "none",

                                boxShadow: isDarkMode
                                    ? "0 15px 35px rgba(0,0,0,.45)"
                                    : "0 10px 25px rgba(0,0,0,.15)",
                            }),


                            /* =========================
                               OPTIONS
                            ========================= */

                            option: (base, state) => ({
                                ...base,

                                backgroundColor: state.isSelected
                                    ? "#7c3aed"
                                    : state.isFocused
                                    ? isDarkMode
                                        ? "#2e1065"
                                        : "#eff6ff"
                                    : isDarkMode
                                    ? "#172033"
                                    : "#ffffff",

                                color: state.isSelected
                                    ? "#ffffff"
                                    : isDarkMode
                                    ? "#f8fafc"
                                    : "#1e293b",

                                cursor: "pointer",

                                padding: 14,

                                "&:active": {
                                    backgroundColor: "#7c3aed",
                                    color: "#ffffff",
                                },
                            }),


                            /* =========================
                               SEPARATOR
                            ========================= */

                            indicatorSeparator: (base) => ({
                                ...base,

                                backgroundColor: isDarkMode
                                    ? "#475569"
                                    : "#cbd5e1",
                            }),


                            /* =========================
                               DROPDOWN ARROW
                            ========================= */

                            dropdownIndicator: (base) => ({
                                ...base,

                                color: isDarkMode
                                    ? "#cbd5e1"
                                    : "#64748b",

                                "&:hover": {
                                    color: "#a78bfa",
                                },
                            }),

                        }}
                    />


                    {/* =========================
                        ACTION BUTTONS
                    ========================= */}

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

        </div>,

        document.body
    );
}

export default GroupTargetingModal;
