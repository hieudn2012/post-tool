const { dialog } = require('electron');
const fs = require('fs');

const importAccounts = async (folderPath) => {
  const { filePaths } = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      { name: 'Text', extensions: ['txt'] },
    ],
  });
  const path = filePaths[0];

  if (!path) {
    return;
  }

  const content = fs.readFileSync(path, 'utf8');
  const lines = content.split('\n');

  const accounts = lines.map((line, index) => {
    const [account, password, account2fa, ip, port, user, pass] = line.split('|');
    return {
      id: index + 1,
      ip: ip.trim(),
      port: port.trim(),
      user: user.trim(),
      pass: pass.trim(),
      account: account.trim(),
      password: password.trim(),
      account2fa: account2fa.trim(),
    };
  });

  // write to accounts.json
  const accountsPath = `${folderPath}/accounts.json`;
  // clear file
  fs.writeFileSync(accountsPath, '[]');
  // write new accounts
  fs.writeFileSync(accountsPath, JSON.stringify(accounts, null, 2));

  return {
    path,
    accounts,
  };
};

module.exports = {
  importAccounts,
}