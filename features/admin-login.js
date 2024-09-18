import axios from 'axios';

export const adminLogin = async (account) => {
  const { data } = await axios.post('https://socialfly-be.fly.dev/auth/login', account);
  return data?.access_token;
};