import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Main from './pages/Main'
import ProtectedRoute from './components/ProtectedRoute'
import PrivateRoute from './components/PrivateRoute'
import {Toaster} from "react-hot-toast"
import StartingPage from './pages/StartingPage'
import ResultRoute from './components/ResultRoute'
import Result from './pages/Result'
import MobileCamera from './pages/MobileCamera'

const App = () => {
  return (
    <div>
      <Toaster />
      <Routes>
        <Route path='/' element={<ProtectedRoute><ResultRoute><StartingPage /></ResultRoute></ProtectedRoute>} />
        <Route path='/exam' element={<ProtectedRoute><Main /></ProtectedRoute>} />
        <Route path='/login' element={<PrivateRoute><Login /></PrivateRoute>} />
        <Route path='/result' element={<ProtectedRoute><Result /></ProtectedRoute>} />
        <Route path="/mobile" element={<MobileCamera />} />
      </Routes>
    </div>
  )
}

export default App
