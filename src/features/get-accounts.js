import request from "../utils/request.js";

export const getAccounts = async () => {
  const { data } = await request.get('/accounts');
  return data;
};