/**
 * Girilen URL'e göre doğru sayfaya yönlendirme işlemi
 */

import bulunamadı from "./işleyiciler/bulunamadı";
import örnek from "./işleyiciler/örnek";
import dürt from "./işleyiciler/dürt";
import kullanıcılar from "./işleyiciler/kullanıcılar";
import belirteçler from "./işleyiciler/belirteçler";
import kontroller from "./işleyiciler/kontroller";

/**
 * İstekler için yönlendirici tanımlama
 * * Örnek: *localhost:3000/<değişken> [ <değişken> = { "ornek", "durt", ...} ]*
 * * Not: *Türkçe karakter içeremez :( [Adres çubuğuna yazıldığından dolayı]*
 * * Gerekli Modüller: *işleyiciler.js*
 */
const yönlendirme = {
  bulunamadi: bulunamadı,
  ornek: örnek,
  durt: dürt,
  kullanicilar: kullanıcılar,
  belirtecler: belirteçler,
  kontroller: kontroller
};

/**
 * İsteğin gideceği işleyiciyi seçme
 * * Örnek: *yönlendirici[ornek], yönlendirici içindeki ornek adlı anahtarın değerini tutar. [ornek = isleyiciler.örnek]*
 * @param {string} isleyici Seçilecek işleyicinin ismi
 * @param {function(object):void} geriCagirma Seçilmiş işleyiciyi geri döndürür.
 * * arg0: *function(veri, function(durumKodu, yükler))*
 */
export function işleyiciAyarla(isleyici, geriCagirma) {
  const seçilmişİşleyici =
    typeof yönlendirme[isleyici] !== "undefined"
      ? yönlendirme[isleyici]
      : bulunamadı;

  geriCagirma(seçilmişİşleyici);
}
