import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, Mic, MicOff, Camera, Send, 
  Flame, Award, Globe, Moon 
} from 'lucide-react';
import { useAgentStore } from '../../store/agentStore';
import { AgentAvatar } from '../../components/AgentAvatar';
import { VoiceWaveform } from '../../components/VoiceWaveform';
import { CameraViewfinder } from '../../components/CameraViewfinder';
import toast from 'react-hot-toast';

export const StudentAgentPortal: React.FC = () => {
  const {
    studentPersona,
    studentChat,
    addStudentMessage,
    stream,
    setVoiceActive,
    setVoiceState,
    setLanguage,
    isCameraViewfinderOpen,
    toggleCameraViewfinder,
  } = useAgentStore();

  const [inputMessage, setInputMessage] = useState('');
  const [isAfterHoursMode, setIsAfterHoursMode] = useState(true);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim()) return;

    // Add user message
    addStudentMessage({
      sender: 'user',
      text: inputMessage,
    });

    const userText = inputMessage;
    setInputMessage('');

    // Simulate Socratic AI tutor response
    setTimeout(() => {
      let reply = "That's a thoughtful question! Let's think about this: if we divide by the coefficient first, what happens to the sign of the constant term?";
      let tamilReply = "மிகச் சிறந்த கேள்வி! மாறிலியின் குறியீடு எவ்வாறு மாறும் என்பதை நாம் சிந்தித்துப் பார்ப்போம்.";

      if (userText.toLowerCase().includes('photo') || userText.toLowerCase().includes('plant')) {
        reply = "Consider where the plant gets the initial energy to split H₂O. Is it from the soil or from solar photons hitting the thylakoid?";
        tamilReply = "தாவரம் நீரை பிரிக்கும் ஆற்றலை எங்கிருந்து பெறுகிறது? மண்ணிலிருந்தா அல்லது சூரிய ஒளியிலிருந்தா?";
      }

      addStudentMessage({
        sender: 'agent',
        personaName: 'Vidya AI',
        text: reply,
        tamilText: tamilReply,
        emotionCue: 'eureka',
      });
    }, 1200);
  };

  const handleToggleVoice = () => {
    const next = !stream.isVoiceActive;
    setVoiceActive(next);
    if (next) {
      setVoiceState('listening');
      toast.success('Vidya Voice Tutor is listening! Speak your doubt in English or Tamil.');
      setTimeout(() => {
        setVoiceState('speaking');
        addStudentMessage({
          sender: 'agent',
          personaName: 'Vidya AI',
          text: "I heard your doubt about finding the roots of the quadratic function. Let's walk through it together step by step.",
          tamilText: "உங்கள் ஐயத்தை நான் கவனித்தேன். வாருங்கள், நாம் ஒன்றாகச் சேர்ந்து படிப்படியாகத் தீர்வு காண்போம்.",
        });
        setTimeout(() => setVoiceState('idle'), 2400);
      }, 1600);
    } else {
      setVoiceState('idle');
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] bg-slate-50 text-slate-800 rounded-2xl overflow-hidden border border-slate-200 shadow-xl">
      {/* Top Banner */}
      <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <AgentAvatar
            name="Vidya AI"
            avatarChar="👩‍🎓"
            voiceState={stream.voiceState}
            detectedEmotion="eureka"
            size="sm"
          />
          <div>
            <h1 className="font-semibold text-sm text-slate-900 flex items-center gap-2">
              Vidya AI • 24/7 Personal Tutor
              {isAfterHoursMode && (
                <span className="text-[10px] bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded-full flex items-center gap-1 font-mono font-medium">
                  <Moon className="w-3 h-3 text-purple-600" /> AFTER-HOURS STUDY MODE
                </span>
              )}
            </h1>
            <p className="text-[11px] text-slate-500">Arjun Patel • Grade 8-A • Controlled by Dr. Priya Sharma</p>
          </div>
        </div>

        {/* Gamification Streak & Language */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-xs font-semibold">
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-bounce" />
            <span>5 Days Streak 🔥</span>
          </div>

          <button
            onClick={() => setLanguage(stream.activeLanguage === 'en' ? 'ta' : 'en')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-700 hover:text-slate-900 font-medium"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{stream.activeLanguage === 'en' ? 'English' : 'தமிழ் (Tamil)'}</span>
          </button>

          <button
            onClick={() => toggleCameraViewfinder()}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
              isCameraViewfinderOpen
                ? 'bg-indigo-50 text-indigo-700 border-indigo-300'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Camera className="w-3.5 h-3.5 text-indigo-600" />
            <span>Doubt Camera</span>
          </button>

          <button
            onClick={handleToggleVoice}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow-sm transition ${
              stream.isVoiceActive
                ? 'bg-rose-50 text-rose-700 border border-rose-200'
                : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-600/20'
            }`}
          >
            {stream.isVoiceActive ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
            <span>{stream.isVoiceActive ? 'Stop Voice' : 'Talk with Vidya'}</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat Feed */}
        <div className="flex-1 p-6 overflow-y-auto flex flex-col justify-between space-y-4 bg-slate-50">
          <div className="space-y-4 max-w-3xl mx-auto w-full">
            {isCameraViewfinderOpen && (
              <div className="mb-4">
                <CameraViewfinder
                  title="Doubt Camera • Scan Homework Steps"
                  subtitle="Photograph your written work for step-by-step Socratic hints"
                />
              </div>
            )}

            {studentChat.map((msg) => {
              const isAgent = msg.sender === 'agent';
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${isAgent ? 'justify-start' : 'justify-end'}`}
                >
                  {isAgent && (
                    <div className="w-8 h-8 rounded-xl bg-purple-100 border border-purple-200 flex items-center justify-center text-sm shrink-0 shadow-sm">
                      👩‍🎓
                    </div>
                  )}

                  <div
                    className={`p-4 rounded-2xl max-w-lg text-xs leading-relaxed space-y-2 shadow-sm ${
                      isAgent
                        ? 'bg-white border border-slate-200 text-slate-800'
                        : 'bg-indigo-600 text-white font-medium shadow-indigo-600/20'
                    }`}
                  >
                    <p>{msg.text}</p>
                    {msg.tamilText && stream.activeLanguage === 'ta' && (
                      <p className="pt-2 border-t border-slate-100 text-purple-700 font-sans font-medium">
                        {msg.tamilText}
                      </p>
                    )}
                    <div className={`text-[9px] text-right font-mono ${isAgent ? 'text-slate-400' : 'text-indigo-200'}`}>
                      {msg.timestamp}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={handleSendMessage}
            className="max-w-3xl mx-auto w-full flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask a doubt or explain what you tried: 'Why is the discriminant negative?'..."
              className="flex-1 bg-transparent px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
            />
            <button
              type="submit"
              className="p-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 shadow-sm transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Right Sidebar: Voice Status & Streaks */}
        <div className="w-72 border-l border-slate-200 bg-white p-4 flex flex-col justify-between hidden md:flex shadow-sm">
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[10px] uppercase font-mono text-slate-500 mb-2 font-medium">
                ASTRA VOICE LINK (TAMIL / EN)
              </div>
              <VoiceWaveform levels={stream.audioLevels} isActive={stream.isVoiceActive} color="indigo" height={32} />
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200 space-y-2">
              <div className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-500" /> Weekly Masteries
              </div>
              <div className="space-y-1 text-[11px] text-slate-600 font-medium">
                <div className="flex justify-between">
                  <span>Quadratic Formula</span>
                  <span className="text-emerald-600 font-semibold">92%</span>
                </div>
                <div className="flex justify-between">
                  <span>Light Reaction Bio</span>
                  <span className="text-amber-600 font-semibold">68%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-[10px] text-slate-400 text-center font-mono">
            CONNECTED TO TEACHER AGENT GURU
          </div>
        </div>
      </div>
    </div>
  );
};
