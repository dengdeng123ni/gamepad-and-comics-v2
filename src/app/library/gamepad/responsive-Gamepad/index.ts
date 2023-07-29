import {RESPONSIVE_GAMEPAD_INPUTS} from './constants';
import setDefaultKeymap from './keymap';

import GamepadInputSource from './gamepad';

// import { version } from '../package.json';

class ResponsiveGamepadService {
  RESPONSIVE_GAMEPAD_INPUTS: {
    DPAD_UP: string; DPAD_RIGHT: string; DPAD_DOWN: string; DPAD_LEFT: string; LEFT_ANALOG_HORIZONTAL_AXIS: string;
    // import { version } from '../package.json';
    LEFT_ANALOG_VERTICAL_AXIS: string; LEFT_ANALOG_UP: string; LEFT_ANALOG_RIGHT: string; LEFT_ANALOG_DOWN // Expose our constants
    : string; LEFT_ANALOG_LEFT: string; // Our Input Sources
    LEFT_ANALOG_PRESS: string; RIGHT_ANALOG_HORIZONTAL_AXIS: string; RIGHT_ANALOG_VERTICAL_AXIS: string; RIGHT_ANALOG_UP: string // Our Input Sources
    ; RIGHT_ANALOG_RIGHT: string; RIGHT_ANALOG_DOWN: string; RIGHT_ANALOG_LEFT: string; RIGHT_ANALOG_PRESS // Our Plugins
    : string; A: string; B: string;
    // Enable Input Sources
    X: string; Y: string; LEFT_TRIGGER: string; LEFT_BUMPER: string; RIGHT_TRIGGER: string; RIGHT_BUMPER: string; SELECT: string; START: string; SPECIAL: string; // Disable Input Sources
  };
  _enabled: boolean;
  _multipleDirectionInput: boolean;
  Gamepad: GamepadInputSource;
  plugins: any[];
  inputChangeMap: {};
  inputChangeOldState: {};
  cancelInputChangeListener: any;
  state: any;
  constructor() {
    // Expose our constants
    this.RESPONSIVE_GAMEPAD_INPUTS = RESPONSIVE_GAMEPAD_INPUTS;

    // Some Settings
    this._enabled = false;
    this._multipleDirectionInput = true;

    // Our Input Sources
    this.Gamepad = new GamepadInputSource();
    setDefaultKeymap(this);

    // Our Plugins
    this.plugins = [];

    // On Input Change
    this.inputChangeMap = {};
    this.inputChangeOldState = {};
    this.cancelInputChangeListener = undefined;
  }

  clearInputMap() {
    this.Gamepad.clearInputMap();
  }

  getVersion() {
    return 1;
  }

  enable() {
    // Enable Input Sources
    this.Gamepad.enable();

    if (Object.keys(this.inputChangeMap).length > 0) {
      this._startInputChangeInterval();
    }

    this._enabled = true;
  }

  disable() {
    // Disable Input Sources
    this.Gamepad.disable();

    // Stop our InputChange Interval
    if (this.cancelInputChangeListener) {
      this.cancelInputChangeListener();
      this.cancelInputChangeListener = undefined;
    }

    this._enabled = false;
  }

  isEnabled() {
    return this._enabled;
  }

  addPlugin(pluginObject) {
    this.plugins.push(pluginObject);

    if (pluginObject.onAddPlugin) {
      pluginObject.onAddPlugin();
    }

    return () => {
      if (pluginObject.onRemovePlugin) {
        pluginObject.onRemovePlugin();
      }
      this.plugins.splice(this.plugins.indexOf(pluginObject), 1);
    }
  }

