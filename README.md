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

## 🌐 Production Deployment

### Live Application

- **Production URL**: https://frontend-seven-omega-br8u0ctqz0.vercel.app
- **Backend API**: https://project-mgmt-api-2cf73f8e0744.herokuapp.com
- **Platform**: Vercel (frontend), Heroku (backend)

### Testing the Live App

1. **Visit**: https://frontend-seven-omega-br8u0ctqz0.vercel.app

2. **Login with demo account**:
   - Email: `demo@example.com`
   - Password: `Password123`

3. **Try the features**:
   - ✅ View the 3 pre-seeded projects
   - ✅ Create a new project
   - ✅ Add tasks to a project
   - ✅ Check/uncheck tasks to toggle completion
   - ✅ Drag tasks to reorder them (use the ⋮⋮ handle)
   - ✅ Edit project details
   - ✅ Delete tasks and projects
   - ✅ Logout and register a new account

4. **Test Registration**:
   - Click "Register" on login page
   - Use any email (doesn't need to be real)
   - Password must be at least 8 characters
   - Create your own projects and tasks!

### Step-by-Step Testing Guide

#### Test 1: Authentication Flow
1. Open https://frontend-seven-omega-br8u0ctqz0.vercel.app/register
2. Register a new account with any email
3. You'll be auto-logged in and redirected to projects list
4. Click "Logout" in the top-right menu
5. Login again at https://frontend-seven-omega-br8u0ctqz0.vercel.app/login

#### Test 2: Create and Manage Projects
1. From the home page, click **"Create New Project"**
2. Enter name: "Test Project" and description: "Testing the app"
3. Click **Create** - you'll be redirected to the project detail page
4. Click the **Edit** button to modify the project
5. Change the name/description and save

#### Test 3: Task Management
1. Open any project from the home page
2. Use the "Add Task" input at the top to create tasks
3. Click the checkbox next to a task to mark it complete (strikethrough appears)
4. Click the **×** button to delete a task
5. Create multiple tasks to test drag-and-drop

#### Test 4: Drag and Drop Reordering
1. Create at least 3 tasks in a project
2. Hover over the **⋮⋮** (drag handle) icon on the left of any task
3. Click and hold, then drag up or down
4. Release to drop - the order is automatically saved
5. Refresh the page to verify the new order persists

#### Test 5: Navigation and Protected Routes
1. From a project detail page, click **"← Back to Projects"**
2. Try to manually visit a protected route: `/projects/999` (you'll get a 404 or error)
3. Open a new incognito window and visit the app
4. Notice you're redirected to `/login` - all routes are protected!

#### Test 6: Error Handling
1. Turn off your internet connection
2. Try to create a project - you'll see an error message
3. Turn internet back on
4. Test rate limiting (if you make too many requests too quickly, you may see 429 errors)

### Deployment Details

**Vercel Configuration:**
- **Build command**: `npm run build`
- **Output directory**: `dist`
- **Framework**: Vite
- **Node version**: 20.x
- **Environment variables**: 
  - `VITE_API_URL=https://project-mgmt-api-2cf73f8e0744.herokuapp.com`

**Setting Environment Variables in Vercel:**
1. Go to https://vercel.com/dashboard
2. Select your project
3. Navigate to **Settings** → **Environment Variables**
4. Add `VITE_API_URL` with value `https://project-mgmt-api-2cf73f8e0744.herokuapp.com`
5. Apply to Production, Preview, and Development
6. Redeploy for changes to take effect

**Vercel CLI Commands:**
```bash
# Link project to Vercel
vercel link

# Deploy to production
vercel --prod

# View deployments
vercel ls

# View deployment logs
vercel logs <deployment-url>

# Set environment variable
vercel env add VITE_API_URL production
# Enter: https://project-mgmt-api-2cf73f8e0744.herokuapp.com

# Pull environment variables locally
vercel env pull
```

**Trigger New Deployment:**
```bash
# Via Git push (automatic deployment)
git push origin main

# Via Vercel CLI
vercel --prod

# Via Vercel Dashboard
Settings → Deployments → Latest → Redeploy
```

### Performance Metrics

- **Build Time**: ~30 seconds
- **Bundle Size**: 
  - Main bundle: ~396 KB (131 KB gzipped)
  - Code-split chunks: 0.17-72 KB each
  - Total initial load: ~140 KB gzipped
- **Lighthouse Scores** (Desktop):
  - Performance: 95+
  - Accessibility: 90+
  - Best Practices: 95+
  - SEO: 90+

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
