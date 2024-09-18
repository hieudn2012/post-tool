import axios from "axios";
import { openTestBrowser } from "./open-test-browser.js";
import { closeBrowser, sendEvent } from "./common.js";

export const getRunnerDetails = async ({ accountId, token }) => {
  const { data } = await axios.get(`http://localhost:3000/runners/${accountId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return data;
};

// Action includes: OPEN_TEST_BROWSER, SAVE_COOKIES, STOP, GET_QR_CODE, CLREAR_HISTORY,INSTAGRAM_LOGIN, RUN
export const listenAction = async ({ data, browsers, pages, event }) => {
  const { accountId, action, token } = data;

  switch (action) {
    case 'OPEN_TEST_BROWSER':
      // openTestBrowser({ runner: { accountId }, browsers, pages });
      break;
    case 'SAVE_COOKIES':
      // console.log('Save cookies');
      break;
    case 'STOP':
      await closeBrowser({ runner: { accountId }, browsers });
      sendEvent({ event, runner: { accountId }, message: 'Runner stoped!' });
      break;
    case 'GET_QR_CODE':
      console.log('Get QR code');
      break;
    case 'CLREAR_HISTORY':
      console.log('Clear history');
      break;
    case 'INSTAGRAM_LOGIN':
      console.log('Instagram login');
      break;
    default:
      break;
  }
};