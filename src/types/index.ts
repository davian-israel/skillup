import { User, Student, Organization, Task, TaskApplication, Rating, Notification } from '@prisma/client';

export type UserWithProfile = User & {
  student?: Student | null;
  organization?: Organization | null;
};

export type TaskWithOrganization = Task & {
  organization: Organization & {
    user: Pick<User, 'firstName' | 'lastName' | 'avatarUrl'>;
  };
  _count?: {
    applications: number;
  };
};

export type ApplicationWithTask = TaskApplication & {
  task: Task & {
    organization: Organization;
  };
};

export type ApplicationWithStudent = TaskApplication & {
  student: Student & {
    user: Pick<User, 'firstName' | 'lastName' | 'avatarUrl' | 'email'>;
  };
};

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

