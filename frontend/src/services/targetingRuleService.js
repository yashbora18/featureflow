import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/flags`;

export const getTargetingRules = async (flagId) => {
    const response = await axios.get(
        `${API_URL}/${flagId}/targeting-users`
    );

    return response.data;
};

export const addTargetingRule = async (flagId, data) => {
    const response = await axios.post(
        `${API_URL}/${flagId}/targeting-users`,
        data
    );

    return response.data;
};

export const deleteTargetingRule = async (ruleId) => {
    const response = await axios.delete(
        `${API_URL}/targeting-users/${ruleId}`
    );

    return response.data;
};