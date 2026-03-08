// Ebced (Abjad) hesaplama
const EBCED_MAP = {
  'ا':1,'أ':1,'إ':1,'آ':1,'ء':1,'ى':10,
  'ب':2,'ج':3,'د':4,'ه':5,'و':6,'ز':7,
  'ح':8,'ط':9,'ي':10,'ك':20,'ل':30,'م':40,
  'ن':50,'س':60,'ع':70,'ف':80,'ص':90,'ق':100,
  'ر':200,'ش':300,'ت':400,'ث':500,'خ':600,
  'ذ':700,'ض':800,'ظ':900,'غ':1000,
  // hareke ve diğerleri yok say
}

export const calcEbced = (text) => {
  // sadece harfleri al, hareke ve boşlukları atla
  return [...text].reduce((sum, ch) => sum + (EBCED_MAP[ch] || 0), 0)
}

export const EBCED_LETTERS = EBCED_MAP
