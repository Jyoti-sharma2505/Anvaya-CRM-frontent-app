import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
// import Sidebar from "./Sidebar"; // 👈 assume aapka sidebar yaha hai
import "react-toastify/dist/ReactToastify.css";

const LeadDetails = () => {
  const { leadId } = useParams();
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComments] = useState("");
  const [leadsAgent, setLeadsAgent] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editLead, setEditLead] = useState({});

  const fetchDataAgents = async () => {
    try {
      const res = await axios.get(
        "https://anvaya-crm-backend-app.vercel.app/agents"
      );
      setLeadsAgent(res?.data?.agents);
    } catch (error) {
      console.log(error);
    }
  };

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

  const fetchDataCommnets = async () => {
    try {
      const res = await axios.get(
        `https://anvaya-crm-backend-app.vercel.app/leads/${leadId}/comments`
      );
      setComments(res?.data?.comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const addComment = async () => {
    if (!newComment) return toast.error("Comment cannot be empty");
    try {
      const authorId = leadsDetails.salesAgent._id;
      if (!authorId) return toast.error("Sales agent not found for this lead");

      const payload = { commentText: newComment, author: authorId };
      const res = await axios.post(
        `https://anvaya-crm-backend-app.vercel.app/leads/${leadId}/comments`,
        payload
      );

      if (res.data.comment) setComments([...comments, res.data.comment]);
      else fetchDataCommnets();

      setNewComments("");
      toast.success("Comment added successfully ✅");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
    fetchDataAgents();
    if (leadId) fetchDataCommnets();
  }, [leadId]);

  const leadsDetails = leads.find((lead) => lead._id === leadId);

  const handleEditClick = () => {
    setEditLead({
      name: leadsDetails.name,
      source: leadsDetails.source,
      status: leadsDetails.status,
      priority: leadsDetails.priority,
      timeToClose: leadsDetails.timeToClose,
      salesAgent: leadsDetails.salesAgent?._id,
      tags: leadsDetails.tags?.join(", "),
    });
    setShowModal(true);
  };

  const handleSaveChanges = async () => {
    toast.success("Edited successfully ✅");
    try {
      const payload = {
        ...editLead,
        timeToClose: Number(editLead.timeToClose),
        tags: editLead.tags ? editLead.tags.split(",").map((t) => t.trim()) : [],
      };
      await axios.post(
        `https://anvaya-crm-backend-app.vercel.app/leads/${leadId}`,
        payload
      );
      fetchData();
      setShowModal(false);
    } catch (err) {
      console.error("Error updating lead:", err);
    }
  };

  const handleDeleteLead = async () => {
    if (!window.confirm("Are you sure you want to delete this lead?")) return;
    try {
      await axios.delete(
        `https://anvaya-crm-backend-app.vercel.app/leads/${leadId}`
      );
      toast.success("Lead deleted successfully ✅");
      setShowModal(false);
      navigate("/leads");
    } catch (err) {
      console.error("Error deleting lead:", err);
    }
  };

  if (loading) return <p className="text-center mt-5">Loading...</p>;

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar */}
        {/* <div className="col-12 col-md-3 col-lg-2 bg-dark p-0">
          <Sidebar />
        </div> */}

        {/* Main Content */}
        <div className="col-12 col-md-9 col-lg-10 p-4">
          <ToastContainer />
          <h2 className="mb-4">
            Lead Management:{" "}
            <span className="text-primary">[{leadsDetails?.name}]</span>
          </h2>

          {/* Lead Details */}
          <div className="card mb-4 shadow-sm">
            <div className="card-body">
              <h4 className="card-title mb-3">Lead Details</h4>
              <p><strong>Lead Name:</strong> {leadsDetails?.name}</p>
              <p><strong>Sales Agent:</strong> {leadsDetails?.salesAgent?.name}</p>
              <p><strong>Lead Source:</strong> {leadsDetails?.source}</p>
              <p>
                <strong>Lead Status:</strong>{" "}
                <span className="badge bg-info">{leadsDetails?.status}</span>
              </p>
              <p>
                <strong>Priority:</strong>{" "}
                <span className="badge bg-warning text-dark">
                  {leadsDetails?.priority}
                </span>
              </p>
              <p><strong>Tags:</strong> {leadsDetails?.tags?.join(", ")}</p>
              <p><strong>Time to Close:</strong> {leadsDetails?.timeToClose} Days</p>

              <button className="btn btn-primary" onClick={handleEditClick}>
                ✏️ Edit Lead Details
              </button>
            </div>
          </div>

          {/* Comments Section */}
          <div className="card shadow-sm">
            <div className="card-body">
              <h4 className="card-title mb-3">Comments</h4>
              <div className="mb-3 border-bottom pb-2">
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <div key={comment._id} className="mb-3">
                      <small className="text-muted d-block">
                        <strong>Author:</strong>{" "}
                        {comment?.author?.name || "Unknown"} |{" "}
                        <strong>Date:</strong>{" "}
                        {new Date(comment.createdAt).toLocaleDateString()}{" "}
                        {new Date(comment.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </small>
                      <p className="mb-1">
                        <strong>Comment:</strong> {comment?.commentText}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-muted">No comments yet.</p>
                )}
              </div>
              <div className="mt-3">
                <textarea
                  className="form-control mb-2"
                  placeholder="Add new comment..."
                  value={newComment}
                  onChange={(e) => setNewComments(e.target.value)}
                  rows="3"
                ></textarea>
                <button className="btn btn-success" onClick={addComment}>
                  ➕ Submit Comment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showModal && (
        <div className="modal d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Lead</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                {/* form fields (same as your code) */}
                <div className="mb-3">
                  <label className="form-label">Lead Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editLead.name || ""}
                    onChange={(e) =>
                      setEditLead({ ...editLead, name: e.target.value })
                    }
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Lead Source</label>
                  <select
                    className="form-select"
                    value={editLead.source || ""}
                    onChange={(e) =>
                      setEditLead({ ...editLead, source: e.target.value })
                    }
                  >
                    <option value="">Select Source</option>
                    <option value="Referral">Referral</option>
                    <option value="Website">Website</option>
                    <option value="Cold Call">Cold Call</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    value={editLead.status || ""}
                    onChange={(e) =>
                      setEditLead({ ...editLead, status: e.target.value })
                    }
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Qualified">Qualified</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Priority</label>
                  <select
                    className="form-select"
                    value={editLead.priority || ""}
                    onChange={(e) =>
                      setEditLead({ ...editLead, priority: e.target.value })
                    }
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Time to Close (Days)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={editLead.timeToClose || ""}
                    onChange={(e) =>
                      setEditLead({ ...editLead, timeToClose: e.target.value })
                    }
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Tags</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editLead.tags || ""}
                    onChange={(e) =>
                      setEditLead({ ...editLead, tags: e.target.value })
                    }
                    placeholder="Comma separated tags"
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button className="btn btn-danger" onClick={handleDeleteLead}>
                  🗑 Delete
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleSaveChanges}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadDetails;
