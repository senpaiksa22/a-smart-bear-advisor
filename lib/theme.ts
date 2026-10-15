export type AppTheme = 'light' | 'sand' | 'sepia' | 'dark' | 'ocean' | 'forest' | 'sunset';

export interface ThemeConfig {
  id: AppTheme;
  name_ar: string;
  name_en: string;
  description_ar: string;
  description_en: string;
  icon: 'sun' | 'moon' | 'book' | 'ocean' | 'forest' | 'sunset' | 'sand';
  isDarkFamily: boolean;
  colorSwatch: {
    bg: string;
    border: string;
    accent: string;
  };
}

export const APP_THEMES: ThemeConfig[] = [
  {
    id: 'light',
    name_ar: 'فاتح كلاسيكي',
    name_en: 'Classic Light',
    description_ar: 'أبيض ناصع وواضح كأوراق العمل',
    description_en: 'Clean, high-clarity paper white',
    icon: 'sun',
    isDarkFamily: false,
    colorSwatch: {
      bg: '#ffffff',
      border: '#cbd5e1',
      accent: '#486337',
    },
  },
  {
    id: 'sand',
    name_ar: 'بيج هادئ (مريح للعين)',
    name_en: 'Muted Beige (Eye-Ease)',
    description_ar: 'بيج رملي دافئ ومطفأ تماماً بدون أي بياض فاقع، أقصى درجات الراحة للبصر',
    description_en: 'Muted warm sand & linen beige, completely glare-free',
    icon: 'sand',
    isDarkFamily: false,
    colorSwatch: {
      bg: '#dfd6c5',
      border: '#cbbeaa',
      accent: '#8c532b',
    },
  },
  {
    id: 'sepia',
    name_ar: 'سيبيا ورقي',
    name_en: 'Sepia Paper',
    description_ar: 'ورقي كهرماني كلاسيكي بأسلوب الكتب القديمة',
    description_en: 'Warm amber parchment for vintage book reading',
    icon: 'book',
    isDarkFamily: false,
    colorSwatch: {
      bg: '#f6efe1',
      border: '#dfceb4',
      accent: '#b45309',
    },
  },
  {
    id: 'dark',
    name_ar: 'داكن ليلي',
    name_en: 'Midnight Dark',
    description_ar: 'أسود ليلي عميق عالي التباين',
    description_en: 'Deep midnight, high contrast',
    icon: 'moon',
    isDarkFamily: true,
    colorSwatch: {
      bg: '#0c0d14',
      border: '#272a3e',
      accent: '#86a678',
    },
  },
  {
    id: 'ocean',
    name_ar: 'كحلي محيطي',
    name_en: 'Ocean Navy',
    description_ar: 'أزرق كحلي نورديك عميق وهادئ للعين',
    description_en: 'Deep sapphire & arctic cyan glow',
    icon: 'ocean',
    isDarkFamily: true,
    colorSwatch: {
      bg: '#0b132b',
      border: '#1e2d5a',
      accent: '#38bdf8',
    },
  },
  {
    id: 'forest',
    name_ar: 'زمردي غابي',
    name_en: 'Forest Emerald',
    description_ar: 'أخضر صنوبري هادئ معزز للتركيز والسكينة',
    description_en: 'Calming botanical pine & soft mint',
    icon: 'forest',
    isDarkFamily: true,
    colorSwatch: {
      bg: '#091510',
      border: '#1b3b2e',
      accent: '#34d399',
    },
  },
  {
    id: 'sunset',
    name_ar: 'مخملي ملكي',
    name_en: 'Royal Velvet',
    description_ar: 'أرجواني موف فخم بإضاءة خزامية هادئة',
    description_en: 'Luxurious twilight violet & lavender',
    icon: 'sunset',
    isDarkFamily: true,
    colorSwatch: {
      bg: '#140c1e',
      border: '#331d4e',
      accent: '#c084fc',
    },
  },
];

export function applyTheme(theme: AppTheme) {
  if (typeof document === 'undefined') return;

  // Set data-theme attribute on <html>
  document.documentElement.setAttribute('data-theme', theme);

  // Set or remove .dark class for Tailwind dark: modifiers
  const target = APP_THEMES.find((t) => t.id === theme);
  const isDark = target?.isDarkFamily ?? false;

  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  // Persist to localStorage
  try {
    localStorage.setItem('smartbear_theme', theme);
  } catch (e) {}
}

export function getInitialTheme(): AppTheme {
  if (typeof window === 'undefined') return 'sand'; // Default to the eye-friendly sand theme if desired or saved
  try {
    const saved = localStorage.getItem('smartbear_theme') as AppTheme;
    if (saved && APP_THEMES.some((t) => t.id === saved)) {
      return saved;
    }
  } catch (e) {}
  return 'light';
}
