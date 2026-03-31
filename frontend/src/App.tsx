import React from 'react';
import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet, redirect } from '@tanstack/react-router';
import { AppProvider, useApp } from '@/lib/AppContext';
import Landing from '@/pages/Landing';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import PatientDashboard from '@/pages/PatientDashboard';
import DoctorDashboard from '@/pages/DoctorDashboard';
import AdminDashboard from '@/pages/AdminDashboard';
import SuperAdminDashboard from '@/pages/SuperAdminDashboard';
import { getStoredUser } from '@/lib/auth';

// Root route with AppProvider wrapper
const rootRoute = createRootRoute({
  component: () => (
    <AppProvider>
      <Outlet />
    </AppProvider>
  ),
});

// Public routes
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Landing,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: Login,
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: Register,
});

// Protected routes
const patientRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/patient',
  beforeLoad: () => {
    const user = getStoredUser();
    if (!user) throw redirect({ to: '/login' });
    if (user.role !== 'patient') throw redirect({ to: '/' });
  },
  component: PatientDashboard,
});

const doctorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/doctor',
  beforeLoad: () => {
    const user = getStoredUser();
    if (!user) throw redirect({ to: '/login' });
    if (user.role !== 'doctor') throw redirect({ to: '/' });
  },
  component: DoctorDashboard,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  beforeLoad: () => {
    const user = getStoredUser();
    if (!user) throw redirect({ to: '/login' });
    if (user.role !== 'admin') throw redirect({ to: '/' });
  },
  component: AdminDashboard,
});

const superAdminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/superadmin',
  beforeLoad: () => {
    const user = getStoredUser();
    if (!user) throw redirect({ to: '/login' });
    if (user.role !== 'superadmin') throw redirect({ to: '/' });
  },
  component: SuperAdminDashboard,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  registerRoute,
  patientRoute,
  doctorRoute,
  adminRoute,
  superAdminRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
