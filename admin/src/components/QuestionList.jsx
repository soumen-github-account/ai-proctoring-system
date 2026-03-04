import { useContext, useEffect, useState } from "react";
import { Pencil, Trash2, ChevronDown } from "lucide-react";
import axios from "axios";
import { AppContext } from "../contexts/AppContext";
import toast from "react-hot-toast";

const QuestionList = ({id}) => {
  const {backendUrl} = useContext(AppContext)
  const [openId, setOpenId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchQuestions = async() => {
    try {
      const {data} = await axios.get(`${backendUrl}/api/exams/questions/${id}`);
      if(data.success){
        setQuestions(data.questions)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (id) {
      fetchQuestions();
    }
  }, [id]);

  const deleteQuestion = async(id)=>{
    setLoading(true)
    try {
      const {data} = await axios.delete(`${backendUrl}/api/exams/delete-question/${id}/`);
      if(data.success){
        toast.success(data.message);
        fetchQuestions();
      }
    } catch (error) {
      console.log(error)
    }
    setLoading(false)
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border-1 border-gray-300">
      
      <div className="px-6 py-4 border-b-1 border-b-gray-300 font-semibold">
        Question List ({questions.length} Questions)
      </div>

      {questions.map((q, index) => (
        <div key={q.id} className="">
          
          {/* Question Row */}
          <div
            className="px-6 py-4 flex justify-between items-center hover:bg-gray-50 cursor-pointer">
            <div>
              <p className="font-medium">{index + 1}. {q.question_text}</p>
              <p className="text-sm text-gray-500">4 Options</p>
            </div>

            <div className="flex items-center gap-7">
              <StatusBadge status={q.status} />
              {/* <button className="btn-blue flex items-center gap-1"><Pencil size={14} /> Edit</button> */}
              <button onClick={()=>deleteQuestion(q.id)} disabled={loading} className={`btn-red cursor-pointer ${loading ? "text-gray-300 hover:cursor-no-drop" : "hover:text-red-500"}`}><Trash2 size={14} /></button>
              <ChevronDown onClick={() => setOpenId(openId === q.id ? null : q.id)} />
            </div>
          </div>

          {/* Expandable Editor */}
          {openId === q.id && (
            <div className="bg-gray-50 px-6 py-4">
              {q.options.map((opt, index) => (
                <label key={index} className="flex items-center gap-2 mb-2">
                  <input type="radio" checked={index === Number(q.correct_answer)} readOnly />
                  {opt}
                </label>
              ))}

              {/* <div className="mt-3 flex justify-between items-center">
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg">
                  Save
                </button>
              </div> */}
            </div>
          )}
        </div>
      ))}

      {/* Footer */}
      {/* <div className="px-6 py-4 flex justify-between">
        <button className="px-4 py-2 border-1 border-gray-300 rounded-lg">Cancel</button>
        <button className="px-5 py-2 bg-green-600 text-white rounded-lg">
          Upload Exam
        </button>
      </div> */}
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const map = {
    "Awaiting Review": "bg-orange-100 text-orange-700",
    "Answered": "bg-green-100 text-green-700",
    "Not Visited": "bg-red-100 text-red-700"
  };

  return (
    <span className={`px-3 py-1 text-xs rounded-full font-semibold ${map[status]}`}>
      {status}
    </span>
  );
};

export default QuestionList;
