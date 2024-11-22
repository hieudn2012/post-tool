// add event listener to open button
const openButton = document.getElementById(`get-profiles-btn`);
openButton.addEventListener('click', async () => {
  const profiles = await window.electronAPI.getProfiles();

  const profilesTable = document.getElementById(`profiles-table`);
  for (const profile of profiles) {
    const row = document.createElement(`tr`);
    const nameCell = document.createElement(`td`);
    nameCell.classList.add(`p-2`);
    nameCell.textContent = profile.name;
    row.appendChild(nameCell);

    const proxyCell = document.createElement(`td`);
    proxyCell.textContent = profile.proxy.host;
    row.appendChild(proxyCell);

    const runButton = document.createElement(`button`);
    runButton.textContent = `Run`;
    runButton.addEventListener(`click`, async () => {
      await window.electronAPI.run(profile.id);
    });
    row.appendChild(runButton);

    profilesTable.appendChild(row);
  }

});