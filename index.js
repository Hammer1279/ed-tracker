const fs = require("fs")
const superagent = require('superagent')
const WebSocketClient = require('websocket').client;
const events = require("events");
// const EventStream = new events.EventEmitter();

const client = new WebSocketClient();

let EventStream;

class EDTracker extends events.EventEmitter {
    constructor() {
        super()
        EventStream = this
        // if(!process.env.ED_API_Key){log('Missing API Key');return}
        this.login = function (key) { client.connect('ws://api.drillkea.com:80/', 'ed-tracker', 'ED-Tracker-Client', { apikey: key }); }
        this.events = this
        this.send = sendData
        this.appendStream = function (stream) {
            //Cooldown = half second
            var cooldown = 0.5 * 1000
            var queue = new Array

            stream.on('newLine', data =>addQueue(data))

            //Add data here!
            function addQueue(data) {
                queue.push(data)
            };

            setInterval(() => {
                //Checks for data
                if (queue.length > 0) {
                    //if data send first item and remove it from queue
                    sendData(queue[0])
                    queue.shift()
                }
            }, cooldown);
        }

    }
}

function log(data) {
    if (EventStream) { EventStream.emit('data', data) } else throw ('Missing EventStream')
    fs.appendFileSync(__dirname + '/log.txt', new Date().toLocaleString() + ' | ' + data + '\r\n')
}

client.on('connectFailed', function (error) {
    log('Connect Error: ' + error.toString());
});

client.on('connect', function (connection) {
    global.connection = connection
    log('Connection to Server established')
    connection.on('error', function (error) {
        log("Connection Error: " + error.toString());
    });
    connection.on('close', function () {
        log('Connection Closed');
    });
    connection.on('message', function (message) {
        if (message.type === 'utf8') {
            log("Received: " + message.utf8Data);
            EventStream.emit('message', message.utf8Data)
        }
    });
});

function sendData(data) {
    if (connection) {
        if (connection.connected) {
            connection.send(data)
        } else {
            log('Error: Not connected yet!')
            return
        }
    } else {
        log('Error: Not Logged in yet!')
        return
    }
}

module.exports = EDTracker
