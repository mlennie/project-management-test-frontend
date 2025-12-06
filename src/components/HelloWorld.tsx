import { useState, useEffect } from 'react';
import { Container, Typography, CircularProgress, Box, Paper } from '@mui/material';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function HelloWorld() {
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchHelloWorld = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/api/v1/hello`);
        setMessage(response.data.message);
        setError('');
      } catch (err) {
        console.error('Error fetching hello world:', err);
        setError('Failed to fetch message from API');
      } finally {
        setLoading(false);
      }
    };

    fetchHelloWorld();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 3, bgcolor: 'error.light' }}>
          <Typography color="error" variant="h6">
            {error}
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom color="primary">
          {message}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Successfully connected to Rails API!
        </Typography>
      </Paper>
    </Container>
  );
}

export default HelloWorld;

