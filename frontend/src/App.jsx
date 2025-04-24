import React from 'react'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import LandingPage from './Pages/LandingPage'
import SignInPage from './Pages/SignInPage'
import SignupPage from './Pages/SignupPage'
import HomePage from './Pages/HomePage'
import ErrorPage from './Pages/ErrorPage'
import Layout from './Components/Layout'
import WorkspaceBoardLayout from './Pages/WorkspaceBoardLayout'


const router = createBrowserRouter([
  { path:'/', element:<LandingPage /> },
  {
    path:"/",
    element: (
      <Layout />
    ),
    children:[
      // {path:'/home', element: <HomePage /> },
      {path:'/workspace/:name/:id', element: <WorkspaceBoardLayout /> },
      {path:'/workspace/:name/:id/:contentType', element: <WorkspaceBoardLayout /> },
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