import React, { useState } from 'react';
import {
  Users, Stethoscope, Clock, CheckCircle, Plus,
  ToggleLeft, ToggleRight, BarChart3, Activity
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import DashboardLayout from '@/components/DashboardLayout';
import { useApp } from '@/lib/AppContext';
import { t } from '@/lib/i18n';
import {
  useGetDepartments,
  useGetAdminLogs,
  useAddDepartment,
  useAddEmployee,
} from '@/hooks/useQueries';

const CHART_DATA = [
  { day: 'Mon', patients: 42 },
  { day: 'Tue', patients: 58 },
  { day: 'Wed', patients: 35 },
  { day: 'Thu', patients: 71 },
  { day: 'Fri', patients: 63 },
  { day: 'Sat', patients: 28 },
  { day: 'Sun', patients: 19 },
];

const CHART_CONFIG = {
  patients: { label: 'Patients', color: 'oklch(0.52 0.14 185)' },
};

interface Doctor {
  id: string;
  name: string;
  department: string;
  active: boolean;
}

const MOCK_DOCTORS: Doctor[] = [
  { id: '1', name: 'Dr. Rajan Kumar', department: 'Cardiology', active: true },
  { id: '2', name: 'Dr. Priya Nair', department: 'General Medicine', active: true },
  { id: '3', name: 'Dr. Suresh Babu', department: 'Orthopedics', active: false },
  { id: '4', name: 'Dr. Kavitha Menon', department: 'Pediatrics', active: true },
];

export default function AdminDashboard() {
  const { lang } = useApp();
  const [doctors, setDoctors] = useState<Doctor[]>(MOCK_DOCTORS);
  const [showAddDept, setShowAddDept] = useState(false);
  const [showAddDoctor, setShowAddDoctor] = useState(false);
  const [newDeptName, setNewDeptName] = useState('');
  const [newDoctorName, setNewDoctorName] = useState('');
  const [newDoctorDept, setNewDoctorDept] = useState('');

  const { data: departments, isLoading: deptLoading } = useGetDepartments();
  const { data: adminLogs, isLoading: logsLoading } = useGetAdminLogs();
  const addDepartment = useAddDepartment();
  const addEmployee = useAddEmployee();

  const toggleDoctor = (id: string) => {
    setDoctors(prev => prev.map(d => d.id === id ? { ...d, active: !d.active } : d));
  };

  const handleAddDept = async () => {
    if (!newDeptName.trim()) return;
    await addDepartment.mutateAsync({ department: newDeptName, employees: [], queuesList: [] });
    setNewDeptName('');
    setShowAddDept(false);
  };

  const handleAddDoctor = async () => {
    if (!newDoctorName.trim() || !newDoctorDept.trim()) return;
    await addEmployee.mutateAsync({ department: newDoctorDept, employee: newDoctorName });
    setDoctors(prev => [...prev, {
      id: Date.now().toString(),
      name: newDoctorName,
      department: newDoctorDept,
      active: true,
    }]);
    setNewDoctorName('');
    setNewDoctorDept('');
    setShowAddDoctor(false);
  };

  const activeDoctors = doctors.filter(d => d.active).length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">{t(lang, 'dashboard')}</h1>
          <p className="text-muted-foreground text-sm mt-1">Clinic administration overview</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: t(lang, 'totalPatients'), value: '127', icon: Users, colorClass: 'text-primary', bgClass: 'bg-primary/10' },
            { label: t(lang, 'activeDoctors'), value: String(activeDoctors), icon: Stethoscope, colorClass: 'text-accent', bgClass: 'bg-accent/10' },
            { label: t(lang, 'avgWaitTime'), value: '18 min', icon: Clock, colorClass: 'text-warning', bgClass: 'bg-warning/10' },
            { label: t(lang, 'completed'), value: '89', icon: CheckCircle, colorClass: 'text-success', bgClass: 'bg-success/10' },
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

        <Tabs defaultValue="analytics">
          <TabsList className="mb-4">
            <TabsTrigger value="analytics">{t(lang, 'analytics')}</TabsTrigger>
            <TabsTrigger value="doctors">{t(lang, 'doctors')}</TabsTrigger>
            <TabsTrigger value="departments">{t(lang, 'departments')}</TabsTrigger>
            <TabsTrigger value="logs">{t(lang, 'adminLogs')}</TabsTrigger>
          </TabsList>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <Card className="shadow-card border-border">
              <CardHeader>
                <CardTitle className="font-display text-lg flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  {t(lang, 'patientVolume')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={CHART_CONFIG} className="h-64 w-full">
                  <BarChart data={CHART_DATA}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="patients" fill="oklch(0.52 0.14 185)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Doctors Tab */}
          <TabsContent value="doctors">
            <Card className="shadow-card border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-display text-lg">{t(lang, 'doctors')}</CardTitle>
                <Button size="sm" onClick={() => setShowAddDoctor(true)} className="gap-1.5">
                  <Plus className="h-4 w-4" />
                  {t(lang, 'addDoctor')}
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t(lang, 'name')}</TableHead>
                      <TableHead>{t(lang, 'department')}</TableHead>
                      <TableHead>{t(lang, 'status')}</TableHead>
                      <TableHead className="text-right">{t(lang, 'action')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {doctors.map(doc => (
                      <TableRow key={doc.id}>
                        <TableCell className="font-medium">{doc.name}</TableCell>
                        <TableCell className="text-muted-foreground">{doc.department}</TableCell>
                        <TableCell>
                          <Badge
                            variant={doc.active ? 'default' : 'secondary'}
                            className={
                              doc.active
                                ? 'bg-success/10 text-success border-success/30'
                                : 'bg-muted text-muted-foreground'
                            }
                          >
                            {doc.active ? t(lang, 'active') : t(lang, 'inactive')}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => toggleDoctor(doc.id)}
                            className="gap-1.5 text-xs"
                          >
                            {doc.active ? (
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
              </CardContent>
            </Card>
          </TabsContent>

          {/* Departments Tab */}
          <TabsContent value="departments">
            <Card className="shadow-card border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-display text-lg">{t(lang, 'departments')}</CardTitle>
                <Button size="sm" onClick={() => setShowAddDept(true)} className="gap-1.5">
                  <Plus className="h-4 w-4" />
                  {t(lang, 'addDepartment')}
                </Button>
              </CardHeader>
              <CardContent>
                {deptLoading ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map(i => <Skeleton key={i} className="h-12 w-full" />)}
                  </div>
                ) : departments && departments.length > 0 ? (
                  <div className="grid sm:grid-cols-2 gap-3">
                    {departments.map(([dept, emps]) => (
                      <div key={dept} className="p-4 rounded-lg border border-border bg-muted/30">
                        <p className="font-semibold text-foreground">{dept}</p>
                        <p className="text-xs text-muted-foreground mt-1">{emps.length} employees</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground text-sm mb-4">{t(lang, 'noData')}</p>
                    <Button size="sm" onClick={() => setShowAddDept(true)} variant="outline" className="gap-1.5">
                      <Plus className="h-4 w-4" />
                      Add your first department
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Logs Tab */}
          <TabsContent value="logs">
            <Card className="shadow-card border-border">
              <CardHeader>
                <CardTitle className="font-display text-lg">{t(lang, 'adminLogs')}</CardTitle>
              </CardHeader>
              <CardContent>
                {logsLoading ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map(i => <Skeleton key={i} className="h-10 w-full" />)}
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
                  <p className="text-sm text-muted-foreground text-center py-8">{t(lang, 'noData')}</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Department Dialog */}
      <Dialog open={showAddDept} onOpenChange={setShowAddDept}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t(lang, 'addDepartment')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label>{t(lang, 'department')}</Label>
              <Input
                placeholder="e.g. Cardiology"
                value={newDeptName}
                onChange={e => setNewDeptName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDept(false)}>
              {t(lang, 'close')}
            </Button>
            <Button onClick={handleAddDept} disabled={addDepartment.isPending}>
              {addDepartment.isPending && <Activity className="h-4 w-4 animate-spin mr-2" />}
              {t(lang, 'save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Doctor Dialog */}
      <Dialog open={showAddDoctor} onOpenChange={setShowAddDoctor}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t(lang, 'addDoctor')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label>{t(lang, 'name')}</Label>
              <Input
                placeholder="Dr. Full Name"
                value={newDoctorName}
                onChange={e => setNewDoctorName(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>{t(lang, 'department')}</Label>
              <Input
                placeholder="e.g. Cardiology"
                value={newDoctorDept}
                onChange={e => setNewDoctorDept(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDoctor(false)}>
              {t(lang, 'close')}
            </Button>
            <Button onClick={handleAddDoctor} disabled={addEmployee.isPending}>
              {addEmployee.isPending && <Activity className="h-4 w-4 animate-spin mr-2" />}
              {t(lang, 'save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
