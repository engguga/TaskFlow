import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

// Função para aplicar o tema no HTML
const applyThemeToDocument = (theme: Theme) => {
  const html = document.documentElement;
  if (theme === 'dark') {
    html.classList.add('dark');
  } else {
    html.classList.remove('dark');
  }
  console.log('Theme applied:', theme); // Debug
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'light',
      toggleTheme: () => {
        const currentTheme = get().theme;
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        console.log('Toggling theme from', currentTheme, 'to', newTheme); // Debug
        
        applyThemeToDocument(newTheme);
        set({ theme: newTheme });
      },
      setTheme: (theme: Theme) => {
        console.log('Setting theme to:', theme); // Debug
        applyThemeToDocument(theme);
        set({ theme });
      },
    }),
    {
      name: 'theme-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          console.log('Rehydrating theme:', state.theme); // Debug
          applyThemeToDocument(state.theme);
        }
      },
    }
  )
);
