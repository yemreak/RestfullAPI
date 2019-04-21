/**
 * API için öncelikli dosya
 * @description ES5 tabanında yazılmış bir API
 * @author YunusEmre
 */

/**
 * Bağımlılıklar
 * * http ve https; Sunucu oluşturmak için gereklidir.
 * * url; Sunucunun url'i için gereklidir.
 * * dizgiÇözücü; ASCI kodlarını çözümlemek için gereklidir.
 * * yapılandırma; Yapılandırma için gerekli olan, ortam değişkenlerini içerir. [ config.js dosyasındaki ]
 * * ds; FS, yani file system, dosya işlemleri için gereklidir.
 * * testler; Dosya işlemlerini test etmek için gereklidir.
 * * işleyiciler; Yönlendirici için gereklidir.
 * * yardımcılar; Şifreleme işlembi gibi işlemlerde gereklidir.
 */
import { createServer } from "http";
import { createServer as _createServer } from "https";
import { parse } from "url";
import { StringDecoder as dizgiÇözücü } from "string_decoder";
import {
  httpBağlantıNoktası,
  httpsBağlantıNoktası
} from "./kütüphane/yapılandırma";
import { readFileSync } from "fs";
import testler from "./kütüphane/test";
import { jsonuObjeyeDönüştür } from "./kütüphane/yardımcılar";
import { işleyiciAyarla } from "./kütüphane/yönlendirici";

// testler.hepsiniTestEt();
// testler.SMSTesti();

/**
 * HTTP sunucusu oluşturma
 * Not: Sunucu her isteğe string ile karşılık vermeli
 */
const httpSunucu = createServer((istek, yanıt) => {
  birleşikSunucu(istek, yanıt);
});

/**
 * Güvenli sunucu için oluşturulan OpenSSL verilerini tanımlıyoruz.
 * Not: Dosyaların önceden OpenSSl ile oluşturulmuş olması lazım.
 */
const httpsSunucuAyarları = {
  // Dosya okuma [ readFileSync ]
  key: readFileSync("./https/key.pem"),
  cert: readFileSync("./https/cert.pem")
};

/**
 * HTTPS sunucusu oluşturma
 * Not: Sunucu her isteğe string ile karşılık vermeli
 */
const httpsSunucu = _createServer(httpsSunucuAyarları, (istek, yanıt) => {
  birleşikSunucu(istek, yanıt);
});

/**
 * Sunucuyu (HTTP) yapılamdırma dosyasındaki bağlantı noktasından dinliyoruz.
 * Örnek kullanım: curl localhost:3000
 * Not: Eğer 3000 yerine 500 yazsaydık, localhost:500 yapacaktık.
 */
httpSunucu.listen(httpBağlantıNoktası, () => {
  console.log(`Sunucu ${httpBağlantıNoktası} portundan dinleniyor.`);
});

/**
 * Sunucuyu (HTTPS) yapılamdırma dosyasındaki bağlantı noktasından dinliyoruz.
 * Örnek kullanım: curl localhost:3000
 * Not: Eğer 3000 yerine 500 yazsaydık, locakhost:500 yapacaktık.
 */
httpsSunucu.listen(httpsBağlantıNoktası, () => {
  console.log(`Güvenli Sunucu ${httpsBağlantıNoktası} portundan dinleniyor.`);
});

/**
 * HTTP ve HTTPS için ortak işlemlerin olduğu metot
 * @param {string} istek Sunucuya verilen istek
 * @param {string} yanıt Sunucunun verdiği yanıt
 */
const birleşikSunucu = (istek, yanıt) => {
  /**
   * Url ayrıştırma işlemi
   * * Örnek: *{... query: {}, pathname: "/ornek" ... } şeklinde bir url classı*
   */
  const ayrıştırılmışUrl = parse(istek.url, true);

  /**
   * Sorgu kelimesini (query string) obje olarak almak.
   * * Örnek: *"curl localhost:3000/foo?test=testtir" ise { test : "testtir" }*
   * * Not: *"?test=testtir" sorgu dizgisidir.*
   */
  const sorguDizgisiObjeleri = ayrıştırılmışUrl.query;

  /**
   * Ayrıştırılan urldeki pathname değişkenindeki değeri yol"a alıyorz.
   *
   * * Örnek: *"curl localhost:3000/ornek/test/" => yolu "/ornek/test/"*
   * * Not: *sorgu dizgileri ele alınmaz ( "curl localhost:3000/ornek?foo=bar" => yolu "/ornek" )*
   */
  const yol = ayrıştırılmışUrl.pathname;

  /**
   * Replace içinde verilen işaretler çıkartılarak alınan yol.
   * * Örnek: *["/ornek" -> "ornek"] veya ["/ornek/test/" -> "ornek/test/"] olarak kırpılmakta.*
   * * Not: *Sadece ilk karakter kırpılıyor (?)*
   */
  const kırpılmışYol = yol.replace(/^\/+|\+$/g, "");

  /**
   * HTTP metodu alma
   * * Örnek: *GET, POST, PUT, DELETE ...*
   */
  const metot = istek.method.toLowerCase();

  /**
   * İsteğin içindeki başlıkları (header keys) obje olarak almak.
   * * Not: *Postman ile headers sekmesinde gönderilen anahtarları (keys)
   * ve değerlerini (the value of them) içerir.*
   */
  const başlıklar = istek.headers;

  /**
   * ASCI kodlarını çözümlemek için kod çözücü tanımlama
   * * Not: *"utf-8" çözümleme yöntemidir*
   */
  const kodÇözücü = new dizgiÇözücü("utf-8");
  let tampon = "";

  /**
   * İstek ile data geldiği zaman çalışan metot
   * @param data ASCI kodları
   */
  istek.on("data", veri => {
    /**
     * ASCI kodlarını "utf-8" formatında çözümlüyoruz.
     * * Ornek: *42 75 -> Bu [ 42 = B, 75 = u]*
     */
    tampon += kodÇözücü.write(veri);
  });

  istek.on("end", () => {
    /**
     * Son kısmı ekliyoruz.
     * Not: *Şu anlık "" (?)*s
     */
    tampon += kodÇözücü.end();

    /**
     * İşleyiciye gönderilen veri objesi oluşturma
     * * Not: *Her dosyada kullanılan veri objesidir.*
     * * Örnek: *{ "kırpılmışYol" = "ornek", "sorguDizgisiObjeleri" = {}, "metot" = "post",
     *   "yükler" = {"isim" : "Yunus Emre"} [Body içindeki metinler] vs.}*
     */
    const veri = {
      kırpılmışYol: kırpılmışYol,
      sorguDizgisiObjeleri: sorguDizgisiObjeleri,
      metot: metot,
      başlıklar: başlıklar,
      yükler: jsonuObjeyeDönüştür(tampon)
    };

    // İşleyiciyi ayarlıyoruz.
    işleyiciAyarla(kırpılmışYol, seçilmişİşleyici => {
      seçilmişİşleyici(veri, (durumKodu, yükler) => {
        // Durum kodunu kullan veya varsayılanı ele al
        durumKodu = typeof durumKodu === "number" ? durumKodu : 200;

        // Yükleri kullan yada varsayılanı ele al
        yükler = typeof yükler === "object" ? yükler : {};

        // Yükleri dizgi"ye çevirme
        const yükDizgisi = JSON.stringify(yükler);

        // Döndürülen sonucun içeriğinin JSON olduğunu belirliyoruz.
        yanıt.setHeader("Content-type", "application/json");

        // Sonucu döndürme
        yanıt.writeHead(durumKodu);
        yanıt.end(yükDizgisi);

        // Sonucu konsola yazma
        console.log("Yanıt: ", durumKodu, yükDizgisi);
      });
    });
  });
};
