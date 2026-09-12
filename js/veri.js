/* ============================================================
   ============================================================
   💸 VERGİ OYUNU — VERİ DOSYASI
   ============================================================
   Bu dosya tüm sabit verileri içerir.
   Global namespace: window.VERGI
   ============================================================
*/

(function () {
  "use strict";

  // Global namespace oluştur
  window.VERGI = window.VERGI || {};

  // ============================================================
  // 1. OYUN SABİTLERİ
  // ============================================================
  VERGI.SABITLER = {
    VERSIYON: "1.0.0",
    OYUN_ADI: "Vergi Oyunu",
    OYUN_ALT_ADI: "Her Şeyden Vergi Ödüyorum",
    YAPIMCI: "Vergi Oyunu Ekibi",

    // Zaman
    GUN_SANIYE_TEST: 120,      // Test: 1 gün = 2 dakika
    GUN_SANIYE_GERCEK: 24 * 60, // Gerçek: 24 dakika
    MAX_GUN: 2,

    // Hareket
    HAREKET_HIZI: 3.5,
    HAREKET_HIZI_KOS: 5.5,

    // Canvas
    CANVAS_GENISLIK: 800,
    CANVAS_YUKSEKLIK: 600,

    // Açlık
    ACIKMA_HIZI: 100 / 90,     // 90 saniyede açlık biter

    // Başlangıç
    BASLANGIC_PARA: 1000,
    BASLANGIC_MORAL: 60,
    BASLANGIC_ACLIK: 100,

    // Sınırlar
    PARA_MAX: 999999,
    MORAL_MAX: 100,
    MORAL_MIN: 0,
    ACLIK_MAX: 100,
    ACLIK_MIN: 0,

    // Ekonomi
    GUNLUK_MAAŞ: 250,
    VERGI_ARTIS_ORANI: 0.1,

    // Kayıt
    KAYIT_PREFIX: "vergiOyunu_",
    MAX_KAYIT_SLOT: 3,
  };

  // ============================================================
  // 2. VERGİLER (40+)
  // ============================================================
  VERGI.VERGILER = [
    // Klasik
    { id: "cay", ikon: "🫖", ad: "Çay Vergisi", aciklama: "Bugün çay içtin. Bardak başına 5 TL!", min: 40, max: 100, kategori: "yemek" },
    { id: "simit", ikon: "🥖", ad: "Simit Vergisi", aciklama: "Sabah simit aldın. Her simit için vergi!", min: 30, max: 90, kategori: "yemek" },
    { id: "su", ikon: "💧", ad: "Su İçme Vergisi", aciklama: "Hayat kaynağı da vergilendirilir.", min: 40, max: 100, kategori: "yemek" },
    { id: "yemek", ikon: "🍕", ad: "Yemek Yeme Vergisi", aciklama: "Yemek yedin. Lokma başına vergi!", min: 100, max: 220, kategori: "yemek" },
    { id: "kahve", ikon: "☕", ad: "Kahve Vergisi", aciklama: "Sabah kahveni içtin. Kafein vergisi!", min: 60, max: 140, kategori: "yemek" },

    // Vücut
    { id: "nefes", ikon: "😮‍💨", ad: "Nefes Alma Vergisi", aciklama: "Bugün 20.000 kez nefes aldın.", min: 80, max: 150, kategori: "vücut" },
    { id: "yurume", ikon: "🚶", ad: "Yürüme Vergisi", aciklama: "Adım başına 2 kuruş. Bugün çok yürüdün!", min: 60, max: 120, kategori: "vücut" },
    { id: "uyku", ikon: "😴", ad: "Uyku Vergisi", aciklama: "8 saat uyudun. Saat başına 25 TL!", min: 100, max: 180, kategori: "vücut" },
    { id: "tuvalet", ikon: "🚽", ad: "Tuvalet Vergisi", aciklama: "Doğal ihtiyaç da vergilendirilir!", min: 40, max: 90, kategori: "vücut" },
    { id: "gozkirp", ikon: "👁️", ad: "Göz Kırpma Vergisi", aciklama: "Bugün 15.000 kez göz kırptın.", min: 120, max: 220, kategori: "vücut" },
    { id: "esnem", ikon: "🥱", ad: "Esneme Vergisi", aciklama: "Bugün 12 kez esnedin. Her esneme 10 TL!", min: 90, max: 160, kategori: "vücut" },
    { id: "oksuru", ikon: "🤧", ad: "Öksürme Vergisi", aciklama: "Hasta mısın? Öksürmek de vergili!", min: 40, max: 100, kategori: "vücut" },
    { id: "sarilma", ikon: "🤗", ad: "Sarılmak Vergisi", aciklama: "Sevdiklerine sarıldın. Duygusal vergi!", min: 70, max: 150, kategori: "vücut" },
    { id: "gulumse", ikon: "😊", ad: "Gülümseme Vergisi", aciklama: "Mutlu görünüyorsun. Devlet bunu vergilendirir!", min: 50, max: 120, kategori: "vücut" },
    { id: "dusun", ikon: "🧠", ad: "Düşünme Vergisi", aciklama: "Bugün çok düşündün!", min: 100, max: 200, kategori: "vücut" },

    // Eşya
    { id: "sarj", ikon: "🔌", ad: "Telefon Şarj Vergisi", aciklama: "Elektrik + vergi!", min: 30, max: 80, kategori: "eşya" },
    { id: "klima", ikon: "❄️", ad: "Klima Vergisi", aciklama: "Yazın serinledin, kışın ısındın!", min: 100, max: 220, kategori: "eşya" },
    { id: "tv", ikon: "📺", ad: "TV İzleme Vergisi", aciklama: "Ekran başında 3 saat geçirdin!", min: 100, max: 200, kategori: "eşya" },
    { id: "oyun", ikon: "🎮", ad: "Oyun Oynama Vergisi", aciklama: "Eğlenmek yasak değil, ama vergili!", min: 80, max: 160, kategori: "eşya" },
    { id: "dus", ikon: "🚿", ad: "Duş Alma Vergisi", aciklama: "Su + sabun + zaman. Hepsi vergili!", min: 100, max: 200, kategori: "eşya" },
    { id: "sakiz", ikon: "🍬", ad: "Sakız Vergisi", aciklama: "Çiğneme sesi devleti rahatsız etti!", min: 40, max: 80, kategori: "eşya" },
    { id: "ayakkabi", ikon: "👟", ad: "Ayakkabı Giyiş Vergisi", aciklama: "Ayakkabını giydin. Her giyiş için!", min: 40, max: 100, kategori: "eşya" },
    { id: "kitap", ikon: "📚", ad: "Kitap Okuma Vergisi", aciklama: "Bilgiye erişim de vergili!", min: 60, max: 130, kategori: "eşya" },

    // Sosyal
    { id: "kedi", ikon: "🐈", ad: "Kedi Sevmek Vergisi", aciklama: "Sevgi de vergili!", min: 50, max: 100, kategori: "sosyal" },
    { id: "kus", ikon: "🐦", ad: "Kuş Sesinden Vergi", aciklama: "Doğal müzikten vergi!", min: 30, max: 80, kategori: "sosyal" },
    { id: "kutuphane", ikon: "📖", ad: "Kütüphane Vergisi", aciklama: "Sessizlik de vergili!", min: 50, max: 110, kategori: "sosyal" },
    { id: "park", ikon: "🌳", ad: "Park Kullanma Vergisi", aciklama: "Doğa da devletin!", min: 60, max: 130, kategori: "sosyal" },

    // Doğa
    { id: "gunes", ikon: "☀️", ad: "Güneş Işığı Vergisi", aciklama: "Bugün güneşe çıktın!", min: 70, max: 140, kategori: "doğa" },
    { id: "yagmur", ikon: "🌧️", ad: "Yağmur İzleme Vergisi", aciklama: "Cama çıkıp yağmuru seyrettin!", min: 70, max: 140, kategori: "doğa" },
    { id: "ruzgar", ikon: "🌬️", ad: "Rüzgar Kullanma Vergisi", aciklama: "Rüzgardan faydalandın!", min: 50, max: 120, kategori: "doğa" },
    { id: "kar", ikon: "❄️", ad: "Kar Topu Vergisi", aciklama: "Kar topu oynadın!", min: 80, max: 160, kategori: "doğa" },
    { id: "toprak", ikon: "🌱", ad: "Toprak Koklama Vergisi", aciklama: "Yağmur sonrası toprak kokusu!", min: 40, max: 100, kategori: "doğa" },

    // Ulaşım
    { id: "trafik", ikon: "🚦", ad: "Trafik Işığı Vergisi", aciklama: "Kırmızıda beklerken vakit kaybettin!", min: 80, max: 160, kategori: "ulaşım" },
    { id: "poset", ikon: "🛍️", ad: "Market Poşeti Vergisi", aciklama: "Her poşet için ayrı vergi!", min: 30, max: 80, kategori: "ulaşım" },
    { id: "yol", ikon: "🛣️", ad: "Yol Kullanma Vergisi", aciklama: "Yolda yürüdün!", min: 40, max: 100, kategori: "ulaşım" },
    { id: "otobus", ikon: "🚌", ad: "Otobüs Bekleme Vergisi", aciklama: "Durakta bekledin!", min: 40, max: 90, kategori: "ulaşım" },

    // Soyut
    { id: "verginin_vergisi", ikon: "💰", ad: "Verginin Vergisi", aciklama: "Ödediğin vergiden de vergi alıyoruz.", min: 150, max: 250, kategori: "soyut" },
    { id: "hayal", ikon: "💭", ad: "Hayal Kurma Vergisi", aciklama: "Dün gece rüya gördün. Hayal kurmak lüks!", min: 80, max: 170, kategori: "soyut" },
    { id: "gece", ikon: "🌙", ad: "Gece Uyanık Kalma Vergisi", aciklama: "Gece 12'den sonra uyanıktın!", min: 60, max: 130, kategori: "soyut" },
    { id: "sac", ikon: "💈", ad: "Saç Tarama Vergisi", aciklama: "Aynanın karşısında 5 dakika geçirdin!", min: 50, max: 110, kategori: "soyut" },
    { id: "giyim", ikon: "👔", ad: "Kıyafet Giyiş Vergisi", aciklama: "Kıyafetini giydin!", min: 40, max: 90, kategori: "soyut" },
    { id: "golge", ikon: "🌑", ad: "Gölge Kullanma Vergisi", aciklama: "Gölgen bile devletin!", min: 50, max: 110, kategori: "soyut" },
    { id: "isim", ikon: "📛", ad: "İsmini Kullanma Vergisi", aciklama: "İsmini söyledin. Devlet kaydetti!", min: 30, max: 80, kategori: "soyut" },
    { id: "vakit", ikon: "⏰", ad: "Zaman Geçirme Vergisi", aciklama: "Zaman geçti. Sen de vergi öde!", min: 100, max: 200, kategori: "soyut" },
    { id: "var_olma", ikon: "✨", ad: "Var Olma Vergisi", aciklama: "Var olduğun için vergi!", min: 200, max: 350, kategori: "soyut" },
  ];

  // ============================================================
  // 3. MESLEKLER (Karakter Seçimi)
  // ============================================================
  VERGI.MESLEKLER = [
    {
      id: "memur",
      ikon: "👔",
      ad: "Memur",
      aciklama: "Sabit maaş, düzenli vergi",
      para: 1000,
      moral: 60,
      aclik: 100,
      gelir: 250,
      zorluk: 1,
      ozellik: "Vergilerden %10 indirim",
      bonus: { vergi_indirim: 0.1 },
    },
    {
      id: "isci",
      ikon: "🔧",
      ad: "İşçi",
      aciklama: "Değişken maaş, yüksek vergi",
      para: 800,
      moral: 50,
      aclik: 100,
      gelir: 300,
      zorluk: 2,
      ozellik: "Fazla mesai: +50 TL/gün",
      bonus: { fazla_mesai: 50 },
    },
    {
      id: "serbest",
      ikon: "💼",
      ad: "Serbest Meslek",
      aciklama: "Kendi vergini öde",
      para: 1500,
      moral: 55,
      aclik: 100,
      gelir: 400,
      zorluk: 3,
      ozellik: "Vergi affı şansı %20",
      bonus: { affı_sansi: 0.2 },
    },
    {
      id: "emekli",
      ikon: "🧓",
      ad: "Emekli",
      aciklama: "Düşük gelir, muafiyet",
      para: 2000,
      moral: 70,
      aclik: 100,
      gelir: 150,
      zorluk: 2,
      ozellik: "Bazı vergilerden muaf",
      bonus: { muafiyet: ["cay", "simit", "kahve"] },
    },
    {
      id: "ogrenci",
      ikon: "🎓",
      ad: "Öğrenci",
      aciklama: "Burs + indirim",
      para: 500,
      moral: 80,
      aclik: 100,
      gelir: 100,
      zorluk: 3,
      ozellik: "Tüm harcamalar %20 indirimli",
      bonus: { harcama_indirim: 0.2 },
    },
    {
      id: "milyarder",
      ikon: "💎",
      ad: "Milyarder",
      aciklama: "Çok para, çok vergi",
      para: 10000,
      moral: 90,
      aclik: 100,
      gelir: 1000,
      zorluk: 4,
      ozellik: "Vergiler %50 daha fazla!",
      bonus: { vergi_artis: 0.5 },
    },
  ];

  // ============================================================
  // 4. MARKET ÜRÜNLERİ
  // ============================================================
  VERGI.MARKET_URUNLERI = [
    // Yiyecek
    { id: "ekmek", ikon: "🍞", ad: "Ekmek", aciklama: "+40 açlık", fiyat: 50, etki: { aclik: 40 } },
    { id: "su", ikon: "💧", ad: "Su", aciklama: "+20 açlık, +10 moral", fiyat: 30, etki: { aclik: 20, moral: 10 } },
    { id: "cay", ikon: "🫖", ad: "Çay", aciklama: "+15 moral", fiyat: 15, etki: { moral: 15 } },
    { id: "simit", ikon: "🥖", ad: "Simit", aciklama: "+25 açlık, +5 moral", fiyat: 20, etki: { aclik: 25, moral: 5 } },
    { id: "kahve", ikon: "☕", ad: "Kahve", aciklama: "+20 moral", fiyat: 40, etki: { moral: 20 } },
    { id: "pizza", ikon: "🍕", ad: "Pizza", aciklama: "+60 açlık, +20 moral", fiyat: 100, etki: { aclik: 60, moral: 20 } },
    { id: "kebap", ikon: "🥙", ad: "Kebap", aciklama: "+80 açlık, +25 moral", fiyat: 150, etki: { aclik: 80, moral: 25 } },
    { id: "tatli", ikon: "🍰", ad: "Tatlı", aciklama: "+10 açlık, +30 moral", fiyat: 80, etki: { aclik: 10, moral: 30 } },

    // Sağlık
    { id: "ilac", ikon: "💊", ad: "İlaç", aciklama: "+30 moral", fiyat: 150, etki: { moral: 30 } },
    { id: "vitamin", ikon: "💉", ad: "Vitamin", aciklama: "+20 moral, +10 açlık", fiyat: 100, etki: { moral: 20, aclik: 10 } },
    { id: "masaj", ikon: "💆", ad: "Masaj", aciklama: "+40 moral", fiyat: 200, etki: { moral: 40 } },

    // Eğlence
    { id: "kitap", ikon: "📚", ad: "Kitap", aciklama: "+15 moral", fiyat: 80, etki: { moral: 15 } },
    { id: "film", ikon: "🎬", ad: "Film Bileti", aciklama: "+25 moral", fiyat: 120, etki: { moral: 25 } },
    { id: "oyun", ikon: "🎮", ad: "Oyun", aciklama: "+30 moral", fiyat: 200, etki: { moral: 30 } },

    // Kıyafet
    { id: "tisort", ikon: "👕", ad: "Tişört", aciklama: "+10 moral", fiyat: 100, etki: { moral: 10 }, kalici: true },
    { id: "pantolon", ikon: "👖", ad: "Pantolon", aciklama: "+15 moral", fiyat: 150, etki: { moral: 15 }, kalici: true },
    { id: "mont", ikon: "🧥", ad: "Mont", aciklama: "+20 moral", fiyat: 250, etki: { moral: 20 }, kalici: true },

    // Özel
    { id: "semsiye", ikon: "☂️", ad: "Şemsiye", aciklama: "Yağmurdan korur", fiyat: 120, etki: { moral: 5 }, kalici: true },
    { id: "araba", ikon: "🚗", ad: "Araba", aciklama: "Hız +50%", fiyat: 2000, etki: { hiz: 1.5 }, kalici: true },
  ];

  // ============================================================
  // 5. BAŞARIMLAR (ROZETLER)
  // ============================================================
  VERGI.BASARIMLAR = [
    // Ekonomi
    { id: "ilk_para", ikon: "💰", ad: "İlk Kuruş", aciklama: "İlk paranı kazan", kosul: "para_kazan_100" },
    { id: "zengin", ikon: "💎", ad: "Zengin", aciklama: "5000 TL biriktir", kosul: "para_5000" },
    { id: "milyoner", ikon: "🏦", ad: "Milyoner", aciklama: "10000 TL biriktir", kosul: "para_10000" },
    { id: "iflas", ikon: "💸", ad: "İflas", aciklama: "Parasız kal", kosul: "para_0" },

    // Vergi
    { id: "ilk_vergi", ikon: "📋", ad: "İlk Vergi", aciklama: "İlk vergini öde", kosul: "vergi_ode_1" },
    { id: "vergi_usta", ikon: "🎯", ad: "Vergi Ustası", aciklama: "10 vergi öde", kosul: "vergi_ode_10" },
    { id: "vergi_krali", ikon: "👑", ad: "Vergi Kralı", aciklama: "50 vergi öde", kosul: "vergi_ode_50" },
    { id: "isyan", ikon: "🙅", ad: "İsyan", aciklama: "10 vergi reddet", kosul: "vergi_red_10" },

    // Gün
    { id: "ilk_gun", ikon: "📅", ad: "İlk Gün", aciklama: "1. günü tamamla", kosul: "gun_1" },
    { id: "hayatta", ikon: "🏆", ad: "Hayatta", aciklama: "2 günü tamamla", kosul: "gun_2" },
    { id: "olmez", ikon: "💪", ad: "Ölmez", aciklama: "Hiç ölmeden bitir", kosul: "sifir_olum" },

    // Moral
    { id: "mutlu", ikon: "😄", ad: "Mutlu", aciklama: "Moral 100 olsun", kosul: "moral_100" },
    { id: "depresyon", ikon: "😢", ad: "Depresyon", aciklama: "Moral 0 olsun", kosul: "moral_0" },

    // Açlık
    { id: "doymus", ikon: "🍽️", ad: "Tok", aciklama: "Açlık hep 80+", kosul: "aclik_hep_yuksek" },
    { id: "aclik", ikon: "🍞", ad: "Açlık", aciklama: "Açlık 0 olsun", kosul: "aclik_0" },

    // Market
    { id: "ilk_alim", ikon: "🛒", ad: "İlk Alışveriş", aciklama: "Markete ilk alışveriş", kosul: "market_1" },
    { id: "market_uzmani", ikon: "🏪", ad: "Market Uzmanı", aciklama: "20 alışveriş", kosul: "market_20" },

    // Özel
    { id: "gece_kusu", ikon: "🌙", ad: "Gece Kuşu", aciklama: "Gece hiç uyumadan bitir", kosul: "gece_uyumadi" },
    { id: "hizli", ikon: "⚡", ad: "Hızlı", aciklama: "30 saniyede bitir", kosul: "hizli_bitir" },
    { id: "sabir", ikon: "🧘", ad: "Sabır", aciklama: "5 vergi üst üste öde", kosul: "sabir_5" },
    { id: "efsane", ikon: "🌟", ad: "Efsane", aciklama: "Tüm başarımları kazan", kosul: "hepsi" },
  ];

  // ============================================================
  // 6. NPC DİYALOGLARI
  // ============================================================
  VERGI.NPC_DIYALOGLARI = {
    merhaba: [
      "Merhaba vatandaş!",
      "Selam! Nasıl gidiyor?",
      "Vergini ödedin mi?",
      "Bu aralar vergiler çok yüksek...",
      "Devlet baba her şeyi görüyor.",
    ],
    sikayet: [
      "Bu vergiler bitmez!",
      "Her şeye vergi var!",
      "Nefes almak bile vergili!",
      "Bütçe yetmiyor artık...",
      "Yaşamak pahalı, vergi daha pahalı!",
    ],
    mutlu: [
      "Bugün harika bir gün!",
      "Vergimi ödedim, içim rahat!",
      "Her şey yolunda!",
      "Yaşasın! Vergi affı var!",
    ],
    uzgun: [
      "Moralim bozuk...",
      "Vergiler canımı sıktı...",
      "Ne yapacağım bilmiyorum...",
      "Bu hayat çok zor...",
    ],
    ipucu: [
      "Markete git, acıktın mı?",
      "Gece olunca yatağa git!",
      "E tuşuyla etkileşime geç!",
      "Vergi kartı çıkınca ödemeyi dene!",
      "Dikkat et, 2. gün sonunda idam var!",
    ],
  };

  // ============================================================
  // 7. HABER MANŞETLERİ
  // ============================================================
  VERGI.HABERLER = [
    {
      manset: "VERGİ ŞOKU! Yeni vergi: Nefes Alma Vergisi!",
      aciklama: "Vatandaşlar isyan ediyor. 'Nefes almak bile parayla oldu' diyorlar.",
    },
    {
      manset: "Çay Vergisi %50 Arttı!",
      aciklama: "Kahvehaneler boş kaldı. Çay içmek lüks oldu.",
    },
    {
      manset: "Vergi Affı Yok, Zam Var!",
      aciklama: "Maliye Bakanı açıkladı: 'Vergi affı yerine yeni vergiler geliyor.'",
    },
    {
      manset: "Simit Artık Altın Değerinde!",
      aciklama: "Simit fiyatları vergiler yüzünden uçtu.",
    },
    {
      manset: "Uyku Vergisi Tepki Çekti!",
      aciklama: "Vatandaşlar 'Uyurken bile vergi mi ödeyeceğiz?' diye soruyor.",
    },
    {
      manset: "Yeni Dönem: Her Şeye Vergi!",
      aciklama: "Parlamento 'Var Olma Vergisi'ni onayladı.",
    },
    {
      manset: "Vergi Kaçakçılarına Af Yok!",
      aciklama: "İdam cezası geri geliyor. Vatandaşlar tedirgin.",
    },
    {
      manset: "Vergi Bakanı İstifa Etti!",
      aciklama: "Yeni bakan daha fazla vergi sözü verdi.",
    },
    {
      manset: "Ekonomi Krizde!",
      aciklama: "Vergiler artıyor ama hizmetler azalıyor.",
    },
    {
      manset: "Yeni Vergi: Gülümseme Vergisi!",
      aciklama: "Mutlu görünmek de devletten izin gerektiriyor.",
    },
  ];

  // ============================================================
  // 8. GÖREVLER
  // ============================================================
  VERGI.GOREVLER = [
    { id: "g1", ikon: "🎯", ad: "İlk Vergini Öde", aciklama: "Bir vergi kartı açıldığında 'Öde'ye bas", odul: { para: 100, moral: 5 }, tip: "vergi_ode", hedef: 1 },
    { id: "g2", ikon: "🛒", ad: "Markete Git", aciklama: "İlk market alışverişini yap", odul: { para: 50, moral: 10 }, tip: "market_al", hedef: 1 },
    { id: "g3", ikon: "😴", ad: "İyi Uyku", aciklama: "Gece yatakta uyu", odul: { moral: 20 }, tip: "uyu", hedef: 1 },
    { id: "g4", ikon: "💰", ad: "Zengin Ol", aciklama: "2000 TL'ye ulaş", odul: { para: 200 }, tip: "para_2000", hedef: 1 },
    { id: "g5", ikon: "🙅", ad: "İsyan Et", aciklama: "3 vergi reddet", odul: { para: 150, moral: 15 }, tip: "vergi_red", hedef: 3 },
    { id: "g6", ikon: "🍞", ad: "Aç Kalma", aciklama: "Açlığı 50'nin üstünde tut", odul: { para: 100 }, tip: "aclik_yuksek", hedef: 1 },
    { id: "g7", ikon: "🏆", ad: "Hayatta Kal", aciklama: "2 günü tamamla", odul: { para: 500 }, tip: "gun_2", hedef: 1 },
    { id: "g8", ikon: "⚰️", ad: "Son Yolculuk", aciklama: "İdam edil (istemeyerek)", odul: { para: 0 }, tip: "idam", hedef: 1 },
  ];

  // ============================================================
  // 9. GÜNLÜK ÖDÜLLER (7 Gün)
  // ============================================================
  VERGI.GUNLUK_ODULLER = [
    { gun: 1, ikon: "💰", ad: "100 TL", aciklama: "Başlangıç ödülü", odul: { para: 100 } },
    { gun: 2, ikon: "🍞", ad: "200 TL", aciklama: "İkinci gün", odul: { para: 200 } },
    { gun: 3, ikon: "🎁", ad: "300 TL", aciklama: "Üçüncü gün", odul: { para: 300 } },
    { gun: 4, ikon: "💎", ad: "500 TL", aciklama: "Dördüncü gün", odul: { para: 500 } },
    { gun: 5, ikon: "🏆", ad: "750 TL", aciklama: "Beşinci gün", odul: { para: 750 } },
    { gun: 6, ikon: "👑", ad: "1000 TL", aciklama: "Altıncı gün", odul: { para: 1000 } },
    { gun: 7, ikon: "🌟", ad: "2000 TL", aciklama: "Yedinci gün — BÜYÜK ÖDÜL!", odul: { para: 2000 } },
  ];

  // ============================================================
  // 10. BORSA HİSSELERİ
  // ============================================================
  VERGI.BORSA_HISSELERI = [
    { id: "vrg", ad: "VRG", firma: "Vergi Holding", baslangic: 100, oynaklik: 0.05 },
    { id: "mrt", ad: "MRT", firma: "Market A.Ş.", baslangic: 250, oynaklik: 0.08 },
    { id: "bnk", ad: "BNK", firma: "VergiBank", baslangic: 500, oynaklik: 0.03 },
    { id: "alt", ad: "ALT", firma: "Altın", baslangic: 1000, oynaklik: 0.02 },
    { id: "usd", ad: "USD", firma: "Dolar", baslangic: 35, oynaklik: 0.01 },
    { id: "btc", ad: "BTC", firma: "Bitcoin", baslangic: 1000000, oynaklik: 0.15 },
  ];

  // ============================================================
  // 11. KARİYER İŞLERİ
  // ============================================================
  VERGI.KARIYER_ISLERI = [
    { id: "garson", ikon: "🍽️", ad: "Garson", maas: 200, gerekMoral: 5 },
    { id: "kasiyer", ikon: "🛒", ad: "Kasiyer", maas: 220, gerekMoral: 5 },
    { id: "yazilimci", ikon: "💻", ad: "Yazılımcı", maas: 500, gerekMoral: 20 },
    { id: "doktor", ikon: "👨‍⚕️", ad: "Doktor", maas: 800, gerekMoral: 40 },
    { id: "avukat", ikon: "⚖️", ad: "Avukat", maas: 700, gerekMoral: 35 },
    { id: "isadami", ikon: "🏢", ad: "İş Adamı", maas: 1500, gerekMoral: 60 },
  ];

  // ============================================================
  // 12. HASTANE TEDAVİLERİ
  // ============================================================
  VERGI.HASTANE_TEDAVILERI = [
    { id: "ilac", ikon: "💊", ad: "İlaç", aciklama: "+20 moral", fiyat: 100, etki: { moral: 20 } },
    { id: "asi", ikon: "💉", ad: "Aşı", aciklama: "+30 moral", fiyat: 200, etki: { moral: 30 } },
    { id: "muayene", ikon: "🩺", ad: "Tam Muayene", aciklama: "Moral 100'e çıkar", fiyat: 500, etki: { moral: 100 } },
  ];

  // ============================================================
  // 13. KAÇIŞ ÜLKELERİ
  // ============================================================
  VERGI.KACIS_ULKELERI = [
    { id: "isvicre", bayrak: "🇨🇭", ad: "İsviçre", aciklama: "Yüksek yaşam, yüksek maliyet", fiyat: 10000 },
    { id: "norvec", bayrak: "🇳🇴", ad: "Norveç", aciklama: "Huzurlu, soğuk, pahalı", fiyat: 8000 },
    { id: "dubai", bayrak: "🇦🇪", ad: "Dubai", aciklama: "Vergisiz cennet (mizah)", fiyat: 5000 },
    { id: "almanya", bayrak: "🇩🇪", ad: "Almanya", aciklama: "Düzenli vergi sistemi", fiyat: 7000 },
  ];

  // ============================================================
  // 14. SEÇİM PARTİLERİ
  // ============================================================
  VERGI.SECIM_PARTILERI = [
    { id: "A", logo: "🟨", ad: "Vergi Partisi", aciklama: "Vergileri artıracağım diyor", vaat: "Hazineyi güçlendirmek", etki: { vergi: 1.3 } },
    { id: "B", logo: "🟦", ad: "Vergisiz Parti", aciklama: "Vergileri kaldıracağım diyor", vaat: "0 vergi (!)", etki: { vergi: 0.5 } },
    { id: "C", logo: "🟪", ad: "Orta Yol Partisi", aciklama: "Dengeli vergi politikası", vaat: "Herkese biraz vergi", etki: { vergi: 1.0 } },
    { id: "D", logo: "🟥", ad: "Halk Partisi", aciklama: "Halkın yanındayız diyor", vaat: "Vergi affı", etki: { vergi: 0.8 } },
  ];

  // ============================================================
  // 15. HAVA DURUMLARI
  // ============================================================
  VERGI.HAVA_DURUMLARI = [
    { id: "gunesli", ikon: "☀️", ad: "Güneşli", sicaklik: [20, 35], ruzgar: [5, 15], nem: [30, 50] },
    { id: "bulutlu", ikon: "☁️", ad: "Bulutlu", sicaklik: [15, 25], ruzgar: [10, 20], nem: [40, 60] },
    { id: "yagmurlu", ikon: "🌧️", ad: "Yağmurlu", sicaklik: [10, 20], ruzgar: [15, 30], nem: [70, 90] },
    { id: "karlı", ikon: "❄️", ad: "Karlı", sicaklik: [-5, 5], ruzgar: [10, 25], nem: [60, 80] },
    { id: "firtinali", ikon: "⛈️", ad: "Fırtınalı", sicaklik: [8, 18], ruzgar: [30, 60], nem: [80, 95] },
    { id: "sisli", ikon: "🌫️", ad: "Sisli", sicaklik: [5, 15], ruzgar: [0, 10], nem: [85, 100] },
  ];

  // ============================================================
  // 16. KONUŞMALAR
  // ============================================================
  VERGI.KONUSMALAR = {
    baslangic: [
      "Merhaba dünya...",
      "Bugün de vergi var mı?",
      "Yeni bir gün, yeni vergiler...",
      "Uyanmak istemiyorum...",
      "Ne olacak bu halimiz?",
    ],
    ode: [
      "Vergimi ödedim... 😔",
      "Cüzdanım hafifledi...",
      "Devlet mutlu, ben mutsuz.",
      "Yine para gitti...",
      "Bu son olsun diyorum ama...",
      "Hesap kitap tutamıyorum...",
    ],
    reddet: [
      "Ödemeyeceğim! 😤",
      "Yeter artık!",
      "Bu da fazla ama!",
      "İsyan ediyorum!",
      "Haksızlık bu!",
      "Bardak doldu taşıyor!",
    ],
    kazandi: [
      "Hayatta kaldım! 🎉",
      "2 gün dayandım!",
      "Vergilere karşı kazandım!",
      "İMKANSIZI BAŞARDIM!",
    ],
    haciz: [
      "Her şeyim gitti... 💀",
      "Eşyalarım nerede?",
      "Haciz geldi...",
      "Bu nasıl bir sistem...",
    ],
    depresyon: [
      "Artık dayanamıyorum...",
      "Moralim bitti...",
      "Hepsi çok yorucu...",
      "Neden yaşıyorum ki...",
    ],
  };

  // ============================================================
  // 17. ÖLÜM SEBEPLERİ
  // ============================================================
  VERGI.OLUM_SEBEPLERI = {
    iflas: {
      baslik: "💸 İFLAS ETTİN!",
      aciklama: "Vergi borcunu ödeyemedin. Haciz geldi, her şeyini kaybettin.",
      konusma: "Her şeyim gitti...",
      renk: "#ef4444",
    },
    depresyon: {
      baslik: "😵 MORALİN BİTTİ!",
      aciklama: "Sürekli vergi reddettin, depresyona girdin. Terapi de vergili bu arada.",
      konusma: "Artık dayanamıyorum...",
      renk: "#f59e0b",
    },
    aclik: {
      baslik: "🍞 AÇLIKTAN ÖLDÜN!",
      aciklama: "Yemek almayı unuttun. Açlıktan öldün.",
      konusma: "Açlıktan ölüyorum...",
      renk: "#f97316",
    },
    idam: {
      baslik: "⚰️ İDAM EDİLDİN!",
      aciklama: "2. günün sonunda yakalandın. Vergi kaçakçılığından idam!",
      konusma: "Sonum geldi...",
      renk: "#8b0000",
    },
    kazandi: {
      baslik: "🏆 HAYATTA KALDIN!",
      aciklama: "2 günü başarıyla tamamladın! Sen gerçek bir vergi mükellefisin.",
      konusma: "Hayatta kaldım! 🎉",
      renk: "#22c55e",
    },
  };

  // ============================================================
  // 18. SES DOSYALARI
  // ============================================================
  VERGI.SESLER = {
    buton: "ses/buton.mp3",
    para: "ses/para.mp3",
    vergi: "ses/vergi.mp3",
    uyari: "ses/uyari.mp3",
    kazanma: "ses/kazanma.mp3",
    kaybetme: "ses/kaybetme.mp3",
    tik: "ses/tik.mp3",
    konusma: "ses/konusma.mp3",
    adim: "ses/adim.mp3",
    muzik: "ses/arka-plan.mp3",
  };

  // ============================================================
  // 19. RENK PALETİ
  // ============================================================
  VERGI.RENKLER = {
    arkaplan: "#0a0a14",
    arkaplan2: "#14142a",
    arkaplan3: "#1a1a3a",
    kenarlik: "#2a2a4a",
    sari: "#feca57",
    sariKoyu: "#7a3a00",
    kirmizi: "#ff5a5a",
    kirmiziParlak: "#ff3b3b",
    yesil: "#4ade80",
    mavi: "#6ec6ff",
    mor: "#9b59b6",
    pembe: "#ff6b9d",
    turuncu: "#f4a261",
    metin: "#e8e8f0",
    metin2: "#b8b8d0",
    metin3: "#8a8aa8",
  };

  // ============================================================
  // 20. YÖNLER (Klavye)
  // ============================================================
  VERGI.TUSLAR = {
    yukari: ["w", "W", "ArrowUp"],
    asagi: ["s", "S", "ArrowDown"],
    sol: ["a", "A", "ArrowLeft"],
    sag: ["d", "D", "ArrowRight"],
    etkilesim: ["e", "E"],
    envanter: ["Tab"],
    sohbet: ["Enter"],
    menu: ["Escape", "Esc"],
  };

  // ============================================================
  // 21. AHŞAP/HTML ID HARİTASI
  // ============================================================
  VERGI.ID = {
    // Ekranlar
    yuklemeEkrani: "yukleme-ekrani",
    girisEkrani: "giris-ekrani",
    menuEkrani: "menu-ekrani",
    karakterEkrani: "karakter-ekrani",
    ayarlarEkrani: "ayarlar-ekrani",
    skorEkrani: "skor-ekrani",
    basarimEkrani: "basarim-ekrani",
    yardimEkrani: "yardim-ekrani",
    oyunEkrani: "oyun-ekrani",
    idamEkrani: "idam-ekrani",
    kazanmaEkrani: "kazanma-ekrani",

    // Canvas
    canvas: "oyun-canvas",

    // HUD
    hudGun: "hud-gun",
    hudZaman: "hud-zaman",
    hudPara: "hud-para",
    hudAclik: "hud-aclik",
    hudMoral: "hud-moral",
    hudZamanIkon: "hud-zaman-ikon",
    hudBilgiSaat: "hud-bilgi-saat",
    moralBar: "moral-bar-dolgu",
    aclikBar: "aclik-bar-dolgu",

    // Menü
    menuKullaniciAd: "menu-kullanici-ad",
    menuPara: "menu-para",
    menuAvatar: "menu-avatar",

    // Vergi kartı
    vergiKart: "vergi-kart",
    vergiIkon: "vergi-ikon",
    vergiBaslik: "vergi-baslik",
    vergiAciklama: "vergi-aciklama",
    vergiTutar: "vergi-tutar",
    vergiUyari: "vergi-uyari",
    btnVergiOde: "btn-vergi-ode",
    btnVergiReddet: "btn-vergi-reddet",

    // Oyun sonu
    idam: "idam",
    idamSebep: "idam-sebep",
    idamGun: "idam-gun",
    idamOdenen: "idam-odenen",
    idamSkor: "idam-skor",
    idamTekrar: "btn-idam-tekrar",
    idamMenu: "btn-idam-menu",

    // Kazanma
    kazanma: "kazanma-ekrani",
    kazanmaGun: "kazanma-gun",
    kazanmaPara: "kazanma-para",
    kazanmaOdenen: "kazanma-odenen",
    kazanmaSkor: "kazanma-skor",

    // Sohbet
    sohbetMesajlar: "sohbet-mesajlar",
    sohbetInput: "sohbet-input",
    sohbetGonder: "sohbet-gonder",

    // Market
    marketEkrani: "market-ekrani",
    marketPara: "market-para",
    marketListe: "market-liste",

    // Envanter
    envanterEkrani: "envanter-ekrani",
    envanterGrid: "envanter-grid",
    envanterPara: "envanter-para",
  };

  // ============================================================
  // 22. YARDIMCI FONKSİYONLAR
  // ============================================================

  /**
   * Rastgele vergi seç
   * @param {string} kategori - Kategori filtresi (opsiyonel)
   * @returns {object} Rastgele vergi objesi (tutar eklenmiş)
   */
  VERGI.rastgeleVergi = function (kategori) {
    let liste = VERGI.VERGILER;
    if (kategori) {
      liste = liste.filter(function (v) { return v.kategori === kategori; });
    }
    const vergi = liste[Math.floor(Math.random() * liste.length)];
    const tutar = Math.floor(Math.random() * (vergi.max - vergi.min + 1)) + vergi.min;
    return Object.assign({}, vergi, { tutar: tutar });
  };

  /**
   * ID ile vergi bul
   */
  VERGI.vergiBul = function (id) {
    return VERGI.VERGILER.find(function (v) { return v.id === id; });
  };

  /**
   * ID ile meslek bul
   */
  VERGI.meslekBul = function (id) {
    return VERGI.MESLEKLER.find(function (m) { return m.id === id; });
  };

  /**
   * ID ile market ürünü bul
   */
  VERGI.marketUrunuBul = function (id) {
    return VERGI.MARKET_URUNLERI.find(function (u) { return u.id === id; });
  };

  /**
   * ID ile başarım bul
   */
  VERGI.basarimBul = function (id) {
    return VERGI.BASARIMLAR.find(function (b) { return b.id === id; });
  };

  /**
   * Rastgele dizi elemanı
   */
  VERGI.rastgeleSec = function (dizi) {
    return dizi[Math.floor(Math.random() * dizi.length)];
  };

  /**
   * Sayı formatla (1000 → 1.000)
   */
  VERGI.sayiFormat = function (sayi) {
    return Math.round(sayi).toLocaleString("tr-TR");
  };

  /**
   * Para formatla (1000 → 1.000 TL)
   */
  VERGI.paraFormat = function (sayi) {
    return VERGI.sayiFormat(sayi) + " TL";
  };

  /**
   * Zaman formatla (60 → 1:00)
   */
  VERGI.zamanFormat = function (saniye) {
    const dk = Math.floor(saniye / 60);
    const sn = Math.floor(saniye % 60);
    return dk + ":" + String(sn).padStart(2, "0");
  };

  /**
   * Rastgele sayı
   */
  VERGI.rastgeleSayi = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  /**
   * ID ile HTML elemanı al
   */
  VERGI.el = function (id) {
    return document.getElementById(id);
  };

  // ============================================================
  // 23. SÜRÜM BİLGİSİ
  // ============================================================
  VERGI.surumBilgisi = function () {
    return {
      surum: VERGI.SABITLER.VERSIYON,
      oyun: VERGI.SABITLER.OYUN_ADI,
      toplamVergi: VERGI.VERGILER.length,
      toplamBasarim: VERGI.BASARIMLAR.length,
      toplamMeslek: VERGI.MESLEKLER.length,
    };
  };

  // Konsol log
  console.log(
    "%c💸 VERGİ OYUNU — VERİ YÜKLENDİ",
    "color:#feca57;font-size:14px;font-weight:bold;"
  );
  console.log(
    "%c" +
      VERGI.VERGILER.length + " vergi, " +
      VERGI.BASARIMLAR.length + " başarım, " +
      VERGI.MESLEKLER.length + " meslek yüklendi.",
    "color:#8a8aa8;font-size:11px;"
  );
})();