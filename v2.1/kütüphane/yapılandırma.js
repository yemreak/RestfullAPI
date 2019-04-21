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
const ortamlar = {};

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
const anlıkOrtam =
  typeof process.env.NODE_ENV == "string"
    ? process.env.NODE_ENV.toLowerCase()
    : "";

/**
 * Şu anki ortamı kontrol ediyoruz, eğer yukarıdakilerden biri değile
 * iskeleti (varsayılan) tanımlıyoruz.
 */
const aktarılacakOrtam =
  typeof ortamlar[anlıkOrtam] == "object"
    ? ortamlar[anlıkOrtam]
    : ortamlar.iskelet;

export default aktarılacakOrtam;

export const {
  httpBağlantıNoktası,
  httpsBağlantıNoktası,
  ortamİsmi,
  şifrelemeGizliliği,
  kimlikUzunluğu,
  enFazlaKontrol,
  twilio
} = aktarılacakOrtam;
