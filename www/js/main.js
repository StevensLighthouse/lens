/**
 * Our main script that contains everything to be refactored.
 */

// the UI history (global state)
history = null;

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
        if (request.readyState == 4) {
            if (request.status == 200 || request.status == 0) {
                var data = JSON.parse(request.responseText);
                buildTourMenu(data.tours);
            }
        }
    }
    request.send();
  });
}

function getTour(id, callback) {
  var request = new XMLHttpRequest();
  request.open('GET', 'http://localhost:9393/tours/' + id + '.json', true);
  request.onreadystatechange = function() {
      if (request.readyState == 4) {
          if (request.status == 200 || request.status == 0) {
              var data = JSON.parse(request.responseText);

              if (callback) {
                callback(data)
              }
          }
      }
  }
  return request.send();
}

function buildMenu(items) {
  var menuElement = document.querySelector('script[name="listing-menu"]');
  var menuTemplate = Handlebars.compile(menuElement.innerHTML);

  history.push(menuTemplate({ items: items }));
}

function buildTourMenu(tours) {
  var listingElement = document.querySelector('script[name="tour-listing"]');
  var listingTemplate = Handlebars.compile(listingElement.innerHTML);

  var items = [], i;

  for (i = 0; i < tours.length; i++) {
    items.push(listingTemplate(tours[i]));
  }

  return buildMenu(items);
}

function buildStopMenu(stops) {
  var listingElement = document.querySelector('script[name="stop-listing"]');
  var listingTemplate = Handlebars.compile(listingElement.innerHTML);

  var items = [], i;

  for (i = 0; i < stops.length; i++) {
    items.push(listingTemplate(stops[i]));
  }

  return buildMenu(items);
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
      var marker, markers = [];
      var coords;

      var bounds = new google.maps.LatLngBounds();

      for (var i = 0; i < data.tour.stops.length; i++) {
        stop = data.tour.stops[i];
        stops.push(stop);

        coords = new google.maps.LatLng(stop.lat, stop.lon);

        bounds.extend(coords);

        marker = new google.maps.Marker({
          position: coords,
          map: map,
          title: 'Hello World!'
        });

        markers.push(marker);
      }

      map.fitBounds(bounds);
      buildStopMenu(stops);
    });
  });

  showLocalTours();
});
