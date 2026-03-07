import { useState, useCallback } from 'react'
import { LETTERS, HAREKELER, SYLLABLES, WORDS, SURAS, speak } from '../data/curriculum'
import Quiz from './Quiz'

const COLORS = ['#7c3aed','#dc2626','#0891b2','#16a34a','#b45309','#db2777','#0284c7']

function SpeakBtn({ text, size=32 }) {
  const [active, setActive] = useState(false)
  const tap = () => {
    setActive(true)
    speak(text)
    setTimeout(()=>setActive(false), 600)
  }
  return (
    <button onClick={tap} style={{background:'none', border:'none', cursor:'pointer', fontSize:size, transition:'transform 0.1s', transform:active?'scale(1.3)':'scale(1)', padding:4}}>
      🔊
    </button>
  )
}

function LetterCard({ letter, idx, big=false }) {
  const [tapped, setTapped] = useState(false)
  const color = COLORS[idx % COLORS.length]
  const tap = () => {
    setTapped(true)
    speak(letter.ar)
    setTimeout(()=>setTapped(false), 400)
  }
  return (
    <button onClick={tap} style={{
      background:tapped?color:'white', border:`3px solid ${color}`,
      borderRadius:20, padding:big?'24px 20px':'16px 14px', cursor:'pointer',
      display:'flex', flexDirection:'column', alignItems:'center', gap:8,
      boxShadow:tapped?`0 6px 20px ${color}55`:'0 2px 8px rgba(0,0,0,0.08)',
      transform:tapped?'scale(0.95)':'scale(1)', transition:'all 0.15s', minWidth:big?80:70
    }}>
      <span style={{fontSize:big?52:40, color:tapped?'white':color, lineHeight:1, fontFamily:'Amiri, serif'}}>{letter.ar}</span>
      <span style={{fontSize:13, fontWeight:700, color:tapped?'white':'#374151'}}>{letter.name}</span>
    </button>
  )
}

function SyllableCard({ s, idx }) {
  const color = COLORS[idx % COLORS.length]
  const [tapped, setTapped] = useState(false)
  return (
    <button onClick={()=>{setTapped(true);speak(s.ar);setTimeout(()=>setTapped(false),400)}} style={{
      background:tapped?color:'white', border:`3px solid ${color}`, borderRadius:18, padding:'18px 14px',
      cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:6,
      transform:tapped?'scale(0.94)':'scale(1)', transition:'all 0.15s',
      boxShadow:tapped?`0 4px 16px ${color}55`:'0 2px 8px rgba(0,0,0,0.06)'
    }}>
      <span style={{fontSize:44, color:tapped?'white':color, fontFamily:'Amiri, serif', lineHeight:1}}>{s.ar}</span>
      <span style={{fontSize:14, fontWeight:800, color:tapped?'white':'#374151'}}>{s.tr}</span>
    </button>
  )
}

