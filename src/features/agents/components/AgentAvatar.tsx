import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Brain, Bot } from 'lucide-react';
import { VoiceState, EmotionSignal } from '../types/agentTypes';

interface AgentAvatarProps {
  name: string;
  avatarChar?: string;
  voiceState?: VoiceState;
  detectedEmotion?: EmotionSignal;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showStatusBadge?: boolean;
}

export const AgentAvatar: React.FC<AgentAvatarProps> = ({
  name,
  avatarChar = '🤖',
  voiceState = 'idle',
  detectedEmotion,
  size = 'md',
  showStatusBadge = true,
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-xl',
    lg: 'w-16 h-16 text-3xl',
    xl: 'w-24 h-24 text-5xl',
  };

  const getBorderAnimation = () => {
    switch (voiceState) {
      case 'speaking':
        return 'ring-4 ring-emerald-500 animate-pulse';
      case 'listening':
        return 'ring-4 ring-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.3)]';
      case 'processing':
        return 'ring-4 ring-purple-500 animate-spin';
      default:
        return 'ring-2 ring-slate-200';
    }
  };

  const getStatusText = () => {
    switch (voiceState) {
      case 'speaking':
        return 'Speaking';
      case 'listening':
        return 'Listening...';
      case 'processing':
        return 'Reasoning...';
      default:
        return 'Ready';
    }
  };

  return (
    <div className="relative inline-flex flex-col items-center group">
      <motion.div
        whileHover={{ scale: 1.05 }}
        className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-white to-slate-100 border border-slate-200 shadow-md transition-all duration-300 ${sizeClasses[size]} ${getBorderAnimation()}`}
      >
        <span>{avatarChar}</span>

        {voiceState === 'processing' && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 rounded-2xl backdrop-blur-[1px]">
            <Brain className="w-5 h-5 text-purple-600 animate-pulse" />
          </div>
        )}

        {detectedEmotion && (
          <span 
            title={`Astra Emotion: ${detectedEmotion}`}
            className="absolute -top-1 -right-1 text-xs px-1 py-0.5 rounded-full bg-white border border-slate-200 shadow-sm"
          >
            {detectedEmotion === 'eureka' ? '💡' : detectedEmotion === 'confused' ? '❓' : detectedEmotion === 'frustrated' ? '⚠️' : '🎯'}
          </span>
        )}
      </motion.div>

      {showStatusBadge && (
        <span className="mt-1.5 text-[10px] uppercase tracking-wider font-semibold text-slate-500 flex items-center gap-1">
          <span className={`w-1.5 h-1.5 rounded-full ${voiceState === 'speaking' ? 'bg-emerald-500' : voiceState === 'listening' ? 'bg-indigo-500' : 'bg-slate-400'}`} />
          {getStatusText()}
        </span>
      )}
    </div>
  );
};
