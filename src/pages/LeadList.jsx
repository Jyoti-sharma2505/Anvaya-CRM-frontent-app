import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const LeadList = () => {
  const [leads, setLeads] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [agentFilter, setAgentFilter] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [agents, setAgents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    source: "",
    salesAgent: "",
    status: "New",
    priority: "Medium",
    timeToClose: "",
    tags: "",
  });

  useEffect(() => {
    fetchLeads();
    fetchDataAgents();
  }, []);

  const fetchLeads = async () => {
    const res = await axios.get("https://anvaya-crm-backend-app.vercel.app/leads");
    setLeads(res.data.leads);
  };

  const fetchDataAgents = async () => {
    try {
      const res = await axios.get("https://anvaya-crm-backend-app.vercel.app/agents");
      setAgents(res.data.agents);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCreateLead = async () => {
    try {
      const payload = {
        ...formData,
        timeToClose: Number(formData.timeToClose),
        tags: formData.tags ? formData.tags.split(",").map((tag) => tag.trim()) : [],
      };
      const res = await axios.post("https://anvaya-crm-backend-app.vercel.app/leads", payload);
      setLeads((prev) => [...prev, res.data.lead]);
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
    } catch (error) {
      console.log(error);
    }
  };

  // Filter + Sort
  const filteredLeads = leads
    ?.filter(
      (lead) =>
        (statusFilter ? lead.status === statusFilter : true) &&
        (agentFilter ? lead.salesAgent?._id === agentFilter : true)
    )
    .sort((a, b) => {
      if (sortBy === "priority") {
        return (b.priority || "").localeCompare(a.priority || "");
      }
      if (sortBy === "timeToClose") {
        return a.timeToClose - b.timeToClose;
      }
      return 0;
    });

  return (
    <div className="container-fluid p-3">
      <h2 className="mb-4 text-center text-md-start">Lead List</h2>

      {/* Filters - Responsive Grid */}
      <div className="row g-2 mb-4">
        <div className="col-12 col-md-4">
          <select
            className="form-select"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="New">New</option>
            <option value="Qualified">Qualified</option>
            <option value="Proposal Sent">Proposal Sent</option>
          </select>
        </div>

        <div className="col-12 col-md-4">
          <select
            className="form-select"
            onChange={(e) => setAgentFilter(e.target.value)}
          >
            <option value="">All Agents</option>
            {agents?.map((agent) => (
              <option key={agent._id} value={agent._id}>
                {agent.name}
              </option>
            ))}
          </select>
        </div>

        <div className="col-12 col-md-4">
          <select
            className="form-select"
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="">Sort By</option>
            <option value="priority">Priority</option>
            <option value="timeToClose">Time to Close</option>
          </select>
        </div>
      </div>

      {/* Lead List Responsive */}
      <div className="row g-3">
        {filteredLeads.map((lead) => (
          <div key={lead._id} className="col-12 col-md-6 col-lg-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{lead.name}</h5>
                <p className="card-text mb-2">
                  <strong>Status:</strong> {lead.status} <br />
                  <strong>Agent:</strong> {lead.salesAgent?.name || "Unassigned"}
                </p>
                <Link
                  to={`/leads/${lead._id}`}
                  className="btn btn-primary mt-auto"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Lead Button */}
      <div className="text-center text-md-start mt-4">
        <button className="btn btn-success" onClick={() => setShowModal(true)}>
          ➕ Add New Lead
        </button>
      </div>

      {/* Modal */}
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
              <Form.Label>Status</Form.Label>
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
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default LeadList;
