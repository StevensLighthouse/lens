var map;
var markers;

function clearMarkers(markers) {
  for (var i = 0; i < markers.length; i++ ) {
    markers[i].setMap(null);
  }
}

function initialize() {
  markers = [];

  navigator.geolocation.getCurrentPosition(function(data) {
    var latitude = data.coords.latitude;
    var longitude = data.coords.longitude;

    latitude = 40.744331;
    longitude = -74.029003;

    var coords = new google.maps.LatLng(latitude, longitude);

    var mapOptions = {
      zoom: 8,
      center: coords,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    var marker = new google.maps.Marker({
      position: coords,
      map: map,
      title: 'Hello World!'
    });

    markers.push(marker);
  });
}
