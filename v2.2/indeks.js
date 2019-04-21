import { başlat as sunucuyuBaşat } from "./kütüphane/sunucu";
import { başlat as işçileriBaşlat } from './kütüphane/işçiler';


const uygulama = {};

uygulama.başlat = () => {
  // Sunucuyu başlatma
  sunucuyuBaşat();

  // İşçileri başlatma
  işçileriBaşlat();
}

uygulama.başlat();

export default uygulama;