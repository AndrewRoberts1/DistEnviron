const express = require('express');
const bcrypt = require('bcryptjs');
const app = express();
const PORT = 4000;

//import HTTP and CORS libraries - allows for data transfer between client and server
const http = require('http').Server(app);
const cors = require('cors');

//Use cors
app.use(cors());
//Used to parse json bodies
app.use(express.json());

//Add socket.io - adds real time connection
const socketIO = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:3000"
    }
});

//Initialise array for users
let users = [];

//On conntection create a unique id for each socket
socketIO.on('connection', (socket) => {
    //log to console the id of this socket
    console.log(`The user ${socket.id} just connected!`);
    //Listen for a message being sent
    socket.on('message', (data) => {
        console.log(data);
        //Send the message data to all users
        socketIO.emit('messageResponse', data);
    });
    //Listen for a new user being added
    socket.on('newUser', (data) => {
      
      //check if user is not already in the array
      if (!users.some(user => user.userId == data.userId)) {
        //add new user to list of users
        users.push(data);
      }
      
      console.log(users);
      //Send the list of users to the client
      socketIO.emit('userList', users);
    });
  //Listen for a new user being added
  socket.on('removeUser', (data) => {
      
    //remove user from list of users
    users.forEach((user, index) => {
      if (user.userId == data.userId) {
        users = users.slice(index);
      }
    });
    console.log(users);
    //Send the list of users to the client
    socketIO.emit('userList', users);
  });
    socket.on('disconnect', () => {
        //Message on disconnect
      console.log('A user disconnected');
    });
});




app.get('/api', (req, res) => {
  res.json({message: 'Hello world',});
});

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});



//MongoDb connection
const { MongoClient, ServerApiVersion  } = require('mongodb');
const uri = "mongodb+srv://admin:H3SBThRYcLOWpDu0@distchat.ejyyxwq.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
//Initialise db variable
let db;

//Functions to connect to database
async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    db = client.db("DistChat"); // Replace "your_database_name" with your actual database name
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    // Handle error appropriately, e.g., exit the process or retry connection
  }
}

async function run() {
  try {
    await connectToDatabase(); // Connect to MongoDB before proceeding
    // Send a ping to confirm a successful connection
    await db.command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // No need to close the client here; keep the connection open
  }
}
run().catch(console.dir);



// Create User Endpoint
app.post('/api/users', async (req, res) => {
  try {
    console.log(req.body)
      const { name, email, password } = req.body;
      console.log(req.body)
      // Hash the password before saving it to the database
      const hashedPassword = await bcrypt.hash(password, 10);
      await db.collection('users').insertOne({ name, email, password: hashedPassword });
      //when user created get their details
      const user = await db.collection('users').findOne({ name: name, email: email });
      //if login is successful
      res.status(200).json(user);
  } catch (error) {
      console.error(error);
      res.status(500).send('Internal server error');
  }
});

// Login Endpoint
app.post('/api/login', async (req, res) => {
  try {
      const { name, email, password } = req.body;
      const user = await db.collection('users').findOne({ name: name, email: email });
      if (!user) {
          return res.status(404).send('User not found');
      }
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
          return res.status(401).send('Invalid password');
      }
      //if login is successful
      res.status(200).json(user);
  } catch (error) {
      console.error(error);
      res.status(500).send('Internal server error');
  }
});