/* ============================================================
   ============================================================
   💸 VERGİ OYUNU — JS ANİMASYONLARI
   ============================================================
   Canvas dışı DOM animasyonları: konfeti, para yağmuru, parçacık,
   sayaç, daktilo, sarsıntı, geçiş efektleri
   Global namespace: window.VERGI.Animasyonlar
   ============================================================
*/

(function () {
  "use strict";

  window.VERGI = window.VERGI || {};

  // ============================================================
  // ANİMASYON SINIFI
  // ============================================================
  function Animasyonlar() {
    this.aktifEfektler = {};
    this.parcacikKap = null;
  }

  // ============================================================
  // YARDIMCI: PARÇACIK KAP OLUŞTUR
  // ============================================================
  Animasyonlar.prototype._parcacikKap = function () {
    if (this.parcacikKap && document.body.contains(this.parcacikKap)) {
      return this.parcacikKap;
    }

    let kap = document.getElementById("js-parcacik-kap");
    if (!kap) {
      kap = document.createElement("div");
      kap.id = "js-parcacik-kap";
      kap.style.cssText =
        "position:fixed;inset:0;pointer-events:none;overflow:hidden;z-index:9000;";
      document.body.appendChild(kap);
    }

    this.parcacikKap = kap;
    return kap;
  };

  // ============================================================
  // 1. KONFETİ YAĞDIR
  // ============================================================
  Animasyonlar.prototype.konfetiYagdir = function (adet, sureMs) {
    adet = adet || 60;
    sureMs = sureMs || 4000;

    const kap = this._parcacikKap();
    const renkler = [
      "#ff3b3b", "#22c55e", "#6ec6ff", "#feca57",
      "#9b59b6", "#ff6b9d", "#f4a261",
    ];

    for (let i = 0; i < adet; i++) {
      const p = document.createElement("div");
      p.className = "konfeti-parca";
      p.style.position = "absolute";
      p.style.top = "-20px";
      p.style.left = Math.random() * 100 + "%";
      p.style.width = (5 + Math.random() * 6) + "px";
      p.style.height = (8 + Math.random() * 8) + "px";
      p.style.background = renkler[Math.floor(Math.random() * renkler.length)];
      p.style.animation = "konfetiDus " + (2.5 + Math.random() * 2) + "s linear " + (Math.random() * 1.5) + "s forwards";
      p.style.opacity = "0.9";

      // Bazıları yuvarlak olsun
      if (Math.random() < 0.3) p.style.borderRadius = "50%";

      kap.appendChild(p);

      // Temizle
      setTimeout(function () {
        if (p.parentNode) p.parentNode.removeChild(p);
      }, sureMs);
    }
  };

  // ============================================================
  // 2. PARA YAĞDIR
  // ============================================================
  Animasyonlar.prototype.paraYagdir = function (adet, sureMs) {
    adet = adet || 30;
    sureMs = sureMs || 4000;

    const kap = this._parcacikKap();
    const ikonlar = ["💰", "💵", "💸", "🪙", "💎"];

    for (let i = 0; i < adet; i++) {
      const p = document.createElement("div");
      p.style.position = "absolute";
      p.style.top = "-40px";
      p.style.left = Math.random() * 100 + "%";
      p.style.fontSize = (20 + Math.random() * 20) + "px";
      p.style.animation = "paraDus " + (3 + Math.random() * 2) + "s linear " + (Math.random() * 1.5) + "s forwards";
      p.textContent = ikonlar[Math.floor(Math.random() * ikonlar.length)];
      p.style.filter = "drop-shadow(0 0 8px rgba(254, 202, 87, 0.8))";

      kap.appendChild(p);

      setTimeout(function () {
        if (p.parentNode) p.parentNode.removeChild(p);
      }, sureMs);
    }
  };

  // ============================================================
  // 3. PARÇACIK PATLAMASI
  // ============================================================
  Animasyonlar.prototype.parcacikPatlat = function (x, y, adet, renk) {
    adet = adet || 20;
    renk = renk || "#feca57";

    const kap = this._parcacikKap();

    for (let i = 0; i < adet; i++) {
      const p = document.createElement("div");
      p.style.position = "absolute";
      p.style.left = x + "px";
      p.style.top = y + "px";
      p.style.width = "6px";
      p.style.height = "6px";
      p.style.background = renk;
      p.style.borderRadius = "50%";
      p.style.boxShadow = "0 0 8px " + renk;

      // Rastgele yön
      const aci = (Math.PI * 2 * i) / adet + Math.random() * 0.3;
      const mesafe = 60 + Math.random() * 80;
      const hedefX = Math.cos(aci) * mesafe;
      const hedefY = Math.sin(aci) * mesafe;

      p.style.transition = "all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)";
      kap.appendChild(p);

      // Animasyonu başlat
      setTimeout(function () {
        p.style.transform = "translate(" + hedefX + "px, " + hedefY + "px) scale(0)";
        p.style.opacity = "0";
      }, 10);

      setTimeout(function () {
        if (p.parentNode) p.parentNode.removeChild(p);
      }, 900);
    }
  };

  // ============================================================
  // 4. SAYI SAYAÇ ANİMASYONU
  // ============================================================
  Animasyonlar.prototype.sayiSayac = function (element, baslangic, bitis, sureMs, ekBirim) {
    if (!element) return;
    sureMs = sureMs || 800;
    ekBirim = ekBirim || "";

    const baslangicZaman = performance.now();
    const self = this;

    function adim(simdi) {
      const gecen = simdi - baslangicZaman;
      const oran = Math.min(1, gecen / sureMs);

      // Easing (ease-out)
      const easeOran = 1 - Math.pow(1 - oran, 3);
      const deger = baslangic + (bitis - baslangic) * easeOran;

      element.textContent = window.VERGI.sayiFormat(deger) + ekBirim;

      if (oran < 1) {
        requestAnimationFrame(adim);
      }
    }

    requestAnimationFrame(adim);
  };

  // ============================================================
  // 5. DAKTİLO EFEKTİ
  // ============================================================
  Animasyonlar.prototype.daktilo = function (element, metin, hizMs, tamamlandi) {
    if (!element) return;
    hizMs = hizMs || 50;
    metin = metin || element.textContent || "";
    element.textContent = "";

    let i = 0;
    const self = this;

    function yaz() {
      if (i < metin.length) {
        element.textContent += metin.charAt(i);
        i++;
        setTimeout(yaz, hizMs);
      } else {
        if (typeof tamamlandi === "function") tamamlandi();
      }
    }

    yaz();
  };

  // ============================================================
  // 6. EKRAN SARSINTISI
  // ============================================================
  Animasyonlar.prototype.ekranSars = function (siddet) {
    siddet = siddet || 8;

    const kap = document.querySelector(".oyun-kap") || document.body;
    const eskiTransform = kap.style.transform;

    const baslangicZaman = performance.now();
    const sure = 400;

    function sars(simdi) {
      const gecen = simdi - baslangicZaman;
      const oran = gecen / sure;

      if (oran >= 1) {
        kap.style.transform = eskiTransform;
        return;
      }

      const guclu = (1 - oran) * siddet;
      const x = (Math.random() - 0.5) * guclu * 2;
      const y = (Math.random() - 0.5) * guclu * 2;

      kap.style.transform = "translate(" + x + "px, " + y + "px)";
      requestAnimationFrame(sars);
    }

    requestAnimationFrame(sars);
  };

  // ============================================================
  // 7. MODAL AÇMA ANİMASYONU
  // ============================================================
  Animasyonlar.prototype.modalAc = function (modal, sureMs) {
    if (!modal) return;
    sureMs = sureMs || 300;

    modal.classList.remove("gizli");
    modal.style.opacity = "0";

    setTimeout(function () {
      modal.style.transition = "opacity " + sureMs + "ms ease";
      modal.style.opacity = "1";

      setTimeout(function () {
        modal.style.transition = "";
        modal.style.opacity = "";
      }, sureMs);
    }, 10);
  };

  // ============================================================
  // 8. MODAL KAPATMA ANİMASYONU
  // ============================================================
  Animasyonlar.prototype.modalKapat = function (modal, sureMs) {
    if (!modal) return;
    sureMs = sureMs || 250;

    modal.style.transition = "opacity " + sureMs + "ms ease";
    modal.style.opacity = "0";

    setTimeout(function () {
      modal.classList.add("gizli");
      modal.style.transition = "";
      modal.style.opacity = "";
    }, sureMs);
  };

  // ============================================================
  // 9. FADE IN / FADE OUT
  // ============================================================
  Animasyonlar.prototype.fadeIn = function (element, sureMs) {
    if (!element) return;
    sureMs = sureMs || 300;

    element.style.opacity = "0";
    element.classList.remove("gizli");

    setTimeout(function () {
      element.style.transition = "opacity " + sureMs + "ms ease";
      element.style.opacity = "1";
      setTimeout(function () {
        element.style.transition = "";
      }, sureMs);
    }, 10);
  };

  Animasyonlar.prototype.fadeOut = function (element, sureMs) {
    if (!element) return;
    sureMs = sureMs || 300;

    element.style.transition = "opacity " + sureMs + "ms ease";
    element.style.opacity = "0";

    setTimeout(function () {
      element.classList.add("gizli");
      element.style.transition = "";
      element.style.opacity = "";
    }, sureMs);
  };

  // ============================================================
  // 10. ZOOM IN
  // ============================================================
  Animasyonlar.prototype.zoomIn = function (element, sureMs) {
    if (!element) return;
    sureMs = sureMs || 400;

    element.style.transform = "scale(0.5)";
    element.style.opacity = "0";
    element.classList.remove("gizli");

    setTimeout(function () {
      element.style.transition = "all " + sureMs + "ms cubic-bezier(0.34, 1.56, 0.64, 1)";
      element.style.transform = "scale(1)";
      element.style.opacity = "1";

      setTimeout(function () {
        element.style.transition = "";
        element.style.transform = "";
        element.style.opacity = "";
      }, sureMs);
    }, 10);
  };

  // ============================================================
  // 11. ZOOM OUT
  // ============================================================
  Animasyonlar.prototype.zoomOut = function (element, sureMs) {
    if (!element) return;
    sureMs = sureMs || 300;

    element.style.transition = "all " + sureMs + "ms ease";
    element.style.transform = "scale(1.5)";
    element.style.opacity = "0";

    setTimeout(function () {
      element.classList.add("gizli");
      element.style.transition = "";
      element.style.transform = "";
      element.style.opacity = "";
    }, sureMs);
  };

  // ============================================================
  // 12. SLIDE IN (Sağdan / Soldan / Yukarı / Aşağı)
  // ============================================================
  Animasyonlar.prototype.slideIn = function (element, yon, sureMs) {
    if (!element) return;
    yon = yon || "sag";
    sureMs = sureMs || 400;

    let baslangic = "translateX(100px)";
    if (yon === "sol") baslangic = "translateX(-100px)";
    if (yon === "yukari") baslangic = "translateY(-100px)";
    if (yon === "asagi") baslangic = "translateY(100px)";

    element.style.transform = baslangic;
    element.style.opacity = "0";
    element.classList.remove("gizli");

    setTimeout(function () {
      element.style.transition = "all " + sureMs + "ms cubic-bezier(0.34, 1.56, 0.64, 1)";
      element.style.transform = "translateX(0) translateY(0)";
      element.style.opacity = "1";

      setTimeout(function () {
        element.style.transition = "";
      }, sureMs);
    }, 10);
  };

  // ============================================================
  // 13. SLIDE OUT
  // ============================================================
  Animasyonlar.prototype.slideOut = function (element, yon, sureMs) {
    if (!element) return;
    yon = yon || "sag";
    sureMs = sureMs || 300;

    let bitis = "translateX(100px)";
    if (yon === "sol") bitis = "translateX(-100px)";
    if (yon === "yukari") bitis = "translateY(-100px)";
    if (yon === "asagi") bitis = "translateY(100px)";

    element.style.transition = "all " + sureMs + "ms ease";
    element.style.transform = bitis;
    element.style.opacity = "0";

    setTimeout(function () {
      element.classList.add("gizli");
      element.style.transition = "";
      element.style.transform = "";
      element.style.opacity = "";
    }, sureMs);
  };

  // ============================================================
  // 14. NABIZ (Pulse) EFEKTİ
  // ============================================================
  Animasyonlar.prototype.nabiz = function (element, adet, sureMs) {
    if (!element) return;
    adet = adet || 3;
    sureMs = sureMs || 300;

    let sayac = 0;
    const eskiTransform = element.style.transform;

    function tekNabiz() {
      element.style.transition = "transform " + (sureMs / 2) + "ms ease";
      element.style.transform = "scale(1.15)";

      setTimeout(function () {
        element.style.transform = "scale(1)";
        sayac++;

        if (sayac < adet) {
          setTimeout(tekNabiz, sureMs);
        } else {
          setTimeout(function () {
            element.style.transition = "";
            element.style.transform = eskiTransform;
          }, sureMs);
        }
      }, sureMs / 2);
    }

    tekNabiz();
  };

  // ============================================================
  // 15. SALLA (Shake) EFEKTİ
  // ============================================================
  Animasyonlar.prototype.salla = function (element, siddet, sureMs) {
    if (!element) return;
    siddet = siddet || 6;
    sureMs = sureMs || 400;

    const eskiTransform = element.style.transform;
    const baslangicZaman = performance.now();

    function adim(simdi) {
      const gecen = simdi - baslangicZaman;
      const oran = gecen / sureMs;

      if (oran >= 1) {
        element.style.transform = eskiTransform;
        return;
      }

      const guclu = (1 - oran) * siddet;
      const x = (Math.random() - 0.5) * guclu * 2;
      element.style.transform = "translateX(" + x + "px)";
      requestAnimationFrame(adim);
    }

    requestAnimationFrame(adim);
  };

  // ============================================================
  // 16. TİTREME
  // ============================================================
  Animasyonlar.prototype.titre = function (element, sureMs) {
    if (!element) return;
    sureMs = sureMs || 500;

    element.classList.add("titre-hata");
    setTimeout(function () {
      element.classList.remove("titre-hata");
    }, sureMs);
  };

  // ============================================================
  // 17. PARLA (Flash) EFEKTİ
  // ============================================================
  Animasyonlar.prototype.parla = function (element, renk, sureMs) {
    if (!element) return;
    renk = renk || "rgba(254, 202, 87, 0.5)";
    sureMs = sureMs || 400;

    const eskiBoxShadow = element.style.boxShadow;
    element.style.transition = "box-shadow " + (sureMs / 2) + "ms ease";
    element.style.boxShadow = "0 0 30px 10px " + renk;

    setTimeout(function () {
      element.style.boxShadow = eskiBoxShadow;
      setTimeout(function () {
        element.style.transition = "";
      }, sureMs / 2);
    }, sureMs / 2);
  };

  // ============================================================
  // 18. EKRAN FLAŞ (Beyaz/Kırmızı/Yeşil)
  // ============================================================
  Animasyonlar.prototype.ekranFlash = function (renk, sureMs) {
    renk = renk || "white";
    sureMs = sureMs || 300;

    let flash = document.getElementById("js-flash");
    if (!flash) {
      flash = document.createElement("div");
      flash.id = "js-flash";
      flash.style.cssText =
        "position:fixed;inset:0;pointer-events:none;z-index:9998;opacity:0;";
      document.body.appendChild(flash);
    }

    flash.style.background = renk;
    flash.style.transition = "opacity " + (sureMs / 2) + "ms ease";
    flash.style.opacity = "0.6";

    setTimeout(function () {
      flash.style.opacity = "0";
    }, sureMs / 2);
  };

  // ============================================================
  // 19. FADE GEÇİŞ (Siyah Perde)
  // ============================================================
  Animasyonlar.prototype.fadeGecis = function (geriCagri, sureMs) {
    sureMs = sureMs || 800;

    let perde = document.getElementById("js-fade-perde");
    if (!perde) {
      perde = document.createElement("div");
      perde.id = "js-fade-perde";
      perde.style.cssText =
        "position:fixed;inset:0;background:#000;z-index:9999;opacity:0;pointer-events:none;transition:opacity " + (sureMs / 2) + "ms ease;";
      document.body.appendChild(perde);
    }

    perde.style.opacity = "1";

    setTimeout(function () {
      if (typeof geriCagri === "function") geriCagri();
      perde.style.opacity = "0";
    }, sureMs / 2);
  };

  // ============================================================
  // 20. YILDIZ PATLAMASI
  // ============================================================
  Animasyonlar.prototype.yildizPatlamasi = function (x, y) {
    const kap = this._parcacikKap();
    const ikonlar = ["⭐", "✨", "🌟", "💫"];

    for (let i = 0; i < 12; i++) {
      const p = document.createElement("div");
      p.style.position = "absolute";
      p.style.left = x + "px";
      p.style.top = y + "px";
      p.style.fontSize = (16 + Math.random() * 16) + "px";
      p.style.pointerEvents = "none";
      p.textContent = ikonlar[Math.floor(Math.random() * ikonlar.length)];

      const aci = (Math.PI * 2 * i) / 12 + Math.random() * 0.3;
      const mesafe = 60 + Math.random() * 60;
      const hedefX = Math.cos(aci) * mesafe;
      const hedefY = Math.sin(aci) * mesafe;

      p.style.transition = "all 1s cubic-bezier(0.34, 1.56, 0.64, 1)";
      kap.appendChild(p);

      setTimeout(function () {
        p.style.transform = "translate(" + hedefX + "px, " + hedefY + "px) scale(0) rotate(360deg)";
        p.style.opacity = "0";
      }, 10);

      setTimeout(function () {
        if (p.parentNode) p.parentNode.removeChild(p);
      }, 1100);
    }
  };

  // ============================================================
  // 21. KALP EFEKTİ
  // ============================================================
  Animasyonlar.prototype.kalpEfekti = function (x, y) {
    const kap = this._parcacikKap();
    const ikonlar = ["❤️", "💕", "💖", "💗"];

    for (let i = 0; i < 6; i++) {
      const p = document.createElement("div");
      p.style.position = "absolute";
      p.style.left = (x + (Math.random() - 0.5) * 40) + "px";
      p.style.top = y + "px";
      p.style.fontSize = (18 + Math.random() * 10) + "px";
      p.style.pointerEvents = "none";
      p.textContent = ikonlar[Math.floor(Math.random() * ikonlar.length)];

      p.style.animation = "kalpUc " + (1 + Math.random() * 0.5) + "s ease-out forwards";
      kap.appendChild(p);

      setTimeout(function () {
        if (p.parentNode) p.parentNode.removeChild(p);
      }, 1600);
    }
  };

  // ============================================================
  // 22. KIVILCIM
  // ============================================================
  Animasyonlar.prototype.kivilcimCikar = function (x, y, adet) {
    adet = adet || 15;
    const kap = this._parcacikKap();

    for (let i = 0; i < adet; i++) {
      const p = document.createElement("div");
      p.style.position = "absolute";
      p.style.left = x + "px";
      p.style.top = y + "px";
      p.style.width = "4px";
      p.style.height = "4px";
      p.style.background = "#ffd94a";
      p.style.borderRadius = "50%";
      p.style.boxShadow = "0 0 8px #ffd94a, 0 0 16px #feca57";

      const aci = Math.random() * Math.PI * 2;
      const mesafe = 40 + Math.random() * 60;
      const hedefX = Math.cos(aci) * mesafe;
      const hedefY = Math.sin(aci) * mesafe;

      p.style.transition = "all " + (0.6 + Math.random() * 0.4) + "s ease-out";
      kap.appendChild(p);

      setTimeout(function () {
        p.style.transform = "translate(" + hedefX + "px, " + hedefY + "px) scale(0)";
        p.style.opacity = "0";
      }, 10);

      setTimeout(function () {
        if (p.parentNode) p.parentNode.removeChild(p);
      }, 1100);
    }
  };

  // ============================================================
  // 23. RENGARENK PATLAMA (Kutlama)
  // ============================================================
  Animasyonlar.prototype.kutlamaPatlamasi = function () {
    const w = window.innerWidth;
    const h = window.innerHeight;

    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        const x = Math.random() * w;
        const y = Math.random() * h * 0.6;
        const renkler = ["#ff3b3b", "#22c55e", "#6ec6ff", "#feca57", "#9b59b6"];
        const renk = renkler[Math.floor(Math.random() * renkler.length)];
        this.parcacikPatlat(x, y, 20, renk);
      }, i * 200);
    }
  };

  // ============================================================
  // 24. UÇAN YAZI (Damage/Heal)
  // ============================================================
  Animasyonlar.prototype.ucanYazi = function (metin, x, y, renk) {
    renk = renk || "#ff3b3b";

    const kap = this._parcacikKap();
    const p = document.createElement("div");
    p.style.position = "absolute";
    p.style.left = x + "px";
    p.style.top = y + "px";
    p.style.fontSize = "24px";
    p.style.fontWeight = "900";
    p.style.color = renk;
    p.style.textShadow = "2px 2px 0 rgba(0,0,0,0.8), 0 0 12px " + renk;
    p.style.pointerEvents = "none";
    p.style.whiteSpace = "nowrap";
    p.style.transform = "translate(-50%, -50%)";
    p.textContent = metin;

    p.style.transition = "all 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)";
    kap.appendChild(p);

    setTimeout(function () {
      p.style.transform = "translate(-50%, calc(-50% - 80px)) scale(1.2)";
      p.style.opacity = "0";
    }, 20);

    setTimeout(function () {
      if (p.parentNode) p.parentNode.removeChild(p);
    }, 1600);
  };

  // ============================================================
  // 25. TOAST ANİMASYONU (Manuel)
  // ============================================================
  Animasyonlar.prototype.toastAnimasyon = function (element) {
    if (!element) return;

    element.style.transform = "translateX(120%)";
    element.style.opacity = "0";

    setTimeout(function () {
      element.style.transition = "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)";
      element.style.transform = "translateX(0)";
      element.style.opacity = "1";
    }, 10);
  };

  // ============================================================
  // 26. YUKLENIYOR SPINNER OLUŞTUR
  // ============================================================
  Animasyonlar.prototype.spinnerOlustur = function (metin) {
    const div = document.createElement("div");
    div.className = "yukleniyor-overlay";
    div.innerHTML =
      '<div class="yukleniyor-spinner"></div>' +
      '<div class="yukleniyor-yazi">' + (metin || "Yükleniyor...") + "</div>";
    document.body.appendChild(div);
    return div;
  };

  // ============================================================
  // 27. DAMLA EFEKTİ (Su)
  // ============================================================
  Animasyonlar.prototype.damlaEfekti = function (x, y) {
    const kap = this._parcacikKap();

    for (let i = 0; i < 8; i++) {
      const p = document.createElement("div");
      p.style.position = "absolute";
      p.style.left = x + "px";
      p.style.top = y + "px";
      p.style.width = "4px";
      p.style.height = "6px";
      p.style.background = "#6ec6ff";
      p.style.borderRadius = "50%";
      p.style.boxShadow = "0 0 6px #6ec6ff";

      const aci = Math.PI + Math.random() * Math.PI;
      const mesafe = 20 + Math.random() * 40;
      const hedefX = Math.cos(aci) * mesafe;
      const hedefY = Math.abs(Math.sin(aci)) * mesafe;

      p.style.transition = "all 0.8s ease-out";
      kap.appendChild(p);

      setTimeout(function () {
        p.style.transform = "translate(" + hedefX + "px, " + hedefY + "px) scale(0)";
        p.style.opacity = "0";
      }, 10);

      setTimeout(function () {
        if (p.parentNode) p.parentNode.removeChild(p);
      }, 900);
    }
  };

  // ============================================================
  // 28. SAYI ARTIŞ / AZALIŞ GÖSTER
  // ============================================================
  Animasyonlar.prototype.sayiDegisim = function (element, eski, yeni) {
    if (!element) return;

    const fark = yeni - eski;
    const renk = fark > 0 ? "#4ade80" : "#ff5a5a";
    const isaret = fark > 0 ? "+" : "";

    // Element'i salla
    this.salla(element, 4, 300);

    // Uçan yazı ekle
    const rect = element.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    this.ucanYazi(isaret + window.VERGI.sayiFormat(fark), x, y, renk);
  };

  // ============================================================
  // 29. HAYALET EFEKTİ (Ghost Trail)
  // ============================================================
  Animasyonlar.prototype.hayaletEfekt = function (element) {
    if (!element) return;

    const rect = element.getBoundingClientRect();
    const kap = this._parcacikKap();

    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        const ghost = element.cloneNode(true);
        ghost.style.position = "fixed";
        ghost.style.left = rect.left + "px";
        ghost.style.top = rect.top + "px";
        ghost.style.width = rect.width + "px";
        ghost.style.height = rect.height + "px";
        ghost.style.opacity = "0.5";
        ghost.style.pointerEvents = "none";
        ghost.style.transition = "all 0.6s ease-out";
        ghost.style.filter = "blur(2px)";

        kap.appendChild(ghost);

        setTimeout(function () {
          ghost.style.opacity = "0";
          ghost.style.transform = "scale(1.1)";
        }, 10);

        setTimeout(function () {
          if (ghost.parentNode) ghost.parentNode.removeChild(ghost);
        }, 700);
      }, i * 100);
    }
  };

  // ============================================================
  // 30. ATMOSFER RENK GEÇİŞ
  // ============================================================
  Animasyonlar.prototype.atmosferGecis = function (element, renk1, renk2, sureMs) {
    if (!element) return;
    sureMs = sureMs || 1500;

    const eskiArka = element.style.background;
    element.style.transition = "background " + sureMs + "ms ease";
    element.style.background = "linear-gradient(180deg, " + renk1 + " 0%, " + renk2 + " 100%)";

    setTimeout(function () {
      element.style.transition = "";
    }, sureMs);
  };

  // ============================================================
  // 31. TÜM EFEKTLERİ TEMİZLE
  // ============================================================
  Animasyonlar.prototype.temizle = function () {
    if (this.parcacikKap) {
      this.parcacikKap.innerHTML = "";
    }

    const flash = document.getElementById("js-flash");
    if (flash && flash.parentNode) flash.parentNode.removeChild(flash);

    const perde = document.getElementById("js-fade-perde");
    if (perde && perde.parentNode) perde.parentNode.removeChild(perde);
  };

  // ============================================================
  // 32. DÖNGÜSEL ANİMASYON (Loop)
  // ============================================================
  Animasyonlar.prototype.dongu = function (isim, fn, sureMs) {
    sureMs = sureMs || 1000;

    if (this.aktifEfektler[isim]) return;

    this.aktifEfektler[isim] = setInterval(fn, sureMs);
  };

  Animasyonlar.prototype.donguDurdur = function (isim) {
    if (this.aktifEfektler[isim]) {
      clearInterval(this.aktifEfektler[isim]);
      delete this.aktifEfektler[isim];
    }
  };

  // ============================================================
  // 33. BASLATICI
  // ============================================================
  Animasyonlar.prototype.baslat = function () {
    this._parcacikKap();
    console.log("🎬 Animasyon modülü başlatıldı");
  };

  // ============================================================
  // GLOBAL NESNE
  // ============================================================
  VERGI.Animasyonlar = new Animasyonlar();
  VERGI.anim = VERGI.Animasyonlar;

  console.log(
    "%c🎬 ANİMASYON MODÜLÜ YÜKLENDİ",
    "color:#feca57;font-size:12px;font-weight:bold;"
  );
})();