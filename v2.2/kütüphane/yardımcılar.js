/**
 * Yardımcı metotlar
 * Açıklama: Şifreleme gibi yardımcı metodlar bulunur
 */

/**
 * Bağımlılıklar
 * * kripto; *Şifreleme metodları için*
 * * yapılandırma; *Ana program yapılandırma dosyası (şifreleme için)*
 */
import { createHash } from "crypto";
import { şifrelemeGizliliği, twilio } from "./yapılandırma";
import { stringify } from "querystring";
import { request } from "https";
import { join as yolaKat } from 'path';
import { readFile as dosyayıOku } from 'fs';
import { evrenselKalıplar } from './yapılandırma';

/**
 * Şifreleme metodu
 * @param {string} dizgi Şifrelenecek dizgi
 */
export function şifreleme(dizgi) {
  if (typeof dizgi === "string" && dizgi.length > 0) {
    return createHash("sha256", şifrelemeGizliliği)
      .update(dizgi)
      .digest("hex");
  } else {
    return false;
  }
}

/**
 * Json'u objeye dönüştürme (parsing)
 * @param {string} dizgi Dönüştürülecek json
 * @return {object} JSON objesi
 */
export function jsonuObjeyeDönüştür(dizgi) {
  try {
    var obje = JSON.parse(dizgi);
    return obje;
  } catch (e) {
    return {};
  }
}

/**
 * Rastgele bir dizgi oluşturma
 * @param {number} dizgiUzunlugu Oluşturulacak rastgele dizginin uzunluğu
 */
export function rastgeleDizgiOluştur(dizgiUzunlugu) {
  dizgiUzunlugu =
    typeof dizgiUzunlugu == "number" && dizgiUzunlugu > 0
      ? dizgiUzunlugu
      : false;

  if (dizgiUzunlugu) {
    // Türkçe karakter içeremez, adres çubuğuna yazılmaktadır.
    const olasıKarakterler = "abcdefghijklmnoprstuvwxyz0123456789";
    let dizgi = "";

    for (let i = 1; i <= dizgiUzunlugu; i++) {
      let rastgeleKarakter = olasıKarakterler.charAt(
        Math.floor(Math.random() * olasıKarakterler.length)
      );
      dizgi += rastgeleKarakter;
    }
    return dizgi;
  } else {
    return false;
  }
}

/**
 * Twilio API üzerinden SMS gönderme
 * @param {number} telefonNo SMS gönderilecek telefon no
 * @param {string} mesaj Göderilecek SMS'in metni (içeriği)
 * @param {function(boolean | object):void} geriCagirma İşlem sırasında hata meydana gelirse true
 * * arg0: HTTP varsayılan durum kodları | Hata durumunda açıklamalar
 */
export function twilioSMSGönder(telefonNo, mesaj, geriCagirma) {
  // Parametreleri kontrol ediyoruz.
  telefonNo =
    typeof telefonNo == "string" && telefonNo.trim().length == 10
      ? telefonNo
      : false;

  mesaj =
    typeof mesaj == "string" &&
      mesaj.trim().length > 0 &&
      mesaj.trim().length < 1600
      ? mesaj
      : false;

  if (telefonNo && mesaj) {
    // Yük bilgilerini yapılandırma (Türkçeleştirilemez, kaşrı sunucuya gönderilecektir.)
    const yükler = {
      From: twilio.telefon,
      To: "+90" + telefonNo,
      Body: mesaj
    };
    // Objeyi stringe çeviriyoruz
    const yükDizgisi = stringify(yükler);

    const istekDetayları = {
      protocol: "https:",
      host: "api.twilio.com",
      method: "post",
      path: "/2010-04-01/Accounts/" + twilio.accountSid + "/Messages.json",
      auth: twilio.accountSid + ":" + twilio.authToken,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": Buffer.byteLength(yükDizgisi)
      }
    };

    // İsteği örneklendiriyoruz
    const istek = request(istekDetayları, istek => {
      // Durum kodunu alıyoruz
      const durumKodu = istek.statusCode;
      // Eğer işlemler düzgün çalıştıysa geri bildirim veriyoruz
      if (durumKodu != 200 && durumKodu != 201) {
        geriCagirma("Durum kodu: " + durumKodu);
      } else {
        geriCagirma(false);
      }
    });

    // Hata durumunda isteği kesiyoruz ki hata fırlatmasın (thrown)
    istek.on("error", hata => {
      geriCagirma(hata);
    });

    // Yükleri yazıyoruz
    istek.write(yükDizgisi);

    // İsteği kapatıyoruz
    istek.end();
  } else {
    geriCagirma("Verilen bilgiler eksik veya kullanışsız :(");
  }
}

/**
 * GUI için gereken HTML kalıplarını geri cağırır
 * @param {string} kalıpIsmi Kalıbı alınacak GUI'nin adı
 * @param {object} veri Ek anahtar verisi
 * * Örneğin: *{başlık.konu} için veri[baslık.konu]* 
 * @param {function (string | boolean , string): void} geriCagirma İşlemler bittiği zaman verilen yanıt
 ** arg0: *İşlem sırasında oluşan hatanın açıklaması (hata yoksa false)*
 ** arg0: *İstenen sitenin kalıbı*
 */
