/**
 * Tour class
 */
function Tour(map, state, stops) {
  this.map = map;
  this.state = state;
  this.stops = stops;

  this.stopIndex = 0;
  this.isRunning = false;
}

/**
 * Navigation view
 */
Tour.CONTROL_VIEW = document.getElementById('controls');

/**
 * Function to start the tour
 */
Tour.prototype.start = function () {
  // change button to end tour

  this.isRunning = true;
  Tour.CONTROL_VIEW.classList.remove('hidden');
  this.showDirectionInfo();

  this.state.push({
    view: '',
    hideNavigation: true,
    //navigationText: 'End Tour',
    cloneMarkers: true             // clone markers from tour view
  });
};

/**
 * Visits the current stop
 */
Tour.prototype.visit = function () {
  this.stopIndex++;

  if (this.stopIndex === this.stops.length) {
    return this.end();
  }

  this.showDirectionInfo();
};

/**
 * Returns the current stop
 */
Tour.prototype.currentStop = function () {
  return this.stops[this.stopIndex];
};

/**
 * Ends the tour
 */
Tour.prototype.end = function () {
  this.isRunning = false;
  this.stopIndex = 0;

  this.state.back(1);
  // change nav
  Tour.CONTROL_VIEW.classList.add('hidden');
};

/**
 * Sets the next pertaining to the next stop in the control panel
 */
Tour.prototype.showDirectionInfo = function (stopText) {
  var origin = this.map.currentPosition;
  var nextStop = this.stops[this.stopIndex];
  var destination = new google.maps.LatLng(nextStop.lat, nextStop.lon);
  var directions = new Directions(origin, destination);

  directions.fetch(function (result) {
    var resultText = result.distance + ' ' + result.heading + ' ' + ' on ' + result.street;

    if (result.towards) {
      resultText += ' towards ' + result.towards;
    }

    Tour.CONTROL_VIEW.querySelector('.next-stop').innerHTML = resultText;
  });
};
