import React from 'react'
import {BrowserRouter, Routes, Route} from "react-router-dom"
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css'
import Home from './elements/Home'
import Edit from './elements/Edit'
import Read from './elements/Read'
import Team from './elements/Team'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/edit/:id" element={<Edit />} />
        <Route path="/read/:id" element={<Read />} />
        <Route path="/team/:teamId" element={<Team />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App

