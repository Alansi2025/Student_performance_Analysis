import React, { useState, useEffect } from 'react';
import { 
  Activity, Shield, LogOut, Search, Clock, AlertTriangle, Camera, 
  Link as LinkIcon, Plus, CheckCircle2, XCircle, Trash2, Power, RefreshCw, X, Globe, KeyRound, Wifi 
} from 'lucide-react';

const INTEGRATION_PROVIDERS = {
  lms_sync: [
    { provider: 'canvas', name: 'Canvas LMS', icon: '🎨' },
    { provider: 'blackboard', name: 'Blackboard Learn', icon: '🎓' },
    { provider: 'moodle', name: 'Moodle HQ', icon: '🎓' },
  ],
  sso: [
    { provider: 'azure_ad', name: 'Azure AD / Entra ID', icon: '🔑' },
    { provider: 'okta', name: 'Okta Identity Platform', icon: '🛡️' },
    { provider: 'google', name: 'Google Workspace SSO', icon: '🌐' },
    { provider: 'saml', name: 'Generic SAML 2.0', icon: '🔐' },
  ],
  data_lake: [
    { provider: 'snowflake', name: 'Snowflake Data Cloud', icon: '❄️' },
    { provider: 'bigquery', name: 'Google BigQuery', icon: '📊' },
    { provider: 's3', name: 'AWS S3 Data Lake', icon: '🪣' },
    { provider: 'custom', name: 'Custom REST API', icon: '⚡' },
  ]
};

const OverseerDashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('logs'); // 'logs' | 'integrations'
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  // Integrations state
  const [integrations, setIntegrations] = useState([]);
  const [integrationStatus, setIntegrationStatus] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState('lms_sync');
  const [selectedProvider, setSelectedProvider] = useState('');
  const [configUrl, setConfigUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [actionLoading, setActionLoading] = useState(null);
  const [modalStatus, setModalStatus] = useState('idle');
  const [modalMsg, setModalMsg] = useState('');

  // Fetch Activity Logs
  const fetchLogs = async () => {
    try {
      const response = await fetch('http://localhost:8000/users/logs', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch logs');
      const data = await response.json();
      setLogs(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Integrations List & Status Summary
  const fetchIntegrations = async () => {
    try {
      const [listRes, statusRes] = await Promise.all([
        fetch('http://localhost:8000/integrations/', { credentials: 'include' }),
        fetch('http://localhost:8000/integrations/status', { credentials: 'include' })
      ]);
      if (listRes.ok) {
        const listData = await listRes.json();
        setIntegrations(listData);
      }
      if (statusRes.ok) {
        const statusData = await statusRes.json();
        setIntegrationStatus(statusData);
      }
    } catch (err) {
      console.error('Failed to fetch integrations:', err);
    }
  };

  useEffect(() => {
    fetchLogs();
    fetchIntegrations();
    const interval = setInterval(() => {
      fetchLogs();
      fetchIntegrations();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Action: Create Integration
  const handleCreateIntegration = async (e) => {
    e.preventDefault();
    if (!selectedProvider) return;
    setModalStatus('saving');

    try {
      const p = INTEGRATION_PROVIDERS[selectedType].find(item => item.provider === selectedProvider);
      const res = await fetch('http://localhost:8000/integrations/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          type: selectedType,
          provider: selectedProvider,
          name: p ? p.name : selectedProvider,
          config_url: configUrl || null,
          api_key: apiKey || null,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || 'Failed to create integration');
      }

      const created = await res.json();
      setModalStatus('connecting');

      // Test connectivity immediately
      const connectRes = await fetch(`http://localhost:8000/integrations/${created.id}/connect`, {
        method: 'POST',
        credentials: 'include',
      });
      const connectData = await connectRes.json();

      if (connectData.status === 'connected') {
        setModalStatus('success');
        setModalMsg(connectData.message);
      } else {
        setModalStatus('error');
        setModalMsg(connectData.message);
      }
      fetchIntegrations();
    } catch (err) {
      setModalStatus('error');
      setModalMsg(err.message || 'Connection failed');
    }
  };

  // Action: Test & Connect Integration
  const handleConnectIntegration = async (id) => {
    setActionLoading(id);
    try {
      const res = await fetch(`http://localhost:8000/integrations/${id}/connect`, {
        method: 'POST',
        credentials: 'include'
      });
      if (res.ok) {
        await fetchIntegrations();
      }
    } catch (err) {
      console.error('Connect failed', err);
    } finally {
      setActionLoading(null);
    }
  };

  // Action: Disconnect Integration
  const handleDisconnectIntegration = async (id) => {
    setActionLoading(id);
    try {
      const res = await fetch(`http://localhost:8000/integrations/${id}/disconnect`, {
        method: 'POST',
        credentials: 'include'
      });
      if (res.ok) {
        await fetchIntegrations();
      }
    } catch (err) {
      console.error('Disconnect failed', err);
    } finally {
      setActionLoading(null);
    }
  };

  // Action: Delete Integration
  const handleDeleteIntegration = async (id) => {
    if (!window.confirm("Are you sure you want to delete this integration?")) return;
    setActionLoading(id);
    try {
      const res = await fetch(`http://localhost:8000/integrations/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (res.ok) {
        await fetchIntegrations();
      }
    } catch (err) {
      console.error('Delete failed', err);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-[#0b0f19] pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="fluid-container animate-fade-in-up">
        
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
              <Shield className="w-8 h-8 text-indigo-500 animate-pulse-glow rounded-full" />
              Overseer Dashboard
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">System Health, Security & Integration Control</p>
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

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 mb-6 bg-slate-200/60 dark:bg-slate-800/60 p-1.5 rounded-2xl w-fit">
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
              activeTab === 'logs'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Activity className="w-4 h-4" />
            Activity Logs
          </button>
          <button
            onClick={() => setActiveTab('integrations')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 ${
              activeTab === 'integrations'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <LinkIcon className="w-4 h-4" />
            Third-Party Integrations
          </button>
        </div>

        {/* Summary Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3 text-indigo-500 mb-2">
              <Activity className="w-5 h-5" />
              <h3 className="font-semibold text-slate-700 dark:text-slate-300">Total System Events</h3>
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
              <LinkIcon className="w-5 h-5" />
              <h3 className="font-semibold text-slate-700 dark:text-slate-300">Connected Integrations</h3>
            </div>
            <div className="text-3xl font-bold dark:text-white">
              {integrations.filter(i => i.status === 'connected').length} / {integrations.length}
            </div>
          </div>
        </div>

        {/* TAB 1: ACTIVITY LOGS */}
        {activeTab === 'logs' && (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden animate-slide-in-right">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">System Activity Log</h2>
              <button onClick={fetchLogs} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                <RefreshCw size={16} />
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 uppercase font-semibold text-xs">
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
        )}

        {/* TAB 2: THIRD-PARTY INTEGRATIONS */}
        {activeTab === 'integrations' && (
          <div className="space-y-6 animate-slide-in-right">
            
            {/* Header + Add Button */}
            <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <LinkIcon className="w-5 h-5 text-indigo-500" />
                  Third-Party Integration Control
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Manage LMS Sync (Canvas, Blackboard, Moodle), SSO Authentication (Azure AD, Okta, Google, SAML), and Data Lakes (Snowflake, BigQuery, AWS S3).
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedProvider('');
                  setConfigUrl('');
                  setApiKey('');
                  setModalStatus('idle');
                  setModalMsg('');
                  setIsModalOpen(true);
                }}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 whitespace-nowrap"
              >
                <Plus size={16} />
                Configure New Integration
              </button>
            </div>

            {/* Integrations Table */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                <h3 className="font-bold text-slate-900 dark:text-white">Active & Configured Connectors</h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
                  <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 uppercase font-semibold text-xs">
                    <tr>
                      <th className="px-6 py-4">Name / Provider</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Endpoint / Config</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {integrations.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                          No integrations configured yet. Click "Configure New Integration" above to get started.
                        </td>
                      </tr>
                    ) : (
                      integrations.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                          <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                            <div className="flex items-center gap-2">
                              <span>{item.name}</span>
                              <span className="text-xs font-normal text-slate-400">({item.provider})</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-xs font-mono">
                            <span className="bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md text-slate-700 dark:text-slate-300 font-bold uppercase">
                              {item.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-xs font-mono text-slate-500 dark:text-slate-400 truncate max-w-[200px]">
                            {item.config_url || item.api_key ? (item.config_url || '••••••••') : 'Not Configured'}
                          </td>
                          <td className="px-6 py-4">
                            {item.status === 'connected' ? (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50">
                                <CheckCircle2 size={12} /> Connected
                              </span>
                            ) : item.status === 'error' ? (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800/50">
                                <XCircle size={12} /> Connection Error
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400">
                                Disconnected
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {item.status === 'connected' ? (
                                <button
                                  onClick={() => handleDisconnectIntegration(item.id)}
                                  disabled={actionLoading === item.id}
                                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                                >
                                  <Power size={12} /> Disconnect
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleConnectIntegration(item.id)}
                                  disabled={actionLoading === item.id}
                                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                                >
                                  <Wifi size={12} /> Test & Connect
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteIntegration(item.id)}
                                disabled={actionLoading === item.id}
                                className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                title="Delete Integration"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* CREATE INTEGRATION MODAL */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn" onClick={() => setIsModalOpen(false)}>
            <div className="relative bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-700 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden" onClick={e => e.stopPropagation()}>
              
              <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <LinkIcon className="w-5 h-5 text-indigo-500" />
                  Configure Third-Party Integration
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <X size={18} className="text-slate-500" />
                </button>
              </div>

              <form onSubmit={handleCreateIntegration} className="p-6 space-y-5">
                {modalStatus === 'success' ? (
                  <div className="text-center space-y-4 py-4">
                    <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 size={28} />
                    </div>
                    <h4 className="text-base font-bold text-emerald-700 dark:text-emerald-300">Integration Active & Verified!</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{modalMsg}</p>
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors"
                    >
                      Close Window
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Select Category */}
                    <div className="space-y-1.5 text-left">
                      <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">1. Integration Type</label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'lms_sync', name: 'LMS Sync' },
                          { id: 'sso', name: 'SSO Auth' },
                          { id: 'data_lake', name: 'Data Lake' }
                        ].map(t => (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => { setSelectedType(t.id); setSelectedProvider(''); }}
                            className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                              selectedType === t.id
                                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400'
                                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                            }`}
                          >
                            {t.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Select Provider */}
                    <div className="space-y-1.5 text-left">
                      <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">2. Supported Provider</label>
                      <div className="grid grid-cols-2 gap-2">
                        {INTEGRATION_PROVIDERS[selectedType].map(p => (
                          <button
                            key={p.provider}
                            type="button"
                            onClick={() => setSelectedProvider(p.provider)}
                            className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all ${
                              selectedProvider === p.provider
                                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 ring-1 ring-indigo-500'
                                : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            <span>{p.icon}</span>
                            <span className="text-xs font-semibold">{p.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Endpoint URL & API Key */}
                    {selectedProvider && (
                      <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800 text-left animate-fadeIn">
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                            <Globe size={12} /> Endpoint / Server URL
                          </label>
                          <input
                            type="url"
                            value={configUrl}
                            onChange={e => setConfigUrl(e.target.value)}
                            placeholder="https://institution.canvas.com/api"
                            className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                            <KeyRound size={12} /> API Key / Secret Token
                          </label>
                          <input
                            type="password"
                            value={apiKey}
                            onChange={e => setApiKey(e.target.value)}
                            placeholder="Paste your API key or client secret"
                            className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                          />
                        </div>

                        {modalStatus === 'error' && (
                          <div className="text-xs text-red-500 bg-red-50 dark:bg-red-950/30 p-3 rounded-xl border border-red-200 dark:border-red-900/50">
                            ⚠️ {modalMsg}
                          </div>
                        )}

                        <button
                          type="submit"
                          disabled={modalStatus === 'saving' || modalStatus === 'connecting'}
                          className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          {modalStatus === 'saving' || modalStatus === 'connecting' ? (
                            <>
                              <RefreshCw size={14} className="animate-spin" />
                              Testing Connectivity...
                            </>
                          ) : (
                            <>
                              <Wifi size={14} />
                              Save & Activate Integration
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </>
                )}
              </form>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default OverseerDashboard;

