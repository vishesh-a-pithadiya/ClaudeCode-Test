import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-top">
        <div className="navbar-brand">
          <img src="/ti-logo.svg" alt="Texas Instruments" className="navbar-logo" />
        </div>
        <button className="navbar-login">Login</button>
      </div>
      <ul className="navbar-links">
        <li>
          <NavLink to="/" end>Home</NavLink>
        </li>
        <li>
          <NavLink to="/e2e">E2E</NavLink>
        </li>
        <li>
          <NavLink to="/search">Search</NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
