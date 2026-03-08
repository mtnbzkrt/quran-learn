import { useState } from 'react'
import { LETTERS, HAREKELER, SYLLABLES, WORDS, SURAS, LETTER_FORMS } from '../data/curriculum'
import { speak } from '../utils/audio'


// Web Audio API ile ses — dış dosya gerektirmez
function playCorrectSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const play = () => {
      const t = ctx.currentTime
      ;[880, 1100].forEach((freq, i) => {
        const osc  = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain); gain.connect(ctx.destination)
        osc.type = 'sine'
        osc.frequency.value = freq
        gain.gain.setValueAtTime(0, t + i * 0.12)
        gain.gain.linearRampToValueAtTime(0.3, t + i * 0.12 + 0.02)
        gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.12 + 0.18)
        osc.start(t + i * 0.12); osc.stop(t + i * 0.12 + 0.25)
      })
    }
    if (ctx.state === 'suspended') { ctx.resume().then(play) } else { play() }
  } catch(e) {}
}

function playWrongSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const play = () => {
      const osc  = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain); gain.connect(ctx.destination)
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(300, ctx.currentTime)
      osc.frequency.linearRampToValueAtTime(180, ctx.currentTime + 0.3)
      gain.gain.setValueAtTime(0.18, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3)
      osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.35)
    }
    if (ctx.state === 'suspended') { ctx.resume().then(play) } else { play() }
  } catch(e) {}
}

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5) }
const ALL_AYAHS = SURAS.flatMap(s => s.ayahs)

function buildQuestions(lessonId) {
  const N = 6

  if (lessonId.startsWith('letters')) {
    const groupMap = { 'letters-1':[0,7],'letters-2':[7,15],'letters-3':[15,21],'letters-4':[21,28] }
    const [from,to] = groupMap[lessonId]
    const letters = LETTERS.slice(from,to)
    return shuffle(letters).slice(0,N).map(l => ({
      question:l.ar, questionAr:true, prompt:'Bu harf hangisi?', correct:l.name,
      hint:`Bu harf "${l.name}"`,
      options:shuffle([l.name,...shuffle(LETTERS.filter(x=>x.ar!==l.ar)).slice(0,3).map(x=>x.name)])
    }))
  }
  if (lessonId.startsWith('hareke')) {
    const hIdx={'hareke-1':0,'hareke-2':1,'hareke-3':2}[lessonId]
    const h=HAREKELER[hIdx]
    return shuffle(LETTERS.slice(0,14)).slice(0,N).map(l=>{
      const ar=l.ar+h.symbol, cr=l.name[0]+h.sound
      const wH=HAREKELER.filter((_,i)=>i!==hIdx)
      return { question:ar,questionAr:true,prompt:'Bu hece nasıl okunur?',correct:cr,
        hint:`${l.name} + ${h.name} = "${cr}"`,
        options:shuffle([cr,l.name[0]+wH[0].sound,l.name[0]+wH[1].sound,LETTERS[Math.floor(Math.random()*14)].name[0]+h.sound]) }
    })
  }
  if (lessonId.startsWith('syllable')) {
    const hMap={'syllable-1':'üstün','syllable-2':'esre','syllable-3':'ötre'}
    const filtered=SYLLABLES.filter(s=>s.hareke===hMap[lessonId])
    return shuffle(filtered).slice(0,N).map(s=>({
      question:s.ar,questionAr:true,prompt:'Bu hece hangisi?',correct:s.tr,
      hint:`Bu hece "${s.tr}" okunur`,
      options:shuffle([s.tr,...shuffle(SYLLABLES.filter(x=>x.ar!==s.ar)).slice(0,3).map(x=>x.tr)])
    }))
  }
  if (lessonId==='words') {
    return shuffle(WORDS).slice(0,N).map(w=>({
      question:w.ar,questionAr:true,prompt:'Bu kelime nasıl okunur?',correct:w.tr,
      hint:`"${w.tr}" (${w.meaning})`,
      options:shuffle([w.tr,...shuffle(WORDS.filter(x=>x.ar!==w.ar)).slice(0,3).map(x=>x.tr)])
    }))
  }
  if (lessonId==='letter-forms') {
    const fLabels=['isolated','initial','medial','final']
    const fNames={isolated:'Tek/Yalnız',initial:'Başta',medial:'Ortada',final:'Sonda'}
    return shuffle(LETTER_FORMS).slice(0,N).map(lf=>{
      const k=shuffle(fLabels)[0], correct=fNames[k]
      const wrong=Object.entries(fNames).filter(([x])=>x!==k).map(([,v])=>v)
      return {question:lf[k],questionAr:true,prompt:`"${lf.name}" harfinin bu formu nerede kullanılır?`,
        correct,hint:`"${lf.name}" harfinin bu formu "${correct.toLowerCase()}" yazılışıdır`,
        options:shuffle([correct,...shuffle(wrong).slice(0,3)])}
    })
  }
  if (lessonId==='adv-hareke-1') {
    const qs=[
      {ar:'قُلْ',correct:'Kul',opts:['Kul','Kulu','Kula','Kuli'],hint:'Lam üzerinde sükun — sessiz kapanış'},
      {ar:'مِنْ',correct:'Min',opts:['Min','Mina','Mini','Minu'],hint:'Nun üzerinde sükun'},
      {ar:'رَبْ',correct:'Rab',opts:['Rab','Raba','Rabi','Rabu'],hint:'Be üzerinde sükun'},
      {ar:'عَبْد',correct:'Abd',opts:['Abd','Abad','Abid','Abud'],hint:'Be üzerinde sessiz geçiş'},
      {ar:'أَمْر',correct:'Emr',opts:['Emr','Emre','Emri','Emru'],hint:'Mim üzerinde sükun'},
      {ar:'يَرْزُق',correct:'Yerzuk',opts:['Yerzuk','Yerezuk','Yarzuk','Yirzuk'],hint:'Re üzerinde sükun'},
    ]
    return shuffle(qs).slice(0,N).map(q=>({question:q.ar,questionAr:true,prompt:'Sükunla bu kelime nasıl okunur?',correct:q.correct,hint:q.hint,options:shuffle(q.opts)}))
  }
  if (lessonId==='adv-hareke-2') {
    const qs=[
      {ar:'رَبَّ',correct:'Rabbe',opts:['Rabbe','Rabe','Rabb','Rabba'],hint:'Be üzerinde şedde — "bb"'},
      {ar:'إِنَّ',correct:'İnne',opts:['İnne','İne','İna','İnu'],hint:'Nun üzerinde şedde'},
      {ar:'أُمٌّ',correct:'Ümmun',opts:['Ümmun','Ümun','Ümm','Umm'],hint:'Mim üzerinde şedde'},
      {ar:'حَجَّ',correct:'Hacce',opts:['Hacce','Hace','Hac','Hacca'],hint:'Cim üzerinde şedde'},
      {ar:'عَزَّ',correct:'Azze',opts:['Azze','Aze','Az','Azz'],hint:'Ze üzerinde şedde'},
      {ar:'بَيَّنَ',correct:'Beyyene',opts:['Beyyene','Beyne','Benne','Biyyene'],hint:'Ye üzerinde şedde'},
    ]
    return shuffle(qs).slice(0,N).map(q=>({question:q.ar,questionAr:true,prompt:'Şeddeyle bu kelime nasıl okunur?',correct:q.correct,hint:q.hint,options:shuffle(q.opts)}))
  }
  if (lessonId==='adv-hareke-3') {
    const qs=[
      {ar:'كِتَابٌ',correct:'Kitâbun',opts:['Kitâbun','Kitâb','Kitâbin','Kitâban'],hint:'Tenvin ötre → "un"'},
      {ar:'رَجُلٌ',correct:'Racülun',opts:['Racülun','Racül','Racülin','Racülan'],hint:'Tenvin ötre → "un"'},
      {ar:'عِلْمٌ',correct:'İlmun',opts:['İlmun','İlm','İlmin','İlman'],hint:'Tenvin ötre → "un"'},
      {ar:'بَيْتٍ',correct:'Beytin',opts:['Beytin','Beyt','Beytun','Beyten'],hint:'Tenvin esre → "in"'},
      {ar:'رَجُلٍ',correct:'Racülin',opts:['Racülin','Racül','Racülun','Racülen'],hint:'Tenvin esre → "in"'},
      {ar:'بَيْتًا',correct:'Beyten',opts:['Beyten','Beyt','Beytin','Beytun'],hint:'Tenvin üstün → "en/an"'},
    ]
    return shuffle(qs).slice(0,N).map(q=>({question:q.ar,questionAr:true,prompt:'Tenvinli nasıl okunur?',correct:q.correct,hint:q.hint,options:shuffle(q.opts)}))
  }
  if (['fatiha','ihlas','nas'].includes(lessonId)) {
    const suraMap={fatiha:0,ihlas:1,nas:2}
    const sura=SURAS[suraMap[lessonId]]
    const others=ALL_AYAHS.filter(a=>!sura.ayahs.find(sa=>sa.ar===a.ar))
    return shuffle(sura.ayahs).slice(0,Math.min(N,sura.ayahs.length)).map(a=>({
      question:a.ar,questionAr:true,prompt:'Bu ayet nasıl okunur?',correct:a.tr,
      hint:`${a.tr} — ${a.meaning}`,
      options:shuffle([a.tr,...shuffle(others).slice(0,3).map(x=>x.tr)])
    }))
  }
  if (lessonId==='mixed-review') {
    const pool=[]
    shuffle(LETTERS).slice(0,2).forEach(l=>pool.push({question:l.ar,questionAr:true,prompt:'Bu harf hangisi?',correct:l.name,hint:`Bu harf "${l.name}"`,options:shuffle([l.name,...shuffle(LETTERS.filter(x=>x.ar!==l.ar)).slice(0,3).map(x=>x.name)])}))
    shuffle(SYLLABLES).slice(0,2).forEach(s=>pool.push({question:s.ar,questionAr:true,prompt:'Bu hece hangisi?',correct:s.tr,hint:`"${s.tr}"`,options:shuffle([s.tr,...shuffle(SYLLABLES.filter(x=>x.ar!==s.ar)).slice(0,3).map(x=>x.tr)])}))
    shuffle(WORDS).slice(0,2).forEach(w=>pool.push({question:w.ar,questionAr:true,prompt:'Bu kelime nasıl okunur?',correct:w.tr,hint:`"${w.tr}" (${w.meaning})`,options:shuffle([w.tr,...shuffle(WORDS.filter(x=>x.ar!==w.ar)).slice(0,3).map(x=>x.tr)])}))
    shuffle(ALL_AYAHS).slice(0,2).forEach(a=>pool.push({question:a.ar,questionAr:true,prompt:'Bu ayet nasıl okunur?',correct:a.tr,hint:a.tr,options:shuffle([a.tr,...shuffle(ALL_AYAHS.filter(x=>x.ar!==a.ar)).slice(0,3).map(x=>x.tr)])}))
    return shuffle(pool)
  }
  return []
}

