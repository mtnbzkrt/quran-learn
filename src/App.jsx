import { useState, useCallback } from 'react'
import { NurLogo } from './components/Logo'
import Dashboard   from './components/Dashboard'
import Home        from './components/Home'
import LessonView  from './components/LessonView'
import DhikrView   from './components/DhikrView'
import AsmaView    from './components/AsmaView'
import QuranView   from './components/QuranView'

const PROGRESS_KEY    = 'quran-v2-progress'
const STREAK_KEY      = 'quran-streak'
const DHIKR_STATS_KEY = 'dhikr-stats'

function loadStreak() { try { return JSON.parse(localStorage.getItem(STREAK_KEY)||'{}') } catch { return {} } }
function bumpStreak(cur) {
  const today = new Date().toISOString().slice(0,10)
  const yest  = new Date(Date.now()-86400000).toISOString().slice(0,10)
  const n = cur.lastDate===today ? (cur.current||1) : cur.lastDate===yest ? (cur.current||0)+1 : 1
  const s = { lastDate:today, current:n, max:Math.max(n, cur.max||0) }
  localStorage.setItem(STREAK_KEY, JSON.stringify(s)); return s
}

const TABS = [
  { id:'home',  emoji:'🏠', label:'Ana Sayfa',   sub:'Günlük özet ve namaz vakitleri' },
  { id:'learn', emoji:'📚', label:'Öğren',        sub:"Kur'an okumayı öğren" },
  { id:'dhikr', emoji:'📿', label:'Zikir',        sub:'Zikir ve tesbih' },
  { id:'asma',  emoji:'🌟', label:'Esmaül Hüsna', sub:"Allah'ın 99 güzel ismi" },
  { id:'quran', emoji:'🎧', label:'Kuran',        sub:'114 sure, sesli tilâvet' },
]

