import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MessageSquare, Mail, Bell, Smartphone, Send, Clock, Edit3, 
  Users, AlertCircle, CheckCircle, Search, Filter, Hash, MoreVertical,
  Paperclip, Image as ImageIcon
} from 'lucide-react';
import clsx from 'clsx';
import toast from 'react-hot-toast';

// ── Types ──────────────────────────────────────────────────
type Channel = 'WHATSAPP' | 'SMS' | 'EMAIL' | 'PUSH';
type Audience = 'ALL_PARENTS' | 'ALL_STAFF' | 'SPECIFIC_GRADE' | 'SPECIFIC_CLASS';

interface Campaign {
  id: string;
  title: string;
  channels: Channel[];
  audience: Audience;
  status: 'DRAFT' | 'SCHEDULED' | 'SENT';
  sentAt?: string;
  delivered: number;
  read: number;
  total: number;
}

const CAMPAIGNS: Campaign[] = [
  { id: 'CAMP-001', title: 'Term 2 Fee Reminder', channels: ['WHATSAPP', 'EMAIL', 'SMS'], audience: 'ALL_PARENTS', status: 'SENT', sentAt: 'Today, 10:00 AM', delivered: 1145, read: 980, total: 1150 },
  { id: 'CAMP-002', title: 'Heavy Rain Holiday Notice', channels: ['WHATSAPP', 'PUSH', 'SMS'], audience: 'ALL_PARENTS', status: 'SENT', sentAt: 'Yesterday, 8:00 PM', delivered: 1150, read: 1142, total: 1150 },
  { id: 'CAMP-003', title: 'Staff Meeting Agenda', channels: ['EMAIL', 'PUSH'], audience: 'ALL_STAFF', status: 'SENT', sentAt: 'Aug 1, 4:00 PM', delivered: 85, read: 85, total: 85 },
];

// ── Component ──────────────────────────────────────────────
export const OmnichannelHub = () => {
  const [selectedChannels, setSelectedChannels] = useState<Set<Channel>>(new Set(['WHATSAPP']));
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const toggleChannel = (c: Channel) => {
    const next = new Set(selectedChannels);
    if (next.has(c)) next.delete(c);
    else next.add(c);
    setSelectedChannels(next);
  };

  const handleSend = () => {
    if (!message.trim() || selectedChannels.size === 0) return;
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      toast.success('Campaign dispatched across all selected channels!');
      setMessage('');
    }, 2000);
  };

  const ChannelIcon = ({ type, size = 16, active = false }: { type: Channel; size?: number; active?: boolean }) => {
    const base = active ? 'text-white' : 'text-slate-500';
    switch (type) {
      case 'WHATSAPP': return <MessageSquare size={size} className={active ? 'text-white' : 'text-emerald-500'} />;
      case 'SMS': return <Smartphone size={size} className={active ? 'text-white' : 'text-blue-500'} />;
      case 'EMAIL': return <Mail size={size} className={active ? 'text-white' : 'text-amber-500'} />;
      case 'PUSH': return <Bell size={size} className={active ? 'text-white' : 'text-purple-500'} />;
    }
  };

  const getChannelColor = (type: Channel) => {
    switch (type) {
      case 'WHATSAPP': return 'bg-emerald-500 hover:bg-emerald-600 border-emerald-600';
      case 'SMS': return 'bg-blue-500 hover:bg-blue-600 border-blue-600';
      case 'EMAIL': return 'bg-amber-500 hover:bg-amber-600 border-amber-600';
      case 'PUSH': return 'bg-purple-500 hover:bg-purple-600 border-purple-600';
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4 max-w-7xl mx-auto h-[calc(100vh-6rem)]">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Omnichannel Communication Hub</h1>
        <p className="text-sm text-slate-500 mt-0.5">Unified broadcast engine for WhatsApp, SMS, Email, and Push Notifications.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        
        {/* Composer Panel */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <h2 className="font-bold text-slate-700 flex items-center gap-2"><Edit3 size={18} /> New Broadcast</h2>
            <button className="text-sm text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1">
              <Hash size={14} /> Use Template
            </button>
          </div>
          
          <div className="p-6 flex-1 overflow-y-auto space-y-6">
            
            {/* Audience */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Select Audience</label>
              <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                <option>All Parents (1,150 recipients)</option>
                <option>All Staff (85 recipients)</option>
                <option>Grade 8 Parents (120 recipients)</option>
                <option>Custom Selection...</option>
              </select>
            </div>

            {/* Channels */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Broadcast Channels (Select multiple)</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(['WHATSAPP', 'SMS', 'EMAIL', 'PUSH'] as Channel[]).map(c => (
                  <button
                    key={c}
                    onClick={() => toggleChannel(c)}
                    className={clsx(
                      'px-3 py-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all',
                      selectedChannels.has(c) ? getChannelColor(c) + ' text-white shadow-md' : 'border-slate-100 bg-white hover:border-slate-200'
                    )}
                  >
                    <ChannelIcon type={c} size={24} active={selectedChannels.has(c)} />
                    <span className={clsx('text-xs font-bold', selectedChannels.has(c) ? 'text-white' : 'text-slate-600')}>{c}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Message Body */}
            <div className="space-y-2 flex-1 flex flex-col">
              <label className="text-sm font-semibold text-slate-700 flex items-center justify-between">
                Message Content
                <span className="text-xs font-normal text-slate-400">Supports markdown and variables</span>
              </label>
              <div className="flex-1 border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all flex flex-col">
                <textarea 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message here... Use {student_name} or {fee_amount} for dynamic insertion."
                  className="w-full flex-1 p-4 text-sm focus:outline-none resize-none min-h-[150px]"
                />
                <div className="bg-slate-50 px-4 py-2 border-t border-slate-200 flex items-center gap-3">
                  <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"><Paperclip size={16} /></button>
                  <button className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"><ImageIcon size={16} /></button>
                  <span className="text-xs text-slate-400 ml-auto">{message.length} chars</span>
                </div>
              </div>
            </div>

          </div>

          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
            <button className="px-4 py-2 text-slate-600 text-sm font-medium hover:bg-slate-200 rounded-xl transition-colors">Save Draft</button>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors">
                <Clock size={16} /> Schedule
              </button>
              <button 
                onClick={handleSend}
                disabled={isSending || selectedChannels.size === 0 || !message.trim()}
                className="flex items-center gap-2 px-6 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 shadow-md transition-all disabled:opacity-50"
              >
                {isSending ? <><Clock size={16} className="animate-spin" /> Sending...</> : <><Send size={16} /> Send Now</>}
              </button>
            </div>
          </div>
        </div>

        {/* History / Preview Panel */}
        <div className="lg:col-span-5 flex flex-col gap-6 min-h-0">
          
          {/* Live Preview Container (Only if WhatsApp/SMS is selected) */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 flex flex-col items-center justify-center relative overflow-hidden min-h-[250px]">
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }} />
            
            <div className="w-[280px] bg-white rounded-3xl shadow-xl border-4 border-slate-800 h-[300px] overflow-hidden flex flex-col relative z-10">
              <div className="bg-[#075e54] text-white px-4 py-2 text-xs font-semibold flex justify-between items-center">
                <span>School ERP</span>
                <div className="flex gap-1"><span className="w-1.5 h-1.5 rounded-full bg-white/50"/><span className="w-1.5 h-1.5 rounded-full bg-white/50"/><span className="w-1.5 h-1.5 rounded-full bg-white/50"/></div>
              </div>
              <div className="flex-1 bg-[#ece5dd] p-3 overflow-y-auto">
                {message ? (
                  <div className="bg-[#dcf8c6] p-2 rounded-lg text-sm text-slate-800 shadow-sm whitespace-pre-wrap max-w-[90%] ml-auto relative">
                    {message}
                    <div className="text-[9px] text-right text-slate-500 mt-1">10:42 AM <CheckCircle size={10} className="inline text-blue-500" /></div>
                  </div>
                ) : (
                  <div className="text-center text-xs text-slate-400 mt-10">Message preview will appear here.</div>
                )}
              </div>
            </div>
          </div>

          {/* Campaign History */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex-1 flex flex-col min-h-0">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-700">Recent Campaigns</h3>
              <Search size={16} className="text-slate-400" />
            </div>
            <div className="p-2 space-y-1 overflow-y-auto flex-1">
              {CAMPAIGNS.map(camp => (
                <div key={camp.id} className="p-3 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors border border-transparent hover:border-slate-100">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-semibold text-slate-800 text-sm truncate pr-4">{camp.title}</div>
                    <div className="flex gap-1">
                      {camp.channels.map(c => <ChannelIcon key={c} type={c} size={12} />)}
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-xs text-slate-500">
                    <div>{camp.sentAt}</div>
                    <div className="flex items-center gap-1 font-medium text-emerald-600">
                      <CheckCircle size={12} /> {Math.round((camp.read / camp.total) * 100)}% Read
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};
