import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Main from './pages/Main'
import ProtectedRoute from './components/ProtectedRoute'
import PrivateRoute from './components/PrivateRoute'
import {Toaster} from "react-hot-toast"
import StartingPage from './pages/StartingPage'

const App = () => {
  return (
    <div>
      <Toaster />
      <Routes>
        <Route path='/' element={<ProtectedRoute><StartingPage /></ProtectedRoute>} />
        <Route path='/exam' element={<ProtectedRoute><Main /></ProtectedRoute>} />
        <Route path='/login' element={<PrivateRoute><Login /></PrivateRoute>} />
      </Routes>
    </div>
  )
}

export default App
