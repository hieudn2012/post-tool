import fs from 'node:fs';
import { getRootPath } from './common.js';

function getDefaultCategory(account) {
  const path = getRootPath();

  const filePath = `${path}/configs/${account.account}.json`;

  // check if account config exists
  if (!fs.existsSync(filePath)) {
    return '';
  } else {
    const data = fs.readFileSync(filePath, 'utf8');
    const config = JSON.parse(data);
    return config.category;
  }
}

export { getDefaultCategory };