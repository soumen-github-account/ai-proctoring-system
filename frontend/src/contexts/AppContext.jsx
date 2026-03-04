
// import React, { createContext, useEffect, useState } from 'react'
// import { examData, user_data } from '../assets/data';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios'
// import toast from 'react-hot-toast'
// export const AppContext = createContext();

// export const AppContextProvider = ({children}) => {
//     const backendUrl = import.meta.env.VITE_BACKEND_URL;
//     const [loadingUser, setLoadingUser] = useState(true)
//     const [token, setToken] = useState(null);
//     const [user, setUser] = useState(null)
//     const [error, setError] = useState(null);
//     const [exam, setExam] = useState([])
//     const [questions, setQuestions] = useState([]);
//     const navigate = useNavigate();

//     const [violations, setViolations] = useState([]);
//     const [screenStream, setScreenStream] = useState(null);

//     const login = async(userId, password) => {
//         setLoadingUser(true);

//         // const foundUser = user_data.find(
//         //     (u) => u.userId === userId && u.password === password
//         // );

//         const {data} = await axios.post(`${backendUrl}/api/users/student-login/`, 
//             {
//                 candidateId: userId,
//                 password: password
//             }
//         )

//         if (!data.success) {
//             setLoadingUser(false);
//             return false;
//         }

//         const fakeToken = data.token;

//         localStorage.setItem("token", fakeToken);
//         localStorage.setItem("user", JSON.stringify(data.user));

//         setUser(data.user);
//         navigate('/');
//         setLoadingUser(false);
//         return true;
//     };

//     useEffect(() => {
//         // console.log("Auth effect running...");

//         const savedUser = localStorage.getItem("user");
//         const savedToken = localStorage.getItem("token");

//         // console.log("Saved user:", savedUser);
//         // console.log("Saved token:", savedToken);

//         if (savedUser && savedToken) {
//             setUser(JSON.parse(savedUser));
//             setToken(savedToken);
//         }

//         // console.log("Auth check finished");
//         setLoadingUser(false);
//     }, []);

//     const fetchExam = async() => {
//         try {
//             const {data} = await axios.get(`${backendUrl}/api/exams/get-first-exam/`)
//             if(data.success){
//                 setExam(data.exam);
//                 fetchQuestions(data.exam.id)
//                 console.log(data.exam)
//             }

//         } catch (error) {
//             console.log(error)
//         }
//     }

//     // const fetchQuestions = async(id) => {
//     //     try {
//     //         const {data} = await axios.get(`${backendUrl}/api/exams/questions/${id}/`)
//     //         if(data.success){
//     //             setQuestions(data.questions)
//     //             console.log(data.questions)
//     //         }
//     //     } catch (error) {
//     //         console.log(error)
//     //     }
//     // }

//   const fetchQuestions = async (id) => {
//     try {
//       const { data } = await axios.get(
//         `${backendUrl}/api/exams/questions/${id}/`
//       );

//       if (data.success) {

//         const savedResponses =
//           JSON.parse(localStorage.getItem("examResponses")) || [];

//         const mergedQuestions = data.questions.map((q) => {
//           const saved = savedResponses.find(
//             (item) => item.questionId === q.id
//           );

//           return saved
//             ? {
//                 ...q,
//                 selectedOption: saved.selectedOption,
//                 status: saved.status,
//               }
//             : {
//                 ...q,
//                 selectedOption: null,
//                 status: "notVisited",
//               };
//         });

//         setQuestions(mergedQuestions);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

    
//   useEffect(()=>{
//       fetchExam();
//   }, [])

  
//   useEffect(() => {

//     const handleVisibilityChange = () => {
//       if (document.hidden) {
//         sendViolation("Tab switched or minimized");
//       }
//     };

//     const handleBlur = () => {
//       sendViolation("Window lost focus");
//     };

//     const handleFocus = () => {
//       console.log("User returned to exam");
//     };

//     document.addEventListener("visibilitychange", handleVisibilityChange);
//     window.addEventListener("blur", handleBlur);
//     window.addEventListener("focus", handleFocus);

//     return () => {
//       document.removeEventListener("visibilitychange", handleVisibilityChange);
//       window.removeEventListener("blur", handleBlur);
//       window.removeEventListener("focus", handleFocus);
//     };

//   }, []);

//   const sendViolation = async (message, screenshot = null) => {
//     if (!exam?.id) return;

//     const user = JSON.parse(localStorage.getItem("user"));

//     await axios.post(`${backendUrl}/api/exams/add-violation/`, {
//       student: user.id,
//       exam: exam.id,
//       message,
//       screenshot
//     });
//   };