export default function App() {
  const [tab,      setTab]      = useState('home')
  const [drawer,   setDrawer]   = useState(false)
  const [lesson,   setLesson]   = useState(null)
  const [subView,  setSubView]  = useState(false)  // ← sub-view açık mı?

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

  // Tab değişince sub-view sıfırla
  const navigate = (id) => { setTab(id); setDrawer(false); setSubView(false) }

  const streakObj = { current: streak.current||0, max: streak.max||0 }

  // ── Ders ekranı (her şeyi kaplar) ──────────────────────────────────────
  if (lesson) {
    return (
      <div className="islamic-bg" style={{ height:'100%', maxWidth:480, margin:'0 auto' }}>
        <LessonView lessonId={lesson} progress={progress} onComplete={completeLesson} onBack={() => setLesson(null)}/>
      </div>
    )
  }

  const curTab = TABS.find(t => t.id === tab)
  const showHeader = !subView  // sub-view açıkken App header'ı gizle

  return (
    <div className="islamic-bg" style={{ height:'100%', maxWidth:480, margin:'0 auto', display:'flex', flexDirection:'column', position:'relative', overflow:'hidden' }}>

      {/* ── Üst Bar — sadece ana listede göster ──────────────────────────── */}
      {showHeader && (
        <header style={{
          background: 'linear-gradient(135deg, #0f2040 0%, #1a3560 100%)',
          padding: '0 16px', height: 64,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexShrink: 0, boxShadow: '0 2px 16px rgba(15,32,64,0.35)',
          zIndex: 10, position: 'relative',
        }}>
          <NurLogo size={34} showText light />

          <div style={{ position:'absolute', left:'50%', transform:'translateX(-50%)', textAlign:'center' }}>
            <div style={{ color:'white', fontWeight:700, fontSize:13, lineHeight:1.2 }}>{curTab?.label}</div>
            <div style={{ color:'rgba(255,255,255,0.4)', fontSize:10 }}>{curTab?.sub}</div>
          </div>

          <button onClick={() => setDrawer(true)} aria-label="Menü" style={{
            background:'rgba(255,255,255,0.12)', border:'1px solid rgba(255,255,255,0.18)',
            borderRadius:10, width:40, height:40,
            display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
            gap:5, cursor:'pointer', padding:0, flexShrink:0
          }}>
            {[0,1,2].map(i => <span key={i} style={{ display:'block', width:18, height:2, background:'#c9972c', borderRadius:2 }}/>)}
          </button>
        </header>
      )}

      {/* ── İçerik ───────────────────────────────────────────────────────── */}
      <main style={{ flex:1, overflow:'hidden', display:'flex', flexDirection:'column', minHeight:0 }}>
        {tab==='home'  && <Dashboard  progress={progress} streak={streakObj} quranProgress={quranProg} dhikrStats={dhikrStats}/>}
        {tab==='learn' && <Home       progress={progress} streak={streakObj} onLesson={setLesson}/>}
        {tab==='dhikr' && <DhikrView  onStatsChange={handleDhikrStats}  onSubView={setSubView}/>}
        {tab==='asma'  && <AsmaView   onSubView={setSubView}/>}
        {tab==='quran' && <QuranView  onSubView={setSubView}/>}
      </main>

      {/* ── Drawer ───────────────────────────────────────────────────────── */}
      {drawer && (
        <>
          <div className="drawer-overlay" onClick={() => setDrawer(false)}/>
          <aside className="drawer-panel" style={{
            background: 'linear-gradient(160deg, #0f2040 0%, #0a1628 100%)',
            display: 'flex', flexDirection: 'column',
            boxShadow: '4px 0 32px rgba(0,0,0,0.5)',
          }}>
            <div style={{ padding:'20px 20px 16px', borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
                <NurLogo size={32} showText light/>
                <button onClick={() => setDrawer(false)} style={{ background:'rgba(255,255,255,0.1)', border:'none', color:'rgba(255,255,255,0.7)', width:34, height:34, borderRadius:8, cursor:'pointer', fontSize:18, display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
              </div>
              <div style={{ display:'flex', gap:10 }}>
                {[
                  { icon:'🔥', val:`${streakObj.current}`, label:'gün seri' },
                  { icon:'⭐', val:`${Object.values(progress).reduce((s,p)=>s+(p.stars||0),0)}`, label:'yıldız' },
                ].map((s,i) => (
                  <div key={i} style={{ flex:1, background:'rgba(201,151,44,0.15)', border:'1px solid rgba(201,151,44,0.3)', borderRadius:10, padding:'8px 10px', textAlign:'center' }}>
                    <div style={{ fontSize:16 }}>{s.icon}</div>
                    <div style={{ color:'#fde68a', fontWeight:800, fontSize:15 }}>{s.val}</div>
                    <div style={{ color:'rgba(255,255,255,0.5)', fontSize:10 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <nav style={{ flex:1, padding:'12px', display:'flex', flexDirection:'column', gap:4 }}>
              {TABS.map(t => {
                const active = tab===t.id && !subView
                return (
                  <button key={t.id} onClick={() => navigate(t.id)} style={{
                    display:'flex', alignItems:'center', gap:14, padding:'14px 16px',
                    borderRadius:14, border:'none', cursor:'pointer',
                    background: active ? 'rgba(201,151,44,0.18)' : 'transparent',
                    borderLeft: active ? '3px solid #c9972c' : '3px solid transparent',
                    transition:'all 0.15s', textAlign:'left',
                    fontFamily:"'Plus Jakarta Sans', sans-serif",
                  }}>
                    <span style={{ fontSize:22, width:28, textAlign:'center' }}>{t.emoji}</span>
                    <div>
                      <div style={{ color: active?'#fde68a':'rgba(255,255,255,0.85)', fontWeight:active?800:600, fontSize:15 }}>{t.label}</div>
                      <div style={{ color:'rgba(255,255,255,0.35)', fontSize:11, marginTop:1 }}>{t.sub}</div>
                    </div>
                  </button>
                )
              })}
            </nav>

            <div style={{ padding:'16px 20px', borderTop:'1px solid rgba(255,255,255,0.08)', textAlign:'center' }}>
              <div style={{ fontFamily:"'Amiri', serif", fontSize:22, color:'rgba(201,151,44,0.45)', marginBottom:6, letterSpacing:4 }}>﷽</div>
              <div style={{ color:'rgba(255,255,255,0.2)', fontSize:10, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>نُور · Nûr App</div>
            </div>
          </aside>
        </>
      )}
    </div>
  )
}
