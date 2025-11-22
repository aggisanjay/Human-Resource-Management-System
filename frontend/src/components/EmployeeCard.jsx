import React from 'react';
import { User, Pencil, Trash, Layers } from 'lucide-react';

export default function EmployeeCard({ employee, onEdit, onDelete, onAssign }) {
  return (
    <div className="bg-white p-4 rounded shadow-sm relative">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gray-100 rounded">
          <User size={20} />
        </div>
        <div>
          <div className="font-semibold">{employee.first_name} {employee.last_name}</div>
          <div className="text-sm text-gray-500">{employee.email}</div>
        </div>
      </div>

      <div className="flex gap-3 mt-3">
        <button className="flex items-center gap-1 px-2 py-1 text-sm bg-blue-100 text-blue-700 rounded" onClick={() => onEdit(employee)}>
          <Pencil size={14}/> Edit
        </button>

        <button className="flex items-center gap-1 px-2 py-1 text-sm bg-red-100 text-red-600 rounded" onClick={() => onDelete(employee)}>
          <Trash size={14}/> Delete
        </button>

        <button className="flex items-center gap-1 px-2 py-1 text-sm bg-green-100 text-green-700 rounded" onClick={() => onAssign(employee)}>
          <Layers size={14}/> Teams
        </button>
      </div>
    </div>
  );
}
