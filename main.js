var SerialPort = require("serialport").SerialPort,
    settings = require('./settings.json'),
    lightsPort = new SerialPort(settings.lights, {
        baudrate: 9600
    }),
    midiPort = new SerialPort(settings.midi, {
        //baudrate: 115200
    });

var notesPressed = [];

messages = {
    note: 0x90,
    start: 250,
    timing: 248,
    activeSense: 254,
    "continue": 251,
    stop: 252
};

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


midiPort.on('data', function(data){
    var cmd = data[0];
    if(cmd != messages.timing && cmd != messages.activeSense){
        if(cmd == messages.note){
            var note = data[1];
            var velocity = data[2];
//            if(velocity > 0){
//                pressNote(note, velocity);
//            }else{
//                releaseNote(note);
//            }
            var theNote = avgNote();
            console.log('notePressed: ' + note + ', velocity: ' + velocity);
            lightsPort.write(String.fromCharCode(note) + String.fromCharCode(velocity)+'\n');
        }
    }
})