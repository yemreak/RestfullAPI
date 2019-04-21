/**
 * Sunucuda yapılacak görevler
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
import {
    createServer
} from "http";
import {
    createServer as _createServer
} from "https";
import {
    parse
} from "url";
import {
    StringDecoder as dizgiÇözücü
} from "string_decoder";
import {
    httpBağlantıNoktası,
    httpsBağlantıNoktası
} from "./yapılandırma";
import {
    readFileSync as dosyayıSenkOku
} from "fs";
import testler from "./test";
import {
    jsonuObjeyeDönüştür,
    twilioSMSGönder
} from "./yardımcılar";
import {
    işleyiciAyarla
} from "./yönlendirici";
import {
    join as yoluKat
} from "path";
import { debuglog as hataKaydı } from 'util'

// Hata ayıklama modundaki (debug mode) mesajları göstermek için kullanılacak 
const hataAyıkla = hataKaydı('sunucu');

const sunucu = {};

/**
 * HTTP sunucusu oluşturma
 * Not: Sunucu her isteğe string ile karşılık vermeli
 */
sunucu.httpSunucu = createServer((istek, yanıt) => {
    sunucu.birleşikSunucu(istek, yanıt);
});

/**
 * Güvenli sunucu için oluşturulan OpenSSL verilerini tanımlıyoruz.
 * Not: Dosyaların önceden OpenSSl ile oluşturulmuş olması lazım.
 */
sunucu.httpsSunucuAyarları = {
    // Dosya okuma [ dosyayıSenkOku ]
    key: dosyayıSenkOku(yoluKat(__dirname, "/../https/key.pem")),
    cert: dosyayıSenkOku(yoluKat(__dirname, "/../https/cert.pem"))
};

/**
 * HTTPS sunucusu oluşturma
 * Not: Sunucu her isteğe string ile karşılık vermeli
 */
sunucu.httpsSunucu = _createServer(sunucu.httpsSunucuAyarları, (istek, yanıt) => {
    sunucu.birleşikSunucu(istek, yanıt);
});

/**
 * HTTP ve HTTPS için ortak işlemlerin olduğu metot
 * @param {string} istek Sunucuya verilen istek
 * @param {string} yanıt Sunucunun verdiği yanıt
 */
sunucu.birleşikSunucu = (istek, yanıt) => {
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
            seçilmişİşleyici(veri, (durumKodu, yükler, içerikTipi) => {
                // Durum kodunu kullan veya varsayılanı ele al
                durumKodu = typeof durumKodu === "number"
                    ? durumKodu
                    : 200;

                // İçerik tipini kontrol etme
                içerikTipi = typeof (içerikTipi) == 'string'
                    ? içerikTipi
                    : 'json';


                let yükDizgisi = '';

                // İçerik tipine göre yanıtın türünü belirleme
                if (içerikTipi == 'json') {
                    // Yanıt türünü JSON yapma
                    yanıt.setHeader('Content-Type', 'application/json');
                    // Eğer verilen yükler geçerli ise onları kullanma
                    yükler = typeof (yükler) == 'object'
                        ? yükler
                        : {};

                    // JSON'u dizgiye çevirme
                    yükDizgisi = JSON.stringify(yükler);
                } else if (içerikTipi == 'html') {
                    // Yanıt türünü ayarlama (HTML dışındaki türler için undefined olmama koşulu istenir. Aksi takdirde çalışmaz.)                    yanıt.setHeader('Content-Type', 'text/html');
                    // Eğer yükler geçerli ise onları kullanma
                    yükDizgisi = typeof (yükler) == 'string'
                        ? yükler
                        : '';
                } else if (içerikTipi == 'favicon') {
                    // Yanıt türünü ayarlama (HTML dışındaki türler için undefined olmama koşulu istenir. Aksi takdirde çalışmaz.)
                    yanıt.setHeader('Content-Type', 'image/x-icon');
                    // Eğer yükler geçerli ise onları kullanma
                    yükDizgisi = typeof (yükler) !== 'undefined'
                        ? yükler
                        : '';
                } else if (içerikTipi == 'css') {
                    // Yanıt türünü ayarlama (HTML dışındaki türler için undefined olmama koşulu istenir. Aksi takdirde çalışmaz.)                    yanıt.setHeader('Content-Type', 'text/html');
                    yanıt.setHeader('Content-Type', 'text/css');
                    // Eğer yükler geçerli ise onları kullanma
                    yükDizgisi = typeof (yükler) !== 'undefined'
                        ? yükler
                        : '';
                } else if (içerikTipi == 'png') {
                    // Yanıt türünü ayarlama (HTML dışındaki türler için undefined olmama koşulu istenir. Aksi takdirde çalışmaz.)                    yanıt.setHeader('Content-Type', 'text/html');
                    yanıt.setHeader('Content-Type', 'iamge/png');
                    // Eğer yükler geçerli ise onları kullanma
                    yükDizgisi = typeof (yükler) !== 'undefined'
                        ? yükler
                        : '';
                } else if (içerikTipi == 'jpg') {
                    // Yanıt türünü ayarlama (HTML dışındaki türler için undefined olmama koşulu istenir. Aksi takdirde çalışmaz.)                    yanıt.setHeader('Content-Type', 'text/html');
                    yanıt.setHeader('Content-Type', 'iamge/jpg');
                    // Eğer yükler geçerli ise onları kullanma
                    yükDizgisi = typeof (yükler) !== 'undefined'
                        ? yükler
                        : '';
                } else if (içerikTipi == 'plain') {
                    // Yanıt türünü ayarlama (HTML dışındaki türler için undefined olmama koşulu istenir. Aksi takdirde çalışmaz.)                    yanıt.setHeader('Content-Type', 'text/html');
                    yanıt.setHeader('Content-Type', 'text/plain');
                    // Eğer yükler geçerli ise onları kullanma
                    yükDizgisi = typeof (yükler) !== 'undefined'
                        ? yükler
                        : '';
                }

                // Sonucu döndürme
                yanıt.writeHead(durumKodu);
                yanıt.end(yükDizgisi);

                // İşlem yanıtı olumlu ise yeşil, değilse kırmızı yazma
                if (durumKodu == 202) {
                    hataAyıkla("\x1b[32m%s\x1b[0m", `${metot} /${kırpılmışYol} ${durumKodu}`);
                } else {
                    hataAyıkla("\x1b[31m%s\x1b[0m", `${metot} /${kırpılmışYol} ${durumKodu}`);
                }

            });
        });
    });
};

export function başlat() {
    /**
     * Sunucuyu (HTTP) yapılamdırma dosyasındaki bağlantı noktasından dinliyoruz.
     * Örnek kullanım: curl localhost:3000
     * Not: Eğer 3000 yerine 500 yazsaydık, localhost:500 yapacaktık.
     */
    sunucu.httpSunucu.listen(httpBağlantıNoktası, () => {
        console.log("\x1b[33m%s\x1b[0m", `Sunucu ${httpBağlantıNoktası} portundan dinleniyor.`);
    });

    /**
     * Sunucuyu (HTTPS) yapılamdırma dosyasındaki bağlantı noktasından dinliyoruz.
     * Örnek kullanım: curl localhost:3000
     * Not: Eğer 3000 yerine 500 yazsaydık, locakhost:500 yapacaktık.
     */
    sunucu.httpsSunucu.listen(httpsBağlantıNoktası, () => {
        console.log("\x1b[33m%s\x1b[0m", `Güvenli Sunucu ${httpsBağlantıNoktası} portundan dinleniyor.\n`);
    });
}