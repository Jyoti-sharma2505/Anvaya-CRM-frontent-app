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
  const [agents,setAgents]=useState([]);
  const [showModal,setShowModal]=useState(false)
  const [leadData,setLeadData]=useState([])
  const [formData,setFormData]=useState({
    name: "",
    source: "",
    salesAgent: "",
    status: "New",
    priority: "Medium",
    timeToClose: "",
    tags: "",
  })
  const handleChange=(e)=>{
const {name,value}=e.target;
setFormData({
    ...formData,
    [name]:value
})
  }

  const handleCreateLead=async()=>{
    try{
        const payload={
            ...formData,
            timeToClose:Number(formData.timeToClose),
           tags: formData.tags
          ? formData.tags.split(",").map((tag) => tag.trim())
          : [],
        }
   const res=await axios.post("https://anvaya-crm-backend-app.vercel.app/leads",{
    ...formData,
    tags:formData.tags.split(",").map((tag)=>tag.trim()),

   })
   setLeadData(...leadData,res.data.lead);
   setShowModal(false);
   setFormData({
    name: "",
        source: "",
        salesAgent: "",
        status: "New",
        priority: "Medium",
        timeToClose: "",
        tags: "",
   })
    }catch(error){
        console.log(error,"error");
    }
  }

  useEffect(() => {
    fetchLeads();
    fetchDataAgents()
  }, []);

  const fetchLeads = async () => {
    const res = await axios.get(
      "https://anvaya-crm-backend-app.vercel.app/leads"
    );
    setLeads(res.data.leads);
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
  console.log(agentFilter, "abbb");

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
    <div className="p-4">
      <h2>Lead List</h2>

      {/* Filters */}
      <div className="d-flex gap-3 mb-3">
        <select onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Status</option>
          <option value="New">New</option>
          <option value="Qualified">Qualified</option>
          <option value="Proposal Sent">Proposal Sent</option>
        </select>

        <select onChange={(e) => setAgentFilter(e.target.value)}>
          <option value="">All Agents</option>
          {agents?.map((agent) => {
            return (
                <option key={agent._id} value={agent._id}>{agent.name}</option>
            );
          })}
        </select>

        <select onChange={(e) => setSortBy(e.target.value)}>
          <option value="">Sort By</option>
          <option value="priority">Priority</option>
          <option value="timeToClose">Time to Close</option>
        </select>
      </div>

      {/* Lead List */}
      <ul className="list-group">
        {filteredLeads.map((lead) => (
          <li
            key={lead._id}
            className="list-group-item d-flex justify-content-between"
          >
            <span>
              {lead.name} - [{lead.status}] - {lead.salesAgent?.name}
            </span>
            <Link to={`/leads/${lead._id}`} className="btn btn-sm btn-primary">
              View
            </Link>
          </li>
        ))}
      </ul>

      {/* Add New Lead */}
      <button className="btn btn-success mt-3" onClick={()=>setShowModal(true)}>➕ Add New Lead</button>
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

export default LeadList;
