import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Send, User, MoreVertical, Paperclip } from 'lucide-react';

export const Messages = () => {
  const [contacts, setContacts] = useState([
    { 
      id: 1, name: 'Eleanor Pena', role: 'Teacher', unread: 2, online: true, 
      messages: [
        { id: 1, sender: 'Eleanor Pena', text: 'Hello, could you please send me the updated curriculum for Grade 10 Mathematics?', time: '09:41 AM', isMine: false },
        { id: 2, sender: 'Me', text: 'Hi Eleanor, sure! I will attach it here in a moment.', time: '09:45 AM', isMine: true }
      ]
    },
    { 
      id: 2, name: 'Wade Warren', role: 'Parent', unread: 0, online: false, 
      messages: [
        { id: 1, sender: 'Wade Warren', text: 'When is the next parent-teacher meeting?', time: 'Yesterday', isMine: false }
      ]
    },
    { 
      id: 3, name: 'Brooklyn Simmons', role: 'Admin', unread: 1, online: true, 
      messages: [
        { id: 1, sender: 'Brooklyn Simmons', text: 'Please review the new admission policies.', time: '10:00 AM', isMine: false }
      ]
    },
  ]);

  const [activeContactId, setActiveContactId] = useState(1);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const activeContact = contacts.find(c => c.id === activeContactId) || contacts[0];
  const filteredContacts = contacts.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleContactClick = (id: number) => {
    setActiveContactId(id);
    setContacts(prev => prev.map(c => c.id === id ? { ...c, unread: 0 } : c));
  };

  const handleSendMessage = () => {
    if (!messageText.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: 'Me',
      text: messageText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMine: true
    };

    setContacts(prev => prev.map(c => {
      if (c.id === activeContactId) {
        return { ...c, messages: [...c.messages, newMessage] };
      }
      return c;
    }));
    setMessageText('');
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 w-full h-[calc(100vh-80px)]">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm h-full flex overflow-hidden">
        
        {/* Sidebar */}
        <div className="w-full sm:w-80 border-r border-slate-100 flex flex-col bg-slate-50/50">
          <div className="p-4 border-b border-slate-100">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
            {filteredContacts.map((contact) => (
              <div 
                key={contact.id} 
                onClick={() => handleContactClick(contact.id)}
                className={`p-3 rounded-xl flex items-center justify-between cursor-pointer transition-colors ${activeContactId === contact.id ? 'bg-amber-50' : 'hover:bg-slate-100/70'}`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center text-slate-500">
                      <User size={20} />
                    </div>
                    {contact.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  <div>
                    <h4 className={`text-sm font-semibold ${activeContactId === contact.id ? 'text-amber-900' : 'text-slate-800'}`}>{contact.name}</h4>
                    <p className="text-xs text-slate-500">{contact.role}</p>
                  </div>
                </div>
                {contact.unread > 0 && (
                  <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center text-[10px] font-bold text-white">
                    {contact.unread}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col hidden sm:flex bg-white">
          {/* Chat Header */}
          <div className="h-[70px] border-b border-slate-100 flex items-center justify-between px-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center text-amber-700">
                <User size={20} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-800">{activeContact.name}</h3>
                <p className={`text-xs font-medium ${activeContact.online ? 'text-emerald-600' : 'text-slate-400'}`}>
                  {activeContact.online ? 'Online' : 'Offline'}
                </p>
              </div>
            </div>
            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
              <MoreVertical size={20} />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
            <div className="flex justify-center">
              <span className="text-xs font-medium text-slate-400 bg-slate-100 px-3 py-1 rounded-full">Today</span>
            </div>
            
            {activeContact.messages.map((msg, idx) => (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: idx * 0.05 }}
                className={`flex ${msg.isMine ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`p-3.5 rounded-2xl shadow-sm max-w-[80%] sm:max-w-[60%] ${msg.isMine ? 'bg-amber-500 text-white rounded-tr-none shadow-amber-500/10' : 'bg-white border border-slate-200 rounded-tl-none'}`}>
                  <p className={`text-sm ${msg.isMine ? '' : 'text-slate-700'}`}>{msg.text}</p>
                  <p className={`text-[10px] mt-2 text-right ${msg.isMine ? 'text-amber-100' : 'text-slate-400'}`}>{msg.time}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-slate-100 bg-white">
            <div className="flex items-center gap-3">
              <button className="p-2.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-colors">
                <Paperclip size={20} />
              </button>
              <input
                type="text"
                placeholder="Type your message..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="flex-1 py-3 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button 
                onClick={handleSendMessage}
                className="p-3 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-colors shadow-sm shadow-amber-500/20 disabled:opacity-50"
                disabled={!messageText.trim()}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

