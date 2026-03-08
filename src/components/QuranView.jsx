import { useState, useRef, useEffect, useCallback } from 'react'
import { SURAHS, SURAH_FAZILET } from '../data/quranSurahs'

const PROGRESS_KEY = 'quran-progress'
const CACHE_KEY    = 'quran-ayah-cache-v3'

function loadProgress() { try { return JSON.parse(localStorage.getItem(PROGRESS_KEY)||'{}') } catch { return {} } }
function saveProgress(p) { localStorage.setItem(PROGRESS_KEY, JSON.stringify(p)) }
function loadCache()    { try { return JSON.parse(localStorage.getItem(CACHE_KEY)||'{}') }   catch { return {} } }
function saveCache(c)   { try { localStorage.setItem(CACHE_KEY, JSON.stringify(c)) } catch {} }

// ─── Yardımcılar ────────────────────────────────────────────────────────────

// Lokal veri haritası: surah no → {ayahs: [{ar, meaning, tr}], verseStart}
const LOCAL_SURAH_MAP = {
  1:   { key:'fatiha',  verseStart:1    },
  112: { key:'ihlas',   verseStart:6222 },
  114: { key:'nas',     verseStart:6231 },
}

function getLocalAyahs(surahN) {
  const entry = LOCAL_SURAH_MAP[surahN]
  if (!entry) return null
  const sura = SURAS.find(s => s.key === entry.key)
  if (!sura) return null
  return sura.ayahs.map((a, i) => ({
    number:        entry.verseStart + i,
    numberInSurah: i + 1,
    text:          a.ar,
  }))
}

async function fetchAyahs(surahNum) {
  const cache = loadCache()
  if (cache[surahNum]?.length > 0 && cache[surahNum][0]?.text) return cache[surahNum]

  const res  = await fetch(`https://api.alquran.cloud/v1/surah/${surahNum}/quran-uthmani`)
  if (!res.ok) throw new Error('API error: ' + res.status)
  const json = await res.json()

  // Güvenli erişim — API yapısı kontrol
  const ayahList = json?.data?.ayahs
  if (!Array.isArray(ayahList) || ayahList.length === 0) throw new Error('Geçersiz API yanıtı')

  const ayahData = ayahList.map(a => ({
    number:        a.number,
    numberInSurah: a.numberInSurah,
    text:          a.text || '',
  }))
  saveCache({ ...cache, [surahNum]: ayahData })
  return ayahData
}

function audioUrl(globalNum) {
  return `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${globalNum}.mp3`
}

