import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Radio, Mic, Users, Brain, 
  ArrowRight, ShieldCheck, Activity, CheckCircle2 
} from 'lucide-react';
import { useAgentStore } from '../../store/agentStore';
import { AgentAvatar } from '../../components/AgentAvatar';

export const TeacherAgentDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { teacherPersona, stream, studentConfigs, digitalTwinConsent } = useAgentStore();

  return (
    <div className="space-y-6 pb-8 text-slate-800">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-50 via-white to-blue-50 border border-indigo-100 p-8 shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <AgentAvatar
              name={teacherPersona.name}
              avatarChar="👨‍🏫"
              voiceState={stream.voiceState}
              detectedEmotion="focused"
              size="lg"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-indigo-100 text-indigo-700 border border-indigo-200 font-semibold">
                  ASTRA MULTIMODAL ACTIVE
                </span>
                <span className="text-xs text-slate-500 font-medium">English & தமிழ் Dual Mode</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 mt-1">
                Welcome Dr. Priya! Your Co-Pilot <span className="text-indigo-600">Guru AI</span> is Synchronized.
              </h1>
              <p className="text-sm text-slate-600 max-w-xl mt-1">
                Transform your lectures with live AI board generation, real-time student emotion monitoring, and automated student tutor alignment.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/agents/teacher/teach')}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-md shadow-indigo-600/20 flex items-center gap-2 transition"
            >
              <Radio className="w-4 h-4 animate-pulse text-white" />
              <span>Launch Live Canvas</span>
            </button>
            <button
              onClick={() => navigate('/agents/teacher/student-agents')}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-medium text-sm shadow-sm transition"
            >
              Manage Student Tutors
            </button>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Real-Time Operational Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2 font-medium">
            <span>STUDENT AGENTS ACTIVE</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">32 / 34</div>
          <p className="text-[11px] text-emerald-600 mt-1 font-medium">94% engagement rate today</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2 font-medium">
            <span>ASTRA EMOTION RADAR</span>
            <Activity className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-indigo-700">82% High Focus</div>
          <p className="text-[11px] text-slate-500 mt-1">4 students flagged for confusion</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2 font-medium">
            <span>DIGITAL TWIN STATUS</span>
            <ShieldCheck className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-purple-700">
            {digitalTwinConsent.hasConsented ? 'Authorized' : 'Pending Consent'}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Substitute avatar & after-hours</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2 font-medium">
            <span>ACOUSTIC LATENCY</span>
            <Mic className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-600">{stream.latencyMs} ms</div>
          <p className="text-[11px] text-slate-500 mt-1">WebSocket Astra duplex stream</p>
        </div>
      </div>

      {/* Classroom Insights & Quick Launcher */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: AI Insights Feed */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <Brain className="w-5 h-5 text-indigo-600" />
              <span>Guru AI Pedagogical Intelligence & Flags</span>
            </h2>
            <span className="text-xs text-slate-400">Updated 2m ago</span>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 shrink-0 animate-ping" />
              <div>
                <h4 className="text-xs font-semibold text-amber-900">
                  Concept Struggle Detected in Section A
                </h4>
                <p className="text-xs text-slate-700 mt-1">
                  Vidya AI noted 6 students struggled with factoring negative discriminant quadratics yesterday night. Guru AI recommends launching the interactive Visual Parabola simulation today.
                </p>
                <button 
                  onClick={() => navigate('/agents/teacher/teach')}
                  className="mt-2 text-xs text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
                >
                  Load Parabola Simulation to Canvas <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <h4 className="text-xs font-semibold text-emerald-900">
                  Student Breakthrough: Arjun Patel (Grade 8)
                </h4>
                <p className="text-xs text-slate-700 mt-1">
                  Arjun reached a "Eureka" milestone during after-hours Socratic conversation with Vidya AI. He successfully resolved projectile launch angles.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Student Agent Alignment Panel */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            <span>Active Student Tutors</span>
          </h2>
          <p className="text-xs text-slate-500">
            Control the knowledge bounds, Socratic rigor, and after-hours availability for student agents.
          </p>

          <div className="space-y-2.5">
            {studentConfigs.map((cfg) => (
              <div key={cfg.studentId} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-xs text-slate-800">{cfg.studentName}</div>
                  <div className="text-[10px] text-slate-500">
                    {cfg.grade} - Sec {cfg.section} • {cfg.teachingStyle.toUpperCase()}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono text-indigo-600 font-semibold">
                    {cfg.currentStreakDays}d streak 🔥
                  </span>
                  <div className="text-[10px] text-slate-400 font-medium">{cfg.totalXp} XP</div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate('/agents/teacher/student-agents')}
            className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold border border-slate-300 transition"
          >
            Open Student Control Matrix
          </button>
        </div>
      </div>
    </div>
  );
};
