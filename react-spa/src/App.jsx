import { useState } from 'react'
import PointCalculator from './components/PointCalculator'
import SubjectQuiz from './components/SubjectQuiz'

export default function App() {
  const [page, setPage] = useState('calc')

  return (
    <div className="container">
      <h1>React SPA</h1>
      <p>Két külön mini alkalmazás egy oldalon belül.</p>

      <div className="nav">
	  <div className="buttons">
        <button onClick={() => setPage('calc')}>Pontkalkulátor</button>
        <button onClick={() => setPage('quiz')}>Tantárgy-kvíz</button>
	  </div>
		<a href="/">
			<button>Vissza a főoldalra</button>
		</a>
      </div>

      {page === 'calc' ? <PointCalculator /> : <SubjectQuiz />}
    </div>
  )
}
