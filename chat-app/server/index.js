const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const { Mutex } = require('async-mutex');
const express = require('express');
const bcrypt = require('bcryptjs');
const app = express();
const PORT = 4000;
//import HTTP and CORS libraries - allows for data transfer between client and server
const http = require('http').Server(app);
//Use cors
const cors = require('cors');
//Add socket.io - adds real time connection
const socketIO = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:3000"
    },
    maxHttpBufferSize: 1e8 // This sets the maximum HTTP buffer size to 100MB
});
//Import the rate limiter to protect endpoints
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
 windowMs: 15 * 60 * 1000, // 15 minutes
 max: 100, // limit each IP to 100 requests per windowMs
});

//Use the rate limiter across all app requests
app.use(limiter);

//Use cors
app.use(cors());
//Used to parse json bodies
app.use(express.json());
// Apply to all requests

//MongoDb connection
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://admin:MQzAejunoSaEjgL2@distchat.ejyyxwq.mongodb.net/?retryWrites=true&w=majority&appName=DistChat";
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
//Initilise db variable
let db;
//Mutex used to control access to the database connection
const dbMutex = new Mutex();

async function connectToDatabase() {
    try {
        //Connect to Mongo db
        await client.connect();
        //Log that connection has occured when complete
        console.log("Connected to MongoDB");
        //Set the relevant database as a variable
        db = client.db("DistChat");
    } catch (error) {
        //Log specific error
        if (error instanceof MongoClient.MongoServerError) {
            //Handle server errors
            console.error("MongoDB server error:", error.message);
        } else if (error instanceof MongoClient.MongoNetworkError) {
            //Handle network errors
            console.error("MongoDB network error:", error.message);
        } else {
            //Handle generic errors
            console.error("General MongoDB error:", error.message);
        }
    }
}

async function run() {
    try {
        await connectToDatabase();
        await db.command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch (error) {
        console.error(error);
    }
}
run().catch(console.dir);


//Check if this cluster is the master
if (cluster.isMaster) {
    //Show master cluster is running
    console.log(`Master ${process.pid} is running`);
    //Create clusters for the number of CPU cores available 
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.process.pid} died`);
    });
} else {
    //Initialise array for users
    let users = [];
    //On conntection create a unique id for each socket
    socketIO.on('connection', (socket) => {
        //log to console the id of this socket
        console.log(`The user ${socket.id} just connected!`);
        //Listen for a message being sent
        socket.on('message', async (data) => {
            console.log(data);
            //Use mutex to wait to connect 
            const release = await dbMutex.acquire();
            try {
                //Send message to the database
                await db.collection('messages').insertOne(data);
                //Send the message data to all users
                socketIO.emit('messageResponse', data);
            } finally {
                //Unlock to allow other messages to be sent
                release();
            }
            
        });
        socket.on('disconnect', () => {
            console.log('A user disconnected');
        });
    });
    app.get('/api', (req, res) => {
        res.json({ message: 'Hello world' });
    });
    http.listen(PORT, () => {
        console.log(`Server listening on ${PORT}`);
    });
    console.log(`Worker ${process.pid} started`);
}


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

app.get('/api/getMsgs', async (req, res) => {
    try {
        //Get all messages
        const messages = await db.collection('messages').find({}).toArray();
        if (!messages) {
            return res.status(404).send('Messages not found');
        } else {
            //if messages found respond with them
            res.status(200).json(messages);
        }

    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
})
