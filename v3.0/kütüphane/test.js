/**
 * Test
 * Açıklama: Test için kullanlan metotları içerir, debug için kullanılır.
 */

import {
  güncelle as _güncelle,
  oluştur as _oluştur,
  oku as _oku,
  sil as _sil
} from "./veri";
import { twilioSMSGönder } from "./yardımcılar";

/**
 * Veri güncelleme işlemi testi
 */
export function güncelle() {
  _güncelle("test", "yeniDosya", { foo: "hey" }, function(hata) {
    console.log(hata);
  });
}

/**
 * Veri dosyası oluşturma
 */
export function oluştur() {
  _oluştur("test", "yeniDosya", { test: "test" }, function(hata) {
    console.log(hata);
  });
}

/**
 * Dosyadan veri okuma testi
 */
export function oku() {
  _oku("test", "yeniDosya", function(hata, veri) {
    console.log(hata, veri);
  });
}

/**
 * Dosyayı silme testi
 */
export function sil() {
  _sil("test", "yeniDosya", function(hata) {
    console.log(hata);
  });
}

/**
 * Her testi adım adım yapma ve çıktıyı okuma
 */
export function hepsiniTestEt() {
  oluştur();
  oku();
  güncelle();
  oku();
  sil();
  oku();
}

export function SMSTesti() {
  twilioSMSGönder(
    "5308977689",
    "Aylık 5000₺ kazanmak ister misin? :D",
    function(hata) {
      console.log(hata);
    }
  );
}
