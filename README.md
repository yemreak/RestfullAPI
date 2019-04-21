# RestfulAPI

> API tasarımı
> ES6 yazım kurallarıyla yazılmıştır.

## Gerekli paketlerin kurulumu

```CMD
npm install -g babel-cli babel-register
```

> ---
> Global olarak babel consol komutlarını ve işleyicisini ekler.
> * babel-cli: Konsoldan "babel" komutlarına izin verir.
> * babel-register: npm üzerinden require ile babel modüllerine erişimi sağlar.
> ---

## Gereksinimler

Alttaki dizinlerdeki `API KEY` kısmında **Twilio API KEY**, `TOKEN` kısmında **Twilio TOKEN** bilgilerinizi yazın.

- `v2.2/kütüphane/yapılandırma.js`
- `v2.0/kütüphane/yapılandırma.js`
- `ES5 (CommonJS)/v1.4/kütüphane/yapılandırma.js`
- `v2.0/dağıtım/kütüphane/yapılandırma.js.map`
- `v2.0/dağıtım/kütüphane/yapılandırma.js`

## Kod Hakkında Notlar

- İşleyiciler
  - Kullanıcılar: Kullanıcı işlemleri için kullanılır
  - Belirteçler: Kullanıcı sisteme giriş yaptığı zaman, oluşturulur. Kullanıcının giriş yapmış olduğunu ispatlar.

- Genel İşleyicis

  - sekme-ikonu.ico: Üstbilgi kalıbında, link ile bu uzantı çağırılıyor (localhost:3000/sekme-ikonu.ico)
  - uygulama.css: Üstbilgi kalıbında, script ile bu uzantı çağırılıyor (localhost:3000/genel/uygulama.css)
  - uygulama.css: Üstbilgi kalıbında, link ile bu uzantı çağırılıyor (localhost:3000/genel/uygulama.js)

> Genel objelerin yüklenmesi

  ```HTML
   <!-- Statik kaynaklar -->
  <link type="image/x-icon" rel="icon" href="sekme-ikonu.ico">
  <script type="text/javascript" charset="utf-8" src="genel/uygulama.js"></script>
  <link rel="stylesheet" type="text/css" href="genel/uygulama.css" />
  ```

  > Genel İşleyicisi adres çubuğundaki 'genel' kısmını kaldırdıktan sonra, istenen sayfa açılabilir. (replace)

  ```Javascript
  // İstenen varlık ismini alıyoruz
  var istenenVarlıkİsmi = veri.kırpılmışYol
  .replace('genel/', '').trim();
  ```

## Genel Notlar

- Kalıplar;

  > Kalıplardaki formların metotları işleyicilerin uygun metotlarına hitap eder.

  - Her yeni kalıp **yönlendirici** ile işleyiciye bağlanmalıdır.

  - **input id**'leri ile işleyicilerin aldıkları veri'nin objeleri aynı isimde olmak zorundadır.

  - **form id**'leri ile genel/uygulama.js(formResponseProcessor) deki formId'si aynı olmak zorundadır.

- Kontroller:

  > Bir sitenin aktif veya pasif olduğunu kontrol etmemize yarar. (google aktif, wikipedi pasif (kapalı, yanıt vemiyor))

- Metot kullanımı

  > **trim()**: Dizgideki boşlukları kaldırmak için kullanılır.

- Yönlendirici

  > URL'deki veriye göre uygun sayfaya yönlendirme yapılır.

  > Türkçe karakter **içeremezler**. (Postman'da hata veriyor.)

  > Örnek: _localhost:300/ornek_

- Yükler

  > Kullanıcı adı ve şifre girin gibi verilerin girildiği alanlardan gelen bilgiler.

  > Veri oluşturma işlemleri için kullanırlır.

  > Türkçe karakter **içerebilirler**.

  > Örnek: _localhost:300/ornek_ url'si altında body içindeki veriler.
  > { "yükler": "selam" }

- Sorgu Dizgisi Objeleri

  > Tamam butonuna basıldığında adres çubuğunun sonuna eklenen "?no=3" gibi bilgiler.

  > Güncelleme ve veri alma gibi işlemlerde kullanılır.

  > Türkçe karakter **içeremezler**. (Postman'da hata veriyor.)

  > Örnek: _localhost:300/ornek?no=231_

- Başlıklar

  > Kullanıcı giriş yaptığında, sayfalar arası gezinirken değişmeyen bilgiler.

  > Kontrol işlemleri için kullanılır. (belirteçler)

  > Türkçe karakter **içeremezler**. (Postman'da hata veriyor.)

  > Örnek: _localhost:300/ornek_ url'si altında header içindeki veriler.
  > { "key": "belirtec", "value": "0542502495040" }

## Ek notlar

- xhr.setRequestHeader

  > İsim değeri api varsayılan değerlerindendir, **türkçe karakter içeremez**. (belirtec [token yerine türkçe yapmıştım], Content-Type)

  ***

## Lisans ve Teferruatlar

Bu yazı **MIT** lisanslıdır. Lisanslar hakkında bilgi almak için [buraya](https://choosealicense.com/licenses/) bakmanda fayda var.

- [Website](https://yemreak.com)
- [Github](https://github.com/yedhrab)

~ Yunus Emre Ak
