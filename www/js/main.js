/**
 * Our main script that contains everything to be refactored.
 */

// the UI history (global state)
var history = null;

function showLocalTours() {
  navigator.geolocation.getCurrentPosition(function(data) {
    var latitude = data.coords.latitude;
    var longitude = data.coords.longitude;

    // hard coded
    latitude = 40.744331;
    longitude = -74.029003;

    var qs = 'lat=' + latitude + '&lon=' + longitude;

    var request = new XMLHttpRequest();
    request.open('GET', 'http://localhost:9393/tours.json?' + qs, true);
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
  request.open('GET', 'http://localhost:9393/tours/' + id + '.json', true);
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
  document.getElementById('map-canvas').classList.add('squish');
  var menuElement = document.querySelector('script[name="listing-menu"]');
  var menuTemplate = Handlebars.compile(menuElement.innerHTML);

  history.push({
    view: menuTemplate({ items: items }),
    markers: markers
  });
}

function buildTourMenu(tours, markers) {
  var listingElement = document.querySelector('script[name="tour-listing"]');
  var listingTemplate = Handlebars.compile(listingElement.innerHTML);

  var items = [], i;

  for (i = 0; i < tours.length; i++) {
    items.push(listingTemplate(tours[i]));
  }

  return buildMenu(items, markers);
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
