import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid,
  ResponsiveContainer
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A020F0"];

const Reports = () => {
  const [pipelineData, setPipelineData] = useState([]);
  const [agentData, setAgentData] = useState([]);
  const [statusData, setStatusData] = useState([]);

  // 📊 Pipeline API
  const fetchPipeline = async () => {
    try {
      const res = await axios.get("https://anvaya-crm-backend-app.vercel.app/report/pipeline");

      const data = [
        { name: "Closed", value: res.data.pipeline.closed ?? 0 },
        { name: "Pipeline", value: res.data.pipeline.pipeline ?? 0 }
      ];

      setPipelineData(data);
    } catch (err) {
      console.error("Error fetching pipeline:", err);
    }
  };

  // 📊 Last Week Summary
  const fetchLastWeek = async () => {
    try {
      const res = await axios.get("https://anvaya-crm-backend-app.vercel.app/report/last-week");

      const report = res.data.report || [];

      // 🔹 Aggregate by Sales Agent
      const agentMap = {};
      report.forEach((lead) => {
        const agent = lead.salesAgent || "Unknown";
        agentMap[agent] = (agentMap[agent] || 0) + 1;
      });
      const agents = Object.keys(agentMap).map(agent => ({
        agent,
        closed: agentMap[agent]
      }));

      // 🔹 Aggregate by Status (optional, if status exists)
      // Example: assuming each lead has status property
      const statusMap = {};
      report.forEach((lead) => {
        const status = lead.status || "Closed"; // default Closed if status missing
        statusMap[status] = (statusMap[status] || 0) + 1;
      });
      const statuses = Object.keys(statusMap).map(status => ({
        status,
        count: statusMap[status]
      }));

      setAgentData(agents);
      setStatusData(statuses);
    } catch (err) {
      console.error("Error fetching last-week report:", err);
    }
  };

  useEffect(() => {
    fetchPipeline();
    fetchLastWeek();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4 text-primary">📊 Anvaya CRM Reports</h2>

      {/* Pipeline Chart */}
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-info text-white">
          Total Leads Closed vs Pipeline
        </div>
        <div className="card-body">
          {pipelineData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pipelineData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={70}
                  outerRadius={120}
                  label
                >
                  {pipelineData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={18}
                  fontWeight="bold"
                >
                  {pipelineData.reduce((acc, cur) => acc + cur.value, 0)} Leads
                </text>
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center">Loading Pipeline Data...</p>
          )}
        </div>
      </div>

      {/* Leads Closed by Agent */}
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-success text-white">
          Leads Closed by Sales Agent
        </div>
        <div className="card-body">
          {agentData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={agentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="agent" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="closed" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center">Loading Agent Data...</p>
          )}
        </div>
      </div>

      {/* Lead Status Distribution */}
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-warning text-dark">
          Lead Status Distribution
        </div>
        <div className="card-body">
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="count"
                  nameKey="status"
                  outerRadius={120}
                  label
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-center">Loading Status Data...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
