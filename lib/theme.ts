export type AppTheme =
  | 'light'
  | 'sand'
  | 'frost'
  | 'matcha'
  | 'lavender'
  | 'dark'
  | 'ocean'
  | 'forest'
  | 'sunset'
  | 'bordeaux';

export interface ThemeConfig {
  id: AppTheme;
  name_ar: string;
  name_en: string;
  description_ar: string;
  description_en: string;
  icon: 'sun' | 'moon' | 'book' | 'ocean' | 'forest' | 'sunset' | 'sand' | 'leaf' | 'coffee' | 'crown' | 'frost' | 'lavender' | 'bordeaux';
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
    id: 'frost',
    name_ar: 'ثلجي قطبي',
    name_en: 'Glacier Frost',
    description_ar: 'أزرق ثلجي ناصع وبارد يمنح العين برودة وانتعاشاً ذهنياً أثناء القراءة',
    description_en: 'Crisp arctic ice & glacier blue for ultra-cool reading',
    icon: 'frost',
    isDarkFamily: false,
    colorSwatch: {
      bg: '#eaf2f8',
      border: '#b9d5ea',
      accent: '#0284c7',
    },
  },
  {
    id: 'matcha',
    name_ar: 'ماتشا ياباني',
    name_en: 'Zen Matcha',
    description_ar: 'أخضر شاي حليبي هادئ يمنح السكينة والتركيز الذهني بدون أي وهج',
    description_en: 'Soothing milky matcha green for deep zen focus',
    icon: 'leaf',
    isDarkFamily: false,
    colorSwatch: {
      bg: '#edf4ee',
      border: '#c5d9c9',
      accent: '#2d6a4f',
    },
  },
  {
    id: 'lavender',
    name_ar: 'خزامى ناعمة',
    name_en: 'Lilac Lavender',
    description_ar: 'موف لافندر باودري هادئ مستوحى من راحة القراءة المسائية في كتب آبل',
    description_en: 'Gentle powdery lilac & mauve for calm, dreamy reading',
    icon: 'lavender',
    isDarkFamily: false,
    colorSwatch: {
      bg: '#f3effa',
      border: '#d7cbe8',
      accent: '#7c3aed',
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
  {
    id: 'bordeaux',
    name_ar: 'عنابي فاخر',
    name_en: 'Royal Bordeaux',
    description_ar: 'نبيذي ياقوتي عميق ودافئ بأسلوب المكتبات التاريخية الراقية',
    description_en: 'Deep vintage ruby wine & velvety crimson for cozy nights',
    icon: 'bordeaux',
    isDarkFamily: true,
    colorSwatch: {
      bg: '#1b0811',
      border: '#4c1a30',
      accent: '#f43f5e',
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

  // Exact background color of active theme
  const themeBgColor = target?.colorSwatch.bg || (isDark ? '#0c0d14' : '#ffffff');

  // Update HTML and Body inline background immediately for iOS Safari tab bar sampling
  document.documentElement.style.backgroundColor = themeBgColor;
  if (document.body) {
    document.body.style.backgroundColor = themeBgColor;
  }

  // Update or insert <meta name="theme-color"> for iOS Safari address bar & Android chrome
  try {
    const existingMetas = document.querySelectorAll('meta[name="theme-color"]');
    if (existingMetas.length > 0) {
      existingMetas.forEach((meta) => {
        meta.setAttribute('content', themeBgColor);
      });
    } else {
      const meta = document.createElement('meta');
      meta.name = 'theme-color';
      meta.content = themeBgColor;
      document.head.appendChild(meta);
    }

    // Update iOS status bar appearance (light text on dark backgrounds, dark text on light backgrounds)
    let appleMeta = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
    if (!appleMeta) {
      appleMeta = document.createElement('meta');
      appleMeta.setAttribute('name', 'apple-mobile-web-app-status-bar-style');
      document.head.appendChild(appleMeta);
    }
    appleMeta.setAttribute('content', isDark ? 'black-translucent' : 'default');
  } catch (e) {
    console.error('Error updating theme-color meta:', e);
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
