
import {Link} from "react-router-dom"

const Sidebar = () => {
  return (
    <div
      className="d-flex flex-column flex-shrink-0 p-3 bg-dark text-white vh-100"
      style={{ width: "220px" }}
    >
      <h3 className="text-center mb-4">Anvaya CRM</h3>
      <ul className="nav nav-pills flex-column mb-auto">
        <li className="nav-item">
          <Link to="/leads" className="nav-link active text-white">
          Leads
          </Link>
        </li>
        <li>
          <a href="#" className="nav-link text-white">Sales</a>
        </li>
        <li>
          <a href="#" className="nav-link text-white">Agents</a>
        </li>
        <li>
          <a href="#" className="nav-link text-white">Reports</a>
        </li>
        <li>
          <a href="#" className="nav-link text-white">Settings</a>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
