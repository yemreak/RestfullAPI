/**
 * Uygulama için Front-End
 */

const uygulama = {};

// Yapılandırma
uygulama.yapılandırma = {
  oturumBelirteci: false
};

// AJAX istemcisi (Resftull API için)
uygulama.istemci = {};

/**
 *
 * @param {object} başlıklar HTML için başlıklar (headers)
 * @param {string} yol Adres çubuğu yolu
 * @param {string} metot HTML metodu (büyük & küçük harf fark etmez)
 * @param {object} sorguDizgisiObjesi Sorgu dizgileri ?no=12312 gibi (queryString)
 * @param {object} yukler Ek veriler
 * @param {function(number, object | boolean)} geriCagirma İşlemler bittiği zaman çalışan metot
 */
uygulama.istemci.istek = (
  başlıklar,
  yol,
  metot,
  sorguDizgisiObjesi,
  yukler,
  geriCagirma
) => {
  // Varsayılanları ayarlama
  başlıklar =
    typeof başlıklar == "object" && başlıklar !== null ? başlıklar : {};
  yol = typeof yol == "string" ? yol : "/";
  // HTTP istekeri için büyük harflerle metotlar yazılır
  metot =
    typeof metot == "string" &&
    ["POST", "GET", "PUT", "DELETE"].indexOf(metot.toUpperCase()) > -1
      ? metot.toUpperCase()
      : "GET";
  sorguDizgisiObjesi =
    typeof sorguDizgisiObjesi == "object" && sorguDizgisiObjesi !== null
      ? sorguDizgisiObjesi
      : {};
  yukler = typeof yukler == "object" && yukler !== null ? yukler : {};
  geriCagirma = typeof geriCagirma == "function" ? geriCagirma : false;

  // Gönderilen her bir sorgu dizgisi parametresini yola ekliyoruz
  let istekUrl = yol;
  let sayıcı = 0;

  for (let sorguAnahtarı in sorguDizgisiObjesi) {
    istekUrl += "?";
    sayıcı++;

    // ?
    if (sayıcı > 1) {
      istekUrl += "&";
    }

    istekUrl += `${sorguAnahtarı}=${sorguDizgisiObjesi[sorguAnahtarı]}`;
  }

  // HTTP isteğini JSON tipine dönüştürme
  const xhr = new XMLHttpRequest();
  xhr.open(metot, istekUrl, true);
  xhr.setRequestHeader("Content-Type", "application/json");

  // Her gönderilen başlığı isteğe ekliyoruz
  for (let başlıkAnahtarı in başlıklar) {
    if (başlıklar.hasOwnProperty(başlıkAnahtarı)) {
      xhr.setRequestHeader(başlıkAnahtarı, başlıklar[başlıkAnahtarı]);
    }
  }

  // Eğer zaten oturum beliteci varsa, bunları başlıklara ekliyoruz (varsayılan isim olur 'belirteç' olmaz) (Kimliğe dikkat et)
  if (uygulama.yapılandırma.oturumBelirteci) {
    xhr.setRequestHeader(
      "belirtec",
      uygulama.yapılandırma.oturumBelirteci.kimlik
    );
  }

  // İstek geri geldiğinde, yanıtı ele alıyoruz
  xhr.onreadystatechange = () => {
    // İstek yapıldıysa
    if (xhr.readyState == XMLHttpRequest.DONE) {
      const durumKodu = xhr.status;
      const döndürülenYanıt = xhr.responseText;

      // Sonucu ekrana basma
      console.log("Döndürülen Yanıt:", döndürülenYanıt);

      // Eğer gerekli sie geri çğaırma
      if (geriCagirma) {
        try {
          const işlenmişYanıt = JSON.parse(döndürülenYanıt);
          geriCagirma(durumKodu, işlenmişYanıt);
        } catch (e) {
          geriCagirma(durumKodu, false);
        }
      }
    }
  };

  // Yükleri JSON olarak gönderme
  const yükDizgisi = JSON.stringify(yukler);
  console.log("Yükler: ", yükDizgisi);
  xhr.send(yükDizgisi);
};

// Bind the logout button
uygulama.bindLogoutButton = function() {
  document
    .getElementById("logoutButton")
    .addEventListener("click", function(e) {
      // Stop it from redirecting anywhere
      e.preventDefault();

      // Log the user out
      uygulama.logUserOut();
    });
};

