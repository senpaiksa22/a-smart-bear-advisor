export interface ModelOption {
  id: string;
  name: string;
  name_ar: string;
  description_en: string;
  description_ar: string;
  apiModel: string;
  badge_en: string;
  badge_ar: string;
  badgeColor: string;
}

export const AVAILABLE_MODELS: ModelOption[] = [
  {
    id: 'gemini-3.1-flash-lite',
    name: 'Gemini 3.1 Flash-Lite',
    name_ar: 'جيميناي 3.1 فلاش-لايت',
    description_en: 'Ultra-fast tactical answers & rapid decision analysis',
    description_ar: 'استجابة فائقة السرعة لتحليل القرارات والتكتيكات',
    apiModel: 'gemini-3.1-flash-lite',
    badge_en: '',
    badge_ar: '',
    badgeColor: '',
  },
  {
    id: 'gemini-3.5-flash-lite',
    name: 'Gemini 3.5 Flash-Lite',
    name_ar: 'جيميناي 3.5 فلاش-لايت',
    description_en: 'Fast answers & instant executive summaries',
    description_ar: 'للإجابات الفورية والملخصات التنفيذية السريعة',
    apiModel: 'gemini-3.5-flash-lite',
    badge_en: '',
    badge_ar: '',
    badgeColor: '',
  },
  {
    id: 'gemini-3.6-flash',
    name: 'Gemini 3.6 Flash',
    name_ar: 'جيميناي 3.6 فلاش',
    description_en: 'Deep analytical breakdown & strategic logic',
    description_ar: 'تفكير تحليلي متقدم وتفكيك الاستراتيجيات الصعبة',
    apiModel: 'gemini-3.6-flash',
    badge_en: '',
    badge_ar: '',
    badgeColor: '',
  },
  {
    id: 'gemini-3.8-flash',
    name: 'Gemini 3.8 Flash',
    name_ar: 'جيميناي 3.8 فلاش',
    description_en: 'All-around help & balanced tactical advice',
    description_ar: 'المساعد الشامل للمهام اليومية المتوازنة والمتقدمة',
    apiModel: 'gemini-3.8-flash',
    badge_en: '',
    badge_ar: '',
    badgeColor: '',
  },
];
