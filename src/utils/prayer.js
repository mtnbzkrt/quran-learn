// Namaz vakitleri — Aladhan.com API (ücretsiz, konum bazlı)
// Method 13 = Diyanet İşleri Başkanlığı (Türkiye)

const METHOD = 13

export async function fetchPrayerTimes(lat, lng) {
  const ts = Math.floor(Date.now() / 1000)
  const url = `https://api.aladhan.com/v1/timings/${ts}?latitude=${lat}&longitude=${lng}&method=${METHOD}`
  const res = await fetch(url)
  if (!res.ok) throw new Error('API hatası')
  const data = await res.json()
  const t = data.data.timings
  return {
    Fajr:    t.Fajr,
    Sunrise: t.Sunrise,
    Dhuhr:   t.Dhuhr,
    Asr:     t.Asr,
    Maghrib: t.Maghrib,
    Isha:    t.Isha,
    date:    data.data.date.readable,
    hijri:   data.data.date.hijri,
    meta:    data.data.meta,
  }
}

export async function fetchPrayerTimesByCity(city = 'Istanbul', country = 'Turkey') {
  const url = `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=${METHOD}`
  const res = await fetch(url)
  if (!res.ok) throw new Error('API hatası')
  const data = await res.json()
  const t = data.data.timings
  return {
    Fajr:    t.Fajr,
    Sunrise: t.Sunrise,
    Dhuhr:   t.Dhuhr,
    Asr:     t.Asr,
    Maghrib: t.Maghrib,
    Isha:    t.Isha,
    date:    data.data.date.readable,
    hijri:   data.data.date.hijri,
  }
}

export function getNextPrayer(times) {
  if (!times) return null
  const now = new Date()
  const hhmm = (s) => { const [h,m] = s.split(':').map(Number); return h*60+m }
  const nowMins = now.getHours()*60 + now.getMinutes()
  const prayers = [
    { key:'Fajr',    label:'İmsak/Sabah', ar:'الفجر',   emoji:'🌙' },
    { key:'Sunrise', label:'Güneş',        ar:'الشروق', emoji:'🌅' },
    { key:'Dhuhr',   label:'Öğle',         ar:'الظهر',  emoji:'☀️' },
    { key:'Asr',     label:'İkindi',        ar:'العصر',  emoji:'🌤️' },
    { key:'Maghrib', label:'Akşam',         ar:'المغرب', emoji:'🌆' },
    { key:'Isha',    label:'Yatsı',         ar:'العشاء', emoji:'🌙' },
  ]
  for (const p of prayers) {
    if (times[p.key] && hhmm(times[p.key]) > nowMins) {
      const diff = hhmm(times[p.key]) - nowMins
      return { ...p, time: times[p.key], diffMins: diff }
    }
  }
  // gece — yarın sabaha bak
  return { ...prayers[0], time: times['Fajr'], diffMins: 0, tomorrow: true }
}

export const PRAYER_LABELS = {
  Fajr:    { label:'Sabah', emoji:'🌙' },
  Sunrise: { label:'Güneş', emoji:'🌅' },
  Dhuhr:   { label:'Öğle',  emoji:'☀️' },
  Asr:     { label:'İkindi',emoji:'🌤️' },
  Maghrib: { label:'Akşam', emoji:'🌆' },
  Isha:    { label:'Yatsı', emoji:'🌙' },
}
