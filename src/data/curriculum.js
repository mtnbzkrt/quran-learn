export const sections = [
  { id:1, title:'Temel Hazırlık', emoji:'📖', color:'#166534', lessons:[1,2,3,4] },
  { id:2, title:'Harfler ve Harekeler', emoji:'✍️', color:'#1e40af', lessons:[5,6,7,8,9] },
  { id:3, title:'Okuma Kuralları (Tecvid)', emoji:'📚', color:'#7c2d12', lessons:[10,11,12,13,14,15,16] },
  { id:4, title:'Mim Sakin ve Lam Kuralları', emoji:'🔤', color:'#581c87', lessons:[17,18,19,20,21] },
  { id:5, title:'Okuma Geliştirme', emoji:'🎯', color:'#0f766e', lessons:[22,23,24,25,26] },
  { id:6, title:'Uygulamalı Okuma', emoji:'🕌', color:'#b45309', lessons:[27,28,29,30] },
  { id:7, title:'Akıcılık ve Düzeltme', emoji:'🎙️', color:'#be185d', lessons:[31,32,33,34] },
  { id:8, title:'İleri Seviye', emoji:'⭐', color:'#1d4ed8', lessons:[35,36,37,38] },
]

export const lessons = {
  1: {
    id:1, section:1, title:'Kur\'an Nedir? Nasıl Okunur?',
    content:[
      { type:'text', text:'Kur\'an-ı Kerim, Allah\'ın Hz. Muhammed (s.a.v.)\'e Cebrail aracılığıyla indirdiği kutsal kitabıdır. Arapça olarak indirilmiş olup orijinal diliyle okunması son derece önemlidir.' },
      { type:'note', text:'📌 Kur\'an okumak için Arapça bilmek gerekmez — ancak harfleri ve okunuş kurallarını öğrenmek gerekir.' },
      { type:'heading', text:'Kur\'an Nasıl Okunur?' },
      { type:'text', text:'Kur\'an okurken üç temel hız vardır:\n• Tahkik: Çok yavaş ve dikkatli okuma (öğrenciler için)\n• Tedvir: Orta hızda okuma\n• Hadr: Hızlı okuma (hafızlar için)' },
      { type:'heading', text:'Başlamadan Önce' },
      { type:'arabic', text:'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ', transliteration:'Bismillahirrahmanirrahîm', meaning:'Rahman ve Rahim olan Allah\'ın adıyla' },
      { type:'note', text:'✅ Her okumaya Besmele ile başlanır.' },
    ],
    keyPoints:['Kur\'an Allah\'ın sözüdür','Orijinal Arapça ile okunur','Besmele ile başlanır','Üç okuma hızı vardır']
  },
  2: {
    id:2, section:1, title:'Arap Alfabesine Giriş',
    content:[
      { type:'text', text:'Arap alfabesi 28 harften oluşur. Harfler sağdan sola yazılır ve okunur. Her harfin kelime başında, ortasında ve sonunda farklı yazılış şekli olabilir.' },
      { type:'heading', text:'28 Harf — Tam Liste' },
      { type:'arabic-table', rows:[
        ['أ','Elif','ب','Be','ت','Te','ث','Se'],
        ['ج','Cim','ح','Ha','خ','Hı','د','Dal'],
        ['ذ','Zel','ر','Re','ز','Ze','س','Sin'],
        ['ش','Şin','ص','Sad','ض','Dad','ط','Tı'],
        ['ظ','Zı','ع','Ayn','غ','Ğayn','ف','Fe'],
        ['ق','Kaf','ك','Kef','ل','Lam','م','Mim'],
        ['ن','Nun','ه','He','و','Vav','ي','Ye'],
      ]},
      { type:'note', text:'📌 Harfleri ezberlemek için her gün 3-4 harf çalışın. Tekrar en iyi öğretmendir.' },
    ],
    keyPoints:['28 harf vardır','Sağdan sola yazılır','Her harfin 3 yazım şekli var','Her gün 3-4 harf çalış']
  },
  3: {
    id:3, section:1, title:'Harflerin Çıkış Yerleri (Mahreç)',
    content:[
      { type:'text', text:'Mahreç, harfin çıkış yeridir. Her harfin kendine has bir çıkış noktası vardır. Doğru mahreçten çıkarılmayan harf farklı bir harf gibi duyulur ve anlam değişir.' },
      { type:'heading', text:'5 Ana Mahreç Bölgesi' },
      { type:'list', items:[
        '🗣️ Boğaz (Halq): ء ه ع غ ح خ',
        '👅 Dil (Lisan): ق ك ج ش ي — ض ل ن ر — ط د ت — ص ز س — ذ ث ظ',
        '💋 Dudak (Şefe): ف — ب م و',
        '👃 Geniz (Hunne): Ğunne harfleri (م ن)',
        '🦷 Boğaz-Dil arası: ل ن ر',
      ]},
      { type:'note', text:'💡 Ayna karşısında pratik yapın. Ağız hareketlerini gözlemleyin.' },
    ],
    keyPoints:['Her harfin çıkış yeri vardır','5 ana bölge: boğaz, dil, dudak, geniz, dişler','Yanlış mahreç anlam değiştirir','Ayna ile pratik yapılabilir']
  },
  4: {
    id:4, section:1, title:'Harflerin Sıfatları (Kalın–İnce, Sert–Yumuşak)',
    content:[
      { type:'text', text:'Her harfin kendine özgü sıfatları vardır. Bu sıfatlar harfin nasıl okunacağını belirler.' },
      { type:'heading', text:'Teşbik (Kalın) Harfler' },
      { type:'arabic', text:'خ ص ض غ ط ق ظ', transliteration:'Hı, Sad, Dad, Ğayn, Tı, Kaf, Zı', meaning:'Bu 7 harf kalın okunur' },
      { type:'heading', text:'İnce Harfler' },
      { type:'text', text:'Teşbik harfleri dışındaki tüm harfler ince okunur (istisnalar hariç). Elif ve Lam bazı durumlarda kalın okunabilir.' },
      { type:'heading', text:'Sert (Şedid) ve Yumuşak (Rihve) Harfler' },
      { type:'list', items:[
        '💪 Şedid (Sert): ء ج د ق ط ب ك ت — ses kesilir',
        '🌊 Rihve (Yumuşak): ف ح ث ه ش خ ص ض غ ظ — ses akar',
        '⚖️ Arası (Beyniyye): ع ل م ن و ي ر',
      ]},
    ],
    keyPoints:['7 kalın harf: خ ص ض غط ق ظ','Diğerleri ince okunur','Sert harflerde ses kesilir','Yumuşak harflerde ses akar']
  },
  5: {
    id:5, section:2, title:'Harflerin Tek Tek Tanınması',
    content:[
      { type:'text', text:'Harfleri tek başlarına tanımak, okumayı öğrenmenin temelidir. Her harfi sesli söyleyerek ve yazarak ezberleyin.' },
      { type:'heading', text:'Harfleri Gruplar Halinde Öğrenelim' },
      { type:'arabic-cards', cards:[
        { ar:'أ', name:'Elif', note:'Sessiz harf — hareke alır' },
        { ar:'ب', name:'Be', note:'Türkçe B gibi' },
        { ar:'ت', name:'Te', note:'Türkçe T gibi' },
        { ar:'ث', name:'Se', note:'İngilizce "th" gibi (think)' },
        { ar:'ج', name:'Cim', note:'Türkçe C gibi' },
        { ar:'ح', name:'Ha', note:'Derin boğaz Ha\'sı' },
        { ar:'خ', name:'Hı', note:'Türkçe H\'dan kalın' },
        { ar:'د', name:'Dal', note:'Türkçe D gibi' },
      ]},
      { type:'note', text:'📌 Her gün bu kartları tekrar edin. Sesi söyleyerek harfi yazmayı deneyin.' },
    ],
    keyPoints:['Her harfi ayrı ayrı öğren','Sesli okuyarak ezberle','Yazmak öğrenmeyi hızlandırır','Günlük tekrar şart']
  },
  6: {
    id:6, section:2, title:'Üstün (َ), Esre (ِ), Ötre (ُ)',
    content:[
      { type:'text', text:'Harekeler harflerin sesli okunmasını sağlayan işaretlerdir. Üç temel hareke vardır.' },
      { type:'heading', text:'Üstün (Fetha) — ﹷ' },
      { type:'arabic', text:'بَ — تَ — جَ', transliteration:'Be — Te — Ce', meaning:'Üstün ile okunuş: kısa "a" sesi' },
      { type:'heading', text:'Esre (Kesre) — ﹻ' },
      { type:'arabic', text:'بِ — تِ — جِ', transliteration:'Bi — Ti — Ci', meaning:'Esre ile okunuş: kısa "i" sesi' },
      { type:'heading', text:'Ötre (Damme) — ﹹ' },
      { type:'arabic', text:'بُ — تُ — جُ', transliteration:'Bu — Tu — Cu', meaning:'Ötre ile okunuş: kısa "u" sesi' },
      { type:'note', text:'💡 Türkçedeki a, i, u seslerine benzer — ancak daha kısa ve net çıkarılır.' },
    ],
    keyPoints:['Üstün = kısa "a" sesi','Esre = kısa "i" sesi','Ötre = kısa "u" sesi','Harekeler harfleri seslendirir']
  },
  7: {
    id:7, section:2, title:'Tenvinler (ً ٍ ٌ)',
    content:[
      { type:'text', text:'Tenvin, kelimenin sonuna "n" sesi ekleyen çift harekedir. Genellikle kelimenin sonunda bulunur.' },
      { type:'heading', text:'Tenvin Çeşitleri' },
      { type:'arabic', text:'ً', transliteration:'Tenvin-i Fetha (en)', meaning:'Çift üstün — "en" sesi verir' },
      { type:'arabic', text:'ٍ', transliteration:'Tenvin-i Kesre (in)', meaning:'Çift esre — "in" sesi verir' },
      { type:'arabic', text:'ٌ', transliteration:'Tenvin-i Damme (un)', meaning:'Çift ötre — "un" sesi verir' },
      { type:'heading', text:'Örnekler' },
      { type:'arabic', text:'كِتَابٌ — كِتَابٍ — كِتَابًا', transliteration:'Kitâbun — Kitâbin — Kitâben', meaning:'Kitap (ötre/esre/üstün tenvin)' },
      { type:'note', text:'📌 Tenvin her zaman kelimenin sonunda gelir. Durulduğunda tenvin "n" okunmaz (vakıf kuralı).' },
    ],
    keyPoints:['Tenvin = çift hareke + n sesi','3 çeşit tenvin','Kelime sonunda gelir','Durulursa n okunmaz']
  },
  8: {
    id:8, section:2, title:'Cezm (ْ)',
    content:[
      { type:'text', text:'Cezm (sükun), harfin harekesiz, sessiz okunduğunu gösterir. Harfin üzerine küçük bir daire veya baş harfi şeklinde işaret konur.' },
      { type:'arabic', text:'بْ — تْ — لْ', transliteration:'B — T — L (harekesiz)', meaning:'Cezm ile sessiz okunur' },
      { type:'heading', text:'Önemli Kural' },
      { type:'text', text:'Cezmli harf kendisinden önceki harfin sesine bağlı okunur:\n• أَكْبَر = Ek-ber (k harekesiz, b\'ye bağlanır)\n• مَسْجِد = Mes-cid' },
      { type:'arabic', text:'أَكْبَرُ', transliteration:'Ekberu', meaning:'En büyük' },
      { type:'note', text:'💡 Cezm gören harf kendisi ses çıkarmaz, önceki sese yapışır.' },
    ],
    keyPoints:['Cezm = harekesiz harf','Önceki sese bağlanır','Sessizleştirme işareti','Şedde ile karıştırma']
  },
  9: {
    id:9, section:2, title:'Şedde (ّ)',
    content:[
      { type:'text', text:'Şedde, harfin iki kere okunduğunu gösterir. Harfin üzerine konulan w şeklinde bir işarettir. İlk harf cezmli, ikincisi harekeli okunur.' },
      { type:'arabic', text:'بَّ = بْ + بَ', transliteration:'Bb = B + Be', meaning:'Şeddeli Be — iki be birleşmiş' },
      { type:'heading', text:'Örnekler' },
      { type:'arabic', text:'رَبَّنَا', transliteration:'Rabbenâ', meaning:'Rabbimiz (bb uzatılarak okunur)' },
      { type:'arabic', text:'إِنَّ', transliteration:'İnne', meaning:'Şüphesiz (nn ile)' },
      { type:'note', text:'📌 Şeddeli harf her zaman 2 sayım değerindedir. Hafifçe duraksatarak okunur.' },
    ],
    keyPoints:['Şedde = çift harf','İki sayım değerinde','İlk harf cezmli ikinci harekeli','Duraksatarak okunur']
  },
  10: {
    id:10, section:3, title:'Uzatma (Med) Kavramı',
    content:[
      { type:'text', text:'Med, belirli harflerin uzatılarak okunmasıdır. Kur\'an\'da uzatmalar anlam ve musikiden önemli rol oynar.' },
      { type:'heading', text:'Med Harfleri' },
      { type:'arabic', text:'ا — و — ي', transliteration:'Elif — Vav — Ye', meaning:'Üç med harfi' },
      { type:'heading', text:'Uzatma Ölçüsü' },
      { type:'text', text:'Med uzunluğu "elif" sayısıyla ölçülür:\n• 1 elif = 1 sayım (normal)\n• 2 elif = 2 sayım (med-i tabiî)\n• 4-5 elif = 4-5 sayım (med-i muttasıl / munfasıl)\n• 6 elif = 6 sayım (med-i lâzım)' },
      { type:'note', text:'💡 Parmakla sayarak pratik yapın. Kalem şaklatarak ritim tutabilirsiniz.' },
    ],
    keyPoints:['3 med harfi: ا و ي','Elif sayısıyla ölçülür','Minimum 2 sayım','Med türüne göre değişir']
  },
  11: {
    id:11, section:3, title:'Med Çeşitleri (Med-i Tabiî)',
    content:[
      { type:'text', text:'Med-i Tabiî (doğal uzatma), en temel med çeşididir. 2 elif (2 sayım) uzatılır. Ne artırılır ne eksiltilir.' },
      { type:'heading', text:'Med-i Tabiî Kuralı' },
      { type:'text', text:'Bir med harfinden sonra hemze veya şedde gelmiyorsa med-i tabiîdir.' },
      { type:'arabic', text:'قَالَ', transliteration:'Kâle (2 sayım)', meaning:'Dedi — elif med harfi' },
      { type:'arabic', text:'يَقُولُ', transliteration:'Yekûlu (2 sayım)', meaning:'Söyler — vav med harfi' },
      { type:'arabic', text:'قِيلَ', transliteration:'Kîle (2 sayım)', meaning:'Denildi — ye med harfi' },
      { type:'note', text:'📌 Med-i tabiî olmaksızın Kur\'an doğru okunamaz. Bu kural tecvidin temelidir.' },
    ],
    keyPoints:['Med-i tabiî = 2 sayım','Sonraki harf hemze veya şedde değilse','3 med harfi ile olur','En temel med çeşidi']
  },
  12: {
    id:12, section:3, title:'Nun Sakin ve Tenvin',
    content:[
      { type:'text', text:'Nun sakin (ن ْ) ve tenvin (ًٌٍ) dört farklı şekilde okunur: İzhâr, İdğam, İklab, İhfâ.' },
      { type:'heading', text:'Nun Sakin Nedir?' },
      { type:'arabic', text:'نْ', transliteration:'Nun Sakin', meaning:'Harekesiz Nun — 4 kuralı var' },
      { type:'heading', text:'4 Kural Özeti' },
      { type:'list', items:[
        '✨ İzhâr: Açık oku (boğaz harfleri gelince)',
        '🔗 İdğam: Birleştir (ي ر م ل و ن gelince)',
        '🔄 İklab: Mim\'e çevir (ب gelince)',
        '🌫️ İhfâ: Gizle (diğer harfler gelince)',
      ]},
      { type:'note', text:'📌 Bu dört kural Kur\'an\'ın en temel tecvid kurallarıdır. Sonraki 4 derste tek tek işlenecek.' },
    ],
    keyPoints:['Nun sakin 4 kural','İzhâr, İdğam, İklab, İhfâ','Tenvin de aynı kurallara tabi','Sonraki harfe göre değişir']
  },
  13: {
    id:13, section:3, title:'İzhâr',
    content:[
      { type:'text', text:'İzhâr, nun sakin veya tenvinin açık ve net okunmasıdır. Boğazdan çıkan 6 harften önce gelince uygulanır.' },
      { type:'heading', text:'İzhâr Harfleri (6 Boğaz Harfi)' },
      { type:'arabic', text:'ء ه ع غ ح خ', transliteration:'Hemze, He, Ayn, Ğayn, Ha, Hı', meaning:'Bu harfler İzhâr harfleridir' },
      { type:'heading', text:'Örnekler' },
      { type:'arabic', text:'مِنْ أَهْلِ', transliteration:'Min ehli', meaning:'Nun açık okunur — hemze geldi' },
      { type:'arabic', text:'عَلِيمٌ حَكِيمٌ', transliteration:'Alîmun Hakîm', meaning:'Tenvin + ha = açık nun sesi' },
      { type:'note', text:'💡 İzhâr\'da nun sesi gizlenmez, tam okunur. Boğaz harfi olduğu için doğal ayrışır.' },
    ],
    keyPoints:['6 boğaz harfi gelince','Nun açık okunur','Gizlenmez, tam okunur','ء ه ع غ ح خ']
  },
  14: {
    id:14, section:3, title:'İdğam',
    content:[
      { type:'text', text:'İdğam, nun sakin veya tenvinin bir sonraki harfe dahil edilerek (eritilerek) okunmasıdır.' },
      { type:'heading', text:'İdğam Harfleri' },
      { type:'arabic', text:'ي ر م ل و ن', transliteration:'Ye Re Mim Lam Vav Nun', meaning:'YERMELVN — kolay ezber yöntemi' },
      { type:'heading', text:'İdğam-ı Ğunne (Ğunneli)' },
      { type:'arabic', text:'مِن يَقُولُ', transliteration:'Miyyekûlu', meaning:'Nun + Ye = birleşir, ğunne ile' },
      { type:'heading', text:'İdğam-ı Bila Ğunne (Ğunnesiz)' },
      { type:'arabic', text:'مِن رَّبِّهِمْ', transliteration:'Mirrabihim', meaning:'Nun + Re = birleşir, ğunnesiz' },
      { type:'note', text:'📌 Lam ve Re gelince ğunnesiz, diğerleri gelince ğunneli idğam yapılır.' },
    ],
    keyPoints:['6 harf: ي ر م ل و ن','Nun eritilerek okunur','Lam+Re ğunnesiz','Diğerleri ğunneli']
  },
  15: {
    id:15, section:3, title:'İklab',
    content:[
      { type:'text', text:'İklab, nun sakin veya tenvinin ba (ب) harfi gelince mim (م) sesine dönüştürülmesidur. Sadece 1 harfte uygulanır.' },
      { type:'heading', text:'İklab Harfi' },
      { type:'arabic', text:'ب', transliteration:'Be', meaning:'Sadece bu harf gelince İklab olur' },
      { type:'heading', text:'Nasıl Okunur?' },
      { type:'text', text:'Nun sesi tamamen mim\'e dönüşür ve ğunne ile okunur. Mushafta bazen م işareti konur.' },
      { type:'arabic', text:'مِنْ بَعْدِ', transliteration:'Mim ba\'di (mim sesi ile)', meaning:'Min değil — mim sesi' },
      { type:'arabic', text:'سَمِيعٌ بَصِيرٌ', transliteration:'Semîumm Basîr', meaning:'Tenvin + be = mim sesi' },
      { type:'note', text:'💡 Mushafta iklab olan yerlerde küçük م harfi yazılı olabilir.' },
    ],
    keyPoints:['Sadece Be harfinde','Nun → Mim dönüşür','Ğunne ile okunur','Mushafta م işareti']
  },
  16: {
    id:16, section:3, title:'İhfâ',
    content:[
      { type:'text', text:'İhfâ, nun sakin veya tenvinin gizlenerek okunmasıdır. İzhâr ve idğam arasında bir ses çıkar — ne tam nun okunur, ne tamamen gizlenir.' },
      { type:'heading', text:'İhfâ Harfleri (15 Harf)' },
      { type:'arabic', text:'ت ث ج د ذ ز س ش ص ض ط ظ ف ق ك', transliteration:'Te, Se, Cim, Dal, Zel, Ze, Sin, Şin, Sad, Dad, Tı, Zı, Fe, Kaf, Kef', meaning:'Geriye kalan 15 harf' },
      { type:'heading', text:'Örnekler' },
      { type:'arabic', text:'مِنْ دُونِ', transliteration:'Min dûni (gizli nun)', meaning:'Nun gizlenerek dalın sesi baskın' },
      { type:'note', text:'📌 İhfâ en çok karıştırılan kuraldır. İzhâr, İdğam ve İklab harfleri dışındaki 15 harfte uygulanır.' },
    ],
    keyPoints:['15 harf ile ihfâ','Nun gizlenerek okunur','İzhâr-İdğam arası ses','En yaygın kural']
  },
  17: {
    id:17, section:4, title:'Mim Sakin Kuralları',
    content:[
      { type:'text', text:'Mim sakin (مْ), kendisinden sonra gelen harfe göre 3 farklı şekilde okunur.' },
      { type:'heading', text:'3 Kural' },
      { type:'list', items:[
        '1️⃣ İzhâr-ı Şefevî: Mim ve Be dışındaki harfler gelince',
        '2️⃣ İdğam-ı Misleyn: Mim gelince — mim\'e katılır',
        '3️⃣ İhfâ-ı Şefevî: Be (ب) gelince — gizlenir',
      ]},
      { type:'note', text:'📌 Şefevî kelimesi "dudak" anlamına gelir. Bu kurallar dudak harfleriyle ilgilidir.' },
    ],
    keyPoints:['Mim sakin 3 kural','Sonraki harfe göre değişir','Şefevî = dudakla ilgili','Nun sakin kurallarına benzer']
  },
  18: {
    id:18, section:4, title:'İzhâr-ı Şefevî',
    content:[
      { type:'text', text:'Mim sakin\'den sonra mim ve ba dışında bir harf gelirse açık okunur. Bu İzhâr-ı Şefevîdir.' },
      { type:'arabic', text:'هُمْ فِيهَا', transliteration:'Hum fîhâ', meaning:'Mim + fe = açık mim' },
      { type:'arabic', text:'أَنْتُمْ تَعْلَمُونَ', transliteration:'Entum ta\'lemûn', meaning:'Mim + te = açık mim' },
      { type:'note', text:'💡 Dikkat: Hemze (ء) ve He (ه) harfleri gelince özellikle dikkatli olun — mim net okunur.' },
    ],
    keyPoints:['Mim ve Be dışı harfler','Mim açık okunur','Dudak kapatılarak','Net mim sesi']
  },
  19: {
    id:19, section:4, title:'İdğam-ı Misleyn',
    content:[
      { type:'text', text:'Mim sakin\'den sonra yeni bir mim gelirse, iki mim birleşir ve şeddeli mim gibi okunur. Ğunne (geniz sesi) ile.' },
      { type:'arabic', text:'لَهُمْ مَا', transliteration:'Lehummâ', meaning:'İki mim birleşti — ğunne ile' },
      { type:'arabic', text:'فِيهِمْ مِنْكُم', transliteration:'Fîhimminkum', meaning:'Mim + mim = şeddeli mim' },
      { type:'note', text:'📌 İdğam-ı misleyn her zaman ğunne ile okunur. Süre 2 sayım.' },
    ],
    keyPoints:['Mim + mim = birleşir','Şeddeli mim gibi','Ğunne ile 2 sayım','Misleyn = aynı cinsten']
  },
  20: {
    id:20, section:4, title:'İhfâ-ı Şefevî',
    content:[
      { type:'text', text:'Mim sakin\'den sonra ba (ب) gelirse mim gizlenerek okunur. Dudaklar tam kapanmadan ğunne ile geçilir.' },
      { type:'arabic', text:'تَرْمِيهِمْ بِحِجَارَةٍ', transliteration:'Termîhim bihicâre', meaning:'Mim + be = gizli mim' },
      { type:'arabic', text:'وَهُمْ بِالْآخِرَةِ', transliteration:'Ve hum bil-âhira', meaning:'Mim gizlenir, be gelir' },
      { type:'note', text:'💡 İhfâ-ı şefevîde dudaklar hafifçe kapanır ama sıkı değil. Ğunne sesi gelir.' },
    ],
    keyPoints:['Sadece Be gelince','Mim gizlenir','Ğunne ile geçilir','Dudaklar tam kapanmaz']
  },
  21: {
    id:21, section:4, title:'Lam-ı Tarif (Güneş–Ay Harfleri)',
    content:[
      { type:'text', text:'Arapçada "el-" takısı (ال) bazı harflerden önce lam okunur (kamerî), bazılarından önce okunmaz ve sonraki harfe şedde gelir (şemsî).' },
      { type:'heading', text:'Şemsi Harfler (Güneş — 14 harf)' },
      { type:'arabic', text:'ت ث د ذ ر ز س ش ص ض ط ظ ل ن', transliteration:'Lam okunmaz', meaning:'Sonraki harfe geçer, şedde' },
      { type:'arabic', text:'الشَّمْسُ', transliteration:'Eş-Şemsu', meaning:'El değil Eş — lam şin\'e döndü' },
      { type:'heading', text:'Kamerî Harfler (Ay — 14 harf)' },
      { type:'arabic', text:'ا ب ج ح خ ع غ ف ق ك م و ه ي', transliteration:'Lam okunur', meaning:'El açık okunur' },
      { type:'arabic', text:'الْقَمَرُ', transliteration:'El-Kameru', meaning:'Lam açık okunur' },
      { type:'note', text:'📌 Kolay yol: Şemsî harflerden önce lam harfi tekrarlanır — sanki şeddeli okunur.' },
    ],
    keyPoints:['14 şemsî, 14 kamerî','Şemsî = lam gizli','Kamerî = lam açık','Şemsu-Kameru örneği']
  },
  22: {
    id:22, section:5, title:'Vakıf (Durma) İşaretleri',
    content:[
      { type:'text', text:'Vakıf, Kur\'an okurken nerede durulup durulmayacağını gösteren işaretlerdir.' },
      { type:'heading', text:'Başlıca Vakıf İşaretleri' },
      { type:'list', items:[
        '🛑 وقف مطلق (م) — Durulur, devam edilebilir',
        '✅ لا (Lâ) — Durulmaz, devam edilir',
        '🔄 ج — Durulabilir de devam da edilebilir',
        '⚡ ز — Durulmak daha iyidir',
        '❌ ص — Durulmaz ama soluk alınabilir',
        '🔗 ∴ (Muâneke) — Birinde dur, diğerinde durma',
      ]},
      { type:'note', text:'📌 Mushafların kenarında bu işaretler bulunur. Önce anlam bütünlüğüne dikkat edin.' },
    ],
    keyPoints:['Vakıf = durma noktası','İşaretlere dikkat et','Anlam bütünlüğü önemli','م durulur, لا durulmaz']
  },
  23: {
    id:23, section:5, title:'Vasl (Bağlayarak Okuma)',
    content:[
      { type:'text', text:'Vasl, kelimeleri birbirine bağlayarak okumadır. Bir kelimede durulmadan sonrakine geçilir.' },
      { type:'heading', text:'Hemze-i Vasl' },
      { type:'text', text:'Kelime başındaki bazı hemzeler vasl hemzesidir — önceki kelimeyle bağlanınca okunmaz.' },
      { type:'arabic', text:'بِسْمِ اللهِ', transliteration:'Bismillâh (el değil Lâh)', meaning:'El-Allah birleşince Lâh olur' },
      { type:'note', text:'💡 Sureleri okurken kelimeleri bölmeden akmaya çalışın. Bu vaslın temelidir.' },
    ],
    keyPoints:['Vasl = bağlayarak okuma','Hemze-i vasl düşer','Kelimeler akar','Anlam kopmadan devam']
  },
  24: {
    id:24, section:5, title:'Hemze ve Okunuşları',
    content:[
      { type:'text', text:'Hemze (ء) Arapçada özel bir sestir — boğazdan gelen bir "kesme" sesidir. İki çeşidi vardır.' },
      { type:'heading', text:'Hemze-i Katı\' (Kesme Hemzesi)' },
      { type:'text', text:'Her durumda okunur. Kelimenin başında, ortasında veya sonunda olabilir.' },
      { type:'arabic', text:'أَحَدٌ — إِيَّاكَ — سَأَلَ', transliteration:'Ehadun — İyyâke — Seele', meaning:'Katı hemze — her zaman okunur' },
      { type:'heading', text:'Hemze-i Vasl' },
      { type:'text', text:'Yalnız okunduğunda okunur, vasl yapılınca (bağlanınca) düşer.' },
      { type:'arabic', text:'اقْرَأْ', transliteration:'Ikra\' (tek başına)', meaning:'Bağlanınca hemze düşer' },
    ],
    keyPoints:['Hemze boğaz sesi','Katı hemze her zaman okunur','Vasl hemzesi bağlanınca düşer','Dikkatli ayırt edilmeli']
  },
  25: {
    id:25, section:5, title:'Med Çeşitlerinin Tamamı',
    content:[
      { type:'text', text:'Med (uzatma) çeşitleri ve kaç sayım uzatıldıkları:' },
      { type:'list', items:[
        '⏱️ Med-i Tabiî: 2 sayım — temel uzatma',
        '⏱️⏱️ Med-i Muttasıl: 4-5 sayım — aynı kelimede hemze',
        '⏱️⏱️ Med-i Munfasıl: 4-5 sayım — ayrı kelimede hemze (ihtiyarî)',
        '⏱️⏱️⏱️ Med-i Lâzım: 6 sayım — şedde veya sükun gelince',
        '🔄 Med-i Ârız: 2-4-6 sayım — vakıf halinde',
        '🔄 Med-i Lin: 2-4-6 sayım — durulduğunda',
      ]},
      { type:'note', text:'📌 Med-i muttasıl zorunlu (vacip), munfasıl ihtiyarîdir (okuyan tercih eder). Lâzım hiç kısaltılamaz.' },
    ],
    keyPoints:['6 temel med çeşidi','Tabiî=2, Muttasıl=4-5, Lâzım=6','Muttasıl zorunlu','Lâzım en uzun']
  },
  26: {
    id:26, section:5, title:'Hatalı Okuma Örnekleri',
    content:[
      { type:'text', text:'En sık yapılan okuma hataları ve doğruları:' },
      { type:'list', items:[
        '❌ Med harflerini uzatmamak — ✅ 2 sayım uzat',
        '❌ Şeddeli harfleri tek okumak — ✅ İki kere oku',
        '❌ İhfâ yerine izhâr yapmak — ✅ Gizleyerek geç',
        '❌ Kalın harfleri ince okumak — ✅ Boğazdan çıkar',
        '❌ Vakıf işaretlerini görmezden gelmek — ✅ Dur ve devam et',
        '❌ Ha ve Hı\'yı karıştırmak — ✅ Mahreçleri ayırt et',
      ]},
      { type:'note', text:'💡 Kayıt alın ve kendinizi dinleyin. Hataları fark etmenin en iyi yolu budur.' },
    ],
    keyPoints:['Med ihmal edilmez','Şedde çift okunur','Mahreçlere dikkat','Kendini kaydet ve dinle']
  },
  27: {
    id:27, section:6, title:'Kısa Surelerle Okuma — Fatiha',
    content:[
      { type:'text', text:'Sûre-i Fatiha, namazın her rekâtında okunan 7 ayetlik suredir. Öğrenilmesi farzdır.' },
      { type:'arabic', text:'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ', transliteration:'Bismillâhirrahmânirrahîm', meaning:'Rahman ve Rahim Allah\'ın adıyla' },
      { type:'arabic', text:'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', transliteration:'Elhamdulillâhi rabbil-âlemîn', meaning:'Hamd, âlemlerin Rabbi Allah\'a aittir' },
      { type:'arabic', text:'الرَّحْمَنِ الرَّحِيمِ', transliteration:'Errahmânirrahîm', meaning:'O Rahman\'dır, Rahim\'dir' },
      { type:'arabic', text:'مَالِكِ يَوْمِ الدِّينِ', transliteration:'Mâliki yevmiddîn', meaning:'Din gününün sahibi' },
      { type:'arabic', text:'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ', transliteration:'İyyâke na\'budu ve iyyâke nesta\'în', meaning:'Yalnız sana ibadet eder, yalnız senden yardım dileriz' },
      { type:'arabic', text:'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ', transliteration:'İhdinessırâtal-mustekîm', meaning:'Bizi doğru yola ilet' },
      { type:'arabic', text:'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ', transliteration:'Sırâtallezîne en\'amte aleyhim ğayril-mağdûbi aleyhim veleddâllîn', meaning:'Nimet verdiklerinin yoluna; gazaba uğrayanların ve sapanların değil' },
    ],
    keyPoints:['7 ayet','Namazda okunur','Farz bilmek','Tecvide dikkat et']
  },
  28: {
    id:28, section:6, title:'İhlâs – Felak – Nâs',
    content:[
      { type:'arabic', text:'قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ', transliteration:'Kul huvallâhu ehad. Allâhussamed. Lem yelid ve lem yûled. Ve lem yekun lehu kufuven ehad.', meaning:'İhlâs Suresi — Allah\'ın birliği' },
      { type:'arabic', text:'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۝ مِن شَرِّ مَا خَلَقَ', transliteration:'Kul eûzu bi rabbil-felek. Min şerri mâ halak.', meaning:'Felak Suresi başlangıcı' },
      { type:'arabic', text:'قُلْ أَعُوذُ بِرَبِّ النَّاسِ ۝ مَلِكِ النَّاسِ ۝ إِلَهِ النَّاسِ', transliteration:'Kul eûzu bi rabbin-nâs. Melikin-nâs. İlâhin-nâs.', meaning:'Nâs Suresi başlangıcı' },
      { type:'note', text:'📌 Bu üç sure "Muavvizât" olarak bilinir ve her gün okunması tavsiye edilir.' },
    ],
    keyPoints:['İhlâs: 4 ayet','Felak: 5 ayet','Nas: 6 ayet','Her gün okunması sünnet']
  },
  29: {
    id:29, section:6, title:'Kevser – Asr – Fîl',
    content:[
      { type:'arabic', text:'إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ ۝ فَصَلِّ لِرَبِّكَ وَانْحَرْ ۝ إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ', transliteration:'İnnâ a\'taynâkel-kevser. Fasalli li rabbike venhar. İnne şânieke hevel-ebter.', meaning:'Kevser Suresi — 3 ayet' },
      { type:'arabic', text:'وَالْعَصْرِ ۝ إِنَّ الْإِنسَانَ لَفِي خُسْرٍ ۝ إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ', transliteration:'Vel-asr. İnnel-insâne lefî husr. İllellezîne âmenû ve amilus-sâlihât...', meaning:'Asr Suresi başlangıcı' },
      { type:'note', text:'💡 Bu sureler namazda sık kullanılır. Önce anlamını öğrenmek motivasyonu artırır.' },
    ],
    keyPoints:['Kısa sureler','Namazda kullanılır','Anlamlarını öğren','Tecvidi uygula']
  },
  30: {
    id:30, section:6, title:'Sure Okurken Tecvid Uygulaması',
    content:[
      { type:'text', text:'Öğrenilen tüm tecvid kurallarını sure okurken uygulayalım. Fatiha üzerinden örnek:' },
      { type:'list', items:[
        '📏 "Bismillâh" — lam-ı tarif: şemsî/kamerî yok',
        '📏 "Errahmânirrahîm" — şeddeli Ra: kalın, idğam yok',
        '📏 "Rabbil-âlemîn" — lam: kamerî açık okunur',
        '📏 "Mâliki" — med-i tabiî: 2 sayım',
        '📏 "İyyâke" — hemze-i katı: her zaman okunur',
        '📏 "Nesta\'în" — ayn: boğazdan çıkar',
        '📏 "el-mustekîm" — şemsî: lam düşer, sin şeddeli gibi',
      ]},
      { type:'note', text:'📌 Her okumadan önce niyet edin: "Allah\'ın kelamını doğru okumak için öğreniyorum."' },
    ],
    keyPoints:['Fatiha üzerinden uygulama','Her kurala dikkat et','Yavaş ve dikkatli oku','Kayıt alarak kontrol et']
  },
  31: {
    id:31, section:7, title:'Akıcı Okuma Çalışmaları',
    content:[
      { type:'text', text:'Akıcı okuma, kuralları otomatik hale getirmekle gelir. Bunun için düzenli pratik şarttır.' },
      { type:'heading', text:'Günlük Pratik Planı' },
      { type:'list', items:[
        '🌅 Sabah: Bilinen kısa sureleri oku (5 dk)',
        '📖 Öğle: Yeni ders çalış (10 dk)',
        '🌙 Akşam: Gün içinde okunanları tekrar et (5 dk)',
        '🎙️ Haftalık: Kendinizi kaydedin ve dinleyin',
      ]},
      { type:'note', text:'💡 Günde 20 dakika düzenli çalışmak, haftada bir kez 3 saat çalışmaktan daha verimlidir.' },
    ],
    keyPoints:['Günlük pratik şart','20 dk/gün yeterli','Sabah-öğle-akşam planı','Kayıt alarak takip et']
  },
  32: {
    id:32, section:7, title:'Nefes ve Duraklama',
    content:[
      { type:'text', text:'Doğru nefes tekniği, Kur\'an okumayı kolaylaştırır ve sesi güzelleştirir.' },
      { type:'heading', text:'Nefes Alma Yerleri' },
      { type:'list', items:[
        '✅ Ayetin sonunda (vakıf işaretlerinde)',
        '✅ Uzun ayetin ortasındaki durma işaretlerinde',
        '❌ Anlam bütünlüğünü bozan yerlerde DURMA',
        '❌ "لا" işaretinde asla durma',
      ]},
      { type:'text', text:'Nefes egzersizi: Derin nefes al, 4 sayım tut, yavaşça bırak. Okurken göğüs değil, diyafram kullan.' },
      { type:'note', text:'💡 Uzun ayetlerde kelime ortasında nefes almak hata sayılır. Anlam bütünlüğü bozulur.' },
    ],
    keyPoints:['Vakıf noktalarında nefes','Anlam bözulmadan dur','Diyafram kullan','Kelime ortasında nefes alma']
  },
  33: {
    id:33, section:7, title:'Ses Tonu ve Eda',
    content:[
      { type:'text', text:'Kur\'an okumada ses güzelliği sünnet, doğru okumak ise farzdır. Önce doğruluğu hedefleyin.' },
      { type:'heading', text:'Güzel Ses İçin Tavsiyeler' },
      { type:'list', items:[
        '🎵 Makam: Hicaz, Rast, Saba makamları Kur\'an için yaygın',
        '🔊 Ses: Ne çok yüksek ne çok alçak — orta tonda başla',
        '💧 Hydrasyon: Okumadan önce su iç, boğaz ıslak olsun',
        '😌 Huzur: Sakin bir ortamda, temiz bir kalpte oku',
        '🎙️ Pratik: Güzel okuyanları dinle ve taklit et',
      ]},
      { type:'note', text:'📌 Peygamberimiz (s.a.v.): "Kur\'an\'ı seslerinizle süsleyin." (Ebu Davud)' },
    ],
    keyPoints:['Doğruluk önce gelir','Orta tonda başla','Makamlara aşina ol','Güzel okuyanları dinle']
  },
  34: {
    id:34, section:7, title:'Sık Yapılan Hatalar',
    content:[
      { type:'text', text:'Öğrencilerin en sık yaptığı hatalar ve düzeltme yolları:' },
      { type:'list', items:[
        '❌ Ğayn\'ı Ğ gibi okumak → ✅ Boğazdan yumuşak çıkar',
        '❌ Kaf\'ı K gibi okumak → ✅ Damaktan derin çıkar',
        '❌ Ayn\'ı Hemze gibi okumak → ✅ Boğaz sıkışarak açılır',
        '❌ Dad\'ı D gibi okumak → ✅ Dil yanından çıkar',
        '❌ Tı\'yı T gibi okumak → ✅ Kalın ve vurgulu çıkar',
        '❌ Med harflerini kısmak → ✅ 2 sayım minimum',
        '❌ Şeddeyi tek okumak → ✅ İki kere bas',
      ]},
      { type:'note', text:'💡 Bu harfleri yavaş yavaş, mahreçlerine dikkat ederek tekrar edin. Ustaz\'dan düzeltme aldırmak en iyisidir.' },
    ],
    keyPoints:['Özel harflere dikkat','Mahreçten çıkar','Med kısaltılmaz','Hoca kontrolü önemli']
  },
  35: {
    id:35, section:8, title:'Tecvid Tekrar ve Pekiştirme',
    content:[
      { type:'text', text:'Tüm öğrenilen tecvid kurallarının özet tekrarı:' },
      { type:'list', items:[
        '📌 Nun sakin: İzhâr (6 harf) — İdğam (6 harf) — İklab (ب) — İhfâ (15 harf)',
        '📌 Mim sakin: İzhâr-ı şefevî — İdğam-ı misleyn — İhfâ-ı şefevî',
        '📌 Med: Tabiî (2) — Muttasıl (4-5) — Munfasıl (4-5) — Lâzım (6)',
        '📌 Lam-ı tarif: 14 şemsî, 14 kamerî',
        '📌 Kalın harfler: خ ص ض غ ط ق ظ',
        '📌 Şedde: Çift harf, 2 sayım',
      ]},
      { type:'note', text:'📌 Bu özeti haftalık tekrar edin. Kur\'an\'ın her sayfasında bu kurallar defalarca karşınıza çıkar.' },
    ],
    keyPoints:['Tüm kuralların özeti','Haftalık tekrar','Kur\'an üzerinde uygula','Hata yaptıkça öğrenilir']
  },
  36: {
    id:36, section:8, title:'Mukabele Usulü Okuma',
    content:[
      { type:'text', text:'Mukabele, iki kişinin karşılıklı Kur\'an okumasıdır. Biri okur, diğeri takip eder ve hata varsa düzeltir.' },
      { type:'heading', text:'Mukabelenin Faydaları' },
      { type:'list', items:[
        '👁️ Hataların fark edilmesi',
        '🎯 Dikkat ve konsantrasyonun artması',
        '🤝 Topluluk ruhu ve motivasyon',
        '📈 Daha hızlı ilerleme',
        '⚡ Vakıf ve vaslın pratik edilmesi',
      ]},
      { type:'text', text:'Ramazanda tamamlanan hatimler çoğunlukla mukabele usulüyle yapılır.' },
      { type:'note', text:'💡 Bir hoca veya tecrübeli okuyucuyla mukabele yapabilirseniz çok değerli bir fırsattır.' },
    ],
    keyPoints:['İki kişi karşılıklı okur','Hatalar düzeltilir','Motivasyon artar','Ramazan geleneği']
  },
  37: {
    id:37, section:8, title:'Hafızlık Altyapısı',
    content:[
      { type:'text', text:'Hafız olmak için önce tecvidi sağlam öğrenmek, ardından sistematik ezber metodunu uygulamak gerekir.' },
      { type:'heading', text:'Ezber Metodu' },
      { type:'list', items:[
        '1️⃣ Ayet ayet ezberle, tamamını değil',
        '2️⃣ Her yeni ayeti öncekiyle bağla',
        '3️⃣ Sabah uyandığında tekrar et (beyin hafızası taze)',
        '4️⃣ Aynı sayfayı 40 kez oku (Şeyh yöntemi)',
        '5️⃣ Yeni ezber + eski tekrar — her gün ikisi birlikte',
      ]},
      { type:'note', text:'📌 Hafızlık bir maratondur. Hız değil, sabır ve düzen en önemli unsurdur.' },
    ],
    keyPoints:['Ayet ayet ezberle','Sabah tekrar en verimli','Eski ezberi ihmal etme','Sabır ve düzen şart']
  },
  38: {
    id:38, section:8, title:'Güzel Okuma — Tertil, Tahkik, Tedvir',
    content:[
      { type:'text', text:'Kur\'an\'ın üç okunuş hızı ve her birinin özellikleri:' },
      { type:'heading', text:'Tahkik — En Yavaş' },
      { type:'text', text:'Her harfe, her harekâta, her tecvide tam dikkat. Öğrenciler ve öğretenler için ideal. Hız yavaş, doğruluk maksimum.' },
      { type:'heading', text:'Tedvir — Orta Hız' },
      { type:'text', text:'Tecvide dikkat ederek normal tempo. Çoğu Kur\'an okuyucusunun benimsediği hız.' },
      { type:'heading', text:'Hadr — En Hızlı' },
      { type:'text', text:'Tecvidi koruyarak en hızlı okuma. Yalnızca tecvidi tam özümsemiş okuyucular için. Hız artsa da kurallar korunur.' },
      { type:'arabic', text:'وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا', transliteration:'Ve rettilil-kur\'âne tertîlâ', meaning:'Kur\'an\'ı tertil üzere oku (Müzzemmil: 4)' },
      { type:'note', text:'🎓 Tebrikler! 38 dersi tamamladınız. Şimdi düzenli okuma ve hoca takibiyle devam edin.' },
    ],
    keyPoints:['Tahkik: yavaş ve dikkatli','Tedvir: orta hız','Hadr: hızlı ama kurallı','Kur\'an emreder: tertil ile oku']
  },
}
