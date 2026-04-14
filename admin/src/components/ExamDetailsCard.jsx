import { ClipboardList, LoaderCircle, Plus } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import AddQuestionModal from "./AddQuestionModal";
import axios from "axios";
import { AppContext } from "../contexts/AppContext";
import toast from "react-hot-toast";
import AllQuestions from "./AllQuestions";

const ExamDetailsCard = () => {
  const {backendUrl, fetchExams, exams} = useContext(AppContext)
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false)
  const [editId, setEditId] = useState(null);
  const [dloading, setDloading] = useState(false)
  const [id, setId] = useState("");
  const [showQuestions, setShowQuestions] = useState(false)
  const [enabledMap, setEnabledMap] = useState({});

  const [form, setForm] = useState({
    examName: "",
    subject: "",
    duration: "",
    totalQuestion: 0
  })

  const handleSave = async(e)=>{
    e.preventDefault();
    setLoading(true)
    try {
      const {data} = await axios.post(`${backendUrl}/api/exams/create/`, 
        {
          "name":examName,
          "subject": subject,
          "duration": duration,
        }, {headers: {"Content-Type": "application/json"}}
      )

      if(data.sccess){
        toast.success(data.message)
        setLoading(false)
      } else{
        toast.error(data.message)
        setLoading(false)
      }

    } catch (err) {
      console.log(err);
      setLoading(false)
    }
  }



  const handleEdit = (exam) => {
    setEditId(exam._id || exam.id);
    setForm({
      examName: exam.name,
      subject: exam.subject,
      duration: exam.duration,
      totalQuestion: exam.totalQuestion || 0,
    });
  }

  const handleUpdate = async(id) =>{
    setLoading(true)
    try {
      const {data} = await axios.put(`${backendUrl}/api/exams/update-exam/${id}/`,
        {
          name: form.examName,
          subject: form.subject,
          duration: form.duration
        }
      )

      if(data.success){
        toast.success(data.message)
        setLoading(false)
        setEditId(null)
        fetchExams()
      } else{
        toast.error(data.message)
        setLoading(false)
      }
    } catch (err) {
      console.log(err)
      setLoading(false)
    }
  }

  const handleDelete = async(id) => {
    setDloading(true)
    try {
      const {data} = await axios.delete(`${backendUrl}/api/exams/delete-exam/${id}/`)
      if(data.success){
        toast.success(data.message)
        setDloading(false)
        fetchExams()
      } else{
        toast.error(data.message)
        setDloading(false)
      }

    } catch (err) {
      console.log(err)
      setDloading(false)
    }
  }

  const publish = async (id, publishStatus) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/exams/publish/`,
        {
          id: id,
          publish: publishStatus,
        }
      );

      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (exams.length > 0) {
      const map = {};
      exams.forEach((exam) => {
        map[exam._id || exam.id] = exam.is_published; 
      });
      setEnabledMap(map);
    }
  }, [exams]);
  return (
    <div className="bg-white rounded-2xl shadow-sm border-1 border-gray-300 p-6">
      {
      exams.length > 0 ? 
      (
        exams.map((e) => {
          const isEditing = editId === (e._id || e.id);
          return (
          <div key={e._id || e.id} className="mb-6 border-b-1 border-b-gray-400 pb-6 last:border-none">
          <div className="flex justify-between items-center mb-4">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <ClipboardList className="text-indigo-600" />
              Exam Details
            </h2>

            <button onClick={()=>{setShowModal(true); setId(e._id || e.id)}} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg">
              <Plus size={16} /> Add Question
            </button>
          </div>

          <form className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm text-gray-500">Exam Name</label>
              <input
                disabled={!isEditing}
                onChange={(e)=>setForm({...form, examName: e.target.value})}
                value={isEditing ? form.examName : e.name}
                className="mt-1 w-full px-3 py-2 border-1 border-gray-300 rounded-lg bg-gray-50"
                required={true}
              />
            </div>
            <div>
              <label className="text-sm text-gray-500">Subject</label>
              <input
                disabled={!isEditing}
                onChange={(e)=>setForm({...form, subject: e.target.value})}
                value={isEditing ? form.subject : e.subject}
                className="mt-1 w-full px-3 py-2 border-1 border-gray-300 rounded-lg bg-gray-50"
                required={true}
              />
            </div>
            <div>
              <label className="text-sm text-gray-500">Duration</label>
              <input
                disabled={!isEditing}
                type="number"
                onChange={(e)=>setForm({...form, duration: e.target.value})}
                value={isEditing ? form.duration : e.duration}
                className="mt-1 w-full px-3 py-2 border-1 border-gray-300 rounded-lg bg-gray-50"
                required={true}
              />
            </div>
            <div>
              <label className="text-sm text-gray-500">Total Question</label>
              <input
                disabled={true}
                onChange={(e)=>setForm({...form, totalQuestion: e.target.value})}
                value={form.totalQuestion}
                className="mt-1 w-full px-3 py-2 border-1 border-gray-300 rounded-lg bg-gray-50"
              />
            </div>
            <div className="flex items-center gap-3">
              {isEditing ? (
                    <button
                      type="button"
                      onClick={() =>
                        handleUpdate(e._id || e.id)
                      }
                      disabled={loading}
                      className={`py-2 px-9 rounded-md ${loading ? "bg-gray-300 text-gray-400" : "bg-green-500 text-white"}`}
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2"><LoaderCircle className="animate-spin" /><p>Please wait...</p></span>
                      ) : (
                        "Save"
                      )}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleEdit(e)}
                      className="py-2 px-9 rounded-md bg-blue-500 text-white"
                    >
                      Edit
                    </button>
                  )}
              <button type="button" onClick={()=>{setShowQuestions(true); setId(e._id || e.id)}} className={`py-2 px-6 rounded-md bg-blue-100 text-blue-600 hover:bg-blue-200 transition-all duration-300 ${isEditing && "hidden"}`}>Questions</button>
              <button type="button" disabled={dloading} onClick={()=>handleDelete(e.id || e._id)} className={`py-2 px-9 rounded-md transition-all duration-300 ${isEditing && "hidden"} ${dloading ? "bg-gray-100 text-gray-600 hover:bg-gray-200" : "bg-red-100 text-red-600 hover:bg-red-200"}`}>
                {
                  dloading ? 
                  <span className="flex items-center gap-2">
                    <LoaderCircle className="animate-spin duration-300 transition-all" />
                    <p>please wait...</p>
                  </span>
                  : "Delete"
                }
              </button>
              <button onClick={()=>setEditId(null)} type="button" className={`py-2 px-9 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all duration-300 ${!isEditing && "hidden"}`}>Cancle</button>
              
            </div>

          </form>
            <div className="flex items-center mt-5">
              <button
                onClick={() => {
                          const newValue = !enabledMap[e._id || e.id];

                          setEnabledMap((prev) => ({
                            ...prev,
                            [e._id || e.id]: newValue,
                          }));

                          publish(e._id || e.id, newValue);
                        }}
                className={`w-14 h-8 flex items-center rounded-full p-1 duration-300 ${
                  enabledMap[e._id || e.id] ? "bg-blue-500" : "bg-gray-300"
                }`}
              >
                <div
                  className={`bg-white w-6 h-6 rounded-full shadow-md transform duration-300 ${
                    enabledMap[e._id || e.id] ? "translate-x-6" : ""
                  }`}
                />
              </button>

              <span className="ml-3 text-md font-medium">
                {enabledMap[e._id || e.id] ? "Published" : "Unpublished"}
              </span>
            </div>
          </div>
          )})
        )
       :
      <p className="text-center">No exams found</p>
      }
      {/* Modal */}
      {showModal && (
        <AddQuestionModal onClose={() => setShowModal(false)} id={id} />
      )}

      {
        showQuestions && 
        (
          <AllQuestions onClose={()=>setShowQuestions(false)} id={id}/>
        )
      }
    </div>
  );
};

export default ExamDetailsCard;
