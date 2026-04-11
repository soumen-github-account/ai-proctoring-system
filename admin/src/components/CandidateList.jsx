const riskColors = {
  HIGH: "text-red-600 bg-red-100",
  MEDIUM: "text-yellow-700 bg-yellow-100",
  LOW: "text-green-700 bg-green-100"
};
import { SquarePen } from 'lucide-react';
import { Trash } from 'lucide-react';
import { LoaderCircle } from 'lucide-react';


const CandidateList = ({ candidates, onEdit, onDelete, deleteLoadingId }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border-1 border-gray-300 p-6">
      <h2 className="text-lg font-semibold mb-4">Candidates</h2>

      {candidates.length === 0 && (
        <p className="text-gray-500 text-sm">No candidates added yet.</p>
      )}

      <div className="space-y-3">
        {candidates.map(candidate => (
          <div
            key={candidate.studentId}
            className="flex justify-between items-center p-3 border-1 border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <div>
              <p className="font-medium">{candidate.name}</p>
              <p className="font-medium">{candidate.studentId}</p>
              <p className="text-sm text-gray-500">{candidate.email}</p>

              <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-semibold ${riskColors[candidate.risk]}`}>
                {candidate.phone}
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => onEdit(candidate)}
                className="px-3 py-1 text-sm rounded-md bg-blue-500 text-white flex items-center gap-2"
              >
                <SquarePen size={14} />
                <p>Edit</p>
              </button>
              <button
                disabled={deleteLoadingId === candidate.studentId}
                onClick={() => onDelete(candidate.studentId)}
                className="px-3 py-1 text-sm rounded-md bg-rose-600 text-white"
              >

                {
                  deleteLoadingId === candidate.studentId ?
                  <LoaderCircle className='animate-spin' />
                  :
                  <span className='flex items-center gap-2'>
                    <Trash size={14} />
                    <p>Delete</p>
                  </span>
                }
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CandidateList;
