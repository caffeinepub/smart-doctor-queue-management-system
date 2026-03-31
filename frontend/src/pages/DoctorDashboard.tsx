import React, { useState } from 'react';
import { Users, Clock, SkipForward, CheckCircle, AlertTriangle, ChevronRight, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import DashboardLayout from '@/components/DashboardLayout';
import { useApp } from '@/lib/AppContext';
import { t } from '@/lib/i18n';
import { useGetQueues, useViewQueueStatus, useUpdateQueueMode } from '@/hooks/useQueries';
import { formatTime } from '@/lib/utils';

interface QueuePatient {
  tokenNumber: number;
  name: string;
  waitMinutes: number;
  status: 'waiting' | 'serving' | 'skipped';
}

// Simulated queue data
const MOCK_PATIENTS: QueuePatient[] = [
  { tokenNumber: 42, name: 'Priya Sharma', waitMinutes: 5, status: 'serving' },
  { tokenNumber: 43, name: 'Ravi Kumar', waitMinutes: 13, status: 'waiting' },
  { tokenNumber: 44, name: 'Meena Devi', waitMinutes: 21, status: 'waiting' },
  { tokenNumber: 45, name: 'Arjun Nair', waitMinutes: 29, status: 'waiting' },
  { tokenNumber: 46, name: 'Sunita Patel', waitMinutes: 37, status: 'waiting' },
];

export default function DoctorDashboard() {
  const { user, lang } = useApp();
  const [patients, setPatients] = useState<QueuePatient[]>(MOCK_PATIENTS);
  const [avgConsultation] = useState(8);

  const { data: queues, isLoading: queuesLoading } = useGetQueues();
  const updateQueueMode = useUpdateQueueMode();

  const currentPatient = patients.find(p => p.status === 'serving');
  const waitingPatients = patients.filter(p => p.status === 'waiting');

  const handleNext = () => {
    setPatients(prev => {
      const updated = [...prev];
      const servingIdx = updated.findIndex(p => p.status === 'serving');
      if (servingIdx !== -1) updated[servingIdx] = { ...updated[servingIdx], status: 'skipped' };
      const nextIdx = updated.findIndex(p => p.status === 'waiting');
      if (nextIdx !== -1) updated[nextIdx] = { ...updated[nextIdx], status: 'serving' };
      return updated;
    });
  };

  const handleComplete = () => {
    setPatients(prev => {
      const updated = [...prev];
      const servingIdx = updated.findIndex(p => p.status === 'serving');
      if (servingIdx !== -1) updated.splice(servingIdx, 1);
      const nextIdx = updated.findIndex(p => p.status === 'waiting');
      if (nextIdx !== -1) updated[nextIdx] = { ...updated[nextIdx], status: 'serving' };
      return updated;
    });
  };

  const handleSkip = (tokenNumber: number) => {
    setPatients(prev =>
      prev.map(p => p.tokenNumber === tokenNumber ? { ...p, status: 'skipped' as const } : p)
    );
  };

  const handleEmergency = (tokenNumber: number) => {
    setPatients(prev => {
      const updated = prev.map(p =>
        p.status === 'serving' ? { ...p, status: 'waiting' as const } : p
      );
      return updated.map(p =>
        p.tokenNumber === tokenNumber ? { ...p, status: 'serving' as const } : p
      );
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            {t(lang, 'welcomeBack')}, {user?.name}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your patient queue efficiently.</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Waiting', value: waitingPatients.length, icon: Users, color: 'text-primary' },
            { label: 'Avg Consult', value: `${avgConsultation} min`, icon: Clock, color: 'text-accent' },
            { label: 'Completed Today', value: '12', icon: CheckCircle, color: 'text-success' },
            { label: 'Skipped', value: patients.filter(p => p.status === 'skipped').length, icon: SkipForward, color: 'text-warning' },
          ].map(stat => (
            <Card key={stat.label} className="shadow-card border-border">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`h-10 w-10 rounded-lg bg-current/10 flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-display font-bold text-xl text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Current Patient */}
        <Card className={`shadow-card border-border ${currentPatient ? 'border-primary/30 bg-primary/5' : ''}`}>
          <CardHeader>
            <CardTitle className="font-display text-lg flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              {t(lang, 'currentPatient')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentPatient ? (
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className="h-14 w-14 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
                    <span className="font-display font-bold text-primary-foreground text-lg">
                      #{currentPatient.tokenNumber}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-lg text-foreground">{currentPatient.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Waiting {formatTime(currentPatient.waitMinutes)}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Button onClick={handleComplete} className="gap-1.5 bg-success hover:bg-success/90 text-success-foreground">
                    <CheckCircle className="h-4 w-4" />
                    {t(lang, 'complete')}
                  </Button>
                  <Button variant="outline" onClick={handleNext} className="gap-1.5">
                    <ChevronRight className="h-4 w-4" />
                    {t(lang, 'nextPatient')}
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm py-4 text-center">No patient currently being served.</p>
            )}
          </CardContent>
        </Card>

        {/* Queue Table */}
        <Card className="shadow-card border-border">
          <CardHeader>
            <CardTitle className="font-display text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Waiting Queue ({waitingPatients.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {waitingPatients.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">{t(lang, 'noData')}</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t(lang, 'tokenNumber')}</TableHead>
                    <TableHead>{t(lang, 'name')}</TableHead>
                    <TableHead>{t(lang, 'waitTime')}</TableHead>
                    <TableHead>{t(lang, 'status')}</TableHead>
                    <TableHead className="text-right">{t(lang, 'action')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {waitingPatients.map(patient => (
                    <TableRow key={patient.tokenNumber}>
                      <TableCell className="font-mono font-semibold">#{patient.tokenNumber}</TableCell>
                      <TableCell className="font-medium">{patient.name}</TableCell>
                      <TableCell className="text-muted-foreground">{formatTime(patient.waitMinutes)}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-warning border-warning/30 bg-warning/10">
                          {t(lang, 'waiting')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-1.5 justify-end">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSkip(patient.tokenNumber)}
                            className="gap-1 text-xs"
                          >
                            <SkipForward className="h-3 w-3" />
                            {t(lang, 'skip')}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEmergency(patient.tokenNumber)}
                            className="gap-1 text-xs text-destructive border-destructive/30 hover:bg-destructive/10"
                          >
                            <AlertTriangle className="h-3 w-3" />
                            {t(lang, 'emergency')}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Queue Status from backend */}
        {queuesLoading ? (
          <Skeleton className="h-24 w-full" />
        ) : queues && queues.length > 0 ? (
          <Card className="shadow-card border-border">
            <CardHeader>
              <CardTitle className="font-display text-lg">{t(lang, 'queueManagement')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {queues.map(([dept, qList]) => (
                  <div key={dept} className="p-3 rounded-lg border border-border bg-muted/30">
                    <p className="font-semibold text-sm text-foreground mb-2">{dept}</p>
                    <div className="flex flex-wrap gap-1">
                      {qList.map(q => (
                        <Badge key={q} variant="outline" className="text-xs">{q}</Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </DashboardLayout>
  );
}
