import axios from 'axios';

export const adminLogin = async (account) => {
  const { data } = await axios.post('http://localhost:3000/auth/login', account);
  return data?.access_token;
};