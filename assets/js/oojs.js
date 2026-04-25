class VizualisElem {
  constructor(name, x, y, size, color) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
  }

  createNode() {
    const div = document.createElement('div');
    div.className = 'bubble';
    div.style.left = this.x + 'px';
    div.style.top = this.y + 'px';
    div.style.width = this.size + 'px';
    div.style.height = this.size + 'px';
    div.style.background = this.color;
    div.textContent = this.name;
    return div;
  }
}

class TantargyBuborek extends VizualisElem {
  constructor(name, avg, x, y, size, color) {
    super(name, x, y, size, color);
    this.avg = avg;
  }

  render(parent) {
    const node = this.createNode();
    node.title = `${this.name} átlagpont: ${this.avg}`;
    node.innerHTML = `<div style="text-align:center;padding:10px">${this.name}<br><small>${this.avg} pont</small></div>`;
    parent.appendChild(node);
  }
}

layout(
  'OOJS alkalmazás',
  'Ebben a menüpontban az OOJS alkalmazás található.',
  'oojs.html',
  `
    <section class="card">
      <h2>OOJS vizuális tantárgytérkép</h2>
      <div id="playground" class="playground card" style="background:linear-gradient(135deg,#eff6ff,#f8fafc)"></div>
    </section>
  `
);

const playground = document.getElementById('playground');
const items = [
  new TantargyBuborek('Magyar', 74, 30, 40, 120, '#2563eb'),
  new TantargyBuborek('Történelem', 68, 180, 180, 130, '#7c3aed'),
  new TantargyBuborek('Matematika', 61, 360, 60, 140, '#ea580c'),
  new TantargyBuborek('Informatika', 88, 560, 180, 150, '#16a34a'),
  new TantargyBuborek('Angol', 79, 760, 70, 125, '#db2777')
];

items.forEach(item => item.render(playground));
document.body.appendChild(document.createComment('OOJS elem létrehozás megtörtént.'));
