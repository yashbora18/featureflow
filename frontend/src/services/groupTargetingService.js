import axios from "axios";

const API_URL =
  `${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/flags`;
  
// =============================
// Get Group Targeting Rules
// =============================
export const getGroupRules = async (flagId) => {
    const response = await axios.get(
        `${API_URL}/${flagId}/targeting-groups`
    );

    return response.data;
};

// =============================
// Add Group Targeting Rule
// =============================
export const addGroupRule = async (
    flagId,
    rule
) => {

    const response = await axios.post(
        `${API_URL}/${flagId}/targeting-groups`,
        rule
    );

    return response.data;
};

// =============================
// Delete Group Targeting Rule
// =============================
export const deleteGroupRule = async (
    ruleId
) => {

    await axios.delete(
        `${API_URL}/targeting-groups/${ruleId}`
    );
};