// Log the user out then redirect them
uygulama.logUserOut = function() {
  // Get the current token id
  var tokenId =
    typeof uygulama.yapılandırma.oturumBelirteci.kimlik == "string"
      ? uygulama.yapılandırma.oturumBelirteci.kimlik
      : false;

  // Send the current token to the tokens endpoint to delete it
  var queryStringObject = {
    kimlik: tokenId
  };
  uygulama.istemci.istek(
    undefined,
    "api/belirtecler",
    "DELETE",
    queryStringObject,
    undefined,
    function(statusCode, responsePayload) {
      // Set the uygulama.config token as false
      uygulama.setSessionToken(false);

      // Send the user to the logged out page
      window.location = "/oturum/sil";
    }
  );
};

// Form'u bağlama
uygulama.formlarıBağla = function() {
  if (document.querySelector("form")) {
    const tümFormlar = document.querySelectorAll("form");

    // Her bir formu işleme
    for (const form of tümFormlar) {
      form.addEventListener("submit", hata => {
        // Stop it from submitting
        hata.preventDefault();

        // Form bilgilerini alma
        const formNo = form.id;
        const yol = form.action;
        let metot = form.method.toUpperCase();
        let yükler = {};
        const öğeler = form.elements;

        // Form öğelerindeki verileri, yüklere ekleme
        for (const öğe of öğeler) {
          if (öğe.type !== "submit") {
            // Öğenin sınıflarını alma (Sınıf, veri tipi belirlemek için gerekli)
            const öğeSınıfı =
              typeof öğe.classList.value == "string" &&
              öğe.classList.value.length > 0
                ? öğe.classList.value
                : "";

            // Öğe tipini belirleyip, değeri atama
            const öğeDeğeri =
              öğe.type == "checkbox" && öğeSınıfı.indexOf("multiselect") == -1
                ? öğe.checked
                : öğeSınıfı.indexOf("intval") == -1
                  ? öğe.value
                  : parseInt(öğe.value);

            let öğeİsmi = öğe.name;

            if (öğeİsmi == "_method") {
              metot = öğeDeğeri;
            } else {
              // Öğe ismi httpMetot olanın adını metot diye çeviriyoruz
              if (öğeİsmi == "httpMetot") {
                öğeİsmi = "metot";
              }
              // Create an payload field named "id" if the elements name is actually uid
              else if (öğeİsmi == "uid") {
                öğeİsmi = "kimlik";
              }

              // Eğer öğe çoklu seçilebilirse, her seçimi diziye ekliyoruz
              if (öğeSınıfı.indexOf("multiselect") > -1) {
                if (öğe.checked) {
                  yükler[öğeİsmi] =
                    typeof yükler[öğeİsmi] == "object" &&
                    yükler[öğeİsmi] instanceof Array
                      ? yükler[öğeİsmi]
                      : [];
                  yükler[öğeİsmi].push(öğeDeğeri);
                }
              } else {
                yükler[öğeİsmi] = öğeDeğeri;
              }
            }
          }
        }

        // If the method is DELETE, the payload should be a queryStringObject instead (?)
        var sorguDizgisiObjesi = metot == "DELETE" ? yükler : {};

        // Hide the error message (if it's currently shown due to a previous error)
        document.querySelector("#" + formNo + " .formError").style.display =
          "none";

        // Hide the success message (if it's currently shown due to a previous error)
        if (document.querySelector("#" + formNo + " .formSuccess")) {
          document.querySelector("#" + formNo + " .formSuccess").style.display =
            "none";
        }

        // Call the API
        uygulama.istemci.istek(
          undefined,
          yol,
          metot,
          sorguDizgisiObjesi,
          yükler,
          function(durumKodu, yanıtYükleri) {
            // Eğer gerekliyse formda hata gösterme
            if (durumKodu !== 200) {
              if (durumKodu == 403) {
                // Kullanıcı oturumunu kapatma
                uygulama.logUserOut();
              } else {
                // Varsa API tarafından belirlenen hatayı gösterme yoksa varsayılan hata mesajını gösterme
                var hata =
                  typeof yanıtYükleri.bilgi == "string"
                    ? yanıtYükleri.bilgi
                    : "Bilinmeyen bir hata oluştu, lütfen tekrar deneyin :(";

                // FormError alanına hata mesajını yazma
                document.querySelector(
                  "#" + formNo + " .formError"
                ).innerHTML = hata;

                // FormError alanını görünür kılmak
                document.querySelector(
                  "#" + formNo + " .formError"
                ).style.display = "block";
              }
            } else {
              // If successful, send to form response processor
              uygulama.formResponseProcessor(formNo, yükler, yanıtYükleri);
            }
          }
        );
      });
    }
  }
};

