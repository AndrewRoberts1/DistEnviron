//index.js
const express = require('express');
const app = express();
const PORT = 4000;

//import HTTP and CORS libraries - allows for data transfer between client and server
const http = require('http').Server(app);
const cors = require('cors');

//Use cors
app.use(cors());

//Add socket.io - adds real time connection
const socketIO = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:3000"
    }
});

//On conntection create a unique id for each socket
socketIO.on('connection', (socket) => {
    //log to console the id of this socket
    console.log(`The user ${socket.id} just connected!`);
    socket.on('disconnect', () => {
        //Message on disconnect
      console.log('A user disconnected');
    });
});




app.get('/api', (req, res) => {
  res.json({message: 'Hello world',});
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});