const serverUrl = 'http://domain.com:port/chat/processId';
const loginUser = 'name';
const loginPass = 'password';

const WebSocket = require("ws");
const express = require('express');
const http = require("http");
  
const app = express();
const path = require("path");

app.use("/",express.static(path.resolve(__dirname, "./client")));

const PORT = process.env.PORT || 7070;
const myServer = app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

const wsServer = new WebSocket.Server({
  noServer: true
})  
wsServer.on("connection", function(ws) {    // what should a websocket do on connection

  const url = serverUrl
  const options = {
    auth : loginUser+':'+loginPass //here you put your credentials
  }
      http.get(url, options, (response) => {
      let chunks = [];
      //console.log(response.statusCode);
      response.responseType="text";
      response.on('data', function(data) {
          chunks.push(data);
      }).on('end', function() {
        let data   = Buffer.concat(chunks);
        let schema = JSON.parse(data);
        wsServer.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {     // check if client is ready
                client.send(JSON.stringify(schema));
            }
        })

      })
    }).on("error", (error) => {
      console.log(error)
    })

  ws.on("message", function(msg) {        // what to do on message event
      wsServer.clients.forEach(function each(client) {
          if (client.readyState === WebSocket.OPEN) {     // check if client is ready
            client.send(msg.toString());
          }
      })
  })
})
myServer.on('upgrade', async function upgrade(request, socket, head) {      //handling upgrade(http to websocekt) event
  // accepts half requests and rejects half. Reload browser page in case of rejection
  if(Math.random() > 0.5){
      return socket.end("HTTP/1.1 401 Unauthorized\r\n", "ascii")     //proper connection close in case of rejection
  }
  //emit connection when request accepted
  wsServer.handleUpgrade(request, socket, head, function done(ws) {
    wsServer.emit('connection', ws, request);
  });
});
