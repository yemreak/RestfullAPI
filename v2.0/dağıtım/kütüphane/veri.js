"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.anaDizin = undefined;
exports.oluştur = oluştur;
exports.oku = oku;
exports.güncelle = güncelle;
exports.sil = sil;

var _fs = require("fs");

var _path = require("path");

var _yardMcLar = require("./yard\u0131mc\u0131lar");

/**
 * Ana dosya yollarını tanımlama
 * * *__dirname* evrensel objedir (global object) değiştirilemez (türkçeleştirilemez)
 * * *__dirname* Bulunduğum dizini verir.
 */
var anaDizin = exports.anaDizin = (0, _path.join)(__dirname, "/../.veri/");

/**
 * Veri oluşturma
 * @param {string} dizin Dosyanın oluşturulacağı dizin / klasör ismi
 * @param {string} dosya Verilerin içinde bulunacağı dosya'nın ismi *(kimlik)*
 * @param {object} veri Dosyaya kayıt edilecek veri
 * @param {function} geriCagirma - *(hata, yükler)* İşlemler yapıldıktan sonra verilen yanıt
 */
/**
 * Kütüphane
 * Açıklama: Verileri inceleme ve düzenlemek için dosya
 */

/**
 * Bağımlılıklar
 * -> ds; Dosya işlemleri için gerekli [ fs = file system ]
 * -> yol; Dosyaların yollarını bulmak için gerekli
 */
function oluştur(dizin, dosya, veri, geriCagirma) {
  // Dosyayı yazmak için açma
  (0, _fs.open)("" + anaDizin + dizin + "/" + dosya + ".json", "wx", function (hata, dosyaTanımlayıcı) {
    if (!hata && dosyaTanımlayıcı) {
      // Veriyi dizgiye çeviriyoruz.
      var dizgiVerisi = JSON.stringify(veri);

      (0, _fs.writeFile)(dosyaTanımlayıcı, dizgiVerisi, function (hata) {
        if (!hata) {
          (0, _fs.close)(dosyaTanımlayıcı, function (hata) {
            if (!hata) {
              geriCagirma(false, {
                bilgi: "Dosya oluşturma işleminde hata yok :)"
              });
            } else {
              geriCagirma("Dosyayı kapatırken hata meydana geldi :(");
            }
          });
        } else {
          geriCagirma("Dosyaya yazarken hata meydana geldi :(");
        }
      });
    } else {
      geriCagirma("Dosya oluşturulamadı, zaten oluşturulmuş olabilir ;)");
    }
  });
}

/**
 * Veri okuma
 * @param {string} dizin Dosyanın oluşturulacağı dizin / klasör ismi
 * @param {string} dosya Verilerin içinde bulunacağı dosya'nın ismi *(kimlik)*
 * @param {function} geriCagirma- *(hata, veriObjesi)* İşlemler yapıldıktan sonra verilen yanıt
 */
function oku(dizin, dosya, geriCagirma) {
  (0, _fs.readFile)("" + anaDizin + dizin + "/" + dosya + ".json", "utf8", function (hata, veri) {
    if (!hata && veri) {
      // Eğer hata yoksa obje olarak döndürüyoruz. (string değil) [ileride delete ile silme yapabilmek için]
      var veriObjesi = (0, _yardMcLar.jsonuObjeyeDönüştür)(veri);
      geriCagirma(hata, veriObjesi);
    } else {
      geriCagirma(hata, veri);
    }
  });
}

/**
 * Verileri güncelleme metodu
 *
 * @param {string} dizin Dosyanın oluşturulacağı dizin / klasör ismi
 * @param {string} dosya Verilerin içinde bulunacağı dosya'nın ismi *(kimlik)*
 * @param {object} veri Dosyaya kayıt edilecek veri
 * @param {function} geriCagirma - *(hata, yükler)* İşlemler yapıldıktan sonra verilen yanıt
 */
function güncelle(dizin, dosya, veri, geriCagirma) {
  (0, _fs.open)("" + anaDizin + dizin + "/" + dosya + ".json", "r+", function (hata, dosyaTanımlayıcı) {
    if (!hata && dosyaTanımlayıcı) {
      var veriDizgisi = JSON.stringify(veri);

      // Dosyayı kırpmak
      (0, _fs.ftruncate)(dosyaTanımlayıcı, function (hata) {
        if (!hata) {
          // Dosyaya yazma ve sonrasında kapatma
          (0, _fs.writeFile)(dosyaTanımlayıcı, veriDizgisi, function (hata) {
            if (!hata) {
              (0, _fs.close)(dosyaTanımlayıcı, function (hata) {
                if (!hata) {
                  geriCagirma(false, {
                    bilgi: "Dosya güncelleme işleminde hata yok :)"
                  });
                } else {
                  geriCagirma("Dosyayı kapatırken hata oluştu :(");
                }
              });
            } else {
              geriCagirma("Var olan dosyaya yazmada hata oluştu :(");
            }
          });
        } else {
          geriCagirma("Dosyayı kırpmada hata oluştu :(");
        }
      });
    } else {
      geriCagirma("Güncellenecek dosya bulunamadı :(");
    }
  });
}

/**
 * Dosyayı silmek
 *
 * @param {string} dizin Dosyanın oluşturulacağı dizin / klasör ismi
 * @param {string} dosya Verilerin içinde bulunacağı dosya'nın ismi *(kimlik)*
 * @param {function} geriCagirma- *(hata, yükler)* İşlemler yapıldıktan sonra verilen yanıt
 */
function sil(dizin, dosya, geriCagirma) {
  // Dosya baplantısını kaldırma
  (0, _fs.unlink)("" + anaDizin + dizin + "/" + dosya + ".json", function (hata) {
    if (!hata) {
      geriCagirma(false, { bilgi: "Dosya silme işleminde hata yok :)" });
    } else {
      geriCagirma("Dosyadan veri silinmesinde hata meydana geldi :(");
    }
  });
}
//# sourceMappingURL=veri.js.map