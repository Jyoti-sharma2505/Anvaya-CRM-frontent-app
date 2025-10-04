import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Bar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isActiveLeads = location.pathname === "/leads";
  const isActiveAgents = location.pathname === "/sales-agents";
  const isActiveReports = location.pathname === "/reports";

  return (
    <>
      {/* 🔹 Toggle Button for Mobile */}
      <button
        className="btn btn-dark d-lg-none m-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        ☰ Menu
      </button>

      <div
        className={`bg-dark text-white p-3 vh-100 d-flex flex-column 
        ${isOpen ? "d-block" : "d-none"} d-lg-flex`}
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
            {isActiveLeads && (
              <Link to="/leads" className="nav-link active text-white">
                Lead Details
              </Link>
            )}
          </li>
          <li>
            {isActiveAgents && (
              <Link to="/sales-agents" className="nav-link active text-white">
                Sales Agent
              </Link>
            )}
          </li>
          <li>
            {isActiveReports && (
              <Link to="/reports" className="nav-link active text-white">
                Reports
              </Link>
            )}
          </li>
        </ul>
      </div>
    </>
  );
};

export default Bar;