//   // disabled right click
//   // useEffect(() => {
//   //   const handleRightClick = (e) => {
//   //     e.preventDefault();
//   //     alert("Right click is disabled during the exam.");
//   //   };

//   //   document.addEventListener("contextmenu", handleRightClick);

//   //   return () => {
//   //     document.removeEventListener("contextmenu", handleRightClick);
//   //   };
//   // }, []);

//   // copy paste remove
  
//   useEffect(() => {

//     const blockEvent = (e) => {
//       e.preventDefault();
//       alert("Action disabled during exam.");
//     };

//     document.addEventListener("copy", blockEvent);
//     document.addEventListener("paste", blockEvent);
//     document.addEventListener("cut", blockEvent);

//     return () => {
//       document.removeEventListener("copy", blockEvent);
//       document.removeEventListener("paste", blockEvent);
//       document.removeEventListener("cut", blockEvent);
//     };

//   }, []);

//   // block keybord shortcut 
//   useEffect(() => {
//     const handleKeyDown = (e) => {

//       if (
//         e.ctrlKey && ["c", "v", "x", "a", "u"].includes(e.key.toLowerCase())
//       ) {
//         e.preventDefault();
//       }

//       if (e.key === "F12") {
//         e.preventDefault();
//       }

//       if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "i") {
//         e.preventDefault();
//       }
//     };

//     document.addEventListener("keydown", handleKeyDown);

//     return () => {
//       document.removeEventListener("keydown", handleKeyDown);
//     };
//   }, []);

//   // start screen share 
//   useEffect(() => {
//     const startScreenShare = async () => {
//       try {
//         const stream = await navigator.mediaDevices.getDisplayMedia({
//           video: true
//         });

//         setScreenStream(stream);

//         // Detect if user stops sharing
//         stream.getVideoTracks()[0].addEventListener("ended", () => {
//           addViolation("Screen sharing stopped");
//         });

//       } catch (err) {
//         alert("Screen sharing is required to start the exam.");
//       }
//     };

//     startScreenShare();
//   }, []);


//   const captureScreenshot = async () => {
//     if (!screenStream) return;

//     const video = document.createElement("video");
//     video.srcObject = screenStream;
//     await video.play();

//     const canvas = document.createElement("canvas");
//     canvas.width = 320;
//     canvas.height = 240;

//     const ctx = canvas.getContext("2d");
//     ctx.drawImage(video, 0, 0, 320, 240);

//     const image = canvas.toDataURL("image/jpeg", 0.6);

//     return image;
//   };

  

//   // useEffect(() => {

//   //   const handleVisibilityChange = async () => {
//   //     if (document.hidden) {
//   //       const image = await captureScreenshot();
//   //       addViolation("Tab switched or minimized", image);
//   //     }
//   //   };

//   //   document.addEventListener("visibilitychange", handleVisibilityChange);

//   //   return () => {
//   //     document.removeEventListener("visibilitychange", handleVisibilityChange);
//   //   };

//   // }, [screenStream]);

//   useEffect(() => {
//     const handleVisibility = async () => {
//       if (document.hidden) {
//         const image = await captureScreenshot();
//         sendViolation("Tab switched", image);
//       }
//     };

//     window.addEventListener("blur", handleVisibility);
//     document.addEventListener("visibilitychange", handleVisibility);

//     return () => {
//       window.removeEventListener("blur", handleVisibility);
//       document.removeEventListener("visibilitychange", handleVisibility);
//     };
//   }, [screenStream]);

//   useEffect(() => {
//     const start = async () => {
//       const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
//       setScreenStream(stream);

//       stream.getVideoTracks()[0].addEventListener("ended", () => {
//         sendViolation("Screen sharing stopped");
//         submitExam(); // AUTO SUBMIT
//       });
//     };

//     start();
//   }, []);


//   const addViolation = (message, screenshot = null) => {
//     const violation = {
//       type: message,
//       screenshot: screenshot,
//       timestamp: new Date().toISOString()
//     };

//     setViolations(prev => [...prev, violation]);
//     console.log("Violation:", violation);
//   };

//   const submitExam = async () => {
//     const user = JSON.parse(localStorage.getItem("user"));

//     const score = questions.reduce(
//       (t, q) => (q.selectedOption === q.correct_answer ? t + 1 : t),
//       0
//     );

//     const payload = {
//       student: user.id,
//       exam: exam.id,
//       score,
//       violations,
//       recording: true,
//     };

