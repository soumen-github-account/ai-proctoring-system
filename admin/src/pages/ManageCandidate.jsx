import React, { useState } from 'react'
import StateSection from '../components/StatCard'
import Toolbar from '../components/Toolbar'
import CandidatesTable from '../components/CandidatesTable'
// import { candidates } from '../assets/data'
import { useEffect } from 'react'
import axios from 'axios'
import { useContext } from 'react'
import { AppContext } from '../contexts/AppContext'
import CandidateReport from '../utils/CandidateReport'

const ManageCandidate = () => {

  const {candidates} = useContext(AppContext)
  const [search, setSearch] = useState("")
  const [filterCndidate, setFilterCandidate] = useState([])
  const [selectedCandidate, setSelectedCandidate] = useState(null)
  

  useEffect(()=>{
    const filtered = candidates.filter((c) => {
      const name = c.student.name.toLowerCase();
      const risk = c.risk.toLowerCase();
      const score = String(c.risk_score)

      return (
        name.includes(search.toLowerCase()) || 
        risk.includes(search.toLowerCase()) ||
        score.includes(search)
      )
    })

    setFilterCandidate(filtered)
  }, [search, candidates])

  if(selectedCandidate){
    return (
      <div className='max-h-[92vh] overflow-y-scroll'>
        <CandidateReport candidate={selectedCandidate} setSelectedCandidate={setSelectedCandidate}/>
      </div>
    )
  } else{
    return (
      <div className="p-6 bg-gray-50 min-h-[92vh]">
        <h1 className="text-2xl font-semibold mb-6">
          Manage Candidates
        </h1>

        {/* Stats */}
        <StateSection />

        {/* Toolbar */}
        <Toolbar search={search} setSearch={setSearch} />

        {/* Table */}
        <CandidatesTable data={filterCndidate} setSelectedCandidate={setSelectedCandidate} />

      </div>  
    )
  }
}

export default ManageCandidate
