import Store from 'electron-store';

const store = new Store({
  defaults: {
    token: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NmU1OTk2OTg4OTViY2JiYmFiNDQ2MWUiLCJ0eXBlIjoiZGV2Iiwiand0aWQiOiI2NzNjNTFhZTY2MjY3ZGZlZDg1N2E2ZTkifQ.OSBZosuthmv1sk0f7kCcz-14jPvzpClgjO9oqHa_Mkg`,
    user: {},
  }
});

export default store;