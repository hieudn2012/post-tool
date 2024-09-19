import axios from 'axios';
import { APP_API_URL } from '../src/constants/common.js';

export const getRunners = async (token) => {
  const { data } = await axios.get(`${APP_API_URL}/runners`, {
    headers: {  Authorization: `Bearer ${token}` }
  });
  return data;
};