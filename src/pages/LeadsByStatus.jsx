import axios from "axios";
import React, { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";

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
    // console.log(leads)
      const fetchDataAgent = async () => {
      try {
        const res = await axios.get(
          "https://anvaya-crm-backend-app.vercel.app/agents"
        );
        setAgents(res.data.agents); // jitni bhi leads hain wo state me save kar lo
      } catch (err) {
        console.error("Error fetching leads:", err);
      } finally {
        setLoading(false);
      }
    };
  

  useEffect(() => {
 fetchData();
  fetchDataAgent()
}, []);

// console.log(agents)

  // Filter and sort leads based on filters and sortByTime
  const filteredLeads = leads
    ?.filter(lead => lead?.status === status)
    .filter(lead => (agentFilter ? lead.salesAgent?._id === agentFilter : true))
    .filter(lead => (priorityFilter ? lead.priority === priorityFilter : true))
    .sort((a, b) => {
      if (sortByTime) return a.timeToClose - b.timeToClose;
      return 0;
    });
    console.log(filteredLeads)

  return (
    <div className="d-flex vh-100">

      {/* Main content */}
      <div className="flex-grow-1 p-4 overflow-auto">
        <h2>Lead List by Status</h2>
        <h5 className="mb-4">Status: {status}</h5>

        {/* Filters */}
        <Form className="d-flex gap-3 mb-4 align-items-center flex-wrap">
          <Form.Group controlId="agentFilter" className="flex-grow-1" style={{ minWidth: "180px" }}>
            <Form.Label>Filter by Sales Agent</Form.Label>
            <Form.Select
              value={agentFilter}
              onChange={e => setAgentFilter(e.target.value)}
            >
              <option value="">All Agents</option>
              {agents?.map(agent => (
                <option key={agent._id} value={agent._id}>
                  {agent.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group controlId="priorityFilter" className="flex-grow-1" style={{ minWidth: "180px" }}>
            <Form.Label>Filter by Priority</Form.Label>
            <Form.Select
              value={priorityFilter}
              onChange={e => setPriorityFilter(e.target.value)}
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
              onChange={e => setSortByTime(e.target.checked)} 
            />
          </Form.Group>
        </Form>

        {/* Lead list */}
        <ul className="list-group">
         {filteredLeads.length === 0 ? (
          <div>No leads found for this agent.</div>
        ) : (
          filteredLeads.map(lead => (
            <div key={lead._id} className="border p-2 mb-2 rounded">
              <strong>Lead ID:</strong> {lead._id}<br />
              <strong>Status:</strong> {lead.status}<br />
              <strong>Priority:</strong> {lead.priority}<br />
              <strong>Time to Close:</strong> {lead.timeToClose} days
            </div>
          ))
        )}
        </ul>
      </div>
    </div>
  );
};

export default LeadsByStatus;
