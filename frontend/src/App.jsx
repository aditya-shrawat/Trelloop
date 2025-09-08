import React,{lazy,Suspense} from 'react'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
const LandingPage = lazy(()=>import('./Pages/LandingPage')) ;
import SignInPage from './Pages/SignInPage'
import SignupPage from './Pages/SignupPage'
const HomePage = lazy(()=>import('./Pages/HomePage')) ;
import ErrorPage from './Pages/ErrorPage'
const Layout = lazy(()=>import('./Components/Layout')) ;
const Workspace = lazy(()=>import('./Pages/Workspace')) ;
const CardDetailsModel = lazy(()=>import('./Components/CardDetailsModel')) ;
const Board = lazy(()=>import('./Pages/Board')) ;
import Loading from './Pages/Loading'


const router = createBrowserRouter([
  { path:'/', element:<Suspense fallback={<Loading />}><LandingPage /></Suspense> },
  {
    path:"/",
    element: (
      <Layout />
    ),
    children:[
      {path:'/home', element: <Suspense fallback={<Loading />}><HomePage /></Suspense> },
      {path:'/myBoards', element: <Suspense fallback={<Loading />}><HomePage /></Suspense> },
      {path:'/deadlines', element: <Suspense fallback={<Loading />}><HomePage /></Suspense> },
      {path:'/myWorkspaces', element: <Suspense fallback={<Loading />}><HomePage /></Suspense> },
      {path:'/workspace/:name/:id/:contentType', element: <Suspense fallback={<Loading />}><Workspace /></Suspense> },
      {path:'/card/:name/:id', element: <Suspense fallback={<Loading />}><CardDetailsModel /></Suspense> }, 
    ]
  },
  { path:'/user/signin', element:<SignInPage /> },
  { path:'/user/signup', element:<SignupPage /> },
  {path:'/board/:name/:id', element: <Suspense fallback={<Loading />}><Board /></Suspense> },
  {
    path:'*',
    element:<ErrorPage />
  }
])

const App = () => {
  return (
    <RouterProvider router={router} />
  )
}

export default App