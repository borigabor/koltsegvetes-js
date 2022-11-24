// Dokumentáció készítése, project terv
/* eseménykezelő
    adatok megszerzése
    tétel hozzáadása a megfelelő adatstruktúrához
    tétel hozzáadása a felülethez
    költségvetés újraszámítása
    költségvetés frissitése a képernyőn
     */

/*  var koltsegvetesVezerlo = (function(){
         var a = 10;
         var osszead = function(b) { 
            return a + b;
         }
         return {
            teszt: function(x) {
                console.log(osszead(x));
            }
         }
    })();  //Ez a változóz egy azzonal meghívódó fv kifejezés lesz és egy objektumot fog visszadni nekünk (IIFE)

    var feluletVezerlo = (function() {

    })();

    var vezerlo = (function(koltsegvetesVez, feluletVez) { // feladata hogy a másik két modul között megtermtse az összeköttetést

    })(koltsegvetesVezerlo, feluletVezerlo);*/

//KÖLTSÉGVETÉS VEZÉRLŐ
var koltsegvetesVezerlo = (function () {
  var Kiadas = function (id, leiras, ertek) {
    this.id = id;
    this.leiras = leiras;
    this.ertek = ertek;
  };

  var Bevetel = function (id, leiras, ertek) {
    this.id = id;
    this.leiras = leiras;
    this.ertek = ertek;
  };

  var adat = {
    tetelek: {
      bev: [],
      kia: [],
    },

    osszegek: {
      bev: 0,
      kia: 0,
    },
  };

  return {
    tetelHozzaad: function (tip, lei, ert) {
      var ujTetel, ID;
      ID = 0;
      //ID létrehozása
      if (adat.tetelek[tip].length > 0) {
        ID = adat.tetelek[tip][adat.tetelek[tip].length - 1].id + 1;
      } else {
        ID = 0;
      }

      // Új kiadás vagy bevétel létrehozás
      if (tip === "bev") {
        ujTetel = new Bevetel(ID, lei, ert);
      } else if (tip === "kia") {
        ujTetel = new Kiadas(ID, lei, ert);
      }
      //Új tétel hozzáadása az adatszerkezethez
      adat.tetelek[tip].push(ujTetel);

      //Új tétel visszaadása
      return ujTetel;
    },
    teszt: function () {
      console.log(adat);
    },
  };
})();

//FELÜLET VEZÉRLŐ
var feluletVezerlo = (function () {
  var DOMelemek = {
    inputTipus: ".hozzaad__tipus",
    inputLeiras: ".hozzaad__leiras",
    inputErtek: ".hozzaad__ertek",
    inputGomb: ".hozzaad__gomb",
    bevetelTarolo: ".bevetelek__lista",
    kiadasTarolo: ".kiadasok__lista",
  };

  return {
    getInput: function () {
      return {
        tipus: document.querySelector(DOMelemek.inputTipus).value,
        leiras: document.querySelector(DOMelemek.inputLeiras).value,
        ertek: parseInt(document.querySelector(DOMelemek.inputErtek).value),
      };
    },

    getDOMelemek: function () {
      return DOMelemek;
    },

    tetelMejelenites: function (obj, tipus) {
      //HTML megirása
      var html, ujHtml, elem;
      console.log(obj);
      console.log(tipus);
      if (tipus === "bev") {
        elem = DOMelemek.bevetelTarolo;

        html =
          '<div class="tetel clearfix" id="bevetel-%id%"><div class="tetel__leiras">%leiras%</div><div class="right clearfix"><div class="tetel__ertek">%ertek%</div><div class="tetel__torol"><button class="tetel__torol--gomb"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (tipus === "kia") {
        elem = DOMelemek.kiadasTarolo;

        html =
          '<div class="tetel clearfix" id="kiadas-%id%"><div class="tetel__leiras">%leiras%</div><div class="right clearfix"><div class="tetel__ertek">%ertek%</div><div class="tetel__szazalek">21%</div><div class="tetel__torol"><button class="tetel__torol--gomb"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      //HTML feltöltése adatokkal
      ujHtml = html.replace("%id%", obj.id);
      ujHtml = ujHtml.replace("%leiras%", obj.leiras);
      ujHtml = ujHtml.replace("%ertek%", obj.ertek);

      //HTML megjelenítése, hozzáadása a DOM-hoz
      document.querySelector(elem).insertAdjacentHTML("beforeend", ujHtml);
    },

    urlapTorles: function () {
      var mezok, mezokTomb;

      mezok = document.querySelectorAll(
        DOMelemek.inputLeiras + "," + DOMelemek.inputErtek
      );
      mezokTomb = Array.prototype.slice.call(mezok);

      mezokTomb.forEach(function (currentValue, index, array) {
        currentValue.value = "";
      });
      mezokTomb[0].focus(); // visszaugrik a focus az első beviteli mezőre
    },
  };
})();

//ALKALMAZÁS VEZÉRLŐ
var vezerlo = (function (koltsegvetesVez, feluletVez) {
  var esemenyKezeloBealit = function () {
    var DOM = feluletVezerlo.getDOMelemek();

    document
      .querySelector(DOM.inputGomb)
      .addEventListener("click", vezTetelHozzadas);

    document.addEventListener("keydown", function (event) {
      if (event.key !== undefined && event.key === "Enter") {
        vezTetelHozzadas();
      } else if (event.keycode !== undefined && event.keycode === 13) {
        vezTetelHozzadas();
      }
    });
  };

  var osszegfrissitese = function () {
    //1. kölcségvetésnak az újraszámolása
    // 2 összeg visszadása
    //3. az összeg megejelenítése a felületen
  };

  var vezTetelHozzadas = function () {
    var input, ujTetelek;

    // 1. bevitt adatok megszerzése
    input = feluletVezerlo.getInput();

    if (input.leiras !== "" && !isNaN(input.ertek) && input.ertek > 0) {
      //2. adatok átadása a kölcségvetés vezérlő modulnak
      ujTetelek = koltsegvetesVezerlo.tetelHozzaad(
        input.tipus,
        input.leiras,
        input.ertek
      );
      //3. femgjelenítése a felhasználói felületen UI
      feluletVezerlo.tetelMejelenites(ujTetelek, input.tipus);
      // 4 mezok torlése
      feluletVezerlo.urlapTorles();

      // 5 költségvetés ujraszámolása és frissitése a felületen
      osszegfrissitese();
    }
  };

  return {
    init: function () {
      esemenyKezeloBealit();
    },
  };
})(koltsegvetesVezerlo, feluletVezerlo);

vezerlo.init();
