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
var yapılandırma = require("./config");

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
        // Bilgilere erişmek isteyen kişinin kendimiz olduğunu anlamak için gereken işlemler.
        var belirteç = typeof (veri.başlıklar.belirteç) == 'string' ? veri.başlıklar.belirteç : false;

        işleyiciler._belirteçler.belirteçOnaylama(belirteç, telefon, function (belirteçOnaylandıMı) {
            if (belirteçOnaylandıMı) {
                _veri.oku('kullanıcılar', telefon, function (hata, veri) {
                    if (!hata && veri) {
                        // Gizlenmiş şifreyi, veriyi isteyene vermeden önce kaldırıyoruz.
                        delete veri.gizlenmişŞifre;

                        // Durum kodu ve yükleri gönderiyoruz. (Index.js"teki seçilmişİşleyici)
                        geriCagirma(200, veri);
                    } else {
                        geriCagirma(404, { "bilgi": "Gösterilecek kullanıcı bulunamadı :(" });
                    }
                });
            } else {
                geriCagirma(400, { "bilgi": "Kullanıcı görme işlemi için belirteç onaylanmadı veya belirtecin ömrü bitmiş :(" });
            }
        });
    } else {
        geriCagirma(400, { "bilgi": "Kullanıcı görme işlemi için gerekli bilgi bulunmadı :(" });
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
            // Kulanıcının giren kişinin kendi hesabı olduğundan emin oluyoruz.
            var belirteç = typeof (veri.başlıklar.belirteç) == 'string' ? veri.başlıklar.belirteç : false;

            işleyiciler._belirteçler.belirteçOnaylama(belirteç, telefon, function (belirteçOnaylandıMı) {
                if (belirteçOnaylandıMı) {
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
                    geriCagirma(403, { "bilgi": "Kullanıcı güncellemek için belirteç bulunamadı veya belirtecin ömrü bitmiş :(" });
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
        var belirteç = typeof (veri.başlıklar.belirteç) == 'string' ? veri.başlıklar.belirteç : false;

        işleyiciler._belirteçler.belirteçOnaylama(belirteç, telefon, function (belirteçOnaylama) {
            if (belirteçOnaylandıMı) {
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
                geriCagirma(403, { "bilgi": "Kullanıcı silmek için belirteç bulunamadı veya belirtecin ömrü bitmiş :(" });
            }
        });
    } else {
        geriCagirma(400, { "bilgi": "Kullanıcı silmek için gereken bilgiler eksik :(" });
    }
};

/**
 * İşleyiciyi belirteçler
 * 
 * Örnek: localhost:3000/belirteçler yazıldığında bu fonksiyon çalışır. (yönlendirici ile, index.js)
 *
 * @param {object} veri Index.js"te tanımlanan veri objesidir. İstekle gelir.
 * @param {function} geriCagirma İşlemler bittiği zaman çalışacan metot
 */
işleyiciler.belirteçler = function (veri, geriCagirma) {
    var uygunMetotlar = ["post", "get", "put", "delete"];

    if (uygunMetotlar.indexOf(veri.metot) > -1) {
        işleyiciler._belirteçler[veri.metot](veri, geriCagirma);
    } else {
        geriCagirma(405, { "bilgi": "Simgle işlemi için uygun metot bulunamadı :(" });
    }
};

// Belirteçler işleyicisinin alt metotları için kalıp
işleyiciler._belirteçler = {};

/**
 * Belirteç oluşturma metodu 
 * @param {object} veri Index.js"te tanımlanan veri objesi. İstekle gelir.
 * @param {function} geriCagirma İşlemler bittiği zaman çalışacan metot.
 */
işleyiciler._belirteçler.post = function (veri, geriCagirma) {
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
                    var belirteçNo = yardımcılar.rastgeleDizgiOluştur(20);
                    var ömür = Date.now() + 1000 * 60 * 60;

                    var belirteçObjesi = {
                        "telefon": telefon,
                        "no": belirteçNo,
                        "ömür": ömür
                    };

                    _veri.oluştur("belirteçler", belirteçNo, belirteçObjesi, function (hata) {
                        if (!hata) {
                            geriCagirma(200, belirteçObjesi);
                        } else {
                            geriCagirma(500, { "bilgi": "Belirteç oluşturulamadı :(" });
                        }
                    });

                } else {
                    geriCagirma(400, { "bilgi": "Belirteç oluşturmak için girilen şifre kullanıcı ile uyuşmamakta" });
                }
            } else {
                geriCagirma(400, { "bilgi": "Belirteç oluşturmak için aranan kullanıcı bulunamadı :(" });
            }
        });
    } else {
        geriCagirma(400, { "bilgi": "Belirteç oluşturmak için gerekli alanlar doldurulmadı :(" })
    }


}

/**
 * Belirteç alma metodu 
 * Not: localhost:3000/belirteçler?no=... 
 * @param {object} veri Index.js"te tanımlanan veri objesi. İstekle gelir.
 * @param {function} geriCagirma İşlemler bittiği zaman çalışacan metot.
 */
