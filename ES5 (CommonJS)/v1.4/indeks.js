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
var http = require("http");
var https = require("https")
var url = require("url");
var dizgiÇözücü = require("string_decoder").StringDecoder;
var yapılandırma = require("./kütüphane/yapılandırma");
var ds = require("fs");
var testler = require("./kütüphane/test");
var yardımcılar = require("./kütüphane/yardımcılar");
var yönlendirici = require("./kütüphane/yönlendirici");

// testler.hepsiniTestEt();
// testler.SMSTesti();

/**
 * HTTP sunucusu oluşturma
 * Not: Sunucu her isteğe string ile karşılık vermeli
 */
var httpSunucu = http.createServer(function (istek, yanıt) {
    birleşikSunucu(istek, yanıt);
});

/**
 * Güvenli sunucu için oluşturulan OpenSSL verilerini tanımlıyoruz.
 * Not: Dosyaların önceden OpenSSl ile oluşturulmuş olması lazım.
 */
var httpsSunucuAyarları = {
    // Dosya okuma [ readFileSync ]
    "key": ds.readFileSync("./https/key.pem"),
    "cert": ds.readFileSync("./https/cert.pem")
};

/**
 * HTTPS sunucusu oluşturma
 * Not: Sunucu her isteğe string ile karşılık vermeli
 */
var httpsSunucu = https.createServer(httpsSunucuAyarları, function (istek, yanıt) {
    birleşikSunucu(istek, yanıt);
});

/**
 * Sunucuyu (HTTP) yapılamdırma dosyasındaki bağlantı noktasından dinliyoruz.
 * Örnek kullanım: curl localhost:3000 
 * Not: Eğer 3000 yerine 500 yazsaydık, localhost:500 yapacaktık.
 */
httpSunucu.listen(yapılandırma.httpBağlantıNoktası, function () {
    console.log("Sunucu " + yapılandırma.httpBağlantıNoktası + " portundan dinleniyor.");
});

/**
 * Sunucuyu (HTTPS) yapılamdırma dosyasındaki bağlantı noktasından dinliyoruz.
 * Örnek kullanım: curl localhost:3000 
 * Not: Eğer 3000 yerine 500 yazsaydık, locakhost:500 yapacaktık.
 */
httpsSunucu.listen(yapılandırma.httpsBağlantıNoktası, function () {
    console.log("Güvenli Sunucu " + yapılandırma.httpsBağlantıNoktası + " portundan dinleniyor.");
});

/**
 * HTTP ve HTTPS için ortak işlemlerin olduğu metot
 * @param {string} istek Sunucuya verilen istek
 * @param {string} yanıt Sunucunun verdiği yanıt
 */
var birleşikSunucu = function (istek, yanıt) {
    /**
     * Url ayrıştırma işlemi
     * * Örnek: *{... query: {}, pathname: "/ornek" ... } şeklinde bir url classı*
     */
    var ayrıştırılmışUrl = url.parse(istek.url, true);

    /**
     * Sorgu kelimesini (query string) obje olarak almak.
     * * Örnek: *"curl localhost:3000/foo?test=testtir" ise { test : "testtir" }*
     * * Not: *"?test=testtir" sorgu dizgisidir.*
     */
    var sorguDizgisiObjeleri = ayrıştırılmışUrl.query;

    /**
     * Ayrıştırılan urldeki pathname değişkenindeki değeri yol"a alıyorz. 
     * 
     * * Örnek: *"curl localhost:3000/ornek/test/" => yolu "/ornek/test/"*
     * * Not: *sorgu dizgileri ele alınmaz ( "curl localhost:3000/ornek?foo=bar" => yolu "/ornek" )*
     */
    var yol = ayrıştırılmışUrl.pathname;

    /**
     * Replace içinde verilen işaretler çıkartılarak alınan yol. 
     * * Örnek: *["/ornek" -> "ornek"] veya ["/ornek/test/" -> "ornek/test/"] olarak kırpılmakta.*
     * * Not: *Sadece ilk karakter kırpılıyor (?)*
     */
    var kırpılmışYol = yol.replace(/^\/+|\+$/g, "");

    /**
     * HTTP metodu alma
     * * Örnek: *GET, POST, PUT, DELETE ...*
     */
    var metot = istek.method.toLowerCase();

    /**
     * İsteğin içindeki başlıkları (header keys) obje olarak almak.
     * * Not: *Postman ile headers sekmesinde gönderilen anahtarları (keys) 
     * ve değerlerini (the value of them) içerir.*
     */
    var başlıklar = istek.headers;

    /**
     * ASCI kodlarını çözümlemek için kod çözücü tanımlama
     * * Not: *"utf-8" çözümleme yöntemidir*
     */
    var kodÇözücü = new dizgiÇözücü("utf-8");
    var tampon = "";

    /**
     * İstek ile data geldiği zaman çalışan metot
     * @param data ASCI kodları
     */
    istek.on("data", function (veri) {
        /**
         * ASCI kodlarını "utf-8" formatında çözümlüyoruz.
         * * Ornek: *42 75 -> Bu [ 42 = B, 75 = u]*
         */
        tampon += kodÇözücü.write(veri);
    });

    istek.on("end", function () {
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
        var veri = {
            "kırpılmışYol": kırpılmışYol,
            "sorguDizgisiObjeleri": sorguDizgisiObjeleri,
            "metot": metot,
            "başlıklar": başlıklar,
            "yükler": yardımcılar.jsonuObjeyeDönüştür(tampon)
        };


        // İşleyiciyi ayarlıyoruz.
        yönlendirici.işleyiciAyarla(kırpılmışYol, function (seçilmişİşleyici) {
            seçilmişİşleyici(veri, function (durumKodu, yükler) {
                // Durum kodunu kullan veya varsayılanı ele al
                durumKodu = typeof (durumKodu) === "number" ? durumKodu : 200;

                // Yükleri kullan yada varsayılanı ele al
                yükler = typeof (yükler) === "object" ? yükler : {};

                // Yükleri dizgi"ye çevirme
                var yükDizgisi = JSON.stringify(yükler);

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
}