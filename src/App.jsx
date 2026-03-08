import { useState, useEffect } from 'react'
import Home from './components/Home'
import LessonView from './components/LessonView'

const PROGRESS_KEY = 'quran-v2-progress'
const STREAK_KEY   = 'quran-streak'

function loadStreak() {
  try { return JSON.parse(localStorage.getItem(STREAK_KEY) || '{}') } catch { return {} }
}

function updateStreak(current) {
  const today = new Date().toISOString().slice(0, 10)
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
  const newCurrent = current.lastDate === today
    ? current.current || 1
    : current.lastDate === yesterday
      ? (current.current || 0) + 1
      : 1
  const newStreak = {
    lastDate: today,
    current: newCurrent,
    max: Math.max(newCurrent, current.max || 0),
  }
  localStorage.setItem(STREAK_KEY, JSON.stringify(newStreak))
  return newStreak
}

export default function App() {
  const [progress, setProgress] = useState(() => {
    try { return JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}') } catch { return {} }
  })
  const [streak, setStreak] = useState(() => loadStreak())
  const [current, setCurrent] = useState(null)

  const complete = (id, stars) => {
    const updated = { ...progress, [id]: { done: true, stars } }
    setProgress(updated)
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(updated))
    // Streak güncelle
    const newStreak = updateStreak(streak)
    setStreak(newStreak)
  }

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', maxWidth:480, margin:'0 auto', background:'#fef9f0' }}>
      {current
        ? <LessonView lessonId={current} progress={progress} onComplete={complete} onBack={() => setCurrent(null)}/>
        : <Home progress={progress} streak={{ current: streak.current || 0, max: streak.max || 0 }} onLesson={setCurrent}/>
      }
    </div>
  )
}
