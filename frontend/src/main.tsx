import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Aplicar tema imediatamente no carregamento
const applyInitialTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  const html = document.documentElement;
  
  console.log('Initial theme setup - savedTheme:', savedTheme);
  
  if (savedTheme === 'dark') {
    html.classList.add('dark');
    console.log('Applied dark theme from localStorage');
  } else if (savedTheme === 'light') {
    html.classList.remove('dark');
    console.log('Applied light theme from localStorage');
  } else {
    // Sem tema salvo, verificar preferência do sistema
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      console.log('Applied dark theme from system preference');
    } else {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      console.log('Applied light theme (default)');
    }
  }
};

// Aplicar tema antes de renderizar
applyInitialTheme();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <App />
)
