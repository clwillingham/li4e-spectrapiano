var closeMidiPort, messages, midi, midiIn,
    _this = this;

messages = {
    notes: 0x90,
    start: 250,
    timing: 248,
    "continue": 251,
    stop: 252
};
var array = [];
midi = require('midi');

midiIn = new midi.input;

midiIn.getPortCount();

console.log('Listening on: ' + midiIn.getPortName(1));

function parseMsg(message){
    var cmd = message[0];
    var result = {};
    switch(cmd){
        case messages.notes:

    }
}

midiIn.on('message', function(deltaTime, message) {
    var msg;
    msg = parseInt(message[0], 10);
    if (msg == messages.notes) {
        if(msg == messages.start)
            console.log(message);
        if(message[1] != null){
            console.log('Midi note: ' + message[1].toString(10) + ", " + parseInt(message[2], 10) + ", " + message[0].toString(16));
            //console.log(message[1] + " "  + message[2]);
        }
    }
    if (msg === messages.stop) {
        return closeMidiPort();
    }
});

midiIn.openPort(1);

midiIn.ignoreTypes(true, true, true);

closeMidiPort = function() {
    midiIn.closePort();
    console.log('done');
    return process.exit(0);
};

setTimeout(closeMidiPort, 1000000000);