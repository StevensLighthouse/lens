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
      zoom: 11,
      center: coords,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true
    };

    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    var marker = new google.maps.Marker({
      position: coords,
      map: map,
      title: 'Hello World!'
    });
  });
}
