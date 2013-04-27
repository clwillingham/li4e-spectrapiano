/**
 * Created with JetBrains WebStorm.
 * User: chris
 * Date: 4/21/13
 * Time: 3:47 PM
 * To change this template use File | Settings | File Templates.
 */
var midi = require('midi');

// Set up a new input.
var input = new midi.input();

// Count the available input ports.
console.log(input.getPortCount());

// Get the name of a specified input port.
console.log(input.getPortName(1));

// Configure a callback.
input.on('message', function(deltaTime, message) {
    console.log('m:' + message + ' d:' + deltaTime);
});

// Open the first available input port.
input.openPort(1);

// Sysex, timing, and active sensing messages are ignored
// by default. To enable these message types, pass false for
// the appropriate type in the function below.
// Order: (Sysex, Timing, Active Sensing)
input.ignoreTypes(false, false, false);

// ... receive MIDI messages ...

// Close the port when done.
