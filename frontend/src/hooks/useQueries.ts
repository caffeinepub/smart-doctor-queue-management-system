import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

// ─── Departments ────────────────────────────────────────────────────────────

export function useGetDepartments() {
  const { actor, isFetching } = useActor();
  return useQuery<Array<[string, Array<string>]>>({
    queryKey: ['departments'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getDepartments();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 5000,
  });
}

export function useAddDepartment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      department,
      employees,
      queuesList,
    }: {
      department: string;
      employees: string[];
      queuesList: string[];
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.addDepartment(department, employees, queuesList);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['departments'] });
    },
  });
}

// ─── Employees ──────────────────────────────────────────────────────────────

export function useGetEmployees() {
  const { actor, isFetching } = useActor();
  return useQuery<Array<[string, string]>>({
    queryKey: ['employees'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getEmployees();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 5000,
  });
}

export function useAddEmployee() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      department,
      employee,
    }: {
      department: string;
      employee: string;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.addEmployee(department, employee);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['departments'] });
    },
  });
}

// ─── Queues ──────────────────────────────────────────────────────────────────

export function useGetQueues() {
  const { actor, isFetching } = useActor();
  return useQuery<Array<[string, Array<string>]>>({
    queryKey: ['queues'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getQueues();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 5000,
  });
}

export function useAddQueue() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      department,
      queue,
    }: {
      department: string;
      queue: string;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.addQueue(department, queue);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['queues'] });
    },
  });
}

export function useViewQueueStatus(queueId: string) {
  const { actor, isFetching } = useActor();
  return useQuery<string>({
    queryKey: ['queueStatus', queueId],
    queryFn: async () => {
      if (!actor) return '';
      return actor.viewQueueStatus(queueId);
    },
    enabled: !!actor && !isFetching && !!queueId,
    refetchInterval: 5000,
  });
}

export function useUpdateQueueMode() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (queueId: string) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.updateQueueMode(queueId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['queues'] });
      queryClient.invalidateQueries({ queryKey: ['queueStatus'] });
    },
  });
}

// ─── Visitor Check-in ────────────────────────────────────────────────────────

export function useGetVisitorCheckinRecords() {
  const { actor, isFetching } = useActor();
  return useQuery<Array<[bigint, string]>>({
    queryKey: ['visitorCheckins'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getVisitorCheckinRecords();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 5000,
  });
}

export function useCheckInVisitor() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      visitorType,
      visitorId,
      queueId,
      employeeId,
    }: {
      visitorType: string;
      visitorId: bigint;
      queueId: string;
      employeeId: string | null;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.checkInVisitor(visitorType, visitorId, queueId, employeeId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visitorCheckins'] });
    },
  });
}

// ─── Admin Logs ──────────────────────────────────────────────────────────────

export function useGetAdminLogs() {
  const { actor, isFetching } = useActor();
  return useQuery<Array<[string, string]>>({
    queryKey: ['adminLogs'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAdminLogs();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 10000,
  });
}

export function useCreateAdminLog() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ user, action }: { user: string; action: string }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.createAdminLogs(user, action);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminLogs'] });
    },
  });
}

export function useCreateNewId() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (counter: bigint) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.createNewId(counter);
    },
  });
}
