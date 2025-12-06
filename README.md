# Project Management App - Frontend

A modern React 18.2.0 application built with Vite and Material-UI for managing projects and tasks.

## 🛠️ Technology Stack

- **React**: 18.2.0
- **Build Tool**: Vite 7.2.6
- **Language**: TypeScript 5.9.3
- **UI Library**: Material-UI (MUI) v7
- **Styling**: Emotion (CSS-in-JS)
- **HTTP Client**: Axios
- **Testing**: Vitest + React Testing Library
- **State Management**: useReducer (Phase 2+)
- **Routing**: React Router v6 (Phase 2+)

## 📋 Prerequisites

- Docker
- Docker Compose
- Node.js 20+ (for local development without Docker)

## 🚀 Getting Started

### Option 1: Using Docker (Recommended)

From the backend directory (sibling to frontend):

```bash
cd ../backend
docker compose up
```

This starts the entire stack:
- Frontend (http://localhost:5173)
- Backend API (http://localhost:3000)
- PostgreSQL database

### Option 2: Local Development

```bash
npm install
npm run dev
```

**Note**: The backend API must be running for the app to work.

## 🧪 Running Tests

### Using Docker

```bash
docker compose exec web npm test
```

### Locally

```bash
npm test
```

### Run tests in watch mode

```bash
npm test -- --watch
```

### Run tests with coverage

```bash
npm test -- --coverage
```

## 🔍 Code Quality

### Run ESLint

```bash
npm run lint
```

### Build for production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

## 🌐 Environment Variables

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:3000
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── HelloWorld.tsx
│   │   └── HelloWorld.test.tsx
│   ├── test/
│   │   └── setup.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
├── Dockerfile
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## 🎨 Component Architecture (Phase 1)

```
App
└── HelloWorld
    ├── Loading State (CircularProgress)
    ├── Error State (Alert)
    └── Success State (Paper + Typography)
```

## 🧩 Material-UI Components Used

- `Container`: Page layout and max-width control
- `Paper`: Card-like elevated surfaces
- `Typography`: Text with consistent styling
- `CircularProgress`: Loading spinner
- `Box`: Flexible layout container
- `ThemeProvider`: Global theme configuration

## 🎨 Theme Configuration

The app uses a custom Material-UI theme:

```typescript
{
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',  // Blue
    },
    secondary: {
      main: '#dc004e',  // Pink
    },
  },
}
```

## 🔧 Development

### Access container shell

```bash
docker compose exec web sh
```

### Install new package

```bash
docker compose exec web npm install <package-name>
```

Or locally:

```bash
npm install <package-name>
```

### View logs

```bash
docker compose logs -f web
```

## 📝 Testing Strategy

- **Unit tests**: Pure functions, utilities, helpers
- **Component tests**: React components with user interactions
- **Integration tests**: Multiple components working together
- **Mocking**: API calls mocked with Vitest mock functions

### Test Coverage

Current test coverage for Phase 1:
- ✅ HelloWorld component: 4/4 tests passing
  - Loading state
  - Success state with API data
  - Error state on API failure
  - Correct API endpoint called

## 🔄 State Management (Phase 2+)

The app will use:
- `useReducer` for complex state logic
- Context API for global state
- Local state with `useState` for component-specific state

## 🛣️ Routing Structure (Phase 2+)

```
/                           # Home - Project List
/projects/new               # Create New Project  
/projects/:id               # Project Detail with Tasks
/projects/:id/edit          # Edit Project
```

## 🔐 API Integration

### Base URL

```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
```

### Example API Call

```typescript
import axios from 'axios';

const response = await axios.get(`${API_URL}/api/v1/hello`);
```

## 🚀 Build and Deployment

### Build for production

```bash
npm run build
```

Output will be in the `dist/` directory.

### Preview production build locally

```bash
npm run preview
```

## 🔄 Continuous Integration

GitHub Actions automatically runs on every push:
- ESLint linting
- Vitest test suite
- Build verification

See `.github/workflows/test.yml` for details.

## 📊 Performance Optimization

- Code splitting with React.lazy (Phase 2+)
- Tree shaking via Vite
- Optimized production builds
- Fast refresh during development

## ♿ Accessibility

- Semantic HTML elements
- ARIA labels where needed
- Keyboard navigation support
- Screen reader friendly
- Material-UI built-in accessibility features

## 🎯 Future Features (Phase 2+)

- [ ] Project CRUD operations
- [ ] Task management
- [ ] React Router for navigation
- [ ] Form validation with React Hook Form
- [ ] Optimistic UI updates
- [ ] Toast notifications (notistack)
- [ ] Dark mode toggle
- [ ] User authentication
- [ ] Protected routes

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Material-UI Documentation](https://mui.com/)
- [Vitest Documentation](https://vitest.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Ensure tests pass: `npm test`
4. Ensure linting passes: `npm run lint`
5. Commit your changes
6. Push to the branch
7. Create a Pull Request

## 🐛 Troubleshooting

### Port already in use

If port 5173 is already in use:

```bash
docker compose down
docker compose up
```

### Hot reload not working

Make sure volumes are properly mounted in docker-compose.yml:

```yaml
volumes:
  - ../frontend:/app
  - /app/node_modules
```

### Cannot connect to API

1. Ensure backend is running: `docker compose ps`
2. Check VITE_API_URL environment variable
3. Verify CORS configuration in backend

## 📄 License

This project is part of a technical assessment.
