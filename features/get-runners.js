import axios from 'axios';

export const getRunners = async (token) => {
  const { data } = await axios.get('https://socialfly-be.fly.dev/runners', {
    headers: {  Authorization: `Bearer ${token}` }
  });
  return data;
};