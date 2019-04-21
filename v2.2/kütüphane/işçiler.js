/**
 * @todo Yenkimliken adlandır.
 */

import {
    listele as verileriListele,
    oku as verileriOku
} from "./veri";
import { kimlikUzunluğu } from "./yapılandırma";
import { parse as ayrıştır } from "url";
import { request as httpİsteği } from 'http';
import { request as httpsİsteği } from 'https';
import { güncelle as verileriGüncelle } from './veri';
import {
    ilaveEt as raporaİlaveEt,
    listele as raporlarıListele,
    sıkıştır as raporlarıSıkıştırma,
    kırp as raporlarıKırp
} from './rapor';
import { debuglog as hataKaydı } from 'util'

// Hata ayıklama modundaki (debug mode) mesajları göstermek için kullanılacak 
const hataAyıkla = hataKaydı('işçiler');

const işçiler = {};

/**
 * * Not: *Arka plan işlemi olduğu için durum kodu göndermemize veya
 * geri çağırma oluşturumuza gerek yok.*
 */
işçiler.bütünKontrolleriAl = () => {
    hataAyıkla("Kontrol alma sırasındayız..");
    verileriListele("kontroller", (hata, kontrolKimlikleri) => {
        if (!hata && kontrolKimlikleri && kontrolKimlikleri.length > 0) {
            kontrolKimlikleri.forEach(kontrolKimliği => {
                // Her bir kontrolü okuma
                verileriOku("kontroller", kontrolKimliği, (hata, kontrolVerisi) => {
                    if (!hata && kontrolVerisi) {
                        işçiler.kontrolVerisiniOnayla(kontrolVerisi);
                    } else {
                        hataAyıkla("Kontrol verisi okunamadı");
                    }
                });
            });
        } else {
            hataAyıkla("Hata: İşlenecek kontrol bulunamadı :(");
        }
    });
};

işçiler.kontrolVerisiniOnayla = kontrolVerisi => {
    kontrolVerisi = typeof (kontrolVerisi) == "object" &&
        kontrolVerisi !== null
        ? kontrolVerisi
        : {};

    kontrolVerisi.kimlik = typeof (kontrolVerisi.kimlik) == "string" &&
        kontrolVerisi.kimlik.trim().length == kimlikUzunluğu
        ? kontrolVerisi.kimlik.trim()
        : false;

    kontrolVerisi.telefonNo = typeof (kontrolVerisi.telefonNo) == "string" &&
        kontrolVerisi.telefonNo.trim().length == 10
        ? kontrolVerisi.telefonNo.trim()
        : false;

    kontrolVerisi.protokol = typeof (kontrolVerisi.protokol) == "string" &&
        ["http", "https"].indexOf(kontrolVerisi.protokol) > -1
        ? kontrolVerisi.protokol.trim()
        : false;

    kontrolVerisi.url = typeof (kontrolVerisi.url) == "string" &&
        kontrolVerisi.url.trim().length > 0
        ? kontrolVerisi.url.trim()
        : false;

    kontrolVerisi.metot = typeof (kontrolVerisi.metot) == "string" &&
        ["post", "get", "put", "delete"].indexOf(kontrolVerisi.metot) > -1
        ? kontrolVerisi.metot.trim()
        : false;

    kontrolVerisi.başarıKodları = typeof (kontrolVerisi.başarıKodları) == "object" &&
        kontrolVerisi.başarıKodları instanceof Array &&
        kontrolVerisi.başarıKodları.length > 0
        ? kontrolVerisi.başarıKodları
        : false;

    kontrolVerisi.zamanAşımı = typeof (kontrolVerisi.zamanAşımı) == "number" &&
        kontrolVerisi.zamanAşımı % 1 === 0 &&
        kontrolVerisi.zamanAşımı >= 1 &&
        kontrolVerisi.zamanAşımı <= 5
        ? kontrolVerisi.zamanAşımı
        : false;

    // Aktif mi pasif mi kontrolü
    kontrolVerisi.durum = "string" &&
        ["post", "get", "put", "delete"].indexOf(kontrolVerisi.durum) > -1
        ? kontrolVerisi.durum.trim()
        : "down";

    kontrolVerisi.sonKontrol = typeof (kontrolVerisi.sonKontrol) == "number" &&
        kontrolVerisi.sonKontrol > 0
        ? kontrolVerisi.url.trim()
        : false;

    // Eğer bütün kontroller geçilirse, bir sonraki adıma geçilecek
    if (
        kontrolVerisi.kimlik &&
        kontrolVerisi.telefonNo &&
        kontrolVerisi.protokol &&
        kontrolVerisi.url &&
        kontrolVerisi.metot &&
        kontrolVerisi.başarıKodları &&
        kontrolVerisi.zamanAşımı
    ) {
        işçiler.kontrolEt(kontrolVerisi);
    } else {
        hataAyıkla("Hata: Kontrollerden biri düzgün formatlanmamış, bu adım atlanıyor.");
    }

}

