const fs = require("fs")
const superagent = require('superagent')
const WebSocketClient = require('websocket').client;
const events = require("events");
const EventStream = new events.EventEmitter();
const Throttle = require('throttle');

const client = new WebSocketClient();

function log(data) {
    EventStream.emit('data',data)
    fs.appendFileSync(__dirname+'/log.txt',new Date().toLocaleString()+' | '+data+'\r\n')
}

client.on('connectFailed', function(error) {
    log('Connect Error: ' + error.toString());
});

client.on('connect', function(connection) {
    global.connection=connection
    log('Connection to Server established')
    connection.on('error', function(error) {
        log("Connection Error: " + error.toString());
    });
    connection.on('close', function() {
        log('Connection Closed');
    });
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log(message)
            log("Received: '" + message.utf8Data + "'");
        }
    });
});

function sendData(data) {
    if(connection){
        if (connection.connected) {
            connection.send(data)
        }else{
            log('Error: Not connected yet!')
            return
        }
    }else{
        log('Error: Not Logged in yet!')
        return
    }
}

class EDTracker {
    constructor (){
        // if(!process.env.ED_API_Key){log('Missing API Key');return}
        this.login = function (key) {client.connect('ws://api.drillkea.com:80/', 'ed-tracker', 'ED-Tracker-Client',{apikey:key});}
        this.events = EventStream
        this = EventStream
        this.send = sendData
        this.appendStream = function (stream) {
            const throttle = new Throttle(50);
            const ThrottledStream = new events.EventEmitter();
            stream.pipe(throttle).pipe(ThrottledStream);
            ThrottledStream.on('newLine',data=>{sendData(data)})
        }
        // this.api = function (data) {}
    }
}

module.exports = EDTracker
