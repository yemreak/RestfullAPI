/**
 * API için öncelikli dosya
 * Açılama: ES6 tabanında yazılmış bir API
 * Yazar: YunusEmre
 */

/**
 * Bağımlılıklar
 * -> http ve https; Sunucu oluşturmak için gereklidir.
 * -> url; Sunucunun url'i için gereklidir.
 * -> dizgiÇözücü; ASCI kodlarını çözümlemek için gereklidir.
 * -> yapılandırma; Yapılandırma için gerekli olan, ortam değişkenlerini içerir. [ config.js dosyasındaki ]
 * -> ds; FS, yani file system, dosya işlemleri için gereklidir.
 */
var http = require('http');
var https = require('https')
var url = require('url');
var dizgiÇözücü = require('string_decoder').StringDecoder;
var yapılandırma = require('./config');
var ds = require('fs');

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
    'key': ds.readFileSync('./https/key.pem'),
    'cert': ds.readFileSync('./https/cert.pem')
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
 * Not: Eğer 3000 yerine 500 yazsaydık, locakhost:500 yapacaktık.
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
     * Örnek: {... query: {}, pathname: '/ornek' ... } şeklinde bir url classı
     */
    var ayrıştırılmışUrl = url.parse(istek.url, true);

    /**
     * Sorgu kelimesini (query string) obje olarak almak.
     * Örnek: "curl localhost:3000/foo?test=testtir" ise { test : 'testtir' }
     * Not: "?test=testtir" sorgu dizgisidir.
     */
    var sorguDizgisiObjeleri = ayrıştırılmışUrl.query;

    /**
     * Ayrıştırılan urldeki pathname değişkenindeki değeri yol'a alıyorz.
     * Örnek: 'curl localhost:3000/ornek/test/' => yolu '/ornek/test/'
     * Not: sorgu dizgileri ele alınmaz ( 'curl localhost:3000/ornek?foo=bar' => yolu '/ornek' )
     */
    var yol = ayrıştırılmışUrl.pathname;

    /**
     * Replace içinde verilen işaretler çıkartılarak alınan yol. 
     * Örnek: '/ornek' -> 'ornek' veya '/ornek/test/' -> 'ornek/test/' olarak kırpılmakta. 
     * Not: Sadece ilk karakter kırpılıyor (?)
     */
    var kırpılmışYol = yol.replace(/^\/+|\+$/g, '');

    /**
     * HTTP metodu alma
     * Örnek: GET, POST, PUT, DELETE ...
     */
    var metot = istek.method.toLowerCase();

    /**
     * İsteğin içindeki başlıkları (header keys) obje olarak almak.
     * Not: Postman ile headers sekmesinde gönderilen anahtarları (keys) 
     * ve değerlerini (the value of them) içerir.
     */
    var başlıklar = istek.headers;

    /**
     * ASCI kodlarını çözümlemek için kod çözücü tanımlama
     * Not: 'utf-8' çözümleme yöntemidir
     */
    var kodÇözücü = new dizgiÇözücü('utf-8');
    var tampon = '';

    /**
     * İstek ile data geldiği zaman çalışan metot
     * @param data ASCI kodları
     */
    istek.on('data', function (data) {
        /**
         * ASCI kodlarını 'utf-8' formatında çözümlüyoruz.
         * Ornek: 42 75 -> Bu [ 42 = B, 75 = u]
         */
        tampon += kodÇözücü.write(data);
    });

    istek.on('end', function () {
        /**
         * Son kısmı ekliyoruz.
         * Not: Şu anlık '' (?)
         */
        tampon += kodÇözücü.end();

        /** 
         * İsteğin gideceği işleyiciyi seçme
         * Örnek: yönlendirici[ornek], yönlendirici içindeki ornek adlı anahtarın değerini tutar. [ornek = isleyiciler.örnek]
         */
        var seçilmişİşleyici =
            typeof (yönlendirici[kırpılmışYol]) !== 'undefined' ?
                yönlendirici[kırpılmışYol] : işleyiciler.bulunamadı;



        /**
         * İşleyiciye gönderilen veri objesi oluşturma
         * Örnek: { 'kırpılmışYol' = 'ornek', sorguDizgisiObjeleri = {}, metot = 'post', vs.}
         */
        var veri = {
            'kırpılmışYol': kırpılmışYol,
            'sorguDizgisiObjeleri': sorguDizgisiObjeleri,
            'metot': metot,
            'başlıklar': başlıklar,
            'yükler': tampon
        };

        seçilmişİşleyici(veri, function (durumKodu, yükler) {
            // Durum kodunu kullan veya varsayılanı ele al
            durumKodu = typeof (durumKodu) == 'number' ? durumKodu : 200;

            // Yükleri kullan yada varsayılanı ele al
            yükler = typeof (yükler) == 'object' ? yükler : {};

            // Yükleri dizgi'ye çevirme
            var yükDizgisi = JSON.stringify(yükler);

            /**
             * Döndürülen sonucun içeriğinin JSON olduğunu belirliyoruz.
             */
            yanıt.setHeader('Content-type', 'application/json');

            /**
             * Sonucu döndürme
             */
            yanıt.writeHead(durumKodu);
            yanıt.end(yükDizgisi);


            console.log("Yanıt: ", durumKodu, yükDizgisi);
        });
    });
}

/**
 * İşleyicileri (handlers) tanımlama
 * Örnek: işleyiciler.örnek
 * Not: Buradaki işleyiciler.örnek, yönlendiricilerdeki 'ornek' öğesine atanıyor.
 */
var işleyiciler = {};

işleyiciler.dürt = function(veri, geriÇağırma) {
    geriÇağırma(200);
};

/**
 * İşleyici örneği
 * Örnek: localhost:3000/ornek yazıldığında bu fonksiyon çalışır.
 * Not: ornek, yönlendirici 'nin bir objesidir.
 */
işleyiciler.örnek = function (veri, geriÇağırma) {
    // HTTP durumunu ve yüklerini geri çağırıyoruz.
    geriÇağırma(406, { 'isim': 'başlık örneği' });
};

/**
 * İşleyici bulunamaması durumunda çalışan metod
 * Örnek: localhost:3000/ornek1 yazıldığında bu fonksiyon çalışır. [ornek1 tanımlı değil]
 * Not: ornek1, yönlendirici'de tanımlı olmayan bir objesidir.
 */
işleyiciler.bulunamadı = function (veri, geriÇağırma) {
    // HTTP hata kodunu geri çağırıyoruz.
    geriÇağırma(404);
};

/**
 * İstekler için yönlendirici tanımlama
 * Örnek: localhost:3000/<değişken>
 * Not: Türkçe karakter içeremez :( [Adres çubuğuna yazıldığından dolayı] 
 */
var yönlendirici = {
    // localhost:3000/ornek
    'ornek': işleyiciler.örnek
};