import { useContext, useEffect, useState } from "react";
import { LoaderCircle } from 'lucide-react';

const CandidateForm = ({ onAdd, onUpdate, editingCandidate, loading }) => {
  const [form, setForm] = useState({
    name: "",
    studentId: "",
    email: "",
    phone: "",
    password: ""
  });

  useEffect(() => {
    if (editingCandidate) setForm(editingCandidate);
  }, [editingCandidate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    editingCandidate ? onUpdate(form, editingCandidate.studentId) : onAdd(form);
    setForm({ name: "", studentId:"", email: "", phone: "", password: "" });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border-1 border-gray-300 p-6">
      <h2 className="text-lg font-semibold mb-4">
        {editingCandidate ? "Edit Candidate" : "Add New Candidate"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          placeholder="Candidate Name"
          className="w-full px-4 py-2 rounded-lg border-1 border-gray-300"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        <input
          placeholder="Candidate Id"
          className="w-full px-4 py-2 rounded-lg border-1 border-gray-300"
          value={form.studentId}
          onChange={(e) => setForm({ ...form, studentId: e.target.value })}
          required
        />

        <input
          placeholder="Email"
          className="w-full px-4 py-2 rounded-lg border-1 border-gray-300"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />

        <input
          placeholder="Phone no."
          className="w-full px-4 py-2 rounded-lg border-1 border-gray-300"
          value={form.phone}
          type="nuber"
          maxLength={10}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          required
        />

        <input
          type="text"
          placeholder="Password"
          className="w-full px-4 py-2 rounded-lg border-1 border-gray-300"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-lg text-white transition ${loading ? "bg-gray-400 text-gray-100 cursor-no-drop" : "bg-indigo-600 hover:bg-indigo-700 cursor-pointer"}`}
        >
          {
            loading ? 
            <span className="flex items-center gap-3 justify-center"><LoaderCircle className="animate-spin duration-200" /> <p>Please wait..</p></span> :
            (editingCandidate ? "Update Candidate" : "Add Candidate")
          }

        </button>
      </form>
    </div>
  );
};

export default CandidateForm;
