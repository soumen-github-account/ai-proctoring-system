import React from 'react'
import StateSection from '../components/StatCard'
import Toolbar from '../components/Toolbar'
import CandidatesTable from '../components/CandidatesTable'
import { candidates } from '../assets/data'

const ManageCandidate = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">
        Manage Candidates
      </h1>

      {/* Stats */}
      <StateSection />

      {/* Toolbar */}
      <Toolbar />

      {/* Table */}
      <CandidatesTable data={candidates} />
    </div>
  )
}

export default ManageCandidate
