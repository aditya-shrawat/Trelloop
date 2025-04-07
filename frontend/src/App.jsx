import React from 'react'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import LandingPage from './Pages/LandingPage'


const router = createBrowserRouter([
  { path:'/', element:<LandingPage /> },
])

const App = () => {
  return (
    <RouterProvider router={router} />
  )
}

export default App