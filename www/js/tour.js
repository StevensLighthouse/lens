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

Tour.prototype.start = function () {
  // change button to end tour

  this.isRunning = true;
  Tour.CONTROL_VIEW.classList.remove('hidden');
  this.state.push({
    view: '',
    navigationText: 'End Tour',
    cloneMarkers: true
  });
};

Tour.prototype.visit = function () {
  this.stopIndex++;
  // See if last stop has been hit

  // highlight next route
};

Tour.prototype.currentStop = function () {
  return this.stops[this.stopIndex];
};

Tour.prototype.end = function () {
  this.isRunning = false;
  this.stopIndex = 0;

  // change nav
  this.state.back(1);
};
