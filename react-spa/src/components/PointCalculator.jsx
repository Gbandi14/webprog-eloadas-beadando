import { useState } from 'react'

export default function PointCalculator() {
  const [oral, setOral] = useState(20)
  const [written, setWritten] = useState(60)
  const max = 150
  const total = Number(oral) + Number(written)
  const percent = ((total / max) * 100).toFixed(2)

  return (
    <div className="card">
      <h2>Pontkalkulátor</h2>
      <div className="grid">
        <div>
          <label>Szóbeli pont</label>
          <input type="number" value={oral} onChange={(e) => setOral(e.target.value)} />
        </div>
        <div>
          <label>Írásbeli pont</label>
          <input type="number" value={written} onChange={(e) => setWritten(e.target.value)} />
        </div>
      </div>
      <p><strong>Összpont:</strong> {total}</p>
      <p><strong>Teljesítmény:</strong> {percent}%</p>
    </div>
  )
}
