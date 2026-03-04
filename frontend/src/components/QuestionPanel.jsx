

const QuestionPanel = ({ question, questionNumber, onSave, onClear, onNext, onPrev }) => {
  return (
    <div className="flex-1 p-6">
      <h2 className="font-semibold mb-4">Q: {questionNumber}</h2>

      <p className="mb-6 text-gray-700">{question.question_text}</p>

      <div className="space-y-4">
        {question.options.map((opt, idx) => (
          <label
            key={idx}
            className={`flex items-center gap-3 border-1 border-gray-300 p-3 rounded cursor-pointer
              ${question.selectedOption === idx ? "bg-blue-100 border-blue-500" : ""}
            `}
          >
            <input
              type="radio"
              name="option"
              checked={question.selectedOption === idx}
              onChange={() => onSave(idx)}
            />
            {opt}
          </label>
        ))}
      </div>

      <div className="flex justify-between mt-8">
        <button onClick={onPrev} className="border-1 border-gray-300 px-4 py-2 rounded">
          Previous
        </button>

        <div className="flex gap-3">
          <button onClick={onClear} className="border-1 border-gray-300 px-4 py-2 rounded">
            Clear Response
          </button>

          <button
            onClick={onNext}
            className="bg-blue-700 text-white px-5 py-2 rounded"
          >
            Save & Next →
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionPanel;
