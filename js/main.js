/* ============================================================
   ============================================================
   💸 VERGİ OYUNU — BAŞLATICI (MAIN)
   ============================================================
   Tüm modülleri başlatır, hata yakalama, debug panel, FPS
   Global namespace: window.VERGI.Uygulama
   ============================================================
*/

(function () {
  "use strict";

  window.VERGI = window.VERGI || {};

  // ============================================================
  // UYGULAMA SINIFI
  // ============================================================
  function Uygulama() {
    this.basladi = false;
    this.baslamaZaman = 0;
    this.debugAcik = false;
    this.fpsSayac = 0;
    this.fpsZaman = 0;
    this.fpsGoster = 60;
    this.performansUyariGosterildi = false;
    this.otomatikKaydetTimer = null;
  }

  // ============================================================
  // 1. ANA BAŞLATMA
  // ============================================================
  Uygulama.prototype.baslat = function () {
    if (this.basladi) return;
    this.basladi = true;
    this.baslamaZaman = performance.now();

    console.log("");
    console.log("%c╔══════════════════════════════════════════╗", "color:#feca57;");
    console.log("%c║   💸 VERGİ OYUNU v" + (window.VERGI.SABITLER ? window.VERGI.SABITLER.VERSIYON : "1.0.0") + "                ║", "color:#feca57;font-weight:bold;");
    console.log("%c║   Her Şeyden Vergi Ödüyorum              ║", "color:#8a8aa8;");
    console.log("%c╚══════════════════════════════════════════╝", "color:#feca57;");
    console.log("");

    // Global hata yakalama
    this.hataYakalamaKur();

    // Debug (F12)
    this.debugKur();

    // Performans izleme
    this.performansIzle();

    // Sayfa kapatma uyarısı
    this.sayfaKapatmaUyariKur();

    // Görünürlük değişimi
    this.gorunurlukIzle();

    // Otomatik kaydetme
    this.otomatikKaydetmeKur();

    // Klavye kısayolları (global)
    this.klavyeKisayollariKur();

    // Tüm modülleri başlat
    this.modulleriBaslat();

    // Yükleme ekranını göster
    this.ilkEkranGoster();

    // Başlangıç süresini logla
    setTimeout(() => {
      const sure = ((performance.now() - this.baslamaZaman) / 1000).toFixed(2);
      console.log(
        "%c✅ Tüm sistemler hazır (" + sure + "s)",
        "color:#4ade80;font-weight:bold;font-size:13px;"
      );
    }, 100);
  };

  // ============================================================
  // 2. MODÜLLERİ BAŞLAT
  // ============================================================
  Uygulama.prototype.modulleriBaslat = function () {
    // Ses
    if (window.VERGI.Ses && window.VERGI.Ses.baslat) {
      try {
        window.VERGI.Ses.baslat();
        console.log("  🔊 Ses modülü başlatıldı");
      } catch (e) {
        console.warn("  ⚠️ Ses modülü hatası:", e);
      }
    }

    // Kayıt
    if (window.VERGI.Kayit && window.VERGI.Kayit.baslat) {
      try {
        window.VERGI.Kayit.baslat();
        console.log("  👤 Kayıt modülü başlatıldı");
      } catch (e) {
        console.warn("  ⚠️ Kayıt modülü hatası:", e);
      }
    }

    // Arayüz
    if (window.VERGI.Arayuz && window.VERGI.Arayuz.baslat) {
      try {
        window.VERGI.Arayuz.baslat();
        console.log("  🖥️ Arayüz modülü başlatıldı");
      } catch (e) {
        console.warn("  ⚠️ Arayüz modülü hatası:", e);
      }
    }

    // Animasyonlar
    if (window.VERGI.Animasyonlar && window.VERGI.Animasyonlar.baslat) {
      try {
        window.VERGI.Animasyonlar.baslat();
        console.log("  🎬 Animasyon modülü başlatıldı");
      } catch (e) {
        console.warn("  ⚠️ Animasyon modülü hatası:", e);
      }
    }

    // Oyun (sadece oyun ekranına geçildiğinde başlar)
    // Oyun modülü manuel başlatılır.
  };

  // ============================================================
  // 3. İLK EKRAN GÖSTER
  // ============================================================
  Uygulama.prototype.ilkEkranGoster = function () {
    // Yükleme ekranını göster
    if (window.VERGI.Arayuz && window.VERGI.Arayuz.yuklemeGoster) {
      window.VERGI.Arayuz.yuklemeGoster();
    } else {
      // Fallback: direkt menü/giriş
      const yukleme = document.getElementById("yukleme-ekrani");
      if (yukleme) yukleme.classList.add("gizli");
    }
  };

  // ============================================================
  // 4. GLOBAL HATA YAKALAMA
  // ============================================================
  Uygulama.prototype.hataYakalamaKur = function () {
    const self = this;

    // Runtime hataları
    window.addEventListener("error", function (e) {
      console.error("❌ Hata:", e.message, "|", e.filename + ":" + e.lineno);
      self.hataGoster(e.message);
    });

    // Promise hataları
    window.addEventListener("unhandledrejection", function (e) {
      console.error("❌ Promise hatası:", e.reason);
      self.hataGoster("Bir hata oluştu. Konsolu kontrol et.");
    });
  };

  // ============================================================
  // 5. HATA GÖSTER
  // ============================================================
  Uygulama.prototype.hataGoster = function (mesaj) {
    if (window.VERGI.Arayuz && window.VERGI.Arayuz.toastGoster) {
      window.VERGI.Arayuz.toastGoster("⚠️ " + mesaj, "hata");
    }
  };

  // ============================================================
  // 6. DEBUG KUR (F12)
  // ============================================================
  Uygulama.prototype.debugKur = function () {
    const self = this;

    document.addEventListener("keydown", function (e) {
      // F12
      if (e.key === "F12") {
        e.preventDefault();
        self.debugToggle();
      }

      // Ctrl + Shift + D
      if (e.ctrlKey && e.shiftKey && (e.key === "D" || e.key === "d")) {
        e.preventDefault();
        self.debugToggle();
      }

      // Ctrl + Shift + R (Yeniden başlat)
      if (e.ctrlKey && e.shiftKey && (e.key === "R" || e.key === "r")) {
        e.preventDefault();
        if (confirm("Oyunu yeniden başlatmak istiyor musun?")) {
          location.reload();
        }
      }
    });
  };

  Uygulama.prototype.debugToggle = function () {
    const panel = document.getElementById("debug-panel");
    if (!panel) return;

    this.debugAcik = !this.debugAcik;
    if (this.debugAcik) {
      panel.classList.remove("gizli");
      this.debugGuncelle();
      this.debugTimer = setInterval(() => this.debugGuncelle(), 500);
    } else {
      panel.classList.add("gizli");
      if (this.debugTimer) {
        clearInterval(this.debugTimer);
        this.debugTimer = null;
      }
    }
  };

  Uygulama.prototype.debugGuncelle = function () {
    if (!this.debugAcik) return;

    const elFps = document.getElementById("debug-fps");
    const elX = document.getElementById("debug-x");
    const elY = document.getElementById("debug-y");
    const elDurum = document.getElementById("debug-durum");

    const oyun = window.VERGI.Oyun;
    if (oyun && oyun.debugBilgi) {
      const b = oyun.debugBilgi();

      if (elFps) elFps.textContent = b.fps;
      if (elX) elX.textContent = b.x;
      if (elY) elY.textContent = b.y;
      if (elDurum) {
        let durum = "Bekliyor";
        if (b.oyunBitti) durum = "Bitti";
        else if (b.duraklatildi) durum = "Duraklatıldı";
        else if (b.aktif) durum = "Aktif";
        elDurum.textContent = durum + " | Gün " + b.gun + " | " + b.faz;
      }
    }
  };

  // ============================================================
  // 7. PERFORMANS İZLEME
  // ============================================================
  Uygulama.prototype.performansIzle = function () {
    const self = this;
    let sonFps = 60;
    let kontrolSayaci = 0;

    function dongu() {
      // FPS sayacı her 1 saniyede güncellenir
      // (oyun döngüsü de yapıyor ama bağımsız bir kontrol)
      kontrolSayaci++;

      // Her 5 saniyede bir FPS kontrolü
      if (kontrolSayaci % 300 === 0) {
        const fpsEl = document.getElementById("fps-deger");
        if (fpsEl) {
          const yeniFps = parseInt(fpsEl.textContent) || 60;
          sonFps = yeniFps;

          // 20 FPS altındaysa uyarı göster
          if (yeniFps < 20 && !self.performansUyariGosterildi) {
            self.performansUyariGosterildi = true;
            self.performansUyariGoster();
          }
        }
      }

      requestAnimationFrame(dongu);
    }

    requestAnimationFrame(dongu);
  };

  Uygulama.prototype.performansUyariGoster = function () {
    const uyari = document.getElementById("performans-uyari");
    if (uyari) {
      uyari.classList.remove("gizli");

      const btn = document.getElementById("btn-performans-kapat");
      if (btn && !btn._bagli) {
        btn._bagli = true;
        btn.addEventListener("click", () => {
          uyari.classList.add("gizli");
        });
      }
    }
  };

  // ============================================================
  // 8. SAYFA KAPATMA UYARISI
  // ============================================================
  Uygulama.prototype.sayfaKapatmaUyariKur = function () {
    window.addEventListener("beforeunload", function (e) {
      // Eğer oyun aktifse uyar
      const oyun = window.VERGI.Oyun;
      if (oyun && oyun.aktif && !oyun.oyunBitti) {
        e.preventDefault();
        e.returnValue = "Oyundan çıkmak istediğine emin misin?";
        return "Oyundan çıkmak istediğine emin misin?";
      }
    });
  };

  // ============================================================
  // 9. GÖRÜNÜRLÜK İZLEME
  // ============================================================
  Uygulama.prototype.gorunurlukIzle = function () {
    document.addEventListener("visibilitychange", function () {
      const oyun = window.VERGI.Oyun;

      if (document.hidden) {
        // Sekme arkaplana alındı
        if (oyun && oyun.aktif && !oyun.oyunBitti) {
          oyun.duraklat();
        }
      } else {
        // Sekmeye geri dönüldü
        if (oyun && oyun.aktif && !oyun.oyunBitti && oyun.duraklatildi) {
          // Otomatik devam etme — kullanıcı devam etsin
        }
      }
    });
  };

  // ============================================================
  // 10. OTOMATİK KAYDETME
  // ============================================================
  Uygulama.prototype.otomatikKaydetmeKur = function () {
    const self = this;

    // Her 30 saniyede bir otomatik kaydet (oyun aktifse)
    this.otomatikKaydetTimer = setInterval(function () {
      const oyun = window.VERGI.Oyun;
      if (oyun && oyun.aktif && !oyun.oyunBitti && !oyun.duraklatildi) {
        try {
          oyun.kaydet(1); // Slot 1'e otomatik kaydet
        } catch (e) {
          // Sessizce geç
        }
      }
    }, 30000);

    console.log("  💾 Otomatik kaydetme aktif (30 sn)");
  };

  // ============================================================
  // 11. KLAVYE KISAYOLLARI (Global)
  // ============================================================
  Uygulama.prototype.klavyeKisayollariKur = function () {
    document.addEventListener("keydown", function (e) {
      // Ctrl + Shift + S → Kaydet
      if (e.ctrlKey && e.shiftKey && (e.key === "S" || e.key === "s")) {
        e.preventDefault();
        const oyun = window.VERGI.Oyun;
        if (oyun && oyun.aktif) {
          const sonuc = oyun.kaydet(1);
          if (window.VERGI.Arayuz) {
            window.VERGI.Arayuz.toastGoster(
              sonuc.ok ? "💾 Oyun kaydedildi!" : "❌ " + sonuc.mesaj,
              sonuc.ok ? "basari" : "hata"
            );
          }
        }
      }

      // Ctrl + Shift + Q → Ana menü
      if (e.ctrlKey && e.shiftKey && (e.key === "Q" || e.key === "q")) {
        e.preventDefault();
        const oyun = window.VERGI.Oyun;
        if (oyun && oyun.aktif) {
          if (confirm("Ana menüye dönmek istiyor musun?")) {
            oyun.durdur();
            if (window.VERGI.Arayuz) window.VERGI.Arayuz.menuGoster();
          }
        }
      }

      // M → Ses mute
      if ((e.key === "m" || e.key === "M") && e.ctrlKey) {
        e.preventDefault();
        if (window.VERGI.Ses) {
          const sessiz = window.VERGI.Ses.sessizToggle();
          if (window.VERGI.Arayuz) {
            window.VERGI.Arayuz.toastGoster(
              sessiz ? "🔇 Ses kapatıldı" : "🔊 Ses açıldı",
              "bilgi"
            );
          }
        }
      }
    });
  };

  // ============================================================
  // 12. SÜRÜM BİLGİSİ
  // ============================================================
  Uygulama.prototype.surumBilgisi = function () {
    if (window.VERGI.surumBilgisi) {
      return window.VERGI.surumBilgisi();
    }
    return { surum: "1.0.0" };
  };

  // ============================================================
  // 13. İSTATİSTİK KONSOLA YAZ
  // ============================================================
  Uygulama.prototype.konsolBilgi = function () {
    if (!window.VERGI.VERGILER) return;

    console.log("📊 Yüklenen içerik:");
    console.log("   - " + window.VERGI.VERGILER.length + " vergi");
    console.log("   - " + window.VERGI.BASARIMLAR.length + " başarım");
    console.log("   - " + window.VERGI.MESLEKLER.length + " meslek");
    console.log("   - " + window.VERGI.MARKET_URUNLERI.length + " market ürünü");
    console.log("   - " + window.VERGI.HABERLER.length + " haber");
    console.log("   - " + window.VERGI.GOREVLER.length + " görev");
  };

  // ============================================================
  // 14. TEMA DEĞİŞTİR
  // ============================================================
  Uygulama.prototype.temaDegistir = function (tema) {
    document.body.classList.remove("tema-koyu", "tema-aydinlik", "tema-pixel", "tema-neon");
    document.body.classList.add("tema-" + tema);
    localStorage.setItem("vergiOyunu_tema", tema);
    console.log("🎨 Tema değiştirildi:", tema);
  };

  Uygulama.prototype.temaYukle = function () {
    const tema = localStorage.getItem("vergiOyunu_tema") || "koyu";
    document.body.classList.add("tema-" + tema);
  };

  // ============================================================
  // 15. GLOBAL FONKSİYONLAR (Konsoldan çağrılabilir)
  // ============================================================
  Uygulama.prototype.globalFonksiyonlar = function () {
    // Konsoldan test için
    window.vergiTest = {
      // Para ver
      paraVer: function (miktar) {
        if (window.VERGI.Oyun) {
          window.VERGI.Oyun.durum.para += miktar || 1000;
          return window.VERGI.Oyun.durum.para;
        }
      },
      // Moral ver
      moralVer: function (miktar) {
        if (window.VERGI.Oyun) {
          window.VERGI.Oyun.durum.moral = Math.min(100, window.VERGI.Oyun.durum.moral + (miktar || 50));
          return window.VERGI.Oyun.durum.moral;
        }
      },
      // Açlık doldur
      aclikDoldur: function () {
        if (window.VERGI.Oyun) {
          window.VERGI.Oyun.durum.aclik = 100;
          return 100;
        }
      },
      // Vergi tetikle
      vergiTetikle: function () {
        if (window.VERGI.Oyun) {
          window.VERGI.Oyun.vergiGoster();
        }
      },
      // Gün geçir
      gunGecir: function () {
        if (window.VERGI.Oyun) {
          window.VERGI.Oyun.durum.zaman = window.VERGI.Oyun.gunSaniye;
        }
      },
      // Kazandır
      kazan: function () {
        if (window.VERGI.Oyun) {
          window.VERGI.Oyun.oyunBitir("kazandi");
        }
      },
      // Öldür
      oldur: function (sebep) {
        if (window.VERGI.Oyun) {
          window.VERGI.Oyun.oyunBitir(sebep || "idam");
        }
      },
      // Kaydı sil
      kayitSil: function () {
        if (window.VERGI.Kayit) {
          for (let i = 1; i <= 3; i++) {
            window.VERGI.Kayit.slotSil(i);
          }
        }
      },
      // Her şeyi sıfırla
      sifirla: function () {
        if (confirm("Tüm veriler silinsin mi?")) {
          localStorage.clear();
          location.reload();
        }
      },
      // Bilgi
      bilgi: function () {
        const oyun = window.VERGI.Oyun;
        if (oyun) return oyun.debugBilgi();
        return "Oyun başlamadı";
      },
    };

    console.log("🧪 Konsol test fonksiyonları hazır: window.vergiTest");
    console.log("   Kullanım: vergiTest.paraVer(5000)");
  };

  // ============================================================
  // 16. SON KONTROL
  // ============================================================
  Uygulama.prototype.sonKontrol = function () {
    const eksikler = [];

    if (!window.VERGI.SABITLER) eksikler.push("veri.js");
    if (!window.VERGI.Ses) eksikler.push("ses.js");
    if (!window.VERGI.Kayit) eksikler.push("kayit.js");
    if (!window.VERGI.Oyun) eksikler.push("oyun.js");
    if (!window.VERGI.Arayuz) eksikler.push("arayuz.js");
    if (!window.VERGI.Animasyonlar) eksikler.push("animasyonlar.js");

    if (eksikler.length > 0) {
      console.warn("⚠️ Eksik modüller:", eksikler.join(", "));
      return false;
    }

    console.log("✅ Tüm modüller yüklendi");
    return true;
  };

  // ============================================================
  // 17. BAŞLATICI (DOMContentLoaded)
  // ============================================================
  Uygulama.prototype.hazirOl = function () {
    const self = this;

    function basla() {
      // Son kontrol
      if (!self.sonKontrol()) {
        console.error("❌ Bazı modüller yüklenmedi!");
      }

      // Tema yükle
      self.temaYukle();

      // Konsol bilgisi
      self.konsolBilgi();

      // Global fonksiyonlar
      self.globalFonksiyonlar();

      // Uygulamayı başlat
      setTimeout(function () {
        self.baslat();
      }, 100);
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", basla);
    } else {
      basla();
    }
  };

  // ============================================================
  // GLOBAL NESNE
  // ============================================================
  VERGI.Uygulama = new Uygulama();
  VERGI.uygulama = VERGI.Uygulama;

  // Otomatik başlat
  VERGI.Uygulama.hazirOl();

  console.log(
    "%c🚀 MAIN MODÜLÜ YÜKLENDİ",
    "color:#4ade80;font-size:14px;font-weight:bold;"
  );
  console.log(
    "%cKonsol açık mı? Vergi kaçırma! 😄",
    "color:#ff5a5a;font-size:11px;font-style:italic;"
  );
})();