import React from 'react'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import LandingPage from './Pages/LandingPage'
import SignInPage from './Pages/SignInPage'
import SignupPage from './Pages/SignupPage'
import HomePage from './Pages/HomePage'
import ErrorPage from './Pages/ErrorPage'
import Layout from './Components/Layout'
import Workspace from './Pages/Workspace'
import CardDetailsModel from './Components/CardDetailsModel'
import Board from './Pages/Board'
import MyWorkspaces from './Components/MyWorkspaces'


const router = createBrowserRouter([
  { path:'/', element:<LandingPage /> },
  {
    path:"/",
    element: (
      <Layout />
    ),
    children:[
      {path:'/home', element: <HomePage /> },
      {path:'/myBoards', element: <HomePage /> },
      {path:'/deadlines', element: <HomePage /> },
      {path:'/myWorkspaces', element: <HomePage /> },
      {path:'/workspace/:name/:id/:contentType', element: <Workspace /> },
      {path:'/card/:name/:id', element: <CardDetailsModel /> }, 
    ]
  },
  { path:'/user/signin', element:<SignInPage /> },
  { path:'/user/signup', element:<SignupPage /> },
  {path:'/board/:name/:id', element: <Board /> },
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