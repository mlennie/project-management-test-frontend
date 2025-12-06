import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Checkbox,
  TextField,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  DragIndicator as DragIcon,
} from '@mui/icons-material';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useProjects } from '../context/ProjectContext';
import * as api from '../services/api';

interface SortableTaskProps {
  task: api.Task;
  onToggle: (taskId: number, completed: boolean) => void;
  onDelete: (taskId: number) => void;
}

function SortableTask({ task, onToggle, onDelete }: SortableTaskProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <ListItem
      ref={setNodeRef}
      style={style}
      sx={{
        bgcolor: 'background.paper',
        cursor: isDragging ? 'grabbing' : 'default',
      }}
    >
      <IconButton
        {...attributes}
        {...listeners}
        size="small"
        sx={{ cursor: 'grab', mr: 1 }}
      >
        <DragIcon />
      </IconButton>
      <Checkbox
        checked={task.completed}
        onChange={() => onToggle(task.id, task.completed)}
      />
      <ListItemText
        primary={task.title}
        sx={{
          textDecoration: task.completed ? 'line-through' : 'none',
          color: task.completed ? 'text.secondary' : 'text.primary',
        }}
      />
      <ListItemSecondaryAction>
        <IconButton
          edge="end"
          onClick={() => onDelete(task.id)}
          size="small"
        >
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
}

function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state, dispatch } = useProjects();
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState<api.Task[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const loadProject = useCallback(async () => {
    if (!id) return;
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const project = await api.getProject(parseInt(id));
      dispatch({ type: 'SET_CURRENT_PROJECT', payload: project });
      setTasks(project.tasks || []);
    } catch (error) {
      console.error('Error loading project:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load project' });
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (id) {
      loadProject();
    }
  }, [id, loadProject]);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim() || !id) return;

    try {
      setLoading(true);
      const task = await api.createTask(parseInt(id), { title: newTaskTitle });
      dispatch({ type: 'ADD_TASK', payload: task });
      setTasks((prev) => [...prev, task]);
      setNewTaskTitle('');
    } catch (error) {
      console.error('Error creating task:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to create task' });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTask = async (taskId: number, completed: boolean) => {
    try {
      const updated = await api.updateTask(taskId, { completed: !completed });
      dispatch({ type: 'UPDATE_TASK', payload: updated });
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? updated : t))
      );
    } catch (error) {
      console.error('Error updating task:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update task' });
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      await api.deleteTask(taskId);
      dispatch({ type: 'DELETE_TASK', payload: taskId });
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete task' });
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id || !id) return;

    const oldIndex = tasks.findIndex((t) => t.id === active.id);
    const newIndex = tasks.findIndex((t) => t.id === over.id);

    const newTasks = arrayMove(tasks, oldIndex, newIndex);
    setTasks(newTasks);

    try {
      await api.reorderTasks(
        parseInt(id),
        newTasks.map((t) => t.id)
      );
    } catch (error) {
      console.error('Error reordering tasks:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to reorder tasks' });
      setTasks(tasks);
    }
  };

  if (state.loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!state.currentProject) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">Project not found</Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/')} sx={{ mt: 2 }}>
          Back to Projects
        </Button>
      </Container>
    );
  }

  const { currentProject: project } = state;

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <IconButton onClick={() => navigate('/')}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1" sx={{ flex: 1 }}>
          {project.name}
        </Typography>
        <Button
          variant="outlined"
          startIcon={<EditIcon />}
          onClick={() => navigate(`/projects/${project.id}/edit`)}
        >
          Edit
        </Button>
      </Box>

      {state.error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => dispatch({ type: 'SET_ERROR', payload: null })}>
          {state.error}
        </Alert>
      )}

      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="body1" color="text.secondary">
          {project.description || 'No description'}
        </Typography>
      </Paper>

      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Tasks ({tasks.length})
        </Typography>

        <Box component="form" onSubmit={handleAddTask} sx={{ mb: 3, display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Add a new task..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            disabled={loading}
          />
          <Button
            type="submit"
            variant="contained"
            startIcon={<AddIcon />}
            disabled={loading || !newTaskTitle.trim()}
          >
            Add
          </Button>
        </Box>

        {tasks.length === 0 ? (
          <Typography color="text.secondary" textAlign="center" py={4}>
            No tasks yet. Add one above to get started!
          </Typography>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={tasks.map((t) => t.id)}
              strategy={verticalListSortingStrategy}
            >
              <List>
                {tasks.map((task, index) => (
                  <Box key={task.id}>
                    {index > 0 && <Divider />}
                    <SortableTask
                      task={task}
                      onToggle={handleToggleTask}
                      onDelete={handleDeleteTask}
                    />
                  </Box>
                ))}
              </List>
            </SortableContext>
          </DndContext>
        )}
      </Paper>
    </Container>
  );
}

export default ProjectDetail;
