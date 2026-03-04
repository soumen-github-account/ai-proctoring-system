import React from 'react'
import RiskOverview from '../components/RiskOverview';
import FlaggedCandidates from '../components/FlaggedCandidates';

const riskData = [
  { name: "Low Risk", value: 65 },
  { name: "Medium Risk", value: 25 },
  { name: "High Risk", value: 10 }
];


const candidateData = [
  {
    id: "CAND001",
    name: "John Doe",
    exam: "Math Test",
    riskLevel: "High",
    trustScore: 42
  },
  {
    id: "CAND002",
    name: "Emma K",
    exam: "CS Exam",
    riskLevel: "Medium",
    trustScore: 68
  },
  {
    id: "CAND003",
    name: "David P",
    exam: "Final Assessment",
    riskLevel: "Low",
    trustScore: 92
  }
];

const Dashboard = () => {
  return (
    <div className=''>
      <div className="
        w-full
        min-h-[280px]
        bg-[url(./bg.png)]
        bg-center bg-cover bg-no-repeat
        rounded-2xl
        shadow-md
        p-6
      ">

        <h1 className="font-medium text-xl text-gray-700">
          All overview
        </h1>

        <p className="mt-2 text-sm text-gray-700">
          Lorem quas, iusto reiciendis quod rem.
        </p>

        {/* Cards Grid */}
        <div
          className="
            w-full
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-4
            mt-10
            gap-5
            lg:gap-6
          "
        >
          {/* Card 1 */}
          <div className="px-6 py-5 rounded-2xl bg-white/70 backdrop-blur-md border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300">
            <p className="text-3xl font-semibold text-gray-900">120</p>
            <span className="text-sm text-gray-600 mt-1 flex items-center gap-3">
              <p>Total candidates</p>
              <div className="w-2 h-2 rounded-full bg-yellow-500" />
            </span>
          </div>

          {/* Card 2 */}
          <div className="px-6 py-5 rounded-2xl bg-white/70 backdrop-blur-md border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300">
            <p className="text-3xl font-semibold text-gray-900">58</p>
            <span className="text-sm text-gray-600 mt-1 flex items-center gap-3">
              <p>Live candidates</p>
              <div className="w-2 h-2 rounded-full bg-green-500" />
            </span>
          </div>

          {/* Card 3 */}
          <div className="px-6 py-5 rounded-2xl bg-white/70 backdrop-blur-md border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300">
            <p className="text-3xl font-semibold text-gray-900">5</p>
            <span className="text-sm text-gray-600 mt-1 flex items-center gap-3">
              <p>Active Exams</p>
              <div className="w-2 h-2 rounded-full bg-blue-500" />
            </span>
          </div>

          {/* Card 4 */}
          <div className="px-6 py-5 rounded-2xl bg-white/70 backdrop-blur-md border border-white/40 shadow-lg hover:shadow-xl transition-all duration-300">
            <p className="text-3xl font-semibold text-gray-900">10</p>
            <span className="text-sm text-gray-600 mt-1 flex items-center gap-3">
              <p>Flagged Candidates</p>
              <div className="w-2 h-2 rounded-full bg-red-500" />
            </span>
          </div>
        </div>
      </div>


      <div className='grid grid-cols-2 max-sm:grid-cols-1 mt-5 gap-7'>
        <RiskOverview data={riskData} />
        <FlaggedCandidates candidates={candidateData} />
      </div>
    </div>
  )
}

export default Dashboard
