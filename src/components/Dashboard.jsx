import { useState, useEffect } from 'react'
import { fetchPrayerTimes, getNextPrayer, PRAYER_LABELS } from '../utils/prayer'
import { TOTAL_LESSONS } from '../data/curriculum'

export default function Dashboard({ progress, streak, quranProgress, dhikrStats }) {
  const [prayerTimes, setPrayerTimes] = useState(null)
  const [nextPrayer, setNextPrayer] = useState(null)
  const [location, setLocation] = useState(null)
  const [prayerErr, setPrayerErr] = useState(null)
  const [loading, setLoading] = useState(false)
  const [countdown, setCountdown] = useState('')

  const done = Object.keys(progress).filter(k => progress[k]?.done).length
  const stars = Object.values(progress).reduce((s, p) => s + (p.stars || 0), 0)
  const quranDone = Object.keys(quranProgress || {}).filter(k => quranProgress[k]).length
  const totalDhikr = dhikrStats?.totalCount || 0

  // Konum al ve namaz vakitlerini çek
  const loadPrayer = () => {
    setLoading(true)
    setPrayerErr(null)
    navigator.geolocation?.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords
        setLocation({ lat, lng })
        try {
          const times = await fetchPrayerTimes(lat, lng)
          setPrayerTimes(times)
          setNextPrayer(getNextPrayer(times))
        } catch (e) { setPrayerErr('Vakitler alınamadı') }
        finally { setLoading(false) }
      },
      () => { setPrayerErr('Konum izni gerekli'); setLoading(false) }
    )
  }

  useEffect(() => {
    // Sayfalı kayıt varsa yükle
    const saved = localStorage.getItem('prayer-times')
    if (saved) {
      try {
        const { times, date } = JSON.parse(saved)
        const today = new Date().toDateString()
        if (date === today) { setPrayerTimes(times); setNextPrayer(getNextPrayer(times)); return }
      } catch {}
    }
    loadPrayer()
  }, [])

  useEffect(() => {
    if (prayerTimes) localStorage.setItem('prayer-times', JSON.stringify({ times: prayerTimes, date: new Date().toDateString() }))
  }, [prayerTimes])

  // Geri sayım
  useEffect(() => {
    if (!nextPrayer) return
    const tick = () => {
      const now = new Date()
      const [h, m] = nextPrayer.time.split(':').map(Number)
      const target = new Date(); target.setHours(h, m, 0, 0)
      if (target < now) target.setDate(target.getDate() + 1)
      const diff = Math.max(0, Math.floor((target - now) / 1000))
      const hh = Math.floor(diff / 3600)
      const mm = Math.floor((diff % 3600) / 60)
      const ss = diff % 60
      setCountdown(`${hh > 0 ? hh + 's ' : ''}${mm}dk ${ss}sn`)
    }
    tick(); const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [nextPrayer])

  const todayStr = new Date().toLocaleDateString('tr-TR', { weekday:'long', day:'numeric', month:'long' })

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', overflow:'hidden', background:'#fef9f0' }}>
      {/* Header */}
      <div style={{ background:'linear-gradient(135deg,#1e1b4b,#3730a3)', padding:'20px 18px 16px', flexShrink:0 }}>
        <div style={{ color:'rgba(255,255,255,0.6)', fontSize:12, marginBottom:2 }}>{todayStr}</div>
        {prayerTimes?.hijri && (
          <div style={{ color:'rgba(255,255,255,0.5)', fontSize:11 }}>
            {prayerTimes.hijri.day} {prayerTimes.hijri.month.ar} {prayerTimes.hijri.year}h
          </div>
        )}

        {/* Sonraki namaz */}
        <div style={{ marginTop:14, background:'rgba(255,255,255,0.1)', borderRadius:16, padding:'14px 16px' }}>
          {loading && <div style={{ color:'rgba(255,255,255,0.7)', fontSize:13, textAlign:'center' }}>Namaz vakitleri yükleniyor...</div>}
          {prayerErr && (
            <div style={{ textAlign:'center' }}>
              <div style={{ color:'#fca5a5', fontSize:13, marginBottom:8 }}>{prayerErr}</div>
              <button onClick={loadPrayer} style={{ background:'rgba(255,255,255,0.2)', border:'none', color:'white', padding:'6px 16px', borderRadius:8, cursor:'pointer', fontSize:12 }}>Konum Ver</button>
            </div>
          )}
          {nextPrayer && !loading && (
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div>
                <div style={{ color:'rgba(255,255,255,0.6)', fontSize:11, marginBottom:2 }}>Sonraki Namaz</div>
                <div style={{ color:'white', fontWeight:800, fontSize:18 }}>{nextPrayer.emoji} {nextPrayer.label}</div>
                <div style={{ color:'#fde68a', fontWeight:700, fontSize:15, marginTop:2 }}>{nextPrayer.time}</div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ color:'rgba(255,255,255,0.6)', fontSize:11 }}>Kalan</div>
                <div style={{ color:'#a5f3fc', fontWeight:800, fontSize:16, fontVariantNumeric:'tabular-nums' }}>{countdown}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Scroll içerik */}
      <div style={{ flex:1, overflowY:'auto', WebkitOverflowScrolling:'touch', padding:'14px 14px 20px' }}>

        {/* Tüm vakitler */}
        {prayerTimes && !loading && (
          <div style={{ background:'white', borderRadius:16, padding:'14px', boxShadow:'0 2px 8px rgba(0,0,0,0.07)', marginBottom:14 }}>
            <div style={{ fontWeight:800, color:'#1e1b4b', fontSize:13, marginBottom:10 }}>🕌 Namaz Vakitleri</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8 }}>
              {Object.entries(PRAYER_LABELS).map(([key, info]) => (
                prayerTimes[key] && (
                  <div key={key} style={{
                    background: nextPrayer?.key === key ? '#eff6ff' : '#f9fafb',
                    border: nextPrayer?.key === key ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                    borderRadius:12, padding:'10px 8px', textAlign:'center'
                  }}>
                    <div style={{ fontSize:16, marginBottom:3 }}>{info.emoji}</div>
                    <div style={{ fontSize:11, color:'#6b7280', fontWeight:600 }}>{info.label}</div>
                    <div style={{ fontSize:14, fontWeight:800, color: nextPrayer?.key === key ? '#2563eb' : '#1e1b4b', marginTop:2 }}>{prayerTimes[key]}</div>
                  </div>
                )
              ))}
            </div>
          </div>
        )}

        {/* Günlük özet */}
        <div style={{ fontWeight:800, color:'#1e1b4b', fontSize:14, marginBottom:10 }}>📊 Genel Durumun</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:14 }}>
          {[
            { emoji:'🔥', label:'Günlük Seri',   value:`${streak.current} gün`, sub:`En iyi: ${streak.max}`, color:'#ef4444' },
            { emoji:'⭐', label:'Toplam Yıldız', value:`${stars}`, sub:`${done}/${TOTAL_LESSONS} ders`, color:'#f59e0b' },
            { emoji:'📿', label:'Zikir Toplamı', value:`${totalDhikr.toLocaleString('tr')}`, sub:'bugüne kadar', color:'#16a34a' },
            { emoji:'🎧', label:'Dinlenen Sure', value:`${quranDone}`, sub:'114 sure', color:'#7c3aed' },
          ].map((s, i) => (
            <div key={i} style={{ background:'white', borderRadius:16, padding:'14px', boxShadow:'0 2px 8px rgba(0,0,0,0.06)', display:'flex', gap:10, alignItems:'center' }}>
              <div style={{ fontSize:28 }}>{s.emoji}</div>
              <div>
                <div style={{ fontWeight:800, fontSize:18, color:s.color }}>{s.value}</div>
                <div style={{ fontSize:12, color:'#1e1b4b', fontWeight:600 }}>{s.label}</div>
                <div style={{ fontSize:11, color:'#9ca3af' }}>{s.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* İlerleme çubuğu */}
        <div style={{ background:'white', borderRadius:16, padding:'14px', boxShadow:'0 2px 8px rgba(0,0,0,0.06)', marginBottom:14 }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
            <span style={{ fontWeight:800, color:'#1e1b4b', fontSize:13 }}>📚 Öğrenme İlerlemesi</span>
            <span style={{ fontWeight:800, color:'#7c3aed', fontSize:13 }}>{Math.round((done/TOTAL_LESSONS)*100)}%</span>
          </div>
          <div style={{ background:'#f3f4f6', borderRadius:100, height:10 }}>
            <div style={{ height:'100%', background:'linear-gradient(90deg,#7c3aed,#a855f7)', borderRadius:100, width:`${(done/TOTAL_LESSONS)*100}%`, transition:'width 0.6s', minWidth: done > 0 ? 10 : 0 }}/>
          </div>
          <div style={{ color:'#6b7280', fontSize:12, marginTop:6 }}>{done}/{TOTAL_LESSONS} ders tamamlandı</div>
        </div>

        {/* Günlük motivasyon — Gazali'den */}
        <GazaliQuote />

      </div>
    </div>
  )
}

const QUOTES = [
  { text:'Bilgi, amel için alınmayan bilgi değildir; asıl bilgi, insanı Allah\'a götürendir.', kaynak:'İmam Gazali — İhya Ulumu\'d-Din' },
  { text:'Kalp ancak Allah\'ın zikriyle huzur bulur. Zikir, kalbin gıdasıdır.', kaynak:'İmam Gazali — İhya' },
  { text:'Dil, kalbin tercümanıdır. Kalbinde ne varsa dilinden o akar.', kaynak:'İmam Gazali — İhya' },
  { text:'Her gece ölür, her sabah diriliriz. Bugünü fırsat bil.', kaynak:'İmam Gazali — İhya Ulumu\'d-Din' },
  { text:'Sabır; acı çekenlerin değil, acıya rağmen devam edenlerin erdemidir.', kaynak:'İmam Gazali' },
  { text:'Namazını öyle kıl ki vedalaşan biri gibi kılıyorsun; bir daha kılamayabilirsin.', kaynak:'İmam Gazali — İhya' },
  { text:'Kim dünyaya bakarak ahiretini satarsa büyük zarara uğramıştır.', kaynak:'İmam Gazali' },
]

function GazaliQuote() {
  const q = QUOTES[new Date().getDay() % QUOTES.length]
  return (
    <div style={{ background:'linear-gradient(135deg,#1e1b4b,#312e81)', borderRadius:16, padding:'16px', marginBottom:14 }}>
      <div style={{ color:'#a5b4fc', fontSize:11, fontWeight:700, marginBottom:8 }}>💎 Günün Sözü</div>
      <div style={{ color:'white', fontSize:14, lineHeight:1.6, fontStyle:'italic', marginBottom:8 }}>"{q.text}"</div>
      <div style={{ color:'#818cf8', fontSize:12, fontWeight:600 }}>— {q.kaynak}</div>
    </div>
  )
}
