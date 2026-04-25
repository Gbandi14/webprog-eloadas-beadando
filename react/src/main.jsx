import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { initialVizsgatargyak } from './initialData.js';
import './style.css';
import Footer from "./footer";

const STORAGE_KEY = 'react-crud-vizsgatargyak';
const emptyForm = { nev: '', szomax: '', irmax: '' };

function App() {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialVizsgatargyak;
  });
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const filteredItems = useMemo(() => {
    const text = search.trim().toLowerCase();
    if (!text) return items;
    return items.filter((item) =>
      item.nev.toLowerCase().includes(text) || String(item.azon).includes(text)
    );
  }, [items, search]);

  const nextId = useMemo(
    () => (items.length ? Math.max(...items.map((item) => Number(item.azon))) + 1 : 1),
    [items]
  );

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function validateForm(data) {
    if (!data.nev.trim()) return 'A vizsgatárgy neve kötelező.';
    if (data.szomax === '' || data.irmax === '') return 'Mindkét maximális pontszámot ki kell tölteni.';
    if (Number(data.szomax) < 0 || Number(data.irmax) < 0) return 'A pontszámok nem lehetnek negatívak.';
    if (!Number.isInteger(Number(data.szomax)) || !Number.isInteger(Number(data.irmax))) return 'A pontszámok egész számok legyenek.';
    return '';
  }

  function handleSubmit(event) {
    event.preventDefault();
    const error = validateForm(form);
    if (error) {
      setMessage(error);
      return;
    }

    const record = {
      azon: editingId ?? nextId,
      nev: form.nev.trim(),
      szomax: Number(form.szomax),
      irmax: Number(form.irmax),
    };

    if (editingId) {
      setItems((prev) => prev.map((item) => (item.azon === editingId ? record : item)));
      setMessage('A vizsgatárgy módosítva lett.');
    } else {
      setItems((prev) => [...prev, record]);
      setMessage('Új vizsgatárgy hozzáadva.');
    }

    setForm(emptyForm);
    setEditingId(null);
  }

  function startEdit(item) {
    setEditingId(item.azon);
    setForm({ nev: item.nev, szomax: String(item.szomax), irmax: String(item.irmax) });
    setMessage('Szerkesztési mód aktív.');
  }

  function deleteItem(id) {
    const selected = items.find((item) => item.azon === id);
    if (!window.confirm(`Biztosan törlöd ezt a vizsgatárgyat: ${selected.nev}?`)) return;
    setItems((prev) => prev.filter((item) => item.azon !== id));
    if (editingId === id) {
      setEditingId(null);
      setForm(emptyForm);
    }
    setMessage('A vizsgatárgy törölve lett.');
  }

  function resetData() {
    setItems(initialVizsgatargyak);
    setForm(emptyForm);
    setEditingId(null);
    setSearch('');
    setMessage('Vizsgatárgy adatok visszaállítva.');
  }

  return (
    <main className="page">
      <section className="hero">
        <div>
          <p className="eyebrow">React menü - CRUD alkalmazás</p>
          <h1>Vizsgatárgyak kezelése</h1>
          <p>
            Ez a React alkalmazás a választott adatbázis <strong>vizsgatárgy adatbázis </strong>
            adatait használja.
          </p>
        </div>
        <button className="secondary" type="button" onClick={resetData}>Eredeti adatok</button>
		<a href="/">
		<button className="secondary" type="button">Vissza a főoldalra</button>
		</a>
      </section>

      <section className="grid">
        <form className="card form" onSubmit={handleSubmit}>
          <h2>{editingId ? 'Vizsgatárgy módosítása' : 'Új vizsgatárgy felvétele'}</h2>

          <label>
            Azonosító
            <input value={editingId ?? nextId} disabled />
          </label>

          <label>
            Vizsgatárgy neve
            <input name="nev" value={form.nev} onChange={handleChange} placeholder="pl. Informatika" />
          </label>

          <div className="two-cols">
            <label>
              Szóbeli max.
              <input name="szomax" type="number" min="0" value={form.szomax} onChange={handleChange} placeholder="30" />
            </label>
            <label>
              Írásbeli max.
              <input name="irmax" type="number" min="0" value={form.irmax} onChange={handleChange} placeholder="120" />
            </label>
          </div>

          <div className="actions">
            <button type="submit">{editingId ? 'Mentés' : 'Hozzáadás'}</button>
            {editingId && (
              <button className="secondary" type="button" onClick={() => {
                setEditingId(null);
                setForm(emptyForm);
                setMessage('Szerkesztés megszakítva.');
              }}>Mégse</button>
            )}
          </div>

          {message && <p className="message">{message}</p>}
        </form>

        <section className="card table-card">
          <div className="table-head">
            <h2>Vizsgatárgyak listája</h2>
            <input className="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Keresés név vagy azonosító alapján" />
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Azon</th>
                  <th>Név</th>
                  <th>Szóbeli max.</th>
                  <th>Írásbeli max.</th>
                  <th>Műveletek</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item.azon}>
                    <td>{item.azon}</td>
                    <td>{item.nev}</td>
                    <td>{item.szomax}</td>
                    <td>{item.irmax}</td>
                    <td className="row-actions">
                      <button type="button" onClick={() => startEdit(item)}>Módosítás</button>
                      <button className="danger" type="button" onClick={() => deleteItem(item.azon)}>Törlés</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </section>
      <Footer />
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
