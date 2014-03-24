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

/**
 * Initializes the Google Maps object and sets a resize event listener
 */
Map.prototype.initializeMap = function () {
  var mapOptions = {
    zoom: 12,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    mapTypeControl: false,      // No map type control
    streetViewControl: false,   // No street view
    zoomControl: false          // No zoom controls
  };

  this.map = new google.maps.Map(this.containerEl, mapOptions);
  google.maps.event.addListener(this.map, 'resize', this.zoom.bind(this));
};

/**
 * Sets the current position marker on the map object
 */
Map.prototype.setPositionMarker = function (callback) {
  navigator.geolocation.getCurrentPosition(function(data) {
    var latitude = data.coords.latitude;
    var longitude = data.coords.longitude;

    /* babbio */
    latitude = 40.742989;
    longitude = -74.026732;

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
      zIndex: 9999
    });

    callback.call(this);
  }.bind(this));
};

/**
 * Calculates the zoom of the map
 *
 * This map can be sent an optional list of coordinates to zoom in on. If
 * this list is not present, we then check `this.markers`. If that is also
 * not present, we simply zoom in on the current position.
 */
Map.prototype.zoom = function (points) {
  var i, bounds;
  if (points && points.length > 0) {
    bounds = new google.maps.LatLngBounds();

    for (i = 0; i < points.length; i++) {
      bounds.extend(points[i]);
    }

    this.map.fitBounds(bounds);
  } else if (this.markers.length > 0) {
    bounds = new google.maps.LatLngBounds();
    bounds.extend(this.currentPosition);

    for (i = 0; i < this.markers.length; i++) {
      bounds.extend(this.markers[i].position);
    }

    this.map.fitBounds(bounds);
  } else {
    this.map.setCenter(this.currentPosition);
  }
};

/**
 * Adds one or more markers to the map object.
 */
Map.prototype.addMarkers = function () {
  var i, marker, markers = Array.prototype.slice.call(arguments);

  for (i = 0; i < markers.length; i++) {
    marker = new google.maps.Marker(markers[i]);
    marker.setMap(this.map);
    this.markers.push(marker);
  }
};

/**
 * Clears all markers currently stored on the map
 */
Map.prototype.clearMarkers = function () {
  for (var i = 0; i < this.markers.length; i++) {
    // Set each marker's respective map to null
    this.markers[i].setMap(null);
  }

  this.markers = [];
};
