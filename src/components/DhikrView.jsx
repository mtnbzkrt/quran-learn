import { useState, useRef } from 'react'
import { DHIKR_LIST, DHIKR_CATEGORIES } from '../data/dhikr'
import { speak } from '../utils/audio'

const STORAGE_KEY = 'dhikr-data'
function loadData() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}') } catch { return {} } }
function saveData(d) { localStorage.setItem(STORAGE_KEY, JSON.stringify(d)) }

export default function DhikrView({ onStatsChange }) {
  const [data, setData]       = useState(loadData)
  const [cat, setCat]         = useState('hepsi')
  const [active, setActive]   = useState(null)
  const [showAdd, setShowAdd] = useState(false)
  const [showDetail, setShowDetail] = useState(null)
  const [form, setForm]       = useState({ ar:'', tr:'', anlam:'', adet:33, fazilet:'' })

  const update = (d) => {
    setData(d); saveData(d)
    onStatsChange?.({ totalCount: [...DHIKR_LIST,...(d.custom||[])].reduce((s,z)=>s+(d.counts?.[z.id]||0),0) })
  }

  const getCount   = (id) => data.counts?.[id]||0
  const getSession = (id) => data.sessions?.[id]||0

  const tap = (z) => {
    const counts   = {...(data.counts||{}),  [z.id]:(data.counts?.[z.id]||0)+1}
    const sessions = {...(data.sessions||{}), [z.id]:(data.sessions?.[z.id]||0)+1}
    const upd = {...data, counts, sessions}
    if (sessions[z.id]===z.adet) { speak('أحسنت'); upd.sessions[z.id]=0 }
    update(upd)
  }

  const resetSession = (id) => update({...data, sessions:{...(data.sessions||{}), [id]:0}})

  const addCustom = () => {
    if (!form.tr.trim()) return
    const id='custom_'+Date.now()
    const custom=[...(data.custom||[]),{...form,id,kategori:'ozel',kategoriLabel:'Özel',emoji:'📿'}]
    update({...data,custom}); setForm({ar:'',tr:'',anlam:'',adet:33,fazilet:''}); setShowAdd(false)
  }

  const allDhikr = [...DHIKR_LIST,...(data.custom||[])]
  const filtered = cat==='hepsi' ? allDhikr : cat==='ozel' ? (data.custom||[]) : allDhikr.filter(z=>z.kategori===cat)

  // ── Sayaç ekranı ──────────────────────────────────────────────────────────
  if (active) {
    const z=allDhikr.find(z=>z.id===active)
    if (!z) { setActive(null); return null }
    const session=getSession(z.id), total=getCount(z.id)
    const pct=Math.min(100,(session/z.adet)*100)
    const done=pct>=100
    const [anim,setAnim]=useState(false)
    const doTap=()=>{ setAnim(true); tap(z); setTimeout(()=>setAnim(false),150) }
    return (
      <div style={{height:'100%',display:'flex',flexDirection:'column',overflow:'hidden'}}>
        <div style={{background:'linear-gradient(135deg,var(--navy),var(--navy-mid))',padding:'14px 16px',display:'flex',gap:10,alignItems:'center',flexShrink:0}}>
          <button onClick={()=>setActive(null)} style={{background:'rgba(255,255,255,0.12)',border:'none',color:'white',width:36,height:36,borderRadius:10,cursor:'pointer',fontSize:16}}>←</button>
          <div style={{flex:1}}>
            <div style={{color:'rgba(255,255,255,0.5)',fontSize:11}}>Aktif Zikir</div>
            <div style={{color:'white',fontWeight:800,fontSize:15}}>{z.emoji} {z.tr}</div>
          </div>
          <button onClick={()=>{setActive(null);setShowDetail(z)}} style={{background:'rgba(255,255,255,0.12)',border:'none',color:'rgba(255,255,255,0.7)',width:36,height:36,borderRadius:10,cursor:'pointer',fontSize:16}}>ℹ️</button>
        </div>
        <div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'24px 20px',gap:18,background:'var(--cream)'}}>
          <div style={{fontFamily:'var(--font-arabic)',fontSize:30,color:'var(--navy)',textAlign:'center',lineHeight:1.8,direction:'rtl',padding:'16px 20px',background:'white',borderRadius:18,border:'1px solid var(--border)',boxShadow:'var(--shadow-sm)',width:'100%'}}>
            {z.ar}
          </div>
          <div style={{color:'var(--text-muted)',fontSize:13,fontStyle:'italic'}}>{z.tr}</div>

          {/* Sayaç */}
          <div style={{textAlign:'center'}}>
            <div style={{fontSize:76,fontWeight:900,color:done?'var(--green)':'var(--navy)',lineHeight:1,fontVariantNumeric:'tabular-nums'}}>{session}</div>
            <div style={{fontSize:14,color:'var(--text-muted)',marginTop:4}}>/ {z.adet} hedef</div>
          </div>

          {/* Halka */}
          <svg width={100} height={100} style={{transform:'rotate(-90deg)'}}>
            <circle cx={50} cy={50} r={42} fill="none" stroke="var(--border)" strokeWidth={8}/>
            <circle cx={50} cy={50} r={42} fill="none" stroke={done?'var(--green)':'var(--gold)'} strokeWidth={8}
              strokeDasharray={`${2*Math.PI*42}`}
              strokeDashoffset={`${2*Math.PI*42*(1-pct/100)}`}
              strokeLinecap="round" style={{transition:'stroke-dashoffset 0.3s'}}/>
          </svg>

          {done && <div style={{background:'#dcfce7',border:'1px solid #4ade80',borderRadius:14,padding:'10px 20px',textAlign:'center'}}>
            <div style={{fontWeight:800,color:'#166534'}}>✅ {z.adet} tamamlandı!</div>
          </div>}

          {/* TAP */}
          <button onPointerDown={doTap} style={{
            width:130,height:130,borderRadius:'50%',
            background:anim?'var(--navy-mid)':'linear-gradient(135deg,var(--navy),var(--navy-mid))',
            border:'4px solid var(--gold)',color:'var(--gold)',
            fontSize:20,fontWeight:800,cursor:'pointer',
            transform:anim?'scale(0.93)':'scale(1)',transition:'all 0.12s',
            boxShadow:'var(--shadow-lg)',userSelect:'none',
            display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:3,
            fontFamily:'var(--font-ui)'
          }}>
            <span style={{fontSize:28}}>{z.emoji}</span>
            <span style={{fontSize:11,letterSpacing:'0.08em'}}>DOKUN</span>
          </button>

          <div style={{display:'flex',gap:12,alignItems:'center'}}>
            <button onClick={()=>resetSession(z.id)} style={{background:'white',border:'1px solid var(--border)',color:'var(--text-muted)',borderRadius:10,padding:'9px 18px',cursor:'pointer',fontWeight:600,fontSize:13,fontFamily:'var(--font-ui)'}}>🔄 Sıfırla</button>
            <div style={{color:'var(--text-light)',fontSize:12}}>Toplam: {total.toLocaleString('tr')}</div>
          </div>
        </div>
      </div>
    )
  }

  // ── Detay ekranı ──────────────────────────────────────────────────────────
  if (showDetail) {
    const z=showDetail
    return (
      <div style={{height:'100%',display:'flex',flexDirection:'column',overflow:'hidden'}}>
        <div style={{background:'linear-gradient(135deg,var(--navy),var(--navy-mid))',padding:'14px 16px',display:'flex',gap:10,alignItems:'center',flexShrink:0}}>
          <button onClick={()=>setShowDetail(null)} style={{background:'rgba(255,255,255,0.12)',border:'none',color:'white',width:36,height:36,borderRadius:10,cursor:'pointer',fontSize:16}}>←</button>
          <div style={{color:'white',fontWeight:800,fontSize:15}}>{z.emoji} {z.tr}</div>
        </div>
        <div className="scroll-y" style={{flex:1,padding:'16px 14px',display:'flex',flexDirection:'column',gap:12}}>
          <div className="card" style={{padding:'20px',textAlign:'center'}}>
            <div style={{fontFamily:'var(--font-arabic)',fontSize:34,color:'var(--navy)',lineHeight:1.8,direction:'rtl',marginBottom:8}}>{z.ar}</div>
            <div style={{fontWeight:700,color:'var(--text)',fontSize:14}}>{z.tr}</div>
          </div>
          <InfoCard icon="📖" title="Anlamı"              text={z.anlam}/>
          <InfoCard icon="🎯" title={`Önerilen: ${z.adet} defa`} text={z.fazilet}/>
          <InfoCard icon="📚" title="İmam Gazali — İhya'dan" text={z.gazali||'Bu zikir için özel not eklenmemiş.'} dark/>
          <button onClick={()=>{setShowDetail(null);setActive(z.id)}} style={{padding:'16px',background:'linear-gradient(135deg,var(--gold),var(--gold-light))',color:'var(--navy)',border:'none',borderRadius:16,fontSize:16,fontWeight:800,cursor:'pointer',fontFamily:'var(--font-ui)'}}>
            {z.emoji} Zikre Başla
          </button>
        </div>
      </div>
    )
  }

  // ── Ana liste ─────────────────────────────────────────────────────────────
  return (
    <div style={{height:'100%',display:'flex',flexDirection:'column',overflow:'hidden'}}>
      <div style={{background:'linear-gradient(135deg,var(--navy),var(--navy-mid))',padding:'14px 16px',flexShrink:0}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
          <div>
            <div style={{color:'rgba(255,255,255,0.5)',fontSize:11}}>Bugüne kadar</div>
            <div style={{color:'white',fontWeight:800,fontSize:18}}>📿 {([...DHIKR_LIST,...(data.custom||[])].reduce((s,z)=>s+(data.counts?.[z.id]||0),0)).toLocaleString('tr')} zikir</div>
          </div>
          <button onClick={()=>setShowAdd(true)} style={{background:'rgba(201,151,44,0.2)',border:'1px solid rgba(201,151,44,0.4)',color:'var(--gold-light)',borderRadius:10,padding:'8px 14px',cursor:'pointer',fontWeight:700,fontSize:13,fontFamily:'var(--font-ui)'}}>
            + Yeni Zikir
          </button>
        </div>
        <div className="scroll-x" style={{display:'flex',gap:6}}>
          {DHIKR_CATEGORIES.map(c=>(
            <button key={c.id} onClick={()=>setCat(c.id)} style={{
              background:cat===c.id?'var(--gold)':'rgba(255,255,255,0.1)',
              color:cat===c.id?'var(--navy)':'rgba(255,255,255,0.8)',
              border:'none',borderRadius:20,padding:'5px 12px',cursor:'pointer',fontWeight:700,fontSize:11,whiteSpace:'nowrap',flexShrink:0,fontFamily:'var(--font-ui)'
            }}>{c.label}</button>
          ))}
        </div>
      </div>

      <div className="scroll-y" style={{flex:1,padding:'12px 14px',display:'flex',flexDirection:'column',gap:10}}>
        {filtered.length===0 && <div style={{textAlign:'center',padding:40,color:'var(--text-muted)'}}>Bu kategoride zikir yok.</div>}
        {filtered.map(z=>{
          const session=getSession(z.id), total=getCount(z.id), isCustom=z.id.startsWith('custom_')
          return (
            <div key={z.id} className="card" style={{padding:'14px',borderLeft:'3px solid var(--gold)'}}>
              <div style={{display:'flex',alignItems:'flex-start',gap:10}}>
                <div style={{width:42,height:42,borderRadius:12,background:'var(--gold-pale)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,flexShrink:0}}>{z.emoji}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontWeight:800,color:'var(--navy)',fontSize:14}}>{z.tr}</div>
                  <div style={{fontFamily:'var(--font-arabic)',fontSize:18,color:'var(--text)',lineHeight:1.4,direction:'rtl',marginTop:2}}>{z.ar}</div>
                  <div style={{fontSize:11,color:'var(--text-muted)',marginTop:2}}>Hedef: {z.adet}x · Toplam: {total.toLocaleString('tr')}</div>
                </div>
                {isCustom&&<button onClick={()=>{const c=(data.custom||[]).filter(x=>x.id!==z.id);update({...data,custom:c})}} style={{background:'#fee2e2',border:'none',color:'#dc2626',borderRadius:8,padding:'4px 8px',cursor:'pointer',fontSize:11,fontWeight:700}}>Sil</button>}
              </div>
              {session>0&&<div style={{marginTop:8}}>
                <div style={{background:'var(--cream)',borderRadius:100,height:4}}><div style={{height:'100%',background:'var(--gold)',borderRadius:100,width:`${Math.min(100,(session/z.adet)*100)}%`}}/></div>
                <div style={{fontSize:10,color:'var(--text-muted)',marginTop:2}}>{session}/{z.adet} bu turda</div>
              </div>}
              <div style={{display:'flex',gap:8,marginTop:10}}>
                <button onClick={()=>setActive(z.id)} style={{flex:1,padding:'10px',background:'linear-gradient(135deg,var(--navy),var(--navy-mid))',color:'white',border:'none',borderRadius:10,cursor:'pointer',fontWeight:700,fontSize:13,fontFamily:'var(--font-ui)'}}>
                  {session===0?'▶ Başla':`▶ Devam (${session}/${z.adet})`}
                </button>
                <button onClick={()=>setShowDetail(z)} style={{padding:'10px 14px',background:'var(--cream)',border:'1px solid var(--border)',borderRadius:10,cursor:'pointer',fontSize:13}}>ℹ️</button>
              </div>
            </div>
          )
        })}
      </div>

      {showAdd&&(
        <div style={{position:'absolute',inset:0,background:'rgba(0,0,0,0.5)',display:'flex',alignItems:'flex-end',zIndex:100}}>
          <div style={{background:'white',borderRadius:'20px 20px 0 0',padding:'20px',width:'100%',maxHeight:'80vh',overflowY:'auto'}}>
            <div style={{fontWeight:800,fontSize:16,color:'var(--navy)',marginBottom:16}}>📿 Özel Zikir Ekle</div>
            {[{key:'tr',label:'Zikir adı',ph:'örn: Bismillah'},{key:'ar',label:'Arapça (opsiyonel)',ph:'بِسْمِ اللَّهِ'},{key:'anlam',label:'Anlamı',ph:'Allah\'ın adıyla...'},{key:'fazilet',label:'Fazileti (opsiyonel)',ph:''}].map(f=>(
              <div key={f.key} style={{marginBottom:10}}>
                <div style={{fontSize:12,color:'var(--text-muted)',fontWeight:600,marginBottom:4}}>{f.label}</div>
                <input value={form[f.key]} onChange={e=>setForm(p=>({...p,[f.key]:e.target.value}))} placeholder={f.ph}
                  style={{width:'100%',padding:'10px',border:'1px solid var(--border)',borderRadius:10,fontSize:14,boxSizing:'border-box',fontFamily:f.key==='ar'?'var(--font-arabic)':'var(--font-ui)',direction:f.key==='ar'?'rtl':'ltr',outline:'none'}}/>
              </div>
            ))}
            <div style={{marginBottom:16}}>
              <div style={{fontSize:12,color:'var(--text-muted)',fontWeight:600,marginBottom:8}}>Hedef adet</div>
              <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                {[7,11,33,40,99,100,1000].map(n=>(
                  <button key={n} onClick={()=>setForm(p=>({...p,adet:n}))} style={{padding:'8px 14px',borderRadius:10,border:'1px solid',borderColor:form.adet===n?'var(--gold)':'var(--border)',background:form.adet===n?'var(--gold-pale)':'white',color:form.adet===n?'var(--navy)':'var(--text)',fontWeight:700,cursor:'pointer',fontSize:14,fontFamily:'var(--font-ui)'}}>{n}</button>
                ))}
              </div>
            </div>
            <div style={{display:'flex',gap:10}}>
              <button onClick={()=>setShowAdd(false)} style={{flex:1,padding:'14px',background:'var(--cream)',border:'1px solid var(--border)',borderRadius:14,cursor:'pointer',fontWeight:700,fontSize:15,fontFamily:'var(--font-ui)',color:'var(--text)'}}>İptal</button>
              <button onClick={addCustom} style={{flex:2,padding:'14px',background:'linear-gradient(135deg,var(--gold),var(--gold-light))',color:'var(--navy)',border:'none',borderRadius:14,cursor:'pointer',fontWeight:800,fontSize:15,fontFamily:'var(--font-ui)'}}>Kaydet</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function InfoCard({icon,title,text,dark}) {
  return (
    <div style={{background:dark?'linear-gradient(135deg,var(--navy),#0a1628)':'white',borderRadius:14,padding:'14px',border:`1px solid ${dark?'rgba(201,151,44,0.2)':'var(--border)'}`}}>
      <div style={{fontWeight:700,color:dark?'var(--gold)':'var(--navy)',fontSize:13,marginBottom:6}}>{icon} {title}</div>
      <div style={{color:dark?'rgba(255,255,255,0.85)':'var(--text)',fontSize:13,lineHeight:1.6,fontStyle:dark?'italic':'normal'}}>{text}</div>
    </div>
  )
}
