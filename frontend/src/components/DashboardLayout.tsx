import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useApp } from '@/lib/AppContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useApp();

  return (
    <div className="min-h-screen bg-background">
      <Navbar
        showMenuButton={!!user}
        onMenuToggle={() => setSidebarOpen(prev => !prev)}
      />
      <div className="flex">
        {user && (
          <Sidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
        )}
        <main className={`flex-1 min-h-[calc(100vh-4rem)] transition-all duration-300 ${user ? 'lg:ml-64' : ''}`}>
          <div className="p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
