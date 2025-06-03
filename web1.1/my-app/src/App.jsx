import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [name, setName] = useState('')
  const [seconds, setSeconds] = useState(10)
  const [timerActive, setTimerActive] = useState(false)
  const [finished, setFinished] = useState(false)
  const [randomPhrase, setRandomPhrase] = useState('')

  const phrases = [
    'Ты красавчик',
    'Ты молодец',
    'Ты супер',
    'Ты гений',
    'Ты чемпион'
  ]

  useEffect(() => {
    let timer
    if (timerActive && seconds > 0) {
      timer = setInterval(() => setSeconds(s => s - 1), 1000)
    }
    if (seconds === 0 && timerActive) {
      setTimerActive(false)
      setFinished(true)
      const phrase = phrases[Math.floor(Math.random() * phrases.length)]
      setRandomPhrase(phrase)
    }

    
      
    return () => clearInterval(timer)
  }, [timerActive, seconds])

  const handleStart = () => {
    setTimerActive(true)
    setFinished(false)
    setRandomPhrase('')
  }

  const handleReset = () => {
    setName('')
    setSeconds(10)
    setTimerActive(false)
    setFinished(false)
    setRandomPhrase('')
  }

  return (
    <div className="App">
      <label>
        Имя:
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          disabled={timerActive}
        />
      </label>
      <br />
      {!timerActive && !finished && (
        <button onClick={handleStart} disabled={!name}>
          Старт таймера
        </button>
      )}
      {timerActive && <div>{name}, Осталось: {seconds} сек.</div>}
      {finished && (
        <div>
          {randomPhrase}, {name} 💪
          <br />
          <button onClick={() => {
            setSeconds(10)
            setTimerActive(true)
            setFinished(false)
            setRandomPhrase('')
          }}>
            Попробовать ещё раз
          </button>
        </div>
      )}
      <br />
      <button onClick={handleReset}>Сброс</button>
    </div>
  )
}

export default App