const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const app = express();

app.use(cors());
app.use(express.json());

// const connection = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "",
//   database: "miniapp",
// });

require("dotenv").config();

const connection = mysql.createConnection(process.env.DATABASE_URL);

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
  const id = req.body.id;
  const form = req.body.form;
  const name = req.body.name;
  const age = req.body.age;
  const stID = req.body.stID;
  const gender = req.body.gender;
  const faculty = req.body.faculty;
  const year = req.body.year;
  const commu = req.body.commu;
  var com = "No";
  if (req.body.com == "Have") {
    com = "Yes";
  }
  const phone = req.body.phone;
  const email = req.body.email;
  const sql1 = "SELECT * From club WHERE ID = " + mysql.escape(id);
  const sql2 = "SELECT * From activies WHERE ID = " + mysql.escape(id);
  //
  var pass = 0;
  var mem = "";

  if (form == "Clubs") {
    connection.query(sql1, function (error, results) {
      if (error) throw error;
      Object.keys(results).forEach(function (key) {
        var row = results[key];
        let y = [];
        let fac = [];
        let c = [];
        const gen = row.Gender.split(",");
        if (row.Year == "All") {
          y = [
            "Master Student",
            "Graduate Student",
            "Super senior",
            "Senior",
            "Junior",
            "Junior",
            "Sophomore",
            "Freshman",
          ];
        } else {
          y = row.Year.split(",");
        }

        if (row.Faculty == "All") {
          fac = [
            "Faculty of Architecture",
            "Faculty of Engineering",
            "Faculty of Science",
            "Faculty of Education",
            "Faculty of Education",
            "Faculty of Agriculture",
            "Faculty of Veterinary Science",
            "Faculty of Nursing",
            "Faculty of Dentistry",
          ];
        } else {
          fac = row.Faculty.split(",");
        }

        if (row.Computer == "No") {
          c = ["Yes", "No"];
        }

        if (
          age >= row.Age &&
          c.includes(com) &&
          commu >= row.CommunicationSkill &&
          gen.includes(gender) &&
          fac.includes(faculty) &&
          y.includes(year)
        ) {
          mem = row.Member;
        } else {
          pass = 5;
        }
      });
      //   pass = 6;
      if (pass == 0) {
        if (mem == "") {
          mem = name;
        } else {
          mem = mem + "," + name;
        }

        const sql3 =
          "UPDATE club SET Member = " +
          mysql.escape(mem) +
          "WHERE ID = " +
          mysql.escape(id);
        connection.query(sql3, function (error, results) {
          if (error) throw error;
        });
        connection.query(
          "INSERT INTO student (Name, Age, StudentID, Gender, Faculty, Year, CommunicationSkill, OwnComputer, Phone, Email) VALUES (?,?,?,?,?,?,?,?,?,?)",
          [name, age, stID, gender, faculty, year, commu, com, phone, email],
          (error, result) => {
            if (error) {
              console.log(error);
            }
          }
        );
        res.json("Complete");
      } else {
        res.json("Reject");
      }
    });
  } else {
    connection.query(sql2, function (error, results) {
      if (error) throw error;
      console.log("HI");
      Object.keys(results).forEach(function (key) {
        var row = results[key];
        let y = [];
        let fac = [];
        const gen = row.Gender.split(",");
        if (row.Year == "All") {
          y = [
            "Master Student",
            "Graduate Student",
            "Super senior",
            "Senior",
            "Junior",
            "Junior",
            "Sophomore",
            "Freshman",
          ];
        } else {
          y = row.Year.split(",");
        }

        if (row.Faculty == "All") {
          fac = [
            "Faculty of Architecture",
            "Faculty of Engineering",
            "Faculty of Science",
            "Faculty of Education",
            "Faculty of Education",
            "Faculty of Agriculture",
            "Faculty of Veterinary Science",
            "Faculty of Nursing",
            "Faculty of Dentistry",
          ];
        } else {
          fac = row.Faculty.split(",");
        }
        if (row.Computer == "No") {
          c = ["Yes", "No"];
        }
        if (
          age >= row.Age &&
          c.includes(com) &&
          commu >= row.CommunicationSkill &&
          gen.includes(gender) &&
          fac.includes(faculty) &&
          y.includes(year)
        ) {
          mem = row.Member;
        } else {
          pass = 5;
          console.log(age >= row.Age);
          console.log(c.includes(com));
          console.log(commu >= row.CommunicationSkill);
          console.log(gen.includes(gender));
          console.log(fac.includes(faculty));
          console.log(y.includes(year));
        }
      });
      if (pass == 0) {
        if (mem == "") {
          mem = name;
        } else {
          mem = mem + "," + name;
        }
        const sql3 =
          "UPDATE activies SET Member = " +
          mysql.escape(mem) +
          "WHERE ID = " +
          mysql.escape(id);
        connection.query(sql3, function (error, results) {
          if (error) throw error;
        });
        connection.query(
          "INSERT INTO student (Name, Age, StudentID, Gender, Faculty, Year, CommunicationSkill, OwnComputer, Phone, Email) VALUES (?,?,?,?,?,?,?,?,?,?)",
          [name, age, stID, gender, faculty, year, commu, com, phone, email],
          (error, result) => {
            if (error) {
              console.log(error);
            }
          }
        );
        res.json("Complete");
      } else {
        res.json("Reject");
      }
    });
  }
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

app.post("/member", function (req, res) {
  const id = req.body.id;
  const form = req.body.form;
  var mem;
  let member = [];
  const sql1 = "SELECT Member From club WHERE ID = " + mysql.escape(id);
  const sql2 = "SELECT Member From activies WHERE ID = " + mysql.escape(id);
  if (form == "Clubs") {
    connection.query(sql1, function (error, results) {
      if (error) throw error;
      Object.keys(results).forEach(function (key) {
        var row = results[key];
        mem = row.Member.split(",");
        // mem = m;
      });
      if (mem.length != 0) {
        res.json(mem);
      } else {
        res.json("No member");
      }
    });
  } else {
    connection.query(sql2, function (error, results) {
      if (error) throw error;
      Object.keys(results).forEach(function (key) {
        var row = results[key];
        mem = row.Member.split(",");
        // mem = m;
      });
      if (mem.length != 0) {
        res.json(mem);
      } else {
        res.json("No member");
      }
    });
  }
});

// app.post("/contact", function (req, res) {
//   const name = req.body.name;
//   const sql1 =
//     "SELECT Phone,Email From student WHERE Name = " + mysql.escape(name);
//   connection.query(sql1, function (error, results) {
//     if (error) throw error;
//     console.log("fetch");
//     res.json(results);
//   });
// });

app.listen(3001, function () {
  console.log("CORS-enabled web server listening on port 3001");
});
