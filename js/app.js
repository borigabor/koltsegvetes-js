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
var koltsegvetesVezerlo = (function() {
  var Kiadas = function(id, leiras, ertek) {
    this.id = id;
    this.leiras = leiras;
    this.ertek = ertek;
  }

  var Bevetel = function(id, leiras, ertek) {
    this.id = id;
    this.leiras = leiras;
    this.ertek = ertek;
  }

  var adat = {

    tetelek: {
      bev: [],
      kia: []
    },

    osszegek: {
      bev: 0,
      kia: 0
    }

  }

  return {
    tetelHozzaad: function(tip, lei, ert) {
      var ujTetel, ID;
      ID = 0;
      //ID létrehozása
      if(adat.tetelek[tip].length > 0) {
        ID = adat.tetelek[tip][adat.tetelek[tip].length - 1].id + 1;
      } else {
        ID = 0;
      }

      // Új kiadás vagy bevétel létrehozás
      if(tip === 'bev') {
        ujTetel = new Bevetel(ID, lei, ert);
      } else if(tip === 'kia') {
        ujTetel = new Kiadas(ID, lei, ert);
      }
      //Új tétel hozzáadása az adatszerkezethez
      adat.tetelek[tip].push(ujTetel);

      //Új tétel visszaadása
      return ujTetel;

    },
        teszt: function() {
            console.log(adat);
        }
  }
})();

//FELÜLET VEZÉRLŐ
var feluletVezerlo = (function () {
  var DOMelemek = {
    inputTipus: ".hozzaad__tipus",
    inputLeiras: ".hozzaad__leiras",
    inputErtek: ".hozzaad__ertek",
    inputGomb: ".hozzaad__gomb",
  };

  return {
    getInput: function () {
      return {
        tipus: document.querySelector(DOMelemek.inputTipus).value,
        leiras: document.querySelector(DOMelemek.inputLeiras).value,
        ertek: document.querySelector(DOMelemek.inputErtek).value,
      };
    },

    getDOMelemek: function () {
      return DOMelemek;
    }
  }
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

  var vezTetelHozzadas = function() {
    var input, ujTetelek;

    // 1. bevitt adatok megszerzése
    input = feluletVezerlo.getInput();
    console.log(input);
    //2. adatok átadása a kölcségvetés vezérlő modulnak
    ujTetelek = koltsegvetesVezerlo.tetelHozzaad(
      input.tipus,
      input.leiras,
      input.ertek
    );
    //3. femgjelenítése a felhasználói felületen UI

    //4. kölcségvetésnak az újraszámolása

    //5. az összeg megejelenítése a felületen
  };

  return {
    init: function () {
      esemenyKezeloBealit();
    }
  }
})(koltsegvetesVezerlo, feluletVezerlo);

vezerlo.init();


