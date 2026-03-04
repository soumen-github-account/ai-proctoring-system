
import React, { useState } from 'react'
import ExamDetailsCard from '../components/ExamDetailsCard';
import CreateExamForm from '../components/CreateExamForm';

const ConductExam = () => {
  const [examData, setExamData] = useState({
    examName: "",
    subject: "",
    duration: "",
    totalQuestions: 0,
    questions: []
  });

  const [examForm, setExamForm] = useState(false);

  return (
    <div className="p-6 bg-gray-50 min-h-[90vh]">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Conduct Exam</h1>
        <p className="text-gray-500">
          Create exams and edit.
        </p>
      </div>
      <button onClick={()=>setExamForm(true)} className='bg-blue-400 rounded-md text-white px-6 py-2 mx-7 cursor-pointer'>
        Add Exam
      </button>
      
      {examForm && <CreateExamForm onClose={setExamForm} />}
      <div className="p-6 space-y-6">
        <ExamDetailsCard />
      </div>
    </div>
  )
}

export default ConductExam
