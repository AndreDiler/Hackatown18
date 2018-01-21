var listePoubelles = [];     // Contient les informations utiles relatives aux poubelles
var tagsPoubelles = [];     // Contient la liste des noms de stations utilisés pour l'autocomplétion
var tableauPoubelles = [];   // Contient les informations utilisées pour remplir le DataTable affichant les informations sur les stations

// Variables globales définies pour les types de badges
var SUCCESS = "label label-success badge-pill";
var DANGER = "label label-danger badge-pill";

function loadData() {
    //Récupération des données du serveur
	$.getJSON("pokemonGoRevolution.json").then((json) =>
	{
		//console.log(json.poubelles);
		var temp = json.poubelles;
		

		for (var i = 0; i < temp.length; i++) 
		{
			listePoubelles.push(parseJson(temp[i]));
			tagsPoubelles.push(listePoubelles[i].tag);
			tableauPoubelles.push(
				[
					(listePoubelles[i].id),
					(listePoubelles[i].tag),
					(listePoubelles[i].vide)
				]);
		}
		// Initialisation du DataTable affichant les informations sur les différentes poubelles
		$("#tableauPoubelles").DataTable({

			data: tableauPoubelles,

			columns: 
			[
			    {
				title: "ID"
			    },
			    {
				title: "Localisation"
			    },
			    {
				title: "Vide"
			    }
			]

		    });
	});
}


/* Fonction pour effectuer le parse des stations afin de ne recueillir que celles nécessaires */
function parseJson(json) {
    return poubelle = {

        id: json.id,
	tag: json.croisement,
	vide: json.vide,
	lat: json.coordonnees.latitude,
	lng: json.coordonnees.longitude
    
    };
}


//Fonction pour initilaiser la GOOGLE MAP au Début
function initialiserMap() {

   var directionsDisplay = new google.maps.DirectionsRenderer();
   var myMap = {
        center: new google.maps.LatLng(45.50364, -73.61503),
        zoom: 13,
    };
   var map = new google.maps.Map(document.getElementById("mapTournee"), myMap);
   directionsDisplay.setMap(map);
   //var map2 = new google.maps.Map(document.getElementById("mapPoubelles"), myMap);
    
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


   var endMarker = new google.maps.LatLng(45.51035067563653, -73.55650842189789);
   var startMarker = new google.maps.LatLng(45.53929155936048, -73.54103073477745);
   /*var midlMarker1 = new google.maps.LatLng(45.51113228073946, -73.56790713965893);
   var midlMarker2 = new google.maps.LatLng(45.50918810659251, -73.55457991361618);*/

   var waypts = [];
   /*waypts.push({
	location: midlMarker2,
	stopover: true
	});
   waypts.push({
	location: midlMarker1,
	stopover: true
	});*/
	

   

   function calculateAndDisplayRoute(directionsService, directionsDisplay) {
        var request = {
		origin: startMarker,
		destination: startMarker,
		waypoints: waypts,
		travelMode: 'DRIVING'
	};
	directionsService.route(request, function(result, status) {
		if(status == 'OK') {
			directionsDisplay.setDirections(result);
			//console.log("correct");
		}		
	});
  };

  waypts = tracerLeParcours();
  calculateAndDisplayRoute(directionsService, directionsDisplay);
  directionsDisplay.setMap(map);
}

function tracerLeParcours() {
	//console.log(listePoubelles.length);
	var waypts = [];

	for(var i =0; i < listePoubelles.length; i++)
	{
		if(!listePoubelles[i].vide)
		{
			var newMarker = new google.maps.LatLng(listePoubelles[i].lat,listePoubelles[i].lng);
			waypts.push({
			location: newMarker,
			stopover: true
			});
		}
	}

	return waypts;

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
                var results = $.ui.autocomplete.filter(tagsPoubelles, request.term);

                response(results.slice(0, 10));
            },
            select: function (event, ui) {
                //console.log(ui.item.value);
                for (var i = 0; i < listePoubelles.length; i++) {

                    if (listePoubelles[i].tag == ui.item.value) {

                        $("#idPoubelle").text(listePoubelles[i].id);
                        changerCSSBooleen(listePoubelles[i].vide, document.getElementById("etatPoubelle"));
                        placerMarqueur(listePoubelles[i].lat, listePoubelles[i].lng);
                    }
                }
                document.getElementById("SelectedElement").innerHTML = ui.item.value;
		document.getElementById("SelectedElement").style = "color:black;";
            }
        });
    });
}

function changerCSSBooleen(valeur, element) {
    if (valeur == false) {
        element.className = DANGER;
        element.textContent = "PLEINE";
    } else {
        element.className = SUCCESS;
        element.textContent = "VIDE";
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

function initCarteLocalisation()
{
	setTimeout(function(){ 
		var myMap = {
        		center: new google.maps.LatLng(45.50364, -73.61503),
       			zoom: 13,
    		};
		var map = new google.maps.Map(document.getElementById("mapPoubelles"), myMap);
		
	 }, 500);
}


$(document).ready(function () {

    initialiserMap();
    loadData();
    complete();
    setTimeout(function(){ placerClusters(); }, 1000);


});
