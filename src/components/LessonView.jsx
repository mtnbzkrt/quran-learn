import { lessons, sections } from '../data/curriculum'

function ContentBlock({ block }) {
  switch (block.type) {
    case 'text':
      return <p style={{color:'#2d4a2d', lineHeight:1.85, fontSize:'0.95rem', whiteSpace:'pre-line', marginBottom:0}}>{block.text}</p>
    case 'heading':
      return <h3 style={{color:'#1a3a1a', fontWeight:700, fontSize:'1rem', paddingTop:4, borderBottom:'2px solid #e8f5e8', paddingBottom:6, marginBottom:0}}>{block.text}</h3>
    case 'arabic':
      return (
        <div style={{background:'#f0f9f0', border:'1px solid #c8e6c8', borderRadius:12, padding:'18px 16px', textAlign:'center'}}>
          <div className="arabic" style={{fontSize:'2rem', color:'#1a5c1a', lineHeight:1.8, marginBottom:8}}>{block.text}</div>
          {block.transliteration && <div style={{color:'#4a7a4a', fontSize:'0.85rem', fontStyle:'italic', marginBottom:4}}>{block.transliteration}</div>}
          {block.meaning && <div style={{color:'#2d4a2d', fontSize:'0.9rem', fontWeight:600}}>{block.meaning}</div>}
        </div>
      )
    case 'note':
      return <div style={{background:'#fff8e1', border:'1px solid #ffe082', borderRadius:10, padding:'12px 14px', fontSize:'0.88rem', color:'#5a4000', lineHeight:1.7}}>{block.text}</div>
    case 'list':
      return (
        <ul style={{listStyle:'none', display:'flex', flexDirection:'column', gap:8}}>
          {block.items.map((item,i) => (
            <li key={i} style={{background:'#f8faf8', border:'1px solid #e0ece0', borderRadius:8, padding:'10px 14px', fontSize:'0.9rem', color:'#2d4a2d', lineHeight:1.6}}>{item}</li>
          ))}
        </ul>
      )
    case 'arabic-table':
      return (
        <div style={{overflowX:'auto'}}>
          <table style={{width:'100%', borderCollapse:'collapse'}}>
            <tbody>
              {block.rows.map((row,ri) => (
                <tr key={ri}>
                  {row.map((cell,ci) => {
                    const isArabic = ci % 2 === 0
                    return (
                      <td key={ci} style={{padding:'8px 10px', border:'1px solid #e0ece0', background: isArabic ? '#f0f9f0' : 'white', textAlign:'center'}}>
                        {isArabic
                          ? <span className="arabic" style={{fontSize:'1.5rem', color:'#1a5c1a'}}>{cell}</span>
                          : <span style={{fontSize:'12px', color:'#4a7a4a', fontWeight:500}}>{cell}</span>}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    case 'arabic-cards':
      return (
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(130px,1fr))', gap:10}}>
          {block.cards.map((card,i) => (
            <div key={i} style={{background:'white', border:'1px solid #c8e6c8', borderRadius:12, padding:'16px 12px', textAlign:'center', boxShadow:'0 1px 3px rgba(0,0,0,0.05)'}}>
              <div className="arabic" style={{fontSize:'2.5rem', color:'#1a5c1a', marginBottom:6, lineHeight:1}}>{card.ar}</div>
              <div style={{fontWeight:700, color:'#1a3a1a', fontSize:'0.9rem', marginBottom:4}}>{card.name}</div>
              <div style={{fontSize:'11px', color:'#4a7a4a', lineHeight:1.4}}>{card.note}</div>
            </div>
          ))}
        </div>
      )
    default: return null
  }
}

export default function LessonView({ lessonId, progress, onComplete, onBack, onNext, onPrev }) {
  const lesson = lessons[lessonId]
  const section = sections.find(s => s.id === lesson.section)
  const isDone = !!progress[lessonId]
  const allIds = Object.keys(lessons).map(Number)
  const idx = allIds.indexOf(lessonId)
  const hasPrev = idx > 0
  const hasNext = idx < allIds.length - 1

  return (
    <div style={{maxWidth:680, margin:'0 auto', paddingBottom:100}}>
      {/* Top bar */}
      <div style={{position:'sticky', top:0, zIndex:10, background:'rgba(240,247,240,0.97)', backdropFilter:'blur(8px)', borderBottom:'1px solid #c8e6c8', padding:'12px 16px', display:'flex', alignItems:'center', gap:10}}>
        <button onClick={onBack} style={{background:'none', border:'none', fontSize:22, cursor:'pointer', color:'#2d6a2d', lineHeight:1, padding:'4px 8px'}}>←</button>
        <div style={{flex:1, minWidth:0}}>
          <div style={{fontSize:'11px', color:'#4a7a4a', fontWeight:600}}>{section.emoji} Bölüm {section.id}: {section.title}</div>
          <div style={{fontWeight:700, color:'#1a3a1a', fontSize:'0.95rem', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>Ders {lessonId}: {lesson.title}</div>
        </div>
        {isDone && <span style={{background:'#4caf50', color:'white', borderRadius:20, padding:'3px 10px', fontSize:'12px', fontWeight:700, flexShrink:0}}>✓ Tamamlandı</span>}
      </div>

      <div style={{padding:'20px 16px', display:'flex', flexDirection:'column', gap:16}}>
        {/* Content blocks */}
        {lesson.content.map((block, i) => (
          <ContentBlock key={i} block={block}/>
        ))}

        {/* Key points */}
        <div style={{background:'linear-gradient(135deg,#1a5c1a,#2d6a2d)', borderRadius:14, padding:'20px 18px', color:'white', marginTop:8}}>
          <div style={{fontWeight:700, fontSize:'0.95rem', marginBottom:12}}>📌 Bu Dersin Özeti</div>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8}}>
            {lesson.keyPoints.map((kp,i) => (
              <div key={i} style={{background:'rgba(255,255,255,0.12)', borderRadius:8, padding:'8px 10px', fontSize:'12px', lineHeight:1.4}}>✓ {kp}</div>
            ))}
          </div>
        </div>

        {/* Complete button */}
        {!isDone ? (
          <button onClick={()=>onComplete(lessonId)} style={{padding:'16px', background:'linear-gradient(135deg,#2d6a2d,#4caf50)', color:'white', border:'none', borderRadius:12, fontSize:'1rem', fontWeight:700, cursor:'pointer', boxShadow:'0 4px 16px rgba(45,106,45,0.35)'}}>
            ✅ Dersi Tamamladım
          </button>
        ) : (
          <div style={{padding:'14px', background:'#e8f5e8', borderRadius:12, textAlign:'center', color:'#2d6a2d', fontWeight:600, fontSize:'0.95rem', border:'2px solid #4caf50'}}>
            ✅ Bu dersi tamamladınız!
          </div>
        )}

        {/* Prev / Next */}
        <div style={{display:'flex', gap:10}}>
          <button onClick={onPrev} disabled={!hasPrev} style={{flex:1, padding:'13px', background:hasPrev?'white':'#f0f0f0', color:hasPrev?'#2d6a2d':'#aaa', border:`1px solid ${hasPrev?'#c8e6c8':'#e0e0e0'}`, borderRadius:10, fontWeight:600, cursor:hasPrev?'pointer':'default', fontSize:'14px'}}>
            ← Önceki Ders
          </button>
          <button onClick={onNext} disabled={!hasNext} style={{flex:1, padding:'13px', background:hasNext?'#2d6a2d':'#f0f0f0', color:hasNext?'white':'#aaa', border:'none', borderRadius:10, fontWeight:600, cursor:hasNext?'pointer':'default', fontSize:'14px'}}>
            Sonraki Ders →
          </button>
        </div>
      </div>
    </div>
  )
}
