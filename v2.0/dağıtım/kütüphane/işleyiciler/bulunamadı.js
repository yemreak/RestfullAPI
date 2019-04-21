"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * İşleyici bulunamaması durumunda çalışan metod
 ** Örnek: localhost:3000/ornek1 yazıldığında bu fonksiyon çalışır. [ornek1 tanımlı değil]
 ** Not: ornek1, yönlendirici"de tanımlı olmayan bir objesidir.
 * @param {object} veri Index.js"te tanımlanan veri objesidir. İstekle gelir.
 * @param {function(number, object):void} geriCagirma İşlemler bittiği zaman verilen yanıt
 * * arg0: HTTP varsayılan durum kodları
 * * arg1: Ek bilgiler, açıklamalar
 */
var bulunamadı = function bulunamadı(veri, geriCagirma) {
  // HTTP hata kodunu geri çağırıyoruz.
  geriCagirma(404, { bilgi: "Aranan sayfa bulunamadı :(" });
};

exports.default = bulunamadı;
//# sourceMappingURL=bulunamadı.js.map