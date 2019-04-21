"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _veri = require("../veri");

var _yardMcLar = require("./../yard\u0131mc\u0131lar");

var _yapLandRma = require("./../yap\u0131land\u0131rma");

/**
 * İşleyiciyi belirteçler
 *
 * * Örnek: *localhost:3000/belirteçler yazıldığında bu fonksiyon çalışır. (yönlendirici ile, index.js)*
 *
 * @param {object} veri Index.js"te tanımlanan veri objesidir. İstekle gelir.
 * @param {function(number, object):void} geriCagirma İşlemler bittiği zaman verilen yanıt
 ** arg0: HTTP varsayılan durum kodları
 ** arg1: Ek bilgiler, açıklamalar
 */
var belirteçler = function belirteçler(veri, geriCagirma) {
  var uygunMetotlar = ["post", "get", "put", "delete"];

  if (uygunMetotlar.indexOf(veri.metot) > -1) {
    metotlar[veri.metot](veri, geriCagirma);
  } else {
    geriCagirma(405, { bilgi: "Simgle işlemi için uygun metot bulunamadı :(" });
  }
};

/**
 * Belirteçleri onaylamak için kullanılan metot.
 * @param {string} belirtec Okunacak (aranacak) belirteç
 * @param {string} telefonNo Kullanıcı telefonNo numarası
 * @param {function(boolean):void} geriCagirma İşlemler bittiği zaman verilen yanıt
 ** arg0: Belirtecin onaylanma durumu
 */
/**
 * Kullanıcı sisteme giriş yaptığı zaman, oluşturulur. Kullanıcının giriş yapmış olduğunu ispatlar.
 * @author Yunus Emre
 */

belirteçler.belirteçOnaylama = function (belirtec, telefonNo, geriCagirma) {
  (0, _veri.oku)("belirteçler", belirtec, function (hata, belirteçVerisi) {
    if (!hata && belirteçVerisi) {
      // Telefon no, kimlik niyetine kullanıldığı için telefon no'ları karşılaştırıyoruz.
      if (belirteçVerisi.telefonNo == telefonNo && belirteçVerisi.ömür > Date.now()) {
        geriCagirma(true);
      } else {
        geriCagirma(false);
      }
    } else {
      geriCagirma(false);
    }
  });
};

// Belirteçler işleyicisinin alt metotları için kalıp
var metotlar = {};

/**
 * Belirteç oluşturma metodu
 * * Gerekli veriler: *Telefon No, Şifre*
 * * Kullanım şekli: *Yükler ile kullanılır (Body içindeki JSON verileri) (localhost:3000/belitecler)*
 * @param {object} veri Index.js"te tanımlanan veri objesi. İstekle gelir.
 * @param {function(number, object):void} geriCagirma İşlemler bittiği zaman verilen yanıt
 ** arg0: HTTP varsayılan durum kodları
 ** arg1: Ek bilgiler, açıklamalar
 */
metotlar.post = function (veri, geriCagirma) {
  // Gerekli veriler
  var telefonNo = typeof veri.yükler.telefonNo == "string" && veri.yükler.telefonNo.trim().length == 10 ? veri.yükler.telefonNo.trim() : false;

  var şifre = typeof veri.yükler.şifre == "string" && veri.yükler.şifre.trim().length > 0 ? veri.yükler.şifre.trim() : false;

  if (telefonNo && şifre) {
    (0, _veri.oku)("kullanıcılar", telefonNo, function (hata, kullanıcıVerisi) {
      if (!hata && kullanıcıVerisi) {
        // Alınan şifreyi gizlenmiş şifre ile karşılaştırmamız lazım.
        var gizlenmişŞifre = (0, _yardMcLar.şifreleme)(şifre);

        if (gizlenmişŞifre == kullanıcıVerisi.gizlenmişŞifre) {
          var belirteçKimliği = (0, _yardMcLar.rastgeleDizgiOluştur)(_yapLandRma.kimlikUzunluğu);
          var ömür = Date.now() + 1000 * 60 * 60;

          /**
           * Kullanıcının siteme giriş yapmış olduğunu kontrol etmek için kullanılır.
           * * Not: *Kimlik (belirtecKimligi) türkçe karakter içeremez, çünkü adres çubuğundan değer ile çağırılmaktadır. (Sorgu verisi)*
           * @property ömür Kullanıcının giriş yaptıktan sonra, en fazla giriş yapmış halde kalma süresi
           */
          var belirteçObjesi = {
            telefonNo: telefonNo,
            kimlik: belirteçKimliği,
            ömür: ömür
          };

          (0, _veri.oluştur)("belirteçler", belirteçKimliği, belirteçObjesi, function (hata) {
            if (!hata) {
              geriCagirma(200, belirteçObjesi);
            } else {
              geriCagirma(500, { bilgi: "Belirteç oluşturulamadı :(" });
            }
          });
        } else {
          geriCagirma(400, {
            bilgi: "Belirteç oluşturmak için girilen şifre kullanıcı ile uyuşmamakta"
          });
        }
      } else {
        geriCagirma(400, {
          bilgi: "Belirteç oluşturmak için aranan kullanıcı bulunamadı :("
        });
      }
    });
  } else {
    geriCagirma(400, {
      bilgi: "Belirteç oluşturmak için gerekli alanlar doldurulmadı :("
    });
  }
};

