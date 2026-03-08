import { useState, useEffect, useRef } from 'react'
import { DHIKR_LIST, DHIKR_CATEGORIES } from '../data/dhikr'
import { speak } from '../utils/audio'

const STORAGE_KEY = 'dhikr-data'

function loadData() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') } catch { return {} }
}
function saveData(d) { localStorage.setItem(STORAGE_KEY, JSON.stringify(d)) }

export default function DhikrView({ onStatsChange }) {
  const [data, setData] = useState(loadData)
  const [cat, setCat] = useState('hepsi')
  const [active, setActive] = useState(null)      // aktif sayaç
  const [showAdd, setShowAdd] = useState(false)
  const [showDetail, setShowDetail] = useState(null)
  const [form, setForm] = useState({ ar:'', tr:'', anlam:'', adet:33, fazilet:'' })
  const touchStart = useRef(null)

  const update = (d) => { setData(d); saveData(d); onStatsChange?.({ totalCount: totalCount(d) }) }

  const totalCount = (d) =>
    [...DHIKR_LIST, ...(d.custom || [])].reduce((s, z) => s + (d.counts?.[z.id] || 0), 0)

  const getCount = (id) => data.counts?.[id] || 0
  const getSession = (id) => data.sessions?.[id] || 0

  const tap = (zikir) => {
    const counts = { ...(data.counts || {}), [zikir.id]: (data.counts?.[zikir.id] || 0) + 1 }
    const sessions = { ...(data.sessions || {}), [zikir.id]: (data.sessions?.[zikir.id] || 0) + 1 }
    const updated = { ...data, counts, sessions }
    // Hedef tamamlandı mı?
    if (sessions[zikir.id] === zikir.adet) {
      speak('أحسنت')
      updated.sessions[zikir.id] = 0
    }
    update(updated)
  }

  const resetSession = (id) => {
    const sessions = { ...(data.sessions || {}), [id]: 0 }
    update({ ...data, sessions })
  }

  const addCustom = () => {
    if (!form.tr.trim()) return
    const id = 'custom_' + Date.now()
    const custom = [...(data.custom || []), { ...form, id, kategori:'ozel', kategoriLabel:'Özel Zikirlerim', color:'#6b7280', emoji:'📿' }]
    update({ ...data, custom })
    setForm({ ar:'', tr:'', anlam:'', adet:33, fazilet:'' })
    setShowAdd(false)
  }

  const deleteCustom = (id) => {
    const custom = (data.custom || []).filter(c => c.id !== id)
    update({ ...data, custom })
  }

  const allDhikr = [...DHIKR_LIST, ...(data.custom || [])]
  const filtered = cat === 'hepsi' ? allDhikr
    : cat === 'ozel' ? (data.custom || [])
    : allDhikr.filter(z => z.kategori === cat)

  if (active) {
    const z = allDhikr.find(z => z.id === active)
    if (!z) { setActive(null); return null }
    const session = getSession(z.id)
    const total = getCount(z.id)
    const pct = Math.min(100, (session / z.adet) * 100)
    return <Counter zikir={z} session={session} total={total} pct={pct}
      onTap={() => tap(z)} onReset={() => resetSession(z.id)}
      onBack={() => setActive(null)} onDetail={() => setShowDetail(z)} />
  }

  if (showDetail) {
    const z = showDetail
    return (
      <div style={{ height:'100%', display:'flex', flexDirection:'column', overflow:'hidden' }}>
        <div style={{ background:`linear-gradient(135deg,${z.color},${z.color}99)`, padding:'14px 16px', display:'flex', gap:10, alignItems:'center', flexShrink:0 }}>
          <button onClick={() => setShowDetail(null)} style={{ background:'rgba(255,255,255,0.2)', border:'none', color:'white', width:36, height:36, borderRadius:10, cursor:'pointer', fontSize:16 }}>←</button>
          <div style={{ color:'white', fontWeight:800, fontSize:15 }}>{z.emoji} {z.tr}</div>
        </div>
        <div style={{ flex:1, overflowY:'auto', padding:'16px 14px', display:'flex', flexDirection:'column', gap:12 }}>
          <div style={{ background:'white', borderRadius:16, padding:'20px', textAlign:'center', border:`2px solid ${z.color}33` }}>
            <div style={{ fontFamily:'Amiri, serif', fontSize:36, color:z.color, lineHeight:1.6, marginBottom:8, direction:'rtl' }}>{z.ar}</div>
            <div style={{ fontWeight:700, color:'#374151', fontSize:15 }}>{z.tr}</div>
          </div>
          <InfoCard title='📖 Anlamı' text={z.anlam} color={z.color}/>
          <InfoCard title={`🎯 Önerilen Adet: ${z.adet} defa`} text={z.fazilet} color={z.color}/>
          <InfoCard title="📚 İmam Gazali — İhyadan" text={z.gazali || "Bu zikir hakkında özel not eklenmemiş."} color="#1e40af"/>
          <button onClick={() => { setShowDetail(null); setActive(z.id) }} style={{ padding:'16px', background:`linear-gradient(135deg,${z.color},${z.color}cc)`, color:'white', border:'none', borderRadius:16, fontSize:16, fontWeight:800, cursor:'pointer' }}>
            {z.emoji} Zikre Başla
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', overflow:'hidden' }}>
      {/* Header */}
      <div style={{ background:'linear-gradient(135deg,#16a34a,#22c55e)', padding:'14px 16px', flexShrink:0 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
          <div>
            <div style={{ color:'rgba(255,255,255,0.8)', fontSize:11 }}>Bugüne kadar</div>
            <div style={{ color:'white', fontWeight:800, fontSize:18 }}>📿 {totalCount(data).toLocaleString('tr')} zikir</div>
          </div>
          <button onClick={() => setShowAdd(true)} style={{ background:'rgba(255,255,255,0.2)', border:'2px solid rgba(255,255,255,0.4)', color:'white', borderRadius:12, padding:'8px 14px', cursor:'pointer', fontWeight:700, fontSize:13 }}>
            + Ekle
          </button>
        </div>
        {/* Kategori filtresi */}
        <div style={{ display:'flex', gap:6, overflowX:'auto', paddingBottom:2 }}>
          {DHIKR_CATEGORIES.map(c => (
            <button key={c.id} onClick={() => setCat(c.id)} style={{
              background: cat === c.id ? 'white' : 'rgba(255,255,255,0.2)',
              color: cat === c.id ? '#16a34a' : 'white',
              border:'none', borderRadius:20, padding:'5px 12px',
              cursor:'pointer', fontWeight:700, fontSize:11, whiteSpace:'nowrap', flexShrink:0
            }}>{c.label}</button>
          ))}
        </div>
      </div>

      {/* Liste */}
      <div style={{ flex:1, overflowY:'auto', padding:'12px 14px', display:'flex', flexDirection:'column', gap:10 }}>
        {filtered.length === 0 && (
          <div style={{ textAlign:'center', padding:40, color:'#9ca3af' }}>
            {cat === 'ozel' ? 'Henüz özel zikir eklenmedi.\n+ Ekle butonuna bas.' : 'Bu kategoride zikir yok.'}
          </div>
        )}
        {filtered.map(z => {
          const session = getSession(z.id)
          const total = getCount(z.id)
          const isCustom = z.id.startsWith('custom_')
          return (
            <div key={z.id} style={{ background:'white', borderRadius:16, padding:'14px', boxShadow:'0 2px 8px rgba(0,0,0,0.07)', borderLeft:`4px solid ${z.color}` }}>
              <div style={{ display:'flex', alignItems:'flex-start', gap:10 }}>
                <div style={{ width:44, height:44, borderRadius:12, background:`${z.color}20`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>
                  {z.emoji}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontWeight:800, color:'#1e1b4b', fontSize:14 }}>{z.tr}</div>
                  <div style={{ fontFamily:'Amiri, serif', fontSize:18, color:z.color, lineHeight:1.4, direction:'rtl', marginTop:2 }}>{z.ar}</div>
                  <div style={{ fontSize:11, color:'#6b7280', marginTop:2 }}>Hedef: {z.adet}x · Toplam: {total.toLocaleString('tr')}</div>
                </div>
                {isCustom && (
                  <button onClick={() => deleteCustom(z.id)} style={{ background:'#fee2e2', border:'none', color:'#dc2626', borderRadius:8, padding:'4px 8px', cursor:'pointer', fontSize:11, fontWeight:700 }}>Sil</button>
                )}
              </div>
              {/* Mini progress */}
              {session > 0 && (
                <div style={{ marginTop:8 }}>
                  <div style={{ background:'#f3f4f6', borderRadius:100, height:4 }}>
                    <div style={{ height:'100%', background:z.color, borderRadius:100, width:`${Math.min(100,(session/z.adet)*100)}%` }}/>
                  </div>
                  <div style={{ fontSize:10, color:'#9ca3af', marginTop:2 }}>{session}/{z.adet} bu turda</div>
                </div>
              )}
              <div style={{ display:'flex', gap:8, marginTop:10 }}>
                <button onClick={() => setActive(z.id)} style={{ flex:1, padding:'10px', background:`linear-gradient(135deg,${z.color},${z.color}cc)`, color:'white', border:'none', borderRadius:12, cursor:'pointer', fontWeight:700, fontSize:13 }}>
                  {session === 0 ? '▶ Başla' : `▶ Devam (${session}/${z.adet})`}
                </button>
                <button onClick={() => setShowDetail(z)} style={{ padding:'10px 14px', background:'#f3f4f6', border:'none', borderRadius:12, cursor:'pointer', fontSize:13 }}>ℹ️</button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Özel zikir ekleme modal */}
      {showAdd && (
        <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'flex-end', zIndex:100 }}>
          <div style={{ background:'white', borderRadius:'20px 20px 0 0', padding:'20px', width:'100%', maxHeight:'80vh', overflowY:'auto' }}>
            <div style={{ fontWeight:800, fontSize:16, color:'#1e1b4b', marginBottom:16 }}>📿 Özel Zikir Ekle</div>
            {[
              { key:'tr', label:'Zikir adı / Türkçe', placeholder:'örn: Bismillah' },
              { key:'ar', label:'Arapça (opsiyonel)', placeholder:'بِسْمِ اللَّهِ' },
              { key:'anlam', label:'Anlamı', placeholder:'Allah\'ın adıyla...' },
              { key:'fazilet', label:'Fazileti / Neden okunur', placeholder:'opsiyonel' },
            ].map(f => (
              <div key={f.key} style={{ marginBottom:10 }}>
                <div style={{ fontSize:12, color:'#6b7280', fontWeight:600, marginBottom:4 }}>{f.label}</div>
                <input value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  placeholder={f.placeholder}
                  style={{ width:'100%', padding:'10px', border:'2px solid #e5e7eb', borderRadius:10, fontSize:14, boxSizing:'border-box',
                    fontFamily: f.key === 'ar' ? 'Amiri, serif' : 'inherit', direction: f.key === 'ar' ? 'rtl' : 'ltr' }}/>
              </div>
            ))}
            <div style={{ marginBottom:16 }}>
              <div style={{ fontSize:12, color:'#6b7280', fontWeight:600, marginBottom:4 }}>Hedef adet</div>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                {[7,11,33,40,99,100,1000].map(n => (
                  <button key={n} onClick={() => setForm(p => ({ ...p, adet:n }))} style={{
                    padding:'8px 14px', borderRadius:10, border:'2px solid',
                    borderColor: form.adet === n ? '#16a34a' : '#e5e7eb',
                    background: form.adet === n ? '#f0fdf4' : 'white',
                    color: form.adet === n ? '#16a34a' : '#374151',
                    fontWeight:700, cursor:'pointer', fontSize:14
                  }}>{n}</button>
                ))}
              </div>
            </div>
            <div style={{ display:'flex', gap:10 }}>
              <button onClick={() => setShowAdd(false)} style={{ flex:1, padding:'14px', background:'#f3f4f6', border:'none', borderRadius:14, cursor:'pointer', fontWeight:700, fontSize:15 }}>İptal</button>
              <button onClick={addCustom} style={{ flex:2, padding:'14px', background:'linear-gradient(135deg,#16a34a,#22c55e)', color:'white', border:'none', borderRadius:14, cursor:'pointer', fontWeight:700, fontSize:15 }}>Kaydet</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function Counter({ zikir, session, total, pct, onTap, onReset, onBack, onDetail }) {
  const [anim, setAnim] = useState(false)
  const tap = () => { setAnim(true); onTap(); setTimeout(() => setAnim(false), 150) }
  const done = pct >= 100

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:'#fef9f0', overflow:'hidden' }}>
      <div style={{ background:`linear-gradient(135deg,${zikir.color},${zikir.color}99)`, padding:'14px 16px', display:'flex', gap:10, alignItems:'center', flexShrink:0 }}>
        <button onClick={onBack} style={{ background:'rgba(255,255,255,0.2)', border:'none', color:'white', width:36, height:36, borderRadius:10, cursor:'pointer', fontSize:16 }}>←</button>
        <div style={{ flex:1 }}>
          <div style={{ color:'rgba(255,255,255,0.7)', fontSize:11 }}>Aktif Zikir</div>
          <div style={{ color:'white', fontWeight:800, fontSize:15 }}>{zikir.emoji} {zikir.tr}</div>
        </div>
        <button onClick={onDetail} style={{ background:'rgba(255,255,255,0.2)', border:'none', color:'white', width:36, height:36, borderRadius:10, cursor:'pointer', fontSize:16 }}>ℹ️</button>
      </div>

      <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'20px', gap:20 }}>
        {/* Arapça metin */}
        <div style={{ fontFamily:'Amiri, serif', fontSize:32, color:zikir.color, textAlign:'center', lineHeight:1.8, direction:'rtl', padding:'16px', background:`${zikir.color}10`, borderRadius:20, width:'100%' }}>
          {zikir.ar}
        </div>
        <div style={{ color:'#6b7280', fontSize:14, fontStyle:'italic', textAlign:'center' }}>{zikir.tr}</div>

        {/* Sayaç */}
        <div style={{ textAlign:'center' }}>
          <div style={{ fontSize:80, fontWeight:900, color: done ? '#16a34a' : zikir.color, lineHeight:1, transition:'color 0.3s', fontVariantNumeric:'tabular-nums' }}>
            {session}
          </div>
          <div style={{ fontSize:16, color:'#6b7280', marginTop:4 }}>/ {zikir.adet} hedef</div>
        </div>

        {/* Halka progress */}
        <svg width={120} height={120} style={{ transform:'rotate(-90deg)' }}>
          <circle cx={60} cy={60} r={50} fill='none' stroke='#e5e7eb' strokeWidth={10}/>
          <circle cx={60} cy={60} r={50} fill='none' stroke={done ? '#16a34a' : zikir.color} strokeWidth={10}
            strokeDasharray={`${2*Math.PI*50}`}
            strokeDashoffset={`${2*Math.PI*50*(1-pct/100)}`}
            strokeLinecap='round' style={{ transition:'stroke-dashoffset 0.3s' }}/>
        </svg>

        {done && (
          <div style={{ background:'#dcfce7', border:'2px solid #4ade80', borderRadius:16, padding:'12px 20px', textAlign:'center' }}>
            <div style={{ fontSize:24, marginBottom:4 }}>✅</div>
            <div style={{ fontWeight:800, color:'#166534' }}>{zikir.adet} tamamlandı!</div>
          </div>
        )}

        {/* TAP butonu */}
        <button onPointerDown={tap} style={{
          width:140, height:140, borderRadius:'50%',
          background: anim ? zikir.color + 'dd' : `linear-gradient(135deg,${zikir.color},${zikir.color}99)`,
          border:`6px solid ${zikir.color}44`, color:'white',
          fontSize:22, fontWeight:800, cursor:'pointer',
          transform: anim ? 'scale(0.92)' : 'scale(1)', transition:'all 0.12s',
          boxShadow:`0 8px 32px ${zikir.color}55`, userSelect:'none',
          display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:4
        }}>
          <div style={{ fontSize:32 }}>{zikir.emoji}</div>
          <div style={{ fontSize:13 }}>DOKUN</div>
        </button>

        <div style={{ display:'flex', gap:12, alignItems:'center' }}>
          <button onClick={onReset} style={{ background:'#fee2e2', border:'none', color:'#dc2626', borderRadius:12, padding:'10px 20px', cursor:'pointer', fontWeight:700, fontSize:13 }}>
            🔄 Sıfırla
          </button>
          <div style={{ color:'#9ca3af', fontSize:12 }}>Toplam: {total.toLocaleString('tr')}</div>
        </div>
      </div>
    </div>
  )
}

function InfoCard({ title, text, color }) {
  return (
    <div style={{ background:'white', borderRadius:14, padding:'14px', border:`2px solid ${color}22`, boxShadow:'0 1px 4px rgba(0,0,0,0.05)' }}>
      <div style={{ fontWeight:800, color, fontSize:13, marginBottom:6 }}>{title}</div>
      <div style={{ color:'#374151', fontSize:13, lineHeight:1.6 }}>{text}</div>
    </div>
  )
}
