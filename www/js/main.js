/**
 * Our main script that contains everything to be refactored.
 */

// the UI history (global state)
var history;
var map;
var tour;

function showLocalTours() {
  navigator.geolocation.getCurrentPosition(function(data) {
    var latitude = data.coords.latitude;
    var longitude = data.coords.longitude;

    /* babbio */
    latitude = 40.742989;
    longitude = -74.026732;

    var qs = 'lat=' + latitude + '&lon=' + longitude + '&distance=10';

    var request = new XMLHttpRequest();
    request.open('GET', 'http://54.226.14.244/api/tours.json?' + qs, true);
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
  request.open('GET', 'http://54.226.14.244/api/tours/' + id + '.json', true);
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
    markers: markers,
    squish: true
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

function buildTourInfo(tour, markers) {
  var infoElement = document.querySelector('script[name="tour-info"]');
  var infoTemplate = Handlebars.compile(infoElement.innerHTML);

  /**
   * When we draw the tour info page, we also draw the "Start Tour" button.
   * When this state pops, we should remove the button.
   */
  document.querySelector('.start-tour').classList.remove('hidden');

  history.push({
    view: infoTemplate({ tour: tour }),
    markers: markers,
    squish: true,
    onPop: function () {
      document.querySelector('.start-tour').classList.add('hidden');
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

function buildStopInfo(stop) {
  var modalElement = document.querySelector('script[name="modal"]');
  var modalTemplate = Handlebars.compile(modalElement.innerHTML);

  var infoElement = document.querySelector('script[name="stop-info"]');
  var infoTemplate = Handlebars.compile(infoElement.innerHTML);

  history.push({
    view: modalTemplate({
      content: infoTemplate(stop),
      images: stop.images
    }),
    cloneMarkers: true
  });

  /* Maybe an onPop? */
  window.mySwipe = Swipe(document.querySelector('.gallery'));
}

$(function () {
  var stops;

  app.initialize();
  //initialize();

  // Establish a state for our application
  map = new Map(document.getElementById('map-canvas'));
  history = new State(map);

  $('#yield').on('click', '.tour-listing', function (e) {
    e.preventDefault();

    var id = $(e.target).parents('.tour-listing').data('tour-id');

    getTour(id, function (data) {
      var stop;
      var markers = [];
      var coords;

      /* Expose the current tour's stops globally */
      stops = data.tour.stops;

      for (var i = 0; i < data.tour.stops.length; i++) {
        stop = data.tour.stops[i];

        coords = new google.maps.LatLng(stop.lat, stop.lon);

        markers.push({
          position: coords,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 7,
            fillOpacity: 1.0,
            fillColor: '#b25c53',
            strokeColor: '#922c23',
            strokeWeight: 1
          },
        });
      }

      buildTourInfo(data.tour, markers);
    });
  });

  $('#yield').on('click', '.tour-stops-link', function (e) {
    e.preventDefault();

    // TODO - use cloneMarkers: true
    var stop, id = $(this).data('tour-id');
    getTour(id, function (data) {
      var markers = [];
      var coords;

      for (var i = 0; i < data.tour.stops.length; i++) {
        stop = data.tour.stops[i];

        /* Temporary storage for image URLs */
        stop.images = stop.photos.map(function (item) {
          return item.photo.url;
        }).join(',');

        coords = new google.maps.LatLng(stop.lat, stop.lon);

        markers.push({
          position: coords,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 7,
            fillOpacity: 1.0,
            fillColor: '#b25c53',
            strokeColor: '#922c23',
            strokeWeight: 1
          },
        });
      }

      buildStopMenu(data.tour.stops, markers);
    });
  });

  $('#yield').on('click', '.stop-listing', function (e) {
    e.preventDefault();

    var name = $(this).find('.title').text();
    var description = $(this).find('.description').text();
    var images = $(this).find('.images').text();

    buildStopInfo({
      name: name,
      description: description,
      images: images.split(',')
    });
  });

  /* .start-tour will always be present */
  $('.start-tour').on('click', function (e) {
    e.preventDefault();

    tour = new Tour(map, history, stops);
    tour.start();
  });

  $('#controls .visit').on('click', function (e) {
    e.preventDefault();
    tour.visit();
  });

  $('#controls .end').on('click', function (e) {
    e.preventDefault();
    tour.end();
  });

  showLocalTours();
});
