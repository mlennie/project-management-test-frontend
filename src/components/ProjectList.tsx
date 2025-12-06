import { useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
  Alert,
  Box,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useProjects } from '../context/ProjectContext';
import * as api from '../services/api';

function ProjectList() {
  const navigate = useNavigate();
  const { state, dispatch } = useProjects();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const projects = await api.getProjects();
      dispatch({ type: 'SET_PROJECTS', payload: projects });
    } catch (error) {
      console.error('Error loading projects:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load projects' });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      await api.deleteProject(id);
      dispatch({ type: 'DELETE_PROJECT', payload: id });
    } catch (error) {
      console.error('Error deleting project:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete project' });
    }
  };

  if (state.loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Projects
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/projects/new')}
        >
          New Project
        </Button>
      </Box>

      {state.error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {state.error}
        </Alert>
      )}

      {state.projects.length === 0 ? (
        <Box textAlign="center" py={8}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No projects yet
          </Typography>
          <Typography color="text.secondary" paragraph>
            Create your first project to get started
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/projects/new')}
          >
            Create Project
          </Button>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 3 }}>
          {state.projects.map((project) => (
            <Box key={project.id} sx={{ width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.333% - 16px)' } }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="h2" gutterBottom>
                    {project.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {project.description || 'No description'}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => navigate(`/projects/${project.id}`)}>
                    View
                  </Button>
                  <Button size="small" onClick={() => navigate(`/projects/${project.id}/edit`)}>
                    Edit
                  </Button>
                  <Button size="small" color="error" onClick={() => handleDelete(project.id)}>
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Box>
          ))}
        </Box>
      )}
    </Container>
  );
}

export default ProjectList;

