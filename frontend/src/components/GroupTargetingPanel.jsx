import { useEffect, useState } from "react";
import { FaUsers } from "react-icons/fa";
import GroupTargetingModal from "./GroupTargetingModal";

import {
    getGroupRules,
    addGroupRule,
    deleteGroupRule,
} from "../services/groupTargetingService";

function GroupTargetingPanel({ flagId }) {

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
            loadGroups();
            setShowModal(false);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteGroup = async (ruleId) => {
        try {
            await deleteGroupRule(ruleId);
            loadGroups();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="rules-card">

            <div className="rules-header">

                <div>
                    <h2>
                        <FaUsers className="section-icon" />
                        Group Targeting
                    </h2>

                    <p className="rules-description">
                        Grant feature access to selected user groups.
                    </p>
                </div>

                <button
                    className="add-user-btn"
                    onClick={() => setShowModal(true)}
                >
                    + Add Group
                </button>

            </div>

            {groupRules.length === 0 ? (

                <div className="empty-state">
                    No group targeting rules configured yet.
                </div>

            ) : (

                <ul className="rule-list">

                    {groupRules.map((rule) => (

                        <li
                            key={rule.id}
                            className="rule-item"
                        >

                            <div className="group-item-left">

                                <div className="group-icon">
                                    <FaUsers size={22} />
                                </div>

                                <div className="group-name">
                                    {rule.rule_value}
                                </div>

                            </div>

                            <button
                                className="delete-group-btn"
                                onClick={() => handleDeleteGroup(rule.id)}
                            >
                                Delete
                            </button>

                        </li>

                    ))}

                </ul>

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