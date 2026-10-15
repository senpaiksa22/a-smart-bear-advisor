import { Article } from '@/lib/types';
import { AuthUser } from '@/lib/auth';
import { AppTheme } from '@/lib/theme';

export type FounderChallengeId =
  | 'pmf'
  | 'pricing'
  | 'growth'
  | 'moats'
  | 'funding'
  | 'mental_models';

export interface QuickPrompt {
  id: string;
  label_ar: string;
  label_en: string;
  prompt_ar: string;
  prompt_en: string;
}

export interface FounderChallenge {
  id: FounderChallengeId;
  icon: string;
  title_ar: string;
  title_en: string;
  subtitle_ar: string;
  subtitle_en: string;
  description_ar: string;
  description_en: string;
  primaryMetric_ar: string;
  primaryMetric_en: string;
  curatedSlugs: string[];
  quickPrompts: QuickPrompt[];
}

export interface V2Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at: string;
  model_used?: string;
  citations?: Array<{
    slug: string;
    title: string;
  }>;
}

export interface V2Conversation {
  id: string;
  title: string;
  model_used: string;
  created_at: string;
  updated_at: string;
}
