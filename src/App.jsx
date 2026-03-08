import { useState, useEffect, useCallback } from 'react'
import { NurLogo, NurIcon } from './components/Logo'
import Dashboard   from './components/Dashboard'
import Home        from './components/Home'
import LessonView  from './components/LessonView'
import DhikrView   from './components/DhikrView'
import AsmaView    from './components/AsmaView'
import QuranView   from './components/QuranView'

const PROGRESS_KEY   = 'quran-v2-progress'
const STREAK_KEY     = 'quran-streak'
const DHIKR_STATS_KEY = 'dhikr-stats'

function loadStreak() {
  try { return JSON.parse(localStorage.getItem(STREAK_KEY) || '{}') } catch { return {} }
}
function saveStreak(s) { localStorage.setItem(STREAK_KEY, JSON.stringify(s)) }
function bumpStreak(cur) {
  const today = new Date().toISOString().slice(0,10)
  const yest  = new Date(Date.now()-86400000).toISOString().slice(0,10)
  const n = cur.lastDate === today ? (cur.current||1)
          : cur.lastDate === yest  ? (cur.current||0)+1
          : 1
  const s = { lastDate:today, current:n, max:Math.max(n, cur.max||0) }
  saveStreak(s); return s
}

const TABS = [
  { id:'home',  emoji:'🏠', label:'Ana Sayfa'   },
  { id:'learn', emoji:'📚', label:'Öğren'        },
  { id:'dhikr', emoji:'📿', label:'Zikir'        },
  { id:'asma',  emoji:'🌟', label:'Esmaül Hüsna' },
  { id:'quran', emoji:'🎧', label:'Kuran'        },
]

const TAB_SUBTITLES = {
  home:  'Günlük özet ve namaz vakitleri',
  learn: "Kur'an okumayı öğren",
  dhikr: 'Zikir ve tesbih',
  asma:  "Allah'ın 99 güzel ismi",
  quran: '114 sure, sesli tilâvet',
}