işçiler.kontrolEt = kontrolVerisi => {
    // Kontrol sonucu için obje tanımlıyoruz.
    const kontrolSonucu = {
        hata: false,
        yanıtKodu: false
    }

    // Sonucun gönderip gönderilmediği bilgisi
    let sonuçGönderildi = false;

    // Kontrol verisinden yolu ve sunucu adını ayrıştırıyoruz.
    const ayrıştırılmışUrl = ayrıştır(`${kontrolVerisi.protokol}://${kontrolVerisi.url}`, true);
    const barındırıcıİsmi = ayrıştırılmışUrl.hostname;
    // Pathname yerine path kullanıyoruz, çünkü bize sorgu (query) dizgisi lazım.
    const yol = ayrıştırılmışUrl.path;

    // İsteği oluşturma (Türkçeleştirilemez ögeler sabittir.)
    const istekDetayları = {
        protokol: kontrolVerisi.protokol + ":",
        hostname: barındırıcıİsmi,
        method: kontrolVerisi.metot.toUpperCase(),
        path: yol,
        timeout: kontrolVerisi.zamanAşımı * 1000
    };

    // İstek objesini HTTP / HTTP modülünde oluşturuyoruz
    const _istekTürü = kontrolVerisi.protokol == "http"
        ? httpİsteği
        : httpsİsteği;

    const istek = _istekTürü(istekDetayları, yanıt => {
        // Verilen yanıtım durum kodunu kontrol sonucumuza ekliyoruz
        kontrolSonucu.yanıtKodu = yanıt.statusCode;

        if (!sonuçGönderildi) {
            işçiler.kontrolSonucunuİşle(kontrolVerisi, kontrolSonucu);
            sonuçGönderildi = true;
        }
    });

    // Hata durumunda yapılacak olaylar
    istek.on("error", hata => {
        // Kontrol sonucunu güncelleyoruz
        kontrolSonucu.hata = {
            hata: true,
            bilgi: hata
        };

        işçiler.kontrolSonucunuİşle(kontrolVerisi, kontrolSonucu);
    });

    // Süre dolduğunda yapılacak olaylar
    istek.on("timeout", hata => {
        // Kontrol sonucunu güncelleyoruz
        kontrolSonucu.hata = {
            hata: true,
            bilgi: "süre doldu"
        };

        if (!sonuçGönderildi) {
            işçiler.kontrolSonucunuİşle(kontrolVerisi, kontrolSonucu);
            sonuçGönderildi = true;
        }
    });

    // İsteği bitiriyoruz
    istek.end();
}

/**
 * Kontrol sonucunu işleme, eğer gerekliyse güncelleme ve gerekli uyarıları tetikleme
 * * Not: *Sadece durumun değişmesi olayını bildirir.*
 */
işçiler.kontrolSonucunuİşle = (kontrolVerisi, kontrolSonucu) => {
    // hataAyıkla(`Durum Kodu: ${kontrolSonucu.yanıtKodu}`);

    // Kontrolün akitf veya pasif olduğuna karar verme
    const durum = !kontrolSonucu.hata &&
        kontrolSonucu.yanıtKodu &&
        kontrolVerisi.başarıKodları.indexOf(kontrolSonucu.yanıtKodu) > -1
        ? "aktif"
        : "pasif";

    // Değişimden emin olma ve bildirim verme
    const bildirilmeli = kontrolVerisi.sonKontrol &&
        kontrolVerisi.durum !== durum
        ? true
        : false;

    const kontrolünVakti = Date.now();

    // Sonuçları raporlama
    işçiler.raporla(kontrolVerisi, kontrolSonucu, durum, bildirilmeli, kontrolünVakti);

    // Kontrol verisini güncelleme
    const yeniKontrolVerisi = kontrolVerisi;
    yeniKontrolVerisi.durum = durum;
    yeniKontrolVerisi.sonKontrol = Date.now();

    // Kontrol dosyasını güncelleme
    verileriGüncelle("kontroller", yeniKontrolVerisi.kimlik, yeniKontrolVerisi, hata => {
        if (!hata) {
            // Yeni kontorl verisi işlemin bir sonraki adımına aktarma
            if (bildirilmeli) {
                işçiler.kullanıcıyaBildir(yeniKontrolVerisi);
            } else {
                hataAyıkla("Kontrol sonucu eskisinden farklı değil, kullanıcıya bildirim yapılmadı ;)");
            }
        } else {
            hataAyıkla("Kontrollerden birini güncellerken hata oluştu :(");
        }
    });
}

