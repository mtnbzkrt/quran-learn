import { useState } from 'react'
import Home from './components/Home'
import LessonView from './components/LessonView'

const KEY = 'quran-v2-progress'

export default function App() {
  const [progress, setProgress] = useState(()=>{
    try { return JSON.parse(localStorage.getItem(KEY)||'{}') } catch { return {} }
  })
  const [current, setCurrent] = useState(null)

  const complete = (id, stars) => {
    const u = {...progress, [id]:{done:true, stars}}
    setProgress(u)
    localStorage.setItem(KEY, JSON.stringify(u))
  }

  return (
    <div style={{height:'100%', display:'flex', flexDirection:'column', maxWidth:480, margin:'0 auto', background:'#fef9f0'}}>
      {current
        ? <LessonView lessonId={current} progress={progress} onComplete={complete} onBack={()=>setCurrent(null)}/>
        : <Home progress={progress} onLesson={setCurrent}/>
      }
    </div>
  )
}
