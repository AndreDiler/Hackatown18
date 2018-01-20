var listeStations = [];     // Contient les informations utiles relatives aux stations
var availableTags = [];     // Contient la liste des noms de stations utilisés pour l'autocomplétion
var tableauStations = [];   // Contient les informations utilisées pour remplir le DataTable affichant les informations sur les stations

// Variables globales définies pour les types de badges
var SUCCESS = "label label-success badge-pill";
var DANGER = "label label-danger badge-pill";

function loadData() {
    //Récupération des données du serveur
    $.get("http://secure.bixi.com/data/stations.json")
        .then((response) => {
            console.log(response.stations);
            var temp = response.stations;
            // On remplit les differents tableaux nécessaires
            for (var i = 0; i < temp.length; i++) {
                listeStations.push(parseStation(temp[i]));
                availableTags.push(listeStations[i].nomStation);
                tableauStations.push([(listeStations[i].idStation),
                    (listeStations[i].nomStation),
                    (listeStations[i].veloDisponible),
                    (listeStations[i].borneDisponible),
                    (listeStations[i].etatBloque),
                    (listeStations[i].etatSuspension)]);


            }
            // Initialisation du DataTable affichant les informations sur les différentes stations
            $('#myTab').DataTable({

                data: tableauStations,

                columns: [
                    {
                        title: "ID"
                    },
                    {
                        title: "Nom Station"
                    },
                    {
                        title: "Vélos disponibles"
                    },
                    {
                        title: "Bornes disponibles"
                    },
                    {
                        title: "Etat bloqué"
                    },
                    {
                        title: "Etat suspendu"
                    }
        ]

            });
        })
        .fail((error) => {

        });
}


/* Fonction pour effectuer le parse des stations afin de ne recueillir que celles nécessaires */
function parseStation(value) {
    return station = {

        idStation: value.n,
        nomStation: value.s,
        etatSuspension: value.su,
        etatService: value.m,
        etatBloque: value.b,
        latitude: value.la,
        longitude: value.lo,
        veloDisponible: value.ba,
        borneDisponible: value.da,
        veloIndisponible: value.bx,
        borneIndisponible: value.dx
    
    };
}


//Fonction pour initilaiser la GOOGLE MAP au Début
function initialiserMap() {

    var myMap = {
        center: new google.maps.LatLng(45.50364, -73.61503),
        zoom: 13,
    };
    var map = new google.maps.Map(document.getElementById("mapPoubelles"), myMap);
    //var map2 = new google.maps.Map(document.getElementById("mapTournee"), myMap);
    placerClusters();
}

//Fonction pour placer un marqueur sur la carte
function placerMarqueur(latitude, longitude) {
    var myMap = {
        center: new google.maps.LatLng(latitude, longitude),
        zoom: 17,
    };
    var map = new google.maps.Map(document.getElementById("mapPoubelles"), myMap);
    var myCenter = new google.maps.LatLng(latitude, longitude);
    var marker = new google.maps.Marker({
        position: myCenter
    });
    marker.setMap(map);
}

//Fonction pour placer plusieurs marqueurs
function placerClusters()
{
	//initialise map
   var directionsService = new google.maps.DirectionsService();
   var directionsDisplay = new google.maps.DirectionsRenderer();
   var myMap = {
        center: new google.maps.LatLng(45.50364, -73.61503),
        zoom: 13,
    };
   var map = new google.maps.Map(document.getElementById("mapTournee"), myMap);
   directionsDisplay.setMap(map);


	//place marker
   /*var markers = [
	[45.51035067563653, -73.55650842189789],
	[45.53929155936048, -73.54103073477745],
	[45.51113228073946, -73.56790713965893]
   ];
   for( i = 0; i < markers.length; i++ ) {
	var position = new google.maps.LatLng(markers[i][0], markers[i][1]);
	marker = new google.maps.Marker({
            position: position,
            map: map,
        });
   }

   var startMarker = {lat: 45.51035067563653, lng: -73.55650842189789};
   var endMarker = {lat: 45.53929155936048, lng: -73.54103073477745};
   var midlMarker = {lat: 45.51113228073946, lng: -73.56790713965893};   */

   var startMarker = new google.maps.LatLng(45.51035067563653, -73.55650842189789);
   var endMarker = new google.maps.LatLng(45.53929155936048, -73.54103073477745);
   var midlMarker = [new google.maps.LatLng(45.51113228073946, -73.56790713965893)];

   function calculateAndDisplayRoute(directionsService, directionsDisplay) {
        var request = {
		origin: startMarker,
		destination: endMarker,
		travelMode: 'DRIVING'
	};
	directionsService.route(request, function(result, status) {
		if(status == 'OK') {
			directionsDisplay.setDirections(result);
			console.log("correct");
		}		
	});
  };

  calculateAndDisplayRoute(directionsService, directionsDisplay);
  directionsDisplay.setMap(map);
}

/** Initialsie l'autocomplétion et permet d'afficher automatiquement dans le tableau les informations
 ** relatives à la station sélectionnée par l'utilisateur. Elle place également un marqueur et 
 ** change le style CSS de certaines sections du tableau d'état de la station.
 ** A chaque sélection, les informations sont actualisées
 */

function complete() {
    $(function () {
        $("#tags").autocomplete({
            source: function (request, response) {
                var results = $.ui.autocomplete.filter(availableTags, request.term);

                response(results.slice(0, 10));
            },
            select: function (event, ui) {
                console.log(ui.item.value);
                for (var i = 0; i < listeStations.length; i++) {

                    if (listeStations[i].nomStation == ui.item.value) {
                        $("#stationId").text(listeStations[i].idStation);
                        $("#veloDispo").text(listeStations[i].veloDisponible);
                        changerCSSNombre(listeStations[i].veloDisponible, document.getElementById("veloDispo"));
                        $("#statutBloque").text(listeStations[i].etatBloque);

                        changerCSSBooleen(listeStations[i].etatBloque, document.getElementById("statutBloque"));

                        $("#borneDispo").text(listeStations[i].borneDisponible);
                        changerCSSNombre(listeStations[i].borneDisponible, document.getElementById("borneDispo"));
                        $("#statutSuspendu").text(listeStations[i].etatSuspension);

                        changerCSSBooleen(listeStations[i].etatSuspension, document.getElementById("statutSuspendu"));

                        $("#veloinDispo").text(listeStations[i].veloIndisponible);
                        $("#statutService").text(listeStations[i].etatService);

                        changerCSSBooleen(listeStations[i].etatService, document.getElementById("statutService"));

                        $("#borneinDispo").text(listeStations[i].borneIndisponible);
                        placerMarqueur(listeStations[i].latitude, listeStations[i].longitude);
                    }
                }
                document.getElementById("SelectedElement").innerHTML = ui.item.value;
            }
        });
    });
}

function changerCSSBooleen(valeur, element) {
    if (valeur == false) {
        element.className = SUCCESS;
        element.textContent = "Non";
    } else {
        element.className = DANGER;
        element.textContent = "Oui";
    }


    element.style.borderRadius = "1em";
    element.style.margin = "0 0.25em";
}

function changerCSSNombre(valeur, element) {
    if (valeur == 0)
        element.className = DANGER;
    else
        element.className = SUCCESS;

    element.style.borderRadius = "1em";
    element.style.margin = "0 0.25em";
}

$(document).ready(function () {

    initialiserMap();
    loadData();
    complete();


});
