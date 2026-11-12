import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2, Users, CreditCard, Activity, CheckCircle, 
  Settings, ArrowUpRight, Search, ShieldAlert,
  Server, Globe, X, Loader2, DollarSign, Calendar,
  FileText, Download, Play, Save, Check, Database
} from 'lucide-react';
import clsx from 'clsx';
import toast from 'react-hot-toast';

interface Tenant {
  id: string;
  name: string;
  domain: string;
  plan: 'ENTERPRISE' | 'PRO' | 'STARTER';
  students: number;
  status: 'ACTIVE' | 'SUSPENDED' | 'ONBOARDING';
  mrr: number;
  joinedDate: string;
}

const INITIAL_TENANTS: Tenant[] = [
  { id: 'ORG-1001', name: 'Global Academy Trust', domain: 'global.edusaaS.com', plan: 'ENTERPRISE', students: 4500, status: 'ACTIVE', mrr: 12500, joinedDate: '2024-01-15' },
  { id: 'ORG-1002', name: 'Sunrise International', domain: 'sunrise.edusaaS.com', plan: 'PRO', students: 1200, status: 'ACTIVE', mrr: 4500, joinedDate: '2025-06-20' },
  { id: 'ORG-1003', name: 'Greenwood High', domain: 'greenwood.edusaaS.com', plan: 'STARTER', students: 450, status: 'ONBOARDING', mrr: 1500, joinedDate: '2026-08-01' },
  { id: 'ORG-1004', name: 'St. Marys Convent', domain: 'stmarys.edusaaS.com', plan: 'PRO', students: 850, status: 'SUSPENDED', mrr: 3500, joinedDate: '2023-11-10' },
];

export const SuperAdminConsole = () => {
  const [tenants, setTenants] = useState<Tenant[]>(INITIAL_TENANTS);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal states
  const [isGlobalConfigOpen, setIsGlobalConfigOpen] = useState(false);
  const [isProvisionOpen, setIsProvisionOpen] = useState(false);
  const [billingTenant, setBillingTenant] = useState<Tenant | null>(null);
  const [impersonateTenant, setImpersonateTenant] = useState<Tenant | null>(null);

  // Provisioning State
  const [provisionPhase, setProvisionPhase] = useState<'idle' | 'running' | 'success'>('idle');
  const [provisionStep, setProvisionStep] = useState(0);
  const [newSchoolData, setNewSchoolData] = useState({ name: '', domain: '', plan: 'STARTER' });

  const filteredTenants = tenants.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.domain.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    totalArr: tenants.filter(t => t.status === 'ACTIVE').reduce((sum, t) => sum + (t.mrr * 12), 0),
    totalStudents: tenants.reduce((sum, t) => sum + t.students, 0),
    activeTenants: tenants.filter(t => t.status === 'ACTIVE').length,
    onboarding: tenants.filter(t => t.status === 'ONBOARDING').length,
  };

  const handleStartProvisioning = () => {
    if (!newSchoolData.name || !newSchoolData.domain) {
      toast.error('Please fill in required fields');
      return;
    }
    setProvisionPhase('running');
    setProvisionStep(0);
  };

  useEffect(() => {
    if (provisionPhase === 'running') {
      const timers: ReturnType<typeof setTimeout>[] = [];
      
      timers.push(setTimeout(() => setProvisionStep(1), 1500)); // DB Init
      timers.push(setTimeout(() => setProvisionStep(2), 3000)); // Routing
      timers.push(setTimeout(() => setProvisionStep(3), 4500)); // Admin Setup
      
      timers.push(setTimeout(() => {
        setProvisionPhase('success');
        const mrr = newSchoolData.plan === 'ENTERPRISE' ? 12500 : newSchoolData.plan === 'PRO' ? 4500 : 1500;
        setTenants([{
          id: `ORG-${1000 + tenants.length + 1}`,
          name: newSchoolData.name,
          domain: newSchoolData.domain + '.edusaaS.com',
          plan: newSchoolData.plan as any,
          students: 0,
          status: 'ONBOARDING',
          mrr: mrr,
          joinedDate: new Date().toISOString().split('T')[0]
        }, ...tenants]);
        toast.success('School provisioned successfully!');
      }, 5500));

      return () => timers.forEach(t => clearTimeout(t));
    }
  }, [provisionPhase, newSchoolData, tenants.length]);

  const handleImpersonateConfirm = () => {
    if (!impersonateTenant) return;
    toast.loading(`Switching context to ${impersonateTenant.name}...`);
    setTimeout(() => {
      toast.dismiss();
      toast.success('Impersonation active');
      setImpersonateTenant(null);
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-6 p-4 max-w-7xl mx-auto h-[calc(100vh-6rem)] relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Globe size={24} className="text-indigo-600" />
            SaaS Super-Admin Console
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">Multi-tenant management, global MRR, and infrastructure health.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsGlobalConfigOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-all">
            <Settings size={16} /> Global Config
          </button>
          <button 
            onClick={() => {
              setIsProvisionOpen(true);
              setProvisionPhase('idle');
              setNewSchoolData({ name: '', domain: '', plan: 'STARTER' });
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 shadow-md transition-all">
            <Building2 size={16} /> Provision New School
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Platform ARR', value: `$${(stats.totalArr / 1000).toFixed(1)}k`, icon: CreditCard, color: 'bg-emerald-500 text-emerald-50' },
          { label: 'Active Organizations', value: stats.activeTenants, icon: Building2, color: 'bg-indigo-500 text-indigo-50' },
          { label: 'Total Enrolled Students', value: stats.totalStudents.toLocaleString(), icon: Users, color: 'bg-blue-500 text-blue-50' },
          { label: 'Schools Onboarding', value: stats.onboarding, icon: Activity, color: 'bg-amber-500 text-amber-50' },
        ].map(kpi => (
          <div key={kpi.label} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center', kpi.color)}>
                <kpi.icon size={20} />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-800">{kpi.value}</div>
            <div className="text-sm font-medium text-slate-500">{kpi.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        
        {/* Tenant List */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col min-h-0">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 rounded-t-2xl">
            <h3 className="font-bold text-slate-800">Provisioned Tenants</h3>
            <div className="relative w-64">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search orgs or domains..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-white sticky top-0 border-b border-slate-100 z-10">
                <tr>
                  <th className="px-5 py-3 font-semibold">Organization</th>
                  <th className="px-5 py-3 font-semibold">Plan & MRR</th>
                  <th className="px-5 py-3 font-semibold">Scale</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <AnimatePresence>
                  {filteredTenants.map(tenant => (
                    <motion.tr 
                      layout
                      key={tenant.id} 
                      initial={{ opacity: 0, y: 20 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <div className="font-semibold text-slate-800">{tenant.name}</div>
                        <div className="text-xs text-blue-600 mt-0.5">{tenant.domain}</div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">{tenant.id}</div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={clsx(
                          'px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase',
                          tenant.plan === 'ENTERPRISE' ? 'bg-purple-100 text-purple-700' :
                          tenant.plan === 'PRO' ? 'bg-blue-100 text-blue-700' :
                          'bg-slate-100 text-slate-700'
                        )}>
                          {tenant.plan}
                        </span>
                        <div className="font-medium text-slate-700 mt-1">${tenant.mrr.toLocaleString()}/mo</div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="text-slate-700 font-medium">{tenant.students.toLocaleString()}</div>
                        <div className="text-[10px] text-slate-500">Students</div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={clsx(
                          'px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit',
                          tenant.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' :
                          tenant.status === 'ONBOARDING' ? 'bg-amber-100 text-amber-700' :
                          'bg-red-100 text-red-700 border border-red-200'
                        )}>
                          {tenant.status === 'ACTIVE' && <CheckCircle size={12} />}
                          {tenant.status === 'ONBOARDING' && <Activity size={12} />}
                          {tenant.status === 'SUSPENDED' && <ShieldAlert size={12} />}
                          {tenant.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button 
                          onClick={() => setBillingTenant(tenant)} 
                          className="px-3 py-1.5 border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-semibold rounded-lg transition-colors mr-2">
                          Billing
                        </button>
                        <button 
                          onClick={() => setImpersonateTenant(tenant)} 
                          className="p-1.5 bg-slate-800 text-white hover:bg-slate-700 rounded-lg transition-colors inline-flex align-middle">
                          <ArrowUpRight size={16} />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>

        {/* Infra Health Panel */}
        <div className="bg-slate-900 rounded-2xl shadow-xl border border-slate-800 flex flex-col text-white min-h-0">
          <div className="p-5 border-b border-slate-800">
            <h3 className="font-bold text-slate-100 flex items-center gap-2"><Server size={18} className="text-indigo-400" /> Cloud Infrastructure</h3>
          </div>
          <div className="p-5 space-y-6 flex-1 overflow-y-auto">
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">DB Shard 1 (EU-West)</span>
                <span className="text-emerald-400 font-bold">Healthy (34%)</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '34%' }} />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">DB Shard 2 (AP-South)</span>
                <span className="text-amber-400 font-bold">High Load (82%)</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: '82%' }} />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Storage Volume (S3)</span>
                <span className="text-slate-200 font-bold">4.2 TB</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div className="bg-indigo-500 h-2 rounded-full" style={{ width: '45%' }} />
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800">
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Latest System Logs</h4>
              <div className="space-y-3 font-mono text-[10px] text-slate-400">
                <div className="flex gap-2">
                  <span className="text-indigo-400">10:42:15</span>
                  <span className="text-emerald-400">[INFO]</span>
                  <span>Automated DB snapshot complete (Shard 2).</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-indigo-400">10:35:02</span>
                  <span className="text-blue-400">[PROVISION]</span>
                  <span>Tenant ORG-1003 sub-domain routing initialized.</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-indigo-400">10:15:44</span>
                  <span className="text-amber-400">[WARN]</span>
                  <span>API rate limit approaching for ORG-1001 (Payment Gateway).</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* --- MODALS & OVERLAYS --- */}

      {/* 1. Global Config Modal */}
      <AnimatePresence>
        {isGlobalConfigOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col"
            >
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2"><Settings className="text-indigo-600" /> Global Configuration</h3>
                <button onClick={() => setIsGlobalConfigOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
              </div>
              <div className="p-5 space-y-5">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div>
                    <div className="font-semibold text-slate-800">Maintenance Mode</div>
                    <div className="text-xs text-slate-500">Temporarily block all non-admin logins</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                  </label>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">Default Data Region</label>
                  <select className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500">
                    <option>US East (N. Virginia)</option>
                    <option>EU West (Ireland)</option>
                    <option>AP South (Mumbai)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">Global Admin Notification Email</label>
                  <input type="email" defaultValue="sysadmin@edusaas.com" className="w-full p-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" />
                </div>
              </div>
              <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                <button onClick={() => setIsGlobalConfigOpen(false)} className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-200">Cancel</button>
                <button 
                  onClick={() => { toast.success('Global settings saved'); setIsGlobalConfigOpen(false); }}
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 flex items-center gap-2">
                  <Save size={16} /> Save Config
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. Provision New School Modal */}
      <AnimatePresence>
        {isProvisionOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: 20 }}
              className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-xl overflow-hidden flex flex-col"
            >
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                  <Building2 className="text-indigo-600" /> 
                  Provision New Tenant
                </h3>
                {provisionPhase === 'idle' && (
                  <button onClick={() => setIsProvisionOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
                )}
              </div>

              <div className="p-6">
                {provisionPhase === 'idle' ? (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-sm font-semibold text-slate-700">Organization Name</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Springfield High"
                        value={newSchoolData.name}
                        onChange={e => setNewSchoolData({...newSchoolData, name: e.target.value})}
                        className="w-full p-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-semibold text-slate-700">Sub-domain Prefix</label>
                      <div className="flex relative">
                        <input 
                          type="text" 
                          placeholder="springfield"
                          value={newSchoolData.domain}
                          onChange={e => setNewSchoolData({...newSchoolData, domain: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '')})}
                          className="w-full p-2.5 rounded-l-xl border border-slate-200 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" 
                        />
                        <div className="px-4 py-2.5 bg-slate-100 border-y border-r border-slate-200 rounded-r-xl text-slate-500 text-sm flex items-center">
                          .edusaaS.com
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-semibold text-slate-700">Subscription Plan</label>
                      <div className="grid grid-cols-3 gap-3 mt-1">
                        {['STARTER', 'PRO', 'ENTERPRISE'].map(plan => (
                          <div 
                            key={plan}
                            onClick={() => setNewSchoolData({...newSchoolData, plan})}
                            className={clsx(
                              'border rounded-xl p-3 text-center cursor-pointer transition-all',
                              newSchoolData.plan === plan ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600' : 'border-slate-200 hover:border-slate-300'
                            )}
                          >
                            <div className="text-xs font-bold text-slate-700">{plan}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-8 px-4">
                    <div className="space-y-6 max-w-xs mx-auto">
                      
                      <div className="flex items-center gap-4">
                        <div className={clsx("w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors", provisionStep >= 1 ? "border-emerald-500 bg-emerald-50 text-emerald-500" : provisionStep === 0 ? "border-indigo-500 text-indigo-500" : "border-slate-200 text-slate-300")}>
                          {provisionStep >= 1 ? <Check size={16} /> : provisionStep === 0 ? <Loader2 size={16} className="animate-spin" /> : <Database size={16} />}
                        </div>
                        <div className={clsx("text-sm font-semibold", provisionStep >= 1 ? "text-slate-800" : provisionStep === 0 ? "text-indigo-700" : "text-slate-400")}>
                          Initialize Database Schema
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className={clsx("w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors", provisionStep >= 2 ? "border-emerald-500 bg-emerald-50 text-emerald-500" : provisionStep === 1 ? "border-indigo-500 text-indigo-500" : "border-slate-200 text-slate-300")}>
                          {provisionStep >= 2 ? <Check size={16} /> : provisionStep === 1 ? <Loader2 size={16} className="animate-spin" /> : <Globe size={16} />}
                        </div>
                        <div className={clsx("text-sm font-semibold", provisionStep >= 2 ? "text-slate-800" : provisionStep === 1 ? "text-indigo-700" : "text-slate-400")}>
                          Configure Sub-domain Routing
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className={clsx("w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors", provisionStep >= 3 ? "border-emerald-500 bg-emerald-50 text-emerald-500" : provisionStep === 2 ? "border-indigo-500 text-indigo-500" : "border-slate-200 text-slate-300")}>
                          {provisionStep >= 3 ? <Check size={16} /> : provisionStep === 2 ? <Loader2 size={16} className="animate-spin" /> : <Users size={16} />}
                        </div>
                        <div className={clsx("text-sm font-semibold", provisionStep >= 3 ? "text-slate-800" : provisionStep === 2 ? "text-indigo-700" : "text-slate-400")}>
                          Setup Admin Account
                        </div>
                      </div>

                    </div>
                  </div>
                )}
              </div>

              <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                {provisionPhase === 'idle' ? (
                  <>
                    <button onClick={() => setIsProvisionOpen(false)} className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-200">Cancel</button>
                    <button 
                      onClick={handleStartProvisioning}
                      className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 flex items-center gap-2">
                      <Play size={16} /> Start Provisioning
                    </button>
                  </>
                ) : provisionPhase === 'success' ? (
                  <button 
                    onClick={() => setIsProvisionOpen(false)}
                    className="px-5 py-2 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700">
                    Done
                  </button>
                ) : null}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. Billing Slide-over */}
      <AnimatePresence>
        {billingTenant && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setBillingTenant(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: '100%' }} 
              animate={{ x: 0 }} 
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md h-full bg-white shadow-2xl border-l border-slate-200 flex flex-col z-10"
            >
              <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50">
                <div>
                  <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <CreditCard className="text-indigo-600" /> Billing Details
                  </h2>
                  <p className="text-sm font-medium text-slate-500 mt-1">{billingTenant.name}</p>
                </div>
                <button onClick={() => setBillingTenant(null)} className="p-2 text-slate-400 hover:bg-slate-200 rounded-full transition-colors"><X size={20} /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-lg">
                  <div className="text-indigo-100 text-sm font-medium mb-1">Current MRR</div>
                  <div className="text-4xl font-black mb-4">${billingTenant.mrr.toLocaleString()}<span className="text-lg text-indigo-200 font-medium">/mo</span></div>
                  <div className="flex items-center gap-2 text-sm bg-black/20 w-fit px-3 py-1 rounded-full">
                    <span className="uppercase font-bold tracking-wider">{billingTenant.plan} PLAN</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Activity size={16} /> Usage Metrics
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <div className="space-y-1">
                        <div className="text-sm font-semibold text-slate-700">Active Students</div>
                        <div className="text-xs text-slate-500">Billed at $1/student/mo above limit</div>
                      </div>
                      <div className="text-lg font-bold text-slate-800">{billingTenant.students.toLocaleString()}</div>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${Math.min((billingTenant.students / 5000) * 100, 100)}%` }} />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Calendar size={16} /> Recent Invoices
                  </h3>
                  <div className="space-y-3">
                    {[
                      { date: 'Sep 1, 2026', amount: billingTenant.mrr, status: 'Paid', id: 'INV-2026-09' },
                      { date: 'Aug 1, 2026', amount: billingTenant.mrr, status: 'Paid', id: 'INV-2026-08' },
                      { date: 'Jul 1, 2026', amount: billingTenant.mrr, status: 'Paid', id: 'INV-2026-07' },
                    ].map((inv) => (
                      <div key={inv.id} className="flex items-center justify-between p-3 border border-slate-100 rounded-xl hover:border-indigo-200 hover:bg-indigo-50 cursor-pointer transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                            <FileText size={18} />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-slate-800">{inv.date}</div>
                            <div className="text-xs text-slate-500">{inv.id}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-slate-800">${inv.amount.toLocaleString()}</div>
                          <div className="text-xs text-emerald-600 font-medium flex items-center justify-end gap-1"><CheckCircle size={10} /> {inv.status}</div>
                        </div>
                        <button className="text-slate-400 hover:text-indigo-600 ml-2"><Download size={16} /></button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              <div className="p-5 border-t border-slate-100 bg-white">
                <button className="w-full py-3 rounded-xl border-2 border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-colors">
                  Manage Stripe Subscription
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. Impersonate Confirmation Dialog */}
      <AnimatePresence>
        {impersonateTenant && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-sm overflow-hidden flex flex-col p-6 text-center"
            >
              <div className="mx-auto w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-4">
                <ShieldAlert size={32} />
              </div>
              <h3 className="font-bold text-xl text-slate-800 mb-2">Impersonate Admin?</h3>
              <p className="text-sm text-slate-500 mb-6">
                You are about to switch context and log in as a System Administrator for <strong>{impersonateTenant.name}</strong>. All actions will be audited.
              </p>
              
              <div className="flex gap-3 w-full">
                <button 
                  onClick={() => setImpersonateTenant(null)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">
                  Cancel
                </button>
                <button 
                  onClick={handleImpersonateConfirm}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-white text-sm font-semibold hover:bg-slate-900 transition-colors">
                  Confirm
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
