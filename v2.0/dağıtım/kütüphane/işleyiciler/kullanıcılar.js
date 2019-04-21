"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _belirteLer = require("./belirte\xE7ler");

var _belirteLer2 = _interopRequireDefault(_belirteLer);

var _veri = require("./../veri");

var _yardMcLar = require("./../yard\u0131mc\u0131lar");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * İşleyiciler, kullanıcı işlemleri için metot
 * Örnek: localhost:3000/kullanicilar yazıldığında bu fonksiyon çalışır.
 *
 * Not: metotlar; private oluyor, dışarıdan erişilemez.
 *
 * @param {object} veri Index.js"te tanımlanan veri objesidir. İstekle gelir.
 * @param {function(number, object):void} geriCagirma İşlemler bittiği zaman verilen yanıt
 ** arg0: HTTP varsayılan durum kodları
 ** arg1: Ek bilgiler, açıklamalar
 */

var kullanıcılar = function kullanıcılar(veri, geriCagirma) {
  var uygunMetotlar = ["post", "get", "put", "delete"];

  if (uygunMetotlar.indexOf(veri.metot) > -1) {
    metotlar[veri.metot](veri, geriCagirma);
  } else {
    geriCagirma(405, {
      Hata: "HTML isteklerinin metodu uygun değil",
      Metot: "isleyiciler.kullanıcılar"
    });
  }
};

/**
 * İşleyiciler.kullanıclar için kullanılan obje
 * @see kullanicilar
 */
/**
 * Kullanıcı işlemleri için kullanılır
 * @author Yunus Emre
 */

/**
 * Bağımlılıklar
 * * belirteçler; Kullanıcı sisteme giriş yapmış mı kontrolü için kullanılıyor.
 */
var metotlar = {};

/**
 * Kullanıcı oluşturma metodu
 * * Gerekli Veriler: *İsim, soy isim, telefon no, şifre, koşul kabulü*
 * * Not: *telefonNo* kimlik yerine kullanılmaktadır.
 * * Kullanım şekli: *Yükler ile kullanılır (Body içindeki JSON verileri) (localhost:3000/kullanicilar)*
 * @param {object} veri Index.js"te tanımlanan veri objesi. İstekle gelir.
 * @param {function(number, object):void} geriCagirma İşlemler bittiği zaman verilen yanıt
 ** arg0: HTTP varsayılan durum kodları
 ** arg1: Ek bilgiler, açıklamalar
 */
metotlar.post = function (veri, geriCagirma) {
  // İsim alma, 0 karakterden fazla olmalı
  var isim = typeof veri.yükler.isim == "string" && veri.yükler.isim.trim().length > 0 ? veri.yükler.isim.trim() : false;

  // Soyad alma, 0 karakterden fazla olmalı
  var soyİsim = typeof veri.yükler.soyİsim == "string" && veri.yükler.isim.trim().length > 0 ? veri.yükler.soyİsim.trim() : false;

  // telefonNo bilgisi alma. telefonNolar 10 haneli olur.
  var telefonNo = typeof veri.yükler.telefonNo == "string" && veri.yükler.telefonNo.trim().length == 10 ? veri.yükler.telefonNo.trim() : false;

  // Şifre alma
  var şifre = typeof veri.yükler.şifre == "string" && veri.yükler.isim.trim().length > 0 ? veri.yükler.şifre.trim() : false;

  // Koşulları kabul etti mi kontrolü
  var koşulKabulü = typeof veri.yükler.koşulKabulü == "boolean" && veri.yükler.koşulKabulü == true ? true : false;

  if (isim && soyİsim && telefonNo && şifre && koşulKabulü) {
    // Kullanıcının zaten olmadığından emin oluyoruz
    (0, _veri.oku)("kullanıcılar", telefonNo, function (hata) {
      // Eğer kullanıcı dosyasında istenen telefonNo no bulunmaz ise, hata verir. Yani kullanıcı yoksa;
      if (hata) {
        // Şifreyi şifreleyerek (hashing) tutuyoruz.
        var gizlenmişŞifre = (0, _yardMcLar.şifreleme)(şifre);

        if (gizlenmişŞifre) {
          // Kimlik (telefonNo) türkçe karakter içeremez, çünkü adres çubuğundan değer ile çağırılmaktadır. (sorguDizgisi)
          var kullanıcıObjesi = {
            isim: isim,
            soyİsim: soyİsim,
            telefonNo: telefonNo,
            gizlenmişŞifre: gizlenmişŞifre,
            koşulKabulü: koşulKabulü
          };

          (0, _veri.oluştur)("kullanıcılar", telefonNo, kullanıcıObjesi, function (hata) {
            if (!hata) {
              geriCagirma(200, { bilgi: "Kullanıcı oluşturuldu :)" });
            } else {
              geriCagirma(500, { bilgi: "Kullanıcı oluşturulamadı :(" });
            }
          });
        } else {
          geriCagirma(500, { bilgi: "Kullanıcı şifrelenemedi :(" });
        }
      } else {
        geriCagirma(400, { bilgi: "Bu telefonNo numarası zaten kayıtlı :(" });
      }
    });
  } else {
    geriCagirma(400, { bilgi: "İstenen alanlarda eksiklikler var :(" });
  }
};

