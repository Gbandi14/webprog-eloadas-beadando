function layout(pageTitle, pageDescription, activePage, contentHtml) {
  const pages = [
    ['index.html', 'Főoldal'],
    ['javascript.html', 'JavaScript CRUD'],
    ['./react/dist/index.html', 'React'],
    ['./react-spa/dist/index.html', 'SPA'],
    ['fetchapi.html', 'Fetch API'],
    ['./react-axios/dist/index.html', 'React + Axios'],
    ['oojs.html', 'OOJS']
  ];

  const nav = pages.map(([href, label]) =>
    `<a href="${href}" class="${activePage === href ? 'active' : ''}">${label}</a>`
  ).join('');

  document.body.innerHTML = `
    <header class="hero">
      <div class="container">
        <h1>Web programozás-1 Előadás Házi feladat</h1>
        <p>${pageDescription}</p>
        <nav class="topnav">${nav}</nav>
      </div>
    </header>
    <main class="container">
      ${contentHtml}
      <footer class="footer">
        <p>Készítők: Ács András - DT5E4P | Csányi Kristóf - EI546K</p>
      </footer>
    </main>
  `;
  document.title = pageTitle;
}

function showMessage(targetId, text, type='success') {
  const el = document.getElementById(targetId);
  if (!el) return;
  el.innerHTML = `<div class="message ${type}">${text}</div>`;
  setTimeout(() => {
    if (el.innerHTML.includes(text)) el.innerHTML = '';
  }, 3500);
}
