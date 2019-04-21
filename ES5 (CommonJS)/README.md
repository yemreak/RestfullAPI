# RestfulAPI

> API tasarımı
> ES5 (CommonJs) kurallarıyla yazılmıştır.

## Genel Notlar

* Metot kullanımı
  > **trim()**: Dizgideki boşlukları kaldırmak için kullanılır.

* Yönlendirici
  > URL'deki veriye göre uygun sayfaya yönlendirme yapılır.

  > Türkçe karakter **içeremezler**. (Postman'da hata veriyor.)

  > Örnek: *localhost:300/ornek*

* Yükler
  > Kullanıcı adı ve şifre girin gibi verilerin girildiği alanlardan gelen bilgiler.

  > Veri oluşturma işlemleri için kullanırlır.

  > Türkçe karakter **içerebilirler**.

  > Örnek: *localhost:300/ornek* url'si altında body içindeki veriler.
  > { "yükler": "selam" }

* Sorgu Dizgisi Objeleri
  > Tamam butonuna basıldığında adres çubuğunun sonuna eklenen "?no=3" gibi bilgiler.
  
  > Güncelleme ve veri alma gibi işlemlerde kullanılır.

  > Türkçe karakter **içeremezler**. (Postman'da hata veriyor.)

  > Örnek: *localhost:300/ornek?no=231*

* Başlıklar
  > Kullanıcı giriş yaptığında, sayfalar arası gezinirken değişmeyen bilgiler.
  
  > Kontrol işlemleri için kullanılır. (belirteçler)

  > Türkçe karakter **içeremezler**. (Postman'da hata veriyor.)

  > Örnek: *localhost:300/ornek* url'si altında header içindeki veriler.
  > { "key": "belirtec", "value": "0542502495040" }
-----

## Version 1.4
---------

### Sorunlu özellikler 
> HTTPS hala sıkıntılıdır.

### Gelen Özellikler

* Baştan aşağı kod yapısı düzenlendi.

* Geniş türkçeleştirme.

* Header'lardaki türkçe karakter sorununa özel, türkçeye özgü karakterler kaldırıldı.

* Kontroller eklendi & güncellendi.
  * Post
  * Get
  * Put
  * Delete

* Twilio ile SMS atma
  


## Version 1.3.1
---------

### Sorunlu özellikler 
> HTTPS hala sıkıntılıdır.

### Gelen Özellikler

* Kontrol servisi (/check) eklenmiştir.

### Kontrol (Check) nedir? 

> Basit olarak: URL kontrolü için kullanılır.
> Kullanıcılar için 5 taneye kadar kontrole izin vereceğiz. (?)


## Önemli bilgiler

> **Simge** değişken ismi **belirteç** olarak değiştirilmiştir.

> Kodun içinde yorum satırları ile açıklanmıştır.


## Version 1.3
---------

### Sorunlu özellikler 
> HTTPS hala sıkıntılıdır.

### Gelen Özellikler

* Dosya işlemleri belirteç ile şekillendirilmiştir.

## Önemli bilgiler

> **Simge** değişken ismi **belirteç** olarak değiştirilmiştir.

> Kodun içinde yorum satırları ile açıklanmıştır.


## Version 1.2
---------

### Sorunlu özellikler 
> HTTPS hala sıkıntılıdır.

### Gelen Özellikler

* Dosya işlemleri
    * Oluşturma
    * Silme
    * Güncelleme
    * Okuma

* Simge (?) (token) işlemleri temeli
    * Oluşturma
    * Silme
    * Güncelleme
    * Okuma

* Fonksiyonların parametrelerindeki türkçe karakterler kaldırıldı.
> Dökümantasyonlarda hata oluşuyordu. (Türkçe karakter algılama sorunu)

* Dosya işlemlerini test eden **test.js** dosyası.

* Kullanıcı işlemleri
    * Kullanıcıların olduğu dosya
        > .data/kullanıcılar
    * Kullanıcı ekleme 
        * Telefon no ile indeksleme (ID yerine)


## Ek notlar
* Dosya işlemlerinin gerçekleştiği dosyanın dizini;

    * **.../.data/test/yeniDosya.json**

* Test dosyası sadece test amaçlı kullanılır.

## Önemli bilgiler

> Detaylar kodun içinde yorum satırları ile açıklanmıştır.


## Version 1.1
---------

### Gelen Özellikler



* Postman kullanımı
* Sunucuyu dürtme işlevi (ping)
* Yapılandırma dosyası, ortam değişkenleri
* Yanıtın içerik tipinin ayarlanması
* HTTP / HTTPS sunucuları dinleme
* OpenSSL ile sertifika oluşturma (HTTPS için)
    * Nasıl oluşturulduğuna bakmak için [buraya](https://knowledge.digicert.com/solution/SO27347.html) tıklayabilirsin.

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


## Version 1.0.2
---------

* Sunucuya http isteği geldiği zaman, hangi http metodunun istenildiğini anlama
  * Post
  * Get
  * Put
  * Delete
  * Head

* Metod alınırken **kesinlikle** küçük harflere çevrilmeli 
```javascript
// HTTP metodu alma
var metod = istek.method.toLowerCase();
```
* Sunucuya gelen sorgu kelimesini algılama (query string)

```CMD
curl localhost:3000/foo?kelime=selam
```
> sorguKelimesiObjesi = { kelime: 'selam' } olacaktır.

## Version 1.0.1
---------

* Kullanıcının isteklerinin basitçe nasıl çalıştığına bakıldı.

## Version 1.0.0
---------

* Basit bir şekilde sunucuya bağlanma işlemi. (Giriş)
* require ile http kullanımı
