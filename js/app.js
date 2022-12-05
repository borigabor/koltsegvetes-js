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
    this.szazalek = -1;
  };

  Kiadas.prototype.szazalekSzamitas = function(osszBevetel) {

    if(osszBevetel > 0) {
      this.szazalek = Math.round((this.ertek / osszBevetel) * 100);
    } else {
      this.szazalek = -1;
    }
 
  };

  Kiadas.prototype.getSzazalek = function() {
    return this.szazalek;
  };

  var Bevetel = function (id, leiras, ertek) {
    this.id = id;
    this.leiras = leiras;
    this.ertek = ertek;
  };

  var vegosszegSzamolas = function(tipus) {
    var osszeg = 0;

    adat.tetelek[tipus].forEach(function(akt){
      osszeg += akt.ertek;
    });

    adat.osszegek[tipus] = osszeg;

  }

  var adat = {
    tetelek: {
      bev: [],
      kia: [],
    },

    osszegek: {
      bev: 0,
      kia: 0,
    },

    koltsegvetes: 0,
    szazalek: -1
  
    
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

    tetelTorol: function(tipus, id) {

      var idTomb, index;

      idTomb = adat.tetelek[tipus].map(function(aktualis){

        return aktualis.id;

      });
      index = idTomb.indexOf(id);

      if(index !== -1) {
        adat.tetelek[tipus].splice(index, 1);
      }
    },

    koltsegvetesSzamolas: function() {
      // összbevétel, összkiadás számolása
        vegosszegSzamolas("bev");
        vegosszegSzamolas("kia");

        adat.koltsegvetes = adat.osszegek.bev - adat.osszegek.kia;

    // százalék számolása
    if(adat.osszegek.bev > 0) {
      adat.szazalek = Math.round((adat.osszegek.kia / adat.osszegek.bev) * 100);
    } else {
      adat.szazalek = -1;
    }
    
     
    },

    szazalekokSzamolasa: function() {

      adat.tetelek.kia.forEach(function(aktualisElem) {
        aktualisElem.szazalekSzamitas(adat.osszegek.bev);
      });

    },

    szazaleklekerdezese: function() {
      var kiadasSzazalekok = adat.tetelek.kia.map(function(aktualisElem){
        return aktualisElem.getSzazalek();
      });

      return kiadasSzazalekok;

    },

    getKoltsegvetes: function() {
      return {
        koltsegvetes: adat.koltsegvetes,
        osszBevetel: adat.osszegek.bev,
        osszKiadas: adat.osszegek.kia,
        szazalek: adat.szazalek
      }      
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
    koltsegvetesCimke: ".koltsegvetes__ertek",
    osszbevetelCimke: ".koltsegvetes__bevetelek--ertek",
    osszkiadasCimke: ".koltsegvetes__kiadasok--ertek",
    szazalekCimke: ".koltsegvetes__kiadasok--szazalek",
    kontener: ".kontener",
    szazalekokCimke: ".tetel__szazalek",
    datumCimke: ".koltsegvetes__cim--honap"
  };

  var szamFormazo = function(szam, tipus) {

    var elojel;

    /*
      + vagy - jel a szám elé 
      ezres tagolás
     */

      szam = Math.abs(szam); // ebszolult érték
      szam = szam.toLocaleString();

      tipus === 'kia' ? elojel = '-' : elojel = '+';

      szam = elojel + ' ' + szam;

      return szam;

  };

  var nodeListForEach = function(lista, calcback) {

    for(var i = 0; i < lista.length; i++) {
      calcback(lista[i], i);
    }

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
          '<div class="tetel clearfix" id="bev-%id%"><div class="tetel__leiras">%leiras%</div><div class="right clearfix"><div class="tetel__ertek">%ertek%</div><div class="tetel__torol"><button class="tetel__torol--gomb"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (tipus === "kia") {
        elem = DOMelemek.kiadasTarolo;

        html =
          '<div class="tetel clearfix" id="kia-%id%"><div class="tetel__leiras">%leiras%</div><div class="right clearfix"><div class="tetel__ertek">%ertek%</div><div class="tetel__szazalek">21%</div><div class="tetel__torol"><button class="tetel__torol--gomb"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      //HTML feltöltése adatokkal
      ujHtml = html.replace("%id%", obj.id);
      ujHtml = ujHtml.replace("%leiras%", obj.leiras);
      ujHtml = ujHtml.replace("%ertek%", szamFormazo(obj.ertek, tipus));

      //HTML megjelenítése, hozzáadása a DOM-hoz
      document.querySelector(elem).insertAdjacentHTML("beforeend", ujHtml);
    },

    tetelTorles: function(tetelID) {

      var elem = document.getElementById(tetelID)

      elem.parentNode.removeChild(elem);

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

    koltsegvetesMegjelenites: function(obj) {

      var tipus;

        obj.koltsegvetes > 0 ? tipus = 'bev' : 'kia';

        document.querySelector(DOMelemek.koltsegvetesCimke).textContent = szamFormazo(obj.koltsegvetes, tipus);

        document.querySelector(DOMelemek.osszbevetelCimke).textContent = szamFormazo(obj.osszBevetel, 'bev');

        document.querySelector(DOMelemek.osszkiadasCimke).textContent = szamFormazo(obj.osszKiadas, 'kia');

        if(obj.szazalek > 0) {
          document.querySelector(DOMelemek.szazalekCimke).textContent = obj.szazalek + "%";
        } else {
          document.querySelector(DOMelemek.szazalekCimke).textContent = '-';
        }
     
    },

    szazalekokMegjelenitese: function(szazalekok) {

      var elemek = document.querySelectorAll(DOMelemek.szazalekokCimke);


      nodeListForEach(elemek, function(aktualisElem, index) {

        if(szazalekok[index] > 0) {
          aktualisElem.textContent = szazalekok[index] + "%";
        } else {
          aktualisElem.textContent = '---';
        }
        

      });


    },

    datumMegjelenites: function() {

      var most, ev, honap, honapok;

      honapok = ['Január', 'Február', 'Március', 'Április', 'Május', 'Június', 'Július', 'Augusztus', 'Szeptember', 'Október', 'November', 'December'];

      most = new Date();
      ev = most.getFullYear();
      honap = most.getMonth();

      document.querySelector(DOMelemek.datumCimke).textContent = ev + '.' + honapok[honap];


    },

    tetelTipusValtozas: function() {

      var elemek = document.querySelectorAll(DOMelemek.inputTipus + ',' + DOMelemek.inputLeiras + ',' + DOMelemek.inputErtek);

      nodeListForEach(elemek, function(aktualisElem) {
        aktualisElem.classList.toggle('red-focus');
      });

      document.querySelector(DOMelemek.inputGomb).classList.toggle('red');

    }

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

    document.querySelector(DOM.kontener).addEventListener("click", vezTetelTorles);
  
    document.querySelector(DOM.inputTipus).addEventListener('change', feluletVezerlo.tetelTipusValtozas);

  };

  var osszegfrissitese = function () {
    //1. kölcségvetésnak az újraszámolása
    koltsegvetesVezerlo.koltsegvetesSzamolas();

    // 2 összeg visszadása
    var koltsegvetes = koltsegvetesVezerlo.getKoltsegvetes();

    //3. az összeg megejelenítése a felületen
    feluletVezerlo.koltsegvetesMegjelenites(koltsegvetes);
    
  };

  var szazalekokfrissitese = function () {

    //1. százalékok  újraszámolása
    koltsegvetesVezerlo.szazalekokSzamolasa();

    // 2 százalékok kiolvasása a költségvetés vezérlőböl
    var kiadasSzazalekok = koltsegvetesVezerlo.szazaleklekerdezese();

    //3. felület frissitése az új százalékokkal
    feluletVezerlo.szazalekokMegjelenitese(kiadasSzazalekok);
    
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

      // 6 százalékok újraszámítása
      szazalekokfrissitese();
    }
  };

  var vezTetelTorles = function(event) {

    var tetelID, splitID, tipus, ID;

     tetelID = event.target.parentNode.parentNode.parentNode.parentNode.id;
    if(tetelID) {
      // bev-0
      splitID = tetelID.split('-'); 
      tipus = splitID[0];
      ID = parseInt(splitID[1]);
    }

    // 1. tétel törlése az adat objektumbol
    koltsegvetesVezerlo.tetelTorol(tipus, ID);

    // 2. tétel törlése a felületröl
    feluletVezerlo.tetelTorles(tetelID);


    // 3. összegek újraszámolása és megjelenítése a felületen
    osszegfrissitese();

    // 4 százalékok újraszámítása
    szazalekokfrissitese();



  };

  return {
    init: function () {

      feluletVezerlo.datumMegjelenites();

      feluletVezerlo.koltsegvetesMegjelenites({
        koltsegvetes: 0,
        osszBevetel: 0,
        osszKiadas: 0,
        szazalek: -1
      });
      esemenyKezeloBealit();
    },
  };
})(koltsegvetesVezerlo, feluletVezerlo);

vezerlo.init();

/* 
  - eseménykezelő
  - tétel törlése az adatstruktúrábol
  - tétel törlése a felületről
  - költségvetés újraszámolása
  - felülete visszairjuk az ujra számolt értékeket
*/
