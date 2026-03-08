import { useState, useEffect } from 'react'
import { LETTERS, HAREKELER, SYLLABLES, WORDS, SURAS, LETTER_FORMS } from '../data/curriculum'
import { speak } from '../utils/audio'

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5) }

// Tüm ayahları düz liste olarak al
const ALL_AYAHS = SURAS.flatMap(s => s.ayahs)

function buildQuestions(lessonId) {
  const N = 6 // soru sayısı

  // --- Harfler ---
  if (lessonId.startsWith('letters')) {
    const groupMap = { 'letters-1':[0,7], 'letters-2':[7,15], 'letters-3':[15,21], 'letters-4':[21,28] }
    const [from, to] = groupMap[lessonId]
    const letters = LETTERS.slice(from, to)
    return shuffle(letters).slice(0, N).map(l => ({
      question: l.ar, questionAr: true,
      prompt: 'Bu harf hangisi?',
      correct: l.name,
      hint: `Bu harf "${l.name}" — Arapça harflerin ${LETTERS.indexOf(l)+1}. harfi`,
      options: shuffle([l.name, ...shuffle(LETTERS.filter(x => x.ar !== l.ar)).slice(0,3).map(x => x.name)])
    }))
  }

  // --- Hareke ---
  if (lessonId.startsWith('hareke')) {
    const hIdx = { 'hareke-1':0, 'hareke-2':1, 'hareke-3':2 }[lessonId]
    const h = HAREKELER[hIdx]
    const letters = LETTERS.slice(0, 14) // daha geniş havuz
    return shuffle(letters).slice(0, N).map(l => {
      const ar = l.ar + h.symbol
      const wrongH = HAREKELER.filter((_, i) => i !== hIdx)
      const correctRead = l.name[0] + h.sound
      return {
        question: ar, questionAr: true,
        prompt: 'Bu hece nasıl okunur?',
        correct: correctRead,
        hint: `${l.name} harfi + ${h.name} = "${correctRead}"`,
        options: shuffle([correctRead, l.name[0]+wrongH[0].sound, l.name[0]+wrongH[1].sound, LETTERS[Math.floor(Math.random()*14)].name[0]+h.sound])
      }
    })
  }

  // --- Hece ---
  if (lessonId.startsWith('syllable')) {
    const hMap = { 'syllable-1':'üstün', 'syllable-2':'esre', 'syllable-3':'ötre' }
    const filtered = SYLLABLES.filter(s => s.hareke === hMap[lessonId])
    return shuffle(filtered).slice(0, N).map(s => ({
      question: s.ar, questionAr: true,
      prompt: 'Bu hece hangisi?',
      correct: s.tr,
      hint: `Bu hece "${s.tr}" okunur`,
      options: shuffle([s.tr, ...shuffle(SYLLABLES.filter(x => x.ar !== s.ar)).slice(0,3).map(x => x.tr)])
    }))
  }

  // --- Kelimeler ---
  if (lessonId === 'words') {
    return shuffle(WORDS).slice(0, N).map(w => ({
      question: w.ar, questionAr: true,
      prompt: 'Bu kelime nasıl okunur?',
      correct: w.tr,
      hint: `"${w.ar}" → "${w.tr}" (${w.meaning})`,
      options: shuffle([w.tr, ...shuffle(WORDS.filter(x => x.ar !== w.ar)).slice(0,3).map(x => x.tr)])
    }))
  }

  // --- Harf Formları ---
  if (lessonId === 'letter-forms') {
    const formLabels = ['isolated','initial','medial','final']
    const formNames = { isolated:'Tek/Yalnız', initial:'Başta', medial:'Ortada', final:'Sonda' }
    return shuffle(LETTER_FORMS).slice(0, N).map(lf => {
      const formKey = shuffle(formLabels)[0]
      const correct = formNames[formKey]
      const wrongOptions = Object.entries(formNames).filter(([k]) => k !== formKey).map(([, v]) => v)
      return {
        question: lf[formKey], questionAr: true,
        prompt: `"${lf.name}" harfinin bu formu nerede kullanılır?`,
        correct,
        hint: `"${lf.name}" harfinin bu formu kelimede ${correct.toLowerCase()} yazıldığında kullanılır`,
        options: shuffle([correct, ...shuffle(wrongOptions).slice(0,3)])
      }
    })
  }

  // --- İleri Hareke: Sükun ---
  if (lessonId === 'adv-hareke-1') {
    const sukunWords = [
      { ar:'قُلْ', correct:'Kul', opts:['Kul','Kulu','Kula','Kuli'], hint:'Lam harfinin üzerinde sükun var — sessiz biter' },
      { ar:'مِنْ', correct:'Min', opts:['Min','Mina','Mini','Minu'], hint:'Nun harfinde sükun — sessiz n' },
      { ar:'رَبْ', correct:'Rab', opts:['Rab','Raba','Rabi','Rabu'], hint:'Be harfinde sükun — b sessiz' },
      { ar:'عَبْد', correct:'Abd', opts:['Abd','Abad','Abid','Abud'], hint:'Be harfinde sükun — sessiz geçiş' },
      { ar:'أَمْر', correct:'Emr', opts:['Emr','Emre','Emri','Emru'], hint:'Mim harfinde sükun — m sessiz' },
      { ar:'يَرْزُق', correct:'Yerzuk', opts:['Yerzuk','Yerezuk','Yarzuk','Yirzuk'], hint:'Re harfinde sükun' },
    ]
    return shuffle(sukunWords).slice(0, N).map(q => ({
      question: q.ar, questionAr: true,
      prompt: 'Sükunla bu kelime nasıl okunur?',
      correct: q.correct, hint: q.hint,
      options: shuffle(q.opts)
    }))
  }

  // --- İleri Hareke: Şedde ---
  if (lessonId === 'adv-hareke-2') {
    const şeddeWords = [
      { ar:'رَبَّ', correct:'Rabbe', opts:['Rabbe','Rabe','Rabb','Rabba'], hint:'Be harfinde şedde — "bb" çift ses' },
      { ar:'إِنَّ', correct:'İnne', opts:['İnne','İne','İna','İnu'], hint:'Nun harfinde şedde — "nn" çift' },
      { ar:'أُمٌّ', correct:'Ümmun', opts:['Ümmun','Ümun','Ümm','Umm'], hint:'Mim harfinde şedde — "mm" çift' },
      { ar:'حَجَّ', correct:'Hacce', opts:['Hacce','Hace','Hac','Hacca'], hint:'Cim harfinde şedde' },
      { ar:'عَزَّ', correct:'Azze', opts:['Azze','Aze','Az','Azz'], hint:'Ze harfinde şedde' },
      { ar:'بَيَّنَ', correct:'Beyyene', opts:['Beyyene','Beyne','Benne','Biyyene'], hint:'Ye harfinde şedde' },
    ]
    return shuffle(şeddeWords).slice(0, N).map(q => ({
      question: q.ar, questionAr: true,
      prompt: 'Şeddeyle bu kelime nasıl okunur?',
      correct: q.correct, hint: q.hint,
      options: shuffle(q.opts)
    }))
  }

  // --- İleri Hareke: Tenvin ---
  if (lessonId === 'adv-hareke-3') {
    const tenvinWords = [
      { ar:'كِتَابٌ', correct:'Kitâbun', opts:['Kitâbun','Kitâb','Kitâbin','Kitâban'], hint:'Üstte çift ötre → "un" sesi' },
      { ar:'رَجُلٌ', correct:'Racülun', opts:['Racülun','Racül','Racülin','Racülan'], hint:'Lam üzerinde tenvin ötre' },
      { ar:'عِلْمٌ', correct:'İlmun', opts:['İlmun','İlm','İlmin','İlman'], hint:'Mim üzerinde tenvin ötre' },
      { ar:'بَيْتٍ', correct:'Beytin', opts:['Beytin','Beyt','Beytun','Beyten'], hint:'Te üzerinde tenvin esre → "in"' },
      { ar:'رَجُلٍ', correct:'Racülin', opts:['Racülin','Racül','Racülun','Racülen'], hint:'Tenvin esre → "in" sesi' },
      { ar:'بَيْتًا', correct:'Beyten/Beytan', opts:['Beyten/Beytan','Beyt','Beytin','Beytun'], hint:'Tenvin üstün → "en/an" sesi' },
    ]
    return shuffle(tenvinWords).slice(0, N).map(q => ({
      question: q.ar, questionAr: true,
      prompt: 'Tenvinli bu kelime nasıl okunur?',
      correct: q.correct, hint: q.hint,
      options: shuffle(q.opts)
    }))
  }

  // --- Sure Quizleri ---
  if (['fatiha','ihlas','nas'].includes(lessonId)) {
    const suraMap = { fatiha:0, ihlas:1, nas:2 }
    const sura = SURAS[suraMap[lessonId]]
    const otherAyahs = ALL_AYAHS.filter(a => !sura.ayahs.find(sa => sa.ar === a.ar))
    return shuffle(sura.ayahs).slice(0, Math.min(N, sura.ayahs.length)).map(a => ({
      question: a.ar, questionAr: true,
      prompt: 'Bu ayet nasıl okunur?',
      correct: a.tr,
      hint: `"${a.tr}" — ${a.meaning}`,
      options: shuffle([a.tr, ...shuffle(otherAyahs).slice(0,3).map(x => x.tr)])
    }))
  }

  // --- Karışık Genel Tekrar ---
  if (lessonId === 'mixed-review') {
    const pool = []

    // 2 harf sorusu
    const randLetters = shuffle(LETTERS).slice(0, 2)
    randLetters.forEach(l => pool.push({
      question: l.ar, questionAr: true,
      prompt: 'Bu harf hangisi?', correct: l.name,
      hint: `Bu harf "${l.name}"`,
      options: shuffle([l.name, ...shuffle(LETTERS.filter(x=>x.ar!==l.ar)).slice(0,3).map(x=>x.name)])
    }))

    // 2 hece sorusu
    shuffle(SYLLABLES).slice(0,2).forEach(s => pool.push({
      question: s.ar, questionAr: true,
      prompt: 'Bu hece hangisi?', correct: s.tr,
      hint: `Bu hece "${s.tr}" okunur`,
      options: shuffle([s.tr, ...shuffle(SYLLABLES.filter(x=>x.ar!==s.ar)).slice(0,3).map(x=>x.tr)])
    }))

    // 2 kelime sorusu
    shuffle(WORDS).slice(0,2).forEach(w => pool.push({
      question: w.ar, questionAr: true,
      prompt: 'Bu kelime nasıl okunur?', correct: w.tr,
      hint: `"${w.tr}" (${w.meaning})`,
      options: shuffle([w.tr, ...shuffle(WORDS.filter(x=>x.ar!==w.ar)).slice(0,3).map(x=>x.tr)])
    }))

    // 2 sure ayeti sorusu
    shuffle(ALL_AYAHS).slice(0,2).forEach(a => pool.push({
      question: a.ar, questionAr: true,
      prompt: 'Bu ayet nasıl okunur?', correct: a.tr,
      hint: a.tr,
      options: shuffle([a.tr, ...shuffle(ALL_AYAHS.filter(x=>x.ar!==a.ar)).slice(0,3).map(x=>x.tr)])
    }))

    return shuffle(pool)
  }

  return []
}

