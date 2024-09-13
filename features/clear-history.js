import fs from 'node:fs';
import { getRootPath } from './common.js';

function clearHistories(account) {
  const path = getRootPath();
  fs.writeFileSync(`${path}/history/${account.account}.json`, JSON.stringify({ posted: [] }));
}

export {
  clearHistories,
}