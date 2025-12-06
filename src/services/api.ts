import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const TOKEN_KEY = "auth_token";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token: string) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
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
  position: number;
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

export interface AuthResponse {
  token: string;
  user: { id: number; email: string };
}

// Auth
export const register = async (email: string, password: string, password_confirmation: string) => {
  const response = await api.post<AuthResponse>("/auth/register", {
    user: { email, password, password_confirmation },
  });
  return response.data;
};

export const login = async (email: string, password: string) => {
  const response = await api.post<AuthResponse>("/auth/login", { email, password });
  return response.data;
};

export const me = async () => {
  const response = await api.get<{ user: { id: number; email: string } }>("/auth/me");
  return response.data;
};

// Projects
export const getProjects = async (): Promise<Project[]> => {
  const response = await api.get("/projects");
  return response.data;
};

export const getProject = async (id: number): Promise<Project> => {
  const response = await api.get(`/projects/${id}`);
  return response.data;
};

export const createProject = async (project: ProjectInput): Promise<Project> => {
  const response = await api.post("/projects", { project });
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

export const reorderTasks = async (projectId: number, taskIds: number[]): Promise<void> => {
  await api.post(`/projects/${projectId}/tasks/reorder`, { task_ids: taskIds });
};

export default api;

