import React from 'react'
import {Routes, Route, Router} from 'react-router-dom'
import {Toaster} from "react-hot-toast"
import Layout from './pages/Layout'
import Dashboard from './pages/Dashboard'
import LiveMonitoring from './pages/LiveMonitoring'
import AllRecord from './pages/AllRecord'
import AddCandidate from './pages/AddCandidate'
import ManageCandidate from './pages/ManageCandidate'
import ExamData from './pages/ExamData'
import ConductExam from './pages/ConductExam'

const App = () => {
  return (
    <div>
      <Toaster />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path='/live-stream' element={<LiveMonitoring />} />
          <Route path='/all-record' element={<AllRecord />} />
          <Route path='/manage-candidate' element={<ManageCandidate />} />
          <Route path='/exam-data' element={<ExamData />} />
          <Route path='/add-candidate' element={<AddCandidate />} />
          <Route path='/conduct-exam' element={<ConductExam />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
