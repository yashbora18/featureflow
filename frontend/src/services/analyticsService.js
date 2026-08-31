import axios from "axios";


const API_URL =
  `${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}/analytics`;


// =====================================================
// DASHBOARD ANALYTICS
// =====================================================

export const getDashboardAnalytics = async (

    days = 7,

    environment_id

) => {

    const response = await axios.get(

        `${API_URL}/dashboard`,

        {

            params: {

                days,

                environment_id

            }

        }

    );


    return response.data;

};



// =====================================================
// EVALUATION TREND ONLY
// =====================================================

export const getEvaluationTrend = async (

    days = 7,

    environment_id

) => {

    const response = await axios.get(

        `${API_URL}/evaluations`,

        {

            params: {

                days,

                environment_id

            }

        }

    );


    return response.data;

};



// =====================================================
// FLAG EVALUATION ANALYTICS
// =====================================================

export const getEvaluationAnalytics = async (

    flagKey,

    environment_id

) => {

    const response = await axios.get(

        `${API_URL}/${encodeURIComponent(flagKey)}`,

        {

            params: {

                environment_id

            }

        }

    );


    return response.data;

};



// =====================================================
// TOP FLAGS
// =====================================================

export const getTopFlags = async (

    environment_id

) => {

    const response = await axios.get(

        `${API_URL}/top-flags`,

        {

            params: {

                environment_id

            }

        }

    );


    return response.data;

};
