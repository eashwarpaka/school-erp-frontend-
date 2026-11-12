import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Blocks, Search, Plus, CheckCircle, ArrowRight,
  Monitor, Video, Database, MessageSquare, CreditCard,
  Cloud, RefreshCw, AlertTriangle, X, Settings, Link as LinkIcon, Shield, Zap, Check
} from 'lucide-react';
import clsx from 'clsx';
import toast from 'react-hot-toast';

interface Integration {
  id: string;
  name: string;
  provider: string;
  category: 'Finance' | 'Communication' | 'Academics' | 'Hardware' | 'Identity';
  status: 'CONNECTED' | 'DISCONNECTED' | 'PENDING';
  description: string;
  icon: any;
  color: string;
  usps: string[];
}

const INTEGRATIONS: Integration[] = [
  { id: 'INT-001', name: 'Tally ERP 9', provider: 'Tally Solutions', category: 'Finance', status: 'DISCONNECTED', description: 'Two-way sync for fee receipts, ledgers, and vendor payments.', icon: Database, color: 'text-emerald-600', usps: ['Real-time fee reconciliation', 'Automated ledger posting', 'Secure two-way data sync'] },
  { id: 'INT-002', name: 'Google Workspace', provider: 'Google', category: 'Academics', status: 'CONNECTED', description: 'SSO, Google Classroom sync, and Drive integrations.', icon: Cloud, color: 'text-blue-500', usps: ['Single Sign-On (SSO) for all users', 'Automatic Google Classroom creation', 'Integrated Drive storage for assignments'] },
  { id: 'INT-003', name: 'Zoom Meetings', provider: 'Zoom Video Comm.', category: 'Communication', status: 'CONNECTED', description: 'Auto-generate meeting links for online classes and parent meetings.', icon: Video, color: 'text-blue-600', usps: ['Auto-generate meeting links', 'Attendance tracking integration', 'Secure waiting rooms for students'] },
  { id: 'INT-004', name: 'Razorpay', provider: 'Razorpay Software', category: 'Finance', status: 'CONNECTED', description: 'Payment gateway for online fee collection and auto-reconciliation.', icon: CreditCard, color: 'text-indigo-600', usps: ['Accept all payment methods', 'Next-day settlements', 'Automated fee reminders'] },
  { id: 'INT-005', name: 'WhatsApp Business API', provider: 'Meta', category: 'Communication', status: 'CONNECTED', description: 'Official API for transactional alerts and chatbot.', icon: MessageSquare, color: 'text-emerald-500', usps: ['Instant transactional alerts', 'Automated chatbot responses', '98% open rate for critical updates'] },
  { id: 'INT-006', name: 'ZKTeco Biometrics', provider: 'ZKTeco', category: 'Hardware', status: 'PENDING', description: 'Real-time attendance punch sync from campus hardware.', icon: Monitor, color: 'text-slate-700', usps: ['Real-time attendance punch sync', 'Anti-passback features', 'Visitor management integration'] },
  { id: 'INT-007', name: 'Microsoft Azure AD', provider: 'Microsoft', category: 'Identity', status: 'DISCONNECTED', description: 'Enterprise Single Sign-On and directory sync.', icon: Blocks, color: 'text-blue-700', usps: ['Enterprise Single Sign-On', 'Automated user provisioning', 'Advanced security policies'] },
];

