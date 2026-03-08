// Nûr — Logo bileşeni
export function NurLogo({ size = 36, showText = true, light = false }) {
  const gold = light ? '#fde68a' : '#c9972c'
  const text = light ? '#ffffff' : '#0f2040'
  const sub  = light ? 'rgba(255,255,255,0.65)' : '#64748b'

  return (
    <div style={{ display:'flex', alignItems:'center', gap:10, userSelect:'none' }}>
      {/* Hilal + yıldız SVG */}
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
        {/* Hilal */}
        <path
          d="M 26 8
             A 14 14 0 1 0 26 32
             A 10 10 0 1 1 26 8 Z"
          fill={gold}
        />
        {/* 4-köşeli yıldız */}
        <path
          d="M 30 12 L 31.5 15.5 L 35 12 L 31.5 8.5 Z
             M 30 12 L 26.5 15.5 L 30 19 L 33.5 15.5 Z"
          fill={gold} opacity="0.85"
        />
        <polygon
          points="30,7 31.2,11 35,9 31.2,13 30,17 28.8,13 25,9 28.8,11"
          fill={gold}
        />
        {/* İç aydınlık */}
        <circle cx="20" cy="20" r="3" fill={gold} opacity="0.25"/>
      </svg>

      {showText && (
        <div>
          <div style={{ fontFamily:'var(--font-arabic)', fontSize: size * 0.65, color: gold, lineHeight:1, letterSpacing:'0.02em' }}>
            نُور
          </div>
          <div style={{ fontFamily:'var(--font-ui)', fontSize: size * 0.3, fontWeight:600, color: sub, letterSpacing:'0.12em', textTransform:'uppercase', marginTop:1 }}>
            Nûr App
          </div>
        </div>
      )}
    </div>
  )
}

// Sadece icon — küçük alanlar için
export function NurIcon({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <path d="M 26 8 A 14 14 0 1 0 26 32 A 10 10 0 1 1 26 8 Z" fill="#c9972c"/>
      <polygon points="30,7 31.2,11 35,9 31.2,13 30,17 28.8,13 25,9 28.8,11" fill="#c9972c"/>
    </svg>
  )
}
