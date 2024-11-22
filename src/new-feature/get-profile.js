import _ from "lodash";
import request from "../utils/request.js";

export const getProfile = async (userId) => {
  const { data } = await request.get(`/browser/v2`);
  return _.get(data, "profiles", []);
};