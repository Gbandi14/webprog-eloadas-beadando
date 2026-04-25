const fetchApiUrl = './api/vizsgazo.php';

layout(
  'Fetch API CRUD',
  'A JavaScript a Fetch API segítségével kommunikál a PHP szerveroldali végponttal, az adatok pedig MySQL adatbázisban tárolódnak.',
  'fetchapi.html',
  `
    <section class="card">
      <h2>Új vizsgázó felvétele adatbázisba</h2>
      <div id="fetch-msg"></div>
      <div class="grid-3">
        <div><label>Azonosító</label><input id="fetch-azon" type="number"></div>
        <div><label>Név</label><input id="fetch-nev" type="text"></div>
        <div><label>Osztály</label><input id="fetch-osztaly" type="text"></div>
      </div>
      <div class="inline-actions" style="margin-top:14px;">
        <button onclick="createFetchItem()">Hozzáadás</button>
        <button class="secondary" onclick="loadFetchItems()">Lista frissítése</button>
      </div>
    </section>

    <section class="card">
      <h2>Adatbázisból betöltött vizsgázók</h2>
      <div class="table-wrap">
        <table>
          <thead>
            <tr><th>Azon</th><th>Név</th><th>Osztály</th><th>Műveletek</th></tr>
          </thead>
          <tbody id="fetch-rows"></tbody>
        </table>
      </div>
    </section>
  `
);

async function loadFetchItems() {
  const res = await fetch(fetchApiUrl);
  const json = await res.json();
  const tbody = document.getElementById('fetch-rows');
  tbody.innerHTML = (json.data || []).map(item => `
    <tr>
      <td>${item.azon}</td>
      <td><input id="fetch-nev-${item.azon}" value="${item.nev}"></td>
      <td><input id="fetch-osztaly-${item.azon}" value="${item.osztaly}"></td>
      <td>
        <div class="inline-actions">
          <button onclick="updateFetchItem(${item.azon})">Mentés</button>
          <button class="danger" onclick="deleteFetchItem(${item.azon})">Törlés</button>
        </div>
      </td>
    </tr>
  `).join('');
}

async function createFetchItem() {
  const body = {
    azon: Number(document.getElementById('fetch-azon').value),
    nev: document.getElementById('fetch-nev').value.trim(),
    osztaly: document.getElementById('fetch-osztaly').value.trim()
  };
  const res = await fetch(fetchApiUrl, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(body)
  });
  const json = await res.json();
  showMessage('fetch-msg', json.success ? 'Sikeres hozzáadás.' : (json.error || 'Hiba történt.'), json.success ? 'success' : 'error');
  if (json.success) {
    document.getElementById('fetch-azon').value = '';
    document.getElementById('fetch-nev').value = '';
    document.getElementById('fetch-osztaly').value = '';
    loadFetchItems();
  }
}

async function updateFetchItem(id) {
  const body = {
    nev: document.getElementById(`fetch-nev-${id}`).value.trim(),
    osztaly: document.getElementById(`fetch-osztaly-${id}`).value.trim()
  };
  const res = await fetch(`${fetchApiUrl}?id=${id}`, {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(body)
  });
  const json = await res.json();
  showMessage('fetch-msg', json.success ? 'Sikeres módosítás.' : (json.error || 'Hiba történt.'), json.success ? 'success' : 'error');
  if (json.success) loadFetchItems();
}

async function deleteFetchItem(id) {
  const res = await fetch(`${fetchApiUrl}?id=${id}`, { method: 'DELETE' });
  const json = await res.json();
  showMessage('fetch-msg', json.success ? 'Sikeres törlés.' : (json.error || 'Hiba történt.'), json.success ? 'success' : 'error');
  if (json.success) loadFetchItems();
}
loadFetchItems();
