import { useState, useEffect } from 'react'
import { fetchPrayerTimes, getNextPrayer, PRAYER_LABELS } from '../utils/prayer'
import { TOTAL_LESSONS } from '../data/curriculum'

const QUOTES = [
  { text:'Bilgi, amel için alınmayan bilgi değildir; asıl bilgi, insanı Allah\'a götürendir.', kaynak:'İmam Gazali — İhya' },
  { text:'Kalp ancak Allah\'ın zikriyle huzur bulur. Zikir, kalbin gıdasıdır.', kaynak:'İmam Gazali — İhya' },
  { text:'Dil, kalbin tercümanıdır. Kalbinde ne varsa dilinden o akar.', kaynak:'İmam Gazali — İhya' },
  { text:'Her gece ölür, her sabah diriliriz. Bugünü fırsat bil.', kaynak:'İmam Gazali — İhya' },
  { text:'Sabır; acı çekenlerin değil, acıya rağmen devam edenlerin erdemidir.', kaynak:'İmam Gazali' },
  { text:'Namazını öyle kıl ki vedalaşan biri gibi kılıyorsun; bir daha kılamayabilirsin.', kaynak:'İmam Gazali — İhya' },
  { text:'Kim dünyaya bakarak ahiretini satarsa büyük zarara uğramıştır.', kaynak:'İmam Gazali' },
]