export default function LessonView({ lessonId, progress, onComplete, onBack }) {
  const [phase, setPhase] = useState('learn') // learn | quiz | done
  const [stars, setStars] = useState(0)

  const finish = useCallback((earnedStars) => {
    setStars(earnedStars)
    setPhase('done')
    onComplete(lessonId, earnedStars)
  }, [lessonId, onComplete])

  const isDone = progress[lessonId]?.done

  const renderLearn = () => {
    // Letters
    if (lessonId.startsWith('letters')) {
      const groupMap = {'letters-1':[0,7],'letters-2':[7,15],'letters-3':[15,21],'letters-4':[21,28]}
      const [from, to] = groupMap[lessonId]
      const letters = LETTERS.slice(from, to)
      return (
        <div style={{padding:'16px 14px', display:'flex', flexDirection:'column', gap:20}}>
          <div style={{background:'#f0fdf4', borderRadius:16, padding:'14px 16px', border:'2px solid #bbf7d0'}}>
            <div style={{fontWeight:800, color:'#166534', fontSize:15, marginBottom:4}}>👆 Dokun ve Dinle!</div>
            <div style={{color:'#15803d', fontSize:14}}>Her harfe dokunduğunda sesini duyacaksın.</div>
          </div>
          <div style={{display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10}}>
            {letters.map((l,i)=><LetterCard key={i} letter={l} idx={i} big/>)}
          </div>
          <button onClick={()=>setPhase('quiz')} style={{padding:'16px', background:'linear-gradient(135deg,#7c3aed,#a855f7)', color:'white', border:'none', borderRadius:16, fontSize:16, fontWeight:800, cursor:'pointer', boxShadow:'0 4px 16px #7c3aed55'}}>
            Quize Geç ✏️
          </button>
        </div>
      )
    }

    // Hareke
    if (lessonId.startsWith('hareke')) {
      const hIdx = {'hareke-1':0,'hareke-2':1,'hareke-3':2}[lessonId]
      const h = HAREKELER[hIdx]
      const examples = LETTERS.slice(0,8).map(l=>({
        ar: l.ar + h.symbol,
        tr: l.name.split('').join('') + h.sound,
        full: l.ar + h.symbol
      }))
      return (
        <div style={{padding:'16px 14px', display:'flex', flexDirection:'column', gap:16}}>
          {/* Hareke açıklaması */}
          <div style={{background:`${h.color}15`, border:`2px solid ${h.color}55`, borderRadius:20, padding:'20px', textAlign:'center'}}>
            <div style={{fontSize:52, color:h.color, fontFamily:'Amiri, serif', marginBottom:8}}>بَ</div>
            <div style={{fontWeight:800, fontSize:18, color:h.color, marginBottom:4}}>{h.name} — "{h.sound}" sesi</div>
            <div style={{color:'#374151', fontSize:14}}>{h.desc}</div>
            <SpeakBtn text={'بَ'} size={28}/>
          </div>
          <div style={{background:'#fef9f0', borderRadius:14, padding:'12px 14px', border:'1px solid #fde68a'}}>
            <div style={{fontWeight:700, color:'#92400e', fontSize:14}}>👆 Dokun, dinle ve tekrar et!</div>
          </div>
          <div style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8}}>
            {LETTERS.slice(0,8).map((l,i)=>{
              const ar = l.ar + h.symbol
              const [t,setT]=useState(false)
              return (
                <button key={i} onClick={()=>{setT(true);speak(ar,0.6);setTimeout(()=>setT(false),400)}} style={{
                  background:t?h.color:'white', border:`2px solid ${h.color}`, borderRadius:14,
                  padding:'14px 8px', cursor:'pointer', display:'flex', flexDirection:'column', alignItems:'center', gap:4,
                  transform:t?'scale(0.94)':'scale(1)', transition:'all 0.15s'
                }}>
                  <span style={{fontSize:32, color:t?'white':h.color, fontFamily:'Amiri, serif', lineHeight:1}}>{ar}</span>
                  <span style={{fontSize:11, fontWeight:700, color:t?'white':'#374151'}}>{l.name[0]+h.sound}</span>
                </button>
              )
            })}
          </div>
          <button onClick={()=>setPhase('quiz')} style={{padding:'16px', background:`linear-gradient(135deg,${h.color},${h.color}cc)`, color:'white', border:'none', borderRadius:16, fontSize:16, fontWeight:800, cursor:'pointer'}}>
            Quize Geç ✏️
          </button>
        </div>
      )
    }

    // Syllables
    if (lessonId.startsWith('syllable')) {
      const hMap = {'syllable-1':'üstün','syllable-2':'esre','syllable-3':'ötre'}
      const filtered = SYLLABLES.filter(s=>s.hareke===hMap[lessonId])
      return (
        <div style={{padding:'16px 14px', display:'flex', flexDirection:'column', gap:16}}>
          <div style={{background:'#eff6ff', borderRadius:14, padding:'12px 16px', border:'2px solid #bfdbfe'}}>
            <div style={{fontWeight:800, color:'#1e40af', fontSize:15}}>👄 Seslendirerek Oku!</div>
            <div style={{color:'#1d4ed8', fontSize:13, marginTop:2}}>Her hecaye dokun, sesini duy ve tekrar et.</div>
          </div>
          <div style={{display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10}}>
            {filtered.map((s,i)=><SyllableCard key={i} s={s} idx={i}/>)}
          </div>
          <button onClick={()=>setPhase('quiz')} style={{padding:'16px', background:'linear-gradient(135deg,#0891b2,#0ea5e9)', color:'white', border:'none', borderRadius:16, fontSize:16, fontWeight:800, cursor:'pointer'}}>
            Quize Geç ✏️
          </button>
        </div>
      )
    }

    // Words
    if (lessonId === 'words') {
      return (
        <div style={{padding:'16px 14px', display:'flex', flexDirection:'column', gap:12}}>
          <div style={{background:'#f0fdf4', borderRadius:14, padding:'12px 16px', border:'2px solid #bbf7d0'}}>
            <div style={{fontWeight:800, color:'#166534', fontSize:15}}>📝 Kelimeleri Tanıyalım!</div>
            <div style={{color:'#15803d', fontSize:13, marginTop:2}}>Dokun, sesini duy, anlamını öğren.</div>
          </div>
          {WORDS.map((w,i)=>(
            <button key={i} onClick={()=>speak(w.ar,0.6)} style={{
              display:'flex', alignItems:'center', gap:14, padding:'16px', background:'white',
              border:'2px solid #d1fae5', borderRadius:16, cursor:'pointer', boxShadow:'0 2px 8px rgba(0,0,0,0.06)'
            }}>
              <span style={{fontSize:38, color:'#16a34a', fontFamily:'Amiri, serif', minWidth:70, textAlign:'center'}}>{w.ar}</span>
              <div style={{textAlign:'left'}}>
                <div style={{fontWeight:800, color:'#166534', fontSize:15}}>{w.tr}</div>
                <div style={{color:'#6b7280', fontSize:13}}>{w.meaning}</div>
              </div>
              <span style={{marginLeft:'auto', fontSize:22}}>🔊</span>
            </button>
          ))}
          <button onClick={()=>setPhase('quiz')} style={{padding:'16px', background:'linear-gradient(135deg,#16a34a,#22c55e)', color:'white', border:'none', borderRadius:16, fontSize:16, fontWeight:800, cursor:'pointer', marginTop:4}}>
            Quize Geç ✏️
          </button>
        </div>
      )
    }

    // Suras
    const suraMap = {fatiha:0, ihlas:1, nas:2}
    const sura = SURAS[suraMap[lessonId]]
    if (sura) {
      return (
        <div style={{padding:'16px 14px', display:'flex', flexDirection:'column', gap:12}}>
          <div style={{background:'#fff7ed', borderRadius:14, padding:'14px 16px', border:'2px solid #fed7aa', textAlign:'center'}}>
            <div style={{fontSize:28, marginBottom:4}}>{sura.emoji}</div>
            <div style={{fontWeight:800, color:'#9a3412', fontSize:16}}>{sura.name}</div>
            <div style={{color:'#ea580c', fontFamily:'Amiri, serif', fontSize:18, marginTop:4}}>{sura.nameAr}</div>
          </div>
          {sura.ayahs.map((a,i)=>(
            <div key={i} style={{background:'white', borderRadius:16, padding:'16px', border:'1px solid #e5e7eb', boxShadow:'0 1px 4px rgba(0,0,0,0.06)'}}>
              <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8}}>
                <div style={{width:28, height:28, borderRadius:'50%', background:'#b45309', display:'flex', alignItems:'center', justifyContent:'center'}}>
                  <span style={{color:'white', fontWeight:800, fontSize:13}}>{i+1}</span>
                </div>
                <SpeakBtn text={a.ar} size={24}/>
              </div>
              <div style={{fontFamily:'Amiri, serif', fontSize:28, color:'#1e1b4b', textAlign:'right', lineHeight:2, marginBottom:8}}>{a.ar}</div>
              <div style={{fontSize:13, color:'#7c3aed', fontStyle:'italic', marginBottom:4}}>{a.tr}</div>
              <div style={{fontSize:13, color:'#6b7280'}}>{a.meaning}</div>
            </div>
          ))}
          <button onClick={()=>speak(sura.ayahs.map(a=>a.ar).join(' '), 0.65)} style={{padding:'14px', background:'#fff7ed', border:'2px solid #fed7aa', borderRadius:14, color:'#9a3412', fontWeight:700, cursor:'pointer', fontSize:15}}>
            🔊 Tamamını Dinle
          </button>
          <button onClick={()=>finish(3)} style={{padding:'16px', background:'linear-gradient(135deg,#b45309,#d97706)', color:'white', border:'none', borderRadius:16, fontSize:16, fontWeight:800, cursor:'pointer'}}>
            Dersi Tamamladım ✅
          </button>
        </div>
      )
    }
    return null
  }

  if (phase === 'done') {
    return (
      <div style={{height:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:24, background:'#fef9f0', gap:16}}>
        <div style={{fontSize:80}}>🎉</div>
        <div style={{fontWeight:800, fontSize:26, color:'#1e1b4b', textAlign:'center'}}>Harika!</div>
        <div style={{fontSize:22, textAlign:'center'}}>{'⭐'.repeat(stars)}{'☆'.repeat(3-stars)}</div>
        <div style={{color:'#6b7280', fontSize:16, textAlign:'center'}}>+{stars} yıldız kazandın!</div>
        <button onClick={onBack} style={{marginTop:12, padding:'16px 36px', background:'linear-gradient(135deg,#7c3aed,#a855f7)', color:'white', border:'none', borderRadius:16, fontSize:17, fontWeight:800, cursor:'pointer', boxShadow:'0 4px 16px #7c3aed55'}}>
          Ana Sayfaya Dön 🏠
        </button>
      </div>
    )
  }

  const titles = {
    'letters-1':'Harfler: أ → خ','letters-2':'Harfler: د → ض','letters-3':'Harfler: ط → ك','letters-4':'Harfler: ل → ي',
    'hareke-1':'Üstün (a sesi)','hareke-2':'Esre (i sesi)','hareke-3':'Ötre (u sesi)',
    'syllable-1':'Üstün ile Hece','syllable-2':'Esre ile Hece','syllable-3':'Ötre ile Hece',
    'words':'Kur\'an Kelimeleri','fatiha':'Fatiha Suresi','ihlas':'İhlâs Suresi','nas':'Nâs Suresi'
  }

  return (
    <div style={{height:'100%', display:'flex', flexDirection:'column', overflow:'hidden'}}>
      {/* Header */}
      <div style={{background:'linear-gradient(135deg,#7c3aed,#a855f7)', padding:'14px 16px', flexShrink:0, display:'flex', alignItems:'center', gap:10}}>
        <button onClick={onBack} style={{width:38, height:38, borderRadius:10, background:'rgba(255,255,255,0.2)', border:'none', color:'white', fontSize:18, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center'}}>←</button>
        <div style={{flex:1}}>
          <div style={{color:'rgba(255,255,255,0.7)', fontSize:11}}>{phase==='quiz'?'📝 Quiz Zamanı!':'📖 Öğreniyoruz'}</div>
          <div style={{color:'white', fontWeight:800, fontSize:15}}>{titles[lessonId]}</div>
        </div>
        {isDone && <div style={{background:'rgba(255,255,255,0.2)', borderRadius:20, padding:'4px 10px'}}><span style={{color:'white', fontSize:12, fontWeight:700}}>✅ Tamam</span></div>}
      </div>

      <div style={{flex:1, overflowY:'auto', WebkitOverflowScrolling:'touch'}}>
        {phase === 'learn' ? renderLearn() : <Quiz lessonId={lessonId} onFinish={finish}/>}
      </div>
    </div>
  )
}
