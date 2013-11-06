var map;

function initialize() {
  navigator.geolocation.getCurrentPosition(function(data) {
    var latitude = data.coords.latitude;
    var longitude = data.coords.longitude;
    var coords = new google.maps.LatLng(latitude, longitude);

    var mapOptions = {
      zoom: 8,
      center: coords,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    var marker = new google.maps.Marker({
      position: coords,
      map: map,
      title: 'Hello World!'
    });
  });
}