export default function Dashboard({ progress, streak, quranProgress, dhikrStats }) {
  const [prayerTimes, setPrayerTimes] = useState(null)
  const [nextPrayer, setNextPrayer]   = useState(null)
  const [prayerErr, setPrayerErr]     = useState(null)
  const [loading, setLoading]         = useState(false)
  const [countdown, setCountdown]     = useState('')

  const done       = Object.keys(progress).filter(k => progress[k]?.done).length
  const stars      = Object.values(progress).reduce((s,p) => s+(p.stars||0), 0)
  const quranDone  = Object.keys(quranProgress||{}).filter(k=>quranProgress[k]).length
  const totalDhikr = dhikrStats?.totalCount || 0

  const loadPrayer = () => {
    setLoading(true); setPrayerErr(null)
    navigator.geolocation?.getCurrentPosition(
      async ({ coords:{ latitude:lat, longitude:lng } }) => {
        try {
          const times = await fetchPrayerTimes(lat, lng)
          setPrayerTimes(times); setNextPrayer(getNextPrayer(times))
          localStorage.setItem('prayer-times', JSON.stringify({ times, date:new Date().toDateString() }))
        } catch { setPrayerErr('Vakitler alınamadı') }
        finally { setLoading(false) }
      },
      () => { setPrayerErr('Konum izni gerekli'); setLoading(false) }
    )
  }

  useEffect(() => {
    const saved = localStorage.getItem('prayer-times')
    if (saved) {
      try {
        const { times, date } = JSON.parse(saved)
        if (date === new Date().toDateString()) {
          setPrayerTimes(times); setNextPrayer(getNextPrayer(times)); return
        }
      } catch {}
    }
    loadPrayer()
  }, [])

  useEffect(() => {
    if (!nextPrayer) return
    const tick = () => {
      const [h,m] = nextPrayer.time.split(':').map(Number)
      const target = new Date(); target.setHours(h,m,0,0)
      if (target < new Date()) target.setDate(target.getDate()+1)
      const diff = Math.max(0, Math.floor((target-new Date())/1000))
      const hh=Math.floor(diff/3600), mm=Math.floor((diff%3600)/60), ss=diff%60
      setCountdown(`${hh>0?hh+'s ':''} ${mm}dk ${ss}sn`)
    }
    tick(); const id=setInterval(tick,1000); return ()=>clearInterval(id)
  }, [nextPrayer])

  const today = new Date().toLocaleDateString('tr-TR',{weekday:'long',day:'numeric',month:'long'})
  const quote  = QUOTES[new Date().getDay()%QUOTES.length]

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', overflow:'hidden' }}>

      {/* Hero — namaz vakti */}
      <div style={{
        background:`linear-gradient(160deg, var(--navy) 0%, var(--navy-mid) 60%, #1e4080 100%)`,
        padding:'20px 18px 24px', flexShrink:0, position:'relative', overflow:'hidden'
      }}>
        {/* Süsleme daire */}
        <div style={{ position:'absolute', top:-30, right:-30, width:140, height:140, borderRadius:'50%', border:'1px solid rgba(201,151,44,0.15)', pointerEvents:'none' }}/>
        <div style={{ position:'absolute', top:-50, right:-50, width:200, height:200, borderRadius:'50%', border:'1px solid rgba(201,151,44,0.08)', pointerEvents:'none' }}/>

        <div style={{ color:'rgba(255,255,255,0.5)', fontSize:11, fontWeight:500, marginBottom:2 }}>{today}</div>
        {prayerTimes?.hijri && (
          <div style={{ color:'rgba(201,151,44,0.7)', fontSize:11, fontFamily:'var(--font-arabic)', marginBottom:14 }}>
            {prayerTimes.hijri.day} {prayerTimes.hijri.month.ar} {prayerTimes.hijri.year}
          </div>
        )}

        {/* Sonraki namaz kartı */}
        <div style={{ background:'rgba(255,255,255,0.07)', backdropFilter:'blur(10px)', borderRadius:18, padding:'16px', border:'1px solid rgba(201,151,44,0.2)' }}>
          {loading && (
            <div style={{ textAlign:'center', color:'rgba(255,255,255,0.5)', fontSize:13, padding:'8px 0' }}>
              <span style={{ marginRight:8 }}>🕌</span>Namaz vakitleri yükleniyor...
            </div>
          )}
          {prayerErr && (
            <div style={{ textAlign:'center' }}>
              <div style={{ color:'#fca5a5', fontSize:12, marginBottom:8 }}>{prayerErr}</div>
              <button onClick={loadPrayer} style={{ background:'rgba(255,255,255,0.15)', border:'1px solid rgba(255,255,255,0.2)', color:'white', padding:'6px 16px', borderRadius:8, cursor:'pointer', fontSize:12, fontFamily:'var(--font-ui)' }}>
                📍 Konum Ver
              </button>
            </div>
          )}
          {nextPrayer && !loading && (
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div>
                <div style={{ color:'rgba(255,255,255,0.45)', fontSize:10, fontWeight:600, letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:4 }}>Sonraki Namaz</div>
                <div style={{ color:'white', fontWeight:800, fontSize:22 }}>{nextPrayer.emoji} {nextPrayer.label}</div>
                <div style={{ color:'var(--gold-light)', fontWeight:700, fontSize:18, marginTop:4 }}>{nextPrayer.time}</div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ color:'rgba(255,255,255,0.45)', fontSize:10, fontWeight:600, letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:4 }}>Kalan</div>
                <div style={{ color:'#a5f3fc', fontWeight:800, fontSize:16, fontVariantNumeric:'tabular-nums' }}>{countdown}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Scroll içerik */}
      <div className="scroll-y" style={{ flex:1, padding:'16px 14px 20px', display:'flex', flexDirection:'column', gap:14 }}>

        {/* Tüm namaz vakitleri */}
        {prayerTimes && !loading && (
          <div className="card" style={{ padding:'14px' }}>
            <div style={{ fontWeight:700, color:'var(--navy)', fontSize:13, marginBottom:10, display:'flex', alignItems:'center', gap:6 }}>
              <span style={{ color:'var(--gold)' }}>🕌</span> Namaz Vakitleri
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8 }}>
              {Object.entries(PRAYER_LABELS).map(([key, info]) => (
                prayerTimes[key] && (
                  <div key={key} style={{
                    background: nextPrayer?.key===key ? 'rgba(201,151,44,0.1)' : 'var(--cream)',
                    border: `1px solid ${nextPrayer?.key===key ? 'var(--gold)' : 'var(--border)'}`,
                    borderRadius:12, padding:'10px 6px', textAlign:'center'
                  }}>
                    <div style={{ fontSize:16, marginBottom:3 }}>{info.emoji}</div>
                    <div style={{ fontSize:10, color:'var(--text-muted)', fontWeight:600 }}>{info.label}</div>
                    <div style={{ fontSize:14, fontWeight:800, color: nextPrayer?.key===key ? 'var(--gold)' : 'var(--navy)', marginTop:2 }}>{prayerTimes[key]}</div>
                  </div>
                )
              ))}
            </div>
          </div>
        )}

        {/* İstatistik grid */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
          {[
            { emoji:'🔥', label:'Günlük Seri',    value:`${streak.current} gün`,              sub:`En iyi: ${streak.max}`,       color:'#dc2626' },
            { emoji:'⭐', label:'Toplam Yıldız',  value:stars,                                sub:`${done}/${TOTAL_LESSONS} ders`, color:'#d97706' },
            { emoji:'📿', label:'Zikir Toplamı',  value:totalDhikr.toLocaleString('tr'),      sub:'bugüne kadar',                 color:'var(--green)' },
            { emoji:'🎧', label:'Dinlenen Sure',  value:quranDone,                             sub:'/ 114 sure',                   color:'var(--navy)' },
          ].map((s,i) => (
            <div key={i} className="card" style={{ padding:'14px', display:'flex', gap:10, alignItems:'center' }}>
              <div style={{ fontSize:26 }}>{s.emoji}</div>
              <div>
                <div style={{ fontWeight:800, fontSize:20, color:s.color, lineHeight:1 }}>{s.value}</div>
                <div style={{ fontSize:12, color:'var(--text)', fontWeight:600, marginTop:2 }}>{s.label}</div>
                <div style={{ fontSize:10, color:'var(--text-muted)' }}>{s.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Öğrenme ilerleme */}
        <div className="card" style={{ padding:'14px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8, alignItems:'center' }}>
            <span style={{ fontWeight:700, color:'var(--navy)', fontSize:13 }}>📚 Öğrenme İlerlemesi</span>
            <span style={{ fontWeight:800, color:'var(--gold)', fontSize:13 }}>{Math.round((done/TOTAL_LESSONS)*100)}%</span>
          </div>
          <div style={{ background:'var(--cream)', borderRadius:100, height:10, overflow:'hidden' }}>
            <div style={{ height:'100%', background:`linear-gradient(90deg, var(--navy-mid), var(--gold))`, borderRadius:100, width:`${(done/TOTAL_LESSONS)*100}%`, transition:'width 0.6s', minWidth: done>0 ? 10 : 0 }}/>
          </div>
          <div style={{ color:'var(--text-muted)', fontSize:11, marginTop:6 }}>{done}/{TOTAL_LESSONS} ders tamamlandı</div>
        </div>

        {/* Gazali sözü */}
        <div style={{
          background:`linear-gradient(135deg, var(--navy) 0%, #0a1628 100%)`,
          borderRadius:18, padding:'18px',
          border:'1px solid rgba(201,151,44,0.25)',
          position:'relative', overflow:'hidden'
        }}>
          <div style={{ position:'absolute', top:-20, right:-20, width:100, height:100, borderRadius:'50%', border:'1px solid rgba(201,151,44,0.1)', pointerEvents:'none' }}/>
          <div style={{ color:'var(--gold)', fontSize:10, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:10 }}>💎 Günün Sözü</div>
          <div style={{ color:'rgba(255,255,255,0.9)', fontSize:13, lineHeight:1.7, fontStyle:'italic', marginBottom:10 }}>
            "{quote.text}"
          </div>
          <div style={{ color:'rgba(201,151,44,0.7)', fontSize:11, fontWeight:600 }}>— {quote.kaynak}</div>
        </div>

      </div>
    </div>
  )
}
