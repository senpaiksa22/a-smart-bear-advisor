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
    description_en: 'Fastest answers & instant executive summaries (500 req/day)',
    description_ar: 'للإجابات الفورية والملخصات السريعة (500 طلب يومياً)',
    apiModel: 'gemini-3.5-flash-lite',
    badge_en: 'Fastest (500/day)',
    badge_ar: 'فوري (500/يوم)',
    badgeColor: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20',
  },
  {
    id: 'gemini-3.1-flash-lite',
    name: 'Gemini 3.1 Flash-Lite',
    name_ar: 'جيميناي 3.1 فلاش-لايت',
    description_en: 'Ultra-low latency tactical advisor (500 req/day)',
    description_ar: 'استجابة فائقة السرعة لتحليل القرارات (500 طلب يومياً)',
    apiModel: 'gemini-3.1-flash-lite',
    badge_en: 'Ultra Fast (500/day)',
    badge_ar: 'فائق السرعة (500/يوم)',
    badgeColor: 'bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-500/20',
  },
  {
    id: 'gemini-3.8-flash',
    name: 'Gemini 3.8 Flash',
    name_ar: 'جيميناي 3.8 فلاش',
    description_en: 'All-around help & balanced tactical advice (20 req/day)',
    description_ar: 'المساعد الشامل للمهام اليومية المتوازنة (20 طلب يومياً)',
    apiModel: 'gemini-3.8-flash',
    badge_en: 'Balanced (20/day)',
    badge_ar: 'متوازن (20/يوم)',
    badgeColor: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20',
  },
  {
    id: 'gemini-3.6-flash',
    name: 'Gemini 3.6 Flash',
    name_ar: 'جيميناي 3.6 فلاش',
    description_en: 'Deep analytical breakdown & strategic logic (20 req/day)',
    description_ar: 'تفكير تحليلي متقدم وتفكيك الاستراتيجيات (20 طلب يومياً)',
    apiModel: 'gemini-3.6-flash',
    badge_en: 'Deep Logic (20/day)',
    badge_ar: 'تحليل متقدم (20/يوم)',
    badgeColor: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20',
  },
];
