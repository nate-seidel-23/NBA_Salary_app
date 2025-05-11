import React, {useState, useEffect} from 'react'
import axios from 'axios'
import {Link, useParams} from 'react-router-dom'

function Read() {
    const [data, setData] = useState([]);
    const {id} = useParams();
     useEffect(() => {
    axios
      .get(`/get_player/${id}`)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => console.log(err));
  }, [id]);


  return (
    <div>
       <div className="container-fluid vw-100 vh-100 bg-primary">
        <h1>Player {id}</h1>
        <Link to="/" className="btn btn-success">Back</Link>
        {data.map((player) => {
          return (
            <ul className="list-group">
              <li key={player.id} className="list-group-item">
                <b>ID: </b>
                {player["id"]}
              </li>
              <li key = {player.name} className="list-group-item">
                <b>Name: </b>
                {player["name"]}
              </li>
              <li key = {player.team} className="list-group-item">
                <b>Team: </b>
                {player["team"]}
              </li>
              <li key = {player.age} className="list-group-item">
                <b>Age: </b>
                {player["age"]}
              </li>
            </ul>
          );
        })}
        </div>
    </div>
  )
}

export default Read
