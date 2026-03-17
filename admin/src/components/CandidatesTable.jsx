import axios from "axios";
import { Eye, CircleStop, Loader } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { MdAccountCircle } from "react-icons/md";
import { AppContext } from "../contexts/AppContext";
import {toast} from 'react-hot-toast'

const riskBadge = {
  HIGH: "bg-red-100 text-red-700",
  MEDIUM: "bg-yellow-100 text-yellow-700",
  LOW: "bg-green-100 text-green-700",
};

const CandidatesTable = ({ data, setSelectedCandidate }) => {
  const {backendUrl, fetchCandidates} = useContext(AppContext)
  const [loading, setLoading] = useState(false)

  const handleTerminate = async(studentId, examId, terminate) =>{
    setLoading(true)
    try {
      const paylode = {
        "student_id":studentId,
        "exam_id": examId,
        "terminate": terminate
      }
      const {data} = await axios.post(`${backendUrl}/api/exams/action-terminate/`, paylode);
      if(data.success){
        fetchCandidates();
        setLoading(false);
        toast.success(data.message)
      }
    } catch (err) {
      console.log(err)
      setLoading(false)
    }
  }

  useEffect(()=>{
    fetchCandidates()
  }, [])
  
  return (
    <div className="bg-white rounded-xl shadow border border-gray-200">
      
      {/* Scroll Container */}
      <div className="max-h-[400px] overflow-y-auto">
        <table className="w-full text-sm text-gray-700">

          {/* Header */}
          <thead className="bg-gray-50 text-gray-600 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-3 text-left">Candidate</th>
              <th className="px-6 py-3 text-center">Risk Level</th>
              <th className="px-6 py-3 text-center">Violations</th>
              <th className="px-6 py-3 text-center">Trust Score</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-gray-200">
            {data.map((c, i) => (
              <tr key={i} className="hover:bg-gray-50">

                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <MdAccountCircle className="w-9 h-9 text-gray-500" />
                    <span className="font-medium">{c.student.name}</span>
                  </div>
                </td>

                <td className="px-6 py-4 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${riskBadge[c.risk]}`}
                  >
                    {c.risk}
                  </span>
                </td>

                <td className="px-6 py-4 text-center">
                  {c.violations_count}
                </td>

                <td className="px-6 py-4 text-center font-semibold">
                  {c.risk_score}
                </td>

                <td className="px-6 py-4">
                  <div className="flex justify-center gap-2">
                    <button onClick={() => setSelectedCandidate(c)} className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded-md text-xs">
                      <Eye size={14} />
                      View
                    </button>

                    {c.risk === "HIGH" && (
                        loading ? 
                          <span className="px-3 py-1 bg-rose-600 rounded-md">
                            <Loader className="animate-spin duration-300 transition-all text-white"/>
                          </span>
                        :
                        c.isTerminate ?
                          <button onClick={()=>handleTerminate(c.student.id, c.exam_id, false)} className="flex items-center gap-1 px-3 py-1 text-rose-600 border-2 border-rose-600 rounded-md text-xs cursor-pointer">
                            Terminated
                          </button>
                        :
                          <button onClick={()=>handleTerminate(c.student.id, c.exam_id, true)} className="flex items-center gap-1 px-3 py-1 bg-rose-600 text-white rounded-md text-xs">
                            <CircleStop size={14} />
                            Terminate
                          </button>
                    )}
                  </div>
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </div>
  );
};

export default CandidatesTable;