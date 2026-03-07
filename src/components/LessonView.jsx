import { useState, useRef } from 'react'
import { lessons, sections } from '../data/curriculum'

function Block({ b }) {
  switch(b.type) {
    case 'text':
      return <p style={{color:'#2d4a2d',lineHeight:1.9,fontSize:'15px',whiteSpace:'pre-line'}}>{b.text}</p>
    case 'heading':
      return <div style={{fontWeight:700,color:'#1a3a1a',fontSize:'15px',paddingTop:4,borderBottom:'2px solid #e8f5e8',paddingBottom:8}}>{b.text}</div>
    case 'arabic':
      return (
        <div style={{background:'#f0f9f0',border:'1px solid #c8e6c8',borderRadius:16,padding:'20px 16px',textAlign:'center'}}>
          <div className="arabic" style={{fontSize:'2.2rem',color:'#1a5c1a',lineHeight:1.8,marginBottom:10}}>{b.text}</div>
          {b.transliteration&&<div style={{color:'#4a7a4a',fontSize:'13px',fontStyle:'italic',marginBottom:6,padding:'4px 12px',background:'white',borderRadius:20,display:'inline-block'}}>{b.transliteration}</div>}
          {b.meaning&&<div style={{color:'#2d4a2d',fontSize:'14px',fontWeight:600,marginTop:6}}>{b.meaning}</div>}
        </div>
      )
    case 'note':
      return <div style={{background:'#fffde7',border:'1px solid #ffe082',borderRadius:12,padding:'14px 16px',fontSize:'14px',color:'#5a4000',lineHeight:1.75}}>{b.text}</div>
    case 'list':
      return (
        <div style={{display:'flex',flexDirection:'column',gap:8}}>
          {b.items.map((item,i)=>(
            <div key={i} style={{background:'#f8faf8',border:'1px solid #e0ece0',borderRadius:10,padding:'12px 14px',fontSize:'14px',color:'#2d4a2d',lineHeight:1.6}}>{item}</div>
          ))}
        </div>
      )
    case 'arabic-table':
      return (
        <div style={{overflowX:'auto',borderRadius:12,border:'1px solid #c8e6c8'}}>
          <table style={{width:'100%',borderCollapse:'collapse',minWidth:300}}>
            <tbody>
              {b.rows.map((row,ri)=>(
                <tr key={ri} style={{background:ri%2===0?'#f0f9f0':'white'}}>
                  {row.map((cell,ci)=>(
                    <td key={ci} style={{padding:'10px 12px',borderBottom:'1px solid #e0ece0',textAlign:'center'}}>
                      {ci%2===0
                        ?<span className="arabic" style={{fontSize:'1.8rem',color:'#1a5c1a',display:'block'}}>{cell}</span>
                        :<span style={{fontSize:'13px',color:'#4a7a4a',fontWeight:500}}>{cell}</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    case 'arabic-cards':
      return (
        <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:10}}>
          {b.cards.map((card,i)=>(
            <div key={i} style={{background:'white',border:'1px solid #c8e6c8',borderRadius:14,padding:'18px 12px',textAlign:'center',boxShadow:'0 1px 4px rgba(0,0,0,0.05)'}}>
              <div className="arabic" style={{fontSize:'3rem',color:'#1a5c1a',lineHeight:1,marginBottom:8}}>{card.ar}</div>
              <div style={{fontWeight:700,color:'#1a3a1a',fontSize:'14px',marginBottom:4}}>{card.name}</div>
              <div style={{fontSize:'12px',color:'#4a7a4a',lineHeight:1.4}}>{card.note}</div>
            </div>
          ))}
        </div>
      )
    default: return null
  }
}

export default function LessonView({ lessonId, progress, onComplete, onBack, onNext, onPrev }) {
  const lesson = lessons[lessonId]
  const section = sections.find(s=>s.id===lesson.section)
  const isDone = !!progress[lessonId]
  const allIds = Array.from({length:38},(_,i)=>i+1)
  const idx = allIds.indexOf(lessonId)
  const hasPrev = idx > 0
  const hasNext = idx < allIds.length-1

  return (
    <div style={{height:'100%',display:'flex',flexDirection:'column',overflow:'hidden'}}>
      {/* Sticky header */}
      <div style={{background:'linear-gradient(135deg,#1a5c1a,#2d8a2d)',padding:'16px 16px 14px',flexShrink:0}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <button onClick={onBack} style={{width:36,height:36,borderRadius:10,background:'rgba(255,255,255,0.15)',border:'none',color:'white',fontSize:18,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>←</button>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:'11px',color:'rgba(255,255,255,0.65)',fontWeight:600,marginBottom:2}}>{section.emoji} Bölüm {section.id} · Ders {lessonId}/38</div>
            <div style={{fontWeight:700,color:'white',fontSize:'15px',lineHeight:1.2,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{lesson.title}</div>
          </div>
          {isDone&&<div style={{background:'rgba(255,255,255,0.2)',borderRadius:20,padding:'4px 10px',color:'white',fontSize:'12px',fontWeight:700,flexShrink:0}}>✓ Tamam</div>}
        </div>
        {/* Mini progress bar */}
        <div style={{marginTop:12,background:'rgba(255,255,255,0.2)',borderRadius:100,height:3}}>
          <div style={{height:'100%',background:'#7fff7f',borderRadius:100,width:`${(idx/37)*100}%`}}/>
        </div>
      </div>

      {/* Scrollable content */}
      <div style={{flex:1,overflowY:'auto',WebkitOverflowScrolling:'touch',padding:'16px 16px 24px'}}>
        <div style={{display:'flex',flexDirection:'column',gap:16}}>
          {lesson.content.map((b,i)=><Block key={i} b={b}/>)}

          {/* Key points card */}
          <div style={{background:'linear-gradient(135deg,#1a5c1a,#2d6a2d)',borderRadius:16,padding:'18px 16px',color:'white'}}>
            <div style={{fontWeight:700,fontSize:'14px',marginBottom:12,display:'flex',alignItems:'center',gap:6}}>📌 Dersin Özeti</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
              {lesson.keyPoints.map((kp,i)=>(
                <div key={i} style={{background:'rgba(255,255,255,0.12)',borderRadius:10,padding:'10px 12px',fontSize:'12px',lineHeight:1.5}}>✓ {kp}</div>
              ))}
            </div>
          </div>

          {/* Complete */}
          {!isDone
            ? <button onClick={()=>onComplete(lessonId)} style={{padding:'18px',background:'linear-gradient(135deg,#2d6a2d,#4caf50)',color:'white',border:'none',borderRadius:16,fontSize:'16px',fontWeight:700,cursor:'pointer',boxShadow:'0 6px 20px rgba(45,106,45,0.35)',letterSpacing:'0.01em'}}>
                ✅ Dersi Tamamladım
              </button>
            : <div style={{padding:'16px',background:'#e8f5e8',borderRadius:16,textAlign:'center',color:'#2d6a2d',fontWeight:700,fontSize:'15px',border:'2px solid #4caf50'}}>
                ✅ Bu dersi tamamladınız!
              </div>
          }

          <div style={{height:8}}/>
        </div>
      </div>

      {/* Bottom nav — prev / next */}
      <div style={{flexShrink:0,background:'white',borderTop:'1px solid #e8f5e8',padding:'12px 16px',display:'flex',gap:10,paddingBottom:'calc(12px + env(safe-area-inset-bottom))'}}>
        <button onClick={onPrev} disabled={!hasPrev} style={{
          flex:1,padding:'14px',borderRadius:14,border:'none',
          background:hasPrev?'#f0f9f0':'#f5f5f5',
          color:hasPrev?'#2d6a2d':'#ccc',fontWeight:700,fontSize:'14px',cursor:hasPrev?'pointer':'default'
        }}>← Önceki</button>
        <button onClick={onNext} disabled={!hasNext} style={{
          flex:1,padding:'14px',borderRadius:14,border:'none',
          background:hasNext?'#2d6a2d':'#f5f5f5',
          color:hasNext?'white':'#ccc',fontWeight:700,fontSize:'14px',cursor:hasNext?'pointer':'default'
        }}>Sonraki →</button>
      </div>
    </div>
  )
}