/**
 * Kullanıcı girişi
 * * Gerekli Veriler: *Telefon no*
 * * Not: *Sadece kimliği onaylanmış kişiler, kendi biligilerine erişebilir. (Diğerlerine erişemez)*
 * * Kullanım Şekli: *localhost:3000/kullanıcılar?telefonNo=... (Sorgu Verisi)*
 * @param {object} veri Index.js"te tanımlanan veri objesi. İstekle gelir.
 * @param {function(number, object):void} geriCagirma İşlemler bittiği zaman verilen yanıt
 ** arg0: HTTP varsayılan durum kodları
 ** arg1: Ek bilgiler, açıklamalar
 */
metotlar.get = function (veri, geriCagirma) {
  // telefonNo numarasını kontrol etmemiz gerekmekte
  var telefonNo = typeof veri.sorguDizgisiObjeleri.telefonNo == "string" && veri.sorguDizgisiObjeleri.telefonNo.trim().length == 10 ? veri.sorguDizgisiObjeleri.telefonNo.trim() : false;

  if (telefonNo) {
    // Bilgilere erişmek isteyen kişinin kendimiz olduğunu anlamak için gereken işlemler.
    var belirteç = typeof veri.başlıklar.belirtec == "string" ? veri.başlıklar.belirtec : false;

    _belirteLer2.default.belirteçOnaylama(belirteç, telefonNo, function (belirteçOnaylandıMı) {
      if (belirteçOnaylandıMı) {
        (0, _veri.oku)("kullanıcılar", telefonNo, function (hata, veri) {
          if (!hata && veri) {
            // Gizlenmiş şifreyi, veriyi isteyene vermeden önce kaldırıyoruz.
            delete veri.gizlenmişŞifre;

            // Durum kodu ve yükleri gönderiyoruz. (Index.js"teki seçilmişİşleyici)
            geriCagirma(200, veri);
          } else {
            geriCagirma(404, { bilgi: "Gösterilecek kullanıcı bulunamadı :(" });
          }
        });
      } else {
        geriCagirma(400, {
          bilgi: "Kullanıcı görme işlemi için belirteç onaylanmadı veya belirtecin ömrü bitmiş :("
        });
      }
    });
  } else {
    geriCagirma(400, {
      bilgi: "Kullanıcı görme işlemi için gerekli bilgi bulunmadı :("
    });
  }
};

/**
 * Kullanıcı verileri güncelleme
 * * Not: *Sadece kimliği onaylanmış kişiler, kendi bilgilerini değiştirebilir. (Diğerlerine erişemez)*
 * * Kullanım şekli: *Yükler ile kullanılır (Body içindeki JSON verileri) (localhost:3000/kullanicilar)*
 * @param {object} veri Index.js"te tanımlanan veri objesi. İstekle gelir.
 * @param {function(number, object):void} geriCagirma İşlemler bittiği zaman verilen yanıt
 ** arg0: HTTP varsayılan durum kodları
 ** arg1: Ek bilgiler, açıklamalar
 */
