export type Page = 'home' | 'chat-consultation' | 'mypage' | 'login' | 'signup';

export interface UserProfile {
  uid?: string;
  name: string;
  email: string;
  role: string;
  avatarUrl: string;
  joinedDate: string;
  daysActive: number;
  consultationCount: number;
  targetGoal: string;
  coachingStyle: string;
  studyCategory: string;
  consultTone: string;
  notifyGoals: boolean;
  notifyReport: boolean;
  agreeDataTraining: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  tags?: string[];
  suggestedSteps?: string[];
}
