import axios from 'axios';
import { API_URL } from '../constants/common.js';

const request = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NmU1OTk2OTg4OTViY2JiYmFiNDQ2MWUiLCJ0eXBlIjoiZGV2Iiwiand0aWQiOiI2NzNjNTFhZTY2MjY3ZGZlZDg1N2E2ZTkifQ.OSBZosuthmv1sk0f7kCcz-14jPvzpClgjO9oqHa_Mkg`,
  }
});

export default request;