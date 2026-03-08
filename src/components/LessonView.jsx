import { useState, useCallback } from 'react'
import { LETTERS, HAREKELER, ADVANCED_HAREKELER, SYLLABLES, WORDS, SURAS, LETTER_FORMS, NON_JOINING } from '../data/curriculum'
import { speak, playSurahAudio } from '../utils/audio'
import Quiz from './Quiz'

const COLORS = ['#7c3aed','#dc2626','#0891b2','#16a34a','#b45309','#db2777','#0284c7']

function SpeakBtn({ text, size=28 }) {
  const [active, setActive] = useState(false)
  return (
    <button onClick={() => { setActive(true); speak(text); setTimeout(() => setActive(false), 600) }}
      style={{ background:'none', border:'none', cursor:'pointer', fontSize:size,
               transform: active ? 'scale(1.3)' : 'scale(1)', transition:'transform 0.1s', padding:4 }}>
      🔊
    </button>
  )
}

function LetterCard({ letter, idx, big=false }) {
  const [tapped, setTapped] = useState(false)
  const color = COLORS[idx % COLORS.length]
  return (
    <button onClick={() => { setTapped(true); speak(letter.ar); setTimeout(() => setTapped(false), 400) }}
      style={{
        background: tapped ? color : 'white', border:`3px solid ${color}`, borderRadius:18,
        padding: big ? '22px 18px' : '14px 12px', cursor:'pointer',
        display:'flex', flexDirection:'column', alignItems:'center', gap:6,
        boxShadow: tapped ? `0 6px 20px ${color}55` : '0 2px 8px rgba(0,0,0,0.08)',
        transform: tapped ? 'scale(0.95)' : 'scale(1)', transition:'all 0.15s', minWidth: big ? 76 : 66
      }}>
      <span style={{ fontSize: big ? 48 : 38, color: tapped ? 'white' : color, lineHeight:1, fontFamily:'Amiri, serif' }}>{letter.ar}</span>
      <span style={{ fontSize:12, fontWeight:700, color: tapped ? 'white' : '#374151' }}>{letter.name}</span>
    </button>
  )
}

function SyllableCard({ s, idx }) {
  const color = COLORS[idx % COLORS.length]
  const [tapped, setTapped] = useState(false)
  return (
    <button onClick={() => { setTapped(true); speak(s.ar); setTimeout(() => setTapped(false), 400) }}
      style={{
        background: tapped ? color : 'white', border:`3px solid ${color}`, borderRadius:16, padding:'16px 10px',
        cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:4,
        transform: tapped ? 'scale(0.94)' : 'scale(1)', transition:'all 0.15s',
        boxShadow: tapped ? `0 4px 16px ${color}55` : '0 2px 8px rgba(0,0,0,0.06)'
      }}>
      <span style={{ fontSize:40, color: tapped ? 'white' : color, fontFamily:'Amiri, serif', lineHeight:1 }}>{s.ar}</span>
      <span style={{ fontSize:13, fontWeight:800, color: tapped ? 'white' : '#374151' }}>{s.tr}</span>
    </button>
  )
}