işleyiciler._belirteçler.get = function (veri, geriCagirma) {
    // Rastgele dizgi oluştur metodundaki değere eşit olmak zorunda, o sebeple 20
    var no = typeof (veri.sorguDizgisiObjeleri.no) == "string" &&
        veri.sorguDizgisiObjeleri.no.trim().length == 20 ? veri.sorguDizgisiObjeleri.no.trim() :
        false;

    if (no) {
        _veri.oku("belirteçler", no, function (hata, belirteçVerisi) {
            if (!hata) {
                geriCagirma(200, belirteçVerisi);
            } else {
                geriCagirma(404, { "bilgi": "Alınacak belirteç bulunamadı :(" });
            }
        });
    } else {
        geriCagirma(400, { "bilgi": "Belirteç alma işlemi için gereken alanlar eksik :(" });
    }
}

/**
 * Belirteç alma metodu 
 * Not: localhost:3000/belirteçler?no=... 
 * @param {object} veri Index.js"te tanımlanan veri objesi. İstekle gelir.
 * @param {function} geriCagirma İşlemler bittiği zaman çalışacan metot.
 */
işleyiciler._belirteçler.put = function (veri, geriCagirma) {
    // İndex'te rastgele dizgi oluşturma uzunluğu ile aynı olmak zorunda (20)
    var no = typeof (veri.yükler.no) == 'string' && veri.yükler.no.trim().length == 20 ?
        veri.yükler.no.trim() : false;

    var süreUzatma = typeof (veri.yükler.süreUzatma) == 'boolean' && veri.yükler.süreUzatma ?
        veri.yükler.süreUzatma : false;

    if (no && süreUzatma) {
        _veri.oku('belirteçler', no, function (hata, belirteçVerisi) {
            if (!hata) {
                if (belirteçVerisi.ömür > Date.now()) {
                    belirteçVerisi.ömür = Date.now() + 1000 * 60 * 60;

                    _veri.güncelle('belirteçler', no, belirteçVerisi, function (hata) {
                        if (!hata) {
                            geriCagirma(200, { "bilgi": "Belirteç ömrü uzatıldı :)" });
                        } else {
                            geriCagirma(500, { "bilgi": "Belirteç verisi güncellenemedi :(" });
                        }
                    });
                } else {
                    geriCagirma(400, { "bilgi": "Ömrü uzatılmak istenen belirteç çoktan ölmüştür :(" });
                }
            } else {
                geriCagirma(400, { "bilgi": "Belirteç koyma işlemi için aranan belirteç bulunamadı :(" });
            }
        });
    } else {
        geriCagirma(400, { "bilgi": "Belirteç koyma işlemi için gerekli alan(lar) eksik :(" });
    }
}

/**
 * Belirteç alma metodu 
 * Not: localhost:3000/belirteçler?no=... 
 * @param {object} veri Index.js"te tanımlanan veri objesi. İstekle gelir.
 * @param {function} geriCagirma İşlemler bittiği zaman çalışacan metot.
 */
işleyiciler._belirteçler.delete = function (veri, geriCagirma) {
    var no = typeof (veri.sorguDizgisiObjeleri.no) == 'string' && veri.sorguDizgisiObjeleri.no.trim().length == 20 ?
        veri.sorguDizgisiObjeleri.no.trim() : false;

    if (no) {
        _veri.oku('belirteçler', no, function (hata) {
            if (!hata) {
                _veri.sil('belirteçler', no, function (hata) {
                    if (!hata) {
                        geriCagirma(200, { "bilgi": "Belirteç başarıyla silindi :)" });
                    } else {
                        geriCagirma(500, { "bilgi": "Belirteç silme işlemi başarısız oldu :(" });
                    }
                });
            } else {
                geriCagirma(400, { "bilgi": "Silenecek belirteç bulunamadı :(" });
            }
        });
    } else {
        geriCagirma(400, { "bilgi": "Belirteç silmek için gereken alanlar eksin :(" });
    }
}

/**
 * Belirteçleri onaylamak için kullanılan metot.
 * @param {string} belirteçNo Tokenler için kimlik no'su
 * @param {string} telefon Kullanıcı telefon numarası
 * @param {Function} geriCagirma İşlemler bittikten sonra çalışacak metot. (belirteçOnaylandıMı)
 */
işleyiciler._belirteçler.belirteçOnaylama = function (belirteçNo, telefon, geriCagirma) {
    _veri.oku('belirteçler', belirteçNo, function (hata, belirteçVerisi) {
        if (!hata && belirteçVerisi) {
            if (belirteçVerisi.telefon == telefon && belirteçVerisi.ömür > Date.now()) {
                geriCagirma(true);
            } else {
                geriCagirma(false);
            }
        } else {
            geriCagirma(false);
        }
    });
};

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

işleyiciler.kontroller = function (veri, geriCagirma) {
    var uygunMetotlar = ["post", "get", "put", "delete"];

    if (uygunMetotlar.indexOf(veri.metot) > -1) {
        işleyiciler._kontroller[veri.metot](veri, geriCagirma);
    } else {
        geriCagirma(405, { "bilgi": "Kontrol işlemleri için metot uygun değil :(" });
    }
};

