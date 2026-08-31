import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/cleanup`;

export const getCleanupSuggestions = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const markCleanupReviewed = async (flagKey) => {
  const response = await axios.post(
    `${API_URL}/review/${flagKey}`
  );

  return response.data;
};
