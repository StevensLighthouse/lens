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
  this.nextStop(this.stops[this.stopIndex].name);

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

  this.nextStop(this.stops[this.stopIndex].name);

  // highlight next route
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
Tour.prototype.nextStop = function (stopText) {
  Tour.CONTROL_VIEW.querySelector('.next-stop').innerHTML = 'Next stop: ' + stopText;
};
