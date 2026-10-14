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
    id: 'gemini-3.5-flash-lite',
    name: 'Gemini 3.5 Flash-Lite',
    name_ar: 'جيميناي 3.5 فلاش-لايت',
    description_en: 'Fastest answers & instant executive summaries',
    description_ar: 'للإجابات السريعة والملخصات الفورية',
    apiModel: 'gemini-3.5-flash-lite',
    badge_en: 'Fastest / Instant',
    badge_ar: 'سريع وفوري',
    badgeColor: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20',
  },
  {
    id: 'gemini-3.8-flash',
    name: 'Gemini 3.8 Flash',
    name_ar: 'جيميناي 3.8 فلاش',
    description_en: 'All-around help & balanced tactical advice',
    description_ar: 'المساعد الشامل للمهام اليومية المتوازنة',
    apiModel: 'gemini-flash-latest',
    badge_en: 'Balanced / All-around',
    badge_ar: 'شامل ومتوازن',
    badgeColor: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20',
  },
  {
    id: 'gemini-3.1-pro',
    name: 'Gemini 3.1 Pro',
    name_ar: 'جيميناي 3.1 برو',
    description_en: 'Advanced reasoning, economics & deep logic',
    description_ar: 'التفكير العميق والتحليل المنطقي والمالي',
    apiModel: 'gemini-pro-latest',
    badge_en: 'Advanced Reasoning',
    badge_ar: 'تفكير وتحليل عميق',
    badgeColor: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20',
  },
  {
    id: 'gemini-4-argon',
    name: 'Gemini 4 Argon',
    name_ar: 'جيميناي 4 أرجون',
    description_en: 'Complex strategy breakdown & paradigm modeling',
    description_ar: 'المهام المعقدة وتفكيك النماذج الاستراتيجية الصعبة',
    apiModel: 'gemini-3.1-pro-preview',
    badge_en: 'Strategic Paradigm',
    badge_ar: 'نماذج استراتيجية كبرى',
    badgeColor: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20',
  },
];
