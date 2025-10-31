import { create } from 'zustand';

type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
}

// Função para aplicar o tema no HTML
const applyThemeToDocument = (theme: Theme) => {
  const html = document.documentElement;
  if (theme === 'dark') {
    html.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    html.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }
  console.log('Theme applied to document:', theme);
};

// Get initial theme from localStorage or system preference
const getInitialTheme = (): Theme => {
  const saved = localStorage.getItem('theme');
  if (saved === 'dark' || saved === 'light') {
    return saved;
  }
  
  // Check system preference
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  
  return 'light';
};

export const useThemeStoreSimple = create<ThemeState>((set) => ({
  theme: getInitialTheme(),
  toggleTheme: () => {
    set((state) => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      console.log('Toggling theme:', state.theme, '->', newTheme);
      applyThemeToDocument(newTheme);
      return { theme: newTheme };
    });
  },
}));

// Apply initial theme
applyThemeToDocument(getInitialTheme());