// Form response processor
uygulama.formResponseProcessor = function(
  formId,
  requestPayload,
  responsePayload
) {
  var functionToCall = false;
  // If account creation was successful, try to immediately log the user in
  if (formId == "hesapOluştur") {
    // Take the telefonNo and password, and use it to log the user in
    var newPayload = {
      telefonNo: requestPayload.telefonNo,
      şifre: requestPayload.şifre
    };

    uygulama.istemci.istek(
      undefined,
      "api/belirtecler",
      "POST",
      undefined,
      newPayload,
      function(newStatusCode, newResponsePayload) {
        // Display an error on the form if needed
        if (newStatusCode !== 200) {
          // Set the formError field with the error text
          document.querySelector("#" + formId + " .formError").innerHTML =
            "Üzgünüm, bir hata oluştu :( Lütfen tekrar deneyin";

          // Show (unhide) the form error field on the form
          document.querySelector("#" + formId + " .formError").style.display =
            "block";
        } else {
          // If successful, set the token and redirect the user
          uygulama.setSessionToken(newResponsePayload);
          window.location = "/kontroller/hepsi";
        }
      }
    );
  }
  // If login was successful, set the token in localstorage and redirect the user
  else if (formId == "oturumOluştur") {
    uygulama.setSessionToken(responsePayload);
    window.location = "/kontroller/hepsi";
  } else if (formId == "hesapSil") {
    uygulama.logUserOut(false);
    window.location = "hesap/sil";
  } else if (formId == "kontrolOluştur") {
    window.location = "kontroller/hepsi";
  } else if (formId == "kontrolSil") {
    window.location = "kontroller/hepsi";
  }

  // If forms saved successfully and they have success messages, show them
  var formsWithSuccessMessages = [
    "hesapDüzenleKimlik",
    "hesapDüzenleŞifre",
    "kontrolDüzenle"
  ];
  if (formsWithSuccessMessages.indexOf(formId) > -1) {
    document.querySelector("#" + formId + " .formSuccess").style.display =
      "block";
  }
};

// Get the session token from localstorage and set it in the uygulama.yapılandırma object
uygulama.getSessionToken = function() {
  var tokenString = localStorage.getItem("token");
  if (typeof tokenString == "string") {
    try {
      var token = JSON.parse(tokenString);
      uygulama.yapılandırma.oturumBelirteci = token;
      if (typeof token == "object") {
        uygulama.setLoggedInClass(true);
      } else {
        uygulama.setLoggedInClass(false);
      }
    } catch (e) {
      uygulama.yapılandırma.oturumBelirteci = false;
      uygulama.setLoggedInClass(false);
    }
  }
};

// Set (or remove) the loggedIn class from the body
uygulama.setLoggedInClass = function(add) {
  var target = document.querySelector("body");
  if (add) {
    target.classList.add("loggedIn");
  } else {
    target.classList.remove("loggedIn");
  }
};

// Set the session token in the uygulama.yapılandırma object as well as localstorage
uygulama.setSessionToken = function(token) {
  uygulama.yapılandırma.oturumBelirteci = token;
  var tokenString = JSON.stringify(token);
  localStorage.setItem("token", tokenString);
  if (typeof token == "object") {
    uygulama.setLoggedInClass(true);
  } else {
    uygulama.setLoggedInClass(false);
  }
};

// Renew the token
uygulama.renewToken = function(callback) {
  var currentToken =
    typeof uygulama.yapılandırma.oturumBelirteci == "object"
      ? uygulama.yapılandırma.oturumBelirteci
      : false;
  if (currentToken) {
    // Update the token with a new expiration
    var payload = {
      kimlik: currentToken.kimlik,
      süreUzatma: true
    };
    uygulama.istemci.istek(
      undefined,
      "api/belirtecler",
      "PUT",
      undefined,
      payload,
      function(statusCode, responsePayload) {
        // Display an error on the form if needed
        if (statusCode == 200) {
          // Get the new token details
          var queryStringObject = { kimlik: currentToken.kimlik };
          uygulama.istemci.istek(
            undefined,
            "api/belirtecler",
            "GET",
            queryStringObject,
            undefined,
            function(statusCode, responsePayload) {
              // Display an error on the form if needed
              if (statusCode == 200) {
                uygulama.setSessionToken(responsePayload);
                callback(false);
              } else {
                uygulama.setSessionToken(false);
                callback(true);
              }
            }
          );
        } else {
          uygulama.setSessionToken(false);
          callback(true);
        }
      }
    );
  } else {
    uygulama.setSessionToken(false);
    callback(true);
  }
};

