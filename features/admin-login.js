import axios from 'axios';
import { APP_API_URL } from '../src/constants/common.js';

export const adminLogin = async (account) => {
  console.log(`${APP_API_URL}/auth/login`, 'asdas');
  const { data } = await axios.post(`${APP_API_URL}/auth/login`, account, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return data?.access_token;
};