import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import api from "../lib/api";
import EmployeeCard from "../components/EmployeeCard";
import Modal from "../components/Modal";
import { useNavigate } from "react-router-dom";

export default function Employees() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [teams, setTeams] = useState([]);

  // CRUD Modals
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  // Assignment Modal
  const [assignModal, setAssignModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [checked, setChecked] = useState({});

  // Form fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Edit/Delete targets
  const [editEmployee, setEditEmployee] = useState(null);
  const [deleteEmployee, setDeleteEmployee] = useState(null);

  function logout() {
    localStorage.removeItem("token");
    navigate("/");
  }

  

  async function loadEmployees() {
    try {
      const res = await api.get("/employees");
      setEmployees(res.data);
    } catch (err) {
      if (err.response?.status === 401) logout();
    }
  }

  async function loadTeams() {
    const res = await api.get("/teams");
    setTeams(res.data);
  }

  useEffect(() => {
    loadEmployees();
    loadTeams();
  }, []);
  // CREATE EMPLOYEE
  async function createEmployee(e) {
    e.preventDefault();
    await api.post("/employees", {
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
    });

    setOpenCreate(false);
    resetForm();
    loadEmployees();
  }

  // EDIT EMPLOYEE
  function openEditModal(emp) {
    setEditEmployee(emp);
    setFirstName(emp.first_name);
    setLastName(emp.last_name);
    setEmail(emp.email);
    setPhone(emp.phone);
    setOpenEdit(true);
  }

  async function updateEmployee(e) {
    e.preventDefault();
    await api.put(`/employees/${editEmployee.id}`, {
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
    });

    setOpenEdit(false);
    resetForm();
    loadEmployees();
  }

  // DELETE EMPLOYEE
  function openDeleteModal(emp) {
    setDeleteEmployee(emp);
    setOpenDelete(true);
  }

  async function confirmDelete() {
    await api.delete(`/employees/${deleteEmployee.id}`);
    setOpenDelete(false);
    loadEmployees();
  }

  // -------------------------
  // TEAM ASSIGNMENT SECTION
  // -------------------------
  async function openAssignModal(emp) {
  if (!emp || !emp.id) {
    console.error("Invalid employee passed:", emp);
    return;
  }

  setSelectedEmployee(emp);

  // Load all teams
  const allTeams = await api.get("/teams");

  // Load all employees of each team (safe)
  const assignedStatus = {};
  for (const team of allTeams.data) {
    const resp = await api.get(`/teams/${team.id}/employees`);
    const members = resp.data;

    // check if employee belongs to team
    assignedStatus[team.id] = members.some(m => m?.id === emp.id);
  }

  setTeams(allTeams.data);
  setChecked(assignedStatus);
  setAssignModal(true);
}

  function toggleTeam(teamId) {
    setChecked((prev) => ({ ...prev, [teamId]: !prev[teamId] }));
  }

 async function saveAssignments() {
  if (!selectedEmployee) return;

  const employeeId = selectedEmployee.id;

  const selectedTeams = Object.keys(checked)
    .filter(id => checked[id])
    .map(id => Number(id));

  // ASSIGN employee to checked teams
  for (let tid of selectedTeams) {
    await api.post(`/teams/${tid}/assign`, { employeeId });
  }

  // UNASSIGN employee from unchecked teams
  for (let tid of Object.keys(checked)) {
    if (!checked[tid]) {
      await api.post(`/teams/${tid}/unassign`, { employeeId });
    }
  }

  setAssignModal(false);
  loadEmployees(); // refresh UI
}

  // -------------------------
  function resetForm() {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
  }

  // -------------------------
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar onLogout={logout} />

        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Employees</h2>

            <button
              onClick={() => setOpenCreate(true)}
              className="px-3 py-2 bg-blue-600 text-white rounded"
            >
              Add Employee
            </button>
          </div>

          {/* Employee List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {employees.map((e) => (
              <EmployeeCard
                key={e.id}
                employee={e}
                onEdit={openEditModal}
                onDelete={openDeleteModal}
                onAssign={openAssignModal}
              />
            ))}
          </div>
        </div>
      </div>

      {/* CREATE MODAL */}
      <Modal open={openCreate} onClose={() => setOpenCreate(false)}>
        <h2 className="text-xl font-bold mb-4">Create Employee</h2>
        <form onSubmit={createEmployee} className="space-y-3">
          <input
            className="border p-2 w-full rounded"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />

          <input
            className="border p-2 w-full rounded"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />

          <input
            className="border p-2 w-full rounded"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="border p-2 w-full rounded"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <button className="w-full bg-blue-600 text-white py-2 rounded">
            Create
          </button>
        </form>
      </Modal>

      {/* EDIT MODAL */}
      <Modal open={openEdit} onClose={() => setOpenEdit(false)}>
        <h2 className="text-xl font-bold mb-4">Edit Employee</h2>
        <form onSubmit={updateEmployee} className="space-y-3">
          <input
            className="border p-2 w-full rounded"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />

          <input
            className="border p-2 w-full rounded"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />

          <input
            className="border p-2 w-full rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="border p-2 w-full rounded"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <button className="w-full bg-blue-600 text-white py-2 rounded">
            Update
          </button>
        </form>
      </Modal>

      {/* DELETE MODAL */}
      <Modal open={openDelete} onClose={() => setOpenDelete(false)}>
        <h2 className="text-xl font-bold mb-4 text-red-600">Delete Employee</h2>
        <p className="mb-4">
          Are you sure you want to delete{" "}
          <strong>
            {deleteEmployee?.first_name} {deleteEmployee?.last_name}
          </strong>
          ?
        </p>

        <button
          className="w-full bg-red-600 text-white py-2 rounded"
          onClick={confirmDelete}
        >
          Yes, Delete
        </button>
      </Modal>

      {/* ASSIGN TEAM MODAL */}
      <Modal open={assignModal} onClose={() => setAssignModal(false)}>
        <h2 className="text-xl font-bold mb-4">
          Assign Teams – {selectedEmployee?.first_name}{" "}
          {selectedEmployee?.last_name}
        </h2>

        <div className="max-h-80 overflow-y-auto space-y-2">
          {teams.map((team) => (
            <label
              key={team.id}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={checked[team.id] || false}
                onChange={() => toggleTeam(team.id)}
              />
              {team.name}
            </label>
          ))}
        </div>

        <button
          className="mt-4 w-full bg-green-600 text-white py-2 rounded"
          onClick={saveAssignments}
        >
          Save Assignments
        </button>
      </Modal>
    </div>
  );
}
