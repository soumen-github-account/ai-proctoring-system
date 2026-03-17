import { useContext, useState } from "react";
import {AppContext} from "../contexts/AppContext";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const Navbar = () => {
  const {exam, submitExam, submitLoading} = useContext(AppContext)
  const [showPopup, setShowPopup] = useState(false);

  const handleSubmit = () => {
    submitExam();
    setShowPopup(false);
  };

  return (
    <>
      <div className="flex justify-between items-center bg-white px-6 py-3 border-b border-b-gray-300">
        <div className="font-semibold text-gray-700">
          {exam?.name} &gt; {exam?.subject}
        </div>

        <div className="flex gap-4">
          <button className="text-gray-600">Exit</button>
          <button onClick={()=>setShowPopup(true)} className="bg-blue-700 text-white px-4 py-2 rounded">
            Review & Submit →
          </button>
        </div>


      </div>

      {/* POPUP */}
      {showPopup && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 bg-white shadow-lg border-1 border-gray-300 rounded-lg p-6 w-[350px] z-50">

          <h2 className="text-lg font-semibold mb-2">
            Submit Exam?
          </h2>

          <p className="text-gray-600 mb-4">
            Are you sure you want to submit your exam?
          </p>

          <div className="flex justify-end gap-3">
            {
              !submitLoading &&
              <button
                onClick={() => setShowPopup(false)}
                className="px-4 py-2 border-1 border-gray-300 rounded text-gray-600"
              >
                Cancel
              </button>
            }

            {
              submitLoading ?
              <span
                className="flex items-center gap-3 justify-between px-4 py-2 bg-blue-300 text-white rounded cursor-no-drop"
              >
                <AiOutlineLoading3Quarters className="text-white animate-spin duration-300 transition-all" />
                <p>Please wait...</p>
              </span>
              :
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-700 text-white rounded"
              >
                Yes Submit
              </button>
            }
            
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
