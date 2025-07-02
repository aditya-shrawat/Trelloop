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


const router = createBrowserRouter([
  { path:'/', element:<LandingPage /> },
  {
    path:"/",
    element: (
      <Layout />
    ),
    children:[
      {path:'/workspace/:name/:id/:contentType', element: <Workspace /> },
      {path:'/board/:name/:id', element: <Board /> },
      {path:'/card/:name/:id', element: <CardDetailsModel /> }, 
    ]
  },
  {path:'/home', element: <HomePage /> },
  {path:'/myBoards', element: <HomePage /> },
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