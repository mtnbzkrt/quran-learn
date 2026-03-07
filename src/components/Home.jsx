import { sections, lessons } from '../data/curriculum'

export default function Home({ progress, onLesson }) {
  const total = Object.keys(lessons).length
  const done = Object.values(progress).filter(Boolean).length
  const pct = Math.round((done/total)*100)

  return (
    <div style={{height:'100%', display:'flex', flexDirection:'column', overflow:'hidden'}}>
      {/* Header */}
      <div style={{background:'linear-gradient(135deg,#1a5c1a,#2d8a2d)', padding:'28px 20px 20px', flexShrink:0}}>
        <div style={{display:'flex', alignItems:'center', gap:14, marginBottom:20}}>
          <div style={{width:50, height:50, borderRadius:14, background:'rgba(255,255,255,0.15)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:28}}>📖</div>
          <div>
            <h1 style={{color:'white', fontWeight:800, fontSize:'1.2rem', lineHeight:1.2}}>Kur'an Öğreniyorum</h1>
            <p style={{color:'rgba(255,255,255,0.7)', fontSize:'13px', marginTop:3}}>Adım adım, ders ders</p>
          </div>
        </div>
        {/* Progress */}
        <div style={{background:'rgba(255,255,255,0.12)', borderRadius:14, padding:'14px 16px'}}>
          <div style={{display:'flex', justifyContent:'space-between', marginBottom:8}}>
            <span style={{color:'rgba(255,255,255,0.85)', fontSize:'13px', fontWeight:600}}>Genel İlerleme</span>
            <span style={{color:'white', fontSize:'13px', fontWeight:800}}>{done}/{total}</span>
          </div>
          <div style={{background:'rgba(255,255,255,0.2)', borderRadius:100, height:7}}>
            <div style={{height:'100%', background:'#7fff7f', borderRadius:100, width:`${pct}%`, transition:'width 0.6s ease'}}/>
          </div>
          <div style={{color:'rgba(255,255,255,0.6)', fontSize:'12px', marginTop:6}}>%{pct} tamamlandı</div>
        </div>
      </div>

      {/* Scrollable list */}
      <div style={{flex:1, overflowY:'auto', WebkitOverflowScrolling:'touch', padding:'12px 14px 20px'}}>
        {sections.map(section => {
          const sDone = section.lessons.filter(id => progress[id]).length
          const allDone = sDone === section.lessons.length
          return (
            <div key={section.id} style={{marginBottom:16}}>
              {/* Section title */}
              <div style={{display:'flex', alignItems:'center', gap:8, padding:'8px 4px', marginBottom:8}}>
                <span style={{fontSize:18}}>{section.emoji}</span>
                <span style={{fontWeight:700, color:'#1a3a1a', fontSize:'14px', flex:1}}>Bölüm {section.id}: {section.title}</span>
                <span style={{fontSize:'12px', color:'#4a7a4a', fontWeight:600, background:'#e8f5e8', padding:'2px 8px', borderRadius:10}}>
                  {sDone}/{section.lessons.length}
                </span>
                {allDone && <span style={{fontSize:16}}>✅</span>}
              </div>

              {/* Lesson cards */}
              <div style={{display:'flex', flexDirection:'column', gap:8}}>
                {section.lessons.map(id => {
                  const lesson = lessons[id]
                  const isDone = !!progress[id]
                  return (
                    <button key={id} onClick={()=>onLesson(id)} style={{
                      display:'flex', alignItems:'center', gap:12, padding:'14px 16px',
                      background:'white', border:'none', borderRadius:14, cursor:'pointer',
                      textAlign:'left', boxShadow:'0 1px 4px rgba(0,0,0,0.06)',
                      borderLeft:`4px solid ${isDone?'#4caf50':'#e0e0e0'}`
                    }}>
                      <div style={{
                        width:36, height:36, borderRadius:10, flexShrink:0,
                        background:isDone?'#4caf50':'#f5f5f5',
                        display:'flex', alignItems:'center', justifyContent:'center',
                        fontSize:isDone?16:13, color:isDone?'white':'#999', fontWeight:700
                      }}>{isDone?'✓':id}</div>
                      <div style={{flex:1, minWidth:0}}>
                        <div style={{fontSize:'14px', fontWeight:600, color:'#1a3a1a', lineHeight:1.3}}>{lesson.title}</div>
                        {isDone && <div style={{fontSize:'11px', color:'#4caf50', fontWeight:600, marginTop:3}}>Tamamlandı</div>}
                      </div>
                      <span style={{color:'#bbb', fontSize:18, flexShrink:0}}>›</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
        <div style={{height:20}}/>
      </div>
    </div>
  )
}
