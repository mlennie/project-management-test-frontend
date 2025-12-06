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

function Register() {
  const navigate = useNavigate();
  const { register, error, loading } = useAuth();
  const [form, setForm] = useState({ email: "", password: "", password_confirmation: "" });
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (form.password !== form.password_confirmation) {
      setLocalError("Passwords do not match");
      return;
    }

    try {
      await register(form.email, form.password, form.password_confirmation);
      navigate("/");
    } catch {
      setLocalError("Registration failed");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Register
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
          <TextField
            label="Confirm Password"
            type="password"
            value={form.password_confirmation}
            onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
            required
            fullWidth
          />
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </Button>
        </Box>

        <Typography variant="body2" sx={{ mt: 2 }}>
          Already have an account? <Link to="/login">Login</Link>
        </Typography>
      </Paper>
    </Container>
  );
}

export default Register;

