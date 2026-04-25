const jsData = [
  { azon: 1, nev: 'Borbás Ferenc', osztaly: '11/B' },
  { azon: 2, nev: 'Sima Dezső', osztaly: '11/C' },
  { azon: 3, nev: 'Lajos Lajos', osztaly: '11/C' },
  { azon: 4, nev: 'Lant János', osztaly: '12/D' },
  { azon: 5, nev: 'Fogó Róbert', osztaly: '11/C' }
];

layout(
  'JavaScript CRUD',
  'Ebben a menüpontban az adatok tömbben tárolódnak, tehát nincs adatbázis és backend.',
  'javascript.html',
  `
    <section class="card">
      <h2>Új vizsgázó hozzáadása</h2>
      <div id="js-msg"></div>
      <div class="grid-3">
        <div><label>Azonosító</label><input id="js-azon" type="number"></div>
        <div><label>Név</label><input id="js-nev" type="text"></div>
        <div><label>Osztály</label><input id="js-osztaly" type="text"></div>
      </div>
      <div class="inline-actions" style="margin-top:14px;">
        <button onclick="addJsItem()">Hozzáadás</button>
      </div>
    </section>

    <section class="card">
      <h2>Vizsgázók listája</h2>
      <div class="table-wrap">
        <table>
          <thead>
            <tr><th>Azon</th><th>Név</th><th>Osztály</th><th>Műveletek</th></tr>
          </thead>
          <tbody id="js-rows"></tbody>
        </table>
      </div>
    </section>
  `
);

function renderJsRows() {
  const tbody = document.getElementById('js-rows');
  tbody.innerHTML = jsData.map(item => `
    <tr>
      <td>${item.azon}</td>
      <td><input id="js-nev-${item.azon}" value="${item.nev}"></td>
      <td><input id="js-oszt-${item.azon}" value="${item.osztaly}"></td>
      <td>
        <div class="inline-actions">
          <button onclick="saveJsItem(${item.azon})">Mentés</button>
          <button class="danger" onclick="deleteJsItem(${item.azon})">Törlés</button>
        </div>
      </td>
    </tr>
  `).join('');
}

function addJsItem() {
  const azon = Number(document.getElementById('js-azon').value);
  const nev = document.getElementById('js-nev').value.trim();
  const osztaly = document.getElementById('js-osztaly').value.trim();

  if (!azon || !nev || !osztaly) return showMessage('js-msg', 'Minden mező kitöltése kötelező.', 'error');
  if (jsData.some(x => x.azon === azon)) return showMessage('js-msg', 'Ez az azonosító már létezik.', 'error');

  jsData.push({ azon, nev, osztaly });
  renderJsRows();
  document.getElementById('js-azon').value = '';
  document.getElementById('js-nev').value = '';
  document.getElementById('js-osztaly').value = '';
  showMessage('js-msg', 'Sikeres hozzáadás.');
}

function saveJsItem(id) {
  const item = jsData.find(x => x.azon === id);
  item.nev = document.getElementById(`js-nev-${id}`).value.trim();
  item.osztaly = document.getElementById(`js-oszt-${id}`).value.trim();
  showMessage('js-msg', 'Sikeres módosítás.');
}

function deleteJsItem(id) {
  const index = jsData.findIndex(x => x.azon === id);
  jsData.splice(index, 1);
  renderJsRows();
  showMessage('js-msg', 'Sikeres törlés.');
}

renderJsRows();
