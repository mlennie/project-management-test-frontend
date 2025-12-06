import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ProjectProvider } from '../context/ProjectContext';
import ProjectList from './ProjectList';
import * as api from '../services/api';

vi.mock('../services/api');
const mockedApi = vi.mocked(api);

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <ProjectProvider>
        {component}
      </ProjectProvider>
    </BrowserRouter>
  );
};

describe('ProjectList', () => {
  it('displays loading state initially', () => {
    mockedApi.getProjects.mockImplementation(() => new Promise(() => {}));
    
    renderWithProviders(<ProjectList />);
    
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('displays projects when loaded', async () => {
    const mockProjects = [
      { id: 1, name: 'Project 1', description: 'Desc 1', created_at: '', updated_at: '' },
      { id: 2, name: 'Project 2', description: 'Desc 2', created_at: '', updated_at: '' },
    ];

    mockedApi.getProjects.mockResolvedValueOnce(mockProjects);

    renderWithProviders(<ProjectList />);

    expect(await screen.findByText('Project 1')).toBeInTheDocument();
    expect(await screen.findByText('Project 2')).toBeInTheDocument();
  });

  it('displays empty state when no projects', async () => {
    mockedApi.getProjects.mockResolvedValueOnce([]);

    renderWithProviders(<ProjectList />);

    expect(await screen.findByText('No projects yet')).toBeInTheDocument();
  });
});

