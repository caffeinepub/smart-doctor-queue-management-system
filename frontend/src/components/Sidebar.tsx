import React from 'react';
import { useNavigate, useLocation } from '@tanstack/react-router';
import {
  LayoutDashboard, Users, Stethoscope, Building2, ListOrdered,
  FileText, Settings, ChevronRight, Activity, BarChart3, Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useApp } from '@/lib/AppContext';
import { t } from '@/lib/i18n';
import type { UserRole } from '@/lib/auth';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  href: string;
}

function getNavItems(role: UserRole, lang: Parameters<typeof t>[0]): NavItem[] {
  const base: NavItem[] = [
    { label: t(lang, 'dashboard'), icon: <LayoutDashboard className="h-4 w-4" />, href: getDashboardHref(role) },
  ];

  if (role === 'patient') {
    return [
      ...base,
      { label: t(lang, 'visitHistory'), icon: <FileText className="h-4 w-4" />, href: '/patient' },
    ];
  }

  if (role === 'doctor') {
    return [
      ...base,
      { label: t(lang, 'queues'), icon: <ListOrdered className="h-4 w-4" />, href: '/doctor' },
    ];
  }

  if (role === 'admin') {
    return [
      ...base,
      { label: t(lang, 'departments'), icon: <Building2 className="h-4 w-4" />, href: '/admin' },
      { label: t(lang, 'doctors'), icon: <Stethoscope className="h-4 w-4" />, href: '/admin' },
      { label: t(lang, 'analytics'), icon: <BarChart3 className="h-4 w-4" />, href: '/admin' },
      { label: t(lang, 'adminLogs'), icon: <FileText className="h-4 w-4" />, href: '/admin' },
    ];
  }

  if (role === 'superadmin') {
    return [
      ...base,
      { label: t(lang, 'clinicManagement'), icon: <Building2 className="h-4 w-4" />, href: '/superadmin' },
      { label: t(lang, 'analytics'), icon: <Activity className="h-4 w-4" />, href: '/superadmin' },
      { label: t(lang, 'adminLogs'), icon: <Shield className="h-4 w-4" />, href: '/superadmin' },
    ];
  }

  return base;
}

function getDashboardHref(role: UserRole): string {
  switch (role) {
    case 'patient': return '/patient';
    case 'doctor': return '/doctor';
    case 'admin': return '/admin';
    case 'superadmin': return '/superadmin';
    default: return '/';
  }
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user, lang } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return null;

  const navItems = getNavItems(user.role, lang);

  const handleNav = (href: string) => {
    navigate({ to: href });
    onClose();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 bg-sidebar border-r border-sidebar-border transition-transform duration-300 ease-in-out',
          'lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full p-4">
          {/* User info */}
          <div className="mb-6 p-3 rounded-lg bg-sidebar-accent">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-sidebar-primary/20 flex items-center justify-center flex-shrink-0">
                <Users className="h-4 w-4 text-sidebar-primary" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm text-sidebar-foreground truncate">{user.name}</p>
                <p className="text-xs text-sidebar-foreground/60 capitalize">{user.role}</p>
              </div>
            </div>
          </div>

          {/* Nav items */}
          <nav className="flex-1 space-y-1">
            {navItems.map((item, idx) => {
              const isActive = location.pathname === item.href;
              return (
                <button
                  key={idx}
                  onClick={() => handleNav(item.href)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                      : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground'
                  )}
                >
                  {item.icon}
                  <span className="flex-1 text-left">{item.label}</span>
                  {isActive && <ChevronRight className="h-3 w-3 opacity-60" />}
                </button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="pt-4 border-t border-sidebar-border">
            <p className="text-xs text-sidebar-foreground/40 text-center">
              {t(lang, 'appName')} v1.0
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
