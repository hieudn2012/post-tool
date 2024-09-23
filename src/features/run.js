import request from "../utils/request.js";
import { sleep } from "../utils/common.js"

const runningAccounts = {};

export const stop = (account) => {
  const id = account._id;
  const accountName = account.account;
  if (runningAccounts[id]) {
    runningAccounts[id] = false;
    console.log(`Stopping account ${accountName}`);
  } else {
    console.log(`Account ${accountName} is not running`);
  }
}

export const run = async (account) => {
  const id = account._id;
  const accountName = account.account;
  runningAccounts[id] = true;

  try {
    while (runningAccounts[id]) {
      const { data: { canRun, timeout, minutes, nextTime } } = await request.post(`/accounts/check-run/${id}`);
      if (!canRun) {
        console.log(`Account ${accountName} is waiting for next schedule..., Next time: ${nextTime}`);
        await sleep(timeout);
        console.log(`Account ${accountName} are posting...`);
        await request.post(`/accounts/run/${id}`);
        console.log(`Account ${accountName} posted!`);
        continue;
      }

      if (canRun) {
        console.log(`Account ${accountName} are posting...`);
        await request.post(`/accounts/run/${id}`);
        console.log(`Account ${accountName} posted!`);
        continue;
      }
    }
    console.log('Process stopped!');
  } catch (error) {
    console.log(`Error running account ${accountName}: ${error.message}`);
    await request.post(`/errors`, {
      accountId: id,
      message: error.message,
    });
  }
}
