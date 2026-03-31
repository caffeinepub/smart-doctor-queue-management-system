import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import {
  Activity, Clock, Bell, BarChart3, Smartphone, Building2,
  ArrowRight, CheckCircle2, Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import { useApp } from '@/lib/AppContext';
import { t } from '@/lib/i18n';

const features = [
  { icon: Activity, key: 'feature1' },
  { icon: BarChart3, key: 'feature2' },
  { icon: Bell, key: 'feature3' },
  { icon: Clock, key: 'feature4' },
  { icon: Smartphone, key: 'feature5' },
  { icon: Building2, key: 'feature6' },
];

const stats = [
  { value: '10,000+', label: 'Patients Served' },
  { value: '500+', label: 'Clinics' },
  { value: '98%', label: 'Satisfaction Rate' },
  { value: '< 2 min', label: 'Avg Check-in Time' },
];

export default function Landing() {
  const navigate = useNavigate();
  const { lang } = useApp();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 pointer-events-none" />
        <div className="container mx-auto px-4 py-16 md:py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-slide-in">
              <Badge variant="secondary" className="w-fit gap-1.5 text-primary border-primary/20 bg-primary/10">
                <Activity className="h-3 w-3" />
                Smart Queue Management
              </Badge>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground">
                {t(lang, 'heroTitle')}
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
                {t(lang, 'heroSubtitle')}
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Button size="lg" onClick={() => navigate({ to: '/register' })} className="gap-2 font-semibold">
                  {t(lang, 'getStarted')}
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate({ to: '/login' })}>
                  {t(lang, 'login')}
                </Button>
              </div>
              <div className="flex flex-wrap gap-4 pt-2">
                {['No pre-booking needed', 'Real-time updates', 'Multi-role access'].map(item => (
                  <div key={item} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="relative rounded-2xl overflow-hidden shadow-card-hover border border-border">
                <img
                  src="/assets/generated/hero-illustration.dim_1200x600.png"
                  alt="Queue Management Illustration"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
              </div>
              {/* Floating card */}
              <div className="absolute -bottom-4 -left-4 bg-card border border-border rounded-xl p-4 shadow-card-hover">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center">
                    <Activity className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Queue Status</p>
                    <p className="font-semibold text-sm">Token #42 — Now Serving</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-card">
        <div className="container mx-auto px-4 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map(stat => (
              <div key={stat.label} className="text-center">
                <p className="font-display text-3xl font-bold text-primary">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4 text-primary border-primary/20 bg-primary/10">
              {t(lang, 'features')}
            </Badge>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything you need to manage queues
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A complete platform for patients, doctors, and administrators to streamline the clinic experience.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, key }) => (
              <Card key={key} className="group hover:shadow-card-hover transition-shadow duration-200 border-border">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-2">{t(lang, `${key}Title`)}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t(lang, `${key}Desc`)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="about" className="py-16 bg-primary/5 border-y border-border">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Ready to transform your clinic?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Join hundreds of clinics already using MediQueue to reduce wait times and improve patient satisfaction.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button size="lg" onClick={() => navigate({ to: '/register' })} className="gap-2 font-semibold">
              {t(lang, 'getStarted')} <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate({ to: '/login' })}>
              {t(lang, 'login')}
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <img
                src="/assets/generated/clinic-logo.dim_256x256.png"
                alt="MediQueue"
                className="h-7 w-7 rounded object-cover"
              />
              <span className="font-display font-bold text-foreground">{t(lang, 'appName')}</span>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              {t(lang, 'footerTagline')}
            </p>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              © {new Date().getFullYear()} Built with <Heart className="h-3.5 w-3.5 text-destructive fill-destructive" /> using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== 'undefined' ? window.location.hostname : 'mediqueue')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
