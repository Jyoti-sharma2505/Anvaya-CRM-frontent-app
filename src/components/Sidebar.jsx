import { NavLink } from "react-router-dom";
import { FaUsers, FaFileAlt, FaChartBar, FaCog, FaHandshake } from "react-icons/fa";

const Sidebar = () => {
  const linkClass = ({ isActive }) =>
    "nav-link d-flex align-items-center px-3 py-2 mb-1 rounded " +
    (isActive ? "bg-primary text-white" : "text-white");

  return (
    <div
      className="d-flex flex-column flex-shrink-0 p-3 bg-dark text-white vh-100"
      style={{ width: "220px" }}
    >
      <h3 className="text-center mb-4">Anvaya CRM</h3>
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <NavLink to="/leads" className={linkClass}>
            <FaFileAlt className="me-2" />
            Leads
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/sales-agents" className={linkClass}>
            <FaUsers className="me-2" />
            Sales Agents
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/agents" className={linkClass}>
            <FaHandshake className="me-2" />
            Agents
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/reports" className={linkClass}>
            <FaChartBar className="me-2" />
            Reports
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/settings" className={linkClass}>
            <FaCog className="me-2" />
            Settings
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