export default function App() {
  const [tab,    setTab]    = useState('home')
  const [drawer, setDrawer] = useState(false)
  const [lesson, setLesson] = useState(null)   // aktif ders

  const [progress, setProgress] = useState(() => {
    try { return JSON.parse(localStorage.getItem(PROGRESS_KEY)||'{}') } catch { return {} }
  })
  const [streak, setStreak] = useState(loadStreak)
  const [dhikrStats, setDhikrStats] = useState(() => {
    try { return JSON.parse(localStorage.getItem(DHIKR_STATS_KEY)||'{}') } catch { return {} }
  })
  const [quranProg, setQuranProg] = useState(() => {
    try { return JSON.parse(localStorage.getItem('quran-progress')||'{}') } catch { return {} }
  })

  const completeLesson = useCallback((id, stars) => {
    const u = { ...progress, [id]:{ done:true, stars } }
    setProgress(u); localStorage.setItem(PROGRESS_KEY, JSON.stringify(u))
    setStreak(bumpStreak(streak))
  }, [progress, streak])

  const handleDhikrStats = useCallback((s) => {
    const m = { ...dhikrStats, ...s }
    setDhikrStats(m); localStorage.setItem(DHIKR_STATS_KEY, JSON.stringify(m))
  }, [dhikrStats])

  // Ders görünümünde geri tuşu
  useEffect(() => {
    const onBack = (e) => { if (lesson) { e.preventDefault(); setLesson(null) } }
    window.addEventListener('popstate', onBack)
    return () => window.removeEventListener('popstate', onBack)
  }, [lesson])

  const streakObj = { current: streak.current||0, max: streak.max||0 }

  const navigate = (id) => { setTab(id); setDrawer(false) }

  // ─── Ders ekranı (tüm sayfayı kaplar) ───────────────────────────────────
  if (lesson) {
    return (
      <div className="islamic-bg" style={{ height:'100%', maxWidth:480, margin:'0 auto' }}>
        <LessonView lessonId={lesson} progress={progress} onComplete={completeLesson} onBack={() => setLesson(null)}/>
      </div>
    )
  }

  const curTab = TABS.find(t => t.id === tab)

  return (
    <div className="islamic-bg" style={{ height:'100%', maxWidth:480, margin:'0 auto', display:'flex', flexDirection:'column', position:'relative', overflow:'hidden' }}>

      {/* ── Üst Bar ──────────────────────────────────────────────────────── */}
      <header style={{
        background: `linear-gradient(135deg, var(--navy) 0%, var(--navy-mid) 100%)`,
        padding: '0 16px',
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
        boxShadow: '0 2px 16px rgba(15,32,64,0.35)',
        zIndex: 10,
        position: 'relative',
      }}>
        {/* Logo */}
        <NurLogo size={34} showText light />

        {/* Sayfa başlığı */}
        <div style={{ position:'absolute', left:'50%', transform:'translateX(-50%)', textAlign:'center' }}>
          <div style={{ color:'white', fontWeight:700, fontSize:13, lineHeight:1.2 }}>{curTab?.label}</div>
          <div style={{ color:'rgba(255,255,255,0.45)', fontSize:10 }}>{TAB_SUBTITLES[tab]}</div>
        </div>

        {/* Hamburger */}
        <button
          onClick={() => setDrawer(true)}
          aria-label="Menü"
          style={{ background:'rgba(255,255,255,0.12)', border:'1px solid rgba(255,255,255,0.18)', borderRadius:10, width:40, height:40, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:5, cursor:'pointer', padding:0 }}
        >
          {[0,1,2].map(i => (
            <span key={i} style={{ display:'block', width:18, height:2, background:'#c9972c', borderRadius:2, transition:'all 0.2s' }}/>
          ))}
        </button>
      </header>

      {/* ── İçerik ───────────────────────────────────────────────────────── */}
      <main style={{ flex:1, overflow:'hidden', display:'flex', flexDirection:'column' }}>
        {tab === 'home'  && <Dashboard progress={progress} streak={streakObj} quranProgress={quranProg} dhikrStats={dhikrStats}/>}
        {tab === 'learn' && <Home progress={progress} streak={streakObj} onLesson={setLesson}/>}
        {tab === 'dhikr' && <DhikrView onStatsChange={handleDhikrStats}/>}
        {tab === 'asma'  && <AsmaView/>}
        {tab === 'quran' && <QuranView/>}
      </main>

      {/* ── Drawer Overlay ───────────────────────────────────────────────── */}
      {drawer && (
        <>
          <div className="drawer-overlay" onClick={() => setDrawer(false)}/>
          <aside className="drawer-panel" style={{
            background: `linear-gradient(160deg, var(--navy) 0%, #0a1628 100%)`,
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '4px 0 32px rgba(0,0,0,0.5)',
          }}>
            {/* Drawer header */}
            <div style={{ padding:'20px 20px 16px', borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
                <NurLogo size={32} showText light/>
                <button onClick={() => setDrawer(false)} style={{ background:'rgba(255,255,255,0.1)', border:'none', color:'rgba(255,255,255,0.7)', width:34, height:34, borderRadius:8, cursor:'pointer', fontSize:18, display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
              </div>
              {/* Streak özeti */}
              <div style={{ display:'flex', gap:10 }}>
                <div style={{ flex:1, background:'rgba(201,151,44,0.15)', border:'1px solid rgba(201,151,44,0.3)', borderRadius:10, padding:'8px 10px', textAlign:'center' }}>
                  <div style={{ fontSize:16 }}>🔥</div>
                  <div style={{ color:'#fde68a', fontWeight:800, fontSize:15 }}>{streakObj.current}</div>
                  <div style={{ color:'rgba(255,255,255,0.5)', fontSize:10 }}>gün seri</div>
                </div>
                <div style={{ flex:1, background:'rgba(201,151,44,0.15)', border:'1px solid rgba(201,151,44,0.3)', borderRadius:10, padding:'8px 10px', textAlign:'center' }}>
                  <div style={{ fontSize:16 }}>⭐</div>
                  <div style={{ color:'#fde68a', fontWeight:800, fontSize:15 }}>
                    {Object.values(progress).reduce((s,p)=>s+(p.stars||0),0)}
                  </div>
                  <div style={{ color:'rgba(255,255,255,0.5)', fontSize:10 }}>yıldız</div>
                </div>
              </div>
            </div>

            {/* Menü linkleri */}
            <nav style={{ flex:1, padding:'12px 12px', display:'flex', flexDirection:'column', gap:4 }}>
              {TABS.map(t => {
                const active = tab === t.id
                return (
                  <button key={t.id} onClick={() => navigate(t.id)} style={{
                    display:'flex', alignItems:'center', gap:14,
                    padding:'14px 16px', borderRadius:14, border:'none', cursor:'pointer',
                    background: active ? 'rgba(201,151,44,0.18)' : 'transparent',
                    borderLeft: active ? '3px solid #c9972c' : '3px solid transparent',
                    transition: 'all 0.15s',
                    textAlign: 'left',
                  }}>
                    <span style={{ fontSize:22, width:28, textAlign:'center' }}>{t.emoji}</span>
                    <div>
                      <div style={{ color: active ? '#fde68a' : 'rgba(255,255,255,0.85)', fontWeight: active ? 800 : 600, fontSize:15 }}>{t.label}</div>
                      <div style={{ color:'rgba(255,255,255,0.35)', fontSize:11, marginTop:1 }}>{TAB_SUBTITLES[t.id]}</div>
                    </div>
                  </button>
                )
              })}
            </nav>

            {/* Drawer footer */}
            <div style={{ padding:'16px 20px', borderTop:'1px solid rgba(255,255,255,0.08)', textAlign:'center' }}>
              {/* İslami geometrik süsleme */}
              <div style={{ fontFamily:'var(--font-arabic)', fontSize:20, color:'rgba(201,151,44,0.5)', marginBottom:6, letterSpacing:4 }}>
                ﷽
              </div>
              <div style={{ color:'rgba(255,255,255,0.25)', fontSize:10 }}>نُور · Nûr App</div>
            </div>
          </aside>
        </>
      )}
    </div>
  )
}
