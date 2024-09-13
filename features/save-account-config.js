import fs from 'node:fs';
import { getRootPath } from './common.js';

function saveAccountConfig(account) {
  const path = getRootPath();
  const category = account.category;

  // check file exists in path/configs/account.accont.json if not create it
  if (!fs.existsSync(`${path}/configs/${account.account}.json`)) {
    fs.writeFileSync(`${path}/configs/${account.account}.json`, JSON.stringify({
      category,
    }));
    return;
  }

  const data = fs.readFileSync(`${path}/configs/${account.account}.json`, 'utf8');
  const config = JSON.parse(data);
  config.category = category;

  fs.writeFileSync(`${path}/configs/${account.account}.json`, JSON.stringify(config));
}

export {
  saveAccountConfig,
};