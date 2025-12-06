# Project Management App - Frontend

Modern React SPA for managing projects and tasks with drag-and-drop reordering.

## 🚀 Tech Stack

- **Framework**: React 18.2.0 with Hooks
- **Build Tool**: Vite
- **UI Library**: Material-UI (MUI) v5
- **Routing**: React Router v6
- **State Management**: Context API + useReducer
- **Drag & Drop**: @dnd-kit
- **HTTP Client**: Axios
- **Testing**: Vitest + React Testing Library
- **Language**: TypeScript
- **Container**: Docker

## 📋 Features

- **Authentication**: Login, registration, persistent sessions (JWT in localStorage)
- **Project Management**: Create, view, edit, delete projects
- **Task Management**: Add, complete, delete tasks
- **Drag & Drop**: Reorder tasks with intuitive drag handles
- **Protected Routes**: Automatic redirect to login for unauthenticated users
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Accessible**: ARIA labels, keyboard navigation support
- **Code Splitting**: Lazy-loaded routes for optimal performance
- **Error Handling**: User-friendly error messages and loading states

## 🏗️ Architecture

### Component Structure

```
src/
├── components/
│   ├── ProjectList.tsx      # Home page - list all projects
│   ├── ProjectForm.tsx      # Create/edit project form
│   ├── ProjectDetail.tsx    # Project details with tasks
│   ├── ProtectedRoute.tsx   # Auth guard for routes
│   └── HelloWorld.tsx       # Phase 1 test component
├── pages/
│   ├── Login.tsx            # Login page
│   └── Register.tsx         # Registration page
├── context/
│   ├── AuthContext.tsx      # Authentication state & actions
│   ├── ProjectContext.tsx   # Project/task state & actions
│   └── AuthContextInit.ts   # Auth context initialization
├── services/
│   └── api.ts               # API client & endpoints
├── test/
│   └── setup.ts             # Vitest configuration
├── App.tsx                  # Root component with routing
└── main.tsx                 # App entry point
```

### State Management

#### Auth Context
Manages authentication state using `useReducer`:

**State:**
- `user`: Current user object
- `token`: JWT authentication token
- `loading`: Auth operation in progress
- `error`: Error message

**Actions:**
- `login(email, password)`
- `register(email, password, password_confirmation)`
- `logout()`
- `loadUser()` - Restore session from localStorage

#### Project Context
Manages projects and tasks using `useReducer`:

**State:**
- `projects`: Array of all projects
- `currentProject`: Currently viewed project
- `loading`: Data fetching in progress
- `error`: Error message

**Actions:**
- `fetchProjects()`
- `addProject(project)`
- `updateProject(project)`
- `deleteProject(id)`
- `addTask(task)`
- `updateTask(task)`
- `deleteTask(id)`

### API Service Layer

Located in `src/services/api.ts`:

```typescript
// Authentication
register(email, password, password_confirmation)
login(email, password)
me()

// Projects
getProjects()
getProject(id)
createProject(project)
updateProject(id, project)
deleteProject(id)

// Tasks
createTask(projectId, task)
updateTask(id, task)
deleteTask(id)
reorderTasks(projectId, taskIds)
```

All API calls automatically include JWT token in `Authorization` header via Axios interceptor.

## 🎨 UI Components

Built with Material-UI components:

- **AppBar**: Top navigation with user menu
- **Card**: Project cards and containers
- **List**: Task lists with checkboxes
- **TextField**: Form inputs
- **Button**: Actions (primary, secondary, outlined)
- **IconButton**: Delete, edit, drag actions
- **Alert**: Error and success messages
- **CircularProgress**: Loading indicators
- **Dialog**: Modals and confirmations

## 🔐 Authentication Flow

1. User visits protected route → Redirected to `/login`
2. User logs in → JWT token stored in `localStorage`
3. Token attached to all API requests via Axios interceptor
4. On app load → Token validated, user session restored
5. User logs out → Token removed, redirected to `/login`

## 🚦 Routing

| Route | Component | Protected | Description |
|-------|-----------|-----------|-------------|
| `/login` | Login | No | Login page |
| `/register` | Register | No | Registration page |
| `/` | ProjectList | Yes | Home - all projects |
| `/projects/new` | ProjectForm | Yes | Create new project |
| `/projects/:id` | ProjectDetail | Yes | View project & tasks |
| `/projects/:id/edit` | ProjectForm | Yes | Edit project |

