import axios from 'axios';
import config from '../utils/config';

const callApi = async (endpoint, method = 'get', data = {}) => {
  const apiConfig = {
    method,
    url: `${config.server}:${config.port}${config.baseURL}/${endpoint}`,
    headers: {},
    data
  }
  try {
    const resp = await axios(apiConfig);
    return resp.data;
  } catch (error) {
    return error.response?.data;
  }
}

export default callApi;
