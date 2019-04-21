/**
 * API için öncelikli dosya
 * Açılama: ES6 tabanında yazılmış bir API
 * Yazar: YunusEmre
 */

// Bağımlılıklar
var http = require('http');
var url = require('url');

// Sunucu her isteğe string ile karşılık vermeli
var sunucu = http.createServer(function (istek, yanıt) {
    // URL'i alma ve inceleme
    var incelenmişUrl = url.parse(istek.url, true);

    // Yolu alma
    var yol = incelenmişUrl.pathname; // Tam yoldur.
    var kırpılmışYol = yol.replace(/^\/+|\+$/g, '') // Solda verilen işaretler çıkartılarak alınan yol.

    // Sorgu kelimesini (query string) obje olarak almak.
    var sorguKelimesiObjesi = incelenmişUrl.query;

    // HTTP metodu alma
    var metod = istek.method.toLowerCase();

    yanıt.end("Selam\n");

    console.log(
        "İstek bu (kırpılmış) yoldan alındı: " + kırpılmışYol + 
        "\nMetod: " + metod +
        "\nSorgu kelimesi objesi: ", sorguKelimesiObjesi
    );
});

// Sunucu başlatıyoruz ve onu 3000 portundan dinliyoruz.
sunucu.listen(3000, function () {
    console.log("Sunucu 3000 portundan dinleniyor.");
});