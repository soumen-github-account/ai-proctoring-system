import { Users, FileText, AlertTriangle, Video, Search, Eye } from "lucide-react";
import { useEffect, useState } from "react";
// import { allAttempts } from "../assets/data";
import { useContext } from "react";
import { AppContext } from "../contexts/AppContext";
import CandidateReport from "../utils/CandidateReport";
const riskStyles = {
  HIGH: "bg-red-100 text-red-700",
  MEDIUM: "bg-yellow-100 text-yellow-700",
  LOW: "bg-green-100 text-green-700"
};

const ExamData = () => {
  const {candidates, totalCandidate, highRiskedCandidate, activeExams, flaggedCandidate} = useContext(AppContext)
  const [selectedCandidate, setSelectedCandidate] = useState(null)
  const [search, setSearch] = useState("");

  const filtered = candidates.filter(
    d =>
      d.student.name.toLowerCase().includes(search.toLowerCase()) ||
      d.exam_name.toLowerCase().includes(search.toLowerCase())
    );

    console.log(selectedCandidate)

  if(selectedCandidate){
    return (
      <div className='max-h-[92vh] overflow-y-scroll'>
        <CandidateReport candidate={selectedCandidate} setSelectedCandidate={setSelectedCandidate}/>
      </div>
    )
  } else{
    return (
      <div className="p-6 bg-gray-50 min-h-screen">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold">All Exam Data</h1>
          <p className="text-gray-500">
            Students • Exams • Attempts • AI Analysis
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          <SummaryCard title="Total Exams" value={activeExams} icon={<FileText />} />
          <SummaryCard title="Total Students" value={totalCandidate} icon={<Users />} />
          <SummaryCard title="Total Attempts" value={totalCandidate} icon={<AlertTriangle />} />
          <SummaryCard title="Flagged Cases" value={flaggedCandidate} icon={<AlertTriangle />} danger />
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-3 mb-6">
          <Search size={18} className="text-gray-400" />
          <input
            placeholder="Search student or exam..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full outline-none"
          />
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="px-4 py-3 text-left">Student</th>
                <th>Exam</th>
                <th>Status</th>
                <th>Score</th>
                <th>Violations</th>
                <th>Risk</th>
                <th>Violations</th>
                <th>Terminated</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map(row => (
                <tr key={row.id} className="border-t-1 border-t-gray-300 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium">{row.student.name}</p>
                    <p className="text-xs text-gray-500">{row.student.email}</p>
                  </td>

                  <td>
                    <p className="font-medium">{row.exam_name}</p>
                    <p className="text-xs text-gray-500">{row.subject}</p>
                  </td>

                  <td className="font-medium">
                    {row.status}
                  </td>

                  <td className="font-semibold">
                    {row.score}
                  </td>

                  <td className="text-center">
                    {row.violations_count}
                  </td>

                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${riskStyles[row.risk]}`}
                    >
                      {row.risk}
                    </span>
                  </td>

                  <td className="text-center">
                    <button onClick={() => setSelectedCandidate(row)} className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded-md text-xs">
                      <Eye size={14} />
                      View
                    </button>
                  </td>

                  <td className="text-center text-red-500">
                    Terminated
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    );
  }
};

export default ExamData;


const SummaryCard = ({ title, value, icon, danger }) => (
  <div className={`p-5 rounded-xl shadow-sm bg-white border ${danger ? "border-red-200" : "border-gray-200"}`}>
    <div className="flex justify-between items-center">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
      <div className={`p-3 rounded-lg ${danger ? "bg-red-100 text-red-600" : "bg-indigo-100 text-indigo-600"}`}>
        {icon}
      </div>
    </div>
  </div>
);
