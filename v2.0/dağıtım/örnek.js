"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
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
var örnek = function örnek(veri, geriCagirma) {
  // HTTP durumunu ve yüklerini geri çağırıyoruz.
  geriCagirma(406, { isim: "başlık örneği" });
};

exports.default = örnek;
//# sourceMappingURL=örnek.js.map