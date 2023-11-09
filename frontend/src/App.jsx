import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import Header from './Components/Header/Header';
import Login from './Components/Login/Login';

function App() {

  return (
    <Router>
      <Header/>

      <Routes>
        <Route path='/' element = { <Login/>} />
      </Routes>
     

    </Router>
  )
}

export default App
