import { X } from 'lucide-react'
import React from 'react'
import QuestionList from './QuestionList'

const AllQuestions = ({onClose, id}) => {

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">

        {/* Modal Card */}
        <div className="w-full min-h-screen md:max-w-2xl bg-white rounded-2xl shadow-xl">
            <div className="flex justify-between items-center px-6 py-4 border-b-1 border-b-gray-300">
                <h2 className="text-lg font-semibold">All Questions</h2>
                <button onClick={onClose}>
                    <X className="text-gray-500 hover:text-black cursor-pointer" />
                </button>
            </div>
            <div className='flex flex-col p-3 gap-3'>
                <QuestionList id={id} />
            </div>
            
        </div>
      
    </div>
  )
}

export default AllQuestions
