import {  AddCategory, EditCategory, TaskManager } from './page'
import './App.css'
// import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { PublicLayout } from './LayOut'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const App = () => {
  
  const router = createBrowserRouter([
    {
      element: <PublicLayout />,
      children: [
        {
          path: '/',
          element: <TaskManager />
        },
        {
          path: '/add',
          element: <AddCategory />
        },
        {
          path: '/edit/:id',
          element: <EditCategory />
        }
      ]
    }
  ])


  return (
    <RouterProvider router={router} />
  )
}

export default App
