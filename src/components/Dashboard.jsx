import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const Dashboard = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [agents, setAgents] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    source: "",
    salesAgent: "",
    status: "New",
    priority: "Medium",
    timeToClose: "",
    tags: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const fetchDataAgents = async () => {
    try {
      const res = await axios.get(
        "https://anvaya-crm-backend-app.vercel.app/agents"
      );
      setAgents(res.data.agents);
    } catch (error) {
      console.log(error);
    }
  };
  console.log(agents,"agents")

  const handleCreateLead = async () => {
    try {
      const payload = {
        ...formData,
        timeToClose: Number(formData.timeToClose), // ensure number
        tags: formData.tags
          ? formData.tags.split(",").map((tag) => tag.trim())
          : [],
      };
      console.log(payload, "abc");
      const res = await axios.post(
        "https://anvaya-crm-backend-app.vercel.app/leads",
        {
          ...formData,
          tags: formData.tags.split(",").map((tag) => tag.trim()),
        }
      );
      setLeads(...leads, res.data.lead);
      setShowModal(false);
      setFormData({
        name: "",
        source: "",
        salesAgent: "",
        status: "New",
        priority: "Medium",
        timeToClose: "",
        tags: "",
      });
    } catch (errr) {
      console.log(errr);
    }
  };

  const fetchData = async () => {
    try {
      const res = await axios.get(
        "https://anvaya-crm-backend-app.vercel.app/leads"
      );
      setLeads(res.data.leads); // jitni bhi leads hain wo state me save kar lo
    } catch (err) {
      console.error("Error fetching leads:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchDataAgents();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4 text-primary">Anvaya CRM Dashboard</h2>

      {/* Leads Section */}
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-info text-white">
          <h5 className="mb-0">Leads</h5>
        </div>

        <div className="d-flex flex-wrap gap-3 p-3">
          {loading ? (
            <p>Loading leads...</p>
          ) : leads.length > 0 ? (
            leads.map((lead) => (
              <div
                key={lead._id}
                className="card p-3 shadow-sm"
                style={{ minWidth: "150px", cursor: "pointer" }}
                onClick={() => console.log("Clicked Lead:", lead)}
              >
                <Link to={`/leads/${lead._id}`}>
                  <h6 className="mb-1">{lead.name || "Unnamed Lead"}</h6>
                  <small className="text-muted">
                    {lead.status || "No status"}
                  </small>
                </Link>
              </div>
            ))
          ) : (
            <p>No leads found</p>
          )}
        </div>
      </div>

      {/* Lead Status Counts */}
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-info text-white">
          <h5 className="mb-0">Lead Status</h5>
        </div>
        <div className="card-body">
          <ul className="list-group">
            <li className="list-group-item d-flex justify-content-between">
              New{" "}
              <span className="badge bg-primary">
                {leads?.filter((l) => l.status === "New").length}
              </span>
            </li>
            <li className="list-group-item d-flex justify-content-between">
              Contacted{" "}
              <span className="badge bg-warning text-dark">
                {leads?.filter((l) => l.status === "Contacted").length}
              </span>
            </li>
            <li className="list-group-item d-flex justify-content-between">
              Qualified{" "}
              <span className="badge bg-success">
                {leads?.filter((l) => l.status === "Qualified").length}
              </span>
            </li>
          </ul>
        </div>
      </div>
      <div className="mb-3">
        <h5>Quick Filters</h5>
        <button className="btn btn-outline-primary me-2">New</button>
        <button className="btn btn-outline-warning">Contacted</button>
      </div>

      {/* Add New Lead */}
      <button
        className="btn btn-success w-100"
        onClick={() => setShowModal(true)}
      >
        + Add New Lead
      </button>
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Lead</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Lead Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Lead Source</Form.Label>
              <Form.Select
                name="source"
                value={formData.source}
                onChange={handleChange}
              >
                <option value="">Select Source</option>
                <option value="Referral">Referral</option>
                <option value="Website">Website</option>
                <option value="Cold Call">Cold Call</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Sales Agent</Form.Label>
              <Form.Select
                type="text"
                name="salesAgent"
                value={formData.salesAgent}
                onChange={handleChange}
                placeholder="Agent name"
              >
              {agents.map((agent)=>{
                return <option key={agent._id} value={agent._id}>{agent.name}</option>
              })}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Lead Status</Form.Label>
              <Form.Select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Priority</Form.Label>
              <Form.Select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Time to Close (days)</Form.Label>
              <Form.Control
                type="number"
                name="timeToClose"
                value={formData.timeToClose}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label>Tags</Form.Label>
              <Form.Control
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="Comma separated tags"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleCreateLead}>
            Create Lead
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Dashboard;
