import React, { useContext } from 'react'
import AppContext from '../contexts/AppContext';
import { useNavigate } from 'react-router-dom';

const StartingPage = () => {
    const { exam } = useContext(AppContext);
    const navigate = useNavigate();

    if (!exam) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-pulse text-lg font-semibold text-gray-600">
          Loading Exam Details...
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className='min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-100 flex items-center justify-center p-6'>
          <div className="w-full max-w-2xl bg-white/70 backdrop-blur-lg shadow-xl rounded-2xl p-8 border border-gray-200 transition-all duration-300">

            {/* Header */}
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {exam.name}
            </h1>

            <div className="space-y-1 mb-6">
              <p className="text-gray-600">
                <span className="font-medium text-gray-700">Subject:</span> {exam.subject}
              </p>
              <p className="text-gray-600">
                <span className="font-medium text-gray-700">Duration:</span> {exam.duration} Minutes
              </p>
              <p className="text-gray-600">
                <span className="font-medium text-gray-700">Date:</span> {exam.date}
              </p>
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-200 my-4"></div>

            {/* Rules */}
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Rules & Regulations
            </h2>

            <ul className="list-disc pl-5 text-sm text-gray-600 space-y-2 mb-8">
              <li>No switching tabs during exam.</li>
              <li>Do not refresh the page.</li>
              <li>Ensure stable internet connection.</li>
              <li>Exam will auto-submit when time ends.</li>
            </ul>

            {/* Button */}
            <button
              disabled={!exam.is_published}
              onClick={()=>navigate('/exam')}
              className={`w-full py-3 rounded-xl font-medium ${exam.is_published ? "bg-blue-500 text-white cursor-pointer" : "bg-gray-400 text-white cursor-not-allowed"} opacity-80`}
            >
              {
                exam.is_published ? "Join Now" : "Waiting for Exam to be Published"
              }
            </button>

          </div>
        </div>
    </div>
  )
}

export default StartingPage
