import React, { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'

const LandingPage = lazy(() => import('./Pages/LandingPage'));
import SignInPage from './Pages/SignInPage'
import SignupPage from './Pages/SignupPage'
const HomePage = lazy(() => import('./Pages/HomePage'));
import ErrorPage from './Pages/ErrorPage'
const Layout = lazy(() => import('./Components/Layout'));
const Workspace = lazy(() => import('./Pages/Workspace'));
const CardDetailsModel = lazy(() => import('./Components/CardDetailsModel'));
const Board = lazy(() => import('./Pages/Board'));
import Loading from './Pages/Loading'
import { useUser } from './Contexts/UserContext';

// Protected Route Component
const ProtectedRoute = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const { user, userLoading } = useUser();

  if (!isLoaded || userLoading) return <Loading />;
  if (!isSignedIn || !user) return <Navigate to="/user/signin" replace />;

  return <Outlet />;
};


// Router Configuration
const router = createBrowserRouter([
  { path: '/', element: <Suspense fallback={<Loading />}><LandingPage /></Suspense> },

  { path: '/user/signin', element: <SignInPage /> },
  { path: '/user/signup', element: <SignupPage /> },

  { // Protected Routes
    element: <ProtectedRoute />,
    children: [
      {
        element: <Suspense fallback={<Loading />}><Layout /></Suspense>,
        children: [
          { path: '/home', element: <Suspense fallback={<Loading />}><HomePage /></Suspense> },
          { path: '/myBoards', element: <Suspense fallback={<Loading />}><HomePage /></Suspense> },
          { path: '/deadlines', element: <Suspense fallback={<Loading />}><HomePage /></Suspense> },
          { path: '/myWorkspaces', element: <Suspense fallback={<Loading />}><HomePage /></Suspense> },
          { path: '/workspace/:name/:id/:contentType', element: <Suspense fallback={<Loading />}><Workspace /></Suspense> },
          { path: '/card/:name/:id', element: <Suspense fallback={<Loading />}><CardDetailsModel /></Suspense> },
        ]
      },
      { path: '/board/:name/:id', element: <Suspense fallback={<Loading />}><Board /></Suspense> },
    ]
  },

  { path: '*', element: <ErrorPage /> }
]);

const App = () => <RouterProvider router={router} />;

export default App;