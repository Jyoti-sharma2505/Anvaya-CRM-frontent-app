import React from "react";
import {Link } from "react-router-dom"

const Bar = () => {
  return (
    <div
      className="d-flex flex-column flex-shrink-0 p-3 bg-dark text-white vh-100"
      style={{ width: "220px" }}
    >
      <h3 className="text-center mb-4">Anvaya CRM</h3>
      <ul className="nav nav-pills flex-column mb-auto">
        <li>
          <Link to="/" className="nav-link text-white">
            ⬅ Back to Dashboard
          </Link>
        </li>
        <li>
          <a href="#" className="nav-link active text-white">
            Lead Details
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Bar;
