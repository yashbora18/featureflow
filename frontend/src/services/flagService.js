import axios from "axios";


const API_URL = "http://127.0.0.1:8000/flags";




// =====================================================
// GET FLAGS BY ENVIRONMENT
// =====================================================

export const getFlags = async (

  environment_id

) => {


  const response = await axios.get(

    `${API_URL}/`,

    {

      params: {

        environment_id

      }

    }

  );


  return response.data;

};









// =====================================================
// GET SINGLE FLAG
// =====================================================

export const getFlag = async (

  key,

  environment_id

) => {


  const response = await axios.get(

    `${API_URL}/${key}`,

    {

      params: {

        environment_id

      }

    }

  );


  return response.data;

};









// =====================================================
// CREATE FLAG
// =====================================================

export const createFlag = async (

  flag

) => {


  const response = await axios.post(

    `${API_URL}/`,

    flag

  );


  return response.data;

};









// =====================================================
// UPDATE FLAG
// =====================================================

export const updateFlag = async (

  key,

  environment_id,

  flag

) => {


  const response = await axios.put(

    `${API_URL}/${key}`,

    flag,

    {

      params: {

        environment_id

      }

    }

  );


  return response.data;

};









// =====================================================
// DELETE FLAG
// =====================================================

export const deleteFlag = async (

  flagKey,

  environment_id

) => {


  const response = await axios.delete(

    `${API_URL}/${flagKey}`,

    {

      params: {

        environment_id

      }

    }

  );


  return response.data;

};









// =====================================================
// EVALUATE FLAG
// =====================================================

export const evaluateFlag = async (

  flag_key,

  environment_id,

  evaluation_type,

  evaluation_value

) => {


  const response = await axios.get(

    `${API_URL}/evaluate/`,

    {

      params: {


        flag_key,


        environment_id,



        user_id:

        evaluation_type === "user"

        ? evaluation_value

        : null


      }

    }

  );


  return response.data;

};