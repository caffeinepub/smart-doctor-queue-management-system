import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { type Language } from './i18n';
import { type AuthUser, getStoredUser, storeUser, clearUser } from './auth';

interface AppContextValue {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  logout: () => void;
  lang: Language;
  setLang: (lang: Language) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  notifications: Notification[];
  addNotification: (msg: string) => void;
  clearNotifications: () => void;
  unreadCount: number;
}

interface Notification {
  id: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<AuthUser | null>(getStoredUser);
  const [lang, setLang] = useState<Language>('en');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('sdq_theme') as 'light' | 'dark' | null;
    if (saved) setTheme(saved);
    const savedLang = localStorage.getItem('sdq_lang') as Language | null;
    if (savedLang) setLang(savedLang);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('sdq_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('sdq_lang', lang);
  }, [lang]);

  const setUser = (u: AuthUser | null) => {
    setUserState(u);
    if (u) storeUser(u);
    else clearUser();
  };

  const logout = () => {
    setUser(null);
    setNotifications([]);
  };

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light');

  const addNotification = (message: string) => {
    const notif: Notification = {
      id: Date.now().toString(),
      message,
      timestamp: new Date(),
      read: false,
    };
    setNotifications(prev => [notif, ...prev].slice(0, 20));

    // Browser notification
    if ('Notification' in window && window.Notification.permission === 'granted') {
      new window.Notification('MediQueue', { body: message, icon: '/assets/generated/clinic-logo.dim_256x256.png' });
    }
  };

  const clearNotifications = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AppContext.Provider value={{
      user, setUser, logout,
      lang, setLang,
      theme, toggleTheme,
      notifications, addNotification, clearNotifications, unreadCount,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
