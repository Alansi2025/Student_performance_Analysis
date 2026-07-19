import React, { useState, useEffect } from 'react';
import { Link, Shield, CheckCircle2, Loader2, X, Wifi, WifiOff, Database, KeyRound, Globe } from 'lucide-react';

const BACKEND = 'http://localhost:8000';

const INTEGRATION_PRESETS = {
  lms_sync: [
    { provider: 'canvas', name: 'Canvas LMS', icon: '🎨', placeholder: 'https://your-school.instructure.com' },
    { provider: 'blackboard', name: 'Blackboard', icon: '📚', placeholder: 'https://your-school.blackboard.com' },
    { provider: 'moodle', name: 'Moodle', icon: '🎓', placeholder: 'https://moodle.your-school.edu' },
  ],
  sso: [
    { provider: 'azure_ad', name: 'Azure Active Directory', icon: '🔐', placeholder: 'https://login.microsoftonline.com/tenant-id' },
    { provider: 'okta', name: 'Okta SSO', icon: '🛡️', placeholder: 'https://your-org.okta.com' },
    { provider: 'google', name: 'Google Workspace', icon: '🌐', placeholder: 'https://accounts.google.com' },
  ],
  data_lake: [
    { provider: 'custom', name: 'Custom REST API', icon: '⚡', placeholder: 'https://api.your-datalake.com/v1' },
    { provider: 'snowflake', name: 'Snowflake', icon: '❄️', placeholder: 'https://account.snowflakecomputing.com' },
    { provider: 'bigquery', name: 'Google BigQuery', icon: '📊', placeholder: 'project-id.dataset' },
  ],
};

function IntegrationModal({ type, onClose }) {
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [configUrl, setConfigUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [status, setStatus] = useState('idle'); // idle | saving | connecting | success | error
  const [message, setMessage] = useState('');

  const presets = INTEGRATION_PRESETS[type] || [];
  const typeLabel = { lms_sync: 'LMS Sync', sso: 'SSO Authentication', data_lake: 'Data Lake API' }[type];

  const handleConnect = async () => {
    if (!selectedProvider) return;
    setStatus('saving');

    try {
      // Step 1: Create the integration
      const createRes = await fetch(`${BACKEND}/integrations/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          type,
          provider: selectedProvider.provider,
          name: selectedProvider.name,
          config_url: configUrl || null,
          api_key: apiKey || null,
        }),
      });

      if (!createRes.ok) {
        const err = await createRes.json();
        throw new Error(err.detail || 'Failed to create integration');
      }

      const integration = await createRes.json();
      setStatus('connecting');

      // Step 2: Test connectivity
      const connectRes = await fetch(`${BACKEND}/integrations/${integration.id}/connect`, {
        method: 'POST',
        credentials: 'include',
      });

      const result = await connectRes.json();
      if (result.status === 'connected') {
        setStatus('success');
        setMessage(result.message);
      } else {
        setStatus('error');
        setMessage(result.message);
      }
    } catch (err) {
      setStatus('error');
      setMessage(err.message || 'Connection failed');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn" onClick={onClose}>
      <div
        className="relative bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-700 rounded-3xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Configure {typeLabel}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <X size={18} className="text-slate-500" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {status === 'success' ? (
            <div className="text-center space-y-4 py-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                <CheckCircle2 size={32} className="text-emerald-600 dark:text-emerald-400" />
              </div>
              <h4 className="text-lg font-bold text-emerald-700 dark:text-emerald-300">Connected Successfully!</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">{message}</p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-colors"
              >
                Done
              </button>
            </div>
          ) : (
            <>
              {/* Provider selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Select Provider</label>
                <div className="grid grid-cols-1 gap-2">
                  {presets.map(p => (
                    <button
                      key={p.provider}
                      onClick={() => setSelectedProvider(p)}
                      className={`flex items-center gap-3 p-3.5 rounded-2xl border text-left transition-all duration-200 ${
                        selectedProvider?.provider === p.provider
                          ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/30 ring-2 ring-brand-500/20'
                          : 'border-slate-150 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50 dark:bg-slate-900/40'
                      }`}
                    >
                      <span className="text-xl">{p.icon}</span>
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{p.name}</span>
                      {selectedProvider?.provider === p.provider && (
                        <CheckCircle2 size={16} className="ml-auto text-brand-600 dark:text-brand-400" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Config fields — shown once provider is selected */}
              {selectedProvider && (
                <div className="space-y-4 animate-fadeInUp">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Globe size={12} /> Endpoint URL
                    </label>
                    <input
                      type="url"
                      value={configUrl}
                      onChange={e => setConfigUrl(e.target.value)}
                      placeholder={selectedProvider.placeholder}
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                      <KeyRound size={12} /> API Key / Secret
                    </label>
                    <input
                      type="password"
                      value={apiKey}
                      onChange={e => setApiKey(e.target.value)}
                      placeholder="Paste your API key or client secret"
                      className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all font-mono"
                    />
                  </div>

                  {status === 'error' && (
                    <p className="text-xs text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-950/30 p-3 rounded-xl border border-red-200 dark:border-red-900/50">
                      ⚠️ {message}
                    </p>
                  )}

                  <button
                    onClick={handleConnect}
                    disabled={status === 'saving' || status === 'connecting'}
                    className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {status === 'saving' || status === 'connecting' ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        {status === 'saving' ? 'Saving...' : 'Testing Connection...'}
                      </>
                    ) : (
                      <>
                        <Wifi size={16} />
                        Connect & Test
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function IntegrationSafety() {
  const [activeModal, setActiveModal] = useState(null); // 'lms_sync' | 'sso' | 'data_lake' | null
  const [integrationStatus, setIntegrationStatus] = useState(null);

  // Fetch status on mount (silently — no error if backend is down)
  useEffect(() => {
    fetch(`${BACKEND}/integrations/status`, { credentials: 'include' })
      .then(r => r.ok ? r.json() : null)
      .then(data => data && setIntegrationStatus(data))
      .catch(() => {});
  }, [activeModal]); // Re-fetch when modal closes

  const getStatusBadge = (type) => {
    if (!integrationStatus || !integrationStatus[type]) return null;
    const s = integrationStatus[type];
    if (s.connected > 0) {
      return (
        <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50">
          {s.connected} ACTIVE
        </span>
      );
    }
    return null;
  };

  const items = [
    { type: 'lms_sync', label: 'Canvas, Blackboard & Moodle Sync' },
    { type: 'sso', label: 'SSO / Active Directory Authentication' },
    { type: 'data_lake', label: 'Custom API for Data Lakes' },
  ];

  return (
    <section className="relative overflow-hidden py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-slate-200/60 dark:border-slate-800/40">
      
      {/* TWO-COLUMN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
        
        {/* CARD 1: Deep Integration */}
        <div className="bg-white dark:bg-[#0d1326]/60 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-black/25 rounded-3xl p-8 flex flex-col justify-between gap-6 transition-all duration-300 hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-2xl hover:scale-[1.005]">
          
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/40 text-brand-650 dark:text-brand-400 flex items-center justify-center border border-brand-100/50 dark:border-brand-900/30 transition-all duration-300 flex-shrink-0">
              <Link size={18} />
            </div>

            <div className="space-y-2 text-left">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-850 dark:text-white transition-colors duration-300">
                Deep Integration
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed transition-colors duration-300">
                AetherLearn doesn't replace your stack; it supercharges it. Seamlessly connect with your existing infrastructure.
              </p>
            </div>
          </div>

          {/* Integration Bullets — Now clickable! */}
          <div className="flex flex-col gap-3 text-left w-full">
            {items.map(item => (
              <button
                key={item.type}
                onClick={() => setActiveModal(item.type)}
                className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-4 transition-all duration-200 hover:border-brand-300 dark:hover:border-brand-700 hover:bg-brand-50/50 dark:hover:bg-brand-950/20 hover:scale-[1.01] cursor-pointer group text-left w-full"
              >
                <CheckCircle2 size={16} className="text-brand-600 dark:text-brand-400 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <span className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 group-hover:text-brand-700 dark:group-hover:text-brand-300 transition-colors">
                  {item.label}
                </span>
                {getStatusBadge(item.type)}
              </button>
            ))}
          </div>

        </div>

        {/* CARD 2: Safety & Ethics First */}
        <div className="bg-white dark:bg-[#0d1326]/60 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/40 dark:shadow-black/25 rounded-3xl p-8 flex flex-col justify-between gap-6 transition-all duration-300 hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-2xl hover:scale-[1.005]">
          
          <div className="space-y-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-650 dark:text-emerald-400 flex items-center justify-center border border-emerald-100/50 dark:border-emerald-900/30 transition-all duration-300 flex-shrink-0">
              <Shield size={18} />
            </div>

            <div className="space-y-2 text-left">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-850 dark:text-white transition-colors duration-300">
                Safety & Ethics First
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed transition-colors duration-300">
                Advanced AI requires advanced responsibility. Our models are built on transparency, privacy, and active bias mitigation.
              </p>
            </div>
          </div>

          {/* Metric Sub-cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left w-full">
            
            <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 flex flex-col gap-2 transition-colors duration-300">
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                Zero-Data Retention
              </span>
              <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400 transition-colors duration-300">
                Personal models are encrypted locally; training data is anonymized immediately.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-5 flex flex-col gap-2 transition-colors duration-300">
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                Algorithmic Audits
              </span>
              <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400 transition-colors duration-300">
                Quarterly third-party audits ensure recommendation models remain unbiased and fair.
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* Integration Modal */}
      {activeModal && (
        <IntegrationModal
          type={activeModal}
          onClose={() => setActiveModal(null)}
        />
      )}
    </section>
  );
}
