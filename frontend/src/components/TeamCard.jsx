import React from 'react';
import { Pencil, Trash, Users, Layers } from 'lucide-react';

export default function TeamCard({ team, onEdit, onDelete, onManage }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-gray-100 rounded"><Layers size={20}/></div>
        <div>
          <div className="font-semibold">{team.name}</div>
          <div className="text-sm text-gray-600">{team.description}</div>
        </div>
      </div>

      <div className="flex gap-3 mt-3">
        <button onClick={() => onEdit(team)} className="flex items-center gap-1 px-2 py-1 text-sm bg-blue-100 text-blue-700 rounded"><Pencil size={14}/> Edit</button>
        <button onClick={() => onDelete(team)} className="flex items-center gap-1 px-2 py-1 text-sm bg-red-100 text-red-600 rounded"><Trash size={14}/> Delete</button>
        <button onClick={() => onManage(team)} className="flex items-center gap-1 px-2 py-1 text-sm bg-green-100 text-green-700 rounded"><Users size={14}/> Members</button>
      </div>
    </div>
  );
}

