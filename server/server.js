const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(express.json());

const port = 5000;

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "players"
});

// app.post('/add_user', (req, res) =>{
//     const sql = "INSERT INTO player_details (name, id, age, team) VALUES (?,?,?,?)";  
//     const values = [
//         req.body.name,
//         req.body.id,
//         req.body.age,
//         req.body.team
//     ]

//     db.query(sql, values, (err, result)=>{
//         if(err) return res.json({message : 'Something unexpected has occured'});
//         return res.json({message : 'Player added successfully'});
//     });
// })

// app.post("/edit_user/:id", (req, res) =>{
//     const id = req.params.id;
//     const sql = "UPDATE player_details SET `name`=?, `age`=?, `team`=? WHERE id=?";;  
//     const values = [
//         req.body.name,
//         req.body.age,
//         req.body.team,
//         id
//     ]

//     db.query(sql, values, (err, result)=>{
//         if(err) return res.json({message : 'Something unexpected has occured'});
//         return res.json({message : 'Player added successfully'});
//     });
// })

// app.delete("/delete/:id", (req, res) =>{
//     const id = req.params.id;
//     const sql = "DELETE FROM player_details WHERE id=?";
//     const values = [id];

//     db.query(sql, values, (err, result)=>{
//         if(err) return res.json({message : 'Something unexpected has occured'});
//         return res.json({message : 'Player added successfully'});
//     });
// })

app.get("/players", (req, res) => {
    const sql = "SELECT * FROM player_details";
    db.query(sql, (err, result) => {
        if(err) return res.json({message: 'Server Error'});
        return res.json(result);
    });
});

app.get("/get_player/:id", (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM player_details WHERE `id`= ?";
    db.query(sql, [id], (err, result) => {
      if (err) res.json({ message: "Server error" });
      return res.json(result);
    });
  });

  app.get("/get_playerTeam/:team", (req, res) => {
    const team = req.params.team;
    const sql = "SELECT * FROM nba_salaries WHERE `team`= ?";
    db.query(sql, [team], (err, result) => {
      if (err) res.json({ message: "Server error" });
      return res.json(result);
    });
  });

  // New endpoint to get player salaries
app.post("/get_playerSalaries", (req, res) => {
    const playerIds = req.body.playerIds;
    const sql = "SELECT * FROM player_salaries WHERE `player_id` IN (?)";
    db.query(sql, [playerIds], (err, result) => {
        if (err) return res.json({ message: "Server error" });
        const salaries = result.reduce((acc, salary) => {
            if (!acc[salary.player_id]) {
                acc[salary.player_id] = [];
            }
            acc[salary.player_id].push(salary);
            return acc;
        }, {});
        return res.json(salaries);
    });
});



app.listen(port, () => {
    console.log('listening');
});