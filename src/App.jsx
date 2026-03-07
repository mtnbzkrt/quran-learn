import { useState, useEffect } from 'react'
import Home from './components/Home'
import LessonView from './components/LessonView'

const PROGRESS_KEY = 'quran-progress'

export default function App() {
  const [progress, setProgress] = useState(() => {
    try { return JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}') } catch { return {} }
  })
  const [currentLesson, setCurrentLesson] = useState(null)
  const allIds = Array.from({length:38},(_,i)=>i+1)

  const saveProgress = (updated) => {
    setProgress(updated)
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(updated))
  }

  const complete = (id) => {
    const updated = {...progress, [id]: true}
    saveProgress(updated)
  }

  const goLesson = (id) => setCurrentLesson(id)
  const goBack = () => setCurrentLesson(null)
  const goNext = () => { const i = allIds.indexOf(currentLesson); if (i < allIds.length-1) setCurrentLesson(allIds[i+1]) }
  const goPrev = () => { const i = allIds.indexOf(currentLesson); if (i > 0) setCurrentLesson(allIds[i-1]) }

  return (
    <div style={{minHeight:'100vh', backgroundColor:'#f0f7f0'}}>
      {currentLesson ? (
        <LessonView
          lessonId={currentLesson} progress={progress}
          onComplete={complete} onBack={goBack} onNext={goNext} onPrev={goPrev}
        />
      ) : (
        <Home progress={progress} onLesson={goLesson}/>
      )}
    </div>
  )
}
