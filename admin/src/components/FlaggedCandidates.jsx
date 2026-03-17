const riskColor = {
  HIGH: "bg-red-100 text-red-700",
  MEDIUM: "bg-yellow-100 text-yellow-700",
  LOW: "bg-green-100 text-green-700"
};

const FlaggedCandidates = ({ candidates }) => {
  return (
    <div className="bg-white p-5 rounded-xl shadow-md">
      <h2 className="text-lg font-semibold mb-4">Flagged Candidates</h2>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b-1 border-b-gray-400">
            <th className="py-2">Name</th>
            <th>Exam</th>
            <th>Risk</th>
            <th>Trust Score</th>
          </tr>
        </thead>

        <tbody>
          {candidates.map((c) => (
            <tr key={c.id} className="border-b-1 border-b-gray-300 last:border-none">
              <td className="py-2">{c.student.name}</td>
              <td>{c.exam_name}</td>
              <td>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${riskColor[c.risk]}`}
                >
                  {c.risk}
                </span>
              </td>
              <td className="font-semibold">{c.risk_score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FlaggedCandidates;
