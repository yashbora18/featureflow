import axios from "axios";


const API_URL = "http://localhost:8000";


export const getDashboardData = async()=>{


const response = await axios.get(
`${API_URL}/dashboard`
);


return response.data;


};