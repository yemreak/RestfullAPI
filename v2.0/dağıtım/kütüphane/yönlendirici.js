"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.işleyiciAyarla = işleyiciAyarla;

var _bulunamad = require("./i\u015Fleyiciler/bulunamad\u0131");

var _bulunamad2 = _interopRequireDefault(_bulunamad);

var _rnek = require("./i\u015Fleyiciler/\xF6rnek");

var _rnek2 = _interopRequireDefault(_rnek);

var _dRt = require("./i\u015Fleyiciler/d\xFCrt");

var _dRt2 = _interopRequireDefault(_dRt);

var _kullanCLar = require("./i\u015Fleyiciler/kullan\u0131c\u0131lar");

var _kullanCLar2 = _interopRequireDefault(_kullanCLar);

var _belirteLer = require("./i\u015Fleyiciler/belirte\xE7ler");

var _belirteLer2 = _interopRequireDefault(_belirteLer);

var _kontroller = require("./i\u015Fleyiciler/kontroller");

var _kontroller2 = _interopRequireDefault(_kontroller);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * İstekler için yönlendirici tanımlama
 * * Örnek: *localhost:3000/<değişken> [ <değişken> = { "ornek", "durt", ...} ]*
 * * Not: *Türkçe karakter içeremez :( [Adres çubuğuna yazıldığından dolayı]*
 * * Gerekli Modüller: *işleyiciler.js*
 */
/**
 * Girilen URL'e göre doğru sayfaya yönlendirme işlemi
 */

var yönlendirme = {
  bulunamadi: _bulunamad2.default,
  ornek: _rnek2.default,
  durt: _dRt2.default,
  kullanicilar: _kullanCLar2.default,
  belirtecler: _belirteLer2.default,
  kontroller: _kontroller2.default
};

/**
 * İsteğin gideceği işleyiciyi seçme
 * * Örnek: *yönlendirici[ornek], yönlendirici içindeki ornek adlı anahtarın değerini tutar. [ornek = isleyiciler.örnek]*
 * @param {string} isleyici Seçilecek işleyicinin ismi
 * @param {function(object):void} geriCagirma Seçilmiş işleyiciyi geri döndürür.
 * * arg0: *function(veri, function(durumKodu, yükler))*
 */
function işleyiciAyarla(isleyici, geriCagirma) {
  var seçilmişİşleyici = typeof yönlendirme[isleyici] !== "undefined" ? yönlendirme[isleyici] : _bulunamad2.default;

  geriCagirma(seçilmişİşleyici);
}
//# sourceMappingURL=yönlendirici.js.map