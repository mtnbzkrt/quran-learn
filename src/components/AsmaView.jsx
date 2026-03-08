import { useState, useMemo } from 'react'
import { ASMA, ASMA_CATEGORIES } from '../data/asma'
import { calcEbced } from '../utils/ebced'
import { speak } from '../utils/audio'

export default function AsmaView({ onSubView }) {
  const [search, setSearch] = useState('')
  const [cat, setCat] = useState(0)
  const [detail, setDetail] = useState(null)
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem('asma-favs') || '[]') } catch { return [] }
  })

  const toggleFav = (id) => {
    const f = favorites.includes(id) ? favorites.filter(x => x !== id) : [...favorites, id]
    setFavorites(f); localStorage.setItem('asma-favs', JSON.stringify(f))
  }

  const filtered = useMemo(() => {
    let list = ASMA
    if (search) list = list.filter(a => a.tr.toLowerCase().includes(search.toLowerCase()) || a.anlam.toLowerCase().includes(search.toLowerCase()))
    if (cat > 0) list = list.filter(ASMA_CATEGORIES[cat].filter)
    return list
  }, [search, cat])

  const openDetail = (a) => { onSubView?.(true); setDetail(a) }
  const closeDetail = () => { onSubView?.(false); setDetail(null) }

  if (detail) {
    const a = detail
    const ebced = calcEbced(a.ar)
    return (
      <div style={{ height:'100%', display:'flex', flexDirection:'column', overflow:'hidden' }}>
        <div style={{ background:'linear-gradient(135deg,#b45309,#d97706)', padding:'14px 16px', display:'flex', gap:10, alignItems:'center', flexShrink:0 }}>
          <button onClick={() => closeDetail()} style={{ background:'rgba(255,255,255,0.2)', border:'none', color:'white', width:36, height:36, borderRadius:10, cursor:'pointer', fontSize:16 }}>←</button>
          <div style={{ flex:1 }}>
            <div style={{ color:'rgba(255,255,255,0.7)', fontSize:11 }}>Esmaül Hüsna — {a.id}/99</div>
            <div style={{ color:'white', fontWeight:800, fontSize:15 }}>{a.tr}</div>
          </div>
          <button onClick={() => toggleFav(a.id)} style={{ fontSize:22, background:'none', border:'none', cursor:'pointer' }}>
            {favorites.includes(a.id) ? '⭐' : '☆'}
          </button>
        </div>
        <div style={{ flex:1, overflowY:'auto', padding:'16px 14px', display:'flex', flexDirection:'column', gap:12 }}>
          {/* Büyük isim kartı */}
          <div style={{ background:'linear-gradient(135deg,#fff7ed,#fef3c7)', border:'2px solid #fcd34d', borderRadius:20, padding:'24px', textAlign:'center' }}>
            <div style={{ color:'var(--gold)', fontSize:11, fontWeight:700, marginBottom:6 }}>#{a.id}</div>
            <button onClick={() => speak(a.ar)} style={{ background:'none', border:'none', cursor:'pointer', display:'block', width:'100%' }}>
              <div style={{ fontFamily:'Amiri, serif', fontSize:52, color:'var(--navy)', lineHeight:1.4, direction:'rtl', marginBottom:10 }}>{a.ar}</div>
            </button>
            <div style={{ fontWeight:800, color:'var(--navy)', fontSize:20, marginBottom:4 }}>{a.tr}</div>
            <div style={{ color:'#9ca3af', fontSize:12 }}>🔊 isme dokunarak dinle</div>
          </div>

          {/* Ebced değeri */}
          <div style={{ background:'white', borderRadius:16, padding:'14px', border:'2px solid #fde68a', display:'flex', alignItems:'center', gap:14 }}>
            <div style={{ background:'#fef9c3', borderRadius:12, padding:'10px 14px', textAlign:'center' }}>
              <div style={{ fontWeight:900, fontSize:24, color:'var(--gold)' }}>{ebced}</div>
              <div style={{ fontSize:10, color:'var(--navy)', fontWeight:700 }}>Ebced</div>
            </div>
            <div>
              <div style={{ fontWeight:700, color:'#1e1b4b', fontSize:13 }}>Ebced Değeri</div>
              <div style={{ color:'#6b7280', fontSize:12 }}>Her Arap harfinin sayısal karşılığının toplamı</div>
              <div style={{ color:'var(--gold)', fontSize:12, marginTop:2 }}>Bu değerce zikir okunabilir</div>
            </div>
          </div>

          {/* Anlam */}
          <div style={{ background:'white', borderRadius:14, padding:'14px', border:'1px solid #e5e7eb' }}>
            <div style={{ fontWeight:800, color:'var(--gold)', fontSize:13, marginBottom:6 }}>📖 Anlamı</div>
            <div style={{ color:'#374151', fontSize:14, lineHeight:1.6 }}>{a.anlam}</div>
          </div>

          {/* Fazileti */}
          <div style={{ background:'#fff7ed', borderRadius:14, padding:'14px', border:'2px solid #fed7aa' }}>
            <div style={{ fontWeight:800, color:'#ea580c', fontSize:13, marginBottom:6 }}>🌟 Fazileti / Ne için okunur</div>
            <div style={{ color:'#374151', fontSize:13, lineHeight:1.6 }}>{a.fazilet}</div>
          </div>

          {/* Gazali notu */}
          <div style={{ background:'linear-gradient(135deg,#1e1b4b,#312e81)', borderRadius:14, padding:'14px' }}>
            <div style={{ color:'#a5b4fc', fontWeight:800, fontSize:13, marginBottom:6 }}>💎 İmam Gazali — el-Maksadü\'l-Esnâ</div>
            <div style={{ color:'white', fontSize:13, lineHeight:1.6, fontStyle:'italic' }}>{a.gazali}</div>
          </div>

          {/* Zikir butonu */}
          <button onClick={() => speak(a.ar)} style={{ padding:'16px', background:'linear-gradient(135deg,var(--gold),var(--gold-light))', color:'var(--navy)', border:'none', borderRadius:16, fontSize:16, fontWeight:800, cursor:'pointer' }}>
            🔊 Sesini Dinle
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', overflow:'hidden' }}>
      {/* Header */}
      <div style={{ background:'linear-gradient(135deg,var(--navy),var(--navy-mid))', padding:'14px 16px', flexShrink:0 }}>
        <div style={{ color:'white', fontWeight:800, fontSize:18, marginBottom:10 }}>🌟 Esmaül Hüsna</div>

        {/* Arama */}
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder='İsim ara...'
          style={{ width:'100%', padding:'10px 14px', borderRadius:12, border:'none', fontSize:14, background:'rgba(255,255,255,0.15)', color:'white', outline:'none', boxSizing:'border-box', marginBottom:10 }}
        />

        {/* Kategori */}
        <div style={{ display:'flex', gap:6, overflowX:'auto' }}>
          {ASMA_CATEGORIES.map((c, i) => (
            <button key={i} onClick={() => setCat(i)} style={{
              background: cat === i ? 'white' : 'rgba(255,255,255,0.2)',
              color: cat === i ? '#92400e' : 'white',
              border:'none', borderRadius:20, padding:'5px 12px',
              cursor:'pointer', fontWeight:700, fontSize:11, whiteSpace:'nowrap', flexShrink:0
            }}>{c.label}</button>
          ))}
        </div>
      </div>

      {/* Sayı */}
      <div style={{ padding:'10px 14px 4px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div style={{ color:'#6b7280', fontSize:12 }}>{filtered.length} isim</div>
        {favorites.length > 0 && <div style={{ color:'var(--gold)', fontSize:12, fontWeight:700 }}>⭐ {favorites.length} favori</div>}
      </div>

      {/* Grid liste */}
      <div style={{ flex:1, overflowY:'auto', padding:'4px 14px 20px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
        {filtered.map(a => {
          const isFav = favorites.includes(a.id)
          return (
            <button key={a.id} onClick={() => openDetail(a)} style={{
              background:'white', border: isFav ? '2px solid #fcd34d' : '1px solid #e5e7eb',
              borderRadius:16, padding:'14px 12px', cursor:'pointer', textAlign:'center',
              boxShadow:'0 2px 8px rgba(0,0,0,0.07)', display:'flex', flexDirection:'column', gap:6, alignItems:'center',
              position:'relative'
            }}>
              {isFav && <div style={{ position:'absolute', top:6, right:8, fontSize:14 }}>⭐</div>}
              <div style={{ color:'#6b7280', fontSize:10, fontWeight:700 }}>#{a.id}</div>
              <div style={{ fontFamily:'Amiri, serif', fontSize:28, color:'var(--gold)', lineHeight:1.2, direction:'rtl' }}>{a.ar}</div>
              <div style={{ fontWeight:800, color:'#1e1b4b', fontSize:12 }}>{a.tr}</div>
              <div style={{ color:'#6b7280', fontSize:10, textAlign:'center', lineHeight:1.4 }}>{a.anlam.slice(0,45)}{a.anlam.length > 45 ? '…' : ''}</div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
