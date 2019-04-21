## Version 1.1
---------

### Gelen Özellikler


* Postman kullanımı
* Sunucuyu dürtme işlevi (ping)
* Yapılandırma dosyası, ortam değişkenleri
* Yanıtın içerik tipinin ayarlanması
* HTTP / HTTPS sunucuları dinleme
* OpenSSL ile sertifika oluşturma (HTTPS için) [HATALI]
    * Nasıl oluşturulduğuna bakmak için [buraya](https://www.cloudinsidr.com/content/how-to-install-the-most-recent-version-of-openssl-on-windows-10-in-64-bit/) tıklayabilirsin.

### Ek notlar

> Post işleminin daha özel yapıyor. Debug işlemleri için oldukça kullanışlı. İndirmek için [buraya](https://www.getpostman.com/apps) tıklayabilirsin.

> Curl kullanımının daha özelleştirilmiş hali

```CMD
curl localhost:3000
curl localhost:3000/foo
curl localhost:3000/foo/temp
curl localhost:3000/foo?kelime=selam
```


* Payloadların, headerların incelenmesi
> HTTP isteklerinin HTTP sunucusuna dize (string) olarak gelmesi
> Postman adlı uygulama ile body kısmına yazdığım raw içerisindeki metinlerdir.

* Request - Response yapısı
> Sunucuya istek göderme ve isteğe karşılık sunucunun tepki vermesi

## Önemli bilgiler
### Kodun içinde yorum satırları ile açıklanmıştır. Bazıları;

```javascript
// Sunucu her isteğe string ile karşılık vermeli
var sunucu = http.createServer(function (istek, yanıt) {
```

```Javascript
/**
 * Url ayrıştırma işlemi
 * Örnek: {... query: {}, pathname: '/ornek' ... } şeklinde bir url classı
 */
var ayrıştırılmışUrl = url.parse(istek.url, true);
```

```Javascript
/**
 * Sorgu kelimesini (query string) obje olarak almak.
 * Örnek: "curl localhost:3000/foo?test=testtir" ise { test : 'testtir' }
 * Not: "?test=testtir" sorgu dizesidir.
 */
var sorguDizesiObjeleri = ayrıştırılmışUrl.query;
```

```Javascript
/**
 * Ayrıştırılan urldeki pathname değişkenindeki değeri yol'a alıyorz.
 * Örnek: 'curl localhost:3000/ornek/test/' => yolu '/ornek/test/'
 * Not: sorgu dizeleri ele alınmaz ( 'curl localhost:3000/ornek?foo=bar' => yolu '/ornek' )
 */
var yol = ayrıştırılmışUrl.pathname;
```

```Javascript
/**
 * Replace içinde verilen işaretler çıkartılarak alınan yol. 
 * Örnek: '/ornek' -> 'ornek' veya '/ornek/test/' -> 'ornek/test/' olarak kırpılmakta. 
 * Not: Sadece ilk karakter kırpılıyor (?)
 */
var kırpılmışYol = yol.replace(/^\/+|\+$/g, '');
```

```Javascript
/**
 * HTTP metodu alma
 * Örnek: GET, POST, PUT, DELETE ...
 */
var metot = istek.method.toLowerCase();
```

```Javascript
/**
 * İsteğin içindeki başlıkları (header keys) obje olarak almak.
 * Not: Postman ile headers sekmesinde gönderilen anahtarları (keys) 
 * ve değerlerini (the value of them) içerir.
 */
var başlıklar = istek.headers;
```

```Javascript
istek.on('end', function () {
    // ...

    /**
     * Sonucu döndürme
     */
    yanıt.writeHead(durumKodu);
    yanıt.end(yükDizesi);
});
```
