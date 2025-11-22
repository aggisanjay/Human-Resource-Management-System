import React, { useState } from 'react';
import api from '../lib/api';
import { useNavigate } from 'react-router-dom';

export default function RegisterOrg(){
  const [orgName,setOrgName]=useState('');
  const [adminName,setAdminName]=useState('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const navigate = useNavigate();

  async function submit(e){
    e.preventDefault();
    try {
      const res = await api.post('/auth/register', { orgName, adminName, email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      alert(err?.response?.data?.message || 'Register failed');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-4">Register Organisation</h2>
          <form onSubmit={submit} className="space-y-3">
            <input className="w-full p-2 border rounded" placeholder="Organisation name" value={orgName} onChange={e=>setOrgName(e.target.value)} />
            <input className="w-full p-2 border rounded" placeholder="Admin name" value={adminName} onChange={e=>setAdminName(e.target.value)} />
            <input className="w-full p-2 border rounded" placeholder="Admin email" value={email} onChange={e=>setEmail(e.target.value)} />
            <input className="w-full p-2 border rounded" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
            <button className="w-full p-2 bg-green-600 text-white rounded">Create</button>
          </form>
        </div>
      </div>
    </div>
  );
}