export default function Quiz({ lessonId, onFinish }) {
  const [questions] = useState(() => buildQuestions(lessonId))
  const [idx, setIdx] = useState(0)
  const [selected, setSelected] = useState(null)
  const [correct, setCorrect] = useState(0)
  const [shake, setShake] = useState(false)
  const [showHint, setShowHint] = useState(false)

  if (!questions.length) { onFinish(3); return null }

  const q = questions[idx]
  const isLast = idx === questions.length - 1

  const answer = (opt) => {
    if (selected) return
    setSelected(opt)
    const isCorrect = opt === q.correct
    if (isCorrect) {
      setCorrect(c => c + 1)
      speak('أحسنت', 1.0)
    } else {
      setShake(true)
      setShowHint(true)
      speak(q.question)
      setTimeout(() => setShake(false), 500)
    }
    setTimeout(() => {
      if (isLast) {
        const total = questions.length
        const pct = (correct + (isCorrect ? 1 : 0)) / total
        const stars = pct >= 0.85 ? 3 : pct >= 0.55 ? 2 : 1
        onFinish(stars)
      } else {
        setSelected(null)
        setShowHint(false)
        setIdx(i => i + 1)
      }
    }, isCorrect ? 1200 : 2200)
  }

  return (
    <div style={{ padding:'20px 16px', display:'flex', flexDirection:'column', gap:16 }}>
      {/* Progress bar */}
      <div style={{ display:'flex', gap:5 }}>
        {questions.map((_, i) => (
          <div key={i} style={{
            flex:1, height:7, borderRadius:100,
            background: i < idx ? '#7c3aed' : i === idx ? '#a855f7' : '#e5e7eb',
            transition:'background 0.3s'
          }}/>
        ))}
      </div>

      <div style={{ textAlign:'center' }}>
        <div style={{ color:'#6b7280', fontSize:13, fontWeight:600, marginBottom:10 }}>
          Soru {idx+1}/{questions.length}
        </div>
        <div style={{ color:'#1e1b4b', fontWeight:700, fontSize:15, marginBottom:14 }}>{q.prompt}</div>

        <button onClick={() => speak(q.question)} style={{
          fontFamily:'Amiri, serif', fontSize: q.question.length > 20 ? 32 : q.question.length > 8 ? 42 : 60,
          color:'#7c3aed', background:'#f5f3ff',
          border:'3px solid #ddd6fe', borderRadius:20, padding:'18px 28px',
          cursor:'pointer', lineHeight:1.4, direction:'rtl',
          animation: shake ? 'shake 0.4s' : 'none',
          transition:'transform 0.1s', maxWidth:'100%', wordBreak:'break-all'
        }}>
          {q.question}
        </button>
        <div style={{ color:'#9ca3af', fontSize:12, marginTop:6 }}>🔊 Sese basmak için dokun</div>
      </div>

      {/* Hint — yanlış cevapta çıkar */}
      {showHint && (
        <div style={{
          background:'#fef3c7', border:'2px solid #fcd34d', borderRadius:14,
          padding:'12px 14px', fontSize:13, color:'#92400e', fontWeight:600
        }}>
          💡 {q.hint}
        </div>
      )}

      {/* Seçenekler */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
        {q.options.map((opt, i) => {
          const isCorrectOpt = opt === q.correct
          const isSelected = opt === selected
          let bg = 'white', border = '2px solid #e5e7eb', color = '#1e1b4b'
          if (isSelected && isCorrectOpt)  { bg='#dcfce7'; border='2px solid #4ade80'; color='#166534' }
          else if (isSelected && !isCorrectOpt) { bg='#fee2e2'; border='2px solid #f87171'; color='#991b1b' }
          else if (selected && isCorrectOpt)    { bg='#dcfce7'; border='2px solid #4ade80'; color='#166534' }
          return (
            <button key={i} onClick={() => answer(opt)} disabled={!!selected} style={{
              background:bg, border, borderRadius:14, padding:'14px 10px',
              cursor: selected ? 'default' : 'pointer',
              color, fontWeight:700, fontSize:14,
              display:'flex', alignItems:'center', justifyContent:'center', gap:4,
              boxShadow:'0 2px 6px rgba(0,0,0,0.06)', transition:'all 0.2s', minHeight:54,
              wordBreak:'break-word', textAlign:'center', lineHeight:1.3
            }}>
              {selected && isCorrectOpt && '✅ '}
              {selected && isSelected && !isCorrectOpt && '❌ '}
              {opt}
            </button>
          )
        })}
      </div>

      <style>{`
        @keyframes shake {
          0%,100%{transform:translateX(0)} 25%{transform:translateX(-8px)} 75%{transform:translateX(8px)}
        }
      `}</style>
    </div>
  )
}