export default function LessonView({ lessonId, progress, onComplete, onBack }) {
  const [phase, setPhase] = useState(() => lessonId === 'mixed-review' ? 'quiz' : 'learn')
  const [stars, setStars] = useState(0)

  const finish = useCallback((earnedStars) => {
    setStars(earnedStars)
    setPhase('done')
    onComplete(lessonId, earnedStars)
  }, [lessonId, onComplete])

  const isDone = progress[lessonId]?.done

  const renderLearn = () => {

    // --- Harfler ---
    if (lessonId.startsWith('letters')) {
      const groupMap = { 'letters-1':[0,7], 'letters-2':[7,15], 'letters-3':[15,21], 'letters-4':[21,28] }
      const [from, to] = groupMap[lessonId]
      const letters = LETTERS.slice(from, to)
      return (
        <div style={{ padding:'16px 14px', display:'flex', flexDirection:'column', gap:18 }}>
          <div style={{ background:'#f0fdf4', borderRadius:14, padding:'12px 16px', border:'2px solid #bbf7d0' }}>
            <div style={{ fontWeight:800, color:'#166534', fontSize:15 }}>👆 Dokun ve Dinle!</div>
            <div style={{ color:'#15803d', fontSize:13, marginTop:2 }}>Her harfe dokunduğunda sesini duyacaksın.</div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
            {letters.map((l, i) => <LetterCard key={i} letter={l} idx={i} big/>)}
          </div>
          <button onClick={() => setPhase('quiz')} style={{ padding:'16px', background:'linear-gradient(135deg, var(--gold), var(--gold-light))', color:'var(--navy)', border:'none', borderRadius:16, fontSize:16, fontWeight:800, cursor:'pointer', boxShadow:'0 4px 16px rgba(201,151,44,0.4)' }}>
            Quize Geç ✏️
          </button>
        </div>
      )
    }

    // --- Hareke ---
    if (lessonId.startsWith('hareke')) {
      const hIdx = { 'hareke-1':0, 'hareke-2':1, 'hareke-3':2 }[lessonId]
      const h = HAREKELER[hIdx]
      return (
        <div style={{ padding:'16px 14px', display:'flex', flexDirection:'column', gap:14 }}>
          <div style={{ background:`${h.color}15`, border:`2px solid ${h.color}55`, borderRadius:18, padding:'18px', textAlign:'center' }}>
            <div style={{ fontSize:48, color:h.color, fontFamily:'Amiri, serif', marginBottom:6 }}>بَ</div>
            <div style={{ fontWeight:800, fontSize:17, color:h.color, marginBottom:4 }}>{h.name} — "{h.sound}" sesi</div>
            <div style={{ color:'#374151', fontSize:13 }}>{h.desc}</div>
            <SpeakBtn text={'بَ'} size={26}/>
          </div>
          <div style={{ background:'#fef9f0', borderRadius:12, padding:'10px 14px', border:'1px solid #fde68a' }}>
            <div style={{ fontWeight:700, color:'#92400e', fontSize:13 }}>👆 Dokun, dinle ve tekrar et!</div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8 }}>
            {LETTERS.slice(0, 12).map((l, i) => {
              const ar = l.ar + h.symbol
              const [t, setT] = useState(false)
              return (
                <button key={i} onClick={() => { setT(true); speak(ar, 0.6); setTimeout(() => setT(false), 400) }}
                  style={{ background: t?h.color:'white', border:`2px solid ${h.color}`, borderRadius:12,
                           padding:'12px 6px', cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:3,
                           transform: t?'scale(0.94)':'scale(1)', transition:'all 0.15s' }}>
                  <span style={{ fontSize:30, color: t?'white':h.color, fontFamily:'Amiri, serif', lineHeight:1 }}>{ar}</span>
                  <span style={{ fontSize:11, fontWeight:700, color: t?'white':'#374151' }}>{l.name[0]+h.sound}</span>
                </button>
              )
            })}
          </div>
          <button onClick={() => setPhase('quiz')} style={{ padding:'16px', background:'linear-gradient(135deg,var(--gold),var(--gold-light))', color:'var(--navy)', color:'white', border:'none', borderRadius:16, fontSize:16, fontWeight:800, cursor:'pointer' }}>
            Quize Geç ✏️
          </button>
        </div>
      )
    }

    // --- Hece ---
    if (lessonId.startsWith('syllable')) {
      const hMap = { 'syllable-1':'üstün', 'syllable-2':'esre', 'syllable-3':'ötre' }
      const filtered = SYLLABLES.filter(s => s.hareke === hMap[lessonId])
      return (
        <div style={{ padding:'16px 14px', display:'flex', flexDirection:'column', gap:14 }}>
          <div style={{ background:'#eff6ff', borderRadius:12, padding:'12px 14px', border:'2px solid #bfdbfe' }}>
            <div style={{ fontWeight:800, color:'#1e40af', fontSize:14 }}>👄 Seslendirerek Oku!</div>
            <div style={{ color:'#1d4ed8', fontSize:12, marginTop:2 }}>Her hecaye dokun, sesini duy ve tekrar et.</div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10 }}>
            {filtered.map((s, i) => <SyllableCard key={i} s={s} idx={i}/>)}
          </div>
          <button onClick={() => setPhase('quiz')} style={{ padding:'16px', background:'linear-gradient(135deg,var(--gold),var(--gold-light))', color:'var(--navy)', color:'white', border:'none', borderRadius:16, fontSize:16, fontWeight:800, cursor:'pointer' }}>
            Quize Geç ✏️
          </button>
        </div>
      )
    }

    // --- Kelimeler ---
    if (lessonId === 'words') {
      return (
        <div style={{ padding:'16px 14px', display:'flex', flexDirection:'column', gap:10 }}>
          <div style={{ background:'#f0fdf4', borderRadius:12, padding:'12px 14px', border:'2px solid #bbf7d0' }}>
            <div style={{ fontWeight:800, color:'#166534', fontSize:14 }}>📝 Kelimeleri Tanıyalım!</div>
            <div style={{ color:'#15803d', fontSize:12, marginTop:2 }}>Dokun, sesini duy. Quiz'de okunuşunu seçeceksin.</div>
          </div>
          {WORDS.map((w, i) => (
            <button key={i} onClick={() => speak(w.ar, 0.6)} style={{
              display:'flex', alignItems:'center', gap:12, padding:'14px',
              background:'white', border:'2px solid #d1fae5', borderRadius:14, cursor:'pointer',
              boxShadow:'0 2px 6px rgba(0,0,0,0.06)'
            }}>
              <span style={{ fontSize:34, color:'#16a34a', fontFamily:'Amiri, serif', minWidth:64, textAlign:'center' }}>{w.ar}</span>
              <div style={{ textAlign:'left' }}>
                <div style={{ fontWeight:800, color:'#166534', fontSize:14 }}>{w.tr}</div>
                <div style={{ color:'#6b7280', fontSize:12 }}>{w.meaning}</div>
              </div>
              <span style={{ marginLeft:'auto', fontSize:20 }}>🔊</span>
            </button>
          ))}
          <button onClick={() => setPhase('quiz')} style={{ padding:'16px', background:'linear-gradient(135deg,var(--gold),var(--gold-light))', color:'var(--navy)', color:'white', border:'none', borderRadius:16, fontSize:16, fontWeight:800, cursor:'pointer', marginTop:4 }}>
            Quize Geç ✏️
          </button>
        </div>
      )
    }

    // --- Harf Formları ---
    if (lessonId === 'letter-forms') {
      return (
        <div style={{ padding:'16px 14px', display:'flex', flexDirection:'column', gap:14 }}>
          <div style={{ background:'#fdf4ff', borderRadius:12, padding:'12px 14px', border:'2px solid #e9d5ff' }}>
            <div style={{ fontWeight:800, color:'#7e22ce', fontSize:14 }}>🔠 Harflerin 4 Formu</div>
            <div style={{ color:'#6d28d9', fontSize:12, marginTop:2 }}>Arapça harfler kelimede konumuna göre farklı yazılır.</div>
          </div>

          {/* Header */}
          <div style={{ display:'grid', gridTemplateColumns:'80px repeat(4,1fr)', gap:4 }}>
            <div/>
            {['Tek','Başta','Ortada','Sonda'].map((l,i) => (
              <div key={i} style={{ textAlign:'center', fontWeight:700, color:'#6b7280', fontSize:11, padding:'4px 0', background:'#f3f4f6', borderRadius:8 }}>{l}</div>
            ))}
          </div>

          {LETTER_FORMS.map((lf, i) => (
            <div key={i} style={{ background:'white', borderRadius:14, padding:'12px', border:'1px solid #e5e7eb', boxShadow:'0 1px 4px rgba(0,0,0,0.05)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
                <span style={{ fontFamily:'Amiri, serif', fontSize:22, color:'#7e22ce' }}>{lf.ar}</span>
                <span style={{ fontWeight:700, color:'#374151', fontSize:13 }}>{lf.name}</span>
                <SpeakBtn text={lf.ar} size={18}/>
                <span style={{ marginLeft:'auto', fontSize:12, color:'#6b7280' }}>örn: {lf.exWord} ({lf.exMeaning})</span>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'80px repeat(4,1fr)', gap:4 }}>
                <div/>
                {[
                  { form: lf.isolated, color:'var(--navy)' },
                  { form: lf.initial,  color:'#0891b2' },
                  { form: lf.medial,   color:'#16a34a' },
                  { form: lf.final,    color:'#dc2626' },
                ].map((item, j) => (
                  <div key={j} style={{
                    background:`${item.color}10`, border:`1px solid ${item.color}30`,
                    borderRadius:10, padding:'8px 4px', textAlign:'center'
                  }}>
                    <div style={{ fontFamily:'Amiri, serif', fontSize:26, color:item.color, lineHeight:1 }}>{item.form}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Non-joining notice */}
          <div style={{ background:'#fff7ed', borderRadius:12, padding:'12px 14px', border:'1px solid #fed7aa' }}>
            <div style={{ fontWeight:700, color:'#9a3412', fontSize:13, marginBottom:6 }}>⚠️ Bağlanmayan Harfler</div>
            <div style={{ color:'#92400e', fontSize:12, marginBottom:8 }}>Bu harfler bir sonraki harfe bağlanmaz — yalnızca 2 formu vardır (tek/sonda):</div>
            <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
              {NON_JOINING.map((l, i) => (
                <div key={i} style={{ background:'white', border:'1px solid #fed7aa', borderRadius:8, padding:'6px 10px', textAlign:'center' }}>
                  <div style={{ fontFamily:'Amiri, serif', fontSize:22, color:'#b45309' }}>{l.ar}</div>
                  <div style={{ fontSize:11, color:'#6b7280', fontWeight:600 }}>{l.name}</div>
                </div>
              ))}
            </div>
          </div>

          <button onClick={() => setPhase('quiz')} style={{ padding:'16px', background:'linear-gradient(135deg,var(--gold),var(--gold-light))', color:'var(--navy)', color:'white', border:'none', borderRadius:16, fontSize:16, fontWeight:800, cursor:'pointer' }}>
            Quize Geç ✏️
          </button>
        </div>
      )
    }

    // --- İleri Hareke: Sükun ---
    if (lessonId === 'adv-hareke-1') {
      const h = ADVANCED_HAREKELER[0]
      return (
        <div style={{ padding:'16px 14px', display:'flex', flexDirection:'column', gap:14 }}>
          <div style={{ background:`${h.color}15`, border:`2px solid ${h.color}40`, borderRadius:18, padding:'20px', textAlign:'center' }}>
            <div style={{ fontSize:52, color:h.color, fontFamily:'Amiri, serif', marginBottom:6 }}>{h.example}</div>
            <div style={{ fontWeight:800, fontSize:18, color:h.color, marginBottom:4 }}>{h.name}</div>
            <div style={{ color:'#374151', fontSize:13, marginBottom:4 }}>{h.desc}</div>
            <div style={{ fontWeight:700, color:h.color, fontSize:14 }}>"{h.exampleTr}"</div>
            <div style={{ color:'#6b7280', fontSize:12, marginTop:4 }}>💡 {h.tip}</div>
          </div>
          <div style={{ background:'#f0f4ff', borderRadius:12, padding:'14px', border:'1px solid #c7d2fe' }}>
            <div style={{ fontWeight:700, color:'#3730a3', fontSize:13, marginBottom:8 }}>Örnekler:</div>
            {[
              { ar:'قُلْ', tr:'Kul', açık:'Lam üzerinde sükun — sessiz kapanış' },
              { ar:'مِنْ', tr:'Min', açık:'Nun üzerinde sükun' },
              { ar:'عَبْد', tr:'Abd', açık:'Be üzerinde sükun — sessiz geçiş' },
              { ar:'رَبَّنَا', tr:'Rabbenâ', açık:'Be harfinde şedde yok ama bağlantılı' },
            ].map((ex, i) => (
              <button key={i} onClick={() => speak(ex.ar)} style={{
                display:'flex', alignItems:'center', gap:10, width:'100%', padding:'10px',
                background:'white', border:'1px solid #e0e7ff', borderRadius:10, cursor:'pointer', marginBottom:6, textAlign:'left'
              }}>
                <span style={{ fontFamily:'Amiri, serif', fontSize:28, color:h.color, minWidth:60, textAlign:'center' }}>{ex.ar}</span>
                <div>
                  <div style={{ fontWeight:700, color:'#1e1b4b', fontSize:13 }}>{ex.tr}</div>
                  <div style={{ color:'#6b7280', fontSize:11 }}>{ex.açık}</div>
                </div>
                <span style={{ marginLeft:'auto' }}>🔊</span>
              </button>
            ))}
          </div>
          <button onClick={() => setPhase('quiz')} style={{ padding:'16px', background:'linear-gradient(135deg,var(--gold),var(--gold-light))', color:'var(--navy)', color:'white', border:'none', borderRadius:16, fontSize:16, fontWeight:800, cursor:'pointer' }}>
            Quize Geç ✏️
          </button>
        </div>
      )
    }

    // --- İleri Hareke: Şedde ---
    if (lessonId === 'adv-hareke-2') {
      const h = ADVANCED_HAREKELER[1]
      return (
        <div style={{ padding:'16px 14px', display:'flex', flexDirection:'column', gap:14 }}>
          <div style={{ background:`${h.color}15`, border:`2px solid ${h.color}40`, borderRadius:18, padding:'20px', textAlign:'center' }}>
            <div style={{ fontSize:52, color:h.color, fontFamily:'Amiri, serif', marginBottom:6 }}>{h.example}</div>
            <div style={{ fontWeight:800, fontSize:18, color:h.color, marginBottom:4 }}>{h.name}</div>
            <div style={{ color:'#374151', fontSize:13, marginBottom:4 }}>{h.desc}</div>
            <div style={{ fontWeight:700, color:h.color, fontSize:14 }}>"{h.exampleTr}"</div>
            <div style={{ color:'#6b7280', fontSize:12, marginTop:4 }}>💡 {h.tip}</div>
          </div>
          <div style={{ background:'#fdf2f8', borderRadius:12, padding:'14px', border:'1px solid #f9a8d4' }}>
            <div style={{ fontWeight:700, color:'#9d174d', fontSize:13, marginBottom:8 }}>Örnekler:</div>
            {[
              { ar:'رَبَّ', tr:'Rabbe', açık:'Be üzerinde şedde — "rabb-be"' },
              { ar:'إِنَّ', tr:'İnne', açık:'Nun üzerinde şedde — "in-ne"' },
              { ar:'أُمٌّ', tr:'Ümm', açık:'Mim üzerinde şedde — "üm-m"' },
              { ar:'اللَّهُ', tr:'Allâhu', açık:'Lam üzerinde şedde — "all-lahu"' },
            ].map((ex, i) => (
              <button key={i} onClick={() => speak(ex.ar)} style={{
                display:'flex', alignItems:'center', gap:10, width:'100%', padding:'10px',
                background:'white', border:'1px solid #fce7f3', borderRadius:10, cursor:'pointer', marginBottom:6, textAlign:'left'
              }}>
                <span style={{ fontFamily:'Amiri, serif', fontSize:28, color:h.color, minWidth:60, textAlign:'center' }}>{ex.ar}</span>
                <div>
                  <div style={{ fontWeight:700, color:'#1e1b4b', fontSize:13 }}>{ex.tr}</div>
                  <div style={{ color:'#6b7280', fontSize:11 }}>{ex.açık}</div>
                </div>
                <span style={{ marginLeft:'auto' }}>🔊</span>
              </button>
            ))}
          </div>
          <button onClick={() => setPhase('quiz')} style={{ padding:'16px', background:'linear-gradient(135deg,var(--gold),var(--gold-light))', color:'var(--navy)', color:'white', border:'none', borderRadius:16, fontSize:16, fontWeight:800, cursor:'pointer' }}>
            Quize Geç ✏️
          </button>
        </div>
      )
    }

    // --- İleri Hareke: Tenvin ---
    if (lessonId === 'adv-hareke-3') {
      const h = ADVANCED_HAREKELER[2]
      return (
        <div style={{ padding:'16px 14px', display:'flex', flexDirection:'column', gap:14 }}>
          <div style={{ background:`${h.color}15`, border:`2px solid ${h.color}40`, borderRadius:18, padding:'18px', textAlign:'center' }}>
            <div style={{ fontSize:52, color:h.color, fontFamily:'Amiri, serif', marginBottom:6 }}>{h.example}</div>
            <div style={{ fontWeight:800, fontSize:17, color:h.color, marginBottom:4 }}>{h.name}</div>
            <div style={{ color:'#374151', fontSize:13 }}>{h.desc}</div>
          </div>
          {h.sub.map((tv, i) => (
            <div key={i} style={{ background:'white', border:'2px solid #fde68a', borderRadius:14, padding:'14px' }}>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6 }}>
                <span style={{ fontFamily:'Amiri, serif', fontSize:38, color:h.color }}>{tv.example}</span>
                <div>
                  <div style={{ fontWeight:800, color:'#92400e', fontSize:14 }}>{tv.name}</div>
                  <div style={{ color:'#b45309', fontSize:13 }}>"{tv.sound}" sesi — {tv.exampleTr}</div>
                </div>
              </div>
            </div>
          ))}
          <div style={{ background:'#fff7ed', borderRadius:12, padding:'12px 14px', border:'1px solid #fed7aa' }}>
            <div style={{ fontWeight:700, color:'#9a3412', fontSize:13, marginBottom:6 }}>Örnekler:</div>
            {[
              { ar:'كِتَابٌ', tr:'Kitâbun', açık:'Tenvin ötre → "un"' },
              { ar:'بَيْتٍ', tr:'Beytin', açık:'Tenvin esre → "in"' },
              { ar:'رَجُلًا', tr:'Racülen', açık:'Tenvin üstün → "en/an"' },
            ].map((ex, i) => (
              <button key={i} onClick={() => speak(ex.ar)} style={{
                display:'flex', alignItems:'center', gap:10, width:'100%', padding:'10px',
                background:'white', border:'1px solid #fed7aa', borderRadius:10, cursor:'pointer', marginBottom:6, textAlign:'left'
              }}>
                <span style={{ fontFamily:'Amiri, serif', fontSize:28, color:h.color, minWidth:70, textAlign:'center' }}>{ex.ar}</span>
                <div>
                  <div style={{ fontWeight:700, color:'#1e1b4b', fontSize:13 }}>{ex.tr}</div>
                  <div style={{ color:'#6b7280', fontSize:11 }}>{ex.açık}</div>
                </div>
                <span style={{ marginLeft:'auto' }}>🔊</span>
              </button>
            ))}
          </div>
          <button onClick={() => setPhase('quiz')} style={{ padding:'16px', background:'linear-gradient(135deg,var(--gold),var(--gold-light))', color:'var(--navy)', color:'white', border:'none', borderRadius:16, fontSize:16, fontWeight:800, cursor:'pointer' }}>
            Quize Geç ✏️
          </button>
        </div>
      )
    }

    // --- Sureler ---
    const suraMap = { fatiha:0, ihlas:1, nas:2 }
    const sura = SURAS[suraMap[lessonId]]
    if (sura) {
      return (
        <div style={{ padding:'16px 14px', display:'flex', flexDirection:'column', gap:12 }}>
          <div style={{ background:'#fff7ed', borderRadius:14, padding:'14px', border:'2px solid #fed7aa', textAlign:'center' }}>
            <div style={{ fontSize:26, marginBottom:4 }}>{sura.emoji}</div>
            <div style={{ fontWeight:800, color:'#9a3412', fontSize:16 }}>{sura.name}</div>
            <div style={{ color:'#ea580c', fontFamily:'Amiri, serif', fontSize:18, marginTop:2 }}>{sura.nameAr}</div>
          </div>
          {sura.ayahs.map((a, i) => (
            <div key={i} style={{ background:'white', borderRadius:14, padding:'14px', border:'1px solid #e5e7eb', boxShadow:'0 1px 4px rgba(0,0,0,0.05)' }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:6 }}>
                <div style={{ width:26, height:26, borderRadius:'50%', background:'#b45309', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <span style={{ color:'white', fontWeight:800, fontSize:12 }}>{i+1}</span>
                </div>
                <SpeakBtn text={a.ar} size={22}/>
              </div>
              <div style={{ fontFamily:'Amiri, serif', fontSize:26, color:'#1e1b4b', textAlign:'right', lineHeight:2, marginBottom:6 }}>{a.ar}</div>
              <div style={{ fontSize:13, color:'var(--navy)', fontStyle:'italic', marginBottom:3 }}>{a.tr}</div>
              <div style={{ fontSize:12, color:'#6b7280' }}>{a.meaning}</div>
            </div>
          ))}
          <button onClick={() => playSurahAudio(lessonId)} style={{ padding:'14px', background:'#fff7ed', border:'2px solid #fed7aa', borderRadius:12, color:'#9a3412', fontWeight:700, cursor:'pointer', fontSize:14 }}>
            🔊 Tamamını Dinle
          </button>
          <button onClick={() => setPhase('quiz')} style={{ padding:'16px', background:'linear-gradient(135deg,var(--gold),var(--gold-light))', color:'var(--navy)', color:'white', border:'none', borderRadius:16, fontSize:16, fontWeight:800, cursor:'pointer' }}>
            Quize Geç ✏️
          </button>
        </div>
      )
    }

    return null
  }

  // --- Tamamlandı ekranı ---
  if (phase === 'done') {
    const msgs = ['Harika!','Süper!','Mükemmel!','Aferin!']
    const msg = msgs[Math.floor(Math.random() * msgs.length)]
    return (
      <div style={{ height:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:28, background:'var(--cream)', gap:14 }}>
        <div style={{ fontSize:72 }}>🎉</div>
        <div style={{ fontWeight:800, fontSize:26, color:'#1e1b4b', textAlign:'center' }}>{msg}</div>
        <div style={{ fontSize:22, textAlign:'center', letterSpacing:4 }}>{'⭐'.repeat(stars)}{'☆'.repeat(3-stars)}</div>
        <div style={{ color:'#6b7280', fontSize:15, textAlign:'center' }}>+{stars} yıldız kazandın!</div>
        {stars < 3 && (
          <button onClick={() => { setPhase(lessonId === 'mixed-review' ? 'quiz' : 'learn') }} style={{
            padding:'14px 28px', background:'white', border:'1px solid var(--border)', borderRadius:14,
            color:'var(--navy)', fontWeight:700, fontSize:15, cursor:'pointer'
          }}>
            🔄 Tekrar Dene
          </button>
        )}
        <button onClick={onBack} style={{ padding:'16px 36px', background:'linear-gradient(135deg,var(--gold),var(--gold-light))', color:'var(--navy)', border:'none', borderRadius:16, fontSize:17, fontWeight:800, cursor:'pointer', boxShadow:'var(--shadow-md)' }}>
          Ana Sayfaya Dön 🏠
        </button>
      </div>
    )
  }

  const LESSON_TITLES = {
    'letters-1':'Harfler: أ → خ', 'letters-2':'Harfler: د → ض', 'letters-3':'Harfler: ط → ك', 'letters-4':'Harfler: ل → ي',
    'hareke-1':'Üstün (a sesi)', 'hareke-2':'Esre (i sesi)', 'hareke-3':'Ötre (u sesi)',
    'syllable-1':'Üstün ile Hece', 'syllable-2':'Esre ile Hece', 'syllable-3':'Ötre ile Hece',
    'words':"Kur'an Kelimeleri", 'letter-forms':'Harf Formları',
    'adv-hareke-1':'Sükun', 'adv-hareke-2':'Şedde', 'adv-hareke-3':'Tenvin',
    'fatiha':'Fatiha Suresi', 'ihlas':'İhlâs Suresi', 'nas':'Nâs Suresi',
    'mixed-review':'🏆 Genel Tekrar Sınavı',
  }

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', overflow:'hidden' }}>
      <div style={{ background:'linear-gradient(135deg, var(--navy) 0%, var(--navy-mid) 100%)', padding:'14px 16px', flexShrink:0, display:'flex', alignItems:'center', gap:10 }}>
        <button onClick={onBack} style={{ width:36, height:36, borderRadius:10, background:'rgba(255,255,255,0.2)', border:'none', color:'white', fontSize:16, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>←</button>
        <div style={{ flex:1 }}>
          <div style={{ color:'rgba(255,255,255,0.5)', fontSize:11 }}>{phase==='quiz' ? '📝 Quiz Zamanı!' : '📖 Öğreniyoruz'}</div>
          <div style={{ color:'white', fontWeight:800, fontSize:15 }}>{LESSON_TITLES[lessonId]}</div>
        </div>
        {isDone && <div style={{ background:'rgba(255,255,255,0.2)', borderRadius:20, padding:'4px 10px' }}><span style={{ color:'white', fontSize:11, fontWeight:700 }}>✅ Tamam</span></div>}
      </div>
      <div style={{ flex:1, overflowY:'auto', WebkitOverflowScrolling:'touch' }}>
        {phase === 'learn' ? renderLearn() : <Quiz lessonId={lessonId} onFinish={finish}/>}
      </div>
    </div>
  )
}
