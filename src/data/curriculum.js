export const LETTERS = [
  { ar:'أ', name:'Elif', group:1 },  { ar:'ب', name:'Be', group:1 },
  { ar:'ت', name:'Te', group:1 },    { ar:'ث', name:'Se', group:1 },
  { ar:'ج', name:'Cim', group:1 },   { ar:'ح', name:'Ha', group:1 },
  { ar:'خ', name:'Hı', group:1 },    { ar:'د', name:'Dal', group:2 },
  { ar:'ذ', name:'Zel', group:2 },   { ar:'ر', name:'Re', group:2 },
  { ar:'ز', name:'Ze', group:2 },    { ar:'س', name:'Sin', group:2 },
  { ar:'ش', name:'Şin', group:2 },   { ar:'ص', name:'Sad', group:2 },
  { ar:'ض', name:'Dad', group:2 },   { ar:'ط', name:'Tı', group:3 },
  { ar:'ظ', name:'Zı', group:3 },    { ar:'ع', name:'Ayn', group:3 },
  { ar:'غ', name:'Ğayn', group:3 },  { ar:'ف', name:'Fe', group:3 },
  { ar:'ق', name:'Kaf', group:3 },   { ar:'ك', name:'Kef', group:3 },
  { ar:'ل', name:'Lam', group:4 },   { ar:'م', name:'Mim', group:4 },
  { ar:'ن', name:'Nun', group:4 },   { ar:'ه', name:'He', group:4 },
  { ar:'و', name:'Vav', group:4 },   { ar:'ي', name:'Ye', group:4 },
]

export const HAREKELER = [
  { symbol:'َ', name:'Üstün', sound:'a', color:'#ef4444', desc:'Harfin üstüne konur — "a" sesi verir' },
  { symbol:'ِ', name:'Esre',  sound:'i', color:'#3b82f6', desc:'Harfin altına konur — "i" sesi verir' },
  { symbol:'ُ', name:'Ötre',  sound:'u', color:'#22c55e', desc:'Harfin üstüne konur — "u" sesi verir' },
]

export const SYLLABLES = [
  { ar:'بَ', tr:'Ba', hareke:'üstün' }, { ar:'تَ', tr:'Ta', hareke:'üstün' },
  { ar:'جَ', tr:'Ca', hareke:'üstün' }, { ar:'دَ', tr:'Da', hareke:'üstün' },
  { ar:'رَ', tr:'Ra', hareke:'üstün' }, { ar:'سَ', tr:'Sa', hareke:'üstün' },
  { ar:'مَ', tr:'Ma', hareke:'üstün' }, { ar:'نَ', tr:'Na', hareke:'üstün' },
  { ar:'لَ', tr:'La', hareke:'üstün' }, { ar:'كَ', tr:'Ka', hareke:'üstün' },
  { ar:'بِ', tr:'Bi', hareke:'esre' }, { ar:'تِ', tr:'Ti', hareke:'esre' },
  { ar:'جِ', tr:'Ci', hareke:'esre' }, { ar:'دِ', tr:'Di', hareke:'esre' },
  { ar:'رِ', tr:'Ri', hareke:'esre' }, { ar:'سِ', tr:'Si', hareke:'esre' },
  { ar:'مِ', tr:'Mi', hareke:'esre' }, { ar:'نِ', tr:'Ni', hareke:'esre' },
  { ar:'بُ', tr:'Bu', hareke:'ötre' }, { ar:'تُ', tr:'Tu', hareke:'ötre' },
  { ar:'جُ', tr:'Cu', hareke:'ötre' }, { ar:'دُ', tr:'Du', hareke:'ötre' },
  { ar:'رُ', tr:'Ru', hareke:'ötre' }, { ar:'مُ', tr:'Mu', hareke:'ötre' },
  { ar:'نُ', tr:'Nu', hareke:'ötre' }, { ar:'لُ', tr:'Lu', hareke:'ötre' },
]

export const WORDS = [
  { ar:'بَابٌ', tr:'Bâb', meaning:'Kapı' },
  { ar:'كِتَابٌ', tr:'Kitâb', meaning:'Kitap' },
  { ar:'نُورٌ', tr:'Nûr', meaning:'Işık' },
  { ar:'رَبٌّ', tr:'Rabb', meaning:'Rab' },
  { ar:'يَدٌ', tr:'Yed', meaning:'El' },
  { ar:'قَلَمٌ', tr:'Kalem', meaning:'Kalem' },
  { ar:'بَيْتٌ', tr:'Beyt', meaning:'Ev' },
  { ar:'أُمٌّ', tr:'Üm', meaning:'Anne' },
  { ar:'مَاءٌ', tr:'Mâ', meaning:'Su' },
  { ar:'سَمَاءٌ', tr:'Semâ', meaning:'Gökyüzü' },
]

