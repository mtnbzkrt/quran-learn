import { useState, useEffect } from 'react'
import Dashboard from './components/Dashboard'
import Home from './components/Home'
import LessonView from './components/LessonView'
import DhikrView from './components/DhikrView'
import AsmaView from './components/AsmaView'
import QuranView from './components/QuranView'

const PROGRESS_KEY = 'quran-v2-progress'
const STREAK_KEY   = 'quran-streak'
const DHIKR_STATS_KEY = 'dhikr-stats'

function loadStreak() {
  try { return JSON.parse(localStorage.getItem(STREAK_KEY) || '{}') } catch { return {} }
}
function updateStreak(current) {
  const today = new Date().toISOString().slice(0, 10)
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
  const newCurrent = current.lastDate === today ? (current.current || 1)
    : current.lastDate === yesterday ? (current.current || 0) + 1 : 1
  const updated = { lastDate: today, current: newCurrent, max: Math.max(newCurrent, current.max || 0) }
  localStorage.setItem(STREAK_KEY, JSON.stringify(updated))
  return updated
}

const TABS = [
  { id:'home',   emoji:'🏠', label:'Ana Sayfa' },
  { id:'learn',  emoji:'📚', label:'Öğren' },
  { id:'dhikr',  emoji:'📿', label:'Zikir' },
  { id:'asma',   emoji:'🌟', label:'Esma' },
  { id:'quran',  emoji:'🎧', label:'Kuran' },
]

export default function App() {
  const [tab, setTab] = useState('home')
  const [progress, setProgress] = useState(() => {
    try { return JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}') } catch { return {} }
  })
  const [streak, setStreak] = useState(() => loadStreak())
  const [currentLesson, setCurrentLesson] = useState(null)
  const [dhikrStats, setDhikrStats] = useState(() => {
    try { return JSON.parse(localStorage.getItem(DHIKR_STATS_KEY) || '{}') } catch { return {} }
  })
  const [quranProgress, setQuranProgress] = useState(() => {
    try { return JSON.parse(localStorage.getItem('quran-progress') || '{}') } catch { return {} }
  })

  const completeLesson = (id, stars) => {
    const updated = { ...progress, [id]: { done: true, stars } }
    setProgress(updated)
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(updated))
    const newStreak = updateStreak(streak)
    setStreak(newStreak)
  }

  const handleDhikrStats = (stats) => {
    const merged = { ...dhikrStats, ...stats }
    setDhikrStats(merged)
    localStorage.setItem(DHIKR_STATS_KEY, JSON.stringify(merged))
  }

  // Quran progress dinle (QuranView kendi localStorage'a yazıyor, senkronize et)
  useEffect(() => {
    const sync = () => {
      try { setQuranProgress(JSON.parse(localStorage.getItem('quran-progress') || '{}')) } catch {}
    }
    window.addEventListener('storage', sync)
    return () => window.removeEventListener('storage', sync)
  }, [])

  const streakObj = { current: streak.current || 0, max: streak.max || 0 }

  // Ders ekranında bottom nav gizle
  if (currentLesson) {
    return (
      <div style={{ height:'100%', maxWidth:480, margin:'0 auto', background:'#fef9f0' }}>
        <LessonView lessonId={currentLesson} progress={progress} onComplete={completeLesson} onBack={() => setCurrentLesson(null)}/>
      </div>
    )
  }

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', maxWidth:480, margin:'0 auto', background:'#fef9f0', position:'relative' }}>
      {/* İçerik */}
      <div style={{ flex:1, overflow:'hidden', paddingBottom:60 }}>
        {tab === 'home'  && <Dashboard progress={progress} streak={streakObj} quranProgress={quranProgress} dhikrStats={dhikrStats}/>}
        {tab === 'learn' && <Home progress={progress} streak={streakObj} onLesson={setCurrentLesson}/>}
        {tab === 'dhikr' && <DhikrView onStatsChange={handleDhikrStats}/>}
        {tab === 'asma'  && <AsmaView/>}
        {tab === 'quran' && <QuranView/>}
      </div>

      {/* Bottom Navigation */}
      <div style={{
        position:'fixed', bottom:0, left:'50%', transform:'translateX(-50%)',
        width:'100%', maxWidth:480,
        background:'white', borderTop:'1px solid #e5e7eb',
        display:'flex', height:60,
        boxShadow:'0 -4px 16px rgba(0,0,0,0.08)',
        zIndex:50
      }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
            gap:2, border:'none', cursor:'pointer',
            background: tab === t.id ? '#f5f3ff' : 'white',
            borderTop: tab === t.id ? '2px solid #7c3aed' : '2px solid transparent',
            transition:'all 0.15s'
          }}>
            <span style={{ fontSize:18 }}>{t.emoji}</span>
            <span style={{ fontSize:10, fontWeight: tab === t.id ? 800 : 600, color: tab === t.id ? '#7c3aed' : '#6b7280' }}>
              {t.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