// Load data on the page
uygulama.loadDataOnPage = function() {
  // Get the current page from the body class
  var bodyClasses = document.querySelector("body").classList;
  var primaryClass = typeof bodyClasses[0] == "string" ? bodyClasses[0] : false;

  console.log("Prim Class: ", primaryClass);
  // Logic for account settings page
  if (primaryClass == "hesapDüzenle") {
    uygulama.loadAccountEditPage();
  } else if (primaryClass == "kontrolleriListele") {
    uygulama.loadChecksListPage();
  } else if (primaryClass == "kontrolDüzenle") {
    uygulama.loadChecksEditPage();
  }
};

// Load the account edit page specifically
uygulama.loadAccountEditPage = function() {
  // Get the telefonNo number from the current token, or log the user out if none is there
  var telefonNo =
    typeof uygulama.yapılandırma.oturumBelirteci.telefonNo == "string"
      ? uygulama.yapılandırma.oturumBelirteci.telefonNo
      : false;
  if (telefonNo) {
    // Fetch the user data
    var queryStringObject = {
      telefonNo: telefonNo
    };
    uygulama.istemci.istek(
      undefined,
      "api/kullanicilar",
      "GET",
      queryStringObject,
      undefined,
      function(statusCode, responsePayload) {
        if (statusCode == 200) {
          // Put the data into the forms as values where needed
          document.querySelector("#hesapDüzenleKimlik .firstNameInput").value =
            responsePayload.isim;
          document.querySelector("#hesapDüzenleKimlik .lastNameInput").value =
            responsePayload.soyİsim;
          document.querySelector(
            "#hesapDüzenleKimlik .displayPhoneInput"
          ).value = responsePayload.telefonNo;

          // Put the hidden telefonNo field into both forms
          var hiddenPhoneInputs = document.querySelectorAll(
            "input.hiddenPhoneNumberInput"
          );
          for (var i = 0; i < hiddenPhoneInputs.length; i++) {
            hiddenPhoneInputs[i].value = responsePayload.telefonNo;
          }
        } else {
          // If the istek comes back as something other than 200, log the user our (on the assumption that the api is temporarily down or the users token is bad)
          uygulama.logUserOut();
        }
      }
    );
  } else {
    uygulama.logUserOut();
  }
};

// Load the dashboard page specifically
uygulama.loadChecksListPage = function() {
  // Get the telefonNo number from the current token, or log the user out if none is there
  var telefonNo =
    typeof uygulama.yapılandırma.oturumBelirteci.telefonNo == "string"
      ? uygulama.yapılandırma.oturumBelirteci.telefonNo
      : false;
  if (telefonNo) {
    // Fetch the user data
    var queryStringObject = {
      telefonNo: telefonNo
    };
    uygulama.istemci.istek(
      undefined,
      "api/kullanicilar",
      "GET",
      queryStringObject,
      undefined,
      function(statusCode, responsePayload) {
        if (statusCode == 200) {
          // Determine how many checks the user has
          const allChecks =
            typeof responsePayload.kontrolKimlikleri == "object" &&
            responsePayload.kontrolKimlikleri instanceof Array &&
            responsePayload.kontrolKimlikleri.length > 0
              ? responsePayload.kontrolKimlikleri
              : [];
          if (allChecks.length > 0) {
            // Show each created check as a new row in the table
            allChecks.forEach(function(checkId) {
              // Get the data for the check
              const newQueryStringObject = {
                kimlik: checkId
              };
              uygulama.istemci.istek(
                undefined,
                "api/kontroller",
                "GET",
                newQueryStringObject,
                undefined,
                function(statusCode, responsePayload) {
                  if (statusCode == 200) {
                    var checkData = responsePayload;
                    // Make the check data into a table row
                    var table = document.getElementById("checksListTable");
                    var tr = table.insertRow(-1);
                    tr.classList.add("checkRow");
                    var td0 = tr.insertCell(0);
                    var td1 = tr.insertCell(1);
                    var td2 = tr.insertCell(2);
                    var td3 = tr.insertCell(3);
                    var td4 = tr.insertCell(4);
                    td0.innerHTML = responsePayload.metot.toUpperCase();
                    td1.innerHTML = responsePayload.protokol + "://";
                    td2.innerHTML = responsePayload.url;
                    var state =
                      typeof responsePayload.durum == "string"
                        ? responsePayload.durum
                        : "unknown";
                    td3.innerHTML = state;
                    td4.innerHTML =
                      '<a href="/kontrol/duzenle?id=' +
                      responsePayload.kimlik +
                      '">Göster / Düzenle / Sil</a>';
                  } else {
                    console.log("Error trying to load check ID: ", checkId);
                  }
                }
              );
            });

            if (allChecks.length < 5) {
              // Show the createCheck CTA
              document.getElementById("createCheckCTA").style.display = "block";
            }
          } else {
            // Show 'you have no checks' message
            document.getElementById("noChecksMessage").style.display =
              "table-row";

            // Show the createCheck CTA
            document.getElementById("createCheckCTA").style.display = "block";
          }
        } else {
          // If the istek comes back as something other than 200, log the user our (on the assumption that the api is temporarily down or the users token is bad)
          uygulama.logUserOut();
        }
      }
    );
  } else {
    uygulama.logUserOut();
  }
};

