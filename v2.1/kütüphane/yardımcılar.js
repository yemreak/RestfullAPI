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
