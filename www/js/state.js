/**
 * Structure used to hold state in our UI
 *
 * We have a simple menu-based navigation strategy, so we'll represent our
 * state as a simple stack.
 *
 * The elements in our stack will be DOM nodes ready to be placed in the
 * `yield` container
 */

function State() {
  this.stack = [];
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
}


/**
 * Renders the state.
 *
 * Right now, this doesn't do much. In the future we may have transitions.
 */
State.prototype.render = function () {
  State.VIEW.innerHTML = this.current();

  // Determine if we need to show the back button
  if (this.stack.length > 1) {
    State.BACK_BUTTON.classList.remove('hidden');
  } else {
    State.BACK_BUTTON.classList.add('hidden');
  }
};
