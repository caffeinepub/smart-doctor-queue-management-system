import React, { useState } from 'react';
import { useNavigate, useLocation } from '@tanstack/react-router';
import { Bell, Sun, Moon, Globe, Menu, X, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useApp } from '@/lib/AppContext';
import { t } from '@/lib/i18n';
import { getDashboardPath } from '@/lib/auth';

interface NavbarProps {
  onMenuToggle?: () => void;
  showMenuButton?: boolean;
}

export default function Navbar({ onMenuToggle, showMenuButton = false }: NavbarProps) {
  const { user, logout, lang, setLang, theme, toggleTheme, notifications, clearNotifications, unreadCount } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const isLanding = location.pathname === '/';

  const handleLogout = () => {
    logout();
    navigate({ to: '/' });
  };

  const navLinks = [
    { label: t(lang, 'home'), href: '/' },
    { label: t(lang, 'features'), href: '/#features' },
    { label: t(lang, 'about'), href: '/#about' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Left: Menu + Logo */}
        <div className="flex items-center gap-3">
          {showMenuButton && (
            <Button variant="ghost" size="icon" onClick={onMenuToggle} className="lg:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <button
            onClick={() => navigate({ to: user ? getDashboardPath(user.role) : '/' })}
            className="flex items-center gap-2 group"
          >
            <img
              src="/assets/generated/clinic-logo.dim_256x256.png"
              alt="MediQueue Logo"
              className="h-8 w-8 rounded-md object-cover"
            />
            <span className="font-display font-bold text-lg text-foreground group-hover:text-primary transition-colors">
              {t(lang, 'appName')}
            </span>
          </button>
        </div>

        {/* Center: Nav links (landing only) */}
        {isLanding && (
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
        )}

        {/* Right: Controls */}
        <div className="flex items-center gap-2">
          {/* Language switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" title={t(lang, 'language')}>
                <Globe className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setLang('en')} className={lang === 'en' ? 'font-semibold' : ''}>
                🇬🇧 {t(lang, 'english')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLang('ta')} className={lang === 'ta' ? 'font-semibold' : ''}>
                🇮🇳 {t(lang, 'tamil')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme toggle */}
          <Button variant="ghost" size="icon" onClick={toggleTheme} title={theme === 'dark' ? t(lang, 'lightMode') : t(lang, 'darkMode')}>
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {/* Notifications (authenticated only) */}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative" title={t(lang, 'notifications')}>
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-destructive text-destructive-foreground border-0">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="flex items-center justify-between px-3 py-2 border-b border-border">
                  <span className="font-semibold text-sm">{t(lang, 'notifications')}</span>
                  {unreadCount > 0 && (
                    <Button variant="ghost" size="sm" className="h-auto py-0 text-xs text-primary" onClick={clearNotifications}>
                      Mark all read
                    </Button>
                  )}
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-6">{t(lang, 'noData')}</p>
                  ) : (
                    notifications.slice(0, 10).map(n => (
                      <div key={n.id} className={`px-3 py-2 border-b border-border last:border-0 ${!n.read ? 'bg-primary/5' : ''}`}>
                        <p className="text-sm">{n.message}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {n.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* User menu or auth buttons */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <span className="hidden sm:inline text-sm font-medium">{user.name}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="px-3 py-2">
                  <p className="font-medium text-sm">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                  <Badge variant="secondary" className="mt-1 text-xs capitalize">{user.role}</Badge>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                  <LogOut className="h-4 w-4 mr-2" />
                  {t(lang, 'logout')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => navigate({ to: '/login' })}>
                {t(lang, 'login')}
              </Button>
              <Button size="sm" onClick={() => navigate({ to: '/register' })}>
                {t(lang, 'register')}
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