işleyiciler._kontroller = {};

/**
 * Belirteç alma metodu 
 * Not: localhost:3000/belirteçler?no=... 
 * @param {object} veri Index.js"te tanımlanan veri objesi. İstekle gelir.
 * @param {function} geriCagirma İşlemler bittiği zaman çalışacan metot.
 * @requires protokol, url, metot, başarıKodları, zamanAşımı
 */
işleyiciler._kontroller.post = function (veri, geriCagirma) {
    console.log("ccalistis");
    var protokol = typeof (veri.yükler.protokol) == 'string' &&
        ["http", "https"].indexOf(veri.yükler.protokol) > -1 ?
        veri.yükler.protokol.trim() : false;

    var url = typeof (veri.yükler.url) == 'string' &&
        veri.yükler.url.trim().length > 0 ?
        veri.yükler.url.trim() : false;

    var metot = typeof (veri.yükler.metot) == 'string' &&
        ["post", "get", "put", "delete"].indexOf(veri.yükler.metot) > -1 ?
        veri.yükler.metot : false;

    var başarıKodları = typeof (veri.yükler.başarıKodları) == 'object' &&
        veri.yükler.başarıKodları instanceof Array &&
        veri.yükler.başarıKodları.length > 0 ?
        veri.yükler.başarıKodları : false;

    var zamanAşımı = typeof (veri.yükler.zamanAşımı) == 'number' &&
        veri.yükler.zamanAşımı % 1 === 0 && // (?)
        veri.yükler.zamanAşımı >= 1 &&
        veri.yükler.zamanAşımı <= 5 ?
        veri.yükler.zamanAşımı : false;

    if (protokol && url && metot && başarıKodları && zamanAşımı) {
        // Sadece tanınmış kullanıclar kontrol yapabilsin diye belirtece bakıyoruz.
        var belirteç = typeof (veri.başlıklar.belirteç) == 'string' ?
            veri.başlıklar.belirteç : false;
        
        if (belirteç) {
            _veri.oku('belirteçler', belirteç, function (hata, belirteçVerisi){
                if (!hata && belirteçVerisi) {
                    var kullanıcıTel = belirteçVerisi.telefon;

                    _veri.oku('kullanıcılar', kullanıcıTel, function (hata, kullanıcıVerisi){
                        if (!hata && kullanıcıVerisi) {
                            var kullanıcıKontrolleri = typeof(kullanıcıVerisi.kontroller) == 'object' &&
                                kullanıcıVerisi.kontroller instanceof Array ?
                                kullanıcıVerisi.kontroller : [];
                            
                            // Kullanıcının kontrol hakkının olup olmadığı kontrol ediliyor.
                            if (kullanıcıKontrolleri.length < yapılandırma.enfazlaKontrol) {
                                // Rastgele kontrol no'su oluşturuyoruz.
                                var kontrolNo = yardımcılar.rastgeleDizgiOluştur(20);

                                var kontrolObjesi = {
                                    "no": kontrolNo,
                                    "kullanıcıTel": kullanıcıTel,
                                    "protokol": protokol,
                                    "url": url,
                                    "metot": metot,
                                    "başarıKodları": başarıKodları,
                                    "zamanAşımı": zamanAşımı
                                };

                                _veri.oluştur("kontroller", kontrolNo, kontrolObjesi, function (hata){
                                    if (!hata) {
                                        // İlk başta boş olduğundan, atama yapmamız gerekebilir. (?) [Array mi değil mi belli değil.]
                                        kullanıcıVerisi.kontroller = kullanıcıKontrolleri;
                                        kullanıcıVerisi.kontroller.push(kontrolNo);

                                        _veri.güncelle("kullanıcılar", kullanıcıTel, kullanıcıVerisi, function (hata){
                                            if (!hata) {
                                                geriCagirma(200, kontrolObjesi);
                                            } else {
                                                geriCagirma(500, {"bilgi": "Kullanıcı kontrol objesi güncellenemedi :("});
                                            }
                                        });
                                    } else {
                                        geriCagirma(500, {"bilgi": "Kontrol oluşturulamadı :("});
                                    }
                                });
                            } else {
                                geriCagirma (400, {"bilgi": "Bütün kontrol hakklarını (" + yapılandırma.enfazlaKontrol +") kullanmış bulunmaktasın :("});
                            }

                        } else {
                            geriCagirma(403, {"bilgi": "Kontrol işlemi (post) için kullanıcı düzgün okunamadı :("});
                        }
                    });
                } else {
                    geriCagirma(403, {"bilgi": "Kontrol işlemi (post) için gerekli belirteç düzgün okunamadı :("});
                }
            });
        } else {
            geriCagirma(400, {"bilgi": "Kontrol işlemi (post) yapabilmek için tanınmış bir kullanıcı değilsiniz :("});
        }
    } else {
        geriCagirma(400, {"bilgi": "Kontrol işlemi (post) için gerekli alanlar hatalı veya eksik :("});
    }
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