import { useState } from 'react'
import Home from './components/Home'
import LessonView from './components/LessonView'

const PROGRESS_KEY = 'quran-progress'

export default function App() {
  const [progress, setProgress] = useState(() => {
    try { return JSON.parse(localStorage.getItem(PROGRESS_KEY)||'{}') } catch { return {} }
  })
  const [current, setCurrent] = useState(null)
  const allIds = Array.from({length:38},(_,i)=>i+1)

  const complete = (id) => {
    const u = {...progress,[id]:true}
    setProgress(u)
    localStorage.setItem(PROGRESS_KEY,JSON.stringify(u))
  }
  const idx = allIds.indexOf(current)

  return (
    <div style={{height:'100%',display:'flex',flexDirection:'column',maxWidth:480,margin:'0 auto',background:'#f0f7f0'}}>
      {current
        ? <LessonView lessonId={current} progress={progress}
            onComplete={complete}
            onBack={()=>setCurrent(null)}
            onNext={()=>idx<allIds.length-1&&setCurrent(allIds[idx+1])}
            onPrev={()=>idx>0&&setCurrent(allIds[idx-1])}
          />
        : <Home progress={progress} onLesson={setCurrent}/>
      }
    </div>
  )
}
