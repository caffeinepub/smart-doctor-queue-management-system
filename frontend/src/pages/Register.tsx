import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Eye, EyeOff, UserPlus, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApp } from '@/lib/AppContext';
import { t } from '@/lib/i18n';
import { type AuthUser, type UserRole, getDashboardPath } from '@/lib/auth';

export default function Register() {
  const navigate = useNavigate();
  const { setUser, lang } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('patient');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !role) {
      setError('Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    await new Promise(r => setTimeout(r, 700));

    const newUser: AuthUser = {
      id: Date.now().toString(),
      name,
      email,
      role,
    };
    setUser(newUser);
    navigate({ to: getDashboardPath(role) });
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
            <CardTitle className="font-display text-xl">{t(lang, 'createAccount')}</CardTitle>
            <CardDescription>{t(lang, 'joinPlatform')}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="name">{t(lang, 'name')}</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your full name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  autoComplete="name"
                />
              </div>

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
                    placeholder="Min. 6 characters"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    autoComplete="new-password"
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

              <div className="space-y-1.5">
                <Label htmlFor="role">{t(lang, 'role')}</Label>
                <Select value={role} onValueChange={v => setRole(v as UserRole)}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="patient">{t(lang, 'patient')}</SelectItem>
                    <SelectItem value="doctor">{t(lang, 'doctor')}</SelectItem>
                    <SelectItem value="admin">{t(lang, 'admin')}</SelectItem>
                    <SelectItem value="superadmin">{t(lang, 'superAdmin')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full gap-2" disabled={loading}>
                {loading ? (
                  <Activity className="h-4 w-4 animate-spin" />
                ) : (
                  <UserPlus className="h-4 w-4" />
                )}
                {loading ? t(lang, 'loading') : t(lang, 'createAccount')}
              </Button>
            </form>

            <div className="mt-4 text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <button
                onClick={() => navigate({ to: '/login' })}
                className="text-primary hover:underline font-medium"
              >
                {t(lang, 'login')}
              </button>
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
