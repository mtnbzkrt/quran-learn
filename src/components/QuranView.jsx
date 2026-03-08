import { useState, useRef, useEffect } from 'react'
import { SURAHS, getAudioUrl, SURAH_FAZILET } from '../data/quranSurahs'

const STORAGE_KEY = 'quran-progress'
function loadProgress() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}') } catch { return {} } }
function saveProgress(p) { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)) }

export default function QuranView() {
  const [progress, setProgress] = useState(loadProgress)
  const [playing, setPlaying] = useState(null)
  const [search, setSearch] = useState('')
  const [cuz, setCuz] = useState(0) // 0 = hepsi
  const [detail, setDetail] = useState(null)
  const [audioState, setAudioState] = useState('idle') // idle|loading|playing|paused
  const audioRef = useRef(new Audio())

  const markListened = (n) => {
    const p = { ...progress, [n]: true }
    setProgress(p); saveProgress(p)
  }

  const playStop = (n) => {
    const audio = audioRef.current
    if (playing === n) {
      audio.pause(); setPlaying(null); setAudioState('idle')
    } else {
      audio.pause()
      setAudioState('loading')
      audio.src = getAudioUrl(n)
      audio.play()
        .then(() => { setPlaying(n); setAudioState('playing') })
        .catch(() => setAudioState('idle'))
    }
  }

  useEffect(() => {
    const audio = audioRef.current
    const onEnd = () => {
      if (playing) { markListened(playing) }
      setPlaying(null); setAudioState('idle')
    }
    audio.addEventListener('ended', onEnd)
    return () => audio.removeEventListener('ended', onEnd)
  }, [playing])

  // Cleanup on unmount
  useEffect(() => () => { audioRef.current.pause() }, [])

  const listenedCount = Object.keys(progress).filter(k => progress[k]).length
  const filtered = SURAHS.filter(s => {
    const matchSearch = !search || s.tr.toLowerCase().includes(search.toLowerCase()) || s.ar.includes(search) || String(s.n).includes(search)
    const matchCuz = !cuz || s.cüz === cuz
    return matchSearch && matchCuz
  })

  if (detail) {
    const s = detail
    const isListened = progress[s.n]
    const isPlaying = playing === s.n
    return (
      <div style={{ height:'100%', display:'flex', flexDirection:'column', overflow:'hidden' }}>
        <div style={{ background:'linear-gradient(135deg,#0f172a,#1e293b)', padding:'14px 16px', display:'flex', gap:10, alignItems:'center', flexShrink:0 }}>
          <button onClick={() => setDetail(null)} style={{ background:'rgba(255,255,255,0.15)', border:'none', color:'white', width:36, height:36, borderRadius:10, cursor:'pointer', fontSize:16 }}>←</button>
          <div style={{ flex:1 }}>
            <div style={{ color:'rgba(255,255,255,0.6)', fontSize:11 }}>Sure {s.n} · Cüz {s.cüz}</div>
            <div style={{ color:'white', fontWeight:800, fontSize:16 }}>{s.tr}</div>
          </div>
          {isListened && <div style={{ fontSize:20 }}>✅</div>}
        </div>
        <div style={{ flex:1, overflowY:'auto', padding:'16px 14px', display:'flex', flexDirection:'column', gap:12 }}>
          <div style={{ background:'linear-gradient(135deg,#0f172a,#1e293b)', borderRadius:20, padding:'24px', textAlign:'center' }}>
            <div style={{ fontFamily:'Amiri, serif', fontSize:52, color:'#fbbf24', direction:'rtl', lineHeight:1.4, marginBottom:8 }}>{s.ar}</div>
            <div style={{ color:'#94a3b8', fontSize:14, fontWeight:600 }}>{s.tr} — {s.anlam}</div>
            <div style={{ color:'#64748b', fontSize:12, marginTop:4 }}>{s.ayet} ayet · {s.cüz}. cüz</div>
          </div>

          {SURAH_FAZILET[s.n] && (
            <div style={{ background:'#fff7ed', borderRadius:14, padding:'14px', border:'2px solid #fed7aa' }}>
              <div style={{ fontWeight:800, color:'#ea580c', fontSize:13, marginBottom:4 }}>🌟 Fazileti</div>
              <div style={{ color:'#374151', fontSize:13, lineHeight:1.6 }}>{SURAH_FAZILET[s.n]}</div>
            </div>
          )}

          <div style={{ background:'white', borderRadius:14, padding:'14px', border:'1px solid #e5e7eb' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div>
                <div style={{ fontWeight:700, color:'#1e1b4b', fontSize:13 }}>Dinlenme Durumu</div>
                <div style={{ color: isListened ? '#16a34a' : '#9ca3af', fontSize:13 }}>{isListened ? '✅ Dinlendi' : '⏳ Henüz dinlenmedi'}</div>
              </div>
              {!isListened && (
                <button onClick={() => markListened(s.n)} style={{ background:'#f0fdf4', border:'2px solid #4ade80', color:'#16a34a', padding:'8px 14px', borderRadius:10, cursor:'pointer', fontWeight:700, fontSize:12 }}>
                  ✅ Dinledim
                </button>
              )}
            </div>
          </div>

          {/* Audio player */}
          <div style={{ background:'linear-gradient(135deg,#0f172a,#1e293b)', borderRadius:16, padding:'16px', display:'flex', gap:14, alignItems:'center' }}>
            <button onClick={() => playStop(s.n)} style={{
              width:60, height:60, borderRadius:'50%',
              background: isPlaying ? '#ef4444' : '#fbbf24',
              border:'none', color: isPlaying ? 'white' : '#0f172a',
              fontSize:22, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
              boxShadow:`0 4px 16px ${isPlaying ? '#ef444488' : '#fbbf2488'}`
            }}>
              {audioState === 'loading' ? '⏳' : isPlaying ? '⏹' : '▶'}
            </button>
            <div>
              <div style={{ color:'white', fontWeight:800, fontSize:14 }}>{s.tr} Suresi</div>
              <div style={{ color:'#94a3b8', fontSize:12 }}>Mishari Reşid el-Afâsi · {s.ayet} ayet</div>
              {isPlaying && <div style={{ color:'#4ade80', fontSize:12, marginTop:2 }}>🎵 Çalıyor...</div>}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Cüz listesi (1-30)
  const CUZLER = [0,...Array.from({length:30},(_,i)=>i+1)]

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', overflow:'hidden' }}>
      {/* Header */}
      <div style={{ background:'linear-gradient(135deg,#0f172a,#1e293b)', padding:'14px 16px', flexShrink:0 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
          <div style={{ color:'white', fontWeight:800, fontSize:18 }}>🎧 Kur\'an-ı Kerim</div>
          <div style={{ background:'rgba(255,255,255,0.1)', borderRadius:12, padding:'6px 12px', textAlign:'center' }}>
            <div style={{ color:'#fbbf24', fontWeight:800, fontSize:16 }}>{listenedCount}</div>
            <div style={{ color:'rgba(255,255,255,0.6)', fontSize:10 }}>/ 114 sure</div>
          </div>
        </div>

        {/* İlerleme */}
        <div style={{ background:'rgba(255,255,255,0.1)', borderRadius:100, height:6, marginBottom:10 }}>
          <div style={{ height:'100%', background:'#fbbf24', borderRadius:100, width:`${(listenedCount/114)*100}%`, transition:'width 0.5s', minWidth: listenedCount > 0 ? 6 : 0 }}/>
        </div>

        {/* Arama */}
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder='Sure ara...'
          style={{ width:'100%', padding:'10px 14px', borderRadius:12, border:'none', fontSize:14, background:'rgba(255,255,255,0.1)', color:'white', outline:'none', boxSizing:'border-box', marginBottom:8 }}/>

        {/* Cüz filtresi */}
        <div style={{ display:'flex', gap:6, overflowX:'auto', paddingBottom:2 }}>
          {CUZLER.map(n => (
            <button key={n} onClick={() => setCuz(n)} style={{
              background: cuz === n ? '#fbbf24' : 'rgba(255,255,255,0.15)',
              color: cuz === n ? '#0f172a' : 'white',
              border:'none', borderRadius:20, padding:'5px 10px',
              cursor:'pointer', fontWeight:700, fontSize:11, whiteSpace:'nowrap', flexShrink:0
            }}>{n === 0 ? 'Tümü' : `${n}. cüz`}</button>
          ))}
        </div>
      </div>

      {/* Sure listesi */}
      <div style={{ flex:1, overflowY:'auto', padding:'8px 14px 20px', display:'flex', flexDirection:'column', gap:8 }}>
        {filtered.map(s => {
          const isListened = progress[s.n]
          const isPlaying = playing === s.n
          const hasFazilet = !!SURAH_FAZILET[s.n]
          return (
            <button key={s.n} onClick={() => setDetail(s)} style={{
              display:'flex', alignItems:'center', gap:12, padding:'12px 14px',
              background:'white', border:`1px solid ${isListened ? '#bbf7d0' : '#e5e7eb'}`,
              borderRadius:14, cursor:'pointer', textAlign:'left',
              boxShadow:'0 1px 4px rgba(0,0,0,0.06)',
              borderLeft:`4px solid ${isListened ? '#16a34a' : isPlaying ? '#fbbf24' : '#e5e7eb'}`
            }}>
              <div style={{ width:38, height:38, borderRadius:10, background: isListened ? '#dcfce7' : isPlaying ? '#fef9c3' : '#f3f4f6', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <span style={{ fontWeight:800, fontSize:13, color: isListened ? '#16a34a' : isPlaying ? '#b45309' : '#6b7280' }}>
                  {isListened ? '✅' : isPlaying ? '🎵' : s.n}
                </span>
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                  <span style={{ fontWeight:800, color:'#1e1b4b', fontSize:14 }}>{s.tr}</span>
                  {hasFazilet && <span style={{ fontSize:10, background:'#fff7ed', color:'#ea580c', padding:'2px 6px', borderRadius:6, fontWeight:700 }}>Faziletli</span>}
                </div>
                <div style={{ fontFamily:'Amiri, serif', fontSize:14, color:'#6b7280', direction:'rtl', display:'inline-block' }}>{s.ar}</div>
                <div style={{ fontSize:11, color:'#9ca3af' }}>{s.anlam} · {s.ayet} ayet</div>
              </div>
              <div style={{ fontSize:18, flexShrink:0 }}>›</div>
            </button>
          )
        })}
      </div>

      {/* Şu an çalan */}
      {playing && audioState === 'playing' && (
        <div style={{ background:'linear-gradient(135deg,#0f172a,#1e293b)', padding:'12px 16px', display:'flex', gap:12, alignItems:'center', borderTop:'1px solid rgba(255,255,255,0.1)', flexShrink:0 }}>
          <div style={{ flex:1 }}>
            <div style={{ color:'#4ade80', fontSize:11, fontWeight:700 }}>🎵 Çalıyor</div>
            <div style={{ color:'white', fontWeight:800, fontSize:14 }}>{SURAHS.find(s=>s.n===playing)?.tr} Suresi</div>
          </div>
          <button onClick={() => { audioRef.current.pause(); setPlaying(null); setAudioState('idle') }}
            style={{ background:'#ef4444', border:'none', color:'white', borderRadius:10, padding:'8px 16px', cursor:'pointer', fontWeight:700, fontSize:13 }}>
            ⏹ Durdur
          </button>
        </div>
      )}
    </div>
  )
}
