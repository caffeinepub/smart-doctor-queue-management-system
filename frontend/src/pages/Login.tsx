import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Eye, EyeOff, LogIn, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useApp } from '@/lib/AppContext';
import { t } from '@/lib/i18n';
import { type AuthUser, type UserRole, getDashboardPath } from '@/lib/auth';

// Demo accounts for testing
const DEMO_ACCOUNTS: AuthUser[] = [
  { id: '1', name: 'Priya Sharma', email: 'patient@demo.com', role: 'patient' },
  { id: '2', name: 'Dr. Rajan Kumar', email: 'doctor@demo.com', role: 'doctor' },
  { id: '3', name: 'Admin User', email: 'admin@demo.com', role: 'admin' },
  { id: '4', name: 'Super Admin', email: 'superadmin@demo.com', role: 'superadmin' },
];

export default function Login() {
  const navigate = useNavigate();
  const { setUser, lang } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    await new Promise(r => setTimeout(r, 600));

    const account = DEMO_ACCOUNTS.find(a => a.email === email);
    if (account && password === 'demo123') {
      setUser(account);
      navigate({ to: getDashboardPath(account.role) });
    } else {
      setError('Invalid credentials. Use demo accounts below.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <img
              src="/assets/generated/clinic-logo.dim_256x256.png"
              alt="MediQueue"
              className="h-10 w-10 rounded-lg object-cover"
            />
            <span className="font-display font-bold text-2xl text-foreground">MediQueue</span>
          </div>
          <p className="text-sm text-muted-foreground">{t(lang, 'tagline')}</p>
        </div>

        <Card className="shadow-card border-border">
          <CardHeader className="pb-4">
            <CardTitle className="font-display text-xl">{t(lang, 'welcomeBack')}</CardTitle>
            <CardDescription>{t(lang, 'signInToContinue')}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="email">{t(lang, 'email')}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password">{t(lang, 'password')}</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    autoComplete="current-password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full gap-2" disabled={loading}>
                {loading ? (
                  <Activity className="h-4 w-4 animate-spin" />
                ) : (
                  <LogIn className="h-4 w-4" />
                )}
                {loading ? t(lang, 'loading') : t(lang, 'login')}
              </Button>
            </form>

            <div className="mt-4 text-center text-sm text-muted-foreground">
              Don't have an account?{' '}
              <button
                onClick={() => navigate({ to: '/register' })}
                className="text-primary hover:underline font-medium"
              >
                {t(lang, 'register')}
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Demo accounts */}
        <Card className="border-border bg-muted/30">
          <CardContent className="pt-4 pb-4">
            <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wide">Demo Accounts (password: demo123)</p>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_ACCOUNTS.map(acc => (
                <button
                  key={acc.id}
                  onClick={() => { setEmail(acc.email); setPassword('demo123'); }}
                  className="text-left p-2 rounded-md border border-border hover:bg-card hover:border-primary/30 transition-colors"
                >
                  <p className="text-xs font-medium text-foreground capitalize">{acc.role}</p>
                  <p className="text-xs text-muted-foreground truncate">{acc.email}</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          <button onClick={() => navigate({ to: '/' })} className="hover:text-foreground transition-colors">
            ← Back to home
          </button>
        </p>
      </div>
    </div>
  );
}
