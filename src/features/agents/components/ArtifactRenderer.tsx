import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Lightbulb, HelpCircle, 
  Sparkles, Share2, Globe, Box, Workflow, Layers, ArrowRight 
} from 'lucide-react';
import { ContentArtifact, LanguageCode } from '../types/agentTypes';
import { TAMIL_CONTENT_TRANSLATIONS } from '../services/mockContentLibrary';

interface ArtifactRendererProps {
  artifacts: ContentArtifact[];
  activeLanguage?: LanguageCode;
  onPushToStudents?: (artifactId: string) => void;
  selectedArtifactId?: string;
  onSelectArtifact?: (id: string) => void;
}

export const ArtifactRenderer: React.FC<ArtifactRendererProps> = ({
  artifacts,
  activeLanguage = 'en',
  onPushToStudents,
  selectedArtifactId,
  onSelectArtifact,
}) => {
  const [internalActiveTab, setInternalActiveTab] = useState<string>(artifacts[0]?.id || '');
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isTamilActive, setIsTamilActive] = useState<boolean>(activeLanguage === 'ta');

  // Synchronize when parent changes selectedArtifactId or artifacts array
  useEffect(() => {
    if (selectedArtifactId && artifacts.some((a) => a.id === selectedArtifactId)) {
      setInternalActiveTab(selectedArtifactId);
    } else if (artifacts.length > 0 && !artifacts.some((a) => a.id === internalActiveTab)) {
      setInternalActiveTab(artifacts[0].id);
    }
  }, [selectedArtifactId, artifacts]);

  useEffect(() => {
    setIsTamilActive(activeLanguage === 'ta');
  }, [activeLanguage]);

  const activeTab = selectedArtifactId || internalActiveTab;
  const currentArtifact = artifacts.find((a) => a.id === activeTab) || artifacts[0];

  const handleTabClick = (id: string) => {
    setInternalActiveTab(id);
    if (onSelectArtifact) {
      onSelectArtifact(id);
    }
  };

  if (!currentArtifact) {
    return (
      <div className="p-8 text-center text-slate-500 bg-white rounded-2xl border border-slate-200">
        No active generated artifact on canvas. Speak or prompt Guru AI to generate real-time lesson media.
      </div>
    );
  }

  const getIcon = (type: ContentArtifact['type']) => {
    switch (type) {
      case 'notes': return <FileText className="w-4 h-4 text-indigo-600" />;
      case 'quiz': return <HelpCircle className="w-4 h-4 text-amber-600" />;
      case 'curiosity_prompt': return <Lightbulb className="w-4 h-4 text-purple-600" />;
      case 'diagram': return <Workflow className="w-4 h-4 text-cyan-600" />;
      case '3d_scene': return <Box className="w-4 h-4 text-emerald-600" />;
      default: return <Sparkles className="w-4 h-4 text-indigo-600" />;
    }
  };

  const handleSelectAnswer = (qIndex: number, optIndex: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [qIndex]: optIndex }));
  };

  // Find corresponding Tamil translation if enabled
  const topicKey = currentArtifact.topic.toLowerCase().includes('photo') ? 'photosynthesis' : 'quadratic';
  const modeKey = currentArtifact.type === 'notes' ? 'notes'
    : currentArtifact.type === 'quiz' ? 'quiz'
    : currentArtifact.type === 'curiosity_prompt' ? 'curiosity'
    : currentArtifact.type === 'diagram' ? 'visual'
    : currentArtifact.type === '3d_scene' ? '3d_world'
    : 'notes';

  const tamilTranslation = TAMIL_CONTENT_TRANSLATIONS[topicKey]?.[modeKey];

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
      {/* Top Bar / Artifact Selector */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {artifacts.map((art) => (
            <button
              key={art.id}
              onClick={() => handleTabClick(art.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === art.id
                  ? 'bg-white text-indigo-700 border border-indigo-200 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {getIcon(art.type)}
              <span>{art.title.length > 26 ? art.title.slice(0, 26) + '...' : art.title}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsTamilActive(!isTamilActive)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition ${
              isTamilActive
                ? 'bg-purple-50 border-purple-300 text-purple-700'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{isTamilActive ? 'தமிழ் Active' : 'English / தமிழ்'}</span>
          </button>

          {onPushToStudents && (
            <button
              onClick={() => onPushToStudents(currentArtifact.id)}
              className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-semibold shadow-sm transition"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Broadcast to Students</span>
            </button>
          )}
        </div>
      </div>

      {/* Artifact Body Display */}
      <div className="p-6 overflow-y-auto flex-1 text-slate-800">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                {currentArtifact.subject} • {currentArtifact.topic}
              </span>
              {currentArtifact.bloomLevel && (
                <span className="text-[11px] font-mono text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                  Bloom: {currentArtifact.bloomLevel}
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-1.5 flex items-center gap-2">
              {isTamilActive && tamilTranslation
                ? tamilTranslation.title
                : currentArtifact.title}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {isTamilActive && tamilTranslation
                ? tamilTranslation.summary
                : currentArtifact.summary}
            </p>
          </div>
        </div>

        {/* Dynamic Type 1: NOTES */}
        {currentArtifact.type === 'notes' && (
          <div className="space-y-4">
            {currentArtifact.content.equation && (
              <div className="p-4 rounded-xl bg-slate-50 border border-indigo-200 font-mono text-center text-indigo-800 font-semibold text-base shadow-sm">
                {currentArtifact.content.equation}
              </div>
            )}
            {currentArtifact.content.formula && (
              <div className="p-4 rounded-xl bg-slate-50 border border-indigo-200 font-mono text-center text-indigo-800 font-semibold text-base shadow-sm">
                {currentArtifact.content.formula}
              </div>
            )}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <h4 className="text-xs font-semibold uppercase text-slate-500 tracking-wider mb-2">
                Core Conceptual Derivations
              </h4>
              <ul className="space-y-2">
                {currentArtifact.content.keyPoints?.map((pt: string, idx: number) => (
                  <li key={idx} className="text-sm text-slate-700 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Dynamic Type 2: QUIZ */}
        {currentArtifact.type === 'quiz' && (
          <div className="space-y-4">
            {currentArtifact.content.questions?.map((item: any, qIdx: number) => (
              <div key={qIdx} className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <p className="text-sm font-semibold text-slate-900 mb-3">
                  {qIdx + 1}. {item.q}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {item.options.map((opt: string, optIdx: number) => {
                    const isSelected = selectedAnswers[qIdx] === optIdx;
                    const isCorrect = optIdx === item.correctIndex;
                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectAnswer(qIdx, optIdx)}
                        className={`text-left text-xs p-3 rounded-lg border transition-all ${
                          isSelected
                            ? isCorrect
                              ? 'bg-emerald-50 border-emerald-400 text-emerald-800 font-medium'
                              : 'bg-rose-50 border-rose-400 text-rose-800 font-medium'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <span className="font-mono mr-2 text-slate-400">{String.fromCharCode(65 + optIdx)}.</span>
                        {opt}
                      </button>
                    );
                  })}
                </div>
                {selectedAnswers[qIdx] !== undefined && (
                  <div className="mt-2.5 text-[11px] text-slate-600 bg-white p-2 rounded-lg border border-slate-200">
                    <span className="font-semibold text-slate-800">Explanation: </span>
                    {item.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Dynamic Type 3: CURIOSITY */}
        {currentArtifact.type === 'curiosity_prompt' && (
          <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-50 via-white to-indigo-50 border border-purple-200">
            <div className="flex items-center gap-2 text-purple-700 text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4 text-purple-600" /> Astra Curiosity Spark
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              {currentArtifact.content.scenario}
            </h3>
            <p className="text-sm text-slate-700 mb-4 leading-relaxed">
              {currentArtifact.content.sparkFact}
            </p>
            <div className="p-3 bg-purple-50/70 rounded-xl border border-purple-200 text-purple-900 text-xs">
              <span className="font-semibold text-purple-800">Open Exploration Question: </span>
              {currentArtifact.content.investigationQuestion}
            </div>
          </div>
        )}

        {/* Dynamic Type 4: VISUAL SYNTHESIS DIAGRAM */}
        {currentArtifact.type === 'diagram' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-cyan-50/50 border border-cyan-200 text-xs text-cyan-900 font-medium">
              💡 {currentArtifact.content.diagramNote}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {currentArtifact.content.flowStages?.map((stage: any, sIdx: number) => (
                <div key={sIdx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded font-semibold">
                      Stage {sIdx + 1}
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm mt-2">{stage.name}</h4>
                    <p className="text-xs text-slate-600 mt-1">{stage.role}</p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-200 text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                    <ArrowRight className="w-3 h-3 text-emerald-500" /> {stage.output}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dynamic Type 5: 3D WORLD SIMULATION */}
        {currentArtifact.type === '3d_scene' && (
          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-50 via-white to-cyan-50 border border-emerald-200 text-center">
              <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700">
                <Box className="w-8 h-8 animate-bounce" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Interactive Spatial Simulation Active
              </h3>
              <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
                Students can rotate 360° and zoom into molecular structures on their respective devices.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <h4 className="text-xs font-semibold uppercase text-slate-500 tracking-wider mb-2">
                  Active Volumetric Layers
                </h4>
                <ul className="space-y-1.5">
                  {currentArtifact.content.interactiveLayers?.map((layer: string, lIdx: number) => (
                    <li key={lIdx} className="text-xs text-slate-700 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>{layer}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <h4 className="text-xs font-semibold uppercase text-slate-500 tracking-wider mb-2">
                  Real-Time Physical Metrics
                </h4>
                <div className="space-y-1 text-xs">
                  {Object.entries(currentArtifact.content.simulationMetrics || {}).map(([k, v]) => (
                    <div key={k} className="flex justify-between py-1 border-b border-slate-200">
                      <span className="text-slate-500 font-mono capitalize">{k}</span>
                      <span className="font-semibold text-slate-800">{String(v)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
