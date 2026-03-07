import { useState, useEffect } from 'react'

export default function InstallBanner() {
  const [prompt, setPrompt] = useState(null)
  const [show, setShow] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [installed, setInstalled] = useState(false)

  useEffect(() => {
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent)
    const standalone = window.navigator.standalone === true
    setIsIOS(ios)

    if (standalone) { setInstalled(true); return }
    if (localStorage.getItem('install-dismissed')) return

    if (ios) {
      setTimeout(() => setShow(true), 3000)
      return
    }

    const handler = (e) => { e.preventDefault(); setPrompt(e); setShow(true) }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const install = async () => {
    if (prompt) {
      prompt.prompt()
      const { outcome } = await prompt.userChoice
      if (outcome === 'accepted') setInstalled(true)
    }
    setShow(false)
  }

  const dismiss = () => {
    setShow(false)
    localStorage.setItem('install-dismissed', '1')
  }

  if (!show || installed) return null

  return (
    <div style={{
      position:'fixed', bottom:0, left:0, right:0, zIndex:1000,
      background:'white', borderTop:'1px solid #e0ece0',
      padding:'16px 16px calc(16px + env(safe-area-inset-bottom))',
      boxShadow:'0 -4px 20px rgba(0,0,0,0.12)'
    }}>
      <div style={{maxWidth:480, margin:'0 auto'}}>
        <div style={{display:'flex', gap:12, alignItems:'flex-start', marginBottom:14}}>
          <div style={{width:44, height:44, borderRadius:10, background:'#1a5c1a', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0}}>📖</div>
          <div>
            <div style={{fontWeight:700, color:'#1a3a1a', fontSize:'15px'}}>Uygulamayı Yükle</div>
            <div style={{color:'#4a7a4a', fontSize:'13px', marginTop:3}}>
              {isIOS
                ? 'Safari\'de paylaş (□↑) → "Ana Ekrana Ekle" seç'
                : 'Telefona yükle — internet olmadan da çalışır'}
            </div>
          </div>
        </div>
        {!isIOS && (
          <div style={{display:'flex', gap:10}}>
            <button onClick={dismiss} style={{flex:1, padding:'12px', background:'#f5f5f5', border:'none', borderRadius:12, color:'#666', fontWeight:600, cursor:'pointer', fontSize:'14px'}}>Şimdi değil</button>
            <button onClick={install} style={{flex:2, padding:'12px', background:'linear-gradient(135deg,#1a5c1a,#2d8a2d)', border:'none', borderRadius:12, color:'white', fontWeight:700, cursor:'pointer', fontSize:'14px'}}>📲 Yükle</button>
          </div>
        )}
        {isIOS && (
          <button onClick={dismiss} style={{width:'100%', padding:'12px', background:'#f5f5f5', border:'none', borderRadius:12, color:'#666', fontWeight:600, cursor:'pointer', fontSize:'14px'}}>Tamam, anladım</button>
        )}
      </div>
    </div>
  )
}
