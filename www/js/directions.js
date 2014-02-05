/**
 * Interface to the Google Directions API
 */
function Directions(origin, destination) {
  this.directionsService = new google.maps.DirectionsService();
  this.origin = origin;
  this.destination = destination;
}

/**
 * Fetches the directions and invokes a callback with an object containing
 * - distance
 * - duration
 * - heading
 * - street
 * - towards
 *
 * For example: Head [HEADING] on [STREET] for [DISTANCE/DURATION]
 *              towards [TOWARDS]
 */
Directions.prototype.fetch = function (callback) {
  var options = {
    origin: new google.maps.LatLng(this.origin.lat, this.origin.lon),
    destination: new google.maps.LatLng(this.destination.lat, this.destination.lon),
    travelMode: google.maps.TravelMode.WALKING
  };

  this.directionsService.route(options, function (result, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      /**
       * This only handles the first step for now
       * TODO - cache this result
       */
      var step = result.routes[0].legs[0].steps[0];
      var instructionsMatch = step.instructions.match(/<b>(.*?)<\/b>/g);

      callback({
        distance: step.distance.text,
        duration: step.duration.text,
        heading: instructionsMatch[0].slice(3, -4),
        street: instructionsMatch[1].slice(3, -4),
        towards: instructionsMatch[2].slice(3, -4)
      });
    }
  });
};

Directions.prototype.currentStep = function () {

}
