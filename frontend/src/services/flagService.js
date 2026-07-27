import axios from "axios";

const API_URL = "http://127.0.0.1:8000/flags";

// Get all flags
export const getFlags = async () => {
  const response = await axios.get(`${API_URL}/`);
  return response.data;
};

// Get single flag
export const getFlag = async (key) => {
  const response = await axios.get(`${API_URL}/${key}`);
  return response.data;
};

// Create flag
export const createFlag = async (flag) => {
  const response = await axios.post(`${API_URL}/`, flag);
  return response.data;
};

// Update flag
export const updateFlag = async (key, flag) => {
  const response = await axios.put(`${API_URL}/${key}`, flag);
  return response.data;
};

// Delete flag
export const deleteFlag = async (flagKey) => {
  const response = await axios.delete(`${API_URL}/${flagKey}`);
  return response.data;
};

// Evaluate Flag
export const evaluateFlag = async (
  flag_key,
  environment_id,
  evaluation_type,
  evaluation_value
) => {

  const response = await axios.post(
    `http://127.0.0.1:8000/evaluate/`,
    {
        flag_key,
        environment_id,
        evaluation_type,
        evaluation_value,
    }
);

  return response.data;
};