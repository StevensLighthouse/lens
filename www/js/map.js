var map;

function initialize() {
  markers = [];

  navigator.geolocation.getCurrentPosition(function(data) {
    var latitude = data.coords.latitude;
    var longitude = data.coords.longitude;

    latitude = 40.744331;
    longitude = -74.029003;

    var coords = new google.maps.LatLng(latitude, longitude);

    var mapOptions = {
      zoom: 12,
      center: coords,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    var marker = new google.maps.Marker({
      position: coords,
      map: map,
      title: 'Hello World!',
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 7,
        fillOpacity: 1.0,
        fillColor: '#66b5ff',
        strokeColor: '#3695cf',
        strokeWeight: 1
      },
    });
  });
}
