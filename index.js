const users = require("./users.json");
const userProfile = require("./userProfile.json");

const express = require("express");
const res = require("express/lib/response");
const mongodb = require("mongodb").MongoClient;

const app = express();

const port = 5000;

let db;

let connectionString = "mongodb://localhost:27017";

mongodb.connect(
  connectionString,
  { useNewUrlParser: true, useUnifiedTopology: true },
  function (err, client) {
    if (err) throw err;
    db = client.db("userinfo");
    app.listen(port, () => {
      console.log("server started");
    });
  }
);

app.use(express.json());

app.get("/", (req, res) => res.end("Hello from server"));

app.post("/create-user", function (req, res) {
  for (var i = 0; i < users.length; i++) {
    let userdetials = userProfile[i];
    db.collection("user").insertOne(
      {
        firstName: users[i].firstName,
        lastName: users[i].lastName,
        email: users[i].email,
        password: users[i].password,
      },
      function (err, info) {
        if (err) throw err;
        else {
          db.collection("usersProfile").insertOne(
            {
              user_id: info.insertedId,
              dob: userdetials.dob,
              mobile_no: userdetials.mobile_no,
            },
            function (err, info) {
              if (err) throw err;
              res.end("data inserted");
            }
          );
        }
      }
    );
  }
});

// comment

app.get("/get-users", function (req, res) {
  db.collection("user")
    .find()
    .toArray(function (err, items) {
      if (err) throw err;
      res.send(items);
    });
});

app.get("/get-profile", function (req, res) {
  db.collection("usersProfile")
    .find()
    .toArray(function (err, items) {
      if (err) throw err;
      res.send(items);
    });
});
