import React from 'react';
import {Link} from 'react-router-dom';
import teamsData from "../data/teams.json";
function Home() {
  return (
    <div>
      <div className="header-container">
        <h1 className="header-title ">NBA Salary Tool</h1>
        <h2 className="sub-header">Select a team to get started</h2>
      </div>
      <div className="divisions-container">
        {Object.keys(teamsData).map((division) => (
          <div key={division} className="division">
            <h2 className='App'>{division}</h2>
            <div className="grid grid-cols-3 gap-2 p-3">
              {teamsData[division].map((team) => (
                <Link key={team.id} to={`/team/${team.id}`} className="flex flex-col items-center">
                  <img src={team.logo} alt={team.name} className="team-logo" />
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
      <footer className="footer">
        <p>Salary data provided by <a href="https://www.basketball-reference.com/contracts/players.html">Basketball Reference</a></p>
      </footer>
    </div>
  )
}

export default Home
