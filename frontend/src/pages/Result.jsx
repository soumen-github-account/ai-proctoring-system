import React, { useContext } from 'react'
import AppContext from '../contexts/AppContext';
import { CheckCircle, AlertCircle } from "lucide-react";

const Result = () => {
    const {status} = useContext(AppContext)
    const isSubmitted = status === "Submitted";
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center">
                
                {/* Icon */}
                <div className="flex justify-center mb-4">
                {isSubmitted ? (
                    <CheckCircle className="text-green-500 w-12 h-12" />
                ) : (
                    <AlertCircle className="text-yellow-500 w-12 h-12" />
                )}
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {isSubmitted ? "Exam Submitted" : "Exam Not Submitted"}
                </h2>

                {/* Description */}
                <p className="text-gray-500 mb-6">
                {isSubmitted
                    ? "You have already submitted your exam. You can now view your results."
                    : "You have not submitted your exam yet. Please complete it before viewing results."}
                </p>

                {/* Button */}
                <button
                disabled={true}
                className={`w-full py-3 rounded-lg font-semibold transition ${
                    isSubmitted
                    ? "bg-green-500 hover:bg-green-600 text-white"
                    : "bg-indigo-500 hover:bg-indigo-600 text-white"
                }`}
                onClick={() =>
                    (window.location.href = isSubmitted ? "/result" : "/exam")
                }
                >
                {isSubmitted ? "View Result" : "Go to Exam"}
                </button>
            </div>
        </div>
    )
}

export default Result