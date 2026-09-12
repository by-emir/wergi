/* ============================================================
   ============================================================
   💸 VERGİ OYUNU — ARAYÜZ YÖNETİCİSİ (PART 1 / 2)
   ============================================================
   DÜZELTİLMİŞ SÜRÜM:
     - Ekran geçişleri düzgün
     - Paneller sadece oyunda görünür (oyunda sınıfı)
     - Yükleme → Menü/Giriş otomatik
   ============================================================
*/

(function () {
  "use strict";

  window.VERGI = window.VERGI || {};

  // ============================================================
  // ARAYÜZ SINIFI
  // ============================================================
  function Arayuz() {
    this.aktifEkran = null;
    this.oncekiEkran = null;
    this.ekranGecisSure = 400;
    this.secilenMeslek = null;
    this.gunluk = [];
    this.toastSayaci = 0;
    this._olaylarBagli = false;
  }

  // ============================================================
  // 1. EKRAN GÖSTER
  // ============================================================
  Arayuz.prototype.ekranGoster = function (ekranId) {
    if (!ekranId) return false;

    // Tüm ekranları kapat
    const tumEkranlar = document.querySelectorAll(".ekran");
    for (let i = 0; i < tumEkranlar.length; i++) {
      tumEkranlar[i].classList.remove("aktif");
      tumEkranlar[i].classList.add("gizli");
    }

    // İstenen ekranı aç
    const ekran = document.getElementById(ekranId);
    if (!ekran) {
      console.warn("❌ Ekran bulunamadı:", ekranId);
      return false;
    }

    ekran.classList.remove("gizli");

    // Animasyon için kısa gecikme
    const self = this;
    setTimeout(function () {
      ekran.classList.add("aktif");
    }, 20);

    this.oncekiEkran = this.aktifEkran;
    this.aktifEkran = ekranId;

    console.log("📺 Ekran:", ekranId);
    return true;
  };

  // ============================================================
  // 2. EKRAN GİZLE
  // ============================================================
  Arayuz.prototype.ekranGizle = function (ekranId) {
    const ekran = document.getElementById(ekranId);
    if (ekran) {
      ekran.classList.remove("aktif");
      ekran.classList.add("gizli");
    }
  };

  // ============================================================
  // 3. TÜM EKRANLARI GİZLE
  // ============================================================
  Arayuz.prototype.tumEkranlariGizle = function () {
    const tumEkranlar = document.querySelectorAll(".ekran");
    for (let i = 0; i < tumEkranlar.length; i++) {
      tumEkranlar[i].classList.remove("aktif");
      tumEkranlar[i].classList.add("gizli");
    }
    this.aktifEkran = null;
  };

  // ============================================================
  // 4. OYUN MODU (Paneller kontrol)
  // ============================================================
  Arayuz.prototype.oyunModuAc = function () {
    document.body.classList.add("oyunda");
  };

  Arayuz.prototype.oyunModuKapat = function () {
    document.body.classList.remove("oyunda");
  };

  // ============================================================
  // 5. YÜKLEME EKRANI
  // ============================================================
  Arayuz.prototype.yuklemeGoster = function () {
    this.ekranGoster("yukleme-ekrani");
    this.yuklemeBaslat();
  };

  // ============================================================
  // 6. YÜKLEME ANİMASYONU
  // ============================================================
  Arayuz.prototype.yuklemeBaslat = function () {
    const self = this;
    const dolgu = document.getElementById("yukleme-dolgu");
    const yuzde = document.getElementById("yukleme-yuzde");
    const mesaj = document.getElementById("yukleme-mesaj");

    const adimlar = [
      { yuzde: 10, mesaj: "Sistem başlatılıyor..." },
      { yuzde: 25, mesaj: "Vergi kuralları yükleniyor..." },
      { yuzde: 40, mesaj: "Karakterler hazırlanıyor..." },
      { yuzde: 55, mesaj: "Vergi listesi oluşturuluyor..." },
      { yuzde: 70, mesaj: "Market ürünleri ekleniyor..." },
      { yuzde: 85, mesaj: "Devlet kurumları açılıyor..." },
      { yuzde: 95, mesaj: "Son kontroller yapılıyor..." },
      { yuzde: 100, mesaj: "Hazır! ✅" },
    ];

    let adim = 0;
    const toplamSure = 2200;
    const adimSure = toplamSure / adimlar.length;

    function sonraki() {
      if (adim >= adimlar.length) {
        setTimeout(function () {
          self.yuklemeBitti();
        }, 400);
        return;
      }

      const a = adimlar[adim];
      if (dolgu) dolgu.style.width = a.yuzde + "%";
      if (yuzde) yuzde.textContent = a.yuzde;
      if (mesaj) mesaj.textContent = a.mesaj;

      adim++;
      setTimeout(sonraki, adimSure);
    }

    sonraki();
  };

  // ============================================================
  // 7. YÜKLEME BİTTİ
  // ============================================================
  Arayuz.prototype.yuklemeBitti = function () {
    console.log("✅ Yükleme bitti");

    // Giriş yapılmış mı?
    if (window.VERGI.Kayit && window.VERGI.Kayit.girisliMi()) {
      const k = window.VERGI.Kayit.aktifKullanici();
      console.log("👤 Aktif kullanıcı:", k);
      this.menuGoster();
    } else {
      console.log("👤 Giriş yapılmamış, giriş ekranı açılıyor");
      this.girisGoster();
    }
  };

  // ============================================================
  // 8. GİRİŞ EKRANI
  // ============================================================
  Arayuz.prototype.girisGoster = function () {
    this.oyunModuKapat();
    this.ekranGoster("giris-ekrani");
  };

  // ============================================================
  // 9. MENÜ EKRANI
  // ============================================================
  Arayuz.prototype.menuGoster = function () {
    this.oyunModuKapat();
    this.ekranGoster("menu-ekrani");
    this.menuGuncelle();
  };

  // ============================================================
  // 10. MENÜ GÜNCELLE
  // ============================================================
  Arayuz.prototype.menuGuncelle = function () {
    const k = window.VERGI.Kayit ? window.VERGI.Kayit.aktifKullanici() : null;
    if (!k) return;

    const elAd = document.getElementById("menu-kullanici-ad");
    if (elAd) elAd.textContent = k;

    const elAvatar = document.getElementById("menu-avatar");
    if (elAvatar) {
      elAvatar.textContent = k.charAt(0).toUpperCase();
    }

    const bilgi = window.VERGI.Kayit ? window.VERGI.Kayit.kullaniciBilgisi(k) : null;
    const elPara = document.getElementById("menu-para");
    if (elPara && bilgi) {
      elPara.textContent = window.VERGI.sayiFormat(bilgi.enIyiSkor || 0);
    }

    const elTarih = document.getElementById("menu-tarih");
    if (elTarih) {
      elTarih.textContent = new Date().getFullYear();
    }

    // Devam Et butonu — kayıt var mı?
    const btnDevam = document.getElementById("btn-devam");
    if (btnDevam && window.VERGI.Kayit) {
      let kayitVar = false;
      for (let i = 1; i <= 3; i++) {
        if (window.VERGI.Kayit.slotYukle(i)) {
          kayitVar = true;
          break;
        }
      }
      if (kayitVar) {
        btnDevam.style.opacity = "1";
        btnDevam.style.pointerEvents = "auto";
      } else {
        btnDevam.style.opacity = "0.4";
        btnDevam.style.pointerEvents = "none";
      }
    }
  };

  // ============================================================
  // 11. KARAKTER EKRANI
  // ============================================================
  Arayuz.prototype.karakterGoster = function () {
    this.ekranGoster("karakter-ekrani");
    this.karakterRender();
  };

  // ============================================================
  // 12. KARAKTER RENDER
  // ============================================================
  Arayuz.prototype.karakterRender = function () {
    const liste = document.querySelector(".karakter-liste");
    if (!liste) return;

    liste.innerHTML = "";

    const meslekler = window.VERGI.MESLEKLER;
    const self = this;

    for (let i = 0; i < meslekler.length; i++) {
      const m = meslekler[i];

      const div = document.createElement("div");
      div.className = "karakter-kart";
      div.setAttribute("data-meslek", m.id);

      div.innerHTML =
        '<div class="karakter-kart-ikon">' + m.ikon + "</div>" +
        '<div class="karakter-kart-baslik">' + m.ad + "</div>" +
        '<div class="karakter-kart-aciklama">' + m.aciklama + "</div>" +
        '<div class="karakter-kart-istatistik">' +
          '<div class="kart-stat">' +
            '<span class="kart-stat-etiket">💰 Maaş</span>' +
            '<span class="kart-stat-deger">' + m.gelir + " TL</span>" +
          "</div>" +
          '<div class="kart-stat">' +
            '<span class="kart-stat-etiket">😊 Moral</span>' +
            '<span class="kart-stat-deger">' + m.moral + "</span>" +
          "</div>" +
          '<div class="kart-stat">' +
            '<span class="kart-stat-etiket">📊 Zorluk</span>' +
            '<span class="kart-stat-deger">' + "⭐".repeat(m.zorluk) + "</span>" +
          "</div>" +
        "</div>";

      div.addEventListener("click", function () {
        self.karakterSec(m.id, div);
      });

      liste.appendChild(div);
    }
  };

  // ============================================================
  // 13. KARAKTER SEÇ
  // ============================================================
  Arayuz.prototype.karakterSec = function (meslekId, kartEl) {
    const tumKartlar = document.querySelectorAll(".karakter-kart");
    for (let i = 0; i < tumKartlar.length; i++) {
      tumKartlar[i].classList.remove("secili");
    }

    if (kartEl) kartEl.classList.add("secili");

    this.secilenMeslek = meslekId;

    const btn = document.getElementById("btn-karakter-basla");
    if (btn) {
      btn.disabled = false;
      btn.textContent = "🎮 OYUNA BAŞLA";
    }

    if (window.VERGI.Ses) window.VERGI.Ses.butonSesi();
  };

  // ============================================================
  // 14. OYUNU BAŞLAT
  // ============================================================
  Arayuz.prototype.oyunuBasla = function () {
    if (!this.secilenMeslek) {
      this.toastGoster("Bir meslek seç!", "uyari");
      return;
    }

    console.log("🎮 Oyun başlıyor:", this.secilenMeslek);

    // Oyun modunu aç (paneller görünür)
    this.oyunModuAc();

    // Oyun ekranına geç
    this.ekranGoster("oyun-ekrani");

    const self = this;
    const meslekId = this.secilenMeslek;

    setTimeout(function () {
      if (window.VERGI.Oyun) {
        window.VERGI.Oyun.baslat({
          meslek: meslekId,
          genislik: 800,
          yukseklik: 600,
          gunSaniye: window.VERGI.SABITLER.GUN_SANIYE_TEST,
        });

        // HUD bilgileri
        const k = window.VERGI.Kayit ? window.VERGI.Kayit.aktifKullanici() : null;
        if (k) {
          const elAd = document.getElementById("hud-oyuncu-ad");
          if (elAd) elAd.textContent = k;

          const elAvatar = document.getElementById("hud-avatar");
          if (elAvatar) elAvatar.textContent = k.charAt(0).toUpperCase();

          const meslek = window.VERGI.meslekBul(meslekId);
          const elMeslek = document.getElementById("hud-oyuncu-meslek");
          if (elMeslek && meslek) elMeslek.textContent = meslek.ad;
        }

        // Günlüğü temizle
        self.gunluk = [];
        const liste = document.getElementById("gunluk-liste");
        if (liste) liste.innerHTML = "";

        const meslek = window.VERGI.meslekBul(meslekId);
        self.gunlugeYaz("🎮 Oyun başladı! Meslek: " + (meslek ? meslek.ad : "?"));

        // Karşılama konuşması
        setTimeout(function () {
          if (window.VERGI.Oyun) {
            window.VERGI.Oyun.konus("Vergi hayatım başlıyor... 😰", 3);
          }
        }, 1000);
      }
    }, 150);
  };

  // ============================================================
  // 15. AYARLAR EKRANI
  // ============================================================
  Arayuz.prototype.ayarlarGoster = function () {
    this.ekranGoster("ayarlar-ekrani");
    this.ayarlariYukle();
  };

  // ============================================================
  // 16. AYARLARI YÜKLE
  // ============================================================
  Arayuz.prototype.ayarlariYukle = function () {
    if (!window.VERGI.Ses) return;

    const s = window.VERGI.Ses.ayarlar;

    const elAna = document.getElementById("ayar-ses-ana");
    if (elAna) elAna.value = Math.round(s.ana * 100);
    const elAnaD = document.getElementById("ayar-ses-ana-deger");
    if (elAnaD) elAnaD.textContent = Math.round(s.ana * 100);

    const elMuzik = document.getElementById("ayar-ses-muzik");
    if (elMuzik) elMuzik.value = Math.round(s.muzik * 100);
    const elMuzikD = document.getElementById("ayar-ses-muzik-deger");
    if (elMuzikD) elMuzikD.textContent = Math.round(s.muzik * 100);

    const elEfekt = document.getElementById("ayar-ses-efekt");
    if (elEfekt) elEfekt.value = Math.round(s.efekt * 100);
    const elEfektD = document.getElementById("ayar-ses-efekt-deger");
    if (elEfektD) elEfektD.textContent = Math.round(s.efekt * 100);
  };

  // ============================================================
  // 17. AYARLARI KAYDET
  // ============================================================
  Arayuz.prototype.ayarlariKaydet = function () {
    if (!window.VERGI.Ses) return;

    const elAna = document.getElementById("ayar-ses-ana");
    if (elAna) window.VERGI.Ses.anaSesAyarla(parseInt(elAna.value));

    const elMuzik = document.getElementById("ayar-ses-muzik");
    if (elMuzik) window.VERGI.Ses.muzikSesAyarla(parseInt(elMuzik.value));

    const elEfekt = document.getElementById("ayar-ses-efekt");
    if (elEfekt) window.VERGI.Ses.efektSesAyarla(parseInt(elEfekt.value));

    this.toastGoster("💾 Ayarlar kaydedildi!", "basari");

    setTimeout(() => this.menuGoster(), 800);
  };

  // ============================================================
  // 18. AYARLARI SIFIRLA
  // ============================================================
  Arayuz.prototype.ayarlariSifirla = function () {
    if (!window.VERGI.Ses) return;

    const elAna = document.getElementById("ayar-ses-ana");
    if (elAna) elAna.value = 70;
    const elMuzik = document.getElementById("ayar-ses-muzik");
    if (elMuzik) elMuzik.value = 50;
    const elEfekt = document.getElementById("ayar-ses-efekt");
    if (elEfekt) elEfekt.value = 80;

    this.ayarlariYukle();
    this.toastGoster("🔄 Ayarlar sıfırlandı", "bilgi");
  };

  // ============================================================
  // 19. SKOR TABLOSU
  // ============================================================
  Arayuz.prototype.skorGoster = function () {
    this.ekranGoster("skor-ekrani");
    this.skorRender();
  };

  // ============================================================
  // 20. SKOR RENDER
  // ============================================================
  Arayuz.prototype.skorRender = function () {
    const liste = document.getElementById("skor-liste");
    if (!liste) return;

    liste.innerHTML = "";

    const skorlar = window.VERGI.Kayit ? window.VERGI.Kayit.skorTablosu(20) : [];

    if (skorlar.length === 0) {
      liste.innerHTML = '<div class="skor-bos">Henüz skor yok. İlk oyunu oyna!</div>';
      return;
    }

    for (let i = 0; i < skorlar.length; i++) {
      const s = skorlar[i];
      const div = document.createElement("div");
      div.className = "skor-satir";
      if (i === 0) div.classList.add("skor-birinci");

      let madalya = "";
      if (i === 0) madalya = "🥇";
      else if (i === 1) madalya = "🥈";
      else if (i === 2) madalya = "🥉";
      else madalya = "#" + (i + 1);

      div.innerHTML =
        '<div class="skor-satir-sira">' + madalya + "</div>" +
        '<div class="skor-satir-oyuncu">' + s.kullanici + "</div>" +
        '<div class="skor-satir-skor">' + window.VERGI.sayiFormat(s.enIyiSkor) + "</div>";

      liste.appendChild(div);
    }
  };

  // ============================================================
  // 21. SKOR TEMİZLE
  // ============================================================
  Arayuz.prototype.skorTemizle = function () {
    if (!confirm("Tüm skorlarını silmek istediğine emin misin?")) return;

    const k = window.VERGI.Kayit ? window.VERGI.Kayit.aktifKullanici() : null;
    if (!k) return;

    const kullanicilar = window.VERGI.Kayit.kullanicilariOku();
    if (kullanicilar[k]) {
      kullanicilar[k].enIyiSkor = 0;
      kullanicilar[k].enUzunSure = 0;
      kullanicilar[k].toplamOyun = 0;
      window.VERGI.Kayit.kullanicilariYaz(kullanicilar);
    }

    this.skorRender();
    this.toastGoster("🗑️ Skorlar temizlendi", "bilgi");
  };

  // ============================================================
  // 22. BAŞARIMLAR
  // ============================================================
  Arayuz.prototype.basarimGoster = function () {
    this.ekranGoster("basarim-ekrani");
    this.basarimRender();
  };

  // ============================================================
  // 23. BAŞARIM RENDER
  // ============================================================
  Arayuz.prototype.basarimRender = function () {
    const liste = document.getElementById("basarim-liste");
    if (!liste) return;

    liste.innerHTML = "";

    const k = window.VERGI.Kayit ? window.VERGI.Kayit.kullaniciBilgisi() : null;
    const rozetler = (k && k.rozetler) ? k.rozetler : [];
    const basarimlar = window.VERGI.BASARIMLAR;

    let acikSayi = 0;

    for (let i = 0; i < basarimlar.length; i++) {
      const b = basarimlar[i];
      const acik = rozetler.indexOf(b.id) !== -1;
      if (acik) acikSayi++;

      const div = document.createElement("div");
      div.className = "basarim-ogesi " + (acik ? "acik" : "kilitli");

      div.innerHTML =
        '<div class="basarim-ogesi-ikon">' + (acik ? b.ikon : "🔒") + "</div>" +
        '<div class="basarim-ogesi-bilgi">' +
          '<div class="basarim-ogesi-baslik">' + b.ad + "</div>" +
          '<div class="basarim-ogesi-aciklama">' + b.aciklama + "</div>" +
        "</div>";

      liste.appendChild(div);
    }

    const elToplam = document.getElementById("basarim-toplam");
    if (elToplam) elToplam.textContent = acikSayi;

    const elYuzde = document.getElementById("basarim-yuzde");
    if (elYuzde) {
      const yuzde = Math.round((acikSayi / basarimlar.length) * 100);
      elYuzde.textContent = yuzde + "%";
    }
  };

  // ============================================================
  // 24. BAŞARIM KONTROL
  // ============================================================
  Arayuz.prototype.basarimKontrol = function (tip, deger) {
    if (!window.VERGI.Kayit) return;

    const acilabilecek = [];

    if (tip === "vergi_ode") {
      if (deger >= 1) acilabilecek.push("ilk_vergi");
      if (deger >= 10) acilabilecek.push("vergi_usta");
      if (deger >= 50) acilabilecek.push("vergi_krali");
    }
    if (tip === "vergi_red") {
      if (deger >= 10) acilabilecek.push("isyan");
    }
    if (tip === "market_al") {
      if (deger >= 1) acilabilecek.push("ilk_alim");
      if (deger >= 20) acilabilecek.push("market_uzmani");
    }
    if (tip === "uyu") {
      acilabilecek.push("ilk_gun");
    }
    if (tip === "gun_2") {
      acilabilecek.push("hayatta");
    }

    for (let i = 0; i < acilabilecek.length; i++) {
      const rozetId = acilabilecek[i];
      const yeni = window.VERGI.Kayit.rozetEkle(rozetId);
      if (yeni) {
        this.basarimBildirimGoster(rozetId);
      }
    }
  };

  // ============================================================
  // 25. BAŞARIM BİLDİRİMİ
  // ============================================================
  Arayuz.prototype.basarimBildirimGoster = function (rozetId) {
    const b = window.VERGI.basarimBul(rozetId);
    if (!b) return;

    const el = document.getElementById("basarim-bildirim");
    if (!el) return;

    const elIkon = document.getElementById("bb-ikon");
    const elBaslik = document.getElementById("bb-baslik");
    const elAlt = document.getElementById("bb-alt");

    if (elIkon) elIkon.textContent = b.ikon;
    if (elBaslik) elBaslik.textContent = b.ad;
    if (elAlt) elAlt.textContent = b.aciklama;

    el.classList.remove("gizli");

    if (window.VERGI.Ses) window.VERGI.Ses.seviyeSesi();

    setTimeout(function () {
      el.classList.add("gizli");
    }, 4000);
  };

  // ============================================================
  // 26. YARDIM
  // ============================================================
  Arayuz.prototype.yardimGoster = function () {
    this.ekranGoster("yardim-ekrani");
  };

  // ============================================================
  // 27. ÇIKIŞ
  // ============================================================
  Arayuz.prototype.cikisYap = function () {
    if (window.VERGI.Kayit) {
      window.VERGI.Kayit.cikisYap();
    }
    location.reload();
  };

  // ============================================================
  // 28. GÜNLÜĞE YAZ
  // ============================================================
  Arayuz.prototype.gunlugeYaz = function (metin) {
    const liste = document.getElementById("gunluk-liste");
    if (!liste) return;

    const li = document.createElement("li");
    li.textContent = metin;
    liste.appendChild(li);

    const kap = liste.parentElement;
    if (kap) kap.scrollTop = kap.scrollHeight;

    while (liste.children.length > 15) {
      liste.removeChild(liste.firstChild);
    }

    this.gunluk.push(metin);
    if (this.gunluk.length > 50) this.gunluk.shift();
  };

  // ============================================================
  // 29. TOAST GÖSTER
  // ============================================================
  Arayuz.prototype.toastGoster = function (metin, tur, sure) {
    tur = tur || "bilgi";
    sure = sure || 3000;

    const alan = document.getElementById("toast-alani");
    if (!alan) return;

    const div = document.createElement("div");
    div.className = "toast " + tur;
    div.id = "toast-" + (++this.toastSayaci);

    let ikon = "ℹ️";
    if (tur === "basari") ikon = "✅";
    else if (tur === "hata") ikon = "❌";
    else if (tur === "uyari") ikon = "⚠️";

    div.innerHTML =
      '<div class="toast-ikon">' + ikon + "</div>" +
      '<div class="toast-yazi">' + metin + "</div>";

    alan.appendChild(div);

    setTimeout(function () {
      div.classList.add("cikis");
      setTimeout(function () {
        if (div.parentNode) div.parentNode.removeChild(div);
      }, 300);
    }, sure);
  };

  // ============================================================
  // 30. YÜKLENİYOR
  // ============================================================
  Arayuz.prototype.yukleniyorGoster = function (mesaj) {
    const el = document.getElementById("yukleniyor");
    if (el) {
      el.classList.remove("gizli");
      if (mesaj) {
        const y = el.querySelector(".yukleniyor-yazi");
        if (y) y.textContent = mesaj;
      }
    }
  };

  Arayuz.prototype.yukleniyorGizle = function () {
    const el = document.getElementById("yukleniyor");
    if (el) el.classList.add("gizli");
  };

  // ============================================================
  // 31. BAĞLANTI UYARISI
  // ============================================================
  Arayuz.prototype.baglantiUyariGoster = function () {
    const el = document.getElementById("baglanti-uyari");
    if (el) el.classList.remove("gizli");
  };

  Arayuz.prototype.baglantiUyariGizle = function () {
    const el = document.getElementById("baglanti-uyari");
    if (el) el.classList.add("gizli");
  };

  // ============================================================
  // 32. ÇIKIŞ ONAY
  // ============================================================
  Arayuz.prototype.cikisOnayGoster = function () {
    const modal = document.getElementById("cikis-onay");
    if (modal) modal.classList.remove("gizli");
  };

  Arayuz.prototype.cikisOnayGizle = function () {
    const modal = document.getElementById("cikis-onay");
    if (modal) modal.classList.add("gizli");
  };

  // ============================================================
  // 33. SOHBET EKLE
  // ============================================================
  Arayuz.prototype.sohbetEkle = function (isim, metin, kendiMi) {
    const alan = document.getElementById("sohbet-mesajlar");
    if (!alan) return;

    const div = document.createElement("div");
    div.className = "sohbet-satir" + (kendiMi ? " kendi" : "");

    if (!kendiMi) {
      const isimEl = document.createElement("span");
      isimEl.className = "sohbet-satir-isim";
      isimEl.textContent = isim + ":";
      div.appendChild(isimEl);
    }

    const metinEl = document.createElement("span");
    metinEl.textContent = metin;
    div.appendChild(metinEl);

    alan.appendChild(div);
    alan.scrollTop = alan.scrollHeight;

    while (alan.children.length > 30) {
      alan.removeChild(alan.firstChild);
    }
  };

  // ============================================================
  // 34. SOHBET GÖNDER
  // ============================================================
  Arayuz.prototype.sohbetGonder = function () {
    const input = document.getElementById("sohbet-input");
    if (!input) return;

    const metin = input.value.trim();
    if (!metin) return;

    const k = window.VERGI.Kayit ? window.VERGI.Kayit.aktifKullanici() : "Sen";
    this.sohbetEkle(k, metin, true);

    input.value = "";
  };

  // ============================================================
  // 35. HUD GÜNCELLE
  // ============================================================
  Arayuz.prototype.hudGuncelle = function () {
    if (window.VERGI.Oyun) {
      window.VERGI.Oyun.hudGuncelle();
    }
  };

  // ============================================================
  // 36. TEMEL OLAYLARI BAĞLA
  // ============================================================
  Arayuz.prototype.temelOlaylariBagla = function () {
    if (this._olaylarBagli) return;
    this._olaylarBagli = true;

    const self = this;

    function bagla(id, fn) {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener("click", function (e) {
          e.preventDefault();
          if (window.VERGI.Ses) window.VERGI.Ses.butonSesi();
          fn();
        });
      }
    }

    // Ana menü
    bagla("btn-oyna", () => self.karakterGoster());
    bagla("btn-devam", () => self.devamEtGoster());
    bagla("btn-online", () => self.toastGoster("🌐 Online yakında!", "bilgi"));
    bagla("btn-skorlar", () => self.skorGoster());
    bagla("btn-basarimlar", () => self.basarimGoster());
    bagla("btn-ayarlar", () => self.ayarlarGoster());
    bagla("btn-yardim", () => self.yardimGoster());
    bagla("btn-cikis", () => self.cikisOnayGoster());

    // Ekran kapatma
    bagla("btn-ayarlar-kapat", () => self.menuGoster());
    bagla("btn-skor-kapat", () => self.menuGoster());
    bagla("btn-basarim-kapat", () => self.menuGoster());
    bagla("btn-yardim-kapat", () => self.menuGoster());

    // Ayarlar
    bagla("btn-ayarlar-kaydet", () => self.ayarlariKaydet());
    bagla("btn-ayarlar-sifirla", () => self.ayarlariSifirla());

    // Skor temizle
    bagla("btn-skor-temizle", () => self.skorTemizle());

    // Karakter
    bagla("btn-karakter-geri", () => self.menuGoster());
    bagla("btn-karakter-basla", () => self.oyunuBasla());

    // Çıkış onay
    bagla("btn-cikis-evet", () => self.cikisYap());
    bagla("btn-cikis-hayir", () => self.cikisOnayGizle());

    // Sekmeler
    const sekmeGiris = document.getElementById("sekme-giris");
    const sekmeKayit = document.getElementById("sekme-kayit");
    const formGiris = document.getElementById("form-giris");
    const formKayit = document.getElementById("form-kayit");

    if (sekmeGiris && sekmeKayit && formGiris && formKayit) {
      sekmeGiris.addEventListener("click", function () {
        sekmeGiris.classList.add("aktif");
        sekmeKayit.classList.remove("aktif");
        formGiris.classList.add("aktif");
        formKayit.classList.remove("aktif");
      });
      sekmeKayit.addEventListener("click", function () {
        sekmeKayit.classList.add("aktif");
        sekmeGiris.classList.remove("aktif");
        formKayit.classList.add("aktif");
        formGiris.classList.remove("aktif");
      });
    }

    // Şifre göz
    const sifreGozler = document.querySelectorAll(".sifre-goz");
    for (let i = 0; i < sifreGozler.length; i++) {
      sifreGozler[i].addEventListener("click", function () {
        const hedef = this.getAttribute("data-hedef");
        const input = document.getElementById(hedef);
        if (!input) return;
        if (input.type === "password") {
          input.type = "text";
          this.classList.add("aktif");
        } else {
          input.type = "password";
          this.classList.remove("aktif");
        }
      });
    }

    // Slider'lar
    const sliderBagla = function (sliderId, degerId) {
      const s = document.getElementById(sliderId);
      const d = document.getElementById(degerId);
      if (s && d) {
        s.addEventListener("input", function () {
          d.textContent = s.value;
        });
      }
    };
    sliderBagla("ayar-ses-ana", "ayar-ses-ana-deger");
    sliderBagla("ayar-ses-muzik", "ayar-ses-muzik-deger");
    sliderBagla("ayar-ses-efekt", "ayar-ses-efekt-deger");

    // Sohbet
    const sohbetGonder = document.getElementById("sohbet-gonder");
    if (sohbetGonder) {
      sohbetGonder.addEventListener("click", () => self.sohbetGonder());
    }
    const sohbetInput = document.getElementById("sohbet-input");
    if (sohbetInput) {
      sohbetInput.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
          e.preventDefault();
          self.sohbetGonder();
          sohbetInput.blur();
        }
      });
    }

    console.log("✅ Temel olaylar bağlandı");
  };

  // ============================================================
  // 37. DEVAM ET GÖSTER
  // ============================================================
  Arayuz.prototype.devamEtGoster = function () {
    const modal = document.getElementById("kayit-ekrani");
    if (!modal) return;

    modal.classList.remove("gizli");

    for (let i = 1; i <= 3; i++) {
      const el = document.getElementById("kayit-slot-" + i);
      if (!el) continue;

      const bilgi = window.VERGI.Kayit ? window.VERGI.Kayit.slotBilgisi(i) : null;
      if (bilgi) {
        el.textContent = "Gün " + bilgi.gun + " • " + window.VERGI.paraFormat(bilgi.para);
      } else {
        el.textContent = "Boş";
      }
    }

    const kapat = document.getElementById("btn-kayit-kapat");
    if (kapat && !kapat._bagli) {
      kapat._bagli = true;
      kapat.addEventListener("click", function () {
        modal.classList.add("gizli");
      });
    }

    const slotBtns = document.querySelectorAll(".kayit-slot-btn");
    const self = this;
    for (let i = 0; i < slotBtns.length; i++) {
      const btn = slotBtns[i];
      if (btn._bagli) continue;
      btn._bagli = true;

      btn.addEventListener("click", function () {
        const slotNo = parseInt(btn.getAttribute("data-kaydet"));
        self.slotYukle(slotNo);
      });
    }
  };

  // ============================================================
  // 38. SLOT YÜKLE
  // ============================================================
  Arayuz.prototype.slotYukle = function (slotNo) {
    if (!window.VERGI.Kayit) return;

    const kayit = window.VERGI.Kayit.slotYukle(slotNo);
    if (!kayit) {
      this.toastGoster("Bu slot boş!", "uyari");
      return;
    }

    const modal = document.getElementById("kayit-ekrani");
    if (modal) modal.classList.add("gizli");

    this.oyunModuAc();
    this.ekranGoster("oyun-ekrani");

    const self = this;
    setTimeout(function () {
      if (window.VERGI.Oyun) {
        window.VERGI.Oyun.yukle(slotNo);
        window.VERGI.Oyun.baslat({
          meslek: kayit.veri.meslek || "memur",
          genislik: 800,
          yukseklik: 600,
          gunSaniye: window.VERGI.SABITLER.GUN_SANIYE_TEST,
        });
        self.toastGoster("💾 Kayıt yüklendi!", "basari");
      }
    }, 200);
  };

  // ============================================================
  // 39. BAŞLAT
  // ============================================================
  Arayuz.prototype.baslat = function () {
    this.temelOlaylariBagla();
    console.log("🖥️ Arayüz başlatıldı");
  };

  // ============================================================
  // GLOBAL NESNE
  // ============================================================
  VERGI.Arayuz = new Arayuz();
  VERGI.arayuz = VERGI.Arayuz;

  console.log(
    "%c🖥️ ARAYÜZ MODÜLÜ (PART 1) YÜKLENDİ",
    "color:#6ec6ff;font-size:12px;font-weight:bold;"
  );
})();
  // ============================================================
  // 40. BANKA GÖSTER
  // ============================================================
  Arayuz.prototype.bankaGoster = function () {
    this.ekranGoster("banka-ekrani");
    this.bankaRender();
  };

  // ============================================================
  // 41. BANKA RENDER
  // ============================================================
  Arayuz.prototype.bankaRender = function () {
    const k = window.VERGI.Kayit ? window.VERGI.Kayit.aktifKullanici() : null;
    if (k) {
      const el = document.getElementById("banka-kart-isim");
      if (el) el.textContent = k.toUpperCase();
    }

    const elNo = document.getElementById("banka-kart-no");
    if (elNo) elNo.textContent = "1234 5678 9012 3456";

    this.bankaOzetGuncelle();
  };

  // ============================================================
  // 42. BANKA ÖZET GÜNCELLE
  // ============================================================
  Arayuz.prototype.bankaOzetGuncelle = function () {
    const d = window.VERGI.Oyun ? window.VERGI.Oyun.durum : { para: 1000 };

    const elNakit = document.getElementById("banka-nakit");
    if (elNakit) elNakit.textContent = window.VERGI.paraFormat(d.para);

    const elHesap = document.getElementById("banka-hesap");
    if (elHesap) elHesap.textContent = window.VERGI.paraFormat(0);

    const elBorc = document.getElementById("banka-borc");
    if (elBorc) elBorc.textContent = window.VERGI.paraFormat(0);

    const elToplam = document.getElementById("banka-toplam");
    if (elToplam) elToplam.textContent = window.VERGI.paraFormat(d.para);

    const elKart = document.getElementById("banka-kart-bakiye");
    if (elKart) elKart.textContent = window.VERGI.paraFormat(d.para);
  };

  // ============================================================
  // 43. BANKA İŞLEM
  // ============================================================
  Arayuz.prototype.bankaIslem = function (tip) {
    const d = window.VERGI.Oyun ? window.VERGI.Oyun.durum : null;
    if (!d) return;

    let metin = "";

    if (tip === "yatir") {
      metin = "💵 Para yatırma işlemi yakında!";
    } else if (tip === "cek") {
      metin = "💸 Para çekme işlemi yakında!";
    } else if (tip === "kredi") {
      if (d.para < 500) {
        metin = "❌ En az 500 TL gerekli!";
      } else {
        d.para += 1000;
        metin = "💳 1000 TL kredi çektin! (%20 faiz)";
      }
    } else if (tip === "ode") {
      metin = "💰 Kredi ödeme işlemi yakında!";
    } else if (tip === "faiz") {
      metin = "📈 Faiz işletildi!";
    } else if (tip === "ozet") {
      this.bankaOzetGuncelle();
      metin = "📊 Hesap özeti güncellendi!";
    }

    this.toastGoster(metin, "bilgi");
  };

  // ============================================================
  // 44. BORSA GÖSTER
  // ============================================================
  Arayuz.prototype.borsaGoster = function () {
    this.ekranGoster("borsa-ekrani");
    this.borsaRender();
  };

  // ============================================================
  // 45. BORSA RENDER
  // ============================================================
  Arayuz.prototype.borsaRender = function () {
    const hisseler = window.VERGI.BORSA_HISSELERI;
    const d = window.VERGI.Oyun ? window.VERGI.Oyun.durum : { para: 1000 };

    const elNakit = document.getElementById("borsa-nakit");
    if (elNakit) elNakit.textContent = window.VERGI.paraFormat(d.para);

    const elPortfoy = document.getElementById("borsa-portfoy");
    if (elPortfoy) elPortfoy.textContent = window.VERGI.paraFormat(0);

    const elKar = document.getElementById("borsa-kar");
    if (elKar) {
      elKar.textContent = window.VERGI.paraFormat(0);
      elKar.className = "borsa-durum-deger";
    }

    for (let i = 0; i < hisseler.length; i++) {
      const h = hisseler[i];

      const elFiyat = document.getElementById("borsa-fiyat-" + h.id);
      if (elFiyat) elFiyat.textContent = window.VERGI.sayiFormat(h.baslangic);

      const elAdet = document.getElementById("borsa-adet-" + h.id);
      if (elAdet) elAdet.textContent = "0 adet";

      const elDeg = document.getElementById("borsa-degisim-" + h.id);
      if (elDeg) {
        elDeg.textContent = "+0%";
        elDeg.className = "borsa-hisse-degisim";
      }
    }
  };

  // ============================================================
  // 46. BORSA AL
  // ============================================================
  Arayuz.prototype.borsaAl = function (hisseId) {
    const h = window.VERGI.BORSA_HISSELERI.find(function (x) {
      return x.id === hisseId;
    });
    if (!h) return;

    const d = window.VERGI.Oyun ? window.VERGI.Oyun.durum : null;
    if (!d) return;

    if (d.para < h.baslangic) {
      this.toastGoster("💸 Yeterli paran yok!", "hata");
      return;
    }

    d.para -= h.baslangic;
    this.toastGoster("📈 " + h.ad + " aldın!", "basari");
    this.borsaRender();
  };

  // ============================================================
  // 47. BORSA SAT
  // ============================================================
  Arayuz.prototype.borsaSat = function (hisseId) {
    const h = window.VERGI.BORSA_HISSELERI.find(function (x) {
      return x.id === hisseId;
    });
    if (!h) return;

    const d = window.VERGI.Oyun ? window.VERGI.Oyun.durum : null;
    if (!d) return;

    d.para += h.baslangic;
    this.toastGoster("📉 " + h.ad + " sattın!", "basari");
    this.borsaRender();
  };

  // ============================================================
  // 48. MAHKEME GÖSTER
  // ============================================================
  Arayuz.prototype.mahkemeGoster = function () {
    this.ekranGoster("mahkeme-ekrani");

    const elSonuc = document.getElementById("mahkeme-sonuc");
    if (elSonuc) {
      elSonuc.textContent = "";
      elSonuc.className = "mahkeme-sonuc";
    }

    const elBalon = document.getElementById("mahkeme-hakim-balonu");
    if (elBalon) {
      elBalon.textContent = '"Sanık! Vergi kaçırdığın iddia ediliyor. Ne diyorsun?"';
    }
  };

  // ============================================================
  // 49. MAHKEME SEÇ
  // ============================================================
  Arayuz.prototype.mahkemeSec = function (tip) {
    const elSonuc = document.getElementById("mahkeme-sonuc");
    if (!elSonuc) return;

    const d = window.VERGI.Oyun ? window.VERGI.Oyun.durum : null;
    let metin = "";
    let tur = "";

    if (tip === "savun") {
      const kazandi = Math.random() < 0.5;
      if (kazandi) {
        metin = "✅ Savunman kabul edildi! Beraat ettin.";
        tur = "basari";
      } else {
        metin = "❌ Savunman reddedildi! 200 TL ceza.";
        tur = "basarisiz";
        if (d) d.para -= 200;
      }
    } else if (tip === "avukat") {
      if (d && d.para < 500) {
        metin = "💸 Avukat için 500 TL gerekli!";
        tur = "basarisiz";
      } else {
        if (d) d.para -= 500;
        const kazandi = Math.random() < 0.8;
        metin = kazandi
          ? "✅ Avukatın seni kurtardı! Beraat."
          : "❌ Avukatın çabaladı ama hakim ikna olmadı.";
        tur = kazandi ? "basari" : "basarisiz";
      }
    } else if (tip === "rusvet") {
      if (d && d.para < 1000) {
        metin = "💸 Rüşvet için 1000 TL gerekli!";
        tur = "basarisiz";
      } else {
        if (d) d.para -= 1000;
        const yakalandi = Math.random() < 0.4;
        if (yakalandi) {
          metin = "🚨 Rüşvet verdin ama yakalandın! Ekstra 1000 TL ceza!";
          tur = "basarisiz";
          if (d) d.para -= 1000;
        } else {
          metin = "🤫 Rüşvet işe yaradı! Beraat ettin.";
          tur = "basari";
        }
      }
    } else if (tip === "kabul") {
      metin = "🙇 Suçu kabul ettin. 300 TL ceza ödedin.";
      tur = "basarisiz";
      if (d) d.para -= 300;
    }

    elSonuc.textContent = metin;
    elSonuc.className = "mahkeme-sonuc goster " + tur;

    if (window.VERGI.Ses) {
      if (tur === "basari") window.VERGI.Ses.kazanmaSesi();
      else window.VERGI.Ses.hasarSesi();
    }

    if (d && d.para < 0) {
      if (window.VERGI.Oyun) window.VERGI.Oyun.oyunBitir("iflas");
    }
  };

  // ============================================================
  // 50. SEÇİM GÖSTER
  // ============================================================
  Arayuz.prototype.secimGoster = function () {
    this.ekranGoster("seçim-ekrani");

    const elSonuc = document.getElementById("secim-sonuc");
    if (elSonuc) {
      elSonuc.textContent = "";
      elSonuc.className = "secim-sonuc";
    }
  };

  // ============================================================
  // 51. OY VER
  // ============================================================
  Arayuz.prototype.oyVer = function (partiId) {
    const parti = window.VERGI.SECIM_PARTILERI.find(function (p) {
      return p.id === partiId;
    });
    if (!parti) return;

    const elSonuc = document.getElementById("secim-sonuc");
    if (!elSonuc) return;

    const kazananIndex = Math.floor(Math.random() * window.VERGI.SECIM_PARTILERI.length);
    const kazanan = window.VERGI.SECIM_PARTILERI[kazananIndex];

    let metin = "🗳️ Oy verdin: " + parti.ad + "\n\n";

    if (kazanan.id === partiId) {
      metin += "🎉 Partin kazandı!\n";
      metin += "📜 Yeni politika: " + parti.vaat + "\n";
      metin += "📊 Vergi oranı: %" + Math.round((parti.etki.vergi - 1) * 100 + 100);
    } else {
      metin += "😔 Partin kaybetti. Kazanan: " + kazanan.ad + "\n";
      metin += "📜 Yeni politika: " + kazanan.vaat + "\n";
      metin += "📊 Vergi oranı: %" + Math.round((kazanan.etki.vergi - 1) * 100 + 100);
    }

    elSonuc.textContent = metin;
    elSonuc.className = "secim-sonuc goster";
    elSonuc.style.whiteSpace = "pre-line";

    if (window.VERGI.Ses) window.VERGI.Ses.butonSesi();
    this.toastGoster("🗳️ Oyun kullanıldı!", "basari");
  };

  // ============================================================
  // 52. RÜŞVET GÖSTER
  // ============================================================
  Arayuz.prototype.rusvetGoster = function () {
    const modal = document.getElementById("rusvet-ekrani");
    if (modal) modal.classList.remove("gizli");

    const elRisk = document.getElementById("rusvet-risk");
    if (elRisk) elRisk.textContent = "30%";
  };

  // ============================================================
  // 53. RÜŞVET TUTAR SEÇ
  // ============================================================
  Arayuz.prototype.rusvetTutarSec = function (tutar) {
    const butonlar = document.querySelectorAll(".rusvet-tutar-btn");
    for (let i = 0; i < butonlar.length; i++) {
      butonlar[i].classList.remove("secili");
      if (parseInt(butonlar[i].getAttribute("data-tutar")) === tutar) {
        butonlar[i].classList.add("secili");
      }
    }

    let risk = 30;
    if (tutar >= 1000) risk = 10;
    else if (tutar >= 500) risk = 15;
    else if (tutar >= 250) risk = 22;

    const elRisk = document.getElementById("rusvet-risk");
    if (elRisk) elRisk.textContent = risk + "%";

    if (window.VERGI.Ses) window.VERGI.Ses.tikSesi();
  };

  // ============================================================
  // 54. RÜŞVET VER
  // ============================================================
  Arayuz.prototype.rusvetVer = function () {
    const secili = document.querySelector(".rusvet-tutar-btn.secili");
    if (!secili) {
      this.toastGoster("Tutar seç!", "uyari");
      return;
    }

    const tutar = parseInt(secili.getAttribute("data-tutar"));
    const d = window.VERGI.Oyun ? window.VERGI.Oyun.durum : null;

    if (d && d.para < tutar) {
      this.toastGoster("💸 Yeterli paran yok!", "hata");
      if (window.VERGI.Ses) window.VERGI.Ses.hasarSesi();
      return;
    }

    if (d) d.para -= tutar;

    let risk = 30;
    if (tutar >= 1000) risk = 10;
    else if (tutar >= 500) risk = 15;
    else if (tutar >= 250) risk = 22;

    const yakalandi = Math.random() * 100 < risk;

    if (yakalandi) {
      this.toastGoster("🚨 Rüşvet verdin ama yakalandın!", "hata");
      if (d) d.para -= tutar * 2;
      if (window.VERGI.Ses) window.VERGI.Ses.hasarSesi();
    } else {
      this.toastGoster("🤫 Rüşvet işe yaradı!", "basari");
      if (window.VERGI.Ses) window.VERGI.Ses.paraSesi();
    }

    const modal = document.getElementById("rusvet-ekrani");
    if (modal) modal.classList.add("gizli");

    if (d && d.para < 0) {
      if (window.VERGI.Oyun) window.VERGI.Oyun.oyunBitir("iflas");
    }
  };

  // ============================================================
  // 55. KAÇIŞ GÖSTER
  // ============================================================
  Arayuz.prototype.kacisGoster = function () {
    this.ekranGoster("kacis-ekrani");
  };

  // ============================================================
  // 56. ÜLKEYE KAÇ
  // ============================================================
  Arayuz.prototype.ulkeyeKac = function (ulkeId) {
    const ulke = window.VERGI.KACIS_ULKELERI.find(function (u) {
      return u.id === ulkeId;
    });
    if (!ulke) return;

    const d = window.VERGI.Oyun ? window.VERGI.Oyun.durum : null;
    if (d && d.para < ulke.fiyat) {
      this.toastGoster(
        "💸 " + ulke.ad + " için " + window.VERGI.paraFormat(ulke.fiyat) + " gerekli!",
        "hata"
      );
      return;
    }

    if (!confirm(ulke.ad + " ülkesine kaçmak istediğine emin misin? Tüm mal varlığın kalacak!")) {
      return;
    }

    if (d) d.para -= ulke.fiyat;

    this.toastGoster("✈️ " + ulke.ad + "'e kaçtın! Oyun kazanıldı!", "basari");

    if (window.VERGI.Ses) window.VERGI.Ses.kazanmaSesi();

    if (window.VERGI.Oyun) {
      setTimeout(function () {
        window.VERGI.Oyun.oyunBitir("kazandi");
      }, 1000);
    }
  };

  // ============================================================
  // 57. KARİYER GÖSTER
  // ============================================================
  Arayuz.prototype.kariyerGoster = function () {
    this.ekranGoster("kariyer-ekrani");
    this.kariyerRender();
  };

  // ============================================================
  // 58. KARİYER RENDER
  // ============================================================
  Arayuz.prototype.kariyerRender = function () {
    const d = window.VERGI.Oyun ? window.VERGI.Oyun.durum : null;
    if (!d) return;

    const meslek = window.VERGI.meslekBul(d.meslek);
    const elMevcut = document.getElementById("kariyer-mevcut");
    if (elMevcut && meslek) elMevcut.textContent = meslek.ad;

    const elMaas = document.getElementById("kariyer-maas");
    if (elMaas && meslek) elMaas.textContent = "Maaş: " + meslek.gelir + " TL/gün";

    const isler = document.querySelectorAll(".kariyer-is");
    for (let i = 0; i < isler.length; i++) {
      const is = isler[i];
      const isId = is.getAttribute("data-is");
      const isBilgi = window.VERGI.KARIYER_ISLERI.find(function (x) {
        return x.id === isId;
      });
      const btn = is.querySelector(".kariyer-is-btn");
      if (!isBilgi || !btn) continue;

      if (meslek && meslek.ad === isBilgi.ad) {
        btn.disabled = true;
        btn.textContent = "✅ Şu anki işin";
      } else if (d.moral >= isBilgi.gerekMoral) {
        btn.disabled = false;
        btn.textContent = "BAŞVUR";
      } else {
        btn.disabled = true;
        btn.textContent = "Gerek: " + isBilgi.gerekMoral + " moral";
      }
    }
  };

  // ============================================================
  // 59. İŞE BAŞVUR
  // ============================================================
  Arayuz.prototype.iseBasvur = function (isId) {
    const isBilgi = window.VERGI.KARIYER_ISLERI.find(function (x) {
      return x.id === isId;
    });
    if (!isBilgi) return;

    const d = window.VERGI.Oyun ? window.VERGI.Oyun.durum : null;
    if (!d) return;

    if (d.moral < isBilgi.gerekMoral) {
      this.toastGoster("😔 Moral yeterli değil!", "hata");
      return;
    }

    d.gelir = isBilgi.maas;
    d.meslek = isId;

    this.toastGoster("💼 " + isBilgi.ad + " oldun! +" + isBilgi.maas + " TL/gün", "basari");

    if (window.VERGI.Ses) window.VERGI.Ses.kazanmaSesi();

    this.kariyerRender();
  };

  // ============================================================
  // 60. HASTANE GÖSTER
  // ============================================================
  Arayuz.prototype.hastaneGoster = function () {
    this.ekranGoster("hastane-ekrani");
  };

  // ============================================================
  // 61. TEDAVİ AL
  // ============================================================
  Arayuz.prototype.tedaviAl = function (tedaviId) {
    const tedavi = window.VERGI.HASTANE_TEDAVILERI.find(function (t) {
      return t.id === tedaviId;
    });
    if (!tedavi) return;

    const d = window.VERGI.Oyun ? window.VERGI.Oyun.durum : null;
    if (!d) return;

    if (d.para < tedavi.fiyat) {
      this.toastGoster("💸 Yeterli paran yok!", "hata");
      return;
    }

    d.para -= tedavi.fiyat;

    if (tedavi.etki && tedavi.etki.moral) {
      d.moral = Math.min(100, d.moral + tedavi.etki.moral);
    }

    this.toastGoster(
      "🏥 " + tedavi.ad + " alındı! +" + tedavi.etki.moral + " moral",
      "basari"
    );

    if (window.VERGI.Ses) window.VERGI.Ses.sifaSesi();
  };

  // ============================================================
  // 62. GAZETE GÖSTER
  // ============================================================
  Arayuz.prototype.gazeteGoster = function () {
    this.ekranGoster("gazete-ekrani");

    const haber = window.VERGI.rastgeleSec(window.VERGI.HABERLER);
    const elManset = document.getElementById("gazete-manset");
    if (elManset) elManset.textContent = haber.manset;

    const elTarih = document.getElementById("gazete-tarih");
    if (elTarih) {
      const d = new Date();
      const aylar = [
        "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
        "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
      ];
      elTarih.textContent = d.getDate() + " " + aylar[d.getMonth()] + " " + d.getFullYear();
    }
  };

  // ============================================================
  // 63. GÖREV PANEL TOGGLE
  // ============================================================
  Arayuz.prototype.gorevPanelToggle = function () {
    const el = document.getElementById("gorev-panel");
    if (!el) return;

    if (el.classList.contains("gizli")) {
      el.classList.remove("gizli");
      this.gorevRender();
    } else {
      el.classList.add("gizli");
    }
  };

  // ============================================================
  // 64. GÖREV RENDER
  // ============================================================
  Arayuz.prototype.gorevRender = function () {
    const liste = document.getElementById("gorev-liste");
    if (!liste) return;

    liste.innerHTML = "";

    const gorevler = window.VERGI.GOREVLER;
    const tamamlananlar = JSON.parse(
      localStorage.getItem("vergiOyunu_gorevler") || "[]"
    );

    for (let i = 0; i < gorevler.length; i++) {
      const g = gorevler[i];
      const tamam = tamamlananlar.indexOf(g.id) !== -1;

      const div = document.createElement("div");
      div.className = "gorev-ogesi" + (tamam ? " tamamlandi" : "");
      div.setAttribute("data-gorev", g.id);

      div.innerHTML =
        '<div class="gorev-ogesi-ikon">' + (tamam ? "✅" : g.ikon) + "</div>" +
        '<div class="gorev-ogesi-bilgi">' +
          '<div class="gorev-ogesi-baslik">' + g.ad + "</div>" +
          '<div class="gorev-ogesi-aciklama">' + g.aciklama + "</div>" +
        "</div>";

      const self = this;
      div.addEventListener("click", function () {
        self.gorevDetayGoster(g.id);
      });

      liste.appendChild(div);
    }
  };

  // ============================================================
  // 65. GÖREV DETAY GÖSTER
  // ============================================================
  Arayuz.prototype.gorevDetayGoster = function (gorevId) {
    const g = window.VERGI.GOREVLER.find(function (x) {
      return x.id === gorevId;
    });
    if (!g) return;

    const modal = document.getElementById("gorev-detay");
    if (!modal) return;

    const elBaslik = document.getElementById("gd-baslik");
    const elAd = document.getElementById("gd-ad");
    const elAciklama = document.getElementById("gd-aciklama");
    const elOdul = document.getElementById("gd-odul");
    const elDurum = document.getElementById("gd-durum");

    if (elBaslik) elBaslik.textContent = "📋 " + g.ad;
    if (elAd) elAd.textContent = g.ad;
    if (elAciklama) elAciklama.textContent = g.aciklama;

    if (elOdul) {
      const odulMetin = [];
      if (g.odul.para) odulMetin.push("+" + g.odul.para + " TL");
      if (g.odul.moral) odulMetin.push("+" + g.odul.moral + " Moral");
      elOdul.textContent = odulMetin.join(", ") || "Yok";
    }

    if (elDurum) {
      const tamamlananlar = JSON.parse(
        localStorage.getItem("vergiOyunu_gorevler") || "[]"
      );
      if (tamamlananlar.indexOf(g.id) !== -1) {
        elDurum.textContent = "✅ Tamamlandı";
      } else {
        elDurum.textContent = "⏳ Devam ediyor";
      }
    }

    modal.classList.remove("gizli");
  };

  // ============================================================
  // 66. İSTATİSTİK GÖSTER
  // ============================================================
  Arayuz.prototype.istatistikGoster = function () {
    this.ekranGoster("istatistik-ekrani");
    this.istatistikRender();
  };

  // ============================================================
  // 67. İSTATİSTİK RENDER
  // ============================================================
  Arayuz.prototype.istatistikRender = function () {
    const k = window.VERGI.Kayit ? window.VERGI.Kayit.kullaniciBilgisi() : null;
    if (!k) return;

    const set = function (id, deger) {
      const el = document.getElementById(id);
      if (el) el.textContent = deger;
    };

    set("ist-toplam-oyun", k.toplamOyun || 0);
    set("ist-en-iyi-skor", window.VERGI.sayiFormat(k.enIyiSkor || 0));
    set("ist-en-uzun", (k.enUzunSure || 0) + " sn");
    set("ist-toplam-vergi", window.VERGI.paraFormat(k.toplamVergi || 0));
    set("ist-toplam-red", k.toplamReddedilen || 0);
    set("ist-idam", k.idamSayisi || 0);
    set("ist-rozet", (k.rozetler || []).length);
    set("ist-sure", "—");

    const grafik = document.getElementById("ist-grafik");
    if (grafik) {
      grafik.innerHTML = "";
      const skorlar = [100, 250, 180, 420, 300, 550, 700];
      const maxSkor = Math.max.apply(null, skorlar);

      for (let i = 0; i < skorlar.length; i++) {
        const bar = document.createElement("div");
        bar.className = "ist-grafik-bar";
        const yukseklik = (skorlar[i] / maxSkor) * 100;
        bar.style.height = yukseklik + "%";
        bar.setAttribute("data-deger", skorlar[i]);
        grafik.appendChild(bar);
      }
    }
  };

  // ============================================================
  // 68. HAVA PANEL GÖSTER/GİZLE
  // ============================================================
  Arayuz.prototype.havaPanelToggle = function () {
    const el = document.getElementById("hava-panel");
    if (!el) return;

    if (el.classList.contains("gizli") || el.style.display === "none") {
      el.classList.remove("gizli");
      el.style.display = "";
    } else {
      el.classList.add("gizli");
    }
  };

  Arayuz.prototype.havaGuncelle = function () {
    const hava = window.VERGI.rastgeleSec(window.VERGI.HAVA_DURUMLARI);

    const elIkon = document.getElementById("hava-ikon");
    if (elIkon) elIkon.textContent = hava.ikon;

    const elDurum = document.getElementById("hava-durum");
    if (elDurum) elDurum.textContent = hava.ad;

    const elSicaklik = document.getElementById("hava-sicaklik");
    if (elSicaklik) {
      const s = window.VERGI.rastgeleSayi(hava.sicaklik[0], hava.sicaklik[1]);
      elSicaklik.textContent = s + "°C";
    }

    const elRuzgar = document.getElementById("hava-ruzgar");
    if (elRuzgar) {
      const r = window.VERGI.rastgeleSayi(hava.ruzgar[0], hava.ruzgar[1]);
      elRuzgar.textContent = r + " km/s";
    }

    const elNem = document.getElementById("hava-nem");
    if (elNem) {
      const n = window.VERGI.rastgeleSayi(hava.nem[0], hava.nem[1]);
      elNem.textContent = n + "%";
    }

    const elHissedilen = document.getElementById("hava-hissedilen");
    if (elHissedilen) {
      const h = window.VERGI.rastgeleSayi(hava.sicaklik[0] + 2, hava.sicaklik[1] + 2);
      elHissedilen.textContent = h + "°C";
    }
  };

  // ============================================================
  // 69. RADYO PANEL
  // ============================================================
  Arayuz.prototype.radyoCal = function () {
    if (window.VERGI.Ses) {
      window.VERGI.Ses.muzikToggle();
      const btn = document.getElementById("btn-radyo-oynat");
      if (btn) {
        btn.textContent = window.VERGI.Ses.muzikCalisiyor ? "⏸️" : "▶️";
      }
    }
  };

  Arayuz.prototype.radyoSonraki = function () {
    const kanallar = ["Vergi FM", "Ekonomi Radyo", "Halk FM", "İsyan Radyo"];
    const el = document.getElementById("radyo-kanal");
    if (el) {
      el.textContent = window.VERGI.rastgeleSec(kanallar);
    }
    this.toastGoster("📻 Kanal değiştirildi", "bilgi");
  };

  // ============================================================
  // 70. PART 2 OLAYLARINI BAĞLA (ÇOK ÖNEMLİ!)
  // ============================================================
  Arayuz.prototype.part2OlaylariniBagla = function () {
    const self = this;

    function bagla(id, fn) {
      const el = document.getElementById(id);
      if (el && !el._bagli2) {
        el._bagli2 = true;
        el.addEventListener("click", function (e) {
          e.preventDefault();
          if (window.VERGI.Ses) window.VERGI.Ses.butonSesi();
          fn();
        });
      }
    }

    // ===== BANKA =====
    bagla("btn-banka-kapat", () => self.ekranGoster("oyun-ekrani"));
    bagla("btn-para-yatir", () => self.bankaIslem("yatir"));
    bagla("btn-para-cek", () => self.bankaIslem("cek"));
    bagla("btn-kredi-cek", () => self.bankaIslem("kredi"));
    bagla("btn-kredi-ode", () => self.bankaIslem("ode"));
    bagla("btn-faiz-isle", () => self.bankaIslem("faiz"));
    bagla("btn-hesap-ozet", () => self.bankaIslem("ozet"));

    // ===== BORSA =====
    bagla("btn-borsa-kapat", () => self.ekranGoster("oyun-ekrani"));

    // Borsa hisse butonları
    const borsaAlBtn = document.querySelectorAll("[data-al]");
    for (let i = 0; i < borsaAlBtn.length; i++) {
      const el = borsaAlBtn[i];
      if (el._bagli2) continue;
      el._bagli2 = true;
      const hisseId = el.getAttribute("data-al");
      el.addEventListener("click", function () {
        self.borsaAl(hisseId);
      });
    }

    const borsaSatBtn = document.querySelectorAll("[data-sat]");
    for (let i = 0; i < borsaSatBtn.length; i++) {
      const el = borsaSatBtn[i];
      if (el._bagli2) continue;
      el._bagli2 = true;
      const hisseId = el.getAttribute("data-sat");
      el.addEventListener("click", function () {
        self.borsaSat(hisseId);
      });
    }

    // ===== MAHKEME =====
    bagla("btn-mahkeme-kapat", () => self.ekranGoster("oyun-ekrani"));
    const mahkemeSecenekler = document.querySelectorAll(".mahkeme-secenek");
    for (let i = 0; i < mahkemeSecenekler.length; i++) {
      const el = mahkemeSecenekler[i];
      if (el._bagli2) continue;
      el._bagli2 = true;
      const tip = el.getAttribute("data-secenek");
      el.addEventListener("click", function () {
        self.mahkemeSec(tip);
      });
    }

    // ===== SEÇİM =====
    bagla("btn-secim-kapat", () => self.ekranGoster("oyun-ekrani"));
    const secimBtn = document.querySelectorAll(".secim-parti-btn");
    for (let i = 0; i < secimBtn.length; i++) {
      const el = secimBtn[i];
      if (el._bagli2) continue;
      el._bagli2 = true;
      const parti = el.getAttribute("data-oy");
      el.addEventListener("click", function () {
        self.oyVer(parti);
      });
    }

    // ===== RÜŞVET =====
    bagla("btn-rusvet-iptal", () => {
      const m = document.getElementById("rusvet-ekrani");
      if (m) m.classList.add("gizli");
    });
    bagla("btn-rusvet-ver", () => self.rusvetVer());
    const rusvetBtn = document.querySelectorAll(".rusvet-tutar-btn");
    for (let i = 0; i < rusvetBtn.length; i++) {
      const el = rusvetBtn[i];
      if (el._bagli2) continue;
      el._bagli2 = true;
      const tutar = parseInt(el.getAttribute("data-tutar"));
      el.addEventListener("click", function () {
        self.rusvetTutarSec(tutar);
      });
    }

    // ===== KAÇIŞ =====
    bagla("btn-kacis-kapat", () => self.ekranGoster("oyun-ekrani"));
    const kacisBtn = document.querySelectorAll(".kacis-ulke-btn");
    for (let i = 0; i < kacisBtn.length; i++) {
      const el = kacisBtn[i];
      if (el._bagli2) continue;
      el._bagli2 = true;
      const ulke = el.getAttribute("data-kacis");
      el.addEventListener("click", function () {
        self.ulkeyeKac(ulke);
      });
    }

    // ===== KARİYER =====
    bagla("btn-kariyer-kapat", () => self.ekranGoster("oyun-ekrani"));
    const kariyerBtn = document.querySelectorAll(".kariyer-is-btn");
    for (let i = 0; i < kariyerBtn.length; i++) {
      const el = kariyerBtn[i];
      if (el._bagli2) continue;
      el._bagli2 = true;
      const isId = el.getAttribute("data-basvur");
      el.addEventListener("click", function () {
        self.iseBasvur(isId);
      });
    }

    // ===== HASTANE =====
    bagla("btn-hastane-kapat", () => self.ekranGoster("oyun-ekrani"));
    const hastaneBtn = document.querySelectorAll(".hastane-tedavi-btn");
    for (let i = 0; i < hastaneBtn.length; i++) {
      const el = hastaneBtn[i];
      if (el._bagli2) continue;
      el._bagli2 = true;
      const tId = el.getAttribute("data-tedavi");
      el.addEventListener("click", function () {
        self.tedaviAl(tId);
      });
    }

    // ===== GAZETE =====
    bagla("btn-gazete-kapat", () => self.ekranGoster("oyun-ekrani"));

    // ===== GÖREV =====
    bagla("btn-gorev-kapat", () => {
      const el = document.getElementById("gorev-panel");
      if (el) el.classList.add("gizli");
    });
    bagla("btn-gd-kapat", () => {
      const m = document.getElementById("gorev-detay");
      if (m) m.classList.add("gizli");
    });

    // ===== İSTATİSTİK =====
    bagla("btn-ist-kapat", () => self.menuGoster());

    // ===== HAVA / RADYO / HARİTA =====
    bagla("btn-hava-kapat", () => {
      const el = document.getElementById("hava-panel");
      if (el) el.classList.add("gizli");
    });
    bagla("btn-radyo-kapat", () => {
      const el = document.getElementById("radyo-panel");
      if (el) el.classList.add("gizli");
    });
    bagla("btn-harita-kapat", () => {
      const el = document.getElementById("mini-harita");
      if (el) el.classList.add("gizli");
    });

    // Radyo kontrol
    bagla("btn-radyo-oynat", () => self.radyoCal());
    bagla("btn-radyo-sonraki", () => self.radyoSonraki());
    bagla("btn-radyo-onceki", () => self.radyoSonraki());

    // ===== HUD BUTONLARI =====
    bagla("btn-hud-envanter", () => {
      if (window.VERGI.Oyun) window.VERGI.Oyun.envanterToggle();
    });
    bagla("btn-hud-menu", () => {
      if (window.VERGI.Oyun) window.VERGI.Oyun.menuToggle();
    });

    console.log("✅ Part 2 olayları bağlandı");
  };

  // ============================================================
  // 71. BASLAT OVERRIDE (Part 2'yi devreye al)
  // ============================================================
  const _orijinalBaslat = Arayuz.prototype.baslat;
  Arayuz.prototype.baslat = function () {
    _orijinalBaslat.call(this);
    this.part2OlaylariniBagla();
  };