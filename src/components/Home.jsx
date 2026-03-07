import { sections, lessons } from '../data/curriculum'

export default function Home({ progress, onLesson }) {
  const total = Object.keys(lessons).length
  const done = Object.values(progress).filter(Boolean).length

  return (
    <div style={{maxWidth:680, margin:'0 auto', padding:'20px 16px 80px'}}>
      {/* Header */}
      <div style={{textAlign:'center', padding:'32px 0 28px'}}>
        <div style={{fontSize:48, marginBottom:12}}>📖</div>
        <h1 style={{fontSize:'1.8rem', fontWeight:800, color:'#1a3a1a', marginBottom:6}}>Kur'an Öğreniyorum</h1>
        <p style={{color:'#4a7a4a', fontSize:'0.95rem'}}>Adım adım, ders ders</p>

        {/* Progress bar */}
        <div style={{marginTop:20, background:'#e8f5e8', borderRadius:100, height:8, overflow:'hidden'}}>
          <div style={{height:'100%', background:'linear-gradient(90deg,#2d6a2d,#4caf50)', borderRadius:100, width:`${(done/total)*100}%`, transition:'width 0.5s'}}/>
        </div>
        <div style={{marginTop:8, color:'#4a7a4a', fontSize:'13px', fontWeight:600}}>
          {done}/{total} ders tamamlandı
        </div>
      </div>

      {/* Sections */}
      {sections.map(section => {
        const sLessons = section.lessons
        const sDone = sLessons.filter(id => progress[id]).length
        const allDone = sDone === sLessons.length
        return (
          <div key={section.id} style={{marginBottom:20}}>
            {/* Section header */}
            <div style={{display:'flex', alignItems:'center', gap:10, marginBottom:10, padding:'10px 14px', background:'white', borderRadius:12, boxShadow:'0 1px 4px rgba(0,0,0,0.06)', border:`2px solid ${allDone ? '#4caf50' : '#e8f5e8'}`}}>
              <span style={{fontSize:22}}>{section.emoji}</span>
              <div style={{flex:1}}>
                <div style={{fontWeight:700, color:'#1a3a1a', fontSize:'0.95rem'}}>Bölüm {section.id}: {section.title}</div>
                <div style={{fontSize:'12px', color:'#888', marginTop:2}}>{sDone}/{sLessons.length} ders</div>
              </div>
              {allDone && <span style={{color:'#4caf50', fontSize:20}}>✅</span>}
            </div>

            {/* Lessons */}
            <div style={{display:'flex', flexDirection:'column', gap:6, paddingLeft:8}}>
              {sLessons.map(id => {
                const lesson = lessons[id]
                const isDone = !!progress[id]
                return (
                  <button key={id} onClick={()=>onLesson(id)}
                    style={{
                      display:'flex', alignItems:'center', gap:12, padding:'12px 16px',
                      background:'white', border:'none', borderRadius:10, cursor:'pointer',
                      boxShadow:'0 1px 3px rgba(0,0,0,0.06)', textAlign:'left',
                      borderLeft:`3px solid ${isDone ? '#4caf50' : '#ddd'}`
                    }}>
                    <div style={{
                      width:28, height:28, borderRadius:'50%', flexShrink:0,
                      background:isDone ? '#4caf50' : '#f0f0f0',
                      display:'flex', alignItems:'center', justifyContent:'center',
                      fontSize:isDone ? 14 : 13, color:isDone ? 'white' : '#999', fontWeight:700
                    }}>{isDone ? '✓' : id}</div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:'14px', fontWeight:600, color:'#1a3a1a'}}>{lesson.title}</div>
                    </div>
                    <span style={{color:'#aaa', fontSize:14}}>›</span>
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
