/**
 * Our main script that contains everything to be refactored.
 */

// the UI history (global state)
var history = null;
var domain = 'http://localhost:9393';

function showLocalTours() {
  navigator.geolocation.getCurrentPosition(function(data) {
    var latitude = data.coords.latitude;
    var longitude = data.coords.longitude;

    // hard coded
    latitude = 40.724331;
    longitude = -74.009003;

    var qs = 'lat=' + latitude + '&lon=' + longitude + "&distance=.5";

    var request = new XMLHttpRequest();
    request.open('GET', domain + '/tours.json?' + qs, true);
    request.onreadystatechange = function() {
      if (request.readyState == 4 && (request.status == 200 || request.status == 0)) {
        var data = JSON.parse(request.responseText);
        buildTourMenu(data.tours);
      }
    }
    request.send();
  });
}

function getTour(id, callback) {
  var request = new XMLHttpRequest();
  request.open('GET', domain + '/tours/' + id + '.json', true);
  request.onreadystatechange = function() {
    if (request.readyState == 4 && (request.status == 200 || request.status == 0)) {
      var data = JSON.parse(request.responseText);

      if (callback) {
        callback(data)
      }
    }
  }
  return request.send();
}

function buildMenu(items, markers) {
  var menuElement = document.querySelector('script[name="listing-menu"]');
  var menuTemplate = Handlebars.compile(menuElement.innerHTML);

  history.push({
    view: menuTemplate({ items: items }),
    markers: markers
  })
  ;
}

function buildTourMenu(tours, markers) {
    var directionsService = new google.maps.DirectionsService();
    var listingElement = document.querySelector('script[name="tour-listing"]');
    var listingTemplate = Handlebars.compile(listingElement.innerHTML);
    var items = [], i;

    // breaks any plans you had of using that return for anything useful. 
    // Please, think of a better way to do this.
    navigator.geolocation.getCurrentPosition(function (data) {
        var latitude = data.coords.latitude;
        var longitude = data.coords.longitude;

        // hard coded
        latitude = 40.724331;
        longitude = -74.009003;
        
        for (i = 0; i < tours.length; i++) {
            var currTour = tours[i];
            var request = {
                travelMode: google.maps.TravelMode.WALKING,
                origin: latitude + "," + longitude,
                destination: currTour.lat + "," + currTour.lon
            };
            
            currTour.bearing = latitude < currTour.lat ? "North" : "South";
            currTour.bearing += "-" + (longitude < currTour.lon ? "East" : "West");

            // We should attach the information we get back towards, well, something -- these give us directions to the first stop
            // Not entirely sure where we should put it, though. Could attach to the first stop.
            // But I'm already uncomfortable with just messing around with the objects this way.
            directionsService.route(request, function (result, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    currTour.distance = result.routes[0].legs[0].distance.text;
                } else{
                    currTour.distance = "";
                }
                
                items.push(listingTemplate(currTour));

                if (items.length === tours.length) {
                    buildMenu(items, markers);
                }
            });
        }
    });
}

function buildStopMenu(stops, markers) {
  var listingElement = document.querySelector('script[name="stop-listing"]');
  var listingTemplate = Handlebars.compile(listingElement.innerHTML);

  var items = [], i;

  for (i = 0; i < stops.length; i++) {
    items.push(listingTemplate(stops[i]));
  }

  return buildMenu(items, markers);
}

$(function () {
  app.initialize();
  initialize();

  // Establish a state for our application
  history = new State();

  $('#yield').on('click', '.menu-listing', function (e) {
    e.preventDefault();

    var id = $(e.target).parents('.menu-listing').data('tour-id');

    getTour(id, function (data) {
      var stop, stops = [];
      var markers = [];
      var coords;

      for (var i = 0; i < data.tour.stops.length; i++) {
        stop = data.tour.stops[i];
        stops.push(stop);

        coords = new google.maps.LatLng(stop.lat, stop.lon);

        markers.push({
          position: coords,
          map: map,
          title: 'Hello World!'
        });
      }

      buildStopMenu(stops, markers);
    });
  });

  showLocalTours();
});
