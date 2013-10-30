var map;

function initialize() {
  navigator.geolocation.getCurrentPosition(function(data) {
    var latitude = data.coords.latitude;
    var longitude = data.coords.longitude;

    var mapOptions = {
      zoom: 8,
      center: new google.maps.LatLng(latitude, longitude),
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  });
}
