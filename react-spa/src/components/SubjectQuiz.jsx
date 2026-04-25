import { useState } from 'react'

const questions = [
  { q: 'Melyik tárgyhoz tartozik 120 írásbeli maximum?', a: 'Informatika' },
  { q: 'Melyik tárgyhoz tartozik 115 írásbeli maximum?', a: 'Matematika' },
  { q: 'Melyik tárgyhoz tartozik 90 írásbeli maximum?', a: 'Történelem' }
]

export default function SubjectQuiz() {
  const [index, setIndex] = useState(0)
  const [answer, setAnswer] = useState('')
  const [message, setMessage] = useState('')

  function check() {
    const good = answer.trim().toLowerCase() === questions[index].a.toLowerCase()
    setMessage(good ? 'Helyes válasz!' : `Nem jó. A helyes válasz: ${questions[index].a}`)
  }

  function next() {
    setIndex((index + 1) % questions.length)
    setAnswer('')
    setMessage('')
  }

  return (
    <div className="card">
      <h2>Tantárgy-kvíz</h2>
      <p>{questions[index].q}</p>
      <input value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Írd be a választ" />
      <div className="nav" style={{marginTop:12}}>
        <button onClick={check}>Ellenőrzés</button>
        <button onClick={next}>Következő</button>
      </div>
      {message && <p className="message">{message}</p>}
    </div>
  )
}