/**
 * Belirteç alma metodu
 * * Gerekli veriler: *Kimlik*
 * * Kullanım Şekli: *localhost:3000/belirteçler?kimlik=... (Sorgu verisi)*
 * @param {object} veri Index.js"te tanımlanan veri objesi. İstekle gelir.
 * @param {function(number, object):void} geriCagirma İşlemler bittiği zaman verilen yanıt
 ** arg0: HTTP varsayılan durum kodları
 ** arg1: Ek bilgiler, açıklamalar
 */
metotlar.get = function (veri, geriCagirma) {
  // Rastgele dizgi oluştur metodundaki değere eşit olmak zorunda, o sebeple yapılandırma.kimlikUzunluğu
  var kimlik = typeof veri.sorguDizgisiObjeleri.kimlik == "string" && veri.sorguDizgisiObjeleri.kimlik.trim().length == _yapLandRma.kimlikUzunluğu ? veri.sorguDizgisiObjeleri.kimlik.trim() : false;

  if (kimlik) {
    (0, _veri.oku)("belirteçler", kimlik, function (hata, belirteçVerisi) {
      if (!hata) {
        geriCagirma(200, belirteçVerisi);
      } else {
        geriCagirma(404, { bilgi: "Alınacak belirteç bulunamadı :(" });
      }
    });
  } else {
    geriCagirma(400, {
      bilgi: "Belirteç alma işlemi için gereken alanlar eksik :("
    });
  }
};

/**
 * Belirteç güncelleme metodu
 * * Gerekli Veriler: *Kimlik, Süre Uzatma*
 * * Kullanım şekli: *Yükler ile kullanılır (Body içindeki JSON verileri) (localhost:3000/belirtecler)*
 * @param {object} veri Index.js"te tanımlanan veri objesi. İstekle gelir.
 * @param {function(number, object):void} geriCagirma İşlemler bittiği zaman verilen yanıt
 ** arg0: HTTP varsayılan durum kodları
 ** arg1: Ek bilgiler, açıklamalar
 */
metotlar.put = function (veri, geriCagirma) {
  // İndex'te rastgele dizgi oluşturma uzunluğu ile aynı olmak zorunda (yapılandırma.kimlikUzunluğu)
  var kimlik = typeof veri.yükler.kimlik == "string" && veri.yükler.kimlik.trim().length == _yapLandRma.kimlikUzunluğu ? veri.yükler.kimlik.trim() : false;

  var süreUzatma = typeof veri.yükler.süreUzatma == "boolean" && veri.yükler.süreUzatma;

  if (kimlik && süreUzatma) {
    (0, _veri.oku)("belirteçler", kimlik, function (hata, belirteçVerisi) {
      if (!hata) {
        if (belirteçVerisi.ömür > Date.now()) {
          belirteçVerisi.ömür = Date.now() + 1000 * 60 * 60;

          (0, _veri.güncelle)("belirteçler", kimlik, belirteçVerisi, function (hata) {
            if (!hata) {
              geriCagirma(200, { bilgi: "Belirteç ömrü uzatıldı :)" });
            } else {
              geriCagirma(500, { bilgi: "Belirteç verisi güncellenemedi :(" });
            }
          });
        } else {
          geriCagirma(400, {
            bilgi: "Ömrü uzatılmak istenen belirteç çoktan ölmüştür :("
          });
        }
      } else {
        geriCagirma(400, {
          bilgi: "Belirteç güncelleme işlemi için aranan belirteç bulunamadı :("
        });
      }
    });
  } else {
    geriCagirma(400, {
      bilgi: "Belirteç güncelleme işlemi için gerekli alan(lar) eksik :("
    });
  }
};

/**
 * Belirteç silme metodu
 * * Gerekli Veriler: *Kimlik*
 * * Kullanım Şekli: *localhost:3000/belirteçler?kimlik=... (Sorgu verisi)*
 * @param {object} veri Index.js"te tanımlanan veri objesi. İstekle gelir.
 * @param {function(number, object):void} geriCagirma İşlemler bittiği zaman verilen yanıt
 ** arg0: HTTP varsayılan durum kodları
 ** arg1: Ek bilgiler, açıklamalar
 */
metotlar.delete = function (veri, geriCagirma) {
  var kimlik = typeof veri.sorguDizgisiObjeleri.kimlik == "string" && veri.sorguDizgisiObjeleri.kimlik.trim().length == _yapLandRma.kimlikUzunluğu ? veri.sorguDizgisiObjeleri.kimlik.trim() : false;

  if (kimlik) {
    (0, _veri.oku)("belirteçler", kimlik, function (hata) {
      if (!hata) {
        (0, _veri.sil)("belirteçler", kimlik, function (hata) {
          if (!hata) {
            geriCagirma(200, { bilgi: "Belirteç başarıyla silindi :)" });
          } else {
            geriCagirma(500, {
              bilgi: "Belirteç silme işlemi başarısız oldu :("
            });
          }
        });
      } else {
        geriCagirma(400, { bilgi: "Silenecek belirteç bulunamadı :(" });
      }
    });
  } else {
    geriCagirma(400, {
      bilgi: "Belirteç silmek için gereken alanlar eksin :("
    });
  }
};

exports.default = belirteçler;
//# sourceMappingURL=belirteçler.js.map