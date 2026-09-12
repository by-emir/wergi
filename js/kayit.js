/* ============================================================
   ============================================================
   💸 VERGİ OYUNU — KAYIT / GİRİŞ SİSTEMİ
   ============================================================
   localStorage tabanlı kullanıcı sistemi.
   Global namespace: window.VERGI.Kayit
   ============================================================
*/

(function () {
  "use strict";

  window.VERGI = window.VERGI || {};

  // ============================================================
  // KAYIT YÖNETİCİSİ
  // ============================================================
  function KayitYoneticisi() {
    this.anahtarKullanicilar = "vergiOyunu_kullanicilar";
    this.anahtarAktif = "vergiOyunu_aktif";
    this.anahtarSlotPrefix = "vergiOyunu_slot_";
    this.maxKullanici = 100;
    this.maxSlot = 3;
  }

  // ============================================================
  // 1. BASİT HASH (Şifre için)
  // ============================================================
  KayitYoneticisi.prototype.hashle = function (metin) {
    let h = 0;
    if (!metin) return "h0";
    for (let i = 0; i < metin.length; i++) {
      h = (h << 5) - h + metin.charCodeAt(i);
      h |= 0;
    }
    return "h" + Math.abs(h).toString(36) + "_" + metin.length;
  };

  // ============================================================
  // 2. KULLANICI LİSTESİ OKU / YAZ
  // ============================================================
  KayitYoneticisi.prototype.kullanicilariOku = function () {
    try {
      const data = localStorage.getItem(this.anahtarKullanicilar);
      if (!data) return {};
      const parsed = JSON.parse(data);
      return (typeof parsed === "object" && parsed !== null) ? parsed : {};
    } catch (e) {
      console.warn("Kullanıcılar okunamadı:", e);
      return {};
    }
  };

  KayitYoneticisi.prototype.kullanicilariYaz = function (liste) {
    try {
      localStorage.setItem(this.anahtarKullanicilar, JSON.stringify(liste));
      return true;
    } catch (e) {
      console.error("Kullanıcılar yazılamadı:", e);
      return false;
    }
  };

  // ============================================================
  // 3. KAYIT OL
  // ============================================================
  KayitYoneticisi.prototype.kayitOl = function (kullanici, sifre, sifreTekrar) {
    // Doğrulamalar
    if (!kullanici || !sifre) {
      return { ok: false, mesaj: "Kullanıcı adı ve şifre gerekli!" };
    }
    if (kullanici.length < 3 || kullanici.length > 15) {
      return { ok: false, mesaj: "Kullanıcı adı 3-15 karakter olmalı!" };
    }
    if (sifre.length < 4) {
      return { ok: false, mesaj: "Şifre en az 4 karakter olmalı!" };
    }
    if (sifreTekrar !== undefined && sifre !== sifreTekrar) {
      return { ok: false, mesaj: "Şifreler uyuşmuyor!" };
    }
    if (!/^[a-zA-Z0-9_çğıöşüÇĞİÖŞÜ]+$/.test(kullanici)) {
      return { ok: false, mesaj: "Sadece harf, rakam ve _ kullan!" };
    }

    const kullanicilar = this.kullanicilariOku();

    // Zaten var mı?
    const varMi = Object.keys(kullanicilar).find(
      (x) => x.toLowerCase() === kullanici.toLowerCase()
    );
    if (varMi) {
      return { ok: false, mesaj: "Bu kullanıcı adı zaten alınmış!" };
    }

    // Maksimum kullanıcı kontrolü
    if (Object.keys(kullanicilar).length >= this.maxKullanici) {
      return { ok: false, mesaj: "Maksimum kullanıcı sayısına ulaşıldı!" };
    }

    // Kaydet
    kullanicilar[kullanici] = {
      kullanici: kullanici,
      sifre: this.hashle(sifre),
      kayitTarihi: new Date().toISOString(),
      sonGiris: new Date().toISOString(),
      // İstatistikler
      toplamOyun: 0,
      enIyiSkor: 0,
      enUzunSure: 0,
      toplamVergi: 0,
      toplamReddedilen: 0,
      idamSayisi: 0,
      kazanmaSayisi: 0,
      rozetler: [],
      // Ayarlar
      tercihMeslek: "memur",
    };

    if (!this.kullanicilariYaz(kullanicilar)) {
      return { ok: false, mesaj: "Kayıt başarısız, depolama dolu!" };
    }

    // Otomatik giriş
    this.girisYap(kullanici, sifre);

    return {
      ok: true,
      mesaj: "Kayıt başarılı! Hoş geldin " + kullanici + "!",
      kullanici: kullanici,
    };
  };

  // ============================================================
  // 4. GİRİŞ YAP
  // ============================================================
  KayitYoneticisi.prototype.girisYap = function (kullanici, sifre) {
    if (!kullanici || !sifre) {
      return { ok: false, mesaj: "Kullanıcı adı ve şifre gerekli!" };
    }

    const kullanicilar = this.kullanicilariOku();
    const isim = Object.keys(kullanicilar).find(
      (x) => x.toLowerCase() === kullanici.toLowerCase()
    );

    if (!isim) {
      return { ok: false, mesaj: "Kullanıcı bulunamadı!" };
    }

    if (kullanicilar[isim].sifre !== this.hashle(sifre)) {
      return { ok: false, mesaj: "Şifre yanlış!" };
    }

    // Son giriş güncelle
    kullanicilar[isim].sonGiris = new Date().toISOString();
    this.kullanicilariYaz(kullanicilar);

    // Aktif kullanıcıyı kaydet
    try {
      localStorage.setItem(this.anahtarAktif, isim);
    } catch (e) {
      console.warn("Aktif kullanıcı kaydedilemedi:", e);
    }

    return {
      ok: true,
      mesaj: "Giriş başarılı!",
      kullanici: isim,
    };
  };

  // ============================================================
  // 5. ÇIKIŞ YAP
  // ============================================================
  KayitYoneticisi.prototype.cikisYap = function () {
    try {
      localStorage.removeItem(this.anahtarAktif);
    } catch (e) {}
    return { ok: true };
  };

  // ============================================================
  // 6. AKTİF KULLANICI
  // ============================================================
  KayitYoneticisi.prototype.aktifKullanici = function () {
    try {
      const aktif = localStorage.getItem(this.anahtarAktif);
      if (!aktif) return null;

      const kullanicilar = this.kullanicilariOku();
      if (!kullanicilar[aktif]) return null;

      return aktif;
    } catch (e) {
      return null;
    }
  };

  // ============================================================
  // 7. GİRİŞLİ Mİ?
  // ============================================================
  KayitYoneticisi.prototype.girisliMi = function () {
    return this.aktifKullanici() !== null;
  };

  // ============================================================
  // 8. KULLANICI BİLGİSİ
  // ============================================================
  KayitYoneticisi.prototype.kullaniciBilgisi = function (kullanici) {
    const isim = kullanici || this.aktifKullanici();
    if (!isim) return null;

    const kullanicilar = this.kullanicilariOku();
    return kullanicilar[isim] || null;
  };

  // ============================================================
  // 9. KULLANICI SİL
  // ============================================================
  KayitYoneticisi.prototype.kullaniciSil = function (kullanici, sifre) {
    if (!kullanici || !sifre) {
      return { ok: false, mesaj: "Kullanıcı adı ve şifre gerekli!" };
    }

    const kullanicilar = this.kullanicilariOku();
    const isim = Object.keys(kullanicilar).find(
      (x) => x.toLowerCase() === kullanici.toLowerCase()
    );

    if (!isim) {
      return { ok: false, mesaj: "Kullanıcı bulunamadı!" };
    }

    if (kullanicilar[isim].sifre !== this.hashle(sifre)) {
      return { ok: false, mesaj: "Şifre yanlış!" };
    }

    delete kullanicilar[isim];
    this.kullanicilariYaz(kullanicilar);

    // Aktifse çıkış yap
    if (this.aktifKullanici() === isim) {
      this.cikisYap();
    }

    // Slotları temizle
    for (let i = 1; i <= this.maxSlot; i++) {
      try {
        localStorage.removeItem(this.anahtarSlotPrefix + isim + "_" + i);
      } catch (e) {}
    }

    return { ok: true, mesaj: "Kullanıcı silindi!" };
  };

  // ============================================================
  // 10. ŞİFRE DEĞİŞTİR
  // ============================================================
  KayitYoneticisi.prototype.sifreDegistir = function (kullanici, eskiSifre, yeniSifre) {
    if (!kullanici || !eskiSifre || !yeniSifre) {
      return { ok: false, mesaj: "Tüm alanlar gerekli!" };
    }
    if (yeniSifre.length < 4) {
      return { ok: false, mesaj: "Yeni şifre en az 4 karakter olmalı!" };
    }

    const kullanicilar = this.kullanicilariOku();
    const isim = Object.keys(kullanicilar).find(
      (x) => x.toLowerCase() === kullanici.toLowerCase()
    );

    if (!isim) return { ok: false, mesaj: "Kullanıcı bulunamadı!" };
    if (kullanicilar[isim].sifre !== this.hashle(eskiSifre)) {
      return { ok: false, mesaj: "Eski şifre yanlış!" };
    }

    kullanicilar[isim].sifre = this.hashle(yeniSifre);
    this.kullanicilariYaz(kullanicilar);

    return { ok: true, mesaj: "Şifre değiştirildi!" };
  };

  // ============================================================
  // 11. İSTATİSTİK KAYDET (Oyun Sonu)
  // ============================================================
  KayitYoneticisi.prototype.istatistikKaydet = function (sonuc) {
    const isim = this.aktifKullanici();
    if (!isim) return { ok: false, mesaj: "Giriş yapmış kullanıcı yok!" };

    const kullanicilar = this.kullanicilariOku();
    const k = kullanicilar[isim];
    if (!k) return { ok: false, mesaj: "Kullanıcı bulunamadı!" };

    // Yeni kayıtları başlat
    k.toplamOyun = (k.toplamOyun || 0) + 1;

    // En iyi skor
    if (sonuc.skor && sonuc.skor > (k.enIyiSkor || 0)) {
      k.enIyiSkor = sonuc.skor;
    }

    // En uzun süre
    if (sonuc.sure && sonuc.sure > (k.enUzunSure || 0)) {
      k.enUzunSure = sonuc.sure;
    }

    // Toplam vergi
    k.toplamVergi = (k.toplamVergi || 0) + (sonuc.odenen || 0);

    // Toplam reddedilen
    k.toplamReddedilen = (k.toplamReddedilen || 0) + (sonuc.reddedilen || 0);

    // İdam sayısı
    if (sonuc.sebep === "idam" || sonuc.sebep === "haciz" ||
        sonuc.sebep === "depresyon" || sonuc.sebep === "aclik") {
      k.idamSayisi = (k.idamSayisi || 0) + 1;
    }

    // Kazanma sayısı
    if (sonuc.sebep === "kazandi") {
      k.kazanmaSayisi = (k.kazanmaSayisi || 0) + 1;
    }

    // Rozetler (varsa birleştir)
    if (Array.isArray(sonuc.rozetler)) {
      const mevcut = k.rozetler || [];
      const birlesik = mevcut.slice();
      sonuc.rozetler.forEach(function (r) {
        if (birlesik.indexOf(r) === -1) birlesik.push(r);
      });
      k.rozetler = birlesik;
    }

    // En son oynama
    k.sonOyun = new Date().toISOString();

    this.kullanicilariYaz(kullanicilar);
    return { ok: true, kullanici: k };
  };

  // ============================================================
  // 12. ROZET EKLE
  // ============================================================
  KayitYoneticisi.prototype.rozetEkle = function (rozetId) {
    const isim = this.aktifKullanici();
    if (!isim) return false;

    const kullanicilar = this.kullanicilariOku();
    const k = kullanicilar[isim];
    if (!k) return false;

    k.rozetler = k.rozetler || [];
    if (k.rozetler.indexOf(rozetId) !== -1) {
      return false; // Zaten var
    }

    k.rozetler.push(rozetId);
    this.kullanicilariYaz(kullanicilar);
    return true;
  };

  // ============================================================
  // 13. ROZET VAR MI?
  // ============================================================
  KayitYoneticisi.prototype.rozetVarMi = function (rozetId) {
    const k = this.kullaniciBilgisi();
    if (!k || !Array.isArray(k.rozetler)) return false;
    return k.rozetler.indexOf(rozetId) !== -1;
  };

  // ============================================================
  // 14. SKOR TABLOSU
  // ============================================================
  KayitYoneticisi.prototype.skorTablosu = function (limit) {
    limit = limit || 10;
    const kullanicilar = this.kullanicilariOku();

    const liste = Object.keys(kullanicilar).map(function (isim) {
      const k = kullanicilar[isim];
      return {
        kullanici: isim,
        enIyiSkor: k.enIyiSkor || 0,
        enUzunSure: k.enUzunSure || 0,
        toplamOyun: k.toplamOyun || 0,
        kazanma: k.kazanmaSayisi || 0,
      };
    });

    liste.sort(function (a, b) {
      return b.enIyiSkor - a.enIyiSkor;
    });

    return liste.slice(0, limit);
  };

  // ============================================================
  // 15. TÜM KULLANICILAR
  // ============================================================
  KayitYoneticisi.prototype.tumKullanicilar = function () {
    const kullanicilar = this.kullanicilariOku();
    return Object.keys(kullanicilar).map(function (isim) {
      const k = kullanicilar[isim];
      return {
        kullanici: isim,
        kayitTarihi: k.kayitTarihi,
        sonGiris: k.sonGiris,
        enIyiSkor: k.enIyiSkor || 0,
      };
    });
  };

  // ============================================================
  // 16. KAYIT SLOTLARI (Oyun Kaydetme)
  // ============================================================
  KayitYoneticisi.prototype.slotAnahtari = function (slotNo) {
    const isim = this.aktifKullanici();
    if (!isim) return null;
    return this.anahtarSlotPrefix + isim + "_" + slotNo;
  };

  KayitYoneticisi.prototype.slotKaydet = function (slotNo, veri) {
    const anahtar = this.slotAnahtari(slotNo);
    if (!anahtar) return { ok: false, mesaj: "Giriş yapmadın!" };

    try {
      const kayit = {
        tarih: new Date().toISOString(),
        veri: veri,
      };
      localStorage.setItem(anahtar, JSON.stringify(kayit));
      return { ok: true, mesaj: "Kayıt başarılı!" };
    } catch (e) {
      return { ok: false, mesaj: "Kayıt başarısız!" };
    }
  };

  KayitYoneticisi.prototype.slotYukle = function (slotNo) {
    const anahtar = this.slotAnahtari(slotNo);
    if (!anahtar) return null;

    try {
      const data = localStorage.getItem(anahtar);
      if (!data) return null;
      const parsed = JSON.parse(data);
      return parsed;
    } catch (e) {
      return null;
    }
  };

  KayitYoneticisi.prototype.slotSil = function (slotNo) {
    const anahtar = this.slotAnahtari(slotNo);
    if (!anahtar) return false;

    try {
      localStorage.removeItem(anahtar);
      return true;
    } catch (e) {
      return false;
    }
  };

  KayitYoneticisi.prototype.slotBilgisi = function (slotNo) {
    const kayit = this.slotYukle(slotNo);
    if (!kayit) return null;

    return {
      tarih: kayit.tarih,
      gun: kayit.veri && kayit.veri.gun ? kayit.veri.gun : "?",
      para: kayit.veri && kayit.veri.para ? kayit.veri.para : 0,
    };
  };

  // ============================================================
  // 17. TÜM VERİYİ DIŞA AKTAR
  // ============================================================
  KayitYoneticisi.prototype.veriAktar = function () {
    const isim = this.aktifKullanici();
    if (!isim) return null;

    const kullanicilar = this.kullanicilariOku();
    const k = kullanicilar[isim];
    if (!k) return null;

    const slots = {};
    for (let i = 1; i <= this.maxSlot; i++) {
      const slot = this.slotYukle(i);
      if (slot) slots["slot" + i] = slot;
    }

    return {
      kullanici: isim,
      bilgi: k,
      slotlar: slots,
      exportTarihi: new Date().toISOString(),
      versiyon: "1.0.0",
    };
  };

  // ============================================================
  // 18. VERİYİ İÇERİ AKTAR
  // ============================================================
  KayitYoneticisi.prototype.veriIceriAktar = function (data) {
    if (!data || !data.kullanici || !data.bilgi) {
      return { ok: false, mesaj: "Geçersiz veri!" };
    }

    const kullanicilar = this.kullanicilariOku();
    kullanicilar[data.kullanici] = data.bilgi;
    this.kullanicilariYaz(kullanicilar);

    if (data.slotlar) {
      for (let i = 1; i <= this.maxSlot; i++) {
        const slot = data.slotlar["slot" + i];
        if (slot) {
          try {
            const anahtar = this.anahtarSlotPrefix + data.kullanici + "_" + i;
            localStorage.setItem(anahtar, JSON.stringify(slot));
          } catch (e) {}
        }
      }
    }

    return { ok: true, mesaj: "Veri aktarıldı!" };
  };

  // ============================================================
  // 19. TÜM VERİYİ TEMİZLE
  // ============================================================
  KayitYoneticisi.prototype.herŞeyiTemizle = function () {
    try {
      const kullanicilar = this.kullanicilariOku();
      Object.keys(kullanicilar).forEach(function (isim) {
        for (let i = 1; i <= 3; i++) {
          localStorage.removeItem("vergiOyunu_slot_" + isim + "_" + i);
        }
      });
      localStorage.removeItem(this.anahtarKullanicilar);
      localStorage.removeItem(this.anahtarAktif);
      return true;
    } catch (e) {
      return false;
    }
  };

  // ============================================================
  // 20. FORM BAĞLAMA (HTML)
  // ============================================================
  KayitYoneticisi.prototype.formlariBagla = function () {
    const self = this;

    // Giriş formu
    const girisForm = document.getElementById("form-giris");
    if (girisForm) {
      girisForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const kullanici = document.getElementById("giris-kullanici").value.trim();
        const sifre = document.getElementById("giris-sifre").value;
        const sonuc = self.girisYap(kullanici, sifre);
        self._formMesajGoster("mesaj-giris", sonuc);
        if (sonuc.ok) {
          if (window.VERGI.Ses) window.VERGI.Ses.kazanmaSesi();
          setTimeout(function () {
            if (window.VERGI.Arayuz && window.VERGI.Arayuz.menuGoster) {
              window.VERGI.Arayuz.menuGoster();
            }
          }, 600);
        } else {
          if (window.VERGI.Ses) window.VERGI.Ses.hasarSesi();
          const input = document.getElementById("giris-sifre");
          if (input) {
            input.classList.add("shake");
            setTimeout(function () { input.classList.remove("shake"); }, 500);
          }
        }
      });
    }

    // Kayıt formu
    const kayitForm = document.getElementById("form-kayit");
    if (kayitForm) {
      kayitForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const kullanici = document.getElementById("kayit-kullanici").value.trim();
        const sifre = document.getElementById("kayit-sifre").value;
        const sifre2 = document.getElementById("kayit-sifre2").value;

        const sonuc = self.kayitOl(kullanici, sifre, sifre2);
        self._formMesajGoster("mesaj-kayit", sonuc);
        if (sonuc.ok) {
          if (window.VERGI.Ses) window.VERGI.Ses.kazanmaSesi();
          setTimeout(function () {
            if (window.VERGI.Arayuz && window.VERGI.Arayuz.menuGoster) {
              window.VERGI.Arayuz.menuGoster();
            }
          }, 600);
        } else {
          if (window.VERGI.Ses) window.VERGI.Ses.hasarSesi();
          const input = document.getElementById("kayit-kullanici");
          if (input) {
            input.classList.add("shake");
            setTimeout(function () { input.classList.remove("shake"); }, 500);
          }
        }
      });
    }

    // Çıkış butonu
    const cikisBtn = document.getElementById("btn-cikis") || document.getElementById("cikisBtn");
    if (cikisBtn) {
      cikisBtn.addEventListener("click", function () {
        const modal = document.getElementById("cikis-onay");
        if (modal) modal.classList.remove("gizli");
        else if (confirm("Çıkmak istediğine emin misin?")) {
          self.cikisYap();
          location.reload();
        }
      });
    }

    // Çıkış onay
    const cikisEvet = document.getElementById("btn-cikis-evet");
    if (cikisEvet) {
      cikisEvet.addEventListener("click", function () {
        self.cikisYap();
        location.reload();
      });
    }
    const cikisHayir = document.getElementById("btn-cikis-hayir");
    if (cikisHayir) {
      cikisHayir.addEventListener("click", function () {
        const modal = document.getElementById("cikis-onay");
        if (modal) modal.classList.add("gizli");
      });
    }

    // Beni hatırla
    const hatirla = document.getElementById("beni-hatirla");
    if (hatirla) {
      const kayitli = localStorage.getItem("vergiOyunu_hatirla");
      if (kayitli === "1") hatirla.checked = true;
      hatirla.addEventListener("change", function () {
        if (hatirla.checked) {
          localStorage.setItem("vergiOyunu_hatirla", "1");
        } else {
          localStorage.removeItem("vergiOyunu_hatirla");
        }
      });
    }
  };

  // ============================================================
  // 21. FORM MESAJI GÖSTER (Yardımcı)
  // ============================================================
  KayitYoneticisi.prototype._formMesajGoster = function (id, sonuc) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = (sonuc.ok ? "✅ " : "❌ ") + sonuc.mesaj;
    el.className = "form-mesaj goster " + (sonuc.ok ? "basari" : "hata");
    setTimeout(function () {
      el.className = "form-mesaj";
    }, 3000);
  };

  // ============================================================
  // 22. OTOMATİK GİRİŞ KONTROLÜ
  // ============================================================
  KayitYoneticisi.prototype.otomatikGirisKontrol = function () {
    if (this.girisliMi()) {
      return true;
    }
    return false;
  };

  // ============================================================
  // 23. BAŞLAT
  // ============================================================
  KayitYoneticisi.prototype.baslat = function () {
    this.formlariBagla();
    const aktif = this.aktifKullanici();
    if (aktif) {
      console.log("👤 Aktif kullanıcı:", aktif);
    } else {
      console.log("👤 Giriş yapılmamış");
    }
    return this;
  };

  // ============================================================
  // GLOBAL NESNE
  // ============================================================
  VERGI.Kayit = new KayitYoneticisi();
  VERGI.kayit = VERGI.Kayit;

  console.log(
    "%c🔐 KAYIT MODÜLÜ YÜKLENDİ",
    "color:#9b59b6;font-size:12px;font-weight:bold;"
  );
})();