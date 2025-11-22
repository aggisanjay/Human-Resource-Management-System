import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, Layers, Home, Activity } from 'lucide-react';

export default function Sidebar() {
  const loc = useLocation();
  const items = [
    { to: '/dashboard', label: 'Dashboard', icon: <Home size={16}/> },
    { to: '/employees', label: 'Employees', icon: <Users size={16}/> },
    { to: '/teams', label: 'Teams', icon: <Layers size={16}/> },
    { to: '/activity', label: 'Activity', icon: <Activity size={16}/> },
  ];

  return (
    <div className="w-60 shrink-0 h-full bg-white border-r p-4">
      <div className="mb-6 font-bold text-lg">HRMS</div>
      <nav className="flex flex-col gap-2">
        {items.map(i => (
          <Link 
            key={i.to} 
            to={i.to} 
            className={`flex items-center gap-3 px-3 py-2 rounded ${
              loc.pathname === i.to 
                ? 'bg-gray-100 font-medium' 
                : 'text-gray-600'
            }`}
          >
            {i.icon}
            <span>{i.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
