import React, { useState } from 'react';
import api from '../lib/api';
import { useNavigate, Link } from 'react-router-dom';

export default function Login(){
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const navigate = useNavigate();

  async function submit(e){
    e.preventDefault();
    try {
      const res = await api.post('/auth/login',{ email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err){
      alert(err?.response?.data?.message || 'Login failed');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-4">Login</h2>
          <form onSubmit={submit} className="space-y-3">
            <input className="w-full p-2 border rounded" placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} />
            <input className="w-full p-2 border rounded" placeholder="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
            <button className="w-full p-2 bg-blue-600 text-white rounded">Login</button>
          </form>
          <div className="mt-3 text-sm text-gray-600">New? <Link to="/register" className="text-blue-600">Register organisation</Link></div>
        </div>
      </div>
    </div>
  );
}
