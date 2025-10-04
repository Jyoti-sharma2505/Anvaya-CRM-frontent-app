import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Form, Row, Col, Card, Spinner } from "react-bootstrap";

const LeadsByAgent = () => {
  const { name: agentName } = useParams();
  const [leads, setLeads] = useState([]);
  const [agents, setAgents] = useState([]);
  const [priorityFilter, setPriorityFilter] = useState("");
  const [sortByTime, setSortByTime] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchLeads = async () => {
    try {
      const res = await axios.get("https://anvaya-crm-backend-app.vercel.app/leads");
      setLeads(res.data.leads);
    } catch (err) {
      console.error("Error fetching leads:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAgents = async () => {
    try {
      const res = await axios.get("https://anvaya-crm-backend-app.vercel.app/agents");
      setAgents(res.data.agents);
    } catch (err) {
      console.error("Error fetching agents:", err);
    }
  };

  useEffect(() => {
    fetchLeads();
    fetchAgents();
  }, []);

  const filteredLeads = leads
    ?.filter((lead) => {
      const leadAgentName =
        typeof lead.salesAgent === "string"
          ? agents.find((a) => a._id === lead.salesAgent)?.name
          : lead.salesAgent?.name;

      return leadAgentName === agentName;
    })
    .filter((lead) => (priorityFilter ? lead.priority === priorityFilter : true))
    .sort((a, b) => (sortByTime ? a.timeToClose - b.timeToClose : 0));

  return (
    <div className="p-4">
      <h2 className="mb-3">Lead List by Agent</h2>
      <h5 className="text-muted mb-4">Sales Agent: {agentName}</h5>

      {/* Filters */}
      <Form className="d-flex gap-3 my-3 align-items-center flex-wrap">
        <Form.Group controlId="priorityFilter" style={{ minWidth: "180px" }}>
          <Form.Label>Filter by Priority</Form.Label>
          <Form.Select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </Form.Select>
        </Form.Group>

        <Form.Group controlId="sortByTime" className="d-flex align-items-center">
          <Form.Check
            type="checkbox"
            label="Sort by Time to Close"
            checked={sortByTime}
            onChange={(e) => setSortByTime(e.target.checked)}
          />
        </Form.Group>
      </Form>

      {/* Leads */}
      {loading ? (
        <div className="d-flex justify-content-center my-5">
          <Spinner animation="border" role="status" />
        </div>
      ) : filteredLeads.length === 0 ? (
        <div className="text-center text-muted mt-4">No leads found for this agent.</div>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4 mt-3">
          {filteredLeads.map((lead) => (
            <Col key={lead._id}>
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Card.Title>{lead.name || "Unnamed Lead"}</Card.Title>
                  <Card.Text>
                    <strong>Status:</strong> {lead.status} <br />
                    <strong>Priority:</strong>{" "}
                    <span
                      className={`badge ${
                        lead.priority === "High"
                          ? "bg-danger"
                          : lead.priority === "Medium"
                          ? "bg-warning text-dark"
                          : "bg-success"
                      }`}
                    >
                      {lead.priority}
                    </span>
                    <br />
                    <strong>Time to Close:</strong> {lead.timeToClose} days
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default LeadsByAgent;
