// import { useContext, useEffect, useState, useRef } from "react";
// import { examInstructions } from "../assets/data";
// import AppContext from "../contexts/AppContext";

// const RightSidebar = () => {
//   const { exam } = useContext(AppContext);

//   const [remainingTime, setRemainingTime] = useState(null);
//   const timerRef = useRef(null); // prevent multiple intervals

//   // Initialize Timer When Exam Loads
//   useEffect(() => {
//     if (exam?.duration && exam.is_published) {
//       const savedTime = localStorage.getItem("remainingTime");

//       if (savedTime) {
//         setRemainingTime(parseInt(savedTime));
//       } else {
//         const initialTime = exam.duration * 60;
//         setRemainingTime(initialTime);
//         localStorage.setItem("remainingTime", initialTime);
//       }
//     }
//   }, [exam]);

//   // Start Countdown (Only Once)
//   useEffect(() => {
//     if (remainingTime === null || timerRef.current) return;

//     timerRef.current = setInterval(() => {
//       setRemainingTime(prev => {
//         if (prev <= 1) {
//           clearInterval(timerRef.current);
//           timerRef.current = null;
//           localStorage.removeItem("remainingTime");

//           alert("Time is up! Auto submitting exam...");
//           // 👉 call your submit function here

//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => {
//       if (timerRef.current) {
//         clearInterval(timerRef.current);
//         timerRef.current = null;
//       }
//     };
//   }, [remainingTime]);

//   // Persist Remaining Time
//   useEffect(() => {
//     if (remainingTime !== null) {
//       localStorage.setItem("remainingTime", remainingTime);
//     }
//   }, [remainingTime]);

//   // Format MM:SS
//   const formatTime = (time) => {
//     const minutes = Math.floor(time / 60);
//     const seconds = time % 60;

//     return `${minutes.toString().padStart(2, "0")}:${seconds
//       .toString()
//       .padStart(2, "0")}`;
//   };

//   return (
//     <div className="w-72 bg-gray-50 p-4 border-l border-l-gray-300">
//       <div className="text-center mb-6">
//         <div className="text-2xl font-bold text-red-600">
//           {remainingTime !== null ? formatTime(remainingTime) : "00:00"}
//         </div>
//         <p className="text-sm text-gray-500">Time Remaining</p>
//       </div>

//       <div className="space-y-2 mb-6">
//         <button className="w-full border border-gray-300 p-2 rounded">
//           About Test
//         </button>

//         <div className="pl-2">
//           <h1 className="font-medium">Instructions</h1>
//           <ul>
//             {examInstructions.instructions.map((instruction, index) => (
//               <li key={index} className="text-[13px] font-medium">
//                 {instruction}
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RightSidebar;

import { useContext, useEffect, useState, useRef } from "react";
import { examInstructions } from "../assets/data";
import AppContext from "../contexts/AppContext";

const RightSidebar = () => {
  const { exam } = useContext(AppContext);

  const [remainingTime, setRemainingTime] = useState(null);
  const [isExamEnded, setIsExamEnded] = useState(false);
  const timerRef = useRef(null);

  // Initialize Timer
  useEffect(() => {
    if (exam?.duration && exam.is_published) {
      const savedTime = localStorage.getItem("remainingTime");

      if (savedTime) {
        const parsed = parseInt(savedTime);
        setRemainingTime(parsed);
        if (parsed <= 0) setIsExamEnded(true);
      } else {
        const initialTime = exam.duration * 60;
        setRemainingTime(initialTime);
        localStorage.setItem("remainingTime", initialTime);
      }
    }
  }, [exam]);

  // Start Countdown
  useEffect(() => {
    if (remainingTime === null || timerRef.current || isExamEnded) return;

    timerRef.current = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          localStorage.removeItem("remainingTime");

          setIsExamEnded(true);

          // 👉 call submit function here
          console.log("Auto Submit Triggered");

          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [remainingTime, isExamEnded]);

  // Persist time
  useEffect(() => {
    if (remainingTime !== null) {
      localStorage.setItem("remainingTime", remainingTime);
    }
  }, [remainingTime]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <>
      {/* 🚨 Exam End Banner */}
      {/* {isExamEnded && (
        <div className="fixed top-0 left-0 w-full bg-red-600 text-white text-center py-3 z-50 font-semibold">
          ⛔ Exam Time Over! You can no longer attempt questions.
        </div>
      )} */}

      <div
        className={`w-72 bg-gray-50 p-4 border-l border-l-gray-300 ${
          isExamEnded ? "opacity-60 pointer-events-none" : ""
        }`}
      >
        <div className="text-center mb-6">
          <div className="text-2xl font-bold text-red-600">
            {remainingTime !== null ? formatTime(remainingTime) : "00:00"}
          </div>
          <p className="text-sm text-gray-500">Time Remaining</p>
        </div>

        <div className="space-y-2 mb-6">
          <button className="w-full border border-gray-300 p-2 rounded">
            About Test
          </button>

          <div className="pl-2">
            <h1 className="font-medium">Instructions</h1>
            <ul>
              {examInstructions.instructions.map((instruction, index) => (
                <li key={index} className="text-[13px] font-medium">
                  {instruction}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default RightSidebar;
