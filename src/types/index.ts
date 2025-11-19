export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type ProjectStatus = 'ACTIVE' | 'COMPLETED' | 'ON_HOLD';

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  tasks?: Task[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  projectId: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  assignedTo?: string;
}

export interface TeamMember {
    id: string;
    name: string;
    email: string;
}