import axios from 'axios';
import { API_URL } from '../constants/common.js';
import store from './store.js';

const request = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${store.get('token')}`,
  }
});

export default request;