metotlar.put = function (veri, geriCagirma) {
  // Kullanıcıyı kontrol etme
  // Not: === yerine == kullanıyoruz, detaylı kontrol etmeye gerek yok.
  var telefonNo = typeof veri.yükler.telefonNo == "string" && veri.yükler.telefonNo.trim().length == 10 ? veri.yükler.telefonNo.trim() : false;

  // İsim alma, 0 karakterden fazla olmalı
  var isim = typeof veri.yükler.isim == "string" && veri.yükler.isim.trim().length > 0 ? veri.yükler.isim.trim() : false;
  // Soyad alma, 0 karakterden fazla olmalı
  var soyİsim = typeof veri.yükler.soyİsim == "string" && veri.yükler.isim.trim().length > 0 ? veri.yükler.soyİsim.trim() : false;
  // Şifre alma
  var şifre = typeof veri.yükler.şifre == "string" && veri.yükler.isim.trim().length > 0 ? veri.yükler.şifre.trim() : false;

  if (telefonNo) {
    if (isim || soyİsim || şifre) {
      // Kulanıcının giren kişinin kendi hesabı olduğundan emin oluyoruz.
      var belirteç = typeof veri.başlıklar.belirtec == "string" ? veri.başlıklar.belirtec : false;

      _belirteLer2.default.belirteçOnaylama(belirteç, telefonNo, function (belirteçOnaylandıMı) {
        if (belirteçOnaylandıMı) {
          (0, _veri.oku)("kullanıcılar", telefonNo, function (hata, kullanıcıVerisi) {
            if (!hata && kullanıcıVerisi) {
              if (isim) {
                kullanıcıVerisi.isim = isim;
              }
              if (soyİsim) {
                kullanıcıVerisi.soyİsim = soyİsim;
              }
              if (şifre) {
                kullanıcıVerisi.gizlenmişŞifre = (0, _yardMcLar.şifreleme)(şifre);
              }

              (0, _veri.güncelle)("kullanıcılar", telefonNo, kullanıcıVerisi, function (hata) {
                if (!hata) {
                  geriCagirma(200, { bilgi: "Kullanıcı güncellendi :)" });
                } else {
                  geriCagirma(500, { bilgi: "Kulanıcı güncellenemedi :(" });
                }
              });
            } else {
              geriCagirma(400, { bilgi: "Kullanıcı bulunamadı :(" });
            }
          });
        } else {
          geriCagirma(403, {
            bilgi: "Kullanıcı güncellemek için belirteç bulunamadı veya belirtecin ömrü bitmiş :("
          });
        }
      });
    } else {
      geriCagirma(400, { bilgi: "Güncelleme için girilen bilgiler eksik :(" });
    }
  } else {
    geriCagirma(400, { bilgi: "Güncelleme için gerekli bilgiler eksik :(" });
  }
};

/**
 * Kullanıcı verileri güncelleme
 * * Gerekli Veriler: "Telefon no"
 * * Not: *Sadece kimliği onaylanmış kişiler, kendi bilgilerini değiştirebilir. (Diğerlerine erişemez)*
 * * Kullanım Şekli: *localhost:3000/kullanıcılar?telefonNo=... (Sorgu Verisi)*
 * @param {object} veri Index.js"te tanımlanan veri objesi. İstekle gelir.
 * @param {function(number, object):void} geriCagirma İşlemler bittiği zaman verilen yanıt
 ** arg0: HTTP varsayılan durum kodları
 ** arg1: Ek bilgiler, açıklamalar
 */
metotlar.delete = function (veri, geriCagirma) {
  // Kullanıcının olduğunu kontrol ediyoruz.
  var telefonNo = typeof veri.sorguDizgisiObjeleri.telefonNo == "string" && veri.sorguDizgisiObjeleri.telefonNo.trim().length == 10 ? veri.sorguDizgisiObjeleri.telefonNo : false;

  if (telefonNo) {
    var belirteç = typeof veri.başlıklar.belirtec == "string" ? veri.başlıklar.belirtec : false;

    _belirteLer2.default.belirteçOnaylama(belirteç, telefonNo, function (belirteçOnaylandıMı) {
      if (belirteçOnaylandıMı) {
        (0, _veri.oku)("kullanıcılar", telefonNo, function (hata) {
          if (!hata) {
            (0, _veri.sil)("kullanıcılar", telefonNo, function (hata) {
              if (!hata) {
                geriCagirma(200, { bilgi: "İstenen kullanıcı silindi :)" });
              } else {
                geriCagirma(500, { bilgi: "Kullanıcı silinemedi :(" });
              }
            });
          } else {
            geriCagirma(400, { bilgi: "Silenecek kullanıcı bulunamadı :(" });
          }
        });
      } else {
        geriCagirma(403, {
          bilgi: "Kullanıcı silmek için belirteç bulunamadı veya belirtecin ömrü bitmiş :("
        });
      }
    });
  } else {
    geriCagirma(400, {
      bilgi: "Kullanıcı silmek için gereken bilgiler eksik :("
    });
  }
};

exports.default = kullanıcılar;
//# sourceMappingURL=kullanıcılar.js.map