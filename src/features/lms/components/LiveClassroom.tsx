import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Video, Mic, MicOff, Camera, CameraOff, Monitor,
  MessageSquare, Users, Hand, Phone, Settings, Maximize,
  Send, Clock, BookOpen, ChevronRight, Wifi, Volume2,
  Share2, MoreVertical, Smile, FileText, Download
} from 'lucide-react';
import clsx from 'clsx';
import toast from 'react-hot-toast';

// ── Types ──────────────────────────────────────────────────
interface Participant {
  id: string;
  name: string;
  avatar: string;
  role: 'teacher' | 'student';
  isMuted: boolean;
  isCameraOn: boolean;
  isHandRaised: boolean;
}

interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  time: string;
  isTeacher: boolean;
}

// ── Mock Data ──────────────────────────────────────────────
const PARTICIPANTS: Participant[] = [
  { id: 'p-1', name: 'Dr. Priya Sharma', avatar: '👩‍🏫', role: 'teacher', isMuted: false, isCameraOn: true, isHandRaised: false },
  { id: 'p-2', name: 'Arjun Patel', avatar: '👦', role: 'student', isMuted: true, isCameraOn: true, isHandRaised: false },
  { id: 'p-3', name: 'Fatima Ali', avatar: '👧', role: 'student', isMuted: true, isCameraOn: false, isHandRaised: true },
  { id: 'p-4', name: 'Rohit Sharma', avatar: '👦', role: 'student', isMuted: true, isCameraOn: true, isHandRaised: false },
  { id: 'p-5', name: 'Sneha Gupta', avatar: '👧', role: 'student', isMuted: true, isCameraOn: true, isHandRaised: false },
  { id: 'p-6', name: 'Vikram Singh', avatar: '👦', role: 'student', isMuted: true, isCameraOn: false, isHandRaised: false },
  { id: 'p-7', name: 'Ananya Reddy', avatar: '👧', role: 'student', isMuted: true, isCameraOn: true, isHandRaised: true },
  { id: 'p-8', name: 'Karan Mehta', avatar: '👦', role: 'student', isMuted: true, isCameraOn: false, isHandRaised: false },
];

const INITIAL_MESSAGES: ChatMessage[] = [
  { id: 'c-1', sender: 'Dr. Priya Sharma', text: 'Good morning everyone! Today we\'ll be covering quadratic equations.', time: '10:00 AM', isTeacher: true },
  { id: 'c-2', sender: 'Arjun Patel', text: 'Good morning ma\'am! 🙏', time: '10:01 AM', isTeacher: false },
  { id: 'c-3', sender: 'Fatima Ali', text: 'Ma\'am, will we have a quiz on this?', time: '10:02 AM', isTeacher: false },
  { id: 'c-4', sender: 'Dr. Priya Sharma', text: 'Yes, there will be a short quiz at the end. Please pay attention to the derivation steps.', time: '10:03 AM', isTeacher: true },
];

// ── Component ──────────────────────────────────────────────
export const LiveClassroom = () => {
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [showParticipants, setShowParticipants] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [newMessage, setNewMessage] = useState('');
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isHandRaised, setIsHandRaised] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setElapsedTime(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    setMessages(prev => [...prev, {
      id: `c-${Date.now()}`,
      sender: 'You (Teacher)',
      text: newMessage.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isTeacher: true,
    }]);
    setNewMessage('');
  };

  const handleEndClass = () => {
    toast.success('Class ended. Recording saved successfully!');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] bg-slate-900 rounded-xl overflow-hidden">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-800/50 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-sm font-medium text-red-400">LIVE</span>
          </div>
          <div className="h-4 w-px bg-slate-600" />
          <div>
            <span className="text-sm font-medium text-white">Mathematics — Quadratic Equations</span>
            <span className="text-xs text-slate-400 ml-3">Grade 10-A</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-sm text-slate-400">
            <Clock size={14} />
            <span className="font-mono">{formatTime(elapsedTime)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-slate-400">
            <Users size={14} />
            <span>{PARTICIPANTS.length}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-emerald-400">
            <Wifi size={14} />
            <span>Good</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Video Area */}
        <div className="flex-1 flex flex-col p-4 gap-4">
          {/* Main Video */}
          <div className="flex-1 relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden border border-slate-700/50">
            {isScreenSharing ? (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
                <div className="text-center">
                  <Monitor size={64} className="mx-auto text-blue-400 mb-4" />
                  <div className="text-lg font-medium text-white">Screen Sharing Active</div>
                  <div className="text-sm text-slate-400 mt-1">Showing: Quadratic_Equations.pdf</div>
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <span className="text-8xl">👩‍🏫</span>
                  <div className="mt-4 text-lg font-medium text-white">Dr. Priya Sharma</div>
                  <div className="text-sm text-slate-400">Mathematics Department</div>
                </div>
              </div>
            )}
            {/* Recording Badge */}
            <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-500/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs font-medium text-red-300">Recording</span>
            </div>
            {/* Speaker name */}
            <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-lg">
              <span className="text-sm text-white font-medium">Dr. Priya Sharma</span>
            </div>
          </div>

          {/* Participant Thumbnails */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {PARTICIPANTS.filter(p => p.role === 'student').map(p => (
              <div
                key={p.id}
                className={clsx(
                  'relative w-28 h-20 rounded-xl flex-shrink-0 flex items-center justify-center border transition-all',
                  p.isHandRaised
                    ? 'bg-amber-900/30 border-amber-500/50'
                    : 'bg-slate-800 border-slate-700/50'
                )}
              >
                {p.isCameraOn ? (
                  <span className="text-2xl">{p.avatar}</span>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-sm text-white font-medium">
                    {p.name.charAt(0)}
                  </div>
                )}
                <div className="absolute bottom-1 left-1 right-1 flex items-center justify-between">
                  <span className="text-[10px] text-white bg-black/50 px-1.5 py-0.5 rounded truncate max-w-[80px]">
                    {p.name.split(' ')[0]}
                  </span>
                  {p.isMuted && <MicOff size={10} className="text-red-400" />}
                </div>
                {p.isHandRaised && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center text-[10px]">
                    ✋
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Side Panel (Chat or Participants) */}
        {(showChat || showParticipants) && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 320, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="w-80 border-l border-slate-700/50 flex flex-col bg-slate-800/30"
          >
            {/* Panel Tabs */}
            <div className="flex border-b border-slate-700/50">
              <button
                onClick={() => { setShowChat(true); setShowParticipants(false); }}
                className={clsx(
                  'flex-1 py-3 text-sm font-medium transition-colors',
                  showChat ? 'text-white border-b-2 border-indigo-500' : 'text-slate-400 hover:text-slate-300'
                )}
              >
                <MessageSquare size={14} className="inline mr-1.5" /> Chat
              </button>
              <button
                onClick={() => { setShowParticipants(true); setShowChat(false); }}
                className={clsx(
                  'flex-1 py-3 text-sm font-medium transition-colors',
                  showParticipants ? 'text-white border-b-2 border-indigo-500' : 'text-slate-400 hover:text-slate-300'
                )}
              >
                <Users size={14} className="inline mr-1.5" /> People ({PARTICIPANTS.length})
              </button>
            </div>

            {/* Chat */}
            {showChat && (
              <>
                <div className="flex-1 overflow-y-auto p-3 space-y-3">
                  {messages.map(msg => (
                    <div key={msg.id} className="flex gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className={clsx(
                            'text-xs font-medium',
                            msg.isTeacher ? 'text-indigo-400' : 'text-slate-300'
                          )}>
                            {msg.sender}
                          </span>
                          <span className="text-[10px] text-slate-500">{msg.time}</span>
                        </div>
                        <p className="text-sm text-slate-300 mt-0.5">{msg.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-slate-700/50">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={e => setNewMessage(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type a message..."
                      className="flex-1 bg-slate-700/50 text-white placeholder-slate-500 text-sm px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <button
                      onClick={handleSendMessage}
                      className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      <Send size={14} />
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Participants */}
            {showParticipants && (
              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {PARTICIPANTS.map(p => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-700/30 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{p.avatar}</span>
                      <div>
                        <div className="text-sm text-white font-medium flex items-center gap-1.5">
                          {p.name}
                          {p.role === 'teacher' && (
                            <span className="text-[9px] px-1.5 py-0.5 bg-indigo-500/30 text-indigo-300 rounded-full">Host</span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 capitalize">{p.role}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {p.isHandRaised && <Hand size={14} className="text-amber-400" />}
                      {p.isMuted ? <MicOff size={14} className="text-red-400" /> : <Mic size={14} className="text-emerald-400" />}
                      {p.isCameraOn ? <Camera size={14} className="text-emerald-400" /> : <CameraOff size={14} className="text-red-400" />}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="flex items-center justify-between px-6 py-4 bg-slate-800/50 border-t border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="text-sm text-slate-400">{formatTime(elapsedTime)}</div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMicOn(!isMicOn)}
            className={clsx(
              'p-3 rounded-xl transition-all',
              isMicOn ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-red-500 text-white'
            )}
          >
            {isMicOn ? <Mic size={18} /> : <MicOff size={18} />}
          </button>
          <button
            onClick={() => setIsCamOn(!isCamOn)}
            className={clsx(
              'p-3 rounded-xl transition-all',
              isCamOn ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-red-500 text-white'
            )}
          >
            {isCamOn ? <Camera size={18} /> : <CameraOff size={18} />}
          </button>
          <button
            onClick={() => { setIsScreenSharing(!isScreenSharing); toast.success(isScreenSharing ? 'Screen sharing stopped' : 'Screen sharing started'); }}
            className={clsx(
              'p-3 rounded-xl transition-all',
              isScreenSharing ? 'bg-blue-500 text-white' : 'bg-slate-700 text-white hover:bg-slate-600'
            )}
          >
            <Monitor size={18} />
          </button>
          <button
            onClick={() => { setIsHandRaised(!isHandRaised); toast.success(isHandRaised ? 'Hand lowered' : 'Hand raised'); }}
            className={clsx(
              'p-3 rounded-xl transition-all',
              isHandRaised ? 'bg-amber-500 text-white' : 'bg-slate-700 text-white hover:bg-slate-600'
            )}
          >
            <Hand size={18} />
          </button>
          <div className="w-px h-8 bg-slate-600 mx-1" />
          <button
            onClick={() => { setShowChat(!showChat); if (!showChat) setShowParticipants(false); }}
            className={clsx(
              'p-3 rounded-xl transition-all',
              showChat ? 'bg-indigo-500 text-white' : 'bg-slate-700 text-white hover:bg-slate-600'
            )}
          >
            <MessageSquare size={18} />
          </button>
          <button
            onClick={() => { setShowParticipants(!showParticipants); if (!showParticipants) setShowChat(false); }}
            className={clsx(
              'p-3 rounded-xl transition-all',
              showParticipants ? 'bg-indigo-500 text-white' : 'bg-slate-700 text-white hover:bg-slate-600'
            )}
          >
            <Users size={18} />
          </button>
        </div>

        <div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleEndClass}
            className="px-5 py-2.5 bg-red-500 text-white rounded-xl text-sm font-medium hover:bg-red-600 transition-colors flex items-center gap-2"
          >
            <Phone size={15} className="rotate-[135deg]" /> End Class
          </motion.button>
        </div>
      </div>
    </div>
  );
};
