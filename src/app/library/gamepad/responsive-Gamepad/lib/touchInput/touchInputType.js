// Base class for all touch input types

const touchEvents = [
  "touchstart",
  "touchmove",
  "touchend",
  "mousedown",
  "mousemove",
  "mouseup",
  "mouseleave"
];

export default class TouchInputType {

  constructor(element) {
    if (!element) {
      throw new Error('Touch inputs require an element.');
      return;
    }

    // Listeners for events we are waiting for
    this.listeners = [];

    this.element = element;
    this._addTouchStyles();
    this.boundingClientRect = undefined;
    this._updateElementBoundingClientRect();

    // Whether or not the current input is "active"
    // E.g a mouse down event has occurded, but no mouse up
    this.active = false;

    this.boundUpdateElementRect = this._updateElementBoundingClientRect.bind(this);
    this.boundTouchEvent = this._touchEvent.bind(this);
  }

  remove() {
    this._removeTouchStyles();
    this.stopListening();
    this.element = undefined;
  }

  listen() {
    if (!this.element) {
      throw new Error('You must supply an element first with add()');
      return;
    }

    window.addEventListener("resize", this.boundUpdateElementRect);
    touchEvents.forEach(touchEvent => {
      this.element.addEventListener(touchEvent, this.boundTouchEvent);
    });
  }

  stopListening() {
    if (!this.element) {
      throw new Error('You must supply an element first with add()');
      return;
    }

    window.removeEventListener("resize", this.boundUpdateElementRect);
    touchEvents.forEach(touchEvent => {
      this.element.removeEventListener(touchEvent, this.boundTouchEvent);
    });
  }

  _touchEvent(event) {

    if (!event || (event.type.includes('touch') && !event.touches)) return;

    event.preventDefault();

    // Determine if it is an active event (Input is pressed down)
    // or not active (Input is released)
    const isActiveEvent = event.type === "touchstart" ||
      event.type === "touchmove" ||
      event.type === "mousedown"

    const isNeutralEvent = event.type === "mousemove";

    const isInactiveEvent = !isActiveEvent && !isNeutralEvent

    this._updateActiveStatus(isActiveEvent, isInactiveEvent);

    this._updateTouchStyles(isActiveEvent, isNeutralEvent, isInactiveEvent);
    
    if (this.onTouchEvent) {
      this.onTouchEvent(event, isActiveEvent, isNeutralEvent, isInactiveEvent);
    }
  }


  _updateElementBoundingClientRect() {
    // Read from the DOM, and get each of our elements position, doing this here, as it is best to read from the dom in sequence
    // use element.getBoundingRect() top, bottom, left, right to get clientX and clientY in touch events :)
    // https://stackoverflow.com/questions/442404/retrieve-the-position-x-y-of-an-html-element
    this.boundingClientRect = this.element.getBoundingClientRect();
  }

  _addTouchStyles() {
    // Add some styles to stop common UX errors
    // Like selecting text on the element;
    this.element.style.userSelect = 'none';
  }

  _removeTouchStyles() {
    this.element.style.userSelect = '';
  }

  _updateTouchStyles(isActiveEvent, isNeutralEvent) {
    if (isNeutralEvent) {
      return;
    }

    // Add classes to show if the input is active or not
    if (isActiveEvent) {
      this.element.classList.add('active');
    } else {
      this.element.classList.remove('active');
    }
  }

  _updateActiveStatus(isActiveEvent, isInactiveEvent) {
    if (this.active && isInactiveEvent) {
      this.active = false;
    } else if (!this.active && isActiveEvent) {
      this.active = true;
    }
  }
}
