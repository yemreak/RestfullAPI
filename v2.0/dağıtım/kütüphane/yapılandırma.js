"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * @description Şekillendirme değişkenlerinin oluşturulması ve aktarılması
 * @not sdsd
 *
 */

/**
 * Bütün ortamları (enviroments) oluşturma.
 * * Örnek: *"set NODE_ENV= (\n) node index.js" yazılırsa,
 *  bağlantı noktasından (port) çalışır.*
 */
var ortamlar = {};

/**
 * Örnek ortam
 * * Örnek: *"set NODE_ENV=iskelet (\n) node index.js" yazılırsa, 3000 bağlantı noktasından (port) çalışır.*
 */
ortamlar.iskelet = {
  httpBağlantıNoktası: 3000,
  httpsBağlantıNoktası: 3001,
  ortamİsmi: "iskelet",
  şifrelemeGizliliği: "gizlidir",
  kimlikUzunluğu: 20,
  enFazlaKontrol: 5,
  twilio: {
    telefon: "+14582092684",
    accountSid: "API KEY",
    authToken: "TOKEN"
  }
};

/**
 * Örnek ortam
 * * Örnek: *"set NODE_ENV=üretim (\n) node index.js" yazılırsa, 5000 portundan çalışır.*
 */
ortamlar.üretim = {
  httpBağlantıNoktası: 5000,
  httpsBağlantıNoktası: 5001,
  ortamİsmi: "üretim",
  şifrelemeGizliliği: "bu da gizlidir.",
  kimlikUzunluğu: 20,
  enFazlaKontrol: 5,
  twilio: {
    telefon: "+14582092684",
    accountSid: "API KEY",
    authToken: "TOKEN"
  }
};

/**
 * Hangi ortamın, command-line argumanı olacağına karar veriyoruz.
 * * Not: *"NODE_ENV" olan bir değişken ismidir, değiştirilemez ! (Türkçeleştirilemez)*
 */
var anlıkOrtam = typeof process.env.NODE_ENV == "string" ? process.env.NODE_ENV.toLowerCase() : "";

/**
 * Şu anki ortamı kontrol ediyoruz, eğer yukarıdakilerden biri değile
 * iskeleti (varsayılan) tanımlıyoruz.
 */
var aktarılacakOrtam = _typeof(ortamlar[anlıkOrtam]) == "object" ? ortamlar[anlıkOrtam] : ortamlar.iskelet;

exports.default = aktarılacakOrtam;
var httpBağlantıNoktası = aktarılacakOrtam.httpBağlantıNoktası,
    httpsBağlantıNoktası = aktarılacakOrtam.httpsBağlantıNoktası,
    ortamİsmi = aktarılacakOrtam.ortamİsmi,
    şifrelemeGizliliği = aktarılacakOrtam.şifrelemeGizliliği,
    kimlikUzunluğu = aktarılacakOrtam.kimlikUzunluğu,
    enFazlaKontrol = aktarılacakOrtam.enFazlaKontrol,
    twilio = aktarılacakOrtam.twilio;
exports.httpBağlantıNoktası = httpBağlantıNoktası;
exports.httpsBağlantıNoktası = httpsBağlantıNoktası;
exports.ortamİsmi = ortamİsmi;
exports.şifrelemeGizliliği = şifrelemeGizliliği;
exports.kimlikUzunluğu = kimlikUzunluğu;
exports.enFazlaKontrol = enFazlaKontrol;
exports.twilio = twilio;
//# sourceMappingURL=yapılandırma.js.map
