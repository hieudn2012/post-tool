import _ from 'lodash';
import request from "../utils/request.js";

export const getAccounts = async () => {
  const { data } = await request.get('/accounts');
  return _.filter(data, ({ category, access_token, account, threads_info }) => category && access_token && account === threads_info?.username);
};