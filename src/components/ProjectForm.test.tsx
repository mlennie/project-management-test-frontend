import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ProjectProvider } from '../context/ProjectContext';
import ProjectForm from './ProjectForm';

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <ProjectProvider>
        {component}
      </ProjectProvider>
    </BrowserRouter>
  );
};

describe('ProjectForm', () => {
  it('renders new project form', () => {
    renderWithProviders(<ProjectForm />);
    
    expect(screen.getByText('New Project')).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
  });

  it('has save and cancel buttons', () => {
    renderWithProviders(<ProjectForm />);
    
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });
});

