var closeMidiPort, messages, midi, midiIn,
    _this = this;

var SerialPort = require("serialport").SerialPort,
    midi = require('midi'),
    serialPort = new SerialPort("/dev/ttyACM0", {
        baudrate: 9600
    });
messages = {
    notes: 0x90,
    start: 250,
    timing: 248,
    "continue": 251,
    stop: 252
};

var notesPressed = [];



midiIn = new midi.input;
midiOut = new midi.output();

console.log(midiIn.getPortCount());

console.log('Listening on: ' + midiIn.getPortName(0));

function parseMsg(message){
    var cmd = message[0];
    var result = {};
    switch(cmd){
        case messages.notes:

    }
}

function avgNote(){
    var avgNote = 0;
    var avgVelocity = 0;
    if(notesPressed.length == 0){
        return {
            note: 60,
            velocity: 0
        }
    }
    for(var note in notesPressed){
        avgNote += notesPressed[note].note;
        avgVelocity += notesPressed[note].velocity;
    }
    avgNote /= notesPressed.length;
    avgVelocity /= notesPressed.length;
    return {
        note: Math.round(avgNote),
        velocity: Math.round(avgVelocity)
    }
}

function pressNote(key, velocity){
    for(var note in notesPressed){
        if(notesPressed[note] == key){
            return;
        }
    }
    notesPressed.push({note: key, velocity: velocity});
}

function releaseNote(key){
    console.log('release: ' + key);
    for(var i in notesPressed){
        if(notesPressed[i].note == key){
            console.log('release: ' + key);

            notesPressed.splice(i, 1);
        }
    }
    console.log(notesPressed);
}

midiIn.on('message', function(deltaTime, message) {
    var msg;
    msg = parseInt(message[0], 10);
    if (msg >= messages.notes){
        if(msg == messages.start)
            console.log(message);
        if(message[1] != null){
            var key = String.fromCharCode(message[1]);
            var velocity = String.fromCharCode(message[2]);
            console.log('Midi note: ' + key.charCodeAt() + ", " + parseInt(message[2], 10) + ", " + message[0].toString(16));
            //console.log(note+velocity);
            if(message[2] > 0){
                console.log({note: message[1], velocity: message[2]})
                //notesPressed.push({note: message[1], velocity: message[2]});
                pressNote(message[1], message[2]);
            }else{
                releaseNote(message[1]);
            }
            var noteToSend = avgNote();
            serialPort.write(String.fromCharCode(noteToSend.note) + String.fromCharCode(noteToSend.velocity)+'\n');
        }
    }
    if (msg === messages.stop) {
        return closeMidiPort();
    }
});

function strEndsWith(str, suffix) {
    return str.match(suffix+"$")==suffix;
}
var msg = '';
serialPort.on("open", function () {
//    midiIn.openVirtualPort("Test Input");
    midiIn.openPort(1);
    serialPort.on('data', function(data){
        if(strEndsWith(''+data, '\n')){
            //console.log(msg);
            msg = '';
        }else{
            msg += data;
        }
    });
});


midiIn.ignoreTypes(true, true, true);

closeMidiPort = function() {
    midiIn.closePort();
    console.log('done');
    return process.exit(0);
};

setTimeout(closeMidiPort, 1000000000);