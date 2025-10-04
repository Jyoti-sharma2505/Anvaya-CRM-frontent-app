import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaUsers, FaFileAlt, FaChartBar, FaCog, FaHandshake } from "react-icons/fa";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    "nav-link d-flex align-items-center px-3 py-2 mb-1 rounded " +
    (isActive ? "bg-primary text-white" : "text-white");

  return (
    <>
      {/* 🔹 Toggle Button (Mobile Only) */}
      <button
        className="btn btn-dark d-lg-none m-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        ☰ Menu
      </button>

      {/* 🔹 Sidebar */}
      <div
        className={`bg-dark text-white p-3 vh-100 flex-column flex-shrink-0 
        ${isOpen ? "d-block" : "d-none"} d-lg-flex`}
        style={{ width: "220px" }}
      >
        <h3 className="text-center mb-4">Anvaya CRM</h3>
        <ul className="nav nav-pills flex-column mb-auto">
          <li className="nav-item">
            <NavLink to="/leads" className={linkClass} onClick={() => setIsOpen(false)}>
              <FaFileAlt className="me-2" />
              Leads
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/sales-agents" className={linkClass} onClick={() => setIsOpen(false)}>
              <FaUsers className="me-2" />
              Sales Agents
            </NavLink>
          </li>
          {/* <li className="nav-item">
            <NavLink to="/agents" className={linkClass} onClick={() => setIsOpen(false)}>
              <FaHandshake className="me-2" />
              Agents
            </NavLink>
          </li> */}
          <li className="nav-item">
            <NavLink to="/reports" className={linkClass} onClick={() => setIsOpen(false)}>
              <FaChartBar className="me-2" />
              Reports
            </NavLink>
          </li>
          {/* <li className="nav-item">
            <NavLink to="/settings" className={linkClass} onClick={() => setIsOpen(false)}>
              <FaCog className="me-2" />
              Settings
            </NavLink>
          </li> */}
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
