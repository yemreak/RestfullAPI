/**
 * Kütüphane
 * Açıklama: Verileri inceleme ve düzenlemek için dosya
 */

/**
 * Bağımlılıklar
 * -> ds; Dosya işlemleri için gerekli [ fs = file system ]
 * -> yol; Dosyaların yollarını bulmak için gerekli
 */
import { open, writeFile, close, readFile, ftruncate, unlink } from "fs";
import { join } from "path";
import { jsonuObjeyeDönüştür } from "./yardımcılar";

/**
 * Ana dosya yollarını tanımlama
 * * *__dirname* evrensel objedir (global object) değiştirilemez (türkçeleştirilemez)
 * * *__dirname* Bulunduğum dizini verir.
 */
export const anaDizin = join(__dirname, "/../.veri/");

/**
 * Veri oluşturma
 * @param {string} dizin Dosyanın oluşturulacağı dizin / klasör ismi
 * @param {string} dosya Verilerin içinde bulunacağı dosya'nın ismi *(kimlik)*
 * @param {object} veri Dosyaya kayıt edilecek veri
 * @param {function} geriCagirma - *(hata, yükler)* İşlemler yapıldıktan sonra verilen yanıt
 */
export function oluştur(dizin, dosya, veri, geriCagirma) {
  // Dosyayı yazmak için açma
  open(`${anaDizin}${dizin}/${dosya}.json`, "wx", (hata, dosyaTanımlayıcı) => {
    if (!hata && dosyaTanımlayıcı) {
      // Veriyi dizgiye çeviriyoruz.
      const dizgiVerisi = JSON.stringify(veri);

      writeFile(dosyaTanımlayıcı, dizgiVerisi, hata => {
        if (!hata) {
          close(dosyaTanımlayıcı, hata => {
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
export function oku(dizin, dosya, geriCagirma) {
  readFile(`${anaDizin}${dizin}/${dosya}.json`, "utf8", (hata, veri) => {
    if (!hata && veri) {
      // Eğer hata yoksa obje olarak döndürüyoruz. (string değil) [ileride delete ile silme yapabilmek için]
      const veriObjesi = jsonuObjeyeDönüştür(veri);
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
export function güncelle(dizin, dosya, veri, geriCagirma) {
  open(`${anaDizin}${dizin}/${dosya}.json`, "r+", (hata, dosyaTanımlayıcı) => {
    if (!hata && dosyaTanımlayıcı) {
      const veriDizgisi = JSON.stringify(veri);

      // Dosyayı kırpmak
      ftruncate(dosyaTanımlayıcı, hata => {
        if (!hata) {
          // Dosyaya yazma ve sonrasında kapatma
          writeFile(dosyaTanımlayıcı, veriDizgisi, hata => {
            if (!hata) {
              close(dosyaTanımlayıcı, hata => {
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
export function sil(dizin, dosya, geriCagirma) {
  // Dosya baplantısını kaldırma
  unlink(`${anaDizin}${dizin}/${dosya}.json`, hata => {
    if (!hata) {
      geriCagirma(false, { bilgi: "Dosya silme işleminde hata yok :)" });
    } else {
      geriCagirma("Dosyadan veri silinmesinde hata meydana geldi :(");
    }
  });
}
