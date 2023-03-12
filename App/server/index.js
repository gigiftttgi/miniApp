const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const app = express();

app.use(cors());
app.use(express.json());

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "miniapp",
});

connection.connect();

app.get("/clubs", function (req, res, next) {
  connection.query("SELECT * From club", function (error, results, fields) {
    if (error) throw error;
    res.json(results);
  });
});

app.get("/act", function (req, res, next) {
  connection.query("SELECT * From activies", function (error, results, fields) {
    if (error) throw error;
    res.json(results);
  });
});

app.post("/join", function (req, res) {
  const name = req.body.name;
  const age = req.body.age;
  const stID = req.body.stID;
  const gender = req.body.gender;
  const faculty = req.body.faculty;
  const year = req.body.year;
  const commu = req.body.commu;
  const com = req.body.com;
  const phone = req.body.phone;
  const email = req.body.email;

  connection.query(
    "INSERT INTO student (Name, Age, StudentID, Gender, Faculty, Year, CommunicationSkill, OwnComputer, Phone, Email) VALUES (?,?,?,?,?,?,?,?,?,?)",
    [name, age, stID, gender, faculty, year, commu, com, phone, email],
    (error, result) => {
      if (error) {
        console.log(error);
      } else {
        res.send("Value add");
      }
    }
  );
});

app.post("/detail", function (req, res) {
  const id = req.body.id;
  const form = req.body.form;
  const sql1 = "SELECT * From club WHERE ID = " + mysql.escape(id);
  const sql2 = "SELECT * From activies WHERE ID = " + mysql.escape(id);

  if (form == "Clubs") {
    connection.query(sql1, function (error, results) {
      if (error) throw error;
      res.json(results);
    });
  } else {
    connection.query(sql2, function (error, results) {
      if (error) throw error;
      res.json(results);
    });
  }
});

app.listen(3001, function () {
  console.log("CORS-enabled web server listening on port 3001");
});
