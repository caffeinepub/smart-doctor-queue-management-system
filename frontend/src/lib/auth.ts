export type UserRole = 'patient' | 'doctor' | 'admin' | 'superadmin';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

const AUTH_KEY = 'sdq_auth_user';

export function getStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function storeUser(user: AuthUser): void {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
}

export function clearUser(): void {
  localStorage.removeItem(AUTH_KEY);
}

export function getDashboardPath(role: UserRole): string {
  switch (role) {
    case 'patient': return '/patient';
    case 'doctor': return '/doctor';
    case 'admin': return '/admin';
    case 'superadmin': return '/superadmin';
    default: return '/';
  }
}
