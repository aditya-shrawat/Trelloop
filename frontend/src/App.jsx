import React, { lazy, Suspense } from 'react'
import { Navigate, Outlet, useLocation, useRoutes } from 'react-router-dom'
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
import { Toaster } from 'react-hot-toast';

// Protected Route Component
const ProtectedRoute = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const { user, userLoading } = useUser();

  if (!isLoaded || userLoading) return <Loading />;
  if (!isSignedIn || !user) return <Navigate to="/user/signin" replace />;

  return <Outlet />;
};

// Public-only Route Component 
const PublicOnlyRoute = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const { user, userLoading } = useUser();

  if (!isLoaded || userLoading) return <Loading />;
  if (isSignedIn && user) return <Navigate to="/home" replace />;

  return <Outlet />;
};


// Router Configuration
const routesConfig = [
  { // Public-only routes
    element: <PublicOnlyRoute />,
    children: [
      { path: '/', element: <LandingPage /> },
      { path: '/user/signin', element: <SignInPage /> },
      { path: '/user/signup', element: <SignupPage /> },
    ]
  },

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
];

const AppRoutes = ()=>{
  const location = useLocation();
  const backgroundLocation = location.state?.backgroundLocation;

  const routes = useRoutes(routesConfig, backgroundLocation || location);

  // Separate routes just for the card overlay
  const modalRoutes = useRoutes([
    { path: '/card/:name/:id', element: <Suspense fallback={<Loading />}><CardDetailsModel /></Suspense> },
    { path: '*', element: null }
  ]);

  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      {routes}
      {backgroundLocation && modalRoutes}
    </>
  )
}

const App = () => <AppRoutes />;

export default App;