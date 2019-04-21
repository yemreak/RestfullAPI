"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.güncelle = güncelle;
exports.oluştur = oluştur;
exports.oku = oku;
exports.sil = sil;
exports.hepsiniTestEt = hepsiniTestEt;
exports.SMSTesti = SMSTesti;

var _veri = require("./veri");

var _yardMcLar = require("./yard\u0131mc\u0131lar");

/**
 * Veri güncelleme işlemi testi
 */
/**
 * Test
 * Açıklama: Test için kullanlan metotları içerir, debug için kullanılır.
 */

function güncelle() {
  (0, _veri.güncelle)("test", "yeniDosya", { foo: "hey" }, function (hata) {
    console.log(hata);
  });
}

/**
 * Veri dosyası oluşturma
 */
function oluştur() {
  (0, _veri.oluştur)("test", "yeniDosya", { test: "test" }, function (hata) {
    console.log(hata);
  });
}

/**
 * Dosyadan veri okuma testi
 */
function oku() {
  (0, _veri.oku)("test", "yeniDosya", function (hata, veri) {
    console.log(hata, veri);
  });
}

/**
 * Dosyayı silme testi
 */
function sil() {
  (0, _veri.sil)("test", "yeniDosya", function (hata) {
    console.log(hata);
  });
}

/**
 * Her testi adım adım yapma ve çıktıyı okuma
 */
function hepsiniTestEt() {
  oluştur();
  oku();
  güncelle();
  oku();
  sil();
  oku();
}

function SMSTesti() {
  (0, _yardMcLar.twilioSMSGönder)("5308977689", "Aylık 5000₺ kazanmak ister misin? :D", function (hata) {
    console.log(hata);
  });
}
//# sourceMappingURL=test.js.map