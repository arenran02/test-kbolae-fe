import { createBrowserRouter, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login.tsx'
import AuthCallback from './pages/AuthCallback'
import Register from './pages/Register'
import Profile from './pages/Profile'
import SearchUsers from './pages/SearchUsers'
import Pins from './pages/Pins'
import Friends from './pages/Friends'
import NavBar from './components/NavBar'
import { useAuth } from './store/auth'

function Guard({ children }: { children: JSX.Element }) {
  const token = useAuth((s) => s.accessToken)
  if (!token) return <Navigate to="/login" replace />
  return children
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <>
        <NavBar />
        <Home />
      </>
    )
  },
  { path: '/login', element: <Login /> },
  { path: '/auth/callback', element: <AuthCallback /> },
  { path: '/register', element: <Register /> },
  {
    path: '/profile',
    element: (
      <>
        <NavBar />
        <Guard>
          <Profile />
        </Guard>
      </>
    )
  },
  {
    path: '/users',
    element: (
      <>
        <NavBar />
        <Guard>
          <SearchUsers />
        </Guard>
      </>
    )
  },
  {
    path: '/pins',
    element: (
      <>
        <NavBar />
        <Guard>
          <Pins />
        </Guard>
      </>
    )
  },
  {
    path: '/friends',
    element: (
      <>
        <NavBar />
        <Guard>
          <Friends />
        </Guard>
      </>
    )
  }
])
