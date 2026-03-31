import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface backendInterface {
    addDepartment(department: string, employees: Array<string>, queuesList: Array<string>): Promise<void>;
    addEmployee(department: string, employee: string): Promise<void>;
    addQueue(department: string, queue: string): Promise<void>;
    checkInVisitor(visitorType: string, visitorId: bigint, queueId: string, employeeId: string | null): Promise<void>;
    createAdminLogs(user: string, action: string): Promise<void>;
    createNewId(counter: bigint): Promise<bigint>;
    getAdminLogs(): Promise<Array<[string, string]>>;
    getDepartments(): Promise<Array<[string, Array<string>]>>;
    getEmployees(): Promise<Array<[string, string]>>;
    getQueues(): Promise<Array<[string, Array<string>]>>;
    getVisitorCheckinRecords(): Promise<Array<[bigint, string]>>;
    updateQueueMode(queueId: string): Promise<void>;
    viewQueueStatus(queueId: string): Promise<string>;
}