export function kalıpAl(kalıpIsmi, veri, geriCagirma) {
  // Kalıp ismini kotrol etme
  kalıpIsmi = typeof (kalıpIsmi) == 'string' && kalıpAl.length > 0
    ? kalıpIsmi
    : false;

  if (kalıpIsmi) {
    var kalıpDizini = yolaKat(__dirname, '/../kalıplar/');
    dosyayıOku(`${kalıpDizini}${kalıpIsmi}.html`, 'utf8', (hata, dizgi) => {
      if (!hata && dizgi && dizgi.length > 0) {
        // Şekillendirilmiş dizgiyi geri çağırma
        geriCagirma(false, iliştir(dizgi, veri));
      } else {
        geriCagirma('Kalıp bulunamadı :(');
      }
    });
  } else {
    geriCagirma('Geçerli bir kalıp ismi girilmedi :(');
  }
}

/**
 * GUI için gereken HTML kalıplarını alt ve üst bilgi ile geri cağırır
 * @param {string} kalıpIsmi Kalıbı alınacak GUI'nin adı
 * @param {object} veri Ek anahtar verisi
 * * Örneğin: *{başlık.konu} için veri[baslık.konu]* 
 * @param {function (string | boolean , string): void} geriCagirma İşlemler bittiği zaman verilen yanıt
 ** arg0: *İşlem sırasında oluşan hatanın açıklaması (hata yoksa false)*
 ** arg0: *İstenen sitenin kalıbı*
 */
export function evrenselKalıplarıAl(dizgi, veri, geriCagirma) {
  // Verileri kontrol etme
  dizgi = typeof (dizgi) == 'string' && dizgi.length > 0
    ? dizgi
    : '';
  veri = typeof (veri) == 'object' && veri != null
    ? veri
    : {};

  kalıpAl('_üstbilgi', veri, (hata, üstDizgi) => {
    if (!hata && üstDizgi) {
      // Alt bilgiyi alma
      kalıpAl('_altbilgi', veri, (hata, altDizgi) => {
        if (!hata && altDizgi) {
          const tamDizgi = üstDizgi + dizgi + altDizgi;
          geriCagirma(false, tamDizgi);
        } else {
          geriCagirma('Altbilgi kalıbı bulunamadı :(');
        }
      });
    } else {
      geriCagirma('Üstbilgi kalıbı bulunamadı :(');
    }
  });
}

/**
 * Verilen dizgiyi ve veri objesini alıp, içindeki tüm anahtarlara uygun kelimeleri yerleştirir.
 * @param {stirng} dizgi Site kalıbı
 * @param {object} veri Ek anahtar verisi 
 */
export function iliştir(dizgi, veri) {
  // Verileri kontrol etme
  dizgi = typeof (dizgi) == 'string' && dizgi.length > 0
    ? dizgi
    : '';
  veri = typeof (veri) == 'object' && veri !== null
    ? veri
    : {};

  // Yapılandırma dosyasındaki anahtar değerleri alıyoruz.
  for (let anahtarİsmi in evrenselKalıplar) {
    if (evrenselKalıplar.hasOwnProperty(anahtarİsmi)) {
      // Anahtarları veri objelerine kayıt ediyoruz
      veri[`evrensel.${anahtarİsmi}`] = evrenselKalıplar[anahtarİsmi];
    }
  }

  // Her bir anahtar değeri için uygun değerleri yazıyoruz.
  for (let anahtar in veri) {
    if (veri.hasOwnProperty(anahtar) && typeof (veri[anahtar]) == 'string') {
      const eskiDizgi = `{${anahtar}}`;
      const yeniDizgi = veri[anahtar];

      // Eski dzigiyi yenisiyle değiştiriyoruz.
      dizgi = dizgi.replace(eskiDizgi, yeniDizgi);
    }
  }

  return dizgi;
}

/**
 * Genel klasörü içindeki statik varlıkları geri cağırma
 * @param {string} dosyaIsmi İstenen dosyanın ismi
 * @param {function (string | boolean , string): void} geriCagirma İşlemler bittiği zaman verilen yanıt
 ** arg0: *İşlem sırasında oluşan hatanın açıklaması (hata yoksa false)*
 ** arg0: *İstenen sitenin kalıbı*
 */
export function statikVarlıklarıAl(dosyaIsmi, geriCagirma) {
  // Değişkeni kontrol ediyoruz ve gerekirse şekillendiriyoruz
  dosyaIsmi = typeof (dosyaIsmi) == 'string' && dosyaIsmi.length > 0
    ? dosyaIsmi
    : false;

    if (dosyaIsmi) {
      var genelDizin = yolaKat(__dirname, '/../genel/');
      dosyayıOku(`${genelDizin}${dosyaIsmi}`, (hata, veri) => {
        if (!hata && veri) {
          geriCagirma(false, veri);
        } else {
          geriCagirma('Dosya bulunamadı :(');
        }
      });
    } else {
      geriCagirma('Geçerli bir dosya ismi girilmedi :(');
    }
}
