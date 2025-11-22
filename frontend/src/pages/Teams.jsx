import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Modal from "../components/Modal";
import TeamCard from "../components/TeamCard";
import api from "../lib/api";
import { useNavigate } from "react-router-dom";

export default function Teams() {
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [employees, setEmployees] = useState([]);

  // CRUD modals
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  // Members modal
  const [membersModal, setMembersModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);

  // Form fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // For Edit/Delete
  const [editTeam, setEditTeam] = useState(null);
  const [deleteTeam, setDeleteTeam] = useState(null);

  // Checked employees for assignment
  const [checked, setChecked] = useState({});

  function logout() {
    localStorage.removeItem("token");
    navigate("/");
  }

  useEffect(() => {
    loadTeams();
  }, []);

  async function loadTeams() {
    try {
      const res = await api.get("/teams");
      setTeams(res.data);
    } catch (err) {
      if (err.response?.status === 401) logout();
    }
  }

  // CREATE TEAM
  async function createTeam(e) {
    e.preventDefault();
    await api.post("/teams", { name, description });
    setOpenCreate(false);
    resetForm();
    loadTeams();
  }

  // EDIT TEAM
  function openEditModal(team) {
    setEditTeam(team);
    setName(team.name);
    setDescription(team.description || "");
    setOpenEdit(true);
  }

  async function updateTeam(e) {
    e.preventDefault();
    await api.put(`/teams/${editTeam.id}`, { name, description });
    setOpenEdit(false);
    resetForm();
    loadTeams();
  }

  // DELETE TEAM
  function openDeleteModal(team) {
    setDeleteTeam(team);
    setOpenDelete(true);
  }

  async function confirmDelete() {
    await api.delete(`/teams/${deleteTeam.id}`);
    setOpenDelete(false);
    loadTeams();
  }

  // MANAGE MEMBERS
  async function openMembers(team) {
  if (!team || !team.id) {
    console.error("Invalid team object passed:", team);
    return;
  }

  setSelectedTeam(team);

  // Load all employees
  const allEmployees = await api.get("/employees");
  setEmployees(allEmployees.data);

  // Load employees assigned to this team
  let assigned = [];
  try {
    const res = await api.get(`/teams/${team.id}/employees`);
    assigned = res.data || [];
  } catch (err) {
    console.error("Error fetching team members:", err);
    assigned = [];
  }

  // Build checked map (safe)
  const map = {};
  assigned.forEach(emp => {
    if (emp && emp.id) map[emp.id] = true;
  });

  setChecked(map);
  setMembersModal(true);
}

  function toggleEmployee(id) {
    setChecked(prev => ({ ...prev, [id]: !prev[id] }));
  }

  async function saveAssignments() {
  if (!selectedTeam || !selectedTeam.id) return;

  const teamId = selectedTeam.id;

  const selectedEmployeeIds = Object.keys(checked)
    .filter(id => checked[id])
    .map(id => Number(id));

  // Assign batch
  await api.post(`/teams/${teamId}/assign-batch`, {
    employeeIds: selectedEmployeeIds,
  });

  setMembersModal(false);
  loadTeams();
}


  function resetForm() {
    setName(''); setDescription('');
  }

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar onLogout={logout} />
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Teams</h2>
            <button onClick={() => setOpenCreate(true)} className="px-3 py-2 bg-blue-600 text-white rounded">Add Team</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {teams.map(t => (
              <TeamCard key={t.id} team={t} onEdit={openEditModal} onDelete={openDeleteModal} onManage={openMembers} />
            ))}
          </div>
        </div>
      </div>

      {/* CREATE */}
      <Modal open={openCreate} onClose={() => setOpenCreate(false)}>
        <h2 className="text-xl font-bold mb-4">Create Team</h2>
        <form onSubmit={createTeam} className="space-y-3">
          <input className="border p-2 w-full rounded" placeholder="Team Name" value={name} onChange={e=>setName(e.target.value)} />
          <textarea className="border p-2 w-full rounded" placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} />
          <button className="w-full bg-blue-600 text-white py-2 rounded">Create</button>
        </form>
      </Modal>

      {/* EDIT */}
      <Modal open={openEdit} onClose={() => setOpenEdit(false)}>
        <h2 className="text-xl font-bold mb-4">Edit Team</h2>
        <form onSubmit={updateTeam} className="space-y-3">
          <input className="border p-2 w-full rounded" value={name} onChange={e=>setName(e.target.value)} />
          <textarea className="border p-2 w-full rounded" value={description} onChange={e=>setDescription(e.target.value)} />
          <button className="w-full bg-blue-600 text-white py-2 rounded">Update</button>
        </form>
      </Modal>

      {/* DELETE */}
      <Modal open={openDelete} onClose={() => setOpenDelete(false)}>
        <h2 className="text-xl font-bold mb-4 text-red-600">Delete Team</h2>
        <p className="mb-4">Are you sure you want to delete <strong>{deleteTeam?.name}</strong>?</p>
        <button className="w-full bg-red-600 text-white py-2 rounded" onClick={confirmDelete}>Yes, Delete</button>
      </Modal>

      {/* MEMBERS */}
      <Modal open={membersModal} onClose={() => setMembersModal(false)}>
        <h2 className="text-xl font-bold mb-4">Manage Members – {selectedTeam?.name}</h2>
        <div className="max-h-80 overflow-y-auto border p-3 rounded space-y-2">
          {employees.map(emp => (
            <label key={emp.id} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={checked[emp.id] || false} onChange={() => toggleEmployee(emp.id)} />
              {emp.first_name} {emp.last_name} – {emp.email}
            </label>
          ))}
        </div>
        <button className="mt-4 w-full bg-green-600 text-white py-2 rounded" onClick={saveAssignments}>Save Changes</button>
      </Modal>
    </div>
  );
}
