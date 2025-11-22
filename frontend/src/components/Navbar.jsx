import React from 'react';
import { LogOut } from 'lucide-react';

export default function Navbar({ onLogout }) {
  return (
    <div className="flex items-center justify-between px-4 h-14 bg-white border-b">
      <div className="flex items-center gap-3"><div className="font-semibold">HRMS</div></div>
      <div>
        <button className="flex items-center gap-2 px-3 py-1 border rounded" onClick={onLogout}><LogOut size={14}/> Logout</button>
      </div>
    </div>
  );
}
