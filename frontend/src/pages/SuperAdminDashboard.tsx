import React, { useState } from 'react';
import {
  Building2, Users, Stethoscope, TrendingUp, Shield,
  ToggleLeft, ToggleRight, Activity, DollarSign
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import DashboardLayout from '@/components/DashboardLayout';
import { useApp } from '@/lib/AppContext';
import { t } from '@/lib/i18n';
import { useGetAdminLogs, useGetDepartments, useGetEmployees } from '@/hooks/useQueries';

const REVENUE_DATA = [
  { month: 'Aug', revenue: 12400 },
  { month: 'Sep', revenue: 15800 },
  { month: 'Oct', revenue: 13200 },
  { month: 'Nov', revenue: 18900 },
  { month: 'Dec', revenue: 21500 },
  { month: 'Jan', revenue: 19800 },
  { month: 'Feb', revenue: 24300 },
];

const CHART_CONFIG = {
  revenue: { label: 'Revenue ($)', color: 'oklch(0.62 0.16 155)' },
};

interface Clinic {
  id: string;
  name: string;
  location: string;
  doctors: number;
  patients: number;
  subscription: 'active' | 'trial' | 'expired';
  revenue: string;
  active: boolean;
}

const MOCK_CLINICS: Clinic[] = [
  { id: '1', name: 'Apollo Clinic Chennai', location: 'Chennai, TN', doctors: 12, patients: 340, subscription: 'active', revenue: '$2,400', active: true },
  { id: '2', name: 'Fortis Health Hub', location: 'Bangalore, KA', doctors: 8, patients: 210, subscription: 'active', revenue: '$1,800', active: true },
  { id: '3', name: 'Meenakshi Medical', location: 'Madurai, TN', doctors: 5, patients: 120, subscription: 'trial', revenue: '$0', active: true },
  { id: '4', name: 'City Care Clinic', location: 'Coimbatore, TN', doctors: 3, patients: 85, subscription: 'expired', revenue: '$600', active: false },
  { id: '5', name: 'Rainbow Hospital', location: 'Hyderabad, TS', doctors: 15, patients: 480, subscription: 'active', revenue: '$3,200', active: true },
];

const subscriptionColor: Record<Clinic['subscription'], string> = {
  active: 'bg-success/10 text-success border-success/30',
  trial: 'bg-warning/10 text-warning border-warning/30',
  expired: 'bg-destructive/10 text-destructive border-destructive/30',
};

export default function SuperAdminDashboard() {
  const { lang } = useApp();
  const [clinics, setClinics] = useState<Clinic[]>(MOCK_CLINICS);

  const { data: adminLogs, isLoading: logsLoading } = useGetAdminLogs();
  const { data: departments } = useGetDepartments();
  const { data: employees } = useGetEmployees();

  const toggleClinic = (id: string) => {
    setClinics(prev => prev.map(c => c.id === id ? { ...c, active: !c.active } : c));
  };

  const totalDoctors = clinics.reduce((sum, c) => sum + c.doctors, 0);
  const totalPatients = clinics.reduce((sum, c) => sum + c.patients, 0);
  const activeClinics = clinics.filter(c => c.active).length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">{t(lang, 'platformStats')}</h1>
          <p className="text-muted-foreground text-sm mt-1">Platform-wide overview and management</p>
        </div>

        {/* Platform Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: t(lang, 'totalClinics'), value: String(activeClinics), icon: Building2, colorClass: 'text-primary', bgClass: 'bg-primary/10' },
            { label: t(lang, 'activeDoctors'), value: String(totalDoctors), icon: Stethoscope, colorClass: 'text-accent', bgClass: 'bg-accent/10' },
            { label: 'Total Patients Served', value: String(totalPatients), icon: Users, colorClass: 'text-success', bgClass: 'bg-success/10' },
            { label: t(lang, 'revenue'), value: '$24.3K', icon: DollarSign, colorClass: 'text-warning', bgClass: 'bg-warning/10' },
          ].map(stat => (
            <Card key={stat.label} className="shadow-card border-border">
              <CardContent className="p-5">
                <div className={`h-10 w-10 rounded-lg ${stat.bgClass} flex items-center justify-center mb-3`}>
                  <stat.icon className={`h-5 w-5 ${stat.colorClass}`} />
                </div>
                <p className="font-display font-bold text-2xl text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="clinics">
          <TabsList className="mb-4">
            <TabsTrigger value="clinics">{t(lang, 'clinicManagement')}</TabsTrigger>
            <TabsTrigger value="revenue">{t(lang, 'revenue')}</TabsTrigger>
            <TabsTrigger value="logs">{t(lang, 'adminLogs')}</TabsTrigger>
          </TabsList>

          {/* Clinics Tab */}
          <TabsContent value="clinics">
            <Card className="shadow-card border-border">
              <CardHeader>
                <CardTitle className="font-display text-lg flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  {t(lang, 'clinicManagement')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Clinic</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Doctors</TableHead>
                        <TableHead>Patients</TableHead>
                        <TableHead>{t(lang, 'subscription')}</TableHead>
                        <TableHead>{t(lang, 'revenue')}</TableHead>
                        <TableHead>{t(lang, 'status')}</TableHead>
                        <TableHead className="text-right">{t(lang, 'action')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {clinics.map(clinic => (
                        <TableRow key={clinic.id}>
                          <TableCell className="font-medium">{clinic.name}</TableCell>
                          <TableCell className="text-muted-foreground text-sm">{clinic.location}</TableCell>
                          <TableCell>{clinic.doctors}</TableCell>
                          <TableCell>{clinic.patients}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={`capitalize text-xs ${subscriptionColor[clinic.subscription]}`}
                            >
                              {clinic.subscription}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">{clinic.revenue}</TableCell>
                          <TableCell>
                            <Badge
                              variant={clinic.active ? 'default' : 'secondary'}
                              className={
                                clinic.active
                                  ? 'bg-success/10 text-success border-success/30'
                                  : 'bg-muted text-muted-foreground'
                              }
                            >
                              {clinic.active ? t(lang, 'active') : t(lang, 'inactive')}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => toggleClinic(clinic.id)}
                              className="gap-1.5 text-xs"
                            >
                              {clinic.active ? (
                                <>
                                  <ToggleRight className="h-4 w-4 text-success" />
                                  {t(lang, 'deactivate')}
                                </>
                              ) : (
                                <>
                                  <ToggleLeft className="h-4 w-4" />
                                  {t(lang, 'activate')}
                                </>
                              )}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Revenue Tab */}
          <TabsContent value="revenue">
            <Card className="shadow-card border-border">
              <CardHeader>
                <CardTitle className="font-display text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Revenue Overview (Last 7 Months)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={CHART_CONFIG} className="h-64 w-full">
                  <LineChart data={REVENUE_DATA}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="oklch(0.62 0.16 155)"
                      strokeWidth={2}
                      dot={{ r: 4, fill: 'oklch(0.62 0.16 155)' }}
                    />
                  </LineChart>
                </ChartContainer>

                {/* Subscription summary */}
                <div className="mt-6 grid grid-cols-3 gap-4">
                  {[
                    { label: 'Active Subscriptions', value: clinics.filter(c => c.subscription === 'active').length, colorClass: 'text-success' },
                    { label: 'Trial Accounts', value: clinics.filter(c => c.subscription === 'trial').length, colorClass: 'text-warning' },
                    { label: 'Expired', value: clinics.filter(c => c.subscription === 'expired').length, colorClass: 'text-destructive' },
                  ].map(item => (
                    <div key={item.label} className="text-center p-3 rounded-lg border border-border bg-muted/30">
                      <p className={`font-display font-bold text-2xl ${item.colorClass}`}>{item.value}</p>
                      <p className="text-xs text-muted-foreground mt-1">{item.label}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Logs Tab */}
          <TabsContent value="logs">
            <Card className="shadow-card border-border">
              <CardHeader>
                <CardTitle className="font-display text-lg flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  {t(lang, 'adminLogs')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {logsLoading ? (
                  <div className="space-y-2">
                    {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-10 w-full" />)}
                  </div>
                ) : adminLogs && adminLogs.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t(lang, 'user')}</TableHead>
                        <TableHead>{t(lang, 'action')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {adminLogs.map(([logUser, action], idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-medium">{logUser}</TableCell>
                          <TableCell className="text-muted-foreground">{action}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <Shield className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">{t(lang, 'noData')}</p>
                    <p className="text-xs text-muted-foreground mt-1">Admin activity logs will appear here.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Backend data summary */}
        {(departments && departments.length > 0) || (employees && employees.length > 0) ? (
          <Card className="shadow-card border-border">
            <CardHeader>
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Live Backend Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                {departments && departments.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold mb-2">{t(lang, 'departments')} ({departments.length})</p>
                    <div className="flex flex-wrap gap-1.5">
                      {departments.map(([dept]) => (
                        <Badge key={dept} variant="secondary">{dept}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {employees && employees.length > 0 && (
                  <div>
                    <p className="text-sm font-semibold mb-2">{t(lang, 'doctors')} ({employees.length})</p>
                    <div className="flex flex-wrap gap-1.5">
                      {employees.slice(0, 6).map(([emp]) => (
                        <Badge key={emp} variant="outline">{emp}</Badge>
                      ))}
                      {employees.length > 6 && (
                        <Badge variant="outline">+{employees.length - 6} more</Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </DashboardLayout>
  );
}
