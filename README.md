ED-Tracker
==========
> This is an pre-release of this Package for testing its functionality, please do not download it unless told to do
### An module to track EliteDangerous Data with [DK Servers](https://drillkea.com)
 This was made for our Group who you can find here: [ED Guilded](https://www.guilded.gg/r/zzGRq4px6j?i=QdJ6o1Bd)
 For more info contact us [here](mailto:contact@drillkea.com)

---
> ### This Tracker requires the `edreader` package by `@fightingdoggo`
---
Installation
------------
```
npm install ed-tracker-alpha
```
Docs
----
*[D] - Depricated*
 - [login()](#loginkey)
 - [**[D]** events ](#events)
 - [send()](#senddata)
 - [appendStream()](#appendstreamstream)
 - [~~api()~~](#apidata)
 - [Listening for Events](#listening-for-events)
 > api is currently not done yet, it will be used for direct communication with the server in the future

 > ### Sidenote: The script also creates an file called `log.txt` for any messages logged and recieved

 ## login(Key)
 The login Function is used to connect to the Server using an API Key given out in our before mentioned Guilded Server.

 Example:
 ```js
 EDTracker.login('Your_API-Key_Here')
 ```

 ## events
 **Depricated, now listen on the EDTracker itself!**
 The events EventStream is used to read Data from the Incoming connections and logs from internal scripts

 There are 2 Types of Events so far:
 | Event | Data |
 |:-----:| ---- |
 | data | Data is used for sending Debug Info and Errors from the script, **as of now these are not seperated yet** |
 | ~~error~~ | ~~The Error Event is used for sending errors from the Script and should always be listened at~~ |
 | message | The Message Event is used for receiving Data from the Server side. These can be Infos for the connection to the Server, upcoming events or acknowledge that an request was successful |
---
Example:
 ```js
 const Tracker = new EDTracker
 const stream = Tracker.events

 // log Info and Errors in console with "data"
 stream.on("data", data)
 ```

## send(data)
The Send Function is used to directly send data to the Server.
Due to how it is processed, it is recommended to not to send Data directly to the Server to get an valid response.
For more info for how the data is processed contact us [here](mailto:contact@drillkea.com 'Drillkea Support Email').

Example:
```js
EDTracker.send("Ping")
// The server would now send an message event with the data "Pong"
```

## appendStream(stream)
AppendStream is used to append an `edreader` EventStream to this instance of `EDTracker`.
This will then automatically send all Journal Entries to the Server to be processed.
> Do not use this if you are manually sending data with `EDTracker.send()`

Example:
```js
let Tracker = new EDTracker
let Reader = require('edreader')
Tracker.appendStream(Reader)
```

## ~~api(data)~~
> The API function is supposed to allow you to directly communicate with the webserver thus bypassing the websocket entirely

**This function is not ready yet and not included in current releases.**

## <a name="event"></a>Listening for Events
To Receive Events simply listen for events on the main class:
```js
EDTracker.on("Event_Name", data => {
    console.log(data)
})
```

 There are 2 Types of Events so far:
 | Event | Data |
 |:-----:| ---- |
 | data | Data is used for sending Debug Info and Errors from the script, **as of now these are not seperated yet** |
 | ~~error~~ | ~~The Error Event is used for sending errors from the Script and should always be listened at~~ |
 | message | The Message Event is used for receiving Data from the Server side. These can be Infos for the connection to the Server, upcoming events or acknowledge that an request was successful |