import { useState, useRef, useEffect, useCallback } from 'react'
import { SURAHS, SURAH_FAZILET } from '../data/quranSurahs'

const PROGRESS_KEY = 'quran-progress'
const CACHE_KEY    = 'quran-surah-cache'  // localStorage: sadece küçük sureler

function loadProg() { try { return JSON.parse(localStorage.getItem(PROGRESS_KEY)||'{}') } catch { return {} } }
function saveProg(p) { localStorage.setItem(PROGRESS_KEY, JSON.stringify(p)) }

function audioUrl(n) {
  return `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${n}.mp3`
}

// localStorage cache (küçük sureler — 50 ayetten az)
function loadSurahCache(n) {
  try {
    const raw = localStorage.getItem(`${CACHE_KEY}-${n}`)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}
function saveSurahCache(n, data) {
  try { localStorage.setItem(`${CACHE_KEY}-${n}`, JSON.stringify(data)) } catch {}
}

async function fetchSurah(n) {
  const cached = loadSurahCache(n)
  if (cached) return cached
  const res = await fetch(`/quran/${n}.json`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = await res.json()
  // Küçük sureler localStorage'a al (< 50 ayet)
  if (data.length < 50) saveSurahCache(n, data)
  return data
}

export default function QuranView({ onSubView }) {
  const [progress,   setProgress]   = useState(loadProg)
  const [search,     setSearch]     = useState('')
  const [cuz,        setCuz]        = useState(0)
  const [surah,      setSurah]      = useState(null)
  const [ayahs,      setAyahs]      = useState(null)
  const [loading,    setLoading]    = useState(false)
  const [error,      setError]      = useState(null)
  const [playing,    setPlaying]    = useState(false)
  const [stopped,    setStopped]    = useState(false)
  const [curIdx,     setCurIdx]     = useState(null)

  const audioRef   = useRef(new Audio())
  const playingRef = useRef(false)
  const resumeIdx  = useRef(0)
  const ayahRefs   = useRef({})

  useEffect(() => () => { audioRef.current.pause(); playingRef.current = false }, [])

  useEffect(() => {
    if (curIdx != null) ayahRefs.current[curIdx]?.scrollIntoView({ behavior:'smooth', block:'center' })
  }, [curIdx])

  const openSurah = async (s) => {
    audioRef.current.pause(); playingRef.current = false
    onSubView?.(true)
    setSurah(s); setAyahs(null); setLoading(true); setError(null)
    setPlaying(false); setStopped(false); setCurIdx(null); resumeIdx.current = 0
    try {
      const data = await fetchSurah(s.n)
      setAyahs(data)
    } catch (e) {
      setError('Sure yüklenemedi. Bağlantını kontrol et.')
    } finally {
      setLoading(false)
    }
  }

  const closeSurah = () => {
    audioRef.current.pause(); playingRef.current = false
    onSubView?.(false); setSurah(null); setAyahs(null)
    setPlaying(false); setStopped(false); setCurIdx(null)
  }

  const playOne = (url) => new Promise(resolve => {
    const a = audioRef.current
    a.src = url; a.onended = resolve; a.onerror = resolve
    a.play().catch(resolve)
  })

  const startPlayback = useCallback(async (fromIdx) => {
    if (!ayahs) return
    playingRef.current = true
    setPlaying(true); setStopped(false)

    // Preload için ikinci Audio nesnesi
    let preload = null

    for (let i = fromIdx; i < ayahs.length; i++) {
      if (!playingRef.current) { resumeIdx.current = i; break }
      setCurIdx(i); resumeIdx.current = i

      // Bir sonraki ayeti arka planda yüklemeye başla
      const next = ayahs[i + 1]
      if (next) {
        preload = new Audio()
        preload.preload = 'auto'
        preload.src = audioUrl(next.n)
      }

      await playOne(audioUrl(ayahs[i].n))
      if (!playingRef.current) { resumeIdx.current = i; break }
      // Gecikme yok — direkt devam
    }

    if (playingRef.current) {
      const p = { ...progress, [surah.n]: true }
      setProgress(p); saveProg(p); setCurIdx(null)
      setPlaying(false); setStopped(false)
    } else {
      setPlaying(false); setStopped(true)
    }
    playingRef.current = false
    preload = null
  }, [ayahs, surah, progress])

  const jumpTo = useCallback((i) => {
    playingRef.current = false; audioRef.current.pause()
    setPlaying(false); setStopped(false)
    setTimeout(() => startPlayback(i), 80)
  }, [startPlayback])

  const stopPlayback = () => {
    playingRef.current = false; audioRef.current.pause()
    setPlaying(false); setStopped(true)
  }

  // ── SURE DETAY ──────────────────────────────────────────────────────────
  if (surah) {
    const isListened = progress[surah.n]
    const pct = curIdx != null && ayahs ? ((curIdx+1)/ayahs.length)*100 : 0

    return (
      <div style={{ height:'100%', display:'flex', flexDirection:'column', overflow:'hidden' }}>

        <div style={{ background:'linear-gradient(135deg,#0f2040,#1a3560)', padding:'14px 16px', display:'flex', gap:10, alignItems:'center', flexShrink:0 }}>
          <button onClick={closeSurah} style={{ background:'rgba(255,255,255,0.12)', border:'none', color:'white', width:36, height:36, borderRadius:10, cursor:'pointer', fontSize:18, display:'flex', alignItems:'center', justifyContent:'center' }}>←</button>
          <div style={{ flex:1 }}>
            <div style={{ color:'rgba(255,255,255,0.45)', fontSize:11 }}>Sure {surah.n} · {surah.ayet} ayet · {surah.cüz}. cüz</div>
            <div style={{ color:'white', fontWeight:800, fontSize:16 }}>{surah.tr} — {surah.anlam}</div>
          </div>
          <div style={{ fontSize:24, color:'#e8c46a', unicodeBidi:'embed' }}>{surah.ar}</div>
        </div>

        <div style={{ background:'#0a1628', padding:'10px 16px', display:'flex', gap:12, alignItems:'center', flexShrink:0, borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
          {!playing ? (
            <button onClick={() => stopped ? startPlayback(resumeIdx.current) : startPlayback(0)}
              disabled={!ayahs}
              style={{ width:44, height:44, borderRadius:'50%', background:'linear-gradient(135deg,#c9972c,#e8c46a)', border:'none', color:'#0f2040', fontSize:20, cursor:'pointer', fontWeight:900, opacity:!ayahs?0.5:1, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 2px 12px rgba(201,151,44,0.35)' }}>▶</button>
          ) : (
            <button onClick={stopPlayback}
              style={{ width:44, height:44, borderRadius:'50%', background:'#dc2626', border:'none', color:'white', fontSize:18, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>⏹</button>
          )}
          <div style={{ flex:1 }}>
            {loading ? (
              <div style={{ color:'rgba(255,255,255,0.4)', fontSize:12 }}>⏳ Yükleniyor...</div>
            ) : playing && curIdx != null ? (
              <>
                <div style={{ color:'#c9972c', fontWeight:700, fontSize:12, marginBottom:4 }}>🎵 {curIdx+1}. ayet</div>
                <div style={{ background:'rgba(255,255,255,0.08)', borderRadius:100, height:3 }}>
                  <div style={{ height:'100%', background:'linear-gradient(90deg,#c9972c,#e8c46a)', borderRadius:100, width:`${pct}%`, transition:'width 0.4s' }}/>
                </div>
              </>
            ) : stopped ? (
              <div style={{ color:'rgba(255,255,255,0.45)', fontSize:12 }}>⏸ {resumeIdx.current+1}. ayetten devam</div>
            ) : (
              <div style={{ color:'rgba(255,255,255,0.35)', fontSize:12 }}>{isListened ? '✅ Tekrar dinle' : '▶ Başla · ya da ayete bas'}</div>
            )}
          </div>
          {curIdx != null && ayahs && <div style={{ color:'rgba(255,255,255,0.3)', fontSize:11 }}>{curIdx+1}/{ayahs.length}</div>}
        </div>

        <div className="scroll-y" style={{ flex:1, padding:'10px 12px 24px', display:'flex', flexDirection:'column', gap:8 }}>

          {error && <div style={{ background:'#fee2e2', border:'1px solid #f87171', borderRadius:12, padding:12, textAlign:'center', color:'#991b1b', fontSize:13 }}>{error}</div>}

          {loading && Array.from({length:4}).map((_,i) => (
            <div key={i} className="shimmer" style={{ height:80, borderRadius:14 }}/>
          ))}

          {SURAH_FAZILET[surah.n] && !loading && (
            <div style={{ background:'linear-gradient(135deg,#0f2040,#0a1628)', borderRadius:14, padding:'12px 14px', border:'1px solid rgba(201,151,44,0.2)' }}>
              <div style={{ color:'#c9972c', fontSize:11, fontWeight:700, marginBottom:3 }}>🌟 Fazileti</div>
              <div style={{ color:'rgba(255,255,255,0.75)', fontSize:12, lineHeight:1.6 }}>{SURAH_FAZILET[surah.n]}</div>
            </div>
          )}

          {ayahs && surah.n !== 9 && (
            <div style={{ textAlign:'center', padding:'6px 0 2px', fontSize:22, color:'#c9972c', opacity:0.8 }}>
              بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
            </div>
          )}

          {ayahs?.map((a, i) => {
            const isActive = curIdx === i
            const isPast   = curIdx != null && i < curIdx
            return (
              <div key={i} ref={el => { ayahRefs.current[i] = el }} onClick={() => jumpTo(i)}
                style={{
                  background:   isActive ? '#fdf6e3' : '#fff',
                  border:       `${isActive?2:1}px solid ${isActive?'#c9972c':'#e8e0d0'}`,
                  borderRadius: 14, padding:'12px 14px', cursor:'pointer',
                  opacity:      isPast ? 0.55 : 1, transition:'all 0.25s',
                  boxShadow:    isActive ? '0 4px 20px rgba(201,151,44,0.2)' : '0 1px 4px rgba(15,32,64,0.06)',
                  position:'relative',
                }}>

                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
                  <div style={{ width:26, height:26, borderRadius:'50%', background:isActive?'#c9972c':'#f8f5ef', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <span style={{ fontSize:11, fontWeight:800, color:isActive?'#fff':'#64748b' }}>{a.i}</span>
                  </div>
                  {isActive ? (
                    <div style={{ display:'flex', gap:3, alignItems:'center', height:18 }}>
                      {[0,1,2,3].map(j=><div key={j} style={{ width:3, borderRadius:3, background:'#c9972c', animation:`wave 0.7s ease-in-out ${j*0.12}s infinite alternate` }}/>)}
                    </div>
                  ) : <span style={{ fontSize:10, color:'#94a3b8' }}>▶</span>}
                </div>
                <div style={{ textAlign:'right', fontSize:22, color:'#1a1a2e', lineHeight:1.9, paddingTop:8 }}>
                  {a.t}
                </div>
              </div>
            )
          })}

          {isListened && !loading && (
            <div style={{ background:'#dcfce7', border:'1px solid #4ade80', borderRadius:14, padding:14, textAlign:'center' }}>
              <div style={{ fontSize:26, marginBottom:4 }}>✅</div>
              <div style={{ fontWeight:700, color:'#166534' }}>Tamamlandı!</div>
            </div>
          )}
          {!isListened && ayahs && !loading && (
            <button onClick={() => { const p={...progress,[surah.n]:true}; setProgress(p); saveProg(p) }}
              style={{ padding:12, background:'white', border:'1px solid #e8e0d0', borderRadius:14, cursor:'pointer', color:'#64748b', fontWeight:600, fontSize:13, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
              ✅ Dinledim olarak işaretle
            </button>
          )}
        </div>
        <style>{`@keyframes wave{from{height:5px}to{height:18px}}`}</style>
      </div>
    )
  }

  // ── LİSTE ───────────────────────────────────────────────────────────────
  const listenedCount = Object.keys(progress).filter(k=>progress[k]).length
  const filtered = SURAHS.filter(s => {
    const q = search.toLowerCase()
    const ok = !q || s.tr.toLowerCase().includes(q) || s.ar.includes(search) || String(s.n).includes(q)
    return ok && (!cuz || s.cüz === cuz)
  })

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', overflow:'hidden' }}>
      <div style={{ background:'linear-gradient(135deg,#0f2040,#1a3560)', padding:'14px 16px', flexShrink:0 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
          <div>
            <div style={{ color:'white', fontWeight:800, fontSize:17 }}>🎧 Kur'an-ı Kerim</div>
            <div style={{ color:'rgba(255,255,255,0.4)', fontSize:10 }}>v1.0</div>
          </div>
          <div style={{ background:'rgba(201,151,44,0.2)', border:'1px solid rgba(201,151,44,0.35)', borderRadius:12, padding:'5px 12px' }}>
            <span style={{ color:'#c9972c', fontWeight:800, fontSize:16 }}>{listenedCount}</span>
            <span style={{ color:'rgba(255,255,255,0.3)', fontSize:12 }}>/114</span>
          </div>
        </div>
        <div style={{ background:'rgba(255,255,255,0.08)', borderRadius:100, height:4, marginBottom:10 }}>
          <div style={{ height:'100%', background:'linear-gradient(90deg,#c9972c,#e8c46a)', borderRadius:100, width:`${(listenedCount/114)*100}%` }}/>
        </div>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Sure ara..."
          style={{ width:'100%', padding:'9px 14px', borderRadius:12, border:'none', fontSize:14, background:'rgba(255,255,255,0.1)', color:'white', outline:'none', boxSizing:'border-box', marginBottom:8, fontFamily:"'Plus Jakarta Sans',sans-serif" }}/>
        <div className="scroll-x" style={{ display:'flex', gap:6 }}>
          {[0,...Array.from({length:30},(_,i)=>i+1)].map(n=>(
            <button key={n} onClick={()=>setCuz(n)} style={{
              background:cuz===n?'#c9972c':'rgba(255,255,255,0.1)', color:cuz===n?'#0f2040':'rgba(255,255,255,0.7)',
              border:'none', borderRadius:20, padding:'4px 10px', cursor:'pointer', fontWeight:700, fontSize:11, whiteSpace:'nowrap', flexShrink:0
            }}>{n===0?'Tümü':`${n}. cüz`}</button>
          ))}
        </div>
      </div>

      <div className="scroll-y" style={{ flex:1, padding:'8px 12px 20px', display:'flex', flexDirection:'column', gap:7 }}>
        {filtered.map(s => {
          const done = progress[s.n]
          return (
            <button key={s.n} onClick={()=>openSurah(s)} style={{
              display:'flex', alignItems:'center', gap:12, padding:'11px 13px',
              background:'white', borderRadius:13, cursor:'pointer', textAlign:'left',
              border:`1px solid ${done?'#c9972c':'#e8e0d0'}`,
              borderLeft:`3px solid ${done?'#c9972c':'#e8e0d0'}`,
              boxShadow:'0 1px 4px rgba(15,32,64,0.06)', fontFamily:"'Plus Jakarta Sans',sans-serif"
            }}>
              <div style={{ width:36, height:36, borderRadius:9, background:done?'#fdf6e3':'#f8f5ef', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <span style={{ fontWeight:800, fontSize:12, color:done?'#c9972c':'#64748b' }}>{done?'✅':s.n}</span>
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                  <span style={{ fontWeight:800, color:'#0f2040', fontSize:14 }}>{s.tr}</span>
                  {SURAH_FAZILET[s.n] && <span style={{ fontSize:9, background:'#fdf6e3', color:'#c9972c', padding:'2px 5px', borderRadius:5, fontWeight:700, border:'1px solid rgba(201,151,44,0.3)' }}>★</span>}
                </div>
                <div style={{ fontSize:13, color:'#64748b', direction:'rtl', display:'inline-block', unicodeBidi:'embed' }}>{s.ar}</div>
                <div style={{ fontSize:11, color:'#94a3b8', marginTop:1 }}>{s.anlam} · {s.ayet} ayet · {s.cüz}. cüz</div>
              </div>
              <span style={{ color:'#94a3b8', fontSize:18 }}>›</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
