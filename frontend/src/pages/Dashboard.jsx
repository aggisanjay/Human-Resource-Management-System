import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import api from "../lib/api";
import { Users, Layers } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [employeeCount, setEmployeeCount] = useState(0);
  const [teamCount, setTeamCount] = useState(0);

  function logout() {
    localStorage.removeItem("token");
    navigate("/");
  }

  useEffect(() => { loadCounts(); }, []);

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

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 flex flex-col bg-gray-50">
        <Navbar onLogout={logout} />
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg"><Users className="text-blue-600" size={28} /></div>
              <div><div className="text-gray-500 text-sm">Total Employees</div><div className="text-2xl font-bold">{employeeCount}</div></div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg"><Layers className="text-green-600" size={28} /></div>
              <div><div className="text-gray-500 text-sm">Total Teams</div><div className="text-2xl font-bold">{teamCount}</div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
