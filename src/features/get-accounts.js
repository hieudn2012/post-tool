import request from "../utils/request.js";

export const getAccounts = async (status) => {
  const { data } = await request.get(`/accounts/for-run/all?status=${status}`);
  return data;
};
