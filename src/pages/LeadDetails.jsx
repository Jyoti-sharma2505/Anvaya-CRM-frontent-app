import React, { useEffect, useState } from "react";
// import Bar from "./Bar";
import { useParams } from "react-router-dom";
import axios from "axios";

const LeadDetails = () => {
  const { leadId } = useParams();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComments] = useState("");
  const [leadsAgent, setLeadsAgent] = useState([]);

  const fetchDataAgents = async () => {
    try {
      const res = await axios.get(
        "https://anvaya-crm-backend-app.vercel.app/agents"
      );
      setLeadsAgent(res?.data?.agents);
    } catch (error) {
      console.log(error, "error");
    }
  };
//   console.log(leadsAgent, "agents");

  const addComment = async () => {
    if (!newComment) {
      alert("Commnet cannot be empty");
      return;
    }

    // console.log(payload,"new")
    try {
      const authorId = leadsDetails.salesAgent._id;
      if (!authorId) {
        alert("Sales agent not found for this lead");
        return;
      }
      const payload = {
        commentText: newComment,
        author: authorId,
      };
      const res = await axios.post(
        `https://anvaya-crm-backend-app.vercel.app/leads/${leadId}/comments`,
        payload
      );
      if (res.data.comment) {
        setNewComments([...comments, res.data.comment]);
      } else {
        fetchDataCommnets();
      }
      setNewComments("");
      // console.log(newComment,"new")
    } catch (error) {
      console.log(error, "error");
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
  const fetchDataCommnets = async () => {
    try {
      const res = await axios.get(
        `https://anvaya-crm-backend-app.vercel.app/leads/${leadId}/comments`
      );
      setComments(res?.data?.comments);
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };
  //   console.log(comments, "comments");

  useEffect(() => {
    fetchData();
    fetchDataAgents();
    if (leadId) fetchDataCommnets();
  }, [leadId]);

  const leadsDetails = leads.find((lead) => lead._id === leadId);
  // console.log(leadsDetails,"abc")
  return (
    <div className="d-flex">
      {/* Sidebar */}
      {/* <Bar /> */}

      {/* Main Content */}
      <div className="flex-grow-1 p-4">
        <h2 className="mb-4">
          Lead Management:{" "}
          <span className="text-primary">[{leadsDetails?.name}]</span>
        </h2>

        {/* Lead Details */}
        <div className="card mb-4 shadow-sm">
          <div className="card-body">
            <h4 className="card-title mb-3">Lead Details</h4>
            <p>
              <strong>Lead Name:</strong> {leadsDetails?.name}
            </p>
            <p>
              <strong>Sales Agent:</strong> {leadsDetails?.salesAgent?.name}
            </p>
            <p>
              <strong>Lead Source:</strong> {leadsDetails?.source}
            </p>
            <p>
              <strong>Lead Status:</strong>{" "}
              <span className="badge bg-info">{leadsDetails?.status}</span>
            </p>
            <p>
              <strong>Priority:</strong>{" "}
              <span className="badge bg-danger card p-3 shadow-sm">
                {leadsDetails?.tags?.join(", ")}
              </span>
            </p>
            <p>
              <strong>Time to Close:</strong> {leadsDetails?.timeToClose} Days
            </p>

            <button className="btn btn-primary">✏️ Edit Lead Details</button>
          </div>
        </div>

        {/* Comments Section */}
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

            {/* Add Comment */}
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
  );
};

export default LeadDetails;
