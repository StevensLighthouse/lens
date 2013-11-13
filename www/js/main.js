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

function buildTourMenu(tours) {
  var listingElement = document.querySelector('script[name="tour-menu-listing"]');
  var menuElement = document.querySelector('script[name="tour-menu"]');

  var listingTemplate = Handlebars.compile(listingElement.innerHTML);
  var menuTemplate = Handlebars.compile(menuElement.innerHTML);

  var items = [], i;

  for (i = 0; i < tours.length; i++) {
    items.push(listingTemplate(tours[i]));
  }

  document.querySelector('#overlay').innerHTML = menuTemplate({ items: items });
}

$(function () {
  app.initialize();
  initialize();

  $('#overlay').on('click', '.menu-listing', function (e) {
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
    });
  });

  showLocalTours();
});