  getState() {

    if (!this._enabled) {
      return {};
    }

    let state:any = {
      ...RESPONSIVE_GAMEPAD_INPUTS
    };

    const gamepadState = this.Gamepad.getState();

    state = {
      ...RESPONSIVE_GAMEPAD_INPUTS
    };

    Object.keys(state).forEach(stateKey => {
      state[stateKey] = gamepadState[stateKey]
    });

    // Force Analog Axis to be a number
    const analogTypes = ['LEFT', 'RIGHT'];
    analogTypes.forEach(analogType => {
      const typeAxes = [
        RESPONSIVE_GAMEPAD_INPUTS[`${analogType}_ANALOG_HORIZONTAL_AXIS`],
        RESPONSIVE_GAMEPAD_INPUTS[`${analogType}_ANALOG_VERTICAL_AXIS`],
      ];
      typeAxes.forEach((axis, index) => {
        // Number type is what we want
        if (typeof state[axis] === 'number') {
          return;
        }

        if (index === 0 || index === 2) {
          if (state[RESPONSIVE_GAMEPAD_INPUTS[`${analogType}_ANALOG_RIGHT`]]) {
            state[axis] = 1;
          } else if (state[RESPONSIVE_GAMEPAD_INPUTS[`${analogType}_ANALOG_LEFT`]]) {
            state[axis] = -1;
          } else {
            state[axis] = 0;
          }
        }

        if (index === 1 || index === 3) {
          if (state[RESPONSIVE_GAMEPAD_INPUTS[`${analogType}_ANALOG_UP`]]) {
            state[axis] = -1;
          } else if (state[RESPONSIVE_GAMEPAD_INPUTS[`${analogType}_ANALOG_DOWN`]]) {
            state[axis] = 1;
          } else {
            state[axis] = 0;
          }
        }
      });
    });

    // Add the generic Up, Down, Left, Right
    state.UP = state.DPAD_UP ||
      state.LEFT_ANALOG_UP || state.RIGHT_ANALOG_UP;
    state.RIGHT = state.DPAD_RIGHT ||
      state.LEFT_ANALOG_RIGHT || state.RIGHT_ANALOG_RIGHT;
    state.DOWN = state.DPAD_DOWN ||
      state.LEFT_ANALOG_DOWN || state.RIGHT_ANALOG_DOWN;
    state.LEFT = state.DPAD_LEFT ||
      state.LEFT_ANALOG_LEFT || state.RIGHT_ANALOG_LEFT;

    // Remove any remainig strings I may have
    Object.keys(state).forEach(stateKey => {
      if (state[stateKey] === undefined || typeof state[stateKey] === 'string') {
        state[stateKey] = false;
      }
    });

    this.plugins.forEach(plugin => {
      if (plugin.onGetState) {
        const response = plugin.onGetState(state);
        if (response) {
          this.state = response;
        }
      }
    });

    return state;
  }

  onInputsChange(codes, callback) {

    // Check if we got a single input
    if (typeof codes === 'string') {
      codes = [codes];
    }

    // Set to our map
    this.inputChangeMap[codes] = {
      codes,
      callback
    };

    // Check if we need to start the interval
    if (this._enabled && !this.cancelInputChangeListener) {
      this._startInputChangeInterval();
    }

    // Return a function to cancel listening.
    return () => {
      delete this.inputChangeMap[codes];
    }
  }

  _startInputChangeInterval() {
    // Start our InputChange Interval
    // Originally going to use requestAnimationFrame, sine most people react to games
    // from visuals. But then I remembered you could totally react from sound.
    // Thus a setInterval of about 60fps should be fair.
    const intervalId = setInterval(this._inputChangeIntervalHandler.bind(this), 16);
    this.cancelInputChangeListener = () => clearInterval(intervalId);
  }

  _inputChangeIntervalHandler() {
    // Get the new state
    const newState = this.getState();

    // Find if anything changed
    const changedKeys = [];
    Object.keys(newState).forEach(newStateKey => {
      if (newState[newStateKey] !== this.inputChangeOldState[newStateKey]) {
        changedKeys.push(newStateKey)
      }
    });

    // Find if any of the codes on our map need to be called
    Object.keys(this.inputChangeMap).forEach(codes => {
      if (this.inputChangeMap[codes].codes.some(code => changedKeys.includes(code))) {
        this.inputChangeMap[codes].callback(newState);
      }
    });

    // Store the new state as the old
    this.inputChangeOldState = newState;
  }
}

export const ResponsiveGamepad = new ResponsiveGamepadService();
