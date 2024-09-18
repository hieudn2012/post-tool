import axios from 'axios';

export const getRunners = async (token) => {
  const { data } = await axios.get('http://localhost:3000/runners', {
    headers: {  Authorization: `Bearer ${token}` }
  });
  return data;
};