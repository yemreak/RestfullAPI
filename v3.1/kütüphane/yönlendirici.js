/**
 * Girilen URL'e göre doğru sayfaya yönlendirme işlemi
 */
import kullanıcılar from './işleyiciler/kullanıcılar';
import belirteçler from './işleyiciler/belirteçler';
import kontroller from './işleyiciler/kontroller';
import sekmeİkonu from './işleyiciler/sekme-ikonu';
import genel from './işleyiciler/genel';

// Kalıp İşleyicileri
import indeks from "./işleyiciler/kalıpİşleyiciler/indeks";
import kontrolOluştur from "./işleyiciler/kalıpİşleyiciler/kontrolOluştur";
import kontrolleriListele from "./işleyiciler/kalıpİşleyiciler/kontrolleriListele";
import kontrolDüzenle from "./işleyiciler/kalıpİşleyiciler/kontrolDüzenle";
import hesapSil from "./işleyiciler/kalıpİşleyiciler/hesapSil";
import hesapOluştur from "./işleyiciler/kalıpİşleyiciler/hesapOluştur";
import oturumOluştur from "./işleyiciler/kalıpİşleyiciler/oturumOluştur";
import oturumSil from "./işleyiciler/kalıpİşleyiciler/oturumSil";
import hesapDüzenle from "./işleyiciler/kalıpİşleyiciler/hesapDüzenle";
import bulunamadı from "./işleyiciler/kalıpİşleyiciler/bulunamadı";
import örnek from "./işleyiciler/kalıpİşleyiciler/örnek";
import dürt from "./işleyiciler/kalıpİşleyiciler/dürt";

// Hata ayıklama
import { debuglog as hataKaydı } from "util";

// Hata ayıklama modundaki (debug mode) mesajları göstermek için kullanılacak
const hataAyıkla = hataKaydı("genel");

/**
 * İstekler için yönlendirici tanımlama
 * * Örnek: *localhost:3000/<değişken> [ <değişken> = { "ornek", "durt", ...} ]*
 * * Not: *Türkçe karakter içeremez :( [Adres çubuğuna yazıldığından dolayı]*
 * * Gerekli Modüller: *işleyiciler.js*
 */
const yönlendirme = {
  "": indeks,
  bulunamadi: bulunamadı,
  ornek: örnek,
  durt: dürt,
  "oturum/olustur": oturumOluştur,
  "oturum/sil": oturumSil,
  "hesap/olustur": hesapOluştur,
  "hesap/duzenle": hesapDüzenle,
  "hesap/sil": hesapSil,
  "kontrol/olustur": kontrolOluştur,
  "kontrol/duzenle": kontrolDüzenle,
  "kontroller/hepsi": kontrolleriListele,
  "api/kullanicilar": kullanıcılar,
  "api/belirtecler": belirteçler,
  "api/kontroller": kontroller,
  "sekme-ikonu.ico": sekmeİkonu,
  genel: genel
};

/**
 * İsteğin gideceği işleyiciyi seçme
 * * Örnek: *yönlendirici[ornek], yönlendirici içindeki ornek adlı anahtarın değerini tutar. [ornek = isleyiciler.örnek]*
 * @param {string} isleyici Seçilecek işleyicinin ismi
 * @param {function(object):void} geriCagirma Seçilmiş işleyiciyi geri döndürür.
 * * arg0: *function(veri, function(durumKodu, yükler))*
 */
export function işleyiciAyarla(isleyici, geriCagirma) {
  // Eğer verilen işleyici mevcutsa onu, değilse bulunmadı işleyicisini seçiyoruz
  let seçilmişİşleyici =
    typeof yönlendirme[isleyici] !== "undefined"
      ? yönlendirme[isleyici]
      : bulunamadı;

  // Eğer genel varlıkları işaret ediyorsa genel varlıkları gösteren işleyiciyi ele alıyoruz
  seçilmişİşleyici = isleyici.indexOf("genel/") > -1 ? genel : seçilmişİşleyici;

  hataAyıkla(seçilmişİşleyici);
  geriCagirma(seçilmişİşleyici);
}
