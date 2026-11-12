import React, { useState } from 'react';
import { 
  Users, Sliders, Shield, Clock, Moon, 
  Check, AlertTriangle, Sparkles, Brain, CheckCircle2 
} from 'lucide-react';
import { useAgentStore } from '../../store/agentStore';
import toast from 'react-hot-toast';

export const StudentAgentControlPanel: React.FC = () => {
  const { studentConfigs, digitalTwinConsent, setDigitalTwinConsent } = useAgentStore();
  const [isConsentModalOpen, setIsConsentModalOpen] = useState(false);

  const handleToggleConsent = () => {
    setDigitalTwinConsent({
      hasConsented: !digitalTwinConsent.hasConsented,
      consentTimestamp: !digitalTwinConsent.hasConsented ? new Date().toISOString() : undefined,
    });
    toast.success(
      !digitalTwinConsent.hasConsented
        ? 'Digital Twin Consent Recorded: Authorized for substitute sessions & after-hours Q&A.'
        : 'Digital Twin Access Revoked.'
    );
    setIsConsentModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-8 text-slate-800">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-wider bg-purple-50 text-purple-700 px-2 py-0.5 rounded border border-purple-200 font-semibold">
              TEACHER CONTROL MATRIX
            </span>
            <span className="text-xs text-slate-500 font-medium">Section 8-A Fleet</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-1">Student Agent Orchestration & Digital Twin</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure Socratic rigor, after-hours study companion access, and authorized avatar substitute models.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsConsentModalOpen(true)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border transition flex items-center gap-2 ${
              digitalTwinConsent.hasConsented
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-purple-600 hover:bg-purple-500 text-white shadow-sm shadow-purple-600/20'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>{digitalTwinConsent.hasConsented ? 'Digital Twin Authorized' : 'Opt-In: Teacher Digital Twin'}</span>
          </button>
        </div>
      </div>

      {/* Digital Twin Consent Modal */}
      {isConsentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 rounded-2xl bg-white border border-purple-200 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-purple-600">
              <Shield className="w-6 h-6" />
              <h3 className="text-lg font-bold text-slate-900">Teacher Digital Twin Authorization</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              By authorizing your Digital Twin, Astra Neural Voice and appearance will be granted permission to act as an automated substitute during unforeseen leaves and answer student homework inquiries after school hours.
            </p>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1 text-slate-600 font-mono">
              <div>• Model: {digitalTwinConsent.avatarVoiceModel}</div>
              <div>• Max Daily Substitute Hours: {digitalTwinConsent.maxDailyTwinSessions} hrs</div>
              <div>• Audit: All student interactions logged with transcription</div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setIsConsentModalOpen(false)}
                className="px-4 py-2 text-xs text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                onClick={handleToggleConsent}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold shadow-sm"
              >
                {digitalTwinConsent.hasConsented ? 'Revoke Consent' : 'I Authorize Digital Twin'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Student Agent Fleet Configurations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {studentConfigs.map((cfg) => (
          <div key={cfg.studentId} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-sm text-slate-900">{cfg.studentName}</h3>
                <span className="text-[11px] text-slate-500">{cfg.grade} - Section {cfg.section}</span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 font-mono font-medium">
                TUTOR: {cfg.personaName}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-600 flex items-center gap-1.5">
                  <Brain className="w-3.5 h-3.5 text-indigo-600" /> Socratic Rigor
                </span>
                <span className="font-semibold text-indigo-700 uppercase">{cfg.teachingStyle}</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-600 flex items-center gap-1.5">
                  <Moon className="w-3.5 h-3.5 text-purple-600" /> 24/7 After-Hours Companion
                </span>
                <span className="font-semibold text-emerald-600">
                  {cfg.allowAfterHours ? 'Active (Homework Mode)' : 'Disabled'}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-600 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-600" /> Daily Voice Limit
                </span>
                <span className="font-semibold text-slate-800">{cfg.dailyVoiceMinutesLimit} mins / day</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button 
                onClick={() => toast.success(`Updated pedagogical settings for ${cfg.studentName}`)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium border border-slate-200 transition"
              >
                Adjust Parameters
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
