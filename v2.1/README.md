# Version 2 1

---------

## Sorunlu özellikler

> HTTPS hala sıkıntılıdır.

### Değişiklikler

* Yapı değişikliği ve güncelleme

* Raporlama özelliği

  * Sıkıştırılmış raporlarama

* Hata ayıklama özelliği (debug)

  * Kullanma şekli:
    ```bash
    SET NODE_DEBUG=<dosya ismi>
    ```
  * Örnek kullanım
    ```bash
    SET NODE_DEBUG=sunucu
    ```

* Renkli konsol çıktıları

### Scriptler

```bash
npm run start
```

> Kodu derleme ve çalıştırma

```bash
npm run build
```

> Kodu derleme ve derlenmiş dosyaları kaydetme

```bash
npm run rebuild
```

> Kodu yeniden derleme ve eski dosyaları silerek, güncelleme
