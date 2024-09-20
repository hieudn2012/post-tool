import { getRootPath } from "./common.js";
import fs from 'node:fs';

export const getCookies = async ({ account }) => {
  const path = getRootPath();
  const cookies = fs.readFileSync(`${path}/cookies/${account.account}.json`, 'utf8');
  return cookies;
};