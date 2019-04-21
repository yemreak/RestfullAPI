/**
 * İşleyiciler
 * Açıklama:
 * Tarih: 13 / 8 / 2018
 */

/**
 * Bağımlılıklar
 */
var kullanıcılar = require("./işleyiciler/kullanıcılar");
var belirteçler = require("./işleyiciler/belirteçler");
var kontroller = require("./işleyiciler/kontroller");

/**
 * İşleyicileri (handlers) tanımlama
 * Örnek: işleyiciler.örnek
 *
 * Not: Buradaki işleyiciler.örnek, yönlendiricilerdeki "ornek" öğesine atanıyor.
 */
var işleyiciler = {};

işleyiciler.kullanıcılar = kullanıcılar;
işleyiciler.belirteçler = belirteçler;
işleyiciler.kontroller = kontroller;

/**
 * İşleyiciyi dürtme
 * 
 * Örnek: localhost:3000/durt yazıldığında bu fonksiyon çalışır. (yönlendirici ile, index.js)
 *
 * @param {object} veri Index.js"te tanımlanan veri objesidir. İstekle gelir.
 * @param {function(number, object):void} geriCagirma İşlemler bittiği zaman verilen yanıt
 ** arg0: HTTP varsayılan durum kodları
 ** arg1: Ek bilgiler, açıklamalar
 */
işleyiciler.dürt = function (veri, geriCagirma) {
    geriCagirma(200);
};

/**
 * İşleyici örneği
 * 
 * Örnek: localhost:3000/ornek yazıldığında bu fonksiyon çalışır.
 * 
 * Not: ornek, yönlendirici "nin bir objesidir.
 * 
 * @param {object} veri Index.js"te tanımlanan veri objesidir. İstekle gelir.
 * @param {function(number, object):void} geriCagirma İşlemler bittiği zaman verilen yanıt
 ** arg0: HTTP varsayılan durum kodları
 ** arg1: Ek bilgiler, açıklamalar 
 */
işleyiciler.örnek = function (veri, geriCagirma) {
    // HTTP durumunu ve yüklerini geri çağırıyoruz.
    geriCagirma(406, { "isim": "başlık örneği" });
};

/**
 * İşleyici bulunamaması durumunda çalışan metod
 ** Örnek: localhost:3000/ornek1 yazıldığında bu fonksiyon çalışır. [ornek1 tanımlı değil]
 ** Not: ornek1, yönlendirici"de tanımlı olmayan bir objesidir.
 * @param {object} veri Index.js"te tanımlanan veri objesidir. İstekle gelir.
 * @param {function(number, object):void} geriCagirma İşlemler bittiği zaman verilen yanıt
 * * arg0: HTTP varsayılan durum kodları
 * * arg1: Ek bilgiler, açıklamalar
 */
işleyiciler.bulunamadı = function (veri, geriCagirma) {
    // HTTP hata kodunu geri çağırıyoruz.
    geriCagirma(404, { "bilgi": "Aranan sayfa bulunamadı :(" });
};


module.exports = işleyiciler;
