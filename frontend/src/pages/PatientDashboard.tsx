import React, { useEffect, useState } from 'react';
import { Clock, Hash, MapPin, XCircle, History, Activity, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import DashboardLayout from '@/components/DashboardLayout';
import { useApp } from '@/lib/AppContext';
import { t } from '@/lib/i18n';
import { useGetQueues, useGetDepartments, useCheckInVisitor, useGetVisitorCheckinRecords } from '@/hooks/useQueries';
import { getOrdinal, formatTime } from '@/lib/utils';

interface ActiveToken {
  tokenNumber: number;
  queueId: string;
  department: string;
  position: number;
  checkedInAt: Date;
}

export default function PatientDashboard() {
  const { user, lang, addNotification } = useApp();
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedQueue, setSelectedQueue] = useState('');
  const [activeToken, setActiveToken] = useState<ActiveToken | null>(null);
  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState('');

  const { data: departments, isLoading: deptLoading } = useGetDepartments();
  const { data: queues, isLoading: queuesLoading } = useGetQueues();
  const { data: checkinRecords } = useGetVisitorCheckinRecords();
  const checkIn = useCheckInVisitor();

  const deptQueues = queues?.find(([dept]) => dept === selectedDept)?.[1] ?? [];

  // Simulate position polling
  useEffect(() => {
    if (!activeToken) return;
    const interval = setInterval(() => {
      setActiveToken(prev => {
        if (!prev) return null;
        const newPos = Math.max(1, prev.position - 1);
        if (newPos <= 3 && prev.position > 3) {
          addNotification(t(lang, 'yourTurnSoon'));
        }
        return { ...prev, position: newPos };
      });
    }, 10000);
    return () => clearInterval(interval);
  }, [activeToken, addNotification, lang]);

  const handleJoinQueue = async () => {
    if (!selectedDept || !selectedQueue) {
      setJoinError('Please select a department and queue.');
      return;
    }
    setJoinError('');
    setJoining(true);
    try {
      const tokenNum = Math.floor(Math.random() * 90) + 10;
      const visitorId = BigInt(Date.now());
      await checkIn.mutateAsync({
        visitorType: selectedDept,
        visitorId,
        queueId: selectedQueue,
        employeeId: null,
      });
      setActiveToken({
        tokenNumber: tokenNum,
        queueId: selectedQueue,
        department: selectedDept,
        position: Math.floor(Math.random() * 8) + 2,
        checkedInAt: new Date(),
      });
    } catch {
      setJoinError('Failed to join queue. Please try again.');
    }
    setJoining(false);
  };

  const handleCancelToken = () => {
    setActiveToken(null);
    setSelectedDept('');
    setSelectedQueue('');
  };

  const estimatedWait = activeToken ? activeToken.position * 8 : 0;

  // Build visit history from checkin records
  const visitHistory = checkinRecords?.slice(-5).reverse().map(([id, record]) => ({
    id: id.toString(),
    record,
    date: new Date().toLocaleDateString(),
  })) ?? [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            {t(lang, 'welcomeBack')}, {user?.name?.split(' ')[0]}!
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your queue position and visit history.</p>
        </div>

        {/* Active Token Card */}
        {activeToken ? (
          <Card className="border-primary/30 bg-primary/5 shadow-card">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                {/* Token number */}
                <div className="flex-shrink-0 text-center">
                  <div className="h-24 w-24 rounded-2xl bg-primary flex items-center justify-center mx-auto md:mx-0">
                    <div>
                      <p className="text-primary-foreground text-xs font-medium opacity-80">TOKEN</p>
                      <p className="text-primary-foreground font-display text-3xl font-bold">
                        #{activeToken.tokenNumber}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {t(lang, 'queuePosition')}
                    </p>
                    <p className="font-display font-bold text-xl text-foreground">
                      {getOrdinal(activeToken.position)} {t(lang, 'inLine')}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {t(lang, 'estimatedWait')}
                    </p>
                    <p className="font-display font-bold text-xl text-foreground">
                      ~{formatTime(estimatedWait)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                      <Hash className="h-3 w-3" /> Queue
                    </p>
                    <p className="font-semibold text-foreground">{activeToken.queueId}</p>
                    <p className="text-xs text-muted-foreground">{activeToken.department}</p>
                  </div>
                </div>

                {/* QR Code placeholder + cancel */}
                <div className="flex flex-col items-center gap-3">
                  <div className="h-20 w-20 bg-foreground/5 border-2 border-dashed border-border rounded-lg flex items-center justify-center">
                    <div className="grid grid-cols-3 gap-0.5">
                      {Array.from({ length: 9 }).map((_, i) => (
                        <div
                          key={i}
                          className={`h-4 w-4 rounded-sm ${Math.random() > 0.4 ? 'bg-foreground' : 'bg-transparent'}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">QR Check-in</p>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleCancelToken}
                    className="gap-1.5"
                  >
                    <XCircle className="h-3.5 w-3.5" />
                    {t(lang, 'cancel')}
                  </Button>
                </div>
              </div>

              {activeToken.position <= 3 && (
                <Alert className="mt-4 border-warning bg-warning/10">
                  <AlertCircle className="h-4 w-4 text-warning" />
                  <AlertDescription className="text-warning font-medium">
                    {t(lang, 'yourTurnSoon')} You are {getOrdinal(activeToken.position)} in line.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        ) : (
          /* Join Queue Card */
          <Card className="shadow-card border-border">
            <CardHeader>
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                {t(lang, 'joinQueue')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {joinError && (
                <Alert variant="destructive">
                  <AlertDescription>{joinError}</AlertDescription>
                </Alert>
              )}

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">{t(lang, 'selectDepartment')}</label>
                  {deptLoading ? (
                    <Skeleton className="h-10 w-full" />
                  ) : (
                    <Select value={selectedDept} onValueChange={v => { setSelectedDept(v); setSelectedQueue(''); }}>
                      <SelectTrigger>
                        <SelectValue placeholder={t(lang, 'selectDepartment')} />
                      </SelectTrigger>
                      <SelectContent>
                        {departments?.length ? departments.map(([dept]) => (
                          <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                        )) : (
                          <SelectItem value="general">General Medicine</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium">{t(lang, 'selectQueue')}</label>
                  {queuesLoading ? (
                    <Skeleton className="h-10 w-full" />
                  ) : (
                    <Select value={selectedQueue} onValueChange={setSelectedQueue} disabled={!selectedDept}>
                      <SelectTrigger>
                        <SelectValue placeholder={t(lang, 'selectQueue')} />
                      </SelectTrigger>
                      <SelectContent>
                        {deptQueues.length ? deptQueues.map(q => (
                          <SelectItem key={q} value={q}>{q}</SelectItem>
                        )) : (
                          <SelectItem value="queue-a">Queue A</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>

              <Button
                onClick={handleJoinQueue}
                disabled={joining}
                className="gap-2"
              >
                {joining ? <Activity className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                {joining ? t(lang, 'loading') : t(lang, 'joinQueue')}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Visit History */}
        <Card className="shadow-card border-border">
          <CardHeader>
            <CardTitle className="font-display text-lg flex items-center gap-2">
              <History className="h-5 w-5 text-primary" />
              {t(lang, 'visitHistory')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {visitHistory.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">{t(lang, 'noData')}</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Record</TableHead>
                    <TableHead>{t(lang, 'status')}</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visitHistory.map(v => (
                    <TableRow key={v.id}>
                      <TableCell className="font-mono text-sm">{v.id.slice(-6)}</TableCell>
                      <TableCell className="text-sm max-w-xs truncate">{v.record}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-success border-success/30 bg-success/10">
                          Completed
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{v.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
