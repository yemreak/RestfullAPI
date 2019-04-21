/**
 * API için öncelikli dosya
 * Açılama: ES6 tabanında yazılmış bir API
 * Yazar: YunusEmre
 */

// Bağımlılıklar
var http = require('http');

// Sunucu her isteğe string ile karşılık vermeli
var sunucu = http.createServer(function (istek, yanıt) {
    yanıt.end('Hello World\n');
});

// Sunucu başlatıyoruz ve onu 3000 portundan dinliyoruz.
sunucu.listen(3000, function () {
    console.log("Sunucu 3000 portundan dinleniyor.");
});