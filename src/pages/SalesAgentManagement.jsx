import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const SalesAgentManagement = () => {
  const [agents, setAgents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    fetchAgents();
  }, []);

  const navigate = useNavigate()
    // const goToStatusPage = (name) => {
    //   navigate(`/leads/status/${name}`);
    // }

  const fetchAgents = async () => {
    try {
      const res = await axios.get("https://anvaya-crm-backend-app.vercel.app/agents");
      setAgents(res.data.agents);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateAgent = async () => {
    try {
      const res = await axios.post(
        "https://anvaya-crm-backend-app.vercel.app/agents",
        formData
      );
      setAgents((prev) => [...prev, res.data.agent]);
      setShowModal(false);
      setFormData({ name: "", email: "" });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex flex-column">
      {/* Header */}
      <header className="bg-primary text-white py-3 px-4">
        <h1 className="h4 m-0">Sales Agent Management</h1>
      </header>

      <div className="row flex-grow-1">
        {/* Sidebar */}

        {/* Main Content */}
        <main className="col-md-9 col-lg-10 p-4 d-flex flex-column">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="h5 mb-0">Sales Agents</h2>
            <Button variant="success" onClick={() => setShowModal(true)}>
              + Add New Agent
            </Button>
          </div>

          {/* Agent List Card */}
          <div className="card shadow-sm flex-grow-1 overflow-auto">
            <ul className="list-group list-group-flush">
              {agents.length === 0 ? (
                <li className="list-group-item text-center text-muted">
                  No agents found.
                </li>
              ) : (
                agents.map((agent) => (
                  <li
                    key={agent._id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(`/leads/agent/${encodeURIComponent(agent.name)}`)}

                  >
                    <div>
                      <strong>{agent.name}</strong>
                      <br />
                      <small className="text-muted">{agent.email}</small>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </main>
      </div>

      {/* Add Agent Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Agent</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="agentName" className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="Enter agent's name"
                value={formData.name}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group controlId="agentEmail" className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Enter agent's email"
                value={formData.email}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button
            variant="success"
            onClick={handleCreateAgent}
            disabled={!formData.name || !formData.email}
          >
            Add Agent
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SalesAgentManagement;
