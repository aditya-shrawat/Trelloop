import React from 'react'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import LandingPage from './Pages/LandingPage'
import SignInPage from './Pages/SignInPage'
import SignupPage from './Pages/SignupPage'
import HomePage from './Pages/HomePage'
import ErrorPage from './Pages/ErrorPage'
import Layout from './Components/Layout'
import WorkspacePage from './Pages/WorkspacePage'


const router = createBrowserRouter([
  { path:'/', element:<LandingPage /> },
  {
    path:"/",
    element: (
      <Layout />
    ),
    children:[
      // {path:'/home', element: <HomePage /> },
      {path:'/workspace/:id/:name', element: <WorkspacePage /> },
      {path:'/workspace/:id/:name/:contentType', element: <WorkspacePage /> },
    ]
  },
  {path:'/home', element: <HomePage /> },
  { path:'/user/signin', element:<SignInPage /> },
  { path:'/user/signup', element:<SignupPage /> },
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