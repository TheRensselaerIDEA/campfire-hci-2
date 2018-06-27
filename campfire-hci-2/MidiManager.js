var midi = require('midi');

// TODO: handle input type 144

/**
 * Handles Abstraction and event binding for raw midi input events and makes them available in a more useful way
 * 
 */
module.exports = function MidiManager() {
    // The type of input event (Knob, Button up, Button down)
    var INPUT_TYPE = {
        KNOB: 176,
        BTN_PRESS: 160,
        BTN_SOFT_PRESS:144, // Appears to occur for some lighter presses of the button
        BTN_REL: 128
    };
    var KNOB_CODE = {
        LEVEL_RATE: 7,
        KNOB_01: 10,
        KNOB_02: 74,
        KNOB_03: 71,
        KNOB_04: 76,
        KNOB_05: 77,
        KNOB_06: 93,
        KNOB_07: 73,
        KNOB_08: 75,
        KNOB_09: 114,
        KNOB_10: 18,
        KNOB_11: 19,
        KNOB_12: 16,
        KNOB_13: 17,
        KNOB_14: 91,
        KNOB_15: 79,
        KNOB_16: 72
    };
    var BTN_CODE = {
        BTN_01: 44,
        BTN_02: 45,
        BTN_03: 46,
        BTN_04: 47,
        BTN_05: 48,
        BTN_06: 49,
        BTN_07: 50,
        BTN_08: 51,
        BTN_09: 36,
        BTN_10: 37,
        BTN_11: 38,
        BTN_12: 39,
        BTN_13: 40,
        BTN_14: 41,
        BTN_15: 42,
        BTN_16: 43
    };

    // Add constant definitions to object
    this.BTN_CODE = BTN_CODE;
    this.KNOB_CODE = KNOB_CODE;
    this.INPUT_TYPE = INPUT_TYPE;


    // Configure Event handler lookup array
    var btnPressHandler = [];
    var btnReleaseHandler = [];
    var knobHandler = [];

    /**
     * Initialize the MIDI controller and bind events to handler array
     */
    this.start = function () {
        // Initialize Midi Input Device
        this.input = new midi.input();
        // Check that MIDI device is available
        if (this.input.getPortCount() == 0) {
            console.log("No MIDI Devie available, device bindings will be unavailable")
        } else {
            console.log(`Midi Device available: ${this.input.getPortName(0)}`);
            try {
                this.input.openPort(0); // Open device for use
                this.input.ignoreTypes(false, false, false); // TODO figure out what this does
            } catch (err) {
                console.log(`Could not open MIDI Device, is another Process using it? Err: ${err}`);
            }
            // Register Midi Event handler, msg is an array of [inType, inCode, inLevel] from midi device
            this.input.on('message', function(deltaTime, msg) {
                console.log(`MIDI Event: ${msg[0]} ${msg[1]} ${msg[2]}`);
                // Check if input type is knob & a handler is registered to that input
                if (msg[0] == INPUT_TYPE.KNOB && typeof knobHandler[msg[1]] === 'function') {
                    knobHandler[msg[1]](msg[2]);
                } else if (msg[0] == INPUT_TYPE.BTN_PRESS && typeof btnPressHandler[msg[1]] === 'function') {
                    btnPressHandler[msg[1]](msg[2]);
                } else if (msg[0] == INPUT_TYPE.BTN_REL && typeof btnReleaseHandler[msg[1]] === 'function') {
                    btnReleaseHandler[msg[1]](msg[2]);
                }
            });
        }
    };

    /**
     * Closes the midi device, neccessary to make the port available to other programs that want to use it
     */
    this.stop = function () {
        if (this.input != undefined) {
            this.input.closePort();
        }
    };
    
    /**
     * Bind a handler function to a knob turn event
     * @param {Number} knob_code - KNOB_CODE of desired input
     * @param {Function} handler - handler for knob event, must take 1 number parameter for the knob level (0-127)
     */
    this.bindKnobHandler = function (knob_code, handler) {
        knobHandler[knob_code] = handler;
        console.log(`Registered Knob handler for id # ${knob_code}`);
    };

    /**
     * Bind a handler to the button release event, occurs once on button release
     * @param {Number} button_code - BTN_CODE of desired input
     * @param {Function} handler - event handler, takes 1 argument for button press value (not related to up/down event)
     */
    this.bindButtonReleaseHandler = function (button_code, handler) {
        btnReleaseHandler[button_code] = handler;
        console.log(`Registered ButtonRelease handler for id # ${button_code}`);
    };

    /**
     * Bind a handler to the button press event, occurs semi-continuously while button is pressed
     * @param {Number} button_code - BTN_CODE of desired input
     * @param {Function} handler - event handler, takes 1 argument for button press value (not related to up/down event)
     */
    this.bindButtonPressHandler = function (button_code, handler) {
        btnPressHandler[button_code] = handler;
        console.log(`Registered ButtonPress handler for id # ${button_code}`);
    };

    // TODO remove
    // Bind test handler to level knob
    this.bindKnobHandler(KNOB_CODE.LEVEL_RATE, (pos) => {
        console.log(`Knob at position ${pos}`);
    });

    // Start the MIDI Input device
    this.start();

}