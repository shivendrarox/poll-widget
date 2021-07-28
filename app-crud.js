var sqlite = require("sqlite-sync"); //requiring
var path = require("path");
var bodyParser = require("body-parser");
//
const fs = require("fs");
const key = fs.readFileSync("./localhost+1-key.pem");
const cert = fs.readFileSync("./localhost+1.pem");
//
var express = require("express");
var app = express();
//
const https = require("https");
const server = https.createServer({ key: key, cert: cert }, app);
//
var multer = require("multer");
var multipart = multer();
//
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "./public")));
//
const port = 5000;
//
var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database("./database/booking_database.db");
db.run(
  "CREATE TABLE IF NOT EXISTS bookings(id TEXT, name TEXT, slot_num INTEGER UNIQUE NOT NULL)"
);
// db.close((err) => {
//   if (err) {
//     //res.send("There is some error in closing the database");
//     return console.error(err.message);
//   }
//   console.log("Closing the database connection.");
//   //res.send("Database connection successfully closed");
// });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "./public")));

app.post("/form", multipart.fields([]), function (req, res) {
  //cors
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
  res.setHeader(
    "Access-Control-Expose-Headers",
    "AMP-Access-Control-Allow-Source-Origin"
  );
  //cors
  //db insert
  db.serialize(() => {
    db.run(
      "INSERT INTO bookings(id,name,slot_num) VALUES(?,?,?)",
      [req.body.id, req.body.name, req.body.slot],
      function (err) {
        if (err) {
          res.status(404).send("Sorry, cant find that");
          return console.log(err.message);
        } else {
          console.log("New entry has been added");
          console.log(
            "\n---\n" +
              req.body.name +
              "\n---\n" +
              req.body.id +
              "\n---\n" +
              req.body.slot +
              "\n---\n"
          );

          res.send(req.body);
        }
      }
    );
  });
  //res.end();
});

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "./public/amp-main.html"));
  console.log("showing form");
  //res.end();
});

app.get("/slotdata", (req, res) => {
  let disabled_arr = ["", "", "", "", ""];
  sqlite.connect("./database/booking_database.db");
  ///////
  //console.log(sqlite.run("SELECT id, name, slot_num FROM bookings WHERE slot_num=1")[0]);
 //1 
  if (typeof sqlite.run("SELECT id, name, slot_num FROM bookings WHERE slot_num=0")[0] != "undefined") {
    disabled_arr[0] = "booked";
  }else{
    disabled_arr[0] =
    "not_booked";
  }
//2
  if (typeof sqlite.run("SELECT id, name, slot_num FROM bookings WHERE slot_num=1")[0] != "undefined") {
    disabled_arr[1] = "booked";
  }else{
    disabled_arr[1] =
    "not_booked";
  }
//3
  if (typeof sqlite.run("SELECT id, name, slot_num FROM bookings WHERE slot_num=2")[0] != "undefined") {
    disabled_arr[2] = "booked";
  }else{
    disabled_arr[2] =
    "not_booked";
  }
//4
if (typeof sqlite.run("SELECT id, name, slot_num FROM bookings WHERE slot_num=3")[0] != "undefined") {
    disabled_arr[3] = "booked";
  }else{
    disabled_arr[3] =
    "not_booked";
  }
 //5
 if (typeof sqlite.run("SELECT id, name, slot_num FROM bookings WHERE slot_num=4")[0] != "undefined") {
    disabled_arr[4] = "booked";
  }else{
    disabled_arr[4] =
    "not_booked";
  }
 //////////
 
  //closing sqlite
  sqlite.close();
console.log(disabled_arr);
  res.json({
    items: [
      {
        bkd: disabled_arr[0],
        title: "0",
      },
      {
        bkd: disabled_arr[1],

        title: "1",
      },
      {
        bkd: disabled_arr[2],

        title: "2",
      },
      {
        bkd: disabled_arr[3],

        title: "3",
      },
      {
        bkd: disabled_arr[4],

        title: "4",
      },

    ],
  });
  console.log("showing json");
});

app.get("/close", function (req, res) {
  db.close((err) => {
    if (err) {
      res.send("There is some error in closing the database");
      return console.error(err.message);
    }
    console.log("Closing the database connection.");
    res.send("Database connection successfully closed");
  });
});

///////////////
server.listen(port, () =>
  console.log(`Example app listening on port ${port}!`)
);
