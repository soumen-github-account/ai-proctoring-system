import { useContext, useState } from "react";
import { AppContext } from "../contexts/AppContext";
import axios from "axios";
import toast from "react-hot-toast";
import { LoaderCircle } from "lucide-react";

const CreateExamForm = ({ onClose }) => {
  const { backendUrl } = useContext(AppContext);

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    examName: "",
    subject: "",
    duration: "",
  });

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/exams/create/`,
        {
          name: form.examName,
          subject: form.subject,
          duration: Number(form.duration),
        }
      );

      if (data.success) {
        toast.success(data.message);
        setForm({
          examName: "",
          subject: "",
          duration: ""
        })
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="p-6 border-1 border-gray-300 shadow-md mt-4">
      <h2 className="text-lg font-semibold mb-4">Create Exam</h2>

      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-sm text-gray-500">Exam Name</label>
          <input
            onChange={(e)=>setForm({...form, examName: e.target.value})}
            value={form.examName}
            className="mt-1 w-full px-3 py-2 border-1 border-gray-300 rounded-lg bg-gray-50"
            required={true}
          />
        </div>
        <div>
          <label className="text-sm text-gray-500">Subject</label>
          <input
            onChange={(e)=>setForm({...form, subject: e.target.value})}
            value={form.subject}
            className="mt-1 w-full px-3 py-2 border-1 border-gray-300 rounded-lg bg-gray-50"
            required={true}
          />
        </div>
        <div>
          <label className="text-sm text-gray-500">Duration</label>
          <input
            type="number"
            onChange={(e)=>setForm({...form, duration: e.target.value})}
            value={form.duration}
            className="mt-1 w-full px-3 py-2 border-1 border-gray-300 rounded-lg bg-gray-50"
            required={true}
          />
        </div>
        <div className="flex items-center gap-2">
            <button disabled={loading} type="submit" className={`py-2 px-9 rounded-md ${loading ? "bg-gray-200 cursor-no-drop text-gray-400" : "bg-blue-500 text-white cursor-pointer"}`}>
            {
                loading ?
                <span className="flex items-center justify-center gap-2 duration-300 transition-all">
                <LoaderCircle className="animate-spin" />
                <p>Please wait...</p>
                </span> 
                : "Save"
            }
            </button>
            <button type="button" onClick={() => onClose(false)} className="py-2 px-9 rounded-md bg-gray-200 text-gray-700">Cancle</button>
        </div>
      </form>
    </div>
  );
};

export default CreateExamForm