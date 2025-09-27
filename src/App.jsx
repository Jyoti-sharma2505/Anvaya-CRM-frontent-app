import "./App.css";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import LeadDetails from "./pages/LeadDetails";
import Bar from "./pages/Bar";
import LeadList from "./pages/LeadList";

// ✅ Layout component jaha useLocation sahi chalega
function Layout() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <div className="app-container d-flex">
      {isHome ? <Sidebar /> : <Bar />}
      <div className="flex-grow-1 p-3">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/leads/:leadId" element={<LeadDetails />} />
          <Route path="/leads" element={<LeadList/>}/>
          {/* Baaki routes yaha add kar sakte ho */}
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;