// ─── Ana Bileşen ─────────────────────────────────────────────────────────────
export default function QuranView({ onSubView }) {
  const [progress, setProgress]     = useState(loadProgress)
  const [search,   setSearch]       = useState('')
  const [cuz,      setCuz]          = useState(0)
  const [surah,    setSurah]        = useState(null)   // açık sure
  const [ayahs,    setAyahs]        = useState(null)   // yüklü ayetler
  const [loading,  setLoading]      = useState(false)
  const [playing,  setPlaying]      = useState(false)
  const [stopped,  setStopped]      = useState(false)
  const [curIdx,   setCurIdx]       = useState(null)   // aktif ayet indexi
  const [error,    setError]        = useState(null)

  const audioRef    = useRef(new Audio())
  const playingRef  = useRef(false)
  const resumeIdxRef= useRef(0)
  const ayahRefs    = useRef({})

  // Temizle
  useEffect(() => () => { audioRef.current.pause(); playingRef.current = false }, [])

  // Aktif ayete scroll
  useEffect(() => {
    if (curIdx != null) {
      const el = ayahRefs.current[curIdx]
      el?.scrollIntoView({ behavior:'smooth', block:'center' })
    }
  }, [curIdx])

  // ── Sure aç ──────────────────────────────────────────────────────────────
  const openSurah = async (s) => {
    audioRef.current.pause(); playingRef.current = false
    onSubView?.(true)
    setSurah(s); setAyahs(null); setLoading(true)
    setCurIdx(null); setPlaying(false); setStopped(false)
    resumeIdxRef.current = 0; setError(null)

    // Önce lokal veriye bak (Fatiha, İhlâs, Nâs)
    const localAyahs = getLocalAyahs(s.n)
    if (localAyahs) {
      setAyahs(localAyahs)
      setLoading(false)
      return
    }

    // Yoksa API'den çek
    try {
      const data = await fetchAyahs(s.n)
      setAyahs(data)
    } catch {
      setError('Ayetler yüklenemedi. İnternet bağlantısını kontrol et.')
    } finally { setLoading(false) }
  }

  // ── Tek ayet çal ─────────────────────────────────────────────────────────
  const playOne = (url) => new Promise(resolve => {
    const a = audioRef.current
    a.src = url
    a.onended  = resolve
    a.onerror  = resolve   // hata olursa geç
    a.play().catch(resolve)
  })

  // ── Sıralı oynatma ───────────────────────────────────────────────────────
  const startPlayback = useCallback(async (fromIdx = 0) => {
    if (!ayahs) return
    playingRef.current = true
    setPlaying(true); setStopped(false)
    resumeIdxRef.current = fromIdx

    // Bismillah sesi (sure 1'in 1. ayeti = global 1)
    if (fromIdx === 0 && surah?.n !== 1 && surah?.n !== 9) {
      // Bismillah ekranı göster ama seste ayete git
    }

    for (let i = fromIdx; i < ayahs.length; i++) {
      if (!playingRef.current) { resumeIdxRef.current = i; break }
      setCurIdx(i)
      resumeIdxRef.current = i
      await playOne(audioUrl(ayahs[i].number))
      if (!playingRef.current) { resumeIdxRef.current = i; break }
      await new Promise(r => setTimeout(r, 250))   // ayetler arası nefes
    }

    if (playingRef.current) {
      // Tamamlandı
      const p = { ...progress, [surah.n]: true }
      setProgress(p); saveProgress(p)
      setCurIdx(null)
      setPlaying(false); setStopped(false)
    } else {
      setPlaying(false); setStopped(true)
    }
    playingRef.current = false
  }, [ayahs, surah, progress])

  const stopPlayback = () => {
    playingRef.current = false
    audioRef.current.pause()
    setPlaying(false); setStopped(true)
  }

  const resume = () => startPlayback(resumeIdxRef.current)

  const markDone = () => {
    const p = { ...progress, [surah.n]: true }
    setProgress(p); saveProgress(p)
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SURE DETAY GÖRÜNÜMÜ
  // ═══════════════════════════════════════════════════════════════════════════
  if (surah) {
    const isListened = progress[surah.n]
    const pct        = ayahs ? (curIdx != null ? ((curIdx+1)/ayahs.length)*100 : (stopped ? ((resumeIdxRef.current+1)/ayahs.length)*100 : 0)) : 0

    return (
      <div style={{ height:'100%', display:'flex', flexDirection:'column', overflow:'hidden' }}>

        {/* ── Başlık ────────────────────────────────────────────────────── */}
        <div style={{ background:'linear-gradient(135deg,var(--navy),var(--navy-mid))', padding:'14px 16px', display:'flex', gap:10, alignItems:'center', flexShrink:0 }}>
          <button onClick={() => { stopPlayback(); setSurah(null); setAyahs(null); onSubView?.(false) }}
            style={{ background:'rgba(255,255,255,0.12)', border:'none', color:'white', width:36, height:36, borderRadius:10, cursor:'pointer', fontSize:16, display:'flex', alignItems:'center', justifyContent:'center' }}>←</button>
          <div style={{ flex:1 }}>
            <div style={{ color:'rgba(255,255,255,0.45)', fontSize:11 }}>Sure {surah.n} · {surah.ayet} ayet · {surah.cüz}. cüz</div>
            <div style={{ color:'white', fontWeight:800, fontSize:16 }}>{surah.tr} — {surah.anlam}</div>
          </div>
          <div style={{ fontFamily:'var(--font-arabic)', fontSize:24, color:'var(--gold-light)' }}>{surah.ar}</div>
        </div>

        {/* ── Player bar ────────────────────────────────────────────────── */}
        <div style={{ background:'#0a1628', padding:'10px 16px', display:'flex', gap:12, alignItems:'center', flexShrink:0, borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
          {/* Play/Pause/Stop butonu */}
          {!playing ? (
            <button onClick={() => stopped ? resume() : startPlayback(0)}
              disabled={!ayahs || loading}
              style={{ width:44, height:44, borderRadius:'50%', background:'linear-gradient(135deg,var(--gold),var(--gold-light))', border:'none', color:'var(--navy)', fontSize:20, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, boxShadow:'0 2px 12px rgba(201,151,44,0.35)', opacity: (!ayahs||loading)?0.5:1 }}>
              ▶
            </button>
          ) : (
            <button onClick={stopPlayback}
              style={{ width:44, height:44, borderRadius:'50%', background:'#dc2626', border:'none', color:'white', fontSize:18, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 2px 12px rgba(220,38,38,0.35)' }}>
              ⏹
            </button>
          )}

          <div style={{ flex:1, minWidth:0 }}>
            {loading ? (
              <div style={{ color:'rgba(255,255,255,0.4)', fontSize:12 }}>⏳ Ayetler yükleniyor...</div>
            ) : playing && curIdx != null ? (
              <>
                <div style={{ color:'var(--gold)', fontWeight:700, fontSize:12, marginBottom:5 }}>
                  🎵 {curIdx+1}. ayet okunuyor
                </div>
                <div style={{ background:'rgba(255,255,255,0.08)', borderRadius:100, height:3 }}>
                  <div style={{ height:'100%', background:'linear-gradient(90deg,var(--gold),var(--gold-light))', borderRadius:100, width:`${pct}%`, transition:'width 0.4s ease' }}/>
                </div>
              </>
            ) : stopped ? (
              <div style={{ color:'rgba(255,255,255,0.5)', fontSize:12 }}>⏸ {resumeIdxRef.current+1}. ayetten devam edebilirsin</div>
            ) : (
              <div style={{ color:'rgba(255,255,255,0.4)', fontSize:12 }}>
                {isListened ? '✅ Dinlendi · Tekrar dinle' : '▶ Baştan başlat ya da ayete tıkla'}
              </div>
            )}
          </div>

          {curIdx != null && ayahs && (
            <div style={{ color:'rgba(255,255,255,0.35)', fontSize:11, fontVariantNumeric:'tabular-nums', whiteSpace:'nowrap' }}>{curIdx+1}/{ayahs.length}</div>
          )}
        </div>

        {/* ── Ayet listesi ──────────────────────────────────────────────── */}
        <div className="scroll-y" style={{ flex:1, padding:'12px 14px', display:'flex', flexDirection:'column', gap:10 }}>

          {error && (
            <div style={{ background:'#fee2e2', border:'1px solid #f87171', borderRadius:14, padding:'14px', textAlign:'center', color:'#991b1b' }}>{error}</div>
          )}

          {SURAH_FAZILET[surah.n] && !loading && (
            <div style={{ background:'linear-gradient(135deg,var(--navy),#0a1628)', borderRadius:14, padding:'12px 14px', border:'1px solid rgba(201,151,44,0.2)' }}>
              <div style={{ color:'var(--gold)', fontSize:11, fontWeight:700, marginBottom:4 }}>🌟 Fazileti</div>
              <div style={{ color:'rgba(255,255,255,0.8)', fontSize:12, lineHeight:1.6 }}>{SURAH_FAZILET[surah.n]}</div>
            </div>
          )}

          {/* Bismillah başlığı */}
          {ayahs && !loading && surah.n !== 9 && (
            <div style={{ textAlign:'center', padding:'8px 0', fontFamily:'var(--font-arabic)', fontSize:22, color:'var(--gold)', opacity:0.7, letterSpacing:2 }}>
              بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
            </div>
          )}

          {/* Loading skeleton */}
          {loading && Array.from({length:5}).map((_,i)=>(
            <div key={i} className="shimmer" style={{ height:90, borderRadius:14 }}/>
          ))}

          {/* Ayetler */}
          {ayahs?.map((a,i) => {
            const isActive = curIdx === i
            const isPast   = curIdx != null && i < curIdx

            return (
              <div
                key={a.number}
                ref={el => { ayahRefs.current[i] = el }}
                onClick={() => !playing && startPlayback(i)}
                style={{
                  background:    isActive ? '#fdf6e3' : '#ffffff',
                  border:        isActive ? '2px solid #c9972c' : '1px solid #e8e0d0',
                  borderRadius:  16,
                  padding:       '16px 14px',
                  cursor:        playing ? 'default' : 'pointer',
                  opacity:       isPast ? 0.55 : 1,
                  transition:    'all 0.35s ease',
                  boxShadow:     isActive ? '0 6px 24px rgba(201,151,44,0.22)' : '0 1px 4px rgba(15,32,64,0.08)',
                  position:      'relative',
                  overflow:      'hidden',
                }}
              >
                {/* Aktif — üst renk çizgisi */}
                {isActive && (
                  <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:'linear-gradient(90deg, transparent, var(--gold), transparent)', animation:'shimmer 1.6s infinite' }}/>
                )}

                {/* Numara + dalga göstergesi */}
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
                  <div style={{
                    width:28, height:28, borderRadius:'50%',
                    background: isActive ? '#c9972c' : '#f8f5ef',
                    display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0
                  }}>
                    <span style={{ fontSize:11, fontWeight:800, color: isActive ? '#ffffff' : '#64748b' }}>{a.numberInSurah}</span>
                  </div>

                  {isActive ? (
                    /* Ses dalgası animasyonu */
                    <div style={{ display:'flex', gap:3, alignItems:'center', height:20 }}>
                      {[0,1,2,3].map(j => (
                        <div key={j} style={{
                          width:3, borderRadius:3, background:'var(--gold)',
                          animation:`wave 0.7s ease-in-out ${j*0.12}s infinite alternate`,
                        }}/>
                      ))}
                    </div>
                  ) : !playing && (
                    <div style={{ color:'var(--text-light)', fontSize:10, fontWeight:500 }}>▶ buradan başla</div>
                  )}
                </div>

                {/* Ayet metni */}
                <div style={{
                  fontFamily: "'Amiri', 'Scheherazade New', 'Traditional Arabic', 'Arabic Typesetting', 'Noto Naskh Arabic', serif",
                  fontSize:   surah.n === 2 ? 22 : 28,
                  color:      '#1a1a2e',
                  textAlign:  'right',
                  lineHeight: 2.2,
                  direction:  'rtl',
                  fontWeight: isActive ? 700 : 400,
                  transition: 'color 0.3s',
                  wordBreak:  'break-word',
                  minHeight:  40,
                }}>
                  {a.text || '⏳'}
                </div>
              </div>
            )
          })}

          {/* Tamamlandı kartı */}
          {isListened && !loading && (
            <div style={{ background:'var(--green-light)', border:'1px solid #4ade80', borderRadius:14, padding:'14px', textAlign:'center' }}>
              <div style={{ fontSize:28, marginBottom:4 }}>✅</div>
              <div style={{ fontWeight:700, color:'var(--green)' }}>Bu sure tamamlandı!</div>
            </div>
          )}

          {/* Manuel tamamla */}
          {!isListened && ayahs && !loading && (
            <button onClick={markDone} style={{ padding:'12px', background:'white', border:'1px solid var(--border)', borderRadius:14, cursor:'pointer', color:'var(--text-muted)', fontWeight:600, fontSize:13, fontFamily:'var(--font-ui)' }}>
              ✅ Dinledim olarak işaretle
            </button>
          )}
        </div>

        <style>{`
          @keyframes wave {
            from { height: 6px }
            to   { height: 20px }
          }
        `}</style>
      </div>
    )
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SURE LİSTESİ
  // ═══════════════════════════════════════════════════════════════════════════
  const listenedCount = Object.keys(progress).filter(k=>progress[k]).length

  const filtered = SURAHS.filter(s => {
    const q  = search.toLowerCase()
    const ok = !q || s.tr.toLowerCase().includes(q) || s.ar.includes(search) || String(s.n).includes(q)
    return ok && (!cuz || s.cüz === cuz)
  })

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', overflow:'hidden' }}>

      {/* Header */}
      <div style={{ background:'linear-gradient(135deg,var(--navy),var(--navy-mid))', padding:'14px 16px', flexShrink:0 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
          <div style={{ color:'white', fontWeight:800, fontSize:17 }}>🎧 Kur'an-ı Kerim</div>
          <div style={{ background:'rgba(201,151,44,0.2)', border:'1px solid rgba(201,151,44,0.35)', borderRadius:12, padding:'6px 12px', textAlign:'center' }}>
            <div style={{ color:'var(--gold)', fontWeight:800, fontSize:16 }}>{listenedCount}</div>
            <div style={{ color:'rgba(255,255,255,0.4)', fontSize:10 }}>/ 114</div>
          </div>
        </div>

        {/* Progress */}
        <div style={{ background:'rgba(255,255,255,0.08)', borderRadius:100, height:5, marginBottom:10 }}>
          <div style={{ height:'100%', background:'linear-gradient(90deg,var(--gold),var(--gold-light))', borderRadius:100, width:`${(listenedCount/114)*100}%`, transition:'width 0.5s', minWidth: listenedCount>0?5:0 }}/>
        </div>

        {/* Arama */}
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder='Sure ara...'
          style={{ width:'100%', padding:'9px 14px', borderRadius:12, border:'none', fontSize:14, background:'rgba(255,255,255,0.1)', color:'white', outline:'none', boxSizing:'border-box', marginBottom:8, fontFamily:'var(--font-ui)' }}/>

        {/* Cüz filtresi */}
        <div className="scroll-x" style={{ display:'flex', gap:6 }}>
          {[0,...Array.from({length:30},(_,i)=>i+1)].map(n=>(
            <button key={n} onClick={()=>setCuz(n)} style={{
              background: cuz===n?'var(--gold)':'rgba(255,255,255,0.1)',
              color:      cuz===n?'var(--navy)':'rgba(255,255,255,0.7)',
              border:'none', borderRadius:20, padding:'4px 10px',
              cursor:'pointer', fontWeight:700, fontSize:11, whiteSpace:'nowrap', flexShrink:0,
              fontFamily:'var(--font-ui)'
            }}>{n===0?'Tümü':`${n}. cüz`}</button>
          ))}
        </div>
      </div>

      {/* Liste */}
      <div className="scroll-y" style={{ flex:1, padding:'8px 14px 20px', display:'flex', flexDirection:'column', gap:8 }}>
        {filtered.map(s=>{
          const done   = progress[s.n]
          const fazilet= !!SURAH_FAZILET[s.n]
          return (
            <button key={s.n} onClick={()=>openSurah(s)} style={{
              display:'flex', alignItems:'center', gap:12, padding:'12px 14px',
              background:'white', border:'1px solid var(--border)',
              borderRadius:14, cursor:'pointer', textAlign:'left',
              boxShadow:'var(--shadow-sm)',
              borderLeft:`3px solid ${done?'var(--gold)':'var(--border)'}`,
            }}>
              <div style={{ width:38, height:38, borderRadius:10, background: done?'var(--gold-pale)':'var(--cream)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <span style={{ fontWeight:800, fontSize:13, color: done?'var(--gold)':'var(--text-muted)' }}>
                  {done ? '✅' : s.n}
                </span>
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                  <span style={{ fontWeight:800, color:'var(--navy)', fontSize:14 }}>{s.tr}</span>
                  {fazilet && <span style={{ fontSize:9, background:'var(--gold-pale)', color:'var(--gold)', padding:'2px 6px', borderRadius:6, fontWeight:700, border:'1px solid rgba(201,151,44,0.3)' }}>FAZİLETLİ</span>}
                </div>
                <div style={{ fontFamily:'var(--font-arabic)', fontSize:13, color:'var(--text-muted)', direction:'rtl', display:'inline-block' }}>{s.ar}</div>
                <div style={{ fontSize:11, color:'var(--text-light)', marginTop:1 }}>{s.anlam} · {s.ayet} ayet · {s.cüz}. cüz</div>
              </div>
              <span style={{ color:'var(--text-light)', fontSize:18, flexShrink:0 }}>›</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
