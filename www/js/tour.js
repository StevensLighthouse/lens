/**
 * Tour class
 */
function Tour(map, stops) {
  this.map = map;
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
};
