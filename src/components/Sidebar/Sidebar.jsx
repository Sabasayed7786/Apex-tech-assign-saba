import React from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  return (
    <nav className="sidebar">
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/add-scenario">Add Scenario</Link>
        </li>
        <li>
          <Link to="/all-scenario">All Scenario</Link>
        </li>
        <li>
          <Link to="/add-vehicle">Add Vehicle</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Sidebar;