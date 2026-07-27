import axios from "axios";

const API_URL = "http://127.0.0.1:8000/evaluate";

export const evaluateFlag = async (data) => {
  const response = await axios.post(API_URL, data);
  return response.data;
};