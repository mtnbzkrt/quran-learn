import { useState } from 'react'
import { SECTIONS, LESSON_LABELS, TOTAL_LESSONS, isUnlocked } from '../data/curriculum'

export default function Home({ progress, streak, onLesson }) {
  const [tab, setTab] = useState('learn') // 'learn' | 'stats'

  const done = Object.keys(progress).filter(k => progress[k]?.done).length
  const stars = Object.values(progress).reduce((s, p) => s + (p.stars || 0), 0)
  const pct = Math.round((done / TOTAL_LESSONS) * 100)

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', overflow:'hidden', background:'#fef9f0' }}>

      {/* Header */}
      <div style={{ background:'linear-gradient(135deg, var(--navy) 0%, var(--navy-mid) 100%)', padding:'20px 18px 16px', flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
          <div>
            <div style={{ color:'rgba(255,255,255,0.75)', fontSize:12, fontWeight:600 }}>Hoş geldin! 👋</div>
            <div style={{ color:'white', fontSize:20, fontWeight:800, marginTop:2 }}>Kur'an Öğreniyorum</div>
          </div>
          <div style={{ display:'flex', gap:8 }}>
            {/* Streak */}
            <div style={{ background:'rgba(255,255,255,0.15)', borderRadius:14, padding:'8px 12px', textAlign:'center' }}>
              <div style={{ fontSize:18 }}>🔥</div>
              <div style={{ color:'white', fontWeight:800, fontSize:14, marginTop:2 }}>{streak.current}</div>
              <div style={{ color:'rgba(255,255,255,0.7)', fontSize:10 }}>gün</div>
            </div>
            {/* Stars */}
            <div style={{ background:'rgba(255,255,255,0.15)', borderRadius:14, padding:'8px 12px', textAlign:'center' }}>
              <div style={{ fontSize:18 }}>⭐</div>
              <div style={{ color:'white', fontWeight:800, fontSize:14, marginTop:2 }}>{stars}</div>
              <div style={{ color:'rgba(255,255,255,0.7)', fontSize:10 }}>yıldız</div>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ background:'rgba(255,255,255,0.15)', borderRadius:12, padding:'10px 12px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
            <span style={{ color:'rgba(255,255,255,0.85)', fontSize:12, fontWeight:600 }}>İlerleme</span>
            <span style={{ color:'white', fontWeight:800, fontSize:12 }}>{done}/{TOTAL_LESSONS} ders · %{pct}</span>
          </div>
          <div style={{ background:'rgba(255,255,255,0.2)', borderRadius:100, height:8 }}>
            <div style={{ height:'100%', background:'#fde68a', borderRadius:100, width:`${pct}%`, transition:'width 0.6s', minWidth: done > 0 ? 8 : 0 }}/>
          </div>
        </div>

        {/* Tab bar */}
        <div style={{ display:'flex', gap:6, marginTop:12 }}>
          {[['learn','📚 Dersler'],['stats','📊 İstatistik']].map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)} style={{
              flex:1, padding:'8px', borderRadius:10, border:'none', cursor:'pointer',
              background: tab === key ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)',
              color: 'white', fontWeight: tab === key ? 800 : 600, fontSize:13,
              borderBottom: tab === key ? '2px solid white' : '2px solid transparent'
            }}>{label}</button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex:1, overflowY:'auto', WebkitOverflowScrolling:'touch', padding:'14px 14px 20px' }}>

        {tab === 'stats' ? (
          <StatsPanel progress={progress} streak={streak} stars={stars} done={done}/>
        ) : (
          <>
            {SECTIONS.map(section => (
              <div key={section.id} style={{ marginBottom:20 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
                  <span style={{ fontSize:18 }}>{section.emoji}</span>
                  <div>
                    <div style={{ fontWeight:800, color:'#1e1b4b', fontSize:14 }}>{section.title}</div>
                    <div style={{ fontSize:11, color:'#6b7280' }}>{section.sub}</div>
                  </div>
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
                  {section.lessons.map(lessonId => {
                    const p = progress[lessonId] || {}
                    const isDone = p.done
                    const lessonStars = p.stars || 0
                    const unlocked = isUnlocked(lessonId, progress)
                    return (
                      <button key={lessonId} onClick={() => unlocked && onLesson(lessonId)} style={{
                        display:'flex', alignItems:'center', gap:12, padding:'13px 14px',
                        background: unlocked ? 'white' : '#f3f4f6',
                        border:'none', borderRadius:14, cursor: unlocked ? 'pointer' : 'default',
                        textAlign:'left', boxShadow: unlocked ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                        borderLeft:`4px solid ${isDone ? section.color : unlocked ? section.color+'66' : '#e5e7eb'}`
                      }}>
                        <div style={{
                          width:42, height:42, borderRadius:12, flexShrink:0,
                          background: isDone ? section.color : unlocked ? section.color+'22' : '#e5e7eb',
                          display:'flex', alignItems:'center', justifyContent:'center', fontSize:isDone ? 18 : 16
                        }}>
                          {isDone ? '✅' : unlocked ? section.emoji : '🔒'}
                        </div>
                        <div style={{ flex:1 }}>
                          <div style={{ fontSize:13, fontWeight:700, color: unlocked ? '#1e1b4b' : '#9ca3af' }}>
                            {LESSON_LABELS[lessonId]}
                          </div>
                          {isDone
                            ? <div style={{ marginTop:2, fontSize:13 }}>{'⭐'.repeat(lessonStars)}{'☆'.repeat(3-lessonStars)}</div>
                            : unlocked
                              ? <div style={{ fontSize:11, color:'#9ca3af', marginTop:2 }}>Başla →</div>
                              : <div style={{ fontSize:11, color:'#9ca3af', marginTop:2 }}>Önceki dersi tamamla</div>
                          }
                        </div>
                        {isDone && lessonStars < 3 && (
                          <div style={{ fontSize:11, color:'#9ca3af', background:'#f3f4f6', padding:'4px 8px', borderRadius:8 }}>Tekrar</div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}

function StatsPanel({ progress, streak, stars, done }) {
  const sectionData = [
    { label:'Harfler',       lessons:['letters-1','letters-2','letters-3','letters-4'], emoji:'🔤' },
    { label:'Harekeler',     lessons:['hareke-1','hareke-2','hareke-3'], emoji:'🎵' },
    { label:'Heceler',       lessons:['syllable-1','syllable-2','syllable-3'], emoji:'👄' },
    { label:'Kelimeler',     lessons:['words'], emoji:'📝' },
    { label:'Harf Formları', lessons:['letter-forms'], emoji:'🔠' },
    { label:'İleri İşaret',  lessons:['adv-hareke-1','adv-hareke-2','adv-hareke-3'], emoji:'🎯' },
    { label:'Sureler',       lessons:['fatiha','ihlas','nas'], emoji:'🕌' },
    { label:'Genel Tekrar',  lessons:['mixed-review'], emoji:'🏆' },
  ]

  const maxStarsTotal = TOTAL_LESSONS * 3

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:14 }}>

      {/* Genel özet */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
        {[
          { label:'Toplam Ders', value:`${done}/${TOTAL_LESSONS}`, emoji:'📚', color:'#7c3aed' },
          { label:'Toplam Yıldız', value:`${stars}/${maxStarsTotal}`, emoji:'⭐', color:'#f59e0b' },
          { label:'Günlük Seri 🔥', value:`${streak.current} gün`, emoji:'🔥', color:'#ef4444' },
          { label:'En İyi Seri', value:`${streak.max} gün`, emoji:'🏅', color:'#16a34a' },
        ].map((s, i) => (
          <div key={i} style={{ background:'white', borderRadius:14, padding:'14px', boxShadow:'0 2px 8px rgba(0,0,0,0.06)', textAlign:'center' }}>
            <div style={{ fontSize:22, marginBottom:4 }}>{s.emoji}</div>
            <div style={{ fontWeight:800, fontSize:18, color:s.color }}>{s.value}</div>
            <div style={{ fontSize:11, color:'#6b7280', marginTop:2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Bölüm bazlı ilerleme */}
      <div style={{ background:'white', borderRadius:16, padding:'16px', boxShadow:'0 2px 8px rgba(0,0,0,0.06)' }}>
        <div style={{ fontWeight:800, color:'#1e1b4b', fontSize:14, marginBottom:12 }}>Bölüm İlerlemesi</div>
        {sectionData.map((sec, i) => {
          const total = sec.lessons.length
          const doneCount = sec.lessons.filter(l => progress[l]?.done).length
          const secStars = sec.lessons.reduce((s, l) => s + (progress[l]?.stars || 0), 0)
          const pct = total > 0 ? (doneCount / total) * 100 : 0
          const colors = ['#7c3aed','#dc2626','#0891b2','#16a34a','#7e22ce','#0284c7','#b45309','#db2777']
          const color = colors[i % colors.length]
          return (
            <div key={i} style={{ marginBottom:10 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4, alignItems:'center' }}>
                <span style={{ fontSize:13, fontWeight:600, color:'#374151' }}>{sec.emoji} {sec.label}</span>
                <span style={{ fontSize:12, color:'#6b7280' }}>
                  {doneCount}/{total} · {'⭐'.repeat(secStars)}
                </span>
              </div>
              <div style={{ background:'#f3f4f6', borderRadius:100, height:6 }}>
                <div style={{ height:'100%', background:color, borderRadius:100, width:`${pct}%`, transition:'width 0.5s', minWidth: doneCount > 0 ? 6 : 0 }}/>
              </div>
            </div>
          )
        })}
      </div>

      {/* Motivasyon mesajı */}
      <div style={{ background:'linear-gradient(135deg,#7c3aed22,#a855f722)', border:'2px solid #ddd6fe', borderRadius:16, padding:'16px', textAlign:'center' }}>
        {done === 0 && <div><div style={{ fontSize:32, marginBottom:8 }}>🌱</div><div style={{ fontWeight:700, color:'#1e1b4b', fontSize:14 }}>Yolculuk başlıyor!</div><div style={{ color:'#6b7280', fontSize:13, marginTop:4 }}>İlk derse başla ve ilerlemeye başla.</div></div>}
        {done > 0 && done < 10 && <div><div style={{ fontSize:32, marginBottom:8 }}>🚀</div><div style={{ fontWeight:700, color:'#1e1b4b', fontSize:14 }}>Harika gidiyorsun!</div><div style={{ color:'#6b7280', fontSize:13, marginTop:4 }}>Her gün biraz daha ilerle.</div></div>}
        {done >= 10 && done < TOTAL_LESSONS && <div><div style={{ fontSize:32, marginBottom:8 }}>🌟</div><div style={{ fontWeight:700, color:'#1e1b4b', fontSize:14 }}>Çok iyi ilerliyorsun!</div><div style={{ color:'#6b7280', fontSize:13, marginTop:4 }}>{TOTAL_LESSONS - done} ders kaldı, bitirmek üzeresin!</div></div>}
        {done === TOTAL_LESSONS && <div><div style={{ fontSize:32, marginBottom:8 }}>🏆</div><div style={{ fontWeight:700, color:'#1e1b4b', fontSize:14 }}>Tüm dersler tamamlandı!</div><div style={{ color:'#6b7280', fontSize:13, marginTop:4 }}>Harika bir başarı, maşallah!</div></div>}
      </div>
    </div>
  )
}
