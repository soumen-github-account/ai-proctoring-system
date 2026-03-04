import { LoaderCircle, X } from "lucide-react";
import { useContext, useState } from "react";
import { AppContext } from "../contexts/AppContext";
import axios from "axios";
import toast from "react-hot-toast";

const AddQuestionModal = ({ onClose, id }) => {
    
    const {backendUrl} = useContext(AppContext)
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        q_text: "",
        op_a: "",
        op_b: "",
        op_c: "",
        op_d: "",
        c_ans: ""
    })

    const handleSubmit = async(e) => {
      e.preventDefault();
      setLoading(true)
      try {
        const {data} = await axios.post(`${backendUrl}/api/exams/add-question/`,
          {
            exam_id: id,
            question_text: form.q_text,
            options: [form.op_a, form.op_b, form.op_c, form.op_d],
            correct_answer: form.c_ans
          }
        );
        if (data.success) {
          toast.success(data.message)
          onClose();
        }

      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">

      {/* Modal Card */}
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl">

        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b-1 border-b-gray-300">
          <h2 className="text-lg font-semibold">Add New Question</h2>
          <button onClick={onClose}>
            <X className="text-gray-500 hover:text-black" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">

          {/* Question */}
          <div>
            <label className="text-sm font-medium">Question</label>
            <textarea
              rows="3"
              onChange={(e)=>setForm({...form, q_text: e.target.value})}
              value={form.q_text}
              placeholder="Enter question text"
              className="w-full mt-1 p-3 border-1 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <input
              type="text"
              placeholder="Option A"
              value={form.op_a}
              onChange={(e) =>
                setForm({ ...form, op_a: e.target.value })
              }
              className="p-2 border border-gray-300 rounded-lg"
            />

            <input
              type="text"
              placeholder="Option B"
              value={form.op_b}
              onChange={(e) =>
                setForm({ ...form, op_b: e.target.value })
              }
              className="p-2 border border-gray-300 rounded-lg"
            />

            <input
              type="text"
              placeholder="Option C"
              value={form.op_c}
              onChange={(e) =>
                setForm({ ...form, op_c: e.target.value })
              }
              className="p-2 border border-gray-300 rounded-lg"
            />

            <input
              type="text"
              placeholder="Option D"
              value={form.op_d}
              onChange={(e) =>
                setForm({ ...form, op_d: e.target.value })
              }
              className="p-2 border border-gray-300 rounded-lg"
            />
          </div>


          {/* Correct Answer */}
          <div>
            <label className="text-sm font-medium">Correct Answer</label>
            <select onChange={(e)=>setForm({...form, c_ans: e.target.value})} value={form.c_ans} className="w-full mt-1 p-2 border-1 border-gray-300 rounded-lg">
              <option value="">Select correct option</option>
              <option value="0">A</option>
              <option value="1">B</option>
              <option value="2">C</option>
              <option value="3">D</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t-1 border-t-gray-300">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border-1 border-gray-300 rounded-lg"
          >
            Cancel
          </button>
          <button disabled={loading} type="submit" onClick={handleSubmit} className={`px-5 py-2 ${loading ? "bg-gray-300 text-gray-400 cursor-no-drop" : "bg-indigo-600 text-white"} rounded-lg`}>
            {
              loading ?
              <span className="flex items-center justify-center gap-3">
                <LoaderCircle className="animate-spin" />
                Please wait...
              </span>
              : "Save Question"
            }
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddQuestionModal;