//     try {
//       await axios.post(`${backendUrl}/api/exams/submit-exam/`, payload);
//       toast.success("Exam submitted successfully");
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const value = {
//     token, user, loadingUser, login, error, exam, questions, setQuestions, submitExam
//   }

//   return (
//     <AppContext.Provider value={value}>
//       {children}
//     </AppContext.Provider>
//   )
// }

// export default AppContext


import React, {
  createContext,
  useEffect,
  useState,
  useRef
} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [loadingUser, setLoadingUser] = useState(true);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [screenStream, setScreenStream] = useState(null);

  const violationsRef = useRef([]); // 🔥 Prevent race condition
  const navigate = useNavigate();

  // ================= LOGIN =================
  const login = async (userId, password) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/users/student-login/`,
        {
          candidateId: userId,
          password: password
        }
      );

      if (!data.success) return false;

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setUser(data.user);
      setToken(data.token);
      navigate("/");
      return true;
    } catch (err) {
      return false;
    }
  };

  // ================= AUTH LOAD =================
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }

    setLoadingUser(false);
  }, []);

  // ================= FETCH EXAM =================
  const fetchExam = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/exams/get-first-exam/`
      );

      if (data.success) {
        setExam(data.exam);
        fetchQuestions(data.exam.id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchQuestions = async (id) => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/exams/questions/${id}/`
      );

      if (data.success) {
        const formatted = data.questions.map((q) => ({
          ...q,
          selectedOption: null
        }));

        setQuestions(formatted);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchExam();
  }, []);

  // ================= START ATTEMPT =================
  const startExamAttempt = async () => {
    if (!exam?.id || !user?.id) return;

    try {
      await axios.post(`${backendUrl}/api/exams/start-exam/`, {
        student: user.id,
        exam: exam.id
      });
    } catch (err) {
      console.log("Attempt already exists or error");
    }
  };

  useEffect(() => {
    if (exam?.id && user?.id) {
      startExamAttempt();
    }
  }, [exam, user]);

  // ================= SEND VIOLATION =================
  const sendViolation = async (message, screenshot = null) => {
    if (!exam?.id || !user?.id) return;

    const violation = {
      type: message,
      screenshot,
      timestamp: new Date().toISOString()
    };

    violationsRef.current.push(violation);

    try {
      await axios.post(`${backendUrl}/api/exams/add-violation/`, {
        student: user.id,
        exam: exam.id,
        message,
        screenshot
      });
    } catch (err) {
      console.log("Violation send failed");
    }
  };

  // ================= BLOCK COPY/PASTE =================
  useEffect(() => {
    const block = (e) => e.preventDefault();

    document.addEventListener("copy", block);
    document.addEventListener("paste", block);
    document.addEventListener("cut", block);

    return () => {
      document.removeEventListener("copy", block);
      document.removeEventListener("paste", block);
      document.removeEventListener("cut", block);
    };
  }, []);

  // ================= BLOCK DEVTOOLS =================
  useEffect(() => {
    const handleKey = (e) => {
      if (
        e.ctrlKey &&
        ["c", "v", "x", "a", "u"].includes(e.key.toLowerCase())
      )
        e.preventDefault();

      if (e.key === "F12") e.preventDefault();

      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "i")
        e.preventDefault();
    };

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  // ================= SCREEN SHARE =================
  useEffect(() => {
    const start = async () => {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true
        });

        setScreenStream(stream);

        stream.getVideoTracks()[0].addEventListener("ended", () => {
          sendViolation("Screen sharing stopped");
          submitExam(); // 🔥 Auto submit
        });
      } catch (err) {
        alert("Screen sharing is required to start the exam.");
      }
    };

    start();
  }, []);

  // ================= TAB SWITCH DETECTION =================
  useEffect(() => {
    const handleVisibility = async () => {
      if (document.hidden) {
        sendViolation("Tab switched or minimized");
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("blur", handleVisibility);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("blur", handleVisibility);
    };
  }, [exam, user]);

  // ================= SUBMIT EXAM =================
  const submitExam = async () => {
    if (!exam?.id || !user?.id) return;

    const score = questions.reduce(
      (t, q) => (q.selectedOption === q.correct_answer ? t + 1 : t),
      0
    );

    const payload = {
      student: user.id,
      exam: exam.id,
      score,
      violations: violationsRef.current,
      recording: true
    };

    try {
      await axios.post(`${backendUrl}/api/exams/submit-exam/`, payload);
      toast.success("Exam submitted successfully");
    } catch (error) {
      console.log(error);
    }
  };

  const value = {
    token,
    user,
    loadingUser,
    login,
    exam,
    questions,
    setQuestions,
    submitExam
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;