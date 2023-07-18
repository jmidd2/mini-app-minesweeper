import React from 'react';
import { Outlet } from 'react-router-dom';
// import logo from './logo.svg';
import './App.scss';

function App() {
  return (
    <div className="App">
      <header className="App-header" />
      <div className="container">
        <Outlet />
      </div>
    </div>
  );
}

export default App;
