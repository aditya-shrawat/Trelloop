import React from 'react'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import LandingPage from './Pages/LandingPage'
import SignInPage from './Pages/SignInPage'
import SignupPage from './Pages/SignupPage'


const router = createBrowserRouter([
  { path:'/', element:<LandingPage /> },
  { path:'/user/signin', element:<SignInPage /> },
  { path:'/user/signup', element:<SignupPage /> },
])

const App = () => {
  return (
    <RouterProvider router={router} />
  )
}

export default App