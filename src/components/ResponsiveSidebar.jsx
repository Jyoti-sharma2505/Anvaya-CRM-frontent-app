import React, { useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import {
  FaUsers,
  FaFileAlt,
  FaChartBar,
} from "react-icons/fa";

const ResponsiveSidebar = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isHome = location.pathname === "/";
  const isLead = location.pathname.startsWith("/leads");
  const isAgent = location.pathname.startsWith("/sales-agents");
  const isReport = location.pathname.startsWith("/reports");

  const linkClass = ({ isActive }) =>
    "nav-link d-flex align-items-center px-3 py-2 mb-1 rounded " +
    (isActive ? "bg-primary text-white" : "text-white");

  return (
    <div className="d-flex">
      {/* 🔹 Sidebar */}
      <div
        className={`sidebar bg-dark text-white p-3 vh-100 flex-column flex-shrink-0
        ${isOpen ? "open" : ""}`}
      >
        <h3 className="text-center mb-4">Anvaya CRM</h3>

        <ul className="nav nav-pills flex-column mb-auto">
          {!isHome && (
            <li>
              <Link
                to="/"
                className="nav-link text-white"
                onClick={() => setIsOpen(false)}
              >
                ⬅ Back to Dashboard
              </Link>
            </li>
          )}

          {isHome && (
            <>
              <li className="nav-item">
                <NavLink
                  to="/leads"
                  className={linkClass}
                  onClick={() => setIsOpen(false)}
                >
                  <FaFileAlt className="me-2" /> Leads
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/sales-agents"
                  className={linkClass}
                  onClick={() => setIsOpen(false)}
                >
                  <FaUsers className="me-2" /> Sales Agents
                </NavLink>
              </li>
              {/* <li className="nav-item">
                <NavLink
                  to="/agents"
                  className={linkClass}
                  onClick={() => setIsOpen(false)}
                >
                  <FaHandshake className="me-2" /> Agents
                </NavLink>
              </li> */}
              <li className="nav-item">
                <NavLink
                  to="/reports"
                  className={linkClass}
                  onClick={() => setIsOpen(false)}
                >
                  <FaChartBar className="me-2" /> Reports
                </NavLink>
              </li>
              {/* <li className="nav-item">
                <NavLink
                  to="/settings"
                  className={linkClass}
                  onClick={() => setIsOpen(false)}
                >
                  <FaCog className="me-2" /> Settings
                </NavLink>
              </li> */}
            </>
          )}

          {!isHome && (
            <>
              {isLead && (
                <li>
                  <NavLink
                    to="/leads"
                    className="nav-link active text-white"
                    onClick={() => setIsOpen(false)}
                  >
                    Lead Details
                  </NavLink>
                </li>
              )}
              {isAgent && (
                <li>
                  <NavLink
                    to="/sales-agents"
                    className="nav-link active text-white"
                    onClick={() => setIsOpen(false)}
                  >
                    Sales Agents
                  </NavLink>
                </li>
              )}
              {isReport && (
                <li>
                  <NavLink
                    to="/reports"
                    className="nav-link active text-white"
                    onClick={() => setIsOpen(false)}
                  >
                    Reports
                  </NavLink>
                </li>
              )}
            </>
          )}
        </ul>
      </div>

      {/* 🔹 Main Content */}
      <div
        className="flex-grow-1"
        style={{
          marginLeft: isOpen ? "220px" : "0",
          transition: "margin-left 0.3s ease-in-out",
          width: "100%",
        }}
      >
        {/* Toggle Button (Mobile only) */}
        <button
          className="btn btn-dark d-lg-none m-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰ Menu
        </button>

        <div className="p-3">{children}</div>
      </div>
    </div>
  );
};

export default ResponsiveSidebar;
