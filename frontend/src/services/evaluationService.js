import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/evaluate`;

export const evaluateFlag = async (data) => {
  const response = await axios.post(API_URL, data);
  return response.data;
};