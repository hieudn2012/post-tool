import axios from 'axios';
import { APP_API_URL } from '../src/constants/common.js';

export const adminLogin = async (account) => {
  const { data } = await axios.post(`${APP_API_URL}/auth/login`, account);
  return data?.access_token;
};