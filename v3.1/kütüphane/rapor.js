/**
 * Raporları tutan ve yönlendiren kütüphane
 */

/**
 * Bağımlılıklar
 */

import { join as yoluKat } from 'path';
import {
    open as dosyayıAç,
    appendFile as dosyayaİlaveEt,
    close as dosyayıKapat,
    readdir as dizinOku,
    readFile as dosyayıOku,
    writeFile as dosyayaYaz,
    truncate as dosyayıKırp
} from 'fs';
import {
    gzip as gzSıkıştırma,
    unzip as gzAyrıştırma
} from 'zlib';

// Raporların kayıt edildiği dizin
export const anaDizin = yoluKat(__dirname, `/../.raporlar/`);

/**
 * Rapor dosyasına veri ekleme, eğer dosya yoksa oluşturma
 * @param {string} dosyaAdi Veri ilave edilecek dosyanın adı
 * @param {string} veri İlave edilecek veri
 * @param {function(boolean | string):void} geriCagirma İşlemler bittiği zaman verilen yanıt
 ** arg0: *İşlem sırasında oluşan hatanın açıklaması (hata yoksa false)*
 */
export function ilaveEt(dosyaAdi, veri, geriCagirma) {
    dosyayıAç(`${anaDizin}${dosyaAdi}.log`, `a`, (hata, dosyaTanımlayıcı) => {
        if (!hata && dosyaTanımlayıcı) {
            // Dosyaya veri ilave etme
            dosyayaİlaveEt(dosyaTanımlayıcı, `${veri}\n`, hata => {
                if (!hata) {
                    dosyayıKapat(dosyaTanımlayıcı, hata => {
                        if (!hata) {
                            geriCagirma(false);
                        } else {
                            geriCagirma("Dosyayı kapatırken hata meydana geldi :(");
                        }
                    });
                } else {
                    geriCagirma("Dosyaya ilave yaparken hata meydana geldi :(");
                }
            });
        } else {
            geriCagirma("Dosya ilave yapmak için açılamadı :(");
        }
    });
}

/**
 * Raporları listeleme
 * @param {boolean} seriListele Eğer *true* ise sıkıştırılmış raporları da içerir
 * @param {function(boolean | NodeJS.ErrnoException, string[])} geriCagirma İşlemler bittiği zaman verilen yanıt
 ** arg0: *İşlem sırasında oluşan hatanın açıklaması (hata yoksa false)*
 ** arg1: *İşlem sonrasında oluşan verilerin listesi*
 */
export function listele(seriListele, geriCagirma) {
    dizinOku(anaDizin, (hata, veri) => {
        if (!hata && veri && veri.length > 0) {
            let kırpılmışDosyaİsimleri = [];

            veri.forEach(veriİsmi => {
                // .log uzantılı verileri ekleme
                if (veriİsmi.indexOf(".log") > -1) {
                    kırpılmışDosyaİsimleri.push(veriİsmi.replace(".log", ""));
                }

                // Sıkıştırılmış dosyları da içeriyorsa onlar da ekleniyor (Sıkıştırma türünden dolay gz)
                if (veriİsmi.indexOf(".gz.b64") > -1 && seriListele) {
                    kırpılmışDosyaİsimleri.push(veriİsmi.replace(".gz.b64", ""));
                }

                geriCagirma(false, kırpılmışDosyaİsimleri);
            });
        } else {
            geriCagirma(hata, veri);
        }
    });
}

/**
 * Raporu sıkıştırma (.gz.b64 formatına göre) işlemi
 * @param {string} raporKimligi Sıkıştırılacak raporun kimlik bilgisi
 * @param {string} yeniRaporKimligi Sıkıştırılmış raporun kimlik bilgisi
 * @param {function(boolean | NodeJS.ErrnoException)} geriCagirma İşlemler bittiği zaman verilen yanıt
 ** arg0: *İşlem sırasında oluşan hatanın açıklaması (hata yoksa false)*
 */
export function sıkıştır(raporKimligi, yeniRaporKimligi, geriCagirma) {
    const kaynakDosya = `${raporKimligi}.log`;
    const hedefDosya = `${yeniRaporKimligi}.gz.b64`;
    
    dosyayıOku(`${anaDizin}${kaynakDosya}`, "utf8", (hata, girişDizgisi) => {
        if (!hata && girişDizgisi) {
            // Raporları sıkıştırma (gz.b64 formatında)
            gzSıkıştırma(girişDizgisi, (hata, tampon) => {
                if (!hata && tampon) {
                    // Raporları hedef dosyaya gönderme
                    dosyayıAç(`${anaDizin}${hedefDosya}`, "wx", (hata, dosyaTanımlayıcı) => {
                        if (!hata && dosyaTanımlayıcı) {
                            dosyayaYaz(dosyaTanımlayıcı, tampon.toString("base64"), hata => {
                                if (!hata) {
                                    // Dosyayı kapatma
                                    dosyayıKapat(dosyaTanımlayıcı, hata => {
                                        geriCagirma(hata);
                                    });
                                } else {
                                    geriCagirma(hata);
                                }
                            });
                        } else {
                            geriCagirma(hata);
                        }
                    });
                } else {
                    geriCagirma(hata)
                }
            });

        } else {
            geriCagirma(hata);
        }
    });
}

/**
 * Raporu sıkıştırma (.gz.b64 formatına göre) işlemi
 * @param {string} raporKimligi Sıkıştırılacak raporun kimlik bilgisi
 * @param {string} yeniRaporKimligi Sıkıştırılmış raporun kimlik bilgisi
 * @param {function(boolean | NodeJS.ErrnoException, string)} geriCagirma İşlemler bittiği zaman verilen yanıt
 ** arg0: *İşlem sırasında oluşan hatanın açıklaması (hata yoksa false)*
 ** arg0: *Ayrıştırılmış veri*
 */
export function ayrıştır(dosyaKimliği, geriCagirma) {
    const dosyaİsmi = `${dosyaKimliği}.gz.b64`;

    dosyayıOku(`${anaDizin}${dosyaİsmi}`, "utf8", (hata, dizgi) => {
        if (!hata && dizgi) {
            // Sıkıştırılmış veriyi ayrıştırma
            const girişTamponu = Buffer.from(dizgi, "base64");
            gzAyrıştırma(girişTamponu, (hata, çıkışTamponu) => {
                if (!hata && çıkışTamponu) {
                    // Geri cağırma
                    geriCagirma(false, çıkışTamponu.toString());
                } else {
                    geriCagirma(hata);
                }
            });
        } else {
            geriCagirma(hata);
        }
    });
}

/**
 * Rapor dosyalarını kırpma (bütün içeriği bitişik yazma a l i -> ali)
 * @param {string} raporKimligi Kırpılacak rapor kimliği
 * @param {function(boolean | NodeJS.ErrnoException)} geriCagirma İşlemler bittiği zaman verilen yanıt
 ** arg0: *İşlem sırasında oluşan hatanın açıklaması (hata yoksa false)*
 */
export function kırp(raporKimligi, geriCagirma) {
    dosyayıKırp(`${anaDizin}${raporKimligi}.log`, 0, hata => {
        geriCagirma(hata);
    });
}


