import request from "../utils/request.js";
import store from "../utils/store.js";

export const adminLogin = async (account) => {
  const { username, password } = account;
  const { data } = await request.post('/auth/login', { username, password });
  store.set('token', data.access_token);
};