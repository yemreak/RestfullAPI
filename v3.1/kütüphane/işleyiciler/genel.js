/**
 * Yönlendirici ile çalıştıran kontrol işlemleri işleyicisi
 * * Kullanım Şekli: localhost:3000/kontroller
 */

import { debuglog as hataKaydı } from 'util';
import { statikVarlıklarıAl } from './../yardımcılar';

// Hata ayıklama modundaki (debug mode) mesajları göstermek için kullanılacak 
const hataAyıkla = hataKaydı('genel');

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
const genel = (veri, geriCagirma) => {
    // Sadece get metodu için çalışacak
    if (veri.metot == 'get') {
        // İstenen varlık ismini alıyoruz
        var istenenVarlıkİsmi = veri.kırpılmışYol.replace('genel/', '').trim();
        if (istenenVarlıkİsmi.length > 0) {
            // İstenen varlığı alma
            statikVarlıklarıAl(istenenVarlıkİsmi, (hata, veri) => {
                if (!hata && veri) {
                    // Uzantı ile içerik türünü belirleme (eğer belirli değişse yazı yapma)
                    let içerikTürü = 'plain';

                    if (istenenVarlıkİsmi.indexOf('.css') > -1) {
                        içerikTürü = 'css';
                    } else if (istenenVarlıkİsmi.indexOf('.png') > -1) {
                        içerikTürü = 'png';
                    } else if (istenenVarlıkİsmi.indexOf('.jpg') > -1) {
                        içerikTürü = 'jpg';
                    } else if (istenenVarlıkİsmi.indexOf('.ico') > -1) {
                        içerikTürü = 'favico';
                    }
                                        
                    geriCagirma(200, veri, içerikTürü);
                } else {
                    hataAyıkla(hata);
                    geriCagirma(404);
                }
            });
        }
    } else {
        hataAyıkla('İstenen varlık ismi 0 karakterden uzun değil :(');
        geriCagirma(405);
    }
}

export default genel;