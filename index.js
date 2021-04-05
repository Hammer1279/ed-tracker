const fs = require("fs")
const superagent = require('superagent')
const WebSocketClient = require('websocket').client;
const events = require("events");
// const EventStream = new events.EventEmitter();

const client = new WebSocketClient();

let EventStream;
let sendData = function () {throw('Connection not yet Established!')}
let pending = false

class EDTracker extends events.EventEmitter {
    constructor() {
        super()
        EventStream = this
        // if(!process.env.ED_API_Key){log('Missing API Key');return}
        this.login = function (key,url="api.drillkea.com:80") { client.connect('ws://'+url, 'ed-tracker', 'ED-Tracker-Client', { apikey: key }); }
        this.events = this
        this.send = sendData
        this.appendStream = function (stream, event) {
            //Cooldown = half second
            var cooldown = 0.5 * 1000
            var queue = new Array

            stream.on(event, data =>addQueue(data))

            //Add data here!
            function addQueue(data) {
                queue.push(JSON.stringify(data))
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
function error(data) {
    if (EventStream) { EventStream.emit('error', data) } else throw ('Missing EventStream')
    fs.appendFileSync(__dirname + '/log.txt', 'ERROR: ' + new Date().toLocaleString() + ' | ' +  data + '\r\n')
}

client.on('connectFailed', function (error) {
    log('Connect Error: ' + error.toString());
});

client.on('connect', function (connection) {
    global.connection = connection
    let interval = setInterval(() => {
        if(pending)return connection.drop()
        connection.ping('KEEP_ALIVE')
        pending = true
    }, 30000);
    log('Connection to Server established')
    connection.on('error', function (error) {
        error("Connection Error: " + error.toString());
    });
    connection.on('close', function () {
        clearInterval(interval)
        log('Connection Closed');
    });
    connection.on('message', function (message) {
        if (message.type === 'utf8') {
            log("Received: " + JSON.stringify(message.utf8Data));
            EventStream.emit('message', JSON.parse(message.utf8Data))
        }
    });
    connection.on('pong',data=>{
        if(pending)pending=false
        log('Pong: '+JSON.stringify(data))
    })
    sendData = function (data) {
            if (connection.connected) {
                log("Sent: " +data)
                connection.send(data)
            } else {
                log('Error: Not connected yet!')
                return
            }
    }
});

module.exports = EDTracker
