import { Users, FileText, AlertTriangle, Video, Search } from "lucide-react";
import { useState } from "react";
import { allAttempts } from "../assets/data";
const riskStyles = {
  HIGH: "bg-red-100 text-red-700",
  MEDIUM: "bg-yellow-100 text-yellow-700",
  LOW: "bg-green-100 text-green-700"
};

const ExamData = () => {
  const [search, setSearch] = useState("");

  const filtered = allAttempts.filter(
    d =>
      d.student.name.toLowerCase().includes(search.toLowerCase()) ||
      d.exam.name.toLowerCase().includes(search.toLowerCase())
  );

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
        <SummaryCard title="Total Exams" value="12" icon={<FileText />} />
        <SummaryCard title="Total Students" value="148" icon={<Users />} />
        <SummaryCard title="Total Attempts" value="392" icon={<AlertTriangle />} />
        <SummaryCard title="Flagged Cases" value="27" icon={<AlertTriangle />} danger />
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
              <th>Recording</th>
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
                  <p className="font-medium">{row.exam.name}</p>
                  <p className="text-xs text-gray-500">{row.exam.subject}</p>
                </td>

                <td className="font-medium">
                  {row.attempt.status}
                </td>

                <td className="font-semibold">
                  {row.attempt.score}
                </td>

                <td className="text-center">
                  {row.attempt.violations}
                </td>

                <td>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${riskStyles[row.attempt.risk]}`}
                  >
                    {row.attempt.risk}
                  </span>
                </td>

                <td className="text-center">
                  {row.attempt.recording ? (
                    <Video className="text-green-600 inline" size={18} />
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
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
