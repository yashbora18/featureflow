import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/environments`;

export const getEnvironments = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};