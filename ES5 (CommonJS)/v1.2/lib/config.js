/**
 * Açıklama: Şekillendirme değişkenlerinin oluşturulması ve aktarılması
 * 
 */

/**
 * Bütün ortamları (enviroments) oluşturma.
 * Örnek: "set NODE_ENV=<ortam objesi> (\n) node index.js" yazılırsa, <ortam objesinin bağlantı noktası değeri> bağlantı noktasından (port) çalışır.
 */
var ortamlar = {};

/**
 * Örnek ortam
 * Örnek: "set NODE_ENV=iskelet (\n) node index.js" yazılırsa, 3000 bağlantı noktasından (port) çalışır.
 */
ortamlar.iskelet = {
    'httpBağlantıNoktası': 3000,
    'httpsBağlantıNoktası': 3001,
    'ortamİsmi': 'iskelet', 
    'şifrelemeGizliliği': 'gizlidir'
};

/**
 * Örnek ortam
 * Örnek: "set NODE_ENV=üretim (\n) node index.js" yazılırsa, 5000 portundan çalışır.
 */
ortamlar.üretim = {
    'httpBağlantıNoktası': 5000,
    'httpsBağlantıNoktası': 5001,
    'ortamİsmi': 'üretim',
    'şifrelemeGizliliği': 'bu da gizlidir.'
}

/**
 * Hangi ortamın, command-line argumanı olacağına karar veriyoruz.
 * Not: "NODE_ENV" olan bir değişken ismidir, değiştirilemez ! (Türkçeleştirilemez)
 */
var anlıkOrtam = typeof (process.env.NODE_ENV) == 'string' ?
    process.env.NODE_ENV.toLowerCase() : '';

/**
 * Şu anki ortamı kontrol ediyoruz, eğer yukarıdakilerden biri değile
 * iskeleti (varsayılan) tanımlıyoruz.
 */
var aktarılacakOrtam = typeof(ortamlar[anlıkOrtam]) == 'object' ?
ortamlar[anlıkOrtam] : ortamlar.iskelet;

module.exports = aktarılacakOrtam;