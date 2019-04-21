/**
 * İşleyiciler
 * Açıklama:
 * Tarih: 13 / 8 / 2018
 */

/**
 * Bağımlılıklar
 */
var _veri = require("./data");
var yardımcılar = require("./helpers");

/**
 * İşleyicileri (handlers) tanımlama
 * Örnek: işleyiciler.örnek
 *
 * Not: Buradaki işleyiciler.örnek, yönlendiricilerdeki "ornek" öğesine atanıyor.
 */
var işleyiciler = {};

/**
 * İşleyiciler, kullanıcı işlemleri için metot
 * Örnek: localhost:3000/kullanicilar yazıldığında bu fonksiyon çalışır.
 * 
 * Not: _kullanıcılar; private oluyor, dışarıdan erişilemez.
 * 
 * @param {object} veri Index.js"te tanımlanan veri objesidir. İstekle gelir.
 * @param {function} geriCagirma İşlemler bittiği zaman çalışacan metot
 */
işleyiciler.kullanıcılar = function (veri, geriCagirma) {
    var uygunMetotlar = ["post", "get", "put", "delete"];

    if (uygunMetotlar.indexOf(veri.metot) > -1) {
        işleyiciler._kullanıcılar[veri.metot](veri, geriCagirma);
    } else {
        geriCagirma(405, {
            "Hata": "HTML isteklerinin metodu uygun değil",
            "Metot": "isleyiciler.kullanıcılar"
        });
    }
};

/**
 * İşleyiciler.kullanıclar için kullanılan obje
 * @see işleyiciler.kullanicilar
 */
işleyiciler._kullanıcılar = {};

/**
 * Kullanıcı oluşturma metodu 
 * @param {object} veri Index.js"te tanımlanan veri objesi. İstekle gelir.
 * @param {function} geriCagirma İşlemler bittiği zaman çalışacan metot.
 */
işleyiciler._kullanıcılar.post = function (veri, geriCagirma) {
    // İsim alma, 0 karakterden fazla olmalı
    var isim = typeof (veri.yükler.isim) == "string" &&
        veri.yükler.isim.trim().length > 0 ? veri.yükler.isim.trim() : false;
    // Soyad alma, 0 karakterden fazla olmalı
    var soyİsim = typeof (veri.yükler.soyİsim) == "string" &&
        veri.yükler.isim.trim().length > 0 ? veri.yükler.soyİsim.trim() : false;
    // Telefon bilgisi alma. Telefonlar 10 haneli olur.
    var telefon = typeof (veri.yükler.telefon) == "string" &&
        veri.yükler.telefon.trim().length == 10 ? veri.yükler.telefon.trim() : false;
    // Şifre alma
    var şifre = typeof (veri.yükler.şifre) == "string" &&
        veri.yükler.isim.trim().length > 0 ? veri.yükler.şifre.trim() : false;
    // Koşulları kabul etti mi kontrolü
    var koşulKabulü = typeof (veri.yükler.koşulKabulü) == "boolean" &&
        veri.yükler.koşulKabulü == true ? true : false;

    if (isim && soyİsim && telefon && şifre && koşulKabulü) {
        // Kullanıcının zaten olmadığından emin oluyoruz
        _veri.oku("kullanıcılar", telefon, function (hata, veri) {
            // Eğer kullanıcı dosyasında istenen telefon no bulunmaz ise, hata verir. Yani kullanıcı yoksa;
            if (hata) {
                // Şifreyi şifreleyerek (hashing) tutuyoruz.
                var gizlenmişŞifre = yardımcılar.şifreleme(şifre);

                if (gizlenmişŞifre) {
                    var kullanıcıObjesi = {
                        "isim": isim,
                        "soyİsim": soyİsim,
                        "telefon": telefon,
                        "gizlenmişŞifre": gizlenmişŞifre,
                        "koşulKabulü": koşulKabulü
                    };

                    _veri.oluştur("kullanıcılar", telefon, kullanıcıObjesi, function (hata) {
                        if (!hata) {
                            geriCagirma(200);
                        } else {
                            geriCagirma(500, { "bilgi": "Kullanıcı oluşturulamadı :(" });
                        }
                    });
                } else {
                    geriCagirma(500, { "bilgi": "Kullanıcı şifrelenemedi :(" });
                }
            } else {
                geriCagirma(400, { "bilgi": "Bu telefon numarası zaten kayıtlı :(" });
            }
        });
    } else {
        geriCagirma(400, { "bilgi": "İstenen alanlarda eksiklikler var :(" });
    }
};

/**
 * Kullanıcı girişi
 * @property Sadece kimliği onaylanmış kişiler, kendi biligilerine erişebilir. (Diğerlerine erişemez)
 * @param {object} veri Index.js"te tanımlanan veri objesi. İstekle gelir.
 * @param {function} geriCagirma İşlemler bittiği zaman çalışacan metot.
 */
işleyiciler._kullanıcılar.get = function (veri, geriCagirma) {
    // Telefon numarasını kontrol etmemiz gerekmekte
    var telefon = typeof (veri.sorguDizgisiObjeleri.telefon) == "string" &&
        veri.sorguDizgisiObjeleri.telefon.trim().length == 10 ?
        veri.sorguDizgisiObjeleri.telefon.trim() : false;

    if (telefon) {
        _veri.oku("kullanıcılar", telefon, function (hata, veri) {
            if (!hata && veri) {
                // Gizlenmiş şifreyi, veriyi isteyene vermeden önce kaldırıyoruz.
                delete veri.gizlenmişŞifre;

                // Durum kodu ve yükleri gönderiyoruz. (Index.js"teki seçilmişİşleyici)
                geriCagirma(200, veri);
            } else {
                geriCagirma(404, { "bilgi": "Kullanıcı bilgisi bulunamadı :(" });
            }
        });

    } else {
        geriCagirma(400, { "bilgi": "Gerekli bilgiler eksik :(" });
    }
};

/**
 * Kullanıcı verileri güncelleme
 * @property Sadece kimliği onaylanmış kişiler, kendi bilgilerini değiştirebilir. (Diğerlerine erişemez)
 * @param {object} veri Index.js"te tanımlanan veri objesi. İstekle gelir.
 * @param {function} geriCagirma İşlemler bittiği zaman çalışacan metot.
 */
işleyiciler._kullanıcılar.put = function (veri, geriCagirma) {
    // Kullanıcıyı kontrol etme
    // Not: === yerine == kullanıyoruz, detaylı kontrol etmeye gerek yok.
    var telefon = typeof (veri.yükler.telefon) == "string" &&
        veri.yükler.telefon.trim().length == 10 ? veri.yükler.telefon.trim() : false;

    // İsim alma, 0 karakterden fazla olmalı
    var isim = typeof (veri.yükler.isim) == "string" &&
        veri.yükler.isim.trim().length > 0 ? veri.yükler.isim.trim() : false;
    // Soyad alma, 0 karakterden fazla olmalı
    var soyİsim = typeof (veri.yükler.soyİsim) == "string" &&
        veri.yükler.isim.trim().length > 0 ? veri.yükler.soyİsim.trim() : false;
    // Şifre alma
    var şifre = typeof (veri.yükler.şifre) == "string" &&
        veri.yükler.isim.trim().length > 0 ? veri.yükler.şifre.trim() : false;

    if (telefon) {
        if (isim || soyİsim || şifre) {
            _veri.oku("kullanıcılar", telefon, function (hata, kullanıcıVerisi) {
                if (!hata && kullanıcıVerisi) {
                    if (isim) {
                        kullanıcıVerisi.isim = isim;
                    }
                    if (soyİsim) {
                        kullanıcıVerisi.soyİsim = soyİsim;
                    }
                    if (şifre) {
                        kullanıcıVerisi.gizlenmişŞifre = yardımcılar.şifreleme(şifre);
                    }

                    _veri.güncelle("kullanıcılar", telefon, kullanıcıVerisi, function (hata) {
                        if (!hata) {
                            geriCagirma(200, { "bilgi": "Kullanıcı güncellendi :)" });
                        } else {
                            geriCagirma(500, { "bilgi": "Kulanıcı güncellenemedi :(" });
                        }
                    });
                } else {
                    geriCagirma(400, { "bilgi": "Kullanıcı bulunamadı :(" })
                }
            });
        } else {
            geriCagirma(400, { "bilgi": "Güncelleme için girilen bilgiler eksik :(" })
        }
    } else {
        geriCagirma(400, { "bilgi": "Güncelleme için gerekli bilgiler eksik :(" })
    }
};

/**
 * Kullanıcı verileri güncelleme
 * @property Sadece kimliği onaylanmış kişiler, kendi bilgilerini değiştirebilir. (Diğerlerine erişemez)
 * @param {object} veri Index.js"te tanımlanan veri objesi. İstekle gelir.
 * @param {function} geriCagirma İşlemler bittiği zaman çalışacan metot.
 */
işleyiciler._kullanıcılar.delete = function (veri, geriCagirma) {
    // Kullanıcının olduğunu kontrol ediyoruz.
    var telefon = typeof (veri.sorguDizgisiObjeleri.telefon) == "string" &&
        veri.sorguDizgisiObjeleri.telefon.trim().length == 10 ? veri.sorguDizgisiObjeleri.telefon : false;

    if (telefon) {
        _veri.oku("kullanıcılar", telefon, function (hata, veri) {
            if (!hata) {
                _veri.sil("kullanıcılar", telefon, function (hata, veri) {
                    if (!hata) {
                        geriCagirma(200, { "bilgi": "İstenen kullanıcı silindi :)" });
                    } else {
                        geriCagirma(500, { "bilgi": "Kullanıcı silinemedi :(" });
                    }
                });
            } else {
                geriCagirma(400, { "bilgi": "Silenecek kullanıcı bulunamadı :(" });
            }
        });
    } else {
        geriCagirma(400, { "bilgi": "Silmek için gereken bilgiler eksik :(" });
    }
};

/**
 * 
 * @param {string} no Tokenler için kimlik no'su
 * @param {string} telefon Kullanıcı telefon numarası
 * @param {Function} geriCagirma İşlemler bittikten sonra çalışacak metot. 
 */
işleyicileri._simgeler.simgeOnaylama = function (no, telefon, geriCagirma) {
    _veri.oku('simgeler', no, function (hata, simgeVerisi) {
        if (!hata && simgeVerisi) {
            if (simgeVerisi.telefon == telefon && simgeVerisi.ömür > Date.now()) {
                geriCagirma(true);
            } else {
                geriCagirma(false);
            }
        } else {
            geriCagirma(false);
        }
    });
}

/**
 * İşleyiciyi simgeler
 * 
 * Örnek: localhost:3000/simgeler yazıldığında bu fonksiyon çalışır. (yönlendirici ile, index.js)
 *
 * @param {object} veri Index.js"te tanımlanan veri objesidir. İstekle gelir.
 * @param {function} geriCagirma İşlemler bittiği zaman çalışacan metot
 */
işleyiciler.simgeler = function (veri, geriCagirma) {
    var uygunMetotlar = ["post", "get", "put", "delete"];

    if (uygunMetotlar.indexOf(veri.metot) > -1) {
        işleyiciler._simgeler[veri.metot](veri, geriCagirma);
    } else {
        geriCagirma(405, { "bilgi": "Simgle işlemi için uygun metot bulunamadı :(" });
    }
};

// Simgeler işleyicisinin alt metotları için kalıp
işleyiciler._simgeler = {};

/**
 * Simge oluşturma metodu 
 * @param {object} veri Index.js"te tanımlanan veri objesi. İstekle gelir.
 * @param {function} geriCagirma İşlemler bittiği zaman çalışacan metot.
 */
işleyiciler._simgeler.post = function (veri, geriCagirma) {
    var telefon = typeof (veri.yükler.telefon) == "string" &&
        veri.yükler.telefon.trim().length == 10 ? veri.yükler.telefon.trim() : false;

    var şifre = typeof (veri.yükler.şifre) == "string" &&
        veri.yükler.şifre.trim().length > 0 ? veri.yükler.şifre.trim() : false;

    if (telefon && şifre) {
        _veri.oku("kullanıcılar", telefon, function (hata, kullanıcıVerisi) {
            if (!hata && kullanıcıVerisi) {
                // Alınan şifreyi gizlenmiş şifre ile karşılaştırmamız lazım.
                var gizlenmişŞifre = yardımcılar.şifreleme(şifre);

                if (gizlenmişŞifre == kullanıcıVerisi.gizlenmişŞifre) {
                    var simgeNo = yardımcılar.rastgeleDizgiOluştur(20);
                    var ömür = Date.now() + 1000 * 60 * 60;

                    var simgeObjesi = {
                        "telefon": telefon,
                        "no": simgeNo,
                        "ömür": ömür
                    };

                    _veri.oluştur("simgeler", simgeNo, simgeObjesi, function (hata) {
                        if (!hata) {
                            geriCagirma(200, simgeObjesi);
                        } else {
                            geriCagirma(500, { "bilgi": "Simge oluşturulamadı :(" });
                        }
                    });

                } else {
                    geriCagirma(400, { "bilgi": "Simge oluşturmak için girilen şifre kullanıcı ile uyuşmamakta" });
                }
            } else {
                geriCagirma(400, { "bilgi": "Simge oluşturmak için aranan kullanıcı bulunamadı :(" });
            }
        });
    } else {
        geriCagirma(400, { "bilgi": "Simge oluşturmak için gerekli alanlar doldurulmadı :(" })
    }


}

/**
 * Simge alma metodu 
 * Not: localhost:3000/simgeler?no=... 
 * @param {object} veri Index.js"te tanımlanan veri objesi. İstekle gelir.
 * @param {function} geriCagirma İşlemler bittiği zaman çalışacan metot.
 */
işleyiciler._simgeler.get = function (veri, geriCagirma) {
    // Rastgele dizgi oluştur metodundaki değere eşit olmak zorunda, o sebeple 20
    var no = typeof (veri.sorguDizgisiObjeleri.no) == "string" &&
        veri.sorguDizgisiObjeleri.no.trim().length == 20 ? veri.sorguDizgisiObjeleri.no.trim() :
        false;

    if (no) {
        _veri.oku("simgeler", no, function (hata, simgeVerisi) {
            if (!hata) {
                geriCagirma(200, simgeVerisi);
            } else {
                geriCagirma(404, { "bilgi": "Alınacak simge bulunamadı :(" });
            }
        });
    } else {
        geriCagirma(400, { "bilgi": "Simge alma işlemi için gereken alanlar eksik :(" });
    }
}

/**
 * Simge alma metodu 
 * Not: localhost:3000/simgeler?no=... 
 * @param {object} veri Index.js"te tanımlanan veri objesi. İstekle gelir.
 * @param {function} geriCagirma İşlemler bittiği zaman çalışacan metot.
 */
işleyiciler._simgeler.put = function (veri, geriCagirma) {
    // İndex'te rastgele dizgi oluşturma uzunluğu ile aynı olmak zorunda (20)
    var no = typeof (veri.yükler.no) == 'string' && veri.yükler.no.trim().length == 20 ?
        veri.yükler.no.trim() : false;

    var süreUzatma = typeof (veri.yükler.süreUzatma) == 'boolean' && veri.yükler.süreUzatma ?
        veri.yükler.süreUzatma : false;

    if (no && süreUzatma) {
        _veri.oku('simgeler', no, function (hata, simgeVerisi) {
            if (!hata) {
                if (simgeVerisi.ömür > Date.now()) {
                    simgeVerisi.ömür = Date.now() + 1000 * 60 * 60;

                    _veri.güncelle('simgeler', no, simgeVerisi, function (hata) {
                        if (!hata) {
                            geriCagirma(200, { "bilgi": "Simge ömrü uzatıldı :)" });
                        } else {
                            geriCagirma(500, { "bilgi": "Simge verisi güncellenemedi :(" });
                        }
                    });
                } else {
                    geriCagirma(400, { "bilgi": "Ömrü uzatılmak istenen simge çoktan ölmüştür :(" });
                }
            } else {
                geriCagirma(400, { "bilgi": "Simge koyma işlemi için aranan simge bulunamadı :(" });
            }
        });
    } else {
        geriCagirma(400, { "bilgi": "Simge koyma işlemi için gerekli alan(lar) eksik :(" });
    }
}

işleyiciler._simgeler.delete = function (veri, geriCagirma) {
    var no = typeof (veri.sorguDizgisiObjeleri.no) == 'string' && veri.sorguDizgisiObjeleri.no.trim().length == 20 ?
        veri.sorguDizgisiObjeleri.no.trim() : false;

    if (no) {
        _veri.oku('simgeler', no, function (hata) {
            if (!hata) {
                _veri.sil('simgeler', no, function (hata) {
                    if (!hata) {
                        geriCagirma(200, { "bilgi": "Simge başarıyla silindi :)" });
                    } else {
                        geriCagirma(500, { "bilgi": "Simge silme işlemi başarısız oldu :(" });
                    }
                });
            } else {
                geriCagirma(400, { "bilgi": "Silenecek simge bulunamadı :(" });
            }
        });
    } else {
        geriCagirma(400, { "bilgi": "Simge silmek için gereken alanlar eksin :(" });
    }
}

/**
 * İşleyiciyi dürtme
 * 
 * Örnek: localhost:3000/durt yazıldığında bu fonksiyon çalışır. (yönlendirici ile, index.js)
 *
 * @param {object} veri Index.js"te tanımlanan veri objesidir. İstekle gelir.
 * @param {function} geriCagirma İşlemler bittiği zaman çalışacan metot
 */
işleyiciler.dürt = function (veri, geriCagirma) {
    geriCagirma(200);
};

/**
 * İşleyici örneği
 * 
 * Örnek: localhost:3000/ornek yazıldığında bu fonksiyon çalışır.
 * 
 * Not: ornek, yönlendirici "nin bir objesidir.
 * 
 * @param {object} veri Index.js"te tanımlanan veri objesidir. İstekle gelir.
 * @param {function} geriCagirma İşlemler bittiği zaman çalışacan metot
 */
işleyiciler.örnek = function (veri, geriCagirma) {
    // HTTP durumunu ve yüklerini geri çağırıyoruz.
    geriCagirma(406, { "isim": "başlık örneği" });
};

/**
 * İşleyici bulunamaması durumunda çalışan metod
 * 
 * Örnek: localhost:3000/ornek1 yazıldığında bu fonksiyon çalışır. [ornek1 tanımlı değil]
 * 
 * Not: ornek1, yönlendirici"de tanımlı olmayan bir objesidir.
 * 
 * @param {object} veri Index.js"te tanımlanan veri objesidir. İstekle gelir.
 * @param {function} geriCagirma İşlemler bittiği zaman çalışacan metot
 */
işleyiciler.bulunamadı = function (veri, geriCagirma) {
    // HTTP hata kodunu geri çağırıyoruz.
    geriCagirma(404, { "bilgi": "Aranan sayfa bulunamadı :(" });
};

module.exports = işleyiciler;