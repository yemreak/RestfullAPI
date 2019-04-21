
var işleyiciler = require("./yönlendirici/işleyiciler.js");


var yönlendirici = {};

/**
 * İstekler için yönlendirici tanımlama
 * * Örnek: *localhost:3000/<değişken> [ <değişken> = { "ornek", "durt", ...} ]*
 * * Not: *Türkçe karakter içeremez :( [Adres çubuğuna yazıldığından dolayı]*
 * * Gerekli Modüller: *işleyiciler.js*
 */
var yönlendirme = {
    "bulunamadi": işleyiciler.bulunamadı,
    "ornek": işleyiciler.örnek,
    "durt": işleyiciler.dürt,
    "kullanicilar": işleyiciler.kullanıcılar,
    "belirtecler": işleyiciler.belirteçler,
    "kontroller": işleyiciler.kontroller
};

/** 
* İsteğin gideceği işleyiciyi seçme
* * Örnek: *yönlendirici[ornek], yönlendirici içindeki ornek adlı anahtarın değerini tutar. [ornek = isleyiciler.örnek]*
* @param {string} isleyici Seçilecek işleyicinin ismi
* @param {function(object)} geriCagirma Seçilmiş işleyiciyi geri döndürür.
* * arg0: *function(veri, function(durumKodu, yükler))*
*/
yönlendirici.işleyiciAyarla = function (isleyici, geriCagirma) {
    seçilmişİşleyici = typeof (yönlendirme[isleyici]) !== "undefined" ?
        yönlendirme[isleyici] : işleyiciler.bulunamadı;
   
    geriCagirma(seçilmişİşleyici);
};

// Dışa aktarılacak obje
module.exports = yönlendirici;