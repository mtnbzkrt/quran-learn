import { useState, useEffect } from 'react'
import { LETTERS, HAREKELER, SYLLABLES, WORDS, speak } from '../data/curriculum'

function shuffle(arr) { return [...arr].sort(()=>Math.random()-0.5) }

function buildQuestions(lessonId) {
  // Letters quiz
  if (lessonId.startsWith('letters')) {
    const groupMap = {'letters-1':[0,7],'letters-2':[7,15],'letters-3':[15,21],'letters-4':[21,28]}
    const [from,to] = groupMap[lessonId]
    const letters = LETTERS.slice(from, to)
    const all = LETTERS
    return shuffle(letters).slice(0,4).map(l => ({
      question: l.ar,
      questionAr: true,
      prompt: 'Bu harf hangisi?',
      correct: l.name,
      options: shuffle([l.name, ...shuffle(all.filter(x=>x.ar!==l.ar)).slice(0,3).map(x=>x.name)])
    }))
  }
  // Hareke quiz
  if (lessonId.startsWith('hareke')) {
    const hIdx = {'hareke-1':0,'hareke-2':1,'hareke-3':2}[lessonId]
    const h = HAREKELER[hIdx]
    const letters = LETTERS.slice(0,8)
    return shuffle(letters).slice(0,4).map(l => {
      const ar = l.ar + h.symbol
      const wrongH = HAREKELER.filter((_,i)=>i!==hIdx)
      return {
        question: ar,
        questionAr: true,
        prompt: 'Bu hece nasıl okunur?',
        correct: l.name[0] + h.sound,
        options: shuffle([l.name[0]+h.sound, l.name[0]+wrongH[0].sound, l.name[0]+wrongH[1].sound, LETTERS[8].name[0]+h.sound])
      }
    })
  }
  // Syllable quiz
  if (lessonId.startsWith('syllable')) {
    const hMap = {'syllable-1':'üstün','syllable-2':'esre','syllable-3':'ötre'}
    const filtered = SYLLABLES.filter(s=>s.hareke===hMap[lessonId])
    const allSyl = SYLLABLES
    return shuffle(filtered).slice(0,4).map(s=>({
      question: s.ar,
      questionAr: true,
      prompt: 'Bu hece hangisi?',
      correct: s.tr,
      options: shuffle([s.tr, ...shuffle(allSyl.filter(x=>x.ar!==s.ar)).slice(0,3).map(x=>x.tr)])
    }))
  }
  // Words quiz
  if (lessonId === 'words') {
    return shuffle(WORDS).slice(0,4).map(w=>({
      question: w.ar,
      questionAr: true,
      prompt: 'Bu kelimenin anlamı nedir?',
      correct: w.meaning,
      options: shuffle([w.meaning, ...shuffle(WORDS.filter(x=>x.ar!==w.ar)).slice(0,3).map(x=>x.meaning)])
    }))
  }
  return []
}

export default function Quiz({ lessonId, onFinish }) {
  const [questions] = useState(()=>buildQuestions(lessonId))
  const [idx, setIdx] = useState(0)
  const [selected, setSelected] = useState(null)
  const [correct, setCorrect] = useState(0)
  const [shake, setShake] = useState(false)

  if (!questions.length) { onFinish(3); return null }

  const q = questions[idx]
  const isLast = idx === questions.length - 1

  const answer = (opt) => {
    if (selected) return
    setSelected(opt)
    if (opt === q.correct) {
      setCorrect(c=>c+1)
      speak('أحسنت', 1.0) // Aferin
    } else {
      setShake(true)
      speak(q.question)
      setTimeout(()=>setShake(false), 500)
    }
    setTimeout(()=>{
      if (isLast) {
        const total = questions.length
        const pct = (correct + (opt===q.correct?1:0)) / total
        const stars = pct >= 0.9 ? 3 : pct >= 0.6 ? 2 : 1
        onFinish(stars)
      } else {
        setSelected(null)
        setIdx(i=>i+1)
      }
    }, 1200)
  }

  return (
    <div style={{padding:'20px 16px', display:'flex', flexDirection:'column', gap:20}}>
      {/* Progress */}
      <div style={{display:'flex', gap:6}}>
        {questions.map((_,i)=>(
          <div key={i} style={{flex:1, height:6, borderRadius:100, background:i<idx?'#7c3aed':i===idx?'#a855f7':'#e5e7eb', transition:'background 0.3s'}}/>
        ))}
      </div>

      <div style={{textAlign:'center'}}>
        <div style={{color:'#6b7280', fontSize:14, fontWeight:600, marginBottom:12}}>Soru {idx+1}/{questions.length}</div>
        <div style={{color:'#1e1b4b', fontWeight:700, fontSize:15, marginBottom:16}}>{q.prompt}</div>
        <button onClick={()=>speak(q.question)} style={{
          fontFamily:'Amiri, serif', fontSize:64, color:'#7c3aed', background:'#f5f3ff',
          border:'3px solid #ddd6fe', borderRadius:24, padding:'20px 32px',
          cursor:'pointer', lineHeight:1.2, animation:shake?'shake 0.4s':'none',
          transform:shake?'translateX(-4px)':'translateX(0)', transition:'transform 0.1s'
        }}>
          {q.question}
        </button>
        <div style={{color:'#9ca3af', fontSize:13, marginTop:8}}>🔊 Sese basmak için dokun</div>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10}}>
        {q.options.map((opt,i)=>{
          const isCorrect = opt === q.correct
          const isSelected = opt === selected
          let bg = 'white', border = '2px solid #e5e7eb', color = '#1e1b4b'
          if (isSelected && isCorrect) { bg='#dcfce7'; border='2px solid #4ade80'; color='#166534' }
          else if (isSelected && !isCorrect) { bg='#fee2e2'; border='2px solid #f87171'; color='#991b1b' }
          else if (selected && isCorrect) { bg='#dcfce7'; border='2px solid #4ade80'; color='#166534' }
          return (
            <button key={i} onClick={()=>answer(opt)} disabled={!!selected} style={{
              background:bg, border, borderRadius:16, padding:'16px 12px', cursor:selected?'default':'pointer',
              color, fontWeight:700, fontSize:15, display:'flex', alignItems:'center', justifyContent:'center', gap:6,
              boxShadow:'0 2px 8px rgba(0,0,0,0.06)', transition:'all 0.2s', minHeight:56
            }}>
              {selected && isCorrect && '✅ '}
              {selected && isSelected && !isCorrect && '❌ '}
              {opt}
            </button>
          )
        })}
      </div>

      <style>{`
        @keyframes shake {
          0%,100%{transform:translateX(0)}
          25%{transform:translateX(-8px)}
          75%{transform:translateX(8px)}
        }
      `}</style>
    </div>
  )
}
