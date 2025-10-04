// Dashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Dashboard = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [agents, setAgents] = useState([]);
  const [filterStatus, setFilterStatus] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    source: "",
    salesAgent: "",
    status: "New",
    priority: "Medium",
    timeToClose: "",
    tags: "",
  });

  const navigate = useNavigate();

  // handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // fetch agents
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

  // fetch leads
  const fetchData = async () => {
    try {
      const res = await axios.get(
        "https://anvaya-crm-backend-app.vercel.app/leads"
      );
      setLeads(res.data.leads);
    } catch (err) {
      console.error("Error fetching leads:", err);
    } finally {
      setLoading(false);
    }
  };

  // create lead
  const handleCreateLead = async () => {
    try {
      const payload = {
        ...formData,
        timeToClose: Number(formData.timeToClose) || 0,
        tags: formData.tags
          ? formData.tags.split(",").map((tag) => tag.trim())
          : [],
      };

      const res = await axios.post(
        "https://anvaya-crm-backend-app.vercel.app/leads",
        payload
      );

      // ✅ Correct way to update state
      setLeads((prev) => [...prev, res.data.lead]);

      toast.success("Lead added successfully!");

      // reset form
      setFormData({
        name: "",
        source: "",
        salesAgent: "",
        status: "New",
        priority: "Medium",
        timeToClose: "",
        tags: "",
      });
      setShowModal(false);
    } catch (err) {
      console.error("Error creating lead:", err);
      toast.error("Failed to add lead");
    }
  };

  const goToStatusPage = (status) => {
    navigate(`/leads/status/${status}`);
  };

  useEffect(() => {
    fetchData();
    fetchDataAgents();
  }, []);

  return (
    <div className="container mt-4 py-3">
      <ToastContainer />
      <h2 className="text-center mb-4 text-primary">Anvaya CRM Dashboard</h2>

      {/* Leads Section */}
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-info text-white">
          <h5 className="mb-0">Leads</h5>
        </div>

        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3 p-3">
          {loading ? (
            <p>Loading leads...</p>
          ) : leads.length > 0 ? (
            leads.map((lead) => (
              <div className="col" key={lead._id}>
                <div
                  className="card h-100 p-3 shadow-sm"
                  style={{ cursor: "pointer" }}
                >
                  <Link
                    to={`/leads/${lead._id}`}
                    className="text-decoration-none"
                  >
                    <h6 className="mb-1 text-dark">
                      {lead.name || "Unnamed Lead"}
                    </h6>
                    <small className="text-muted">
                      {lead.status || "No status"}
                    </small>
                  </Link>
                </div>
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
            {["New", "Contacted", "Qualified", "Closed"].map((status) => (
              <li
                key={status}
                className="list-group-item d-flex justify-content-between"
                onClick={() => goToStatusPage(status)}
                style={{ cursor: "pointer" }}
              >
                {status}{" "}
                <span
                  className={`badge ${
                    status === "New"
                      ? "bg-primary"
                      : status === "Contacted"
                      ? "bg-warning text-dark"
                      : status === "Qualified"
                      ? "bg-success"
                      : "bg-danger"
                  }`}
                >
                  {leads?.filter((l) => l?.status === status).length}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="mb-3">
        <h5>Quick Filters</h5>
        {["New", "Contacted", "Qualified", "Closed"].map((status) => (
          <button
            key={status}
            className={`btn me-2 ${
              filterStatus === status ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => goToStatusPage(status)}
          >
            {status}
          </button>
        ))}
        {filterStatus && (
          <button
            className="btn btn-secondary ms-3"
            onClick={() => setFilterStatus("")}
          >
            Clear Filter
          </button>
        )}
      </div>

      {/* Add New Lead Button */}
      <button
        className="btn btn-success w-100"
        onClick={() => setShowModal(true)}
      >
        + Add New Lead
      </button>

      {/* Add Lead Modal */}
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
                name="salesAgent"
                value={formData.salesAgent}
                onChange={handleChange}
              >
                <option value="">Select Agent</option>
                {agents.map((agent) => (
                  <option key={agent._id} value={agent._id}>
                    {agent.name}
                  </option>
                ))}
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
                <option value="Closed">Closed</option>
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