## 🛠️ Setup & Installation

### Prerequisites

- Docker
- Docker Compose

### Environment Variables

Create `.env` file (optional):

```env
VITE_API_URL=http://localhost:3000
```

### Installation

1. **Start services:**
   ```bash
   docker compose up
   ```

2. **Frontend available at:** http://localhost:5173

### Demo Account

Use seeded demo account:
- Email: `demo@example.com`
- Password: `Password123`

## 🧪 Testing

### Run Tests
```bash
docker compose exec web npm test
```

### Run Tests in Watch Mode
```bash
docker compose exec web npm test -- --watch
```

### Test Coverage
- **9 tests** covering:
  - HelloWorld component (loading, success, error states)
  - ProjectList component
  - ProjectForm component

### Writing Tests

Tests use Vitest + React Testing Library:

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

## 🎨 Code Quality

### Run ESLint
```bash
docker compose exec web npm run lint
```

### Fix ESLint Issues
```bash
docker compose exec web npm run lint -- --fix
```

### Build for Production
```bash
docker compose exec web npm run build
```

## 🔧 Development

### Install Dependency
```bash
docker compose exec web npm install package-name
```

### Vite Dev Server
Hot module replacement (HMR) is enabled by default in development mode.

### Component Development

Example component with Material-UI:

```typescript
import { Button, Box } from '@mui/material';
import { useState } from 'react';

function MyComponent() {
  const [count, setCount] = useState(0);
  
  return (
    <Box sx={{ p: 2 }}>
      <Button 
        variant="contained" 
        onClick={() => setCount(count + 1)}
      >
        Count: {count}
      </Button>
    </Box>
  );
}
```

## 📦 Key Dependencies

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.x",
    "@mui/material": "^5.x",
    "@mui/icons-material": "^5.x",
    "@dnd-kit/core": "^6.x",
    "@dnd-kit/sortable": "^8.x",
    "axios": "^1.x"
  },
  "devDependencies": {
    "typescript": "^5.x",
    "vite": "^5.x",
    "vitest": "^1.x",
    "@testing-library/react": "^14.x"
  }
}
```

## 🎯 Features Showcase

### Drag & Drop Tasks
- Grab the drag handle (⋮⋮) icon on any task
- Drag up or down to reorder
- Changes save automatically to the backend
- Keyboard accessible (Tab + Space/Enter to activate, Arrow keys to move)

### Optimistic Updates
UI updates immediately when:
- Creating a task
- Toggling task completion
- Reordering tasks
- Rollback occurs if API call fails

### Form Validation
- Email format validation on registration
- Password length requirements (8+ chars)
- Password confirmation match check
- Real-time validation feedback

### Responsive Design
- Mobile: Stacked layout, touch-friendly buttons
- Tablet: 2-column grid for projects
- Desktop: Full-width with optimal spacing

## 🐛 Troubleshooting

### Clear Browser Cache
```bash
# In browser DevTools Console
localStorage.clear()
location.reload()
```

### View Network Requests
Open DevTools → Network tab to see API calls and responses

### Rebuild Container
```bash
docker compose build web
docker compose up
```

### Check Logs
```bash
docker compose logs -f web
```

## 📝 Notes

- JWT tokens expire after 24 hours
- LocalStorage used for token persistence
- Drag & Drop requires pointer/touch device or keyboard
- API calls are automatically retried once on network errors
- Material-UI theme is customizable in `App.tsx`

## 🚀 Performance Optimizations

- **Code Splitting**: Routes lazy-loaded with `React.lazy()`
- **Suspense Boundaries**: Loading fallbacks for async components
- **Memo/Callback**: Optimized re-renders with `useCallback`
- **Bundle Size**: Tree-shaking enabled via Vite
- **Asset Optimization**: Vite automatic asset optimization

## ♿ Accessibility

- **ARIA Labels**: All interactive elements labeled
- **Keyboard Navigation**: Full keyboard support for drag & drop
- **Screen Reader**: Semantic HTML and ARIA roles
- **Focus Management**: Visible focus indicators
- **Color Contrast**: WCAG AA compliant

## 🌐 Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile browsers: iOS Safari, Chrome Mobile

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Material-UI Documentation](https://mui.com)
- [React Router Documentation](https://reactrouter.com)
- [dnd-kit Documentation](https://docs.dndkit.com)
- [Vite Documentation](https://vitejs.dev)
