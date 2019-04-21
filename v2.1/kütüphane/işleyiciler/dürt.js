/**
 * İşleyiciyi dürtme
 *
 * Örnek: localhost:3000/durt yazıldığında bu fonksiyon çalışır. (yönlendirici ile, index.js)
 *
 * @param {object} veri Index.js"te tanımlanan veri objesidir. İstekle gelir.
 * @param {function(number, object):void} geriCagirma İşlemler bittiği zaman verilen yanıt
 ** arg0: HTTP varsayılan durum kodları
 ** arg1: Ek bilgiler, açıklamalar
 */
const dürt = (veri, geriCagirma) => {
  geriCagirma(200);
}

export default dürt;
