import { Link, useParams } from "react-router-dom";
import teamsData from "../data/teams.json";
import nbaSalaries from "../data/nba_salaries.json";
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Team = () => {
  const { teamId } = useParams();
  let team;

  // Iterate over each division to find the team
  Object.keys(teamsData).forEach((division) => {
    const foundTeam = teamsData[division].find((t) => t.id === teamId);
    if (foundTeam) {
      team = foundTeam;
    }
  });

  const [data, setData] = useState([]);
  const years = ['2024-25', '2025-26', '2026-27', '2027-28', '2028-29', '2029-30'];
  const [selectedYear, setSelectedYear] = useState('2024-25'); // Default selected year
  const firstApronThreshold = [178132000,195945000,	215539500,	237093450,	260802795,	286883075]; 
  const secondApronThreshold = [188931000, 207824000, 228606400,	251467040,	276613744,	304275118];
/** Would use below code for mySQL integration 
  useEffect(() => {
    axios
      .get(`/get_playerTeam/${teamId}`)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => console.log(err));
  }, [teamId]); */
  // For now, using the static JSON data
  // Extract player data for the selected team from the JSON file
 const playerData = nbaSalaries
  .find((table) => table.type === "table" && table.name === "nba_salaries")
  ?.data.filter((player) => player.Team === teamId.toUpperCase()) || []; // Default to an empty array if no data is found

if (playerData.length === 0) {
  return <p>No players found for this team</p>;
}
  const calculateYearlyTotals = () => {
    const totals = {};
    years.forEach((year) => {
      totals[year] = playerData.reduce((sum, player) => {
        const value = parseFloat(player[year]?.replace(/[$,]/g, "") || 0);
        return sum + value;
      }, 0);
    });
    return totals;
  };

  const calculateGuaranteedTotal = () => {
    const total = playerData.reduce((sum, player) => {
      const guaranteed = player['Guaranteed'].replace('$', '');
      const value = parseFloat(guaranteed) || 0;
      return sum + value;
    }, 0);
    return total;
  };

  const getColor = (value, threshold) => {
    return value > threshold ? 'red' : 'limegreen';
  };

  const yearlyTotals = calculateYearlyTotals();
  const currentYearTotal = yearlyTotals[selectedYear] || 0;
  return (
    <div className="container-fluid">
      <Link to="/" className="btn btn-success" style={{ marginTop: '10px', marginLeft: '10px' }}>Back</Link>
      <div className="text-center p-6">
        <img src={team.logo} alt={team.name} className="team-logo-2" />
        <h1 className="text-3xl font-bold mt-4">{team.name}</h1>
        <div className="team-dashboard">
          <div className="dashboard-section">
            <h2>Team Summary</h2>
            <label htmlFor="year-selector">Select Year:</label>
            <select
              className="custom-select"
              id="year-selector"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <p><strong>Total for {selectedYear}:</strong> ${currentYearTotal.toLocaleString()}</p>
          </div>
          <div className="dashboard-section">
            <h3>First Apron Info</h3>
            <p><strong>First Apron Threshold: </strong> ${firstApronThreshold[years.indexOf(selectedYear)].toLocaleString()}</p>
            <p>
              <strong>First Apron Difference: </strong> 
              <span style={{ color: getColor(currentYearTotal, firstApronThreshold[years.indexOf(selectedYear)]) }}>
                ${Math.abs(currentYearTotal - firstApronThreshold[years.indexOf(selectedYear)]).toLocaleString()}
              </span>
            </p>
            <p><strong>Status:</strong> {currentYearTotal > firstApronThreshold[years.indexOf(selectedYear)] ? 'Above' : 'Below'} First Apron</p>
          </div>
          <div className="dashboard-section">
            <h3>Second Apron Info</h3>
            <p><strong>Second Apron Threshold:</strong> ${secondApronThreshold[years.indexOf(selectedYear)].toLocaleString()}</p>
            <p>
              <strong>Second Apron Difference: </strong> 
              <span style={{ color: getColor(currentYearTotal, secondApronThreshold[years.indexOf(selectedYear)]) }}>
                ${Math.abs(currentYearTotal - secondApronThreshold[years.indexOf(selectedYear)]).toLocaleString()}
              </span>
            </p>
            <p><strong>Status:</strong> {currentYearTotal > secondApronThreshold[years.indexOf(selectedYear)] ? 'Above' : 'Below'} Second Apron</p>
          </div>
          </div>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Player</th>
              {years.map(year => (
                <th key={year}>{year}</th>
              ))}
              <th>Guaranteed</th>
            </tr>
          </thead>
          <tbody>
            {playerData.map((player) => (
              <tr key={player.Name}>
                <td className="player-cell">
                  <img src={`https://www.basketball-reference.com/req/202106291/images/headshots/${player.player_id}.jpg`} alt={player.Name} className="player-image-small" />
                  <span className="player-name">{player.Name}</span>
                </td>
                {years.map(year => (
                  <td key={year}>
                    {player[year] 
                      ? '$' + player[year].replace(/[$,]/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',') 
                      : '-'}
                  </td>
                ))}
                <td>
                  {player.Guaranteed ? player.Guaranteed.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '-'}                
                </td>
              </tr>
            ))}
            <tr>
              <td className="player-cell"><strong>Total</strong></td>
              {years.map(year => (
                <td key={year}>
                 ${yearlyTotals[year].toLocaleString()}
                </td>
              ))}
              <td>${calculateGuaranteedTotal().toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <footer className="footer">
        <p>*Includes dead cap</p>
        <p>Salary data provided by <a href="https://www.basketball-reference.com/contracts/players.html">Basketball Reference</a></p>
      </footer>
    </div>
  );
};

export default Team;