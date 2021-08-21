// https://sweetcode.io/leaderboard-api-game-nodejs-express-mongodb/

const express = require("express");
const bodyParser = require("body-parser");

const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());

const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://aaahana:<password>@cluster0.j2f4s.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const collection = client.db("player")
});

let db;

// The index route
app.get("/", function(req, res) {
   res.send("LeaderBoard");
});

// Route to create new player
app.post("/players", async function(req, res) {
    // get information of player from POST body data
    let { username, score } = req.body;
    console.log(req.body)
 
    // check if the username already exists
    const alreadyExisting = await db
        .collection("players")
        .findOne({ username: username });
 
    if (alreadyExisting) {
        res.send({ status: false, msg: "player username already exists" });
    } else {
        // create the new player
        await db.collection("players").insertOne({ username, score });
        console.log(`Created Player ${username}`);
        res.send({ status: true, msg: "player created" });
    }
 });
 
 app.put("/players", async function(req, res) {
    let { username, score } = req.body;
    // check if the username already exists
    const alreadyExisting = await db
        .collection("players")
        .findOne({ username: username });
    if (alreadyExisting) {
        // Update player object with the username
        await db
            .collection("players")
            .updateOne({ username }, { $set: { username, score } });
        console.log(`Player ${username} score updated to ${score}`);
        res.send({ status: true, msg: "player score updated" });
    } else {
        res.send({ status: false, msg: "player username not found" });
    }
 }); 

 app.delete("/players", async function(req, res) {
    let { username, score } = req.body;
    // check if the username already exists
    const alreadyExisting = await db
        .collection("players")
        .findOne({ username: username });
 
    if (alreadyExisting) {
        await db.collection("players").deleteOne({ username });
        console.log(`Player ${username} deleted`);
        res.send({ status: true, msg: "player deleted" });
    } else {
        res.send({ status: false, msg: "username not found" });
    }
 });

 // Access the leaderboard
app.get("/players", async function(req, res) {
    db.collection("players")
        .find()
        .sort({ score: -1 })
        .toArray(function(err, result) {
            if (err)
                res.send({ status: false, msg: "failed to retrieve players" });
            console.log(Array.from(result));
            res.send({ status: true, msg: result });
        });
 });
db = client.db("Players");

   app.listen(PORT, async function() {
       console.log(`Listening on Port ${PORT}`);
       if (db) {
           console.log("Database is Connected!", );
       }
   });