export const IntegrationMarketplace = () => {
  const [apps, setApps] = useState<Integration[]>(INTEGRATIONS);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  
  // Modal State
  const [selectedApp, setSelectedApp] = useState<Integration | null>(null);
  const [modalMode, setModalMode] = useState<'CONNECT' | 'CONFIGURE' | 'REQUEST' | null>(null);
  
  // Connection Flow State
  const [connectStep, setConnectStep] = useState(1);
  const [isConnecting, setIsConnecting] = useState(false);
  const [requestForm, setRequestForm] = useState({ name: '', category: 'Finance', useCase: '' });

  const categories = ['ALL', 'Finance', 'Academics', 'Communication', 'Hardware', 'Identity'];

  const filteredApps = apps.filter(app => {
    if (activeCategory !== 'ALL' && app.category !== activeCategory) return false;
    return app.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const openConnectModal = (app: Integration) => {
    setSelectedApp(app);
    setModalMode('CONNECT');
    setConnectStep(1);
  };

  const openConfigModal = (app: Integration) => {
    setSelectedApp(app);
    setModalMode('CONFIGURE');
  };

  const handleStartConnection = () => {
    setIsConnecting(true);
    setTimeout(() => {
      setConnectStep(2);
      setIsConnecting(false);
    }, 1500);
  };

  const handleFinishConnection = () => {
    if (!selectedApp) return;
    setIsConnecting(true);
    setTimeout(() => {
      setApps(prev => prev.map(a => a.id === selectedApp.id ? { ...a, status: 'CONNECTED' } : a));
      toast.success(`${selectedApp.name} connected successfully!`);
      closeModal();
    }, 1500);
  };

  const handleDisconnect = () => {
    if (!selectedApp) return;
    setApps(prev => prev.map(a => a.id === selectedApp.id ? { ...a, status: 'DISCONNECTED' } : a));
    toast.success(`${selectedApp.name} disconnected.`);
    closeModal();
  };

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsConnecting(true);
    setTimeout(() => {
      toast.success(`Request for ${requestForm.name} submitted successfully!`);
      setIsConnecting(false);
      closeModal();
      setRequestForm({ name: '', category: 'Finance', useCase: '' });
    }, 1000);
  };

  const closeModal = () => {
    setSelectedApp(null);
    setModalMode(null);
    setIsConnecting(false);
    setConnectStep(1);
  };

  return (
    <div className="flex flex-col gap-6 p-4 max-w-7xl mx-auto h-[calc(100vh-6rem)]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Blocks size={24} className="text-indigo-600" />
            Integration Marketplace
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">Connect third-party apps, APIs, and hardware to your ERP ecosystem.</p>
        </div>
        <button 
          onClick={() => setModalMode('REQUEST')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-all"
        >
          <Plus size={16} /> Request Integration
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex bg-slate-100 p-1 rounded-xl overflow-x-auto w-full sm:w-auto hide-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={clsx(
                'px-4 py-1.5 text-sm font-semibold rounded-lg transition-all whitespace-nowrap',
                activeCategory === cat ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              )}
            >
              {cat}
            </button>
          ))}
        </div>
        
        <div className="relative w-full sm:w-64">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search integrations..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 overflow-y-auto pb-6">
        {filteredApps.map(app => (
          <motion.div 
            key={app.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col hover:border-indigo-200 transition-colors group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={clsx('w-12 h-12 rounded-2xl flex items-center justify-center bg-slate-50 border border-slate-100 shadow-sm group-hover:scale-105 transition-transform', app.color)}>
                <app.icon size={24} />
              </div>
              <span className={clsx(
                'px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1',
                app.status === 'CONNECTED' ? 'bg-emerald-100 text-emerald-700' :
                app.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                'bg-slate-100 text-slate-600'
              )}>
                {app.status === 'CONNECTED' && <CheckCircle size={10} />}
                {app.status === 'PENDING' && <AlertTriangle size={10} />}
                {app.status}
              </span>
            </div>
            
            <h3 className="font-bold text-slate-800 text-lg">{app.name}</h3>
            <div className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">{app.category} · By {app.provider}</div>
            <p className="text-sm text-slate-600 mb-6 flex-1">{app.description}</p>
            
            <button 
              onClick={() => app.status === 'CONNECTED' ? openConfigModal(app) : openConnectModal(app)}
              className={clsx(
                'w-full py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2',
                app.status === 'CONNECTED' 
                  ? 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md'
              )}
            >
              {app.status === 'CONNECTED' ? (
                <>Configure settings</>
              ) : (
                <><Plus size={16} /> Connect Integration</>
              )}
            </button>
          </motion.div>
        ))}
      </div>

      {/* Dynamic Modal Overlay */}
      <AnimatePresence>
        {selectedApp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={closeModal}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[500px]"
            >
              {/* Left Panel: USPs and Info */}
              <div className="w-full md:w-2/5 bg-slate-50 border-r border-slate-100 p-8 flex flex-col">
                <div className={clsx('w-16 h-16 rounded-2xl flex items-center justify-center bg-white border border-slate-100 shadow-sm mb-6', selectedApp.color)}>
                  <selectedApp.icon size={32} />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">{selectedApp.name}</h2>
                <p className="text-sm text-slate-600 mb-8">{selectedApp.description}</p>
                
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Why connect this?</h3>
                <ul className="space-y-4 flex-1">
                  {selectedApp.usps.map((usp, i) => (
                    <li key={i} className="flex gap-3 text-sm text-slate-700 font-medium">
                      <div className="mt-0.5 min-w-[20px] text-emerald-500"><Zap size={16} /></div>
                      {usp}
                    </li>
                  ))}
                </ul>
                
                <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mt-8 pt-6 border-t border-slate-200">
                  <Shield size={14} /> Official {selectedApp.provider} Integration
                </div>
              </div>

              {/* Right Panel: Active Content */}
              <div className="w-full md:w-3/5 p-8 flex flex-col relative">
                <button 
                  onClick={closeModal}
                  className="absolute top-6 right-6 p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>

                {modalMode === 'CONNECT' && (
                  <div className="flex flex-col h-full justify-center max-w-md mx-auto w-full">
                    <h3 className="text-xl font-bold text-slate-800 mb-6 text-center">
                      {connectStep === 1 ? 'Connect to your account' : 'Configure Data Mapping'}
                    </h3>
                    
                    {connectStep === 1 ? (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1.5">API Key / Client ID</label>
                          <input type="text" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Enter your credentials" />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Secret Key</label>
                          <input type="password" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="••••••••••••••••" />
                        </div>
                        <button 
                          onClick={handleStartConnection}
                          disabled={isConnecting}
                          className="w-full py-3 mt-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                        >
                          {isConnecting ? <><RefreshCw size={18} className="animate-spin" /> Verifying...</> : <><LinkIcon size={18} /> Authenticate Integration</>}
                        </button>
                        <p className="text-xs text-center text-slate-500 mt-4">By connecting, you agree to {selectedApp.provider}'s Terms of Service.</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex gap-3 text-emerald-800 text-sm">
                          <CheckCircle size={20} className="shrink-0 text-emerald-600" />
                          <div>
                            <p className="font-bold">Authentication successful!</p>
                            <p className="text-emerald-600/80 mt-1">Please map your campus branches to proceed.</p>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <label className="flex items-center justify-between p-3 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50">
                            <span className="text-sm font-semibold text-slate-700">Sync Master Data</span>
                            <input type="checkbox" defaultChecked className="accent-indigo-600 w-4 h-4" />
                          </label>
                          <label className="flex items-center justify-between p-3 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50">
                            <span className="text-sm font-semibold text-slate-700">Enable Daily Auto-Sync</span>
                            <input type="checkbox" defaultChecked className="accent-indigo-600 w-4 h-4" />
                          </label>
                        </div>

                        <button 
                          onClick={handleFinishConnection}
                          disabled={isConnecting}
                          className="w-full py-3 mt-2 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                        >
                          {isConnecting ? <><RefreshCw size={18} className="animate-spin" /> Finalizing...</> : <><Check size={18} /> Complete Setup</>}
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {modalMode === 'CONFIGURE' && (
                  <div className="flex flex-col h-full pt-4 w-full">
                    <div className="flex items-center gap-2 text-indigo-600 font-bold mb-6">
                      <Settings size={20} /> Integration Settings
                    </div>
                    
                    <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                      <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                        <h4 className="text-sm font-bold text-slate-800 mb-3">Sync Status</h4>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="relative flex h-3 w-3">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                            </span>
                            <span className="text-sm text-slate-600 font-medium">Active & Healthy</span>
                          </div>
                          <span className="text-xs text-slate-400 font-medium">Last sync: 10 mins ago</span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-sm font-bold text-slate-800">Module Configuration</h4>
                        {[
                          { name: 'Student Data Sync', active: true },
                          { name: 'Staff Data Sync', active: true },
                          { name: 'Financial Ledgers', active: selectedApp.category === 'Finance' },
                          { name: 'Attendance Records', active: selectedApp.category === 'Hardware' },
                        ].map((mod, idx) => (
                          <div key={idx} className="flex items-center justify-between">
                            <span className="text-sm text-slate-600 font-medium">{mod.name}</span>
                            <button className={clsx(
                              "w-11 h-6 rounded-full transition-colors relative",
                              mod.active ? 'bg-indigo-600' : 'bg-slate-200'
                            )}>
                              <div className={clsx(
                                "absolute top-1 w-4 h-4 rounded-full bg-white transition-transform shadow-sm",
                                mod.active ? 'left-6' : 'left-1'
                              )} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                      <button 
                        onClick={handleDisconnect}
                        className="px-6 py-2.5 bg-rose-50 text-rose-600 font-semibold text-sm rounded-xl hover:bg-rose-100 transition-colors"
                      >
                        Disconnect Integration
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
        
        {modalMode === 'REQUEST' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={closeModal}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden p-8"
            >
              <button 
                onClick={closeModal}
                className="absolute top-6 right-6 p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
              
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <Plus size={20} />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Request Integration</h2>
              </div>
              <p className="text-sm text-slate-600 mb-6">Don't see the app you need? Let us know what we should integrate next.</p>
              
              <form onSubmit={handleRequestSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">App Name</label>
                  <input 
                    type="text" 
                    required
                    value={requestForm.name}
                    onChange={(e) => setRequestForm({...requestForm, name: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                    placeholder="e.g. Slack, Canvas LMS, Salesforce" 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Category</label>
                  <select 
                    value={requestForm.category}
                    onChange={(e) => setRequestForm({...requestForm, category: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Finance">Finance</option>
                    <option value="Academics">Academics</option>
                    <option value="Communication">Communication</option>
                    <option value="Hardware">Hardware</option>
                    <option value="Identity">Identity</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">How will you use this?</label>
                  <textarea 
                    required
                    rows={4}
                    value={requestForm.useCase}
                    onChange={(e) => setRequestForm({...requestForm, useCase: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" 
                    placeholder="Briefly describe the use case..." 
                  />
                </div>
                
                <div className="pt-4 flex justify-end gap-3">
                  <button 
                    type="button"
                    onClick={closeModal}
                    className="px-5 py-2.5 rounded-xl font-semibold text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isConnecting}
                    className="px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl text-sm hover:bg-indigo-700 transition-colors flex items-center gap-2"
                  >
                    {isConnecting ? <><RefreshCw size={16} className="animate-spin" /> Submitting...</> : 'Submit Request'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

