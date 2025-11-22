import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import api from '../lib/api';
import TimelineItem from '../components/TimelineItem';
import { useNavigate } from 'react-router-dom';

export default function Activity() {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const [actionFilter, setActionFilter] = useState('');
  const [userFilter, setUserFilter] = useState('');
  const [query, setQuery] = useState('');
  const [since, setSince] = useState('');
  const [until, setUntil] = useState('');

  const [limit] = useState(25);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  function logout() { localStorage.removeItem('token'); navigate('/'); }

  useEffect(() => { fetchLogs(true); }, []);

  async function fetchLogs(reset = false) {
    try {
      setLoading(true);
      const params = { limit, offset: reset ? 0 : offset };
      if (actionFilter) params.action = actionFilter;
      if (userFilter) params.userId = userFilter;
      if (since) params.since = since;
      if (until) params.until = until;
      if (query) params.q = query;

      const res = await api.get('/logs', { params });
      const payload = res.data || [];

      if (reset) { setLogs(payload); setOffset(payload.length); }
      else { setLogs(s => [...s, ...payload]); setOffset(o => o + payload.length); }

      setHasMore(payload.length === Number(limit));
    } catch (err) {
      if (err.response?.status === 401) logout();
      console.error(err);
    } finally { setLoading(false); }
  }

  function applyFilters() { setOffset(0); fetchLogs(true); }
  function clearFilters() { setActionFilter(''); setUserFilter(''); setQuery(''); setSince(''); setUntil(''); setOffset(0); fetchLogs(true); }

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 flex flex-col bg-gray-50">
        <Navbar onLogout={logout} />
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Activity Timeline</h1>
          </div>

          <div className="bg-white p-4 rounded shadow mb-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search action / meta..." className="p-2 border rounded" />
              <input value={actionFilter} onChange={(e) => setActionFilter(e.target.value)} placeholder="Action (e.g. employee_created)" className="p-2 border rounded" />
              <input value={userFilter} onChange={(e) => setUserFilter(e.target.value)} placeholder="User ID" className="p-2 border rounded" />
              <input type="date" value={since} onChange={(e) => setSince(e.target.value)} className="p-2 border rounded" />
              <input type="date" value={until} onChange={(e) => setUntil(e.target.value)} className="p-2 border rounded" />
            </div>

            <div className="flex gap-2 mt-3">
              <button onClick={applyFilters} className="px-3 py-1 bg-blue-600 text-white rounded">Apply</button>
              <button onClick={clearFilters} className="px-3 py-1 border rounded">Clear</button>
            </div>
          </div>

          <div className="bg-white p-4 rounded shadow">
            {logs.length === 0 && !loading && <div className="text-gray-500 p-6">No activity yet.</div>}
            <div className="space-y-4">
              {logs.map(log => <TimelineItem key={log.id} log={log} />)}
            </div>

            <div className="mt-4 flex justify-center">
              {hasMore && (<button onClick={() => fetchLogs(false)} disabled={loading} className="px-4 py-2 bg-gray-800 text-white rounded">{loading ? 'Loading...' : 'Load more'}</button>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
