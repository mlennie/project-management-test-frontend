import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate } from "react-router-dom";
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";
import { ProjectProvider } from "./context/ProjectContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Lazy load route components for code splitting
const ProjectList = lazy(() => import("./components/ProjectList"));
const ProjectForm = lazy(() => import("./components/ProjectForm"));
const ProjectDetail = lazy(() => import("./components/ProjectDetail"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

// Loading fallback component
function LoadingFallback() {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="50vh"
    >
      <CircularProgress />
    </Box>
  );
}

function NavBar() {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();

  return (
    <AppBar position="static">
      <Toolbar sx={{ gap: 2 }}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
            Project Management
          </Link>
        </Typography>
        {token && user ? (
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="body2">{user.email}</Typography>
            <Button color="inherit" onClick={() => { logout(); navigate("/login"); }}>
              Logout
            </Button>
          </Box>
        ) : (
          <Box display="flex" gap={1}>
            <Button color="inherit" onClick={() => navigate("/login")}>Login</Button>
            <Button color="inherit" onClick={() => navigate("/register")}>Register</Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <ProjectProvider>
          <BrowserRouter>
            <NavBar />
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <ProjectList />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/projects/new"
                  element={
                    <ProtectedRoute>
                      <ProjectForm />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/projects/:id"
                  element={
                    <ProtectedRoute>
                      <ProjectDetail />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/projects/:id/edit"
                  element={
                    <ProtectedRoute>
                      <ProjectForm />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </ProjectProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
