/* eslint react-refresh/only-export-components: off */
import React, { createContext, useContext, useReducer } from 'react';
import type { ReactNode } from 'react';
import type { Project, Task } from '../services/api';

interface State {
  projects: Project[];
  currentProject: Project | null;
  loading: boolean;
  error: string | null;
}

type Action =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_PROJECTS'; payload: Project[] }
  | { type: 'SET_CURRENT_PROJECT'; payload: Project | null }
  | { type: 'ADD_PROJECT'; payload: Project }
  | { type: 'UPDATE_PROJECT'; payload: Project }
  | { type: 'DELETE_PROJECT'; payload: number }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: number };

const initialState: State = {
  projects: [],
  currentProject: null,
  loading: false,
  error: null,
};

function projectReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_PROJECTS':
      return { ...state, projects: action.payload, loading: false };
    case 'SET_CURRENT_PROJECT':
      return { ...state, currentProject: action.payload, loading: false };
    case 'ADD_PROJECT':
      return { ...state, projects: [...state.projects, action.payload] };
    case 'UPDATE_PROJECT':
      return {
        ...state,
        projects: state.projects.map(p =>
          p.id === action.payload.id ? action.payload : p
        ),
        currentProject: state.currentProject?.id === action.payload.id
          ? action.payload
          : state.currentProject,
      };
    case 'DELETE_PROJECT':
      return {
        ...state,
        projects: state.projects.filter(p => p.id !== action.payload),
        currentProject: state.currentProject?.id === action.payload
          ? null
          : state.currentProject,
      };
    case 'ADD_TASK':
      if (!state.currentProject) return state;
      return {
        ...state,
        currentProject: {
          ...state.currentProject,
          tasks: [...(state.currentProject.tasks || []), action.payload],
        },
      };
    case 'UPDATE_TASK':
      if (!state.currentProject) return state;
      return {
        ...state,
        currentProject: {
          ...state.currentProject,
          tasks: (state.currentProject.tasks || []).map(t =>
            t.id === action.payload.id ? action.payload : t
          ),
        },
      };
    case 'DELETE_TASK':
      if (!state.currentProject) return state;
      return {
        ...state,
        currentProject: {
          ...state.currentProject,
          tasks: (state.currentProject.tasks || []).filter(t => t.id !== action.payload),
        },
      };
    default:
      return state;
  }
}

interface ProjectContextType {
  state: State;
  dispatch: React.Dispatch<Action>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(projectReducer, initialState);

  return (
    <ProjectContext.Provider value={{ state, dispatch }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
}

