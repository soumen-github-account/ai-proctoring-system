import { useContext } from "react";
import {AppContext} from "../contexts/AppContext";

const Navbar = () => {
  const {exam, submitExam} = useContext(AppContext)

  return (
    <div className="flex justify-between items-center bg-white px-6 py-3 border-b border-b-gray-300">
      <div className="font-semibold text-gray-700">
        {exam?.name} &gt; {exam?.subject}
      </div>

      <div className="flex gap-4">
        <button className="text-gray-600">Exit</button>
        <button onClick={()=>submitExam()} className="bg-blue-700 text-white px-4 py-2 rounded">
          Review & Submit →
        </button>
      </div>
    </div>
  );
};

export default Navbar;
