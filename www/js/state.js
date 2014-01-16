/**
 * Structure used to hold state in our UI
 *
 * We have a simple menu-based navigation strategy, so we'll represent our
 * state as a simple stack.
 *
 * The elements in our stack will be objects representing a DOM element to
 * render in our `yield` container, and a list of markers to place on the map.
 *
 * This state also stores a Map instance to control its markers
 */

function State(map) {
  this.stack = [];
  this.liveMarkers = [];
  this.map = map;
}


/**
 * Output node in which to render the state.
 */
State.VIEW = document.getElementById('yield');


/**
 * Navigation buttons
 */
State.BACK_BUTTON = document.querySelector('#navigation .back');


/**
 * Pushes a DOM node to the state.
 */
State.prototype.push = function (elem) {
  if (!elem) return;

  this.stack.push(elem);
  return this.render();
};


/**
 * Reverts the state back n times.
 */
State.prototype.back = function (distance) {
  distance = distance || 1;
  var i;

  for (i = 0; i < distance; i++) {
    this.stack.pop();
  }

  return this.render();
};


/**
 * Returns the most recent addition to the state.
 */
State.prototype.current = function () {
  return (this.stack.length > 0) ? this.stack[this.stack.length - 1] : '';
};


/**
 * Renders the state.
 *
 * Right now, this doesn't do much. In the future we may have transitions.
 */
State.prototype.render = function () {
  var bounds, i, marker;
  var current = this.current();

  // Render view
  State.VIEW.innerHTML = current.view;

  // Set navigation button text
  State.BACK_BUTTON.innerHTML = current.navigationText || "< Back";

  // Determine whether or not we need to squish the map
  if (current.squish) {
    if (!this.map.containerEl.classList.contains('squish')) {
      this.map.containerEl.classList.add('squish');
      google.maps.event.trigger(this.map.map, 'resize');
      this.map.zoom();
    }
  } else {
    this.map.containerEl.classList.remove('squish');
  }

  // Clear out our existing live markers
  this.map.clearMarkers();

  // Render markers
  if (current && current.markers) {
    this.map.addMarkers.apply(this.map, current.markers);
    this.map.zoom();
  }

  // Determine if we need to show the back button
  if (this.stack.length > 1) {
    State.BACK_BUTTON.classList.remove('hidden');
  } else {
    State.BACK_BUTTON.classList.add('hidden');
  }
};
