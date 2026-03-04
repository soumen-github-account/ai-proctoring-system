import { useContext } from "react";

const LeftSidebar = ({ questions = [], currentQuestionId, onQuestionSelect }) => {

  return (
    <div className="w-64 bg-gray-50 p-4 border-r border-gray-300 overflow-y-auto">
      <h3 className="font-semibold mb-3">Questions</h3>

      <div className="grid grid-cols-5 gap-2">
        {questions.map((q, index) => (
          <button
            key={q.id}
            onClick={() => onQuestionSelect(q.id)}
            className={`
              w-10 h-10 text-sm rounded border-1 border-gray-300
              ${q.id === currentQuestionId ? "bg-blue-600 text-white" : ""}
              ${q.status === "answered" ? "bg-green-200" : ""}
              ${q.status === "review" ? "bg-purple-200" : ""}
              hover:bg-blue-100
            `}
          >
            {index+1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LeftSidebar;
