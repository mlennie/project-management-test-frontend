import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Project {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  tasks?: Task[];
}

export interface Task {
  id: number;
  title: string;
  completed: boolean;
  project_id: number;
  created_at: string;
  updated_at: string;
}

export interface ProjectInput {
  name: string;
  description: string;
}

export interface TaskInput {
  title: string;
  completed?: boolean;
}

// Projects
export const getProjects = async (): Promise<Project[]> => {
  const response = await api.get('/projects');
  return response.data;
};

export const getProject = async (id: number): Promise<Project> => {
  const response = await api.get(`/projects/${id}`);
  return response.data;
};

export const createProject = async (project: ProjectInput): Promise<Project> => {
  const response = await api.post('/projects', { project });
  return response.data;
};

export const updateProject = async (id: number, project: Partial<ProjectInput>): Promise<Project> => {
  const response = await api.put(`/projects/${id}`, { project });
  return response.data;
};

export const deleteProject = async (id: number): Promise<void> => {
  await api.delete(`/projects/${id}`);
};

// Tasks
export const createTask = async (projectId: number, task: TaskInput): Promise<Task> => {
  const response = await api.post(`/projects/${projectId}/tasks`, { task });
  return response.data;
};

export const updateTask = async (id: number, task: Partial<TaskInput>): Promise<Task> => {
  const response = await api.put(`/tasks/${id}`, { task });
  return response.data;
};

export const deleteTask = async (id: number): Promise<void> => {
  await api.delete(`/tasks/${id}`);
};

export default api;

