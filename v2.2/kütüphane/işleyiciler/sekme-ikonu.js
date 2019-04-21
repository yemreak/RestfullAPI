/**
 * Yönlendirici ile çalıştıran kontrol işlemleri işleyicisi
 * * Kullanım Şekli: localhost:3000/kontroller
 */

import { debuglog as hataKaydı } from 'util';
import { statikVarlıklarıAl } from './../yardımcılar';

// Hata ayıklama modundaki (debug mode) mesajları göstermek için kullanılacak 
const hataAyıkla = hataKaydı('sekme-ikonu');

/**
 * Örnek: localhost:3000/indeks yazıldığında bu fonksiyon çalışır.
 *
 * Not: ornek, yönlendirici "nin bir objesidir.
 *
 * @param {object} veri Index.js"te tanımlanan veri objesidir. İstekle gelir.
 * @param {function(number, string, string):void} geriCagirma İşlemler bittiği zaman verilen yanıt
 ** arg0: HTTP varsayılan durum kodları
 ** arg0: HTTP yanıtı veya tanımsızlık
 ** arg1: İçerik tipi (Content-type) [http, json vs.]
 */
const sekmeİkonu = (veri, geriCagirma) => {
    // Sadece get metodu için çalışacağız
    if (veri.metot == 'get') {
        statikVarlıklarıAl('sekme-ikonu.ico', (hata, veri) => {
            if (!hata && veri) {
                geriCagirma(200, veri, 'favicon');
            } else {
                geriCagirma(500);
            }
        });
    } else {
        geriCagirma(405);
    }
}

export default sekmeİkonu;