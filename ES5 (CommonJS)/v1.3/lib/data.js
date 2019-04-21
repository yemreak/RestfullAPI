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
var yardımcılar = require('./helpers')



/**
 * Aktarılacak modül için bu değişkeni oluşturuyoruz.
 */
var dosya = {};

/**
 * Ana dosya yollarını tanımlama
 * 
 * Not: __dirname evrensel objedir (global object) değiştirilemez (türkçeleştirilemez)
 * 
 * Not: __dirname; Bulunduğum dizini verir.
 * !ÖNEMLİ : ÇALIŞMIYOR.
 */
dosya.anaDizin = yol.join(__dirname, '/../.data/');

/**
 * Dosyaya veri yazma
 * @param {string} dizin Dosya dizini
 * @param {string} dosya Dosya ismi
 * @param {object} veri İndex.js'teki veri objesi
 * @param {function} geriCagirma(hata, veri) İşlemler yapıldıktan sonra çalışacak metot 
 */
dosya.oluştur = function (dizin, dosya, veri, geriCagirma) {
    // Dosyayı yazmak için açma
    ds.open(yol.join(__dirname, '/../.data/') + dizin + '/' + dosya + '.json', 'wx', function (hata, dosyaTanımlayıcı) {
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
 * 
 * @param {string} dizin Dosya dizini
 * @param {string} dosya Dosya
 * @param {function} geriCagirma(hata, veri) İşlemler yapıldıktan sonra çalışacak metot 
 */
dosya.oku = function (dizin, dosya, geriCagirma) {
    ds.readFile(yol.join(__dirname, '/../.data/') + dizin + '/' + dosya + '.json', 'utf8', function (hata, veri) {
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
 * @param {string} dizin Dosya dizini
 * @param {string} dosya Dosya
 * @param {string} veri Veri dizgisi
 * @param {function} geriCagirma(hata, veri) İşlemler yapıldıktan sonra çalışacak metot 
 */
dosya.güncelle = function (dizin, dosya, veri, geriCagirma) {
    ds.open(yol.join(__dirname, '/../.data/') + dizin + '/' + dosya + '.json', 'r+', function (hata, dosyaTanımlayıcı) {
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
 * @param {string} dizin Silinecek dosyanın dizini
 * @param {string} dosya Silinecek dosya adı
 * @param {function} geriCagirma(hata, veri) İşlemler yapıldıktan sonra çalışacak metot 
 */
dosya.sil = function (dizin, dosya, geriCagirma) {
    // Dosya baplantısını kaldırma
    ds.unlink(yol.join(__dirname, '/../.data/') + dizin + '/' + dosya + '.json', function (hata) {
        if (!hata) {
            geriCagirma(false, { 'bilgi': "Dosya silme işleminde hata yok :)" });
        } else {
            geriCagirma("Dosyadan veri silinmesinde hata meydana geldi :(");
        }
    });
}


// Aktarılacak obje
module.exports = dosya;