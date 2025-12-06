import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login, error, loading } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    try {
      await login(form.email, form.password);
      navigate("/");
    } catch {
      setLocalError("Invalid email or password");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>

        {(localError || error) && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {localError || error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            fullWidth
          />
          <TextField
            label="Password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            fullWidth
          />
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </Box>

        <Typography variant="body2" sx={{ mt: 2 }}>
          Don&apos;t have an account? <Link to="/register">Register</Link>
        </Typography>
      </Paper>
    </Container>
  );
}

export default Login;

