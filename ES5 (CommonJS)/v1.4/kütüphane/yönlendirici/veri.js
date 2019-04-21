/**
 * Kütüphane
 * Açıklama: Verileri inceleme ve düzenlemek için dosya
 */

/**
 * Bağımlılıklar
 * -> ds; Dosya işlemleri için gerekli [ fs = file system ]
 * -> yol; Dosyaların yollarını bulmak için gerekli
 */
var ds = require('fs');
var yol = require('path');
var yardımcılar = require('../yardımcılar')

/**
 * Aktarılacak modül için bu değişkeni oluşturuyoruz.
 */
var veri = {};

/**
 * Ana dosya yollarını tanımlama
 * * *__dirname* evrensel objedir (global object) değiştirilemez (türkçeleştirilemez)
 * * *__dirname* Bulunduğum dizini verir.
 */
veri.anaDizin = yol.join(__dirname, "/../../.veri/");

/**
 * Veri oluşturma
 * @param {string} dizin Dosyanın oluşturulacağı dizin / klasör ismi
 * @param {string} dosya Verilerin içinde bulunacağı dosya'nın ismi *(kimlik)*
 * @param {object} veri Dosyaya kayıt edilecek veri
 * @param {function} geriCagirma - *(hata, yükler)* İşlemler yapıldıktan sonra verilen yanıt
 */
veri.oluştur = function (dizin, dosya, veri, geriCagirma) {
    // Dosyayı yazmak için açma
    ds.open(this.anaDizin + dizin + '/' + dosya + '.json', 'wx', function (hata, dosyaTanımlayıcı) {
        if (!hata && dosyaTanımlayıcı) {
            // Veriyi dizgiye çeviriyoruz.
            var dizgiVerisi = JSON.stringify(veri);

            ds.writeFile(dosyaTanımlayıcı, dizgiVerisi, function (hata) {
                if (!hata) {
                    ds.close(dosyaTanımlayıcı, function (hata) {
                        if (!hata) {
                            geriCagirma(false, { 'bilgi': "Dosya oluşturma işleminde hata yok :)" });
                        } else {
                            geriCagirma('Dosyayı kapatırken hata meydana geldi :(');
                        }
                    });
                } else {
                    geriCagirma('Dosyaya yazarken hata meydana geldi :(');
                }
            });
        } else {
            geriCagirma('Dosya oluşturulamadı, zaten oluşturulmuş olabilir ;)');
        }
    });
};

/**
 * Veri okuma
 * @param {string} dizin Dosyanın oluşturulacağı dizin / klasör ismi
 * @param {string} dosya Verilerin içinde bulunacağı dosya'nın ismi *(kimlik)*
 * @param {function} geriCagirma- *(hata, veriObjesi)* İşlemler yapıldıktan sonra verilen yanıt 
 */
veri.oku = function (dizin, dosya, geriCagirma) {
    ds.readFile(this.anaDizin + dizin + '/' + dosya + '.json', 'utf8', function (hata, veri) {
        if (!hata && veri) {
            // Eğer hata yoksa obje olarak döndürüyoruz. (string değil) [ileride delete ile silme yapabilmek için]
            var veriObjesi = yardımcılar.jsonuObjeyeDönüştür(veri);
            geriCagirma(hata, veriObjesi);
        } else {
            geriCagirma(hata, veri);
        }
        
    });
};

/**
 * Verileri güncelleme metodu
 * 
 * @param {string} dizin Dosyanın oluşturulacağı dizin / klasör ismi
 * @param {string} dosya Verilerin içinde bulunacağı dosya'nın ismi *(kimlik)*
 * @param {object} veri Dosyaya kayıt edilecek veri
 * @param {function} geriCagirma - *(hata, yükler)* İşlemler yapıldıktan sonra verilen yanıt 
 */
veri.güncelle = function (dizin, dosya, veri, geriCagirma) {
    ds.open(this.anaDizin + dizin + '/' + dosya + '.json', 'r+', function (hata, dosyaTanımlayıcı) {
        if (!hata && dosyaTanımlayıcı) {
            var veriDizgisi = JSON.stringify(veri);

            // Dosyayı kırpmak
            ds.ftruncate(dosyaTanımlayıcı, function (hata) {
                if (!hata) {
                    // Dosyaya yazma ve sonrasında kapatma
                    ds.writeFile(dosyaTanımlayıcı, veriDizgisi, function (hata) {
                        if (!hata) {
                            ds.close(dosyaTanımlayıcı, function (hata) {
                                if (!hata) {
                                    geriCagirma(false, { 'bilgi': "Dosya güncelleme işleminde hata yok :)" });
                                } else {
                                    geriCagirma('Dosyayı kapatırken hata oluştu :(');
                                }
                            })
                        } else {
                            geriCagirma('Var olan dosyaya yazmada hata oluştu :(');
                        }
                    })
                } else {
                    geriCagirma('Dosyayı kırpmada hata oluştu :(');
                }
            });
        } else {
            geriCagirma('Güncellenecek dosya bulunamadı :(');
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
veri.sil = function (dizin, dosya, geriCagirma) {
    // Dosya baplantısını kaldırma
    ds.unlink(this.anaDizin + dizin + '/' + dosya + '.json', function (hata) {
        if (!hata) {
            geriCagirma(false, { 'bilgi': "Dosya silme işleminde hata yok :)" });
        } else {
            geriCagirma("Dosyadan veri silinmesinde hata meydana geldi :(");
        }
    });
}


// Aktarılacak obje
module.exports = veri;