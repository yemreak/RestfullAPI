/**
 * Yardımcı metotlar
 * Açıklama: Şifreleme gibi yardımcı metodlar bulunur
 */

/**
 * Bağımlılıklar
 * -> kripta; Şifreleme metodları için
 * -> yapılandırma; Ana program yapılandırma dosyası (şifreleme için)
 */
var kripto = require('crypto');
var yapılandırma = require('./config');

/**
 * Yardımcıları tutan dizi
 */
var yardımcılar = {};

/**
 * Şifreleme metodu
 * @param {string} dizgi Şifrelenecek dizgi
 */
yardımcılar.şifreleme = function (dizgi) {
    if (typeof (dizgi) === 'string' && dizgi.length > 0) {
        return kripto.createHash('sha256', yapılandırma.şifrelemeGizliliği)
            .update(dizgi).digest('hex');
    } else {
        return false;
    }
}

/**
 * Json'u objeye dönüştürme (parsing)
 * @param {string} dizgi Dönüştürülecek json
 * @return {object} JSON objesi
 */
yardımcılar.jsonuObjeyeDönüştür = function (dizgi) {
    try {
        var obje = JSON.parse(dizgi);
        return obje;
    } catch (e) {
        return {};
    }
};

/**
 * Rastgele bir dizgi oluşturma
 * @param {number} dizgiUzunluğu Oluşturulacak rastgele dizginin uzunluğu
 */
yardımcılar.rastgeleDizgiOluştur = function (dizgiUzunluğu) {
    dizgiUzunluğu = typeof (dizgiUzunluğu) == 'number' &&
        dizgiUzunluğu > 0 ? dizgiUzunluğu : false;

    if (dizgiUzunluğu) {
        // Türkçe karakter içeremez, adres çubuğuna yazılmaktadır.
        var olasıKarakterler = 'abcdefghijklmnoprstuvwxyz0123456789';
        var dizgi = '';

        for (i = 1; i <= dizgiUzunluğu; i++) {
            var rastgeleKarakter = olasıKarakterler.charAt(Math.floor(Math.random() * olasıKarakterler.length));
            dizgi += rastgeleKarakter;
        }

        return dizgi;
    } else {
        return false;
    }
};

/**
 * Yardımcıların dışarı aktarılması
 */
module.exports = yardımcılar;