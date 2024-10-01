import Store from 'electron-store';

const store = new Store({
  defaults: {
    token: 'token',
    user: {},
  }
});

export default store;