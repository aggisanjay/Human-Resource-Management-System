import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import api from "../lib/api";
import { Users, Layers, PlusCircle, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [employeeCount, setEmployeeCount] = useState(0);
  const [teamCount, setTeamCount] = useState(0);
  const [logs, setLogs] = useState([]);

  function logout() {
    localStorage.removeItem("token");
    navigate("/");
  }

  useEffect(() => { 
    loadCounts();
    loadLogs();
  }, []);

  async function loadCounts() {
    try {
      const empRes = await api.get("/employees");
      const teamRes = await api.get("/teams");
      setEmployeeCount(empRes.data.length);
      setTeamCount(teamRes.data.length);
    } catch (err) {
      if (err.response?.status === 401) logout();
    }
  }

  async function loadLogs() {
    try {
      const res = await api.get("/logs?limit=5");
      setLogs(res.data);
    } catch (err) {
      console.log("Logs fetch failed");
    }
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar onLogout={logout} />

        <div className="p-6">

          {/* HEADER */}
          <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

          {/* STATS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

            <div className="bg-white p-6 rounded-xl shadow flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="text-blue-600" size={30} />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Employees</p>
                <p className="text-2xl font-bold">{employeeCount}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Layers className="text-green-600" size={30} />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Teams</p>
                <p className="text-2xl font-bold">{teamCount}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <PlusCircle className="text-purple-600" size={30} />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Quick Actions</p>
                <div className="flex gap-2 mt-2">
                  <a href="/employees" className="bg-blue-600 text-white px-3 py-1 text-sm rounded">
                    Add Employee
                  </a>
                  <a href="/teams" className="bg-green-600 text-white px-3 py-1 text-sm rounded">
                    Add Team
                  </a>
                </div>
              </div>
            </div>

          </div>

          {/* RECENT ACTIVITY */}
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
            <Activity size={20} /> Recent Activity
          </h2>

          <div className="bg-white p-6 rounded-xl shadow">
            {logs.length === 0 ? (
              <p className="text-gray-500">No activity recorded yet.</p>
            ) : (
              <ul className="space-y-3">
                {logs.map((log) => (
                  <li key={log.id} className="border-b pb-2">
                    <p className="font-medium">{log.action}</p>
                    <p className="text-sm text-gray-500">{log.created_at}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
