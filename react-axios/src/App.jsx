import { useEffect, useState } from 'react'
import axios from 'axios'

const API_URL = '/api/vizsgazo.php'
const emptyForm = { azon: '', nev: '', osztaly: '' }

export default function App() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function loadItems() {
    try {
      const response = await axios.get(API_URL)
      setItems(response.data.data || [])
    } catch (err) {
      setError('Nem sikerült betölteni az adatokat.')
    }
  }

  useEffect(() => {
    loadItems()
  }, [])

  async function handleCreate(e) {
    e.preventDefault()
    setError('')
    try {
      await axios.post(API_URL, {
        azon: Number(form.azon),
        nev: form.nev,
        osztaly: form.osztaly
      })
      setForm(emptyForm)
      setMessage('Sikeres létrehozás')
      loadItems()
    } catch (err) {
      setError(err.response?.data?.error || 'Hiba létrehozás közben.')
    }
  }

  async function handleDelete(id) {
    setError('')
    try {
      await axios.delete(`${API_URL}?id=${id}`)
      setMessage('Sikeres törlés')
      loadItems()
    } catch (err) {
      setError(err.response?.data?.error || 'Hiba törlés közben.')
    }
  }

  async function handleInlineUpdate(item) {
    setError('')
    try {
      await axios.put(`${API_URL}?id=${item.azon}`, {
        nev: item.nev,
        osztaly: item.osztaly
      })
      setMessage('Sikeres módosítás')
      loadItems()
    } catch (err) {
      setError(err.response?.data?.error || 'Hiba módosítás közben.')
    }
  }

  function handleCellChange(id, field, value) {
    setItems(prev => prev.map(item => item.azon === id ? { ...item, [field]: value } : item))
  }

  return (
    <div className="container">
      <h1>React + Axios CRUD</h1>
      <p>Vizsgázók kezelése backenddel és adatbázissal.</p>
      <nav>
        <a href="/">Vissza a főoldalra</a>
      </nav>
      <br></br>

      <form className="card" onSubmit={handleCreate}>
        <h2>Új vizsgázó</h2>
        <div className="grid">
          <input type="number" placeholder="Azonosító" value={form.azon} onChange={(e) => setForm({ ...form, azon: e.target.value })} />
          <input type="text" placeholder="Név" value={form.nev} onChange={(e) => setForm({ ...form, nev: e.target.value })} />
          <input type="text" placeholder="Osztály" value={form.osztaly} onChange={(e) => setForm({ ...form, osztaly: e.target.value })} />
        </div>
        <button type="submit">Hozzáadás</button>
      </form>

      {message && <p className="message">{message}</p>}
      {error && <p className="message" style={{background:'#fef2f2', border:'1px solid #fecaca'}}>{error}</p>}

      <div className="card">
        <h2>Lista</h2>
        <table>
          <thead>
            <tr>
              <th>Azon</th>
              <th>Név</th>
              <th>Osztály</th>
              <th>Műveletek</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.azon}>
                <td>{item.azon}</td>
                <td><input value={item.nev} onChange={(e) => handleCellChange(item.azon, 'nev', e.target.value)} /></td>
                <td><input value={item.osztaly} onChange={(e) => handleCellChange(item.azon, 'osztaly', e.target.value)} /></td>
                <td>
                  <button onClick={() => handleInlineUpdate(item)}>Mentés</button>{' '}
                  <button onClick={() => handleDelete(item.azon)}>Törlés</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
