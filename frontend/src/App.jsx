import React from 'react'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import LandingPage from './Pages/LandingPage'
import SignInPage from './Pages/SignInPage'
import SignupPage from './Pages/SignupPage'
import HomePage from './Pages/HomePage'
import ErrorPage from './Pages/ErrorPage'
import Layout from './Components/Layout'
import WorkspaceBoardLayout from './Pages/WorkspaceBoardLayout'
import CardDetailsModel from './Components/CardDetailsModel'


const router = createBrowserRouter([
  { path:'/', element:<LandingPage /> },
  {
    path:"/",
    element: (
      <Layout />
    ),
    children:[
      {path:'/workspace/:name/:id', element: <WorkspaceBoardLayout /> },
      {path:'/workspace/:name/:id/:contentType', element: <WorkspaceBoardLayout /> },
      {path:'/board/:name/:id', element: <WorkspaceBoardLayout /> },
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