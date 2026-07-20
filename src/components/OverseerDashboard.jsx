import React, { useState, useEffect } from 'react';
import { Activity, Shield, LogOut, Search, Clock, AlertTriangle, Camera } from 'lucide-react';

const OverseerDashboard = ({ user, onLogout }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch('http://localhost:8000/users/logs', {
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch logs');
        }
        
        const data = await response.json();
        setLogs(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
    const interval = setInterval(fetchLogs, 5000); // refresh every 5s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-[#0b0f19] pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="fluid-container animate-fade-in-up">
        
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              <Shield className="w-8 h-8 text-indigo-500 animate-pulse-glow rounded-full" />
              Overseer Dashboard
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">System Health & Security Monitoring</p>
          </div>
          
          <div className="flex items-center gap-4">
            
            <div className="relative group mr-2">
              <img 
                src={profileImage || "https://ui-avatars.com/api/?name=" + (user?.email || "Overseer")} 
                alt="Profile" 
                className="w-10 h-10 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700"
              />
              <label className="absolute inset-0 flex items-center justify-center bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                <Camera className="w-4 h-4" />
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setProfileImage(URL.createObjectURL(e.target.files[0]));
                    }
                  }} 
                />
              </label>
            </div>
            <div className="text-right hidden sm:block">
              <div className="font-medium dark:text-white">{user?.email}</div>
              <div className="text-sm text-indigo-500 font-semibold">{user?.role}</div>
            </div>
            <button 
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3 text-indigo-500 mb-2">
              <Activity className="w-5 h-5" />
              <h3 className="font-semibold text-slate-700 dark:text-slate-300">Total Events</h3>
            </div>
            <div className="text-3xl font-bold dark:text-white">{logs.length}</div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3 text-red-500 mb-2">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-semibold text-slate-700 dark:text-slate-300">Failed Logins</h3>
            </div>
            <div className="text-3xl font-bold dark:text-white">
              {logs.filter(l => l.action === 'FAILED_LOGIN').length}
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3 text-emerald-500 mb-2">
              <Search className="w-5 h-5" />
              <h3 className="font-semibold text-slate-700 dark:text-slate-300">AI Usage</h3>
            </div>
            <div className="text-3xl font-bold dark:text-white">
              {logs.filter(l => l.action === 'AI_USAGE').length}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden animate-slide-in-right">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Activity Log</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 uppercase font-semibold">
                <tr>
                  <th className="px-6 py-4">Timestamp</th>
                  <th className="px-6 py-4">Action</th>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Details</th>
                  <th className="px-6 py-4">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                      <p className="mt-2 text-slate-500">Loading logs...</p>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-red-500">
                      <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      Error: {error}
                    </td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center">
                      No activity recorded yet.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 opacity-50" />
                          {new Date(log.timestamp).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          log.action === 'FAILED_LOGIN' ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/50' :
                          log.action === 'LOGIN' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/50' :
                          log.action === 'AI_USAGE' ? 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800/50' :
                          'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                        }`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium dark:text-slate-300">{log.user_email || 'Anonymous'}</td>
                      <td className="px-6 py-4">{log.details || '-'}</td>
                      <td className="px-6 py-4 font-mono text-xs">{log.ip_address}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default OverseerDashboard;
