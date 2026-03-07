let audioEl = null
const getAudio = () => { if (!audioEl) audioEl = new Audio(); return audioEl }

// Web Speech API
const speechSpeak = (text, rate=0.7) => new Promise((resolve, reject) => {
  const synth = window.speechSynthesis
  synth.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'ar-SA'; u.rate = rate; u.pitch = 1
  u.onend = resolve; u.onerror = reject
  const run = () => {
    const ar = synth.getVoices().find(v => v.lang.startsWith('ar'))
    if (ar) u.voice = ar
    synth.speak(u)
  }
  synth.getVoices().length > 0 ? run() : (synth.onvoiceschanged = run, setTimeout(reject, 2000))
})

// Google TTS via proxy
const audioSpeak = (text) => new Promise((resolve, reject) => {
  const encoded = encodeURIComponent(`https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=ar&client=tw-ob&ttsspeed=0.7`)
  const a = getAudio()
  a.src = `https://api.allorigins.win/raw?url=${encoded}`
  a.onended = resolve; a.onerror = reject
  a.play().catch(reject)
})

export const speak = async (text, rate=0.7) => {
  try { await speechSpeak(text, rate) }
  catch { try { await audioSpeak(text) } catch {} }
}

// Quran audio CDN
export const playSurahAudio = (surahKey) => {
  const nums = {fatiha:1, ihlas:112, nas:114}
  const n = nums[surahKey]; if (!n) return
  const a = getAudio()
  a.src = `https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/${n}.mp3`
  a.play().catch(()=>{
    a.src = `https://download.quranicaudio.com/quran/mishaari_raashid_al-3afaasee/${String(n).padStart(3,'0')}.mp3`
    a.play().catch(()=>{})
  })
}

export const stopAudio = () => {
  if (audioEl) { audioEl.pause(); audioEl.currentTime = 0 }
  if (window.speechSynthesis) window.speechSynthesis.cancel()
}