export const SURAS = [
  { key:'fatiha', name:'Fatiha Suresi', nameAr:'سورة الفاتحة', emoji:'🌟', ayahs:[
    { ar:'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ', tr:'Bismillâhirrahmânirrahîm', meaning:"Allah'ın adıyla — O Rahman'dır, Rahim'dir" },
    { ar:'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', tr:'Elhamdülillâhi rabbil-âlemîn', meaning:"Hamd, âlemlerin Rabbi Allah'a" },
    { ar:'الرَّحْمَنِ الرَّحِيمِ', tr:'Errahmânirrahîm', meaning:"O Rahman'dır, Rahim'dir" },
    { ar:'مَالِكِ يَوْمِ الدِّينِ', tr:'Mâliki yevmiddîn', meaning:'Din gününün sahibi' },
    { ar:'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ', tr:"İyyâke na'budu ve iyyâke nesta'în", meaning:'Yalnız sana ibadet eder, yalnız senden yardım dileriz' },
    { ar:'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ', tr:'İhdinessırâtal-mustekîm', meaning:'Bizi doğru yola ilet' },
    { ar:'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ', tr:"Sırâtallezîne en'amte aleyhim, ğayril-mağdûbi aleyhim veleddâllîn", meaning:'Nimet verdiklerinin yoluna; gazaba uğrayanların ve sapanların değil' },
  ]},
  { key:'ihlas', name:'İhlâs Suresi', nameAr:'سورة الإخلاص', emoji:'💚', ayahs:[
    { ar:'قُلْ هُوَ اللَّهُ أَحَدٌ', tr:'Kul huvallâhu ehad', meaning:'De ki: O Allah birdir' },
    { ar:'اللَّهُ الصَّمَدُ', tr:'Allâhussamed', meaning:"Allah Samed'dir" },
    { ar:'لَمْ يَلِدْ وَلَمْ يُولَدْ', tr:'Lem yelid ve lem yûled', meaning:'Doğurmamış ve doğurulmamıştır' },
    { ar:'وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ', tr:'Ve lem yekun lehu kufuven ehad', meaning:"Hiçbir şey O'na denk değildir" },
  ]},
  { key:'nas', name:'Nâs Suresi', nameAr:'سورة الناس', emoji:'🛡️', ayahs:[
    { ar:'قُلْ أَعُوذُ بِرَبِّ النَّاسِ', tr:"Kul eûzu bi rabbin-nâs", meaning:"İnsanların Rabbi'ne sığınırım" },
    { ar:'مَلِكِ النَّاسِ', tr:'Melikin-nâs', meaning:"İnsanların Meliği'ne" },
    { ar:'إِلَهِ النَّاسِ', tr:'İlâhin-nâs', meaning:"İnsanların İlahı'na" },
    { ar:'مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ', tr:'Min şerril-vesvâsil-hannâs', meaning:'Sinsi vesvesecinin şerrinden' },
    { ar:'الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ', tr:'Ellezî yuvesvisu fî sudûrin-nâs', meaning:"İnsanların göğüslerine vesvese veren" },
    { ar:'مِنَ الْجِنَّةِ وَالنَّاسِ', tr:'Minel-cinneti ven-nâs', meaning:'Cinlerden ve insanlardan' },
  ]},
]

export const SECTIONS = [
  { id:1, title:'Harfleri Tanıyalım', emoji:'🔤', color:'#7c3aed', sub:'28 Arap harfini öğren', lessons:['letters-1','letters-2','letters-3','letters-4'] },
  { id:2, title:'Harekeler', emoji:'🎵', color:'#dc2626', sub:'Harfleri seslendir', lessons:['hareke-1','hareke-2','hareke-3'] },
  { id:3, title:'Heceleri Oku', emoji:'👄', color:'#0891b2', sub:'Harf + hareke = hece', lessons:['syllable-1','syllable-2','syllable-3'] },
  { id:4, title:'Kelimeler', emoji:'📝', color:'#16a34a', sub:"Kur'an'dan kelimeler", lessons:['words'] },
  { id:5, title:'Kısa Sureler', emoji:'🕌', color:'#b45309', sub:'Fatiha, İhlâs, Nâs', lessons:['fatiha','ihlas','nas'] },
]
