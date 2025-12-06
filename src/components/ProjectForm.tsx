import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  CircularProgress,
} from '@mui/material';
import { Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';
import { useProjects } from '../context/ProjectContext';
import * as api from '../services/api';

function ProjectForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { dispatch } = useProjects();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (id) {
      loadProject();
    }
  }, [id]);

  const loadProject = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const project = await api.getProject(parseInt(id));
      setFormData({
        name: project.name,
        description: project.description || '',
      });
    } catch (error) {
      console.error('Error loading project:', error);
      setErrors(['Failed to load project']);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);

    if (!formData.name.trim()) {
      setErrors(['Name is required']);
      return;
    }

    try {
      setLoading(true);
      if (id) {
        const updated = await api.updateProject(parseInt(id), formData);
        dispatch({ type: 'UPDATE_PROJECT', payload: updated });
      } else {
        const created = await api.createProject(formData);
        dispatch({ type: 'ADD_PROJECT', payload: created });
      }
      navigate('/');
    } catch (error: any) {
      console.error('Error saving project:', error);
      setErrors(error.response?.data?.errors || ['Failed to save project']);
    } finally {
      setLoading(false);
    }
  };

  if (loading && id) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {id ? 'Edit Project' : 'New Project'}
        </Typography>

        {errors.length > 0 && (
          <Box sx={{ mb: 2, p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
            {errors.map((error, index) => (
              <Typography key={index} color="error">
                {error}
              </Typography>
            ))}
          </Box>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            margin="normal"
            disabled={loading}
          />

          <TextField
            fullWidth
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            multiline
            rows={4}
            margin="normal"
            disabled={loading}
          />

          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              startIcon={<SaveIcon />}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save'}
            </Button>
            <Button
              variant="outlined"
              startIcon={<CancelIcon />}
              onClick={() => navigate('/')}
              disabled={loading}
            >
              Cancel
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}

export default ProjectForm;

