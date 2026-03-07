import { SECTIONS, LESSONS } from '../data/curriculum'

export default function Home({ progress, onLesson }) {
  const totalLessons = 15 // toplam ders sayısı
  const done = Object.keys(progress).filter(k => progress[k]?.done).length
  const stars = Object.values(progress).reduce((s,p) => s + (p.stars||0), 0)

  return (
    <div style={{height:'100%', display:'flex', flexDirection:'column', overflow:'hidden', background:'#fef9f0'}}>
      {/* Header */}
      <div style={{background:'linear-gradient(135deg,#7c3aed,#a855f7)', padding:'24px 20px 20px', flexShrink:0}}>
        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16}}>
          <div>
            <div style={{color:'rgba(255,255,255,0.8)', fontSize:13, fontWeight:600}}>Hoş geldin! 👋</div>
            <div style={{color:'white', fontSize:22, fontWeight:800, marginTop:2}}>Kur'an Öğreniyorum</div>
          </div>
          <div style={{background:'rgba(255,255,255,0.2)', borderRadius:16, padding:'10px 16px', textAlign:'center'}}>
            <div style={{color:'#fde68a', fontSize:22}}>⭐</div>
            <div style={{color:'white', fontWeight:800, fontSize:16}}>{stars}</div>
          </div>
        </div>

        {/* Progress */}
        <div style={{background:'rgba(255,255,255,0.15)', borderRadius:14, padding:'12px 14px'}}>
          <div style={{display:'flex', justifyContent:'space-between', marginBottom:6}}>
            <span style={{color:'rgba(255,255,255,0.85)', fontSize:13, fontWeight:600}}>İlerleme</span>
            <span style={{color:'white', fontWeight:800, fontSize:13}}>{done}/{totalLessons} ders</span>
          </div>
          <div style={{background:'rgba(255,255,255,0.2)', borderRadius:100, height:8}}>
            <div style={{height:'100%', background:'#fde68a', borderRadius:100, width:`${(done/totalLessons)*100}%`, transition:'width 0.5s'}}/>
          </div>
        </div>
      </div>

      {/* Lessons */}
      <div style={{flex:1, overflowY:'auto', WebkitOverflowScrolling:'touch', padding:'16px 14px 20px'}}>
        {SECTIONS.map(section => (
          <div key={section.id} style={{marginBottom:20}}>
            <div style={{display:'flex', alignItems:'center', gap:8, marginBottom:10}}>
              <span style={{fontSize:20}}>{section.emoji}</span>
              <div>
                <div style={{fontWeight:800, color:'#1e1b4b', fontSize:15}}>{section.title}</div>
                <div style={{fontSize:12, color:'#6b7280'}}>{section.sub}</div>
              </div>
            </div>
            <div style={{display:'flex', flexDirection:'column', gap:8}}>
              {section.lessons.map(lessonId => {
                const p = progress[lessonId] || {}
                const isDone = p.done
                const lessonStars = p.stars || 0
                const labels = {
                  'letters-1':'Harfler 1–7 (أ→خ)', 'letters-2':'Harfler 8–15 (د→ض)',
                  'letters-3':'Harfler 16–21 (ط→ك)', 'letters-4':'Harfler 22–28 (ل→ي)',
                  'hareke-1':'Üstün — "a" sesi 🔴', 'hareke-2':'Esre — "i" sesi 🔵', 'hareke-3':'Ötre — "u" sesi 🟢',
                  'syllable-1':'Üstün ile Hece (ba, ta...)', 'syllable-2':'Esre ile Hece (bi, ti...)', 'syllable-3':'Ötre ile Hece (bu, tu...)',
                  'words':'Kur\'an\'dan Kelimeler', 'fatiha':'Fatiha Suresi', 'ihlas':'İhlâs Suresi', 'nas':'Nâs Suresi'
                }
                return (
                  <button key={lessonId} onClick={()=>onLesson(lessonId)} style={{
                    display:'flex', alignItems:'center', gap:12, padding:'14px 16px',
                    background:'white', border:'none', borderRadius:16, cursor:'pointer',
                    textAlign:'left', boxShadow:'0 2px 8px rgba(0,0,0,0.08)',
                    borderLeft:`4px solid ${isDone ? section.color : '#e5e7eb'}`
                  }}>
                    <div style={{width:44, height:44, borderRadius:14, background:isDone?section.color:'#f3f4f6', display:'flex', alignItems:'center', justifyContent:'center', fontSize:isDone?20:18, flexShrink:0}}>
                      {isDone ? '✅' : section.emoji}
                    </div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:14, fontWeight:700, color:'#1e1b4b'}}>{labels[lessonId]}</div>
                      {isDone
                        ? <div style={{marginTop:3}}>{'⭐'.repeat(lessonStars)}{'☆'.repeat(3-lessonStars)}</div>
                        : <div style={{fontSize:12, color:'#9ca3af', marginTop:2}}>Başla →</div>
                      }
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
