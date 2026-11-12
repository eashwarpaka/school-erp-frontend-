// ============================================================
// Agentic Education Layer — Core Type Definitions (Astra-Powered)
// ============================================================

export type AgentRole = 'teacher_copilot' | 'student_tutor' | 'digital_twin' | 'admin_observer';

export type LanguageCode = 'en' | 'ta'; // English & Tamil approved

export type EmotionSignal = 
  | 'focused' 
  | 'confused' 
  | 'frustrated' 
  | 'excited' 
  | 'bored' 
  | 'eureka';

export type VoiceState = 'idle' | 'listening' | 'processing' | 'speaking';

export type TeachingMode = 
  | 'notes' 
  | 'visual' 
  | 'quiz' 
  | 'lab' 
  | 'curiosity' 
  | '3d_world' 
  | 'timeline' 
  | 'debate';

export interface AgentPersona {
  id: string;
  name: string;
  avatar: string;
  role: AgentRole;
  title: string;
  personality: 'socratic' | 'encouraging' | 'analytical' | 'humorous' | 'rigorous';
  language: LanguageCode;
  voiceGender: 'female' | 'male' | 'neutral';
  toneDescription: string;
}

export interface MultimodalStreamState {
  isVoiceActive: boolean;
  isCameraActive: boolean;
  isScreenActive: boolean;
  voiceState: VoiceState;
  detectedEmotion: EmotionSignal;
  audioLevels: number[]; // e.g. 16 frequency bands for waveform animation
  activeLanguage: LanguageCode;
  latencyMs: number;
}

export interface ContentArtifact {
  id: string;
  type: 'notes' | 'diagram' | 'quiz' | 'simulation' | 'curiosity_prompt' | '3d_scene' | 'video_summary';
  title: string;
  subject: string;
  topic: string;
  summary: string;
  content: any;
  bloomLevel?: 'Remember' | 'Understand' | 'Apply' | 'Analyze' | 'Evaluate' | 'Create';
  language: LanguageCode;
  createdAt: string;
}

export interface AgentMessage {
  id: string;
  sender: 'user' | 'agent' | 'system';
  personaName?: string;
  text: string;
  tamilText?: string;
  timestamp: string;
  mode?: TeachingMode;
  artifacts?: ContentArtifact[];
  emotionCue?: EmotionSignal;
  audioDurationSec?: number;
}

export interface StudentAgentConfig {
  studentId: string;
  studentName: string;
  grade: string;
  section: string;
  personaName: string;
  teachingStyle: 'socratic' | 'direct_hint' | 'in_depth';
  allowAfterHours: boolean;
  dailyVoiceMinutesLimit: number;
  restrictedTopics: string[];
  encouragementFrequency: 'high' | 'medium' | 'low';
  currentStreakDays: number;
  totalXp: number;
}

export interface TeacherDigitalTwinConsent {
  teacherId: string;
  teacherName: string;
  hasConsented: boolean;
  consentTimestamp?: string;
  avatarVoiceModel: string;
  allowedSubstituteSubjects: string[];
  maxDailyTwinSessions: number;
  notifyOnSessionEnd: boolean;
}