export default function Quiz({ lessonId, onFinish }) {
  const [questions] = useState(() => buildQuestions(lessonId))
  const [idx, setIdx]         = useState(0)
  const [selected, setSelected] = useState(null)
  const [correct, setCorrect] = useState(0)
  const [shake, setShake]     = useState(false)
  const [showHint, setShowHint] = useState(false)

  if (!questions.length) { onFinish(3); return null }
  const q = questions[idx]
  const isLast = idx === questions.length - 1

  const answer = (opt) => {
    if (selected) return
    setSelected(opt)
    const isOk = opt === q.correct
    if (isOk) { setCorrect(c=>c+1); playCorrectSound() }
    else { setShake(true); setShowHint(true); playWrongSound(); speak(q.question); setTimeout(()=>setShake(false),500) }
    setTimeout(()=>{
      if (isLast) {
        const pct=(correct+(isOk?1:0))/questions.length
        onFinish(pct>=0.85?3:pct>=0.55?2:1)
      } else { setSelected(null); setShowHint(false); setIdx(i=>i+1) }
    }, isOk?1200:2200)
  }

  return (
    <div style={{ padding:'20px 16px', display:'flex', flexDirection:'column', gap:16 }}>
      {/* Progress — navy→gold */}
      <div style={{ display:'flex', gap:5 }}>
        {questions.map((_,i)=>(
          <div key={i} style={{
            flex:1, height:6, borderRadius:100,
            background: i<idx ? 'var(--gold)' : i===idx ? 'var(--navy-mid)' : 'var(--border)',
            transition:'background 0.3s'
          }}/>
        ))}
      </div>

      <div style={{ textAlign:'center' }}>
        <div style={{ color:'var(--text-muted)', fontSize:12, fontWeight:600, marginBottom:10 }}>Soru {idx+1}/{questions.length}</div>
        <div style={{ color:'var(--navy)', fontWeight:700, fontSize:15, marginBottom:14 }}>{q.prompt}</div>
        <button style={{
          fontFamily:'var(--font-arabic)', fontSize: q.question.length>20?32:q.question.length>8?42:60,
          color:'var(--navy)', background:'var(--cream)',
          border:'2px solid var(--border)', borderRadius:20, padding:'18px 28px',
          cursor:'pointer', lineHeight:1.4, direction:'rtl',
          animation: shake?'shake 0.4s':'none', transition:'transform 0.1s',
          maxWidth:'100%', wordBreak:'break-all',
          boxShadow:'var(--shadow-sm)'
        }}>
          {q.question}
        </button>

      </div>

      {showHint && selected && selected !== q.correct && (
        <div style={{ background:'#dcfce7', border:'2px solid #22c55e', borderRadius:12, padding:'12px 16px', display:'flex', alignItems:'center', gap:10 }}>
          <span style={{ fontSize:22 }}>✅</span>
          <div>
            <div style={{ fontSize:11, color:'#166534', fontWeight:700, marginBottom:2 }}>DOĞRU CEVAP</div>
            <div style={{ fontSize:16, color:'#14532d', fontWeight:800 }}>{q.correct}</div>
          </div>
        </div>
      )}
      {showHint && (
        <div style={{ background:'#fef9c3', border:'2px solid var(--gold)', borderRadius:12, padding:'12px 14px', fontSize:13, color:'var(--navy)', fontWeight:600 }}>
          💡 {q.hint}
        </div>
      )}

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
        {q.options.map((opt,i)=>{
          const isCorr=opt===q.correct, isSel=opt===selected
          let bg='white', border='1px solid var(--border)', color='var(--text)'
          if (isSel&&isCorr)       { bg='#dcfce7'; border='2px solid #4ade80'; color='#166534' }
          else if (isSel&&!isCorr) { bg='#fee2e2'; border='2px solid #f87171'; color='#991b1b' }
          else if (selected&&isCorr){ bg='#dcfce7'; border='2px solid #4ade80'; color='#166534' }
          return (
            <button key={i} onClick={()=>answer(opt)} disabled={!!selected} style={{
              background:bg, border, borderRadius:12, padding:'14px 10px',
              cursor:selected?'default':'pointer', color, fontWeight:700, fontSize:14,
              display:'flex',alignItems:'center',justifyContent:'center',gap:4,
              boxShadow:'var(--shadow-sm)', transition:'all 0.15s', minHeight:54,
              wordBreak:'break-word', textAlign:'center', lineHeight:1.3,
              fontFamily:'var(--font-ui)'
            }}>
              {selected&&isCorr&&'✅ '}
              {selected&&isSel&&!isCorr&&'❌ '}
              {opt}
            </button>
          )
        })}
      </div>

      <style>{`@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-8px)}75%{transform:translateX(8px)}}`}</style>
    </div>
  )
}