// Load the checks edit page specifically
uygulama.loadChecksEditPage = function() {
  // Get the check id from the query string, if none is found then redirect back to dashboard
  var id =
    typeof window.location.href.split("=")[1] == "string" &&
    window.location.href.split("=")[1].length > 0
      ? window.location.href.split("=")[1]
      : false;
  if (id) {
    // Fetch the check data
    var queryStringObject = {
      kimlik: id
    };
    uygulama.istemci.istek(
      undefined,
      "api/kontroller",
      "GET",
      queryStringObject,
      undefined,
      function(statusCode, responsePayload) {
        if (statusCode == 200) {
          // Put the hidden id field into both forms
          var hiddenIdInputs = document.querySelectorAll("input.hiddenIdInput");
          for (var i = 0; i < hiddenIdInputs.length; i++) {
            hiddenIdInputs[i].value = responsePayload.kimlik;
          }

          // Put the data into the top form as values where needed
          document.querySelector("#kontrolDüzenle .displayIdInput").value =
            responsePayload.kimlik;
          document.querySelector("#kontrolDüzenle .displayStateInput").value =
            responsePayload.durum;
          document.querySelector("#kontrolDüzenle .protocolInput").value =
            responsePayload.protokol;
          document.querySelector("#kontrolDüzenle .urlInput").value =
            responsePayload.url;
          document.querySelector("#kontrolDüzenle .methodInput").value =
            responsePayload.metot;
          document.querySelector("#kontrolDüzenle .timeoutInput").value =
            responsePayload.zamanAşımı;
          var successCodeCheckboxes = document.querySelectorAll(
            "#kontrolDüzenle input.successCodesInput"
          );
          for (var i = 0; i < successCodeCheckboxes.length; i++) {
            if (
              responsePayload.başarıKodları.indexOf(
                parseInt(successCodeCheckboxes[i].value)
              ) > -1
            ) {
              successCodeCheckboxes[i].checked = true;
            }
          }
        } else {
          // If the istek comes back as something other than 200, redirect back to dashboard
          window.location = "/kontroller/hepsi";
        }
      }
    );
  } else {
    window.location = "/kontroller/hepsi";
  }
};

// Loop to renew token often
uygulama.tokenRenewalLoop = function() {
  setInterval(function() {
    uygulama.renewToken(function(err) {
      if (!err) {
        console.log("Oturum belirteci başarıyla yenilendi :) @ " + Date.now());
      }
    });
  }, 1000 * 60);
};

// Init (bootstrapping)
uygulama.init = function() {
  // Bind all form submissions
  uygulama.formlarıBağla();

  // Bind logout logout button
  uygulama.bindLogoutButton();

  // Get the token from localstorage
  uygulama.getSessionToken();

  // Renew token
  uygulama.tokenRenewalLoop();

  // Sayfadaki verileri yükleme
  uygulama.loadDataOnPage();
};

// Call the init processes after the window loads
window.onload = function() {
  uygulama.init();
};
