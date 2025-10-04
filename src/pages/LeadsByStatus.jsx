import axios from "axios";
import React, { useState, useEffect } from "react";
import { Form, Card } from "react-bootstrap";
import { useParams } from "react-router-dom";

const LeadsByStatus = () => {
  const { status } = useParams(); // Get status from route
  const [leads, setLeads] = useState([]);
  const [agents, setAgents] = useState([]);
  const [agentFilter, setAgentFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [sortByTime, setSortByTime] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await axios.get("https://anvaya-crm-backend-app.vercel.app/leads");
      setLeads(res.data.leads);
    } catch (err) {
      console.error("Error fetching leads:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDataAgent = async () => {
    try {
      const res = await axios.get("https://anvaya-crm-backend-app.vercel.app/agents");
      setAgents(res.data.agents);
    } catch (err) {
      console.error("Error fetching agents:", err);
    }
  };

  useEffect(() => {
    fetchData();
    fetchDataAgent();
  }, []);

  const filteredLeads = leads
    ?.filter((lead) => lead?.status === status)
    .filter((lead) => (agentFilter ? lead.salesAgent?._id === agentFilter : true))
    .filter((lead) => (priorityFilter ? lead.priority === priorityFilter : true))
    .sort((a, b) => (sortByTime ? a.timeToClose - b.timeToClose : 0));

  return (
    <div className="container-fluid py-4">
      <h2 className="text-center mb-3">Lead List by Status</h2>
      <h5 className="text-center text-muted mb-4">Status: {status}</h5>

      {/* Filters */}
      <Form className="row row-cols-1 row-cols-md-3 g-3 mb-4">
        <Form.Group className="col">
          <Form.Label>Filter by Sales Agent</Form.Label>
          <Form.Select value={agentFilter} onChange={(e) => setAgentFilter(e.target.value)}>
            <option value="">All Agents</option>
            {agents?.map((agent) => (
              <option key={agent._id} value={agent._id}>
                {agent.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="col">
          <Form.Label>Filter by Priority</Form.Label>
          <Form.Select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
            <option value="">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="col d-flex align-items-end">
          <Form.Check
            type="checkbox"
            label="Sort by Time to Close"
            checked={sortByTime}
            onChange={(e) => setSortByTime(e.target.checked)}
          />
        </Form.Group>
      </Form>

      {/* Leads Grid */}
      {loading ? (
        <p className="text-center">Loading leads...</p>
      ) : filteredLeads.length === 0 ? (
        <p className="text-center text-danger">No leads found for this status.</p>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {filteredLeads.map((lead) => (
            <div className="col" key={lead._id}>
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Card.Title>{lead.name || "Unnamed Lead"}</Card.Title>
                  <Card.Text>
                    <strong>Lead ID:</strong> {lead._id} <br />
                    <strong>Status:</strong> {lead.status} <br />
                    <strong>Priority:</strong> {lead.priority} <br />
                    <strong>Time to Close:</strong> {lead.timeToClose} days
                  </Card.Text>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LeadsByStatus;
