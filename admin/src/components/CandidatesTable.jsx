
import { Eye, CircleStop } from 'lucide-react';

const riskBadge = {
  HIGH: "bg-red-100 text-red-700",
  MEDIUM: "bg-yellow-100 text-yellow-700",
  LOW: "bg-green-100 text-green-700",
};


const CandidatesTable = ({ data }) => (
  <div className="bg-white rounded-xl shadow-sm border-1 border-gray-300 overflow-hidden">
    <table className="w-full text-sm">
      <thead className="bg-gray-50 text-gray-600">
        <tr>
          <th className="p-4 text-left"><input type="checkbox" /></th>
          <th className="p-4 text-left">Name</th>
          <th className="p-4">Risk Level</th>
          <th className="p-4">Violations</th>
          <th className="p-4">Trust Score</th>
          <th className="p-4">Actions</th>
        </tr>
      </thead>

      <tbody>
        {data.map((c, i) => (
          <tr key={i} className="border-t-1 border-t-gray-300 hover:bg-gray-50">
            <td className="p-4"><input type="checkbox" /></td>

            <td className="p-4 flex items-center gap-3">
              <img
                src={c.image}
                className="w-9 h-9 rounded-full object-cover"
              />
              <span className="font-medium">{c.name}</span>
            </td>

            {/* <td className="p-4">{c.exam}</td> */}

            <td className="p-4">
              <span className={`
                px-3 py-1 rounded-full text-xs font-semibold
                ${riskBadge[c.risk]}
              `}>
                {c.risk}
              </span>
            </td>

            <td className="p-4 text-gray-600">{c.violations}</td>

            <td className="p-4 font-semibold">{c.trust}</td>

            <td className="p-4 flex gap-2">
              <button className="px-3 py-1 rounded-md bg-blue-500 text-white flex items-center gap-2">
                <Eye size={14} />
                <p>View</p>
              </button>
              {c.risk === "HIGH" && (
                <button className="px-3 py-1 rounded-md bg-rose-600 text-white flex items-center gap-2">
                    <CircleStop size={14} />
                  <p>Terminate</p>
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    {/* Pagination */}
    <div className="p-4 flex justify-between text-sm text-gray-600">
      <span>Showing 1–8 of 120 entries</span>
      <div className="flex gap-2">
        <button className="px-3 py-1 border rounded">Previous</button>
        <button className="px-3 py-1 bg-blue-600 text-white rounded">1</button>
        <button className="px-3 py-1 border rounded">2</button>
        <button className="px-3 py-1 border rounded">Next</button>
      </div>
    </div>
  </div>
);

export default CandidatesTable