/**
 * Kullanıcıya durum değişikliğini bildirir
 */
işçiler.kullanıcıyaBildir = kontrolVerisi => {
    const msj = `Uyarı: ${kontrolVerisi.metot} kontrolü için ${kontrolVerisi.protokol}://${kontrolVerisi.url} şu anlık ile ${kontrolVerisi.durum}`;
    hataAyıkla(`Kullanıcıya "${msj}" bildirildi.`);

}

/**
 * Sonuçları raporlama (kayıt altına alma) [log]
 * @param {object} kontrolVerisi Raporlanacak kontrol verisi
 * @param {object} kontrolSonucu Raporlanacak kontrol verisinin kontrol sonucu
 * @param {string} durum Raporlanacak kontrolün *aktif* veya *pasif* olma durumu
 * @param {boolean} bildirilmeli Durum değişikliğinden dolayı kullanıcı uyarılmalı mı bilgisi
 * @param {string} kontrolünVakti Raporlanacak kontrolün yapıldığı vakit
 */
işçiler.raporla = (kontrolVerisi, kontrolSonucu, durum, uyarı, kontrolünVakti) => {
    const kayıtVerisi = {
        kontrol: kontrolVerisi,
        sonuç: kontrolSonucu,
        durum: durum,
        uyarı: uyarı,
        zaman: kontrolünVakti
    };

    // Veriyi dizgiye dönüştürme
    const raporDizgisi = JSON.stringify(kayıtVerisi);

    // Rapor dosyasını isminin ayarlanması
    const raporDosyasıİsmi = kontrolVerisi.kimlik;

    raporaİlaveEt(raporDosyasıİsmi, raporDizgisi, hata => {
        if (!hata) {
            hataAyıkla("Raporlama işlemi başarılı :)");
        } else {
            hataAyıkla("Raporlama işlemi başarısız :(");
        }
    });

}

/**
 * İşçilerin her dakikada başı çalışma döngüsü
 */
işçiler.tekrarla = () => {
    // Dakikalık tekrarlayıcı tanımlıyoruz
    setInterval(() => {
        işçiler.bütünKontrolleriAl();
    }, 1000 * 60);
};

işçiler.günlükRaporla = () => {
    // Günlük tekrarlayıcı tanımlıyoruz
    setInterval(() => {
        işçiler.bütünKontrolleriAl();
    }, 1000 * 60 * 60 * 24);
}

işçiler.raportlarıSıkıştır = () => {
    // Sıkıştırılmamış bütün raporları görüntüleme 
    raporlarıListele(false, (hata, raporlar) => {
        if (!hata && raporlar && raporlar.length > 0) {
            raporlar.forEach(raporAdı => {
                // Raporları farklı bir dosyada sıkıştırma
                var raporKimliği = raporAdı.replace(".log", "");
                var yeniRaporKimliği = `${raporKimliği}-${Date.now()}`;

                raporlarıSıkıştırma(raporKimliği, yeniRaporKimliği, hata => {
                    if (!hata) {
                        raporlarıKırp(raporKimliği, hata => {
                            if (!hata) {
                                hataAyıkla("Rapor sıkıştırma başarılı :)");
                            } else {
                                hataAyıkla("Raporları kıprmada hata meydana geldi :(", hata);
                            }
                        })
                    } else {
                        hataAyıkla("Raporları sıkıştımada hata meydana geldi :(");
                    }
                });
            });
        } else {
            hataAyıkla("Hata: Sıkıştırılacak rapor bilgisi bulunamadı :(");
        }
    });
}

işçiler.raporSıkıştmaDöngüsü = () => {
    // Günlük tekrarlayıcı tanımlıyoruz
    setInterval(() => {
        işçiler.raportlarıSıkıştır();
    }, 1000 * 60 * 60 * 24);
}

// İşçiler'i başlatma
export function başlat() {
    // Bütün kontrolleri hızlı bir şekilde derliyoruz.
    işçiler.bütünKontrolleriAl();

    // Sürekli olarak terkar ediyoruz.
    işçiler.tekrarla();

    // Bütün kayıtları sıkıştırıyoruz
    işçiler.raportlarıSıkıştır();

    // Günlük olarak tekrarlıyoruz.
    işçiler.raporSıkıştmaDöngüsü();

}

export default işçiler;