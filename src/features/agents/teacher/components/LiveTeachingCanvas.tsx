import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, Mic, MicOff, Camera, Layers, 
  HelpCircle, Lightbulb, Users, Zap, Radio 
} from 'lucide-react';
import { useAgentStore } from '../../store/agentStore';
import { AgentAvatar } from '../../components/AgentAvatar';
import { VoiceWaveform } from '../../components/VoiceWaveform';
import { CameraViewfinder } from '../../components/CameraViewfinder';
import { ArtifactRenderer } from '../../components/ArtifactRenderer';
import { TeachingMode } from '../../types/agentTypes';
import toast from 'react-hot-toast';

export const LiveTeachingCanvas: React.FC = () => {
  const {
    stream,
    setVoiceActive,
    setVoiceState,
    activeTeachingMode,
    setTeachingMode,
    currentLessonTopic,
    setCurrentLessonTopic,
    activeArtifacts,
    isGeneratingArtifact,
    triggerLiveContentGeneration,
    isCameraViewfinderOpen,
    toggleCameraViewfinder,
    addTeacherMessage,
  } = useAgentStore();

  const [promptInput, setPromptInput] = useState('');

  const teachingModes: { id: TeachingMode; label: string; icon: React.ElementType }[] = [
    { id: 'notes', label: 'Live Notes', icon: Layers },
    { id: 'quiz', label: 'Instant Quiz', icon: HelpCircle },
    { id: 'curiosity', label: 'Curiosity Engine', icon: Lightbulb },
    { id: 'visual', label: 'Visual Synthesis', icon: Sparkles },
    { id: '3d_world', label: '3D Simulation', icon: Zap },
  ];

  const handleToggleMic = () => {
    const nextState = !stream.isVoiceActive;
    setVoiceActive(nextState);
    if (nextState) {
      setVoiceState('listening');
      toast.success('Astra Voice Active: Guru AI is listening to your lecture.');
      setTimeout(() => {
        setVoiceState('speaking');
        addTeacherMessage({
          sender: 'agent',
          personaName: 'Guru AI',
          text: `Synthesized live derivation for ${currentLessonTopic}. Generating real-time visual notes on the main canvas.`,
          mode: activeTeachingMode,
        });
        setTimeout(() => setVoiceState('idle'), 2500);
      }, 1500);
    } else {
      setVoiceState('idle');
    }
  };

  const handleBroadcast = (artId: string) => {
    toast.success('Broadcasted! Pushed to all 32 connected student agent screens with voice narration.');
  };

  const handleGenerateTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptInput.trim()) return;
    setCurrentLessonTopic(promptInput);
    triggerLiveContentGeneration(promptInput, activeTeachingMode);
    setPromptInput('');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] bg-slate-50 text-slate-900 rounded-2xl overflow-hidden border border-slate-200 shadow-xl">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-red-50 border border-red-200 text-red-600 text-xs font-semibold">
            <Radio className="w-3.5 h-3.5 animate-pulse text-red-500" />
            <span>LIVE TEACHING CANVAS</span>
          </div>
          <div className="h-4 w-px bg-slate-200" />
          <h1 className="font-semibold text-sm text-slate-800">
            {currentLessonTopic}
          </h1>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
          {teachingModes.map((mode) => {
            const Icon = mode.icon;
            const isActive = activeTeachingMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => {
                  setTeachingMode(mode.id);
                  triggerLiveContentGeneration(currentLessonTopic, mode.id);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  isActive
                    ? 'bg-white text-indigo-700 border border-indigo-200 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{mode.label}</span>
              </button>
            );
          })}
        </div>

        {/* Stream Status Indicators */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-700 font-mono bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 font-medium">
            <Users className="w-3.5 h-3.5 text-emerald-600" />
            <span>32 Students Active</span>
          </div>

          <button
            onClick={() => toggleCameraViewfinder()}
            className={`p-2 rounded-xl border transition ${
              isCameraViewfinderOpen
                ? 'bg-indigo-50 text-indigo-700 border-indigo-300'
                : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-slate-50'
            }`}
            title="Toggle Blackboard / Document Scanner"
          >
            <Camera className="w-4 h-4" />
          </button>

          <button
            onClick={handleToggleMic}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold shadow-sm transition ${
              stream.isVoiceActive
                ? 'bg-red-50 text-red-700 border border-red-200'
                : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-500/20'
            }`}
          >
            {stream.isVoiceActive ? <MicOff className="w-4 h-4 text-red-600" /> : <Mic className="w-4 h-4" />}
            <span>{stream.isVoiceActive ? 'Mute Astra Voice' : 'Activate Voice Co-Pilot'}</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: Real-time Canvas Area */}
        <div className="flex-1 p-4 flex flex-col gap-4 overflow-y-auto bg-slate-50">
          {isGeneratingArtifact ? (
            <div className="h-full flex flex-col items-center justify-center bg-white rounded-2xl border border-indigo-200 shadow-sm">
              <Sparkles className="w-8 h-8 text-indigo-600 animate-spin mb-3" />
              <h3 className="text-base font-semibold text-slate-900">
                Astra Multimodal Synthesis in Progress...
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Translating lecture acoustics into mathematical formulas, Bloom taxonomy quizzes, and curiosity triggers.
              </p>
            </div>
          ) : (
            <ArtifactRenderer
              artifacts={activeArtifacts}
              activeLanguage={stream.activeLanguage}
              onPushToStudents={handleBroadcast}
              selectedArtifactId={
                activeTeachingMode === 'notes' ? activeArtifacts.find(a => a.type === 'notes')?.id
                : activeTeachingMode === 'quiz' ? activeArtifacts.find(a => a.type === 'quiz')?.id
                : activeTeachingMode === 'curiosity' ? activeArtifacts.find(a => a.type === 'curiosity_prompt')?.id
                : activeTeachingMode === 'visual' ? activeArtifacts.find(a => a.type === 'diagram')?.id
                : activeTeachingMode === '3d_world' ? activeArtifacts.find(a => a.type === '3d_scene')?.id
                : activeArtifacts[0]?.id
              }
              onSelectArtifact={(id) => {
                const targetArt = activeArtifacts.find(a => a.id === id);
                if (targetArt) {
                  const targetMode = targetArt.type === 'notes' ? 'notes'
                    : targetArt.type === 'quiz' ? 'quiz'
                    : targetArt.type === 'curiosity_prompt' ? 'curiosity'
                    : targetArt.type === 'diagram' ? 'visual'
                    : targetArt.type === '3d_scene' ? '3d_world'
                    : 'notes';
                  setTeachingMode(targetMode);
                }
              }}
            />
          )}

          {/* Quick Voice / Prompt Bar at bottom of Canvas */}
          <form onSubmit={handleGenerateTopic} className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
            <Sparkles className="w-4 h-4 text-indigo-600 ml-2" />
            <input
              type="text"
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              placeholder="Dictate or type topic: 'Derive quadratic projectile trajectory' or 'Show 3D plant cell stomata'..."
              className="flex-1 bg-transparent text-xs text-slate-900 placeholder-slate-400 focus:outline-none"
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-semibold hover:bg-indigo-100 transition"
            >
              Generate Media
            </button>
          </form>
        </div>

        {/* Right Side: Guru AI Assistant Panel & Waveform */}
        <div className="w-80 border-l border-slate-200 bg-white p-4 flex flex-col justify-between shadow-sm">
          <div className="space-y-4">
            {/* Assistant Header */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <AgentAvatar
                name="Guru AI"
                avatarChar="👨‍🏫"
                voiceState={stream.voiceState}
                detectedEmotion="focused"
                size="md"
              />
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Guru AI Co-Pilot</h3>
                <p className="text-[11px] text-slate-500">Listening to Dr. Priya Sharma</p>
              </div>
            </div>

            {/* Audio Waveform visualization */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex justify-between items-center text-[10px] uppercase font-mono text-slate-500 mb-2 font-medium">
                <span>ASTRA ACOUSTIC STREAM</span>
                <span className="text-indigo-600 font-semibold">{stream.latencyMs}ms LATENCY</span>
              </div>
              <VoiceWaveform levels={stream.audioLevels} isActive={stream.isVoiceActive} color="indigo" height={32} />
            </div>

            {/* Simulated Live Camera Scanner view if enabled */}
            {isCameraViewfinderOpen && (
              <CameraViewfinder
                title="Blackboard Optical Feed"
                subtitle="Live recognition of handwritten notes"
              />
            )}

            {/* Pedagogy Live Tips from Agent */}
            <div className="p-3.5 rounded-xl bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-purple-800">
                <Lightbulb className="w-3.5 h-3.5 text-purple-600" />
                <span>Pedagogical Tip</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                "3 students in Section A haven't responded to the quiz. I recommend switching to the 3D World visualization to reinforce visual comprehension."
              </p>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 text-center font-mono border-t border-slate-100 pt-3">
            EFOS GURU-ASTRA MULTIMODAL KERNEL v3.4
          </div>
        </div>
      </div>
    </div>
  );
};
