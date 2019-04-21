/* beautify preserve:start */
import { başlat as sunucuyuBaşat } from "./kütüphane/sunucu";
import { başlat as işçileriBaşlat } from './kütüphane/işçiler';
/* beautify preserve:end */

const uygulama = {};

uygulama.başlat = () => {
  // Sunucuyu başlatma
  sunucuyuBaşat();

  // İşçileri başlatma
  işçileriBaşlat();
}

uygulama.başlat();

export default uygulama;