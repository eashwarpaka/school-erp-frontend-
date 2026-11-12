import { create } from 'zustand';
import { 
  AgentPersona, 
  AgentMessage, 
  ContentArtifact, 
  MultimodalStreamState, 
  TeachingMode, 
  LanguageCode,
  EmotionSignal,
  StudentAgentConfig,
  TeacherDigitalTwinConsent
} from '../types/agentTypes';
import { SAMPLE_ARTIFACTS, SAMPLE_ARTIFACTS_BY_MODE } from '../services/mockContentLibrary';

interface AgentStoreState {
  // Personas
  teacherPersona: AgentPersona;
  studentPersona: AgentPersona;
  
  // Multimodal stream status
  stream: MultimodalStreamState;
  
  // Teaching Canvas & Classroom
  activeTeachingMode: TeachingMode;
  currentLessonTopic: string;
  activeArtifacts: ContentArtifact[];
  isGeneratingArtifact: boolean;
  canvasTimelineStep: number;
  
  // Chat History
  teacherChat: AgentMessage[];
  studentChat: AgentMessage[];

  // Camera permissions & State
  hasCameraPermission: boolean | null; // null: not asked, true: granted, false: denied
  isCameraViewfinderOpen: boolean;
  
  // Digital Twin Consent
  digitalTwinConsent: TeacherDigitalTwinConsent;

  // Student Configurations
  studentConfigs: StudentAgentConfig[];

  // Actions
  setVoiceActive: (active: boolean) => void;
  setVoiceState: (state: MultimodalStreamState['voiceState']) => void;
  setLanguage: (lang: LanguageCode) => void;
  setEmotion: (emotion: EmotionSignal) => void;
  setTeachingMode: (mode: TeachingMode) => void;
  setCurrentLessonTopic: (topic: string) => void;
  addTeacherMessage: (msg: Omit<AgentMessage, 'id' | 'timestamp'>) => void;
  addStudentMessage: (msg: Omit<AgentMessage, 'id' | 'timestamp'>) => void;
  setCameraPermission: (granted: boolean) => void;
  toggleCameraViewfinder: (open?: boolean) => void;
  setDigitalTwinConsent: (consent: Partial<TeacherDigitalTwinConsent>) => void;
  triggerLiveContentGeneration: (topic: string, mode: TeachingMode) => void;
}

export const useAgentStore = create<AgentStoreState>((set, get) => ({
  teacherPersona: {
    id: 'persona-guru',
    name: 'Guru AI',
    avatar: '👨‍🏫',
    role: 'teacher_copilot',
    title: 'Senior Pedagogical AI Co-Pilot',
    personality: 'encouraging',
    language: 'en',
    voiceGender: 'male',
    toneDescription: 'Insightful, supportive, and lightning-fast with visuals'
  },

  studentPersona: {
    id: 'persona-vidya',
    name: 'Vidya AI',
    avatar: '👩‍🎓',
    role: 'student_tutor',
    title: 'Personalized 24/7 Socratic Tutor',
    personality: 'socratic',
    language: 'en',
    voiceGender: 'female',
    toneDescription: 'Gentle, probing, and sparks curiosity with relatable analogies'
  },

  stream: {
    isVoiceActive: false,
    isCameraActive: false,
    isScreenActive: false,
    voiceState: 'idle',
    detectedEmotion: 'focused',
    audioLevels: [12, 24, 45, 78, 92, 60, 40, 65, 80, 50, 30, 70, 85, 40, 20, 10],
    activeLanguage: 'en',
    latencyMs: 180,
  },

  activeTeachingMode: 'notes',
  currentLessonTopic: 'Photosynthesis & Solar Energy Conversion',
  activeArtifacts: SAMPLE_ARTIFACTS.photosynthesis,
  isGeneratingArtifact: false,
  canvasTimelineStep: 1,

  teacherChat: [
    {
      id: 'tc-1',
      sender: 'agent',
      personaName: 'Guru AI',
      text: 'Good morning Dr. Priya! Your Grade 8 Science syllabus is synchronized. Would you like me to project the interactive photosynthesis cellular model or initiate a quick warm-up diagnostic quiz?',
      tamilText: 'வணக்கம் டாக்டர் பிரியா! எட்டாம் வகுப்பு அறிவியல் பாடம் தயாராக உள்ளது. ஒளிச்சேர்க்கை மாதிரியைத் தொடங்கலாமா?',
      timestamp: '09:00 AM',
      mode: 'notes'
    }
  ],

  studentChat: [
    {
      id: 'sc-1',
      sender: 'agent',
      personaName: 'Vidya AI',
      text: 'Hi Arjun! 🌟 Great job maintaining your 5-day science streak! Are you ready to continue where we left off with quadratic trajectories, or do you have a doubt from today\'s class?',
      tamilText: 'வணக்கம் அர்ஜுன்! 5 நாட்கள் தொடர் கற்றலுக்கு வாழ்த்துகள்! இன்று எதை பற்றி படிக்கலாம்?',
      timestamp: '04:30 PM',
      mode: 'notes'
    }
  ],

  hasCameraPermission: null,
  isCameraViewfinderOpen: false,

  digitalTwinConsent: {
    teacherId: 't-101',
    teacherName: 'Dr. Priya Sharma',
    hasConsented: false,
    avatarVoiceModel: 'Astra-Neural-Priya-v1',
    allowedSubstituteSubjects: ['Science - Grade 8', 'Physics - Grade 9'],
    maxDailyTwinSessions: 2,
    notifyOnSessionEnd: true
  },

  studentConfigs: [
    {
      studentId: 'std-1',
      studentName: 'Arjun Patel',
      grade: 'Grade 8',
      section: 'A',
      personaName: 'Vidya AI',
      teachingStyle: 'socratic',
      allowAfterHours: true,
      dailyVoiceMinutesLimit: 60,
      restrictedTopics: [],
      encouragementFrequency: 'high',
      currentStreakDays: 5,
      totalXp: 1420
    },
    {
      studentId: 'std-2',
      studentName: 'Fatima Ali',
      grade: 'Grade 8',
      section: 'A',
      personaName: 'Vidya AI',
      teachingStyle: 'in_depth',
      allowAfterHours: true,
      dailyVoiceMinutesLimit: 45,
      restrictedTopics: [],
      encouragementFrequency: 'medium',
      currentStreakDays: 3,
      totalXp: 980
    }
  ],

  setVoiceActive: (active) => set((s) => ({ stream: { ...s.stream, isVoiceActive: active } })),
  setVoiceState: (voiceState) => set((s) => ({ stream: { ...s.stream, voiceState } })),
  setLanguage: (activeLanguage) => set((s) => ({ stream: { ...s.stream, activeLanguage } })),
  setEmotion: (detectedEmotion) => set((s) => ({ stream: { ...s.stream, detectedEmotion } })),
  setTeachingMode: (activeTeachingMode) => set({ activeTeachingMode }),
  setCurrentLessonTopic: (topic) => set({ currentLessonTopic: topic }),

  addTeacherMessage: (msg) => set((s) => ({
    teacherChat: [
      ...s.teacherChat,
      {
        ...msg,
        id: `tc-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]
  })),

  addStudentMessage: (msg) => set((s) => ({
    studentChat: [
      ...s.studentChat,
      {
        ...msg,
        id: `sc-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]
  })),

  setCameraPermission: (granted) => set({ hasCameraPermission: granted, stream: { ...get().stream, isCameraActive: granted } }),
  toggleCameraViewfinder: (open) => set((s) => ({ isCameraViewfinderOpen: open !== undefined ? open : !s.isCameraViewfinderOpen })),

  setDigitalTwinConsent: (consent) => set((s) => ({
    digitalTwinConsent: { ...s.digitalTwinConsent, ...consent }
  })),

  triggerLiveContentGeneration: (topic: string, mode: TeachingMode) => {
    set({ isGeneratingArtifact: true, activeTeachingMode: mode });
    setTimeout(() => {
      const topicKey = topic.toLowerCase().includes('quad') ? 'quadratic' : 'photosynthesis';
      const modeKey = mode === 'visual' ? 'visual' : mode === '3d_world' ? '3d_world' : mode === 'quiz' ? 'quiz' : mode === 'curiosity' ? 'curiosity' : 'notes';
      
      const allArtifacts = SAMPLE_ARTIFACTS[topicKey] || SAMPLE_ARTIFACTS.photosynthesis;
      const targetArtifact = SAMPLE_ARTIFACTS_BY_MODE[topicKey]?.[modeKey] || allArtifacts[0];
      
      // Place the mode-targeted artifact first so it is immediately active and visible
      const reordered = [targetArtifact, ...allArtifacts.filter(a => a.id !== targetArtifact.id)];
      
      set({
        activeArtifacts: reordered,
        isGeneratingArtifact: false,
        currentLessonTopic: topic,
        activeTeachingMode: mode
      });
    }, 800);
  }
}));
