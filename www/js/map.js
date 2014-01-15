/**
 * Map construct used to abstract many of Google Maps API operations
 */
function Map(containerEl) {
  this.containerEl = containerEl;
  this.markers = [];

  /**
   * Some variables we will define later
   */
  this.currentPosition = null;
  this.positionMarker = null;
  this.map = null;

  this.initializeMap();
  this.setPositionMarker(this.zoom);
};

Map.prototype.initializeMap = function () {
  var mapOptions = {
    zoom: 12,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  this.map = new google.maps.Map(this.containerEl, mapOptions);
  google.maps.event.addListener(this.map, 'resize', this.zoom.bind(this));
};

Map.prototype.setPositionMarker = function (callback) {
  navigator.geolocation.getCurrentPosition(function(data) {
    var latitude = data.coords.latitude;
    var longitude = data.coords.longitude;

    latitude = 40.744331;
    longitude = -74.029003;

    this.currentPosition = new google.maps.LatLng(latitude, longitude);

    this.positionMarker = new google.maps.Marker({
      position: this.currentPosition,
      map: this.map,
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

    callback.call(this);
  }.bind(this));
};

Map.prototype.zoom = function () {
  this.map.setCenter(this.currentPosition);
};

Map.prototype.addMarkers = function () {
  var markers = Array.prototype.slice.call(arguments);

  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(this.map);
    this.markers.push(markers[i]);
  }
};

Map.prototype.clearMarkers = function () {
  for (var i = 0; i < this.markers.length; i++) {
    this.markers[i].setMap(null);
  }

  this.markers = [];
};
