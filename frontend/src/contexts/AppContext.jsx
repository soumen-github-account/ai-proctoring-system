
// import React, {
//   createContext,
//   useEffect,
//   useState,
//   useRef
// } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import toast from "react-hot-toast";

// export const AppContext = createContext();

// export const AppContextProvider = ({ children }) => {
//   const backendUrl = import.meta.env.VITE_BACKEND_URL;

//   const [loadingUser, setLoadingUser] = useState(true);
//   const [token, setToken] = useState(null);
//   const [user, setUser] = useState(null);
//   const [exam, setExam] = useState(null);
//   const [questions, setQuestions] = useState([]);
//   const [screenStream, setScreenStream] = useState(null);

//   const violationsRef = useRef([]); // 🔥 Prevent race condition
//   const navigate = useNavigate();

//   // ================= LOGIN =================
//   const login = async (userId, password) => {
//     try {
//       console.log("LOGIN URL:", `${backendUrl}/api/users/student-login/`);
//       const { data } = await axios.post(
//         `${backendUrl}/api/users/student-login/`,
//         {
//           candidateId: userId,
//           password: password
//         }
//       );

//       if (!data.success) return false;

//       localStorage.setItem("token", data.token);
//       localStorage.setItem("user", JSON.stringify(data.user));

//       setUser(data.user);
//       setToken(data.token);
//       navigate("/");
//       return true;
//     } catch (err) {
//       return false;
//     }
//   };

//   // ================= AUTH LOAD =================
//   useEffect(() => {
//     const savedUser = localStorage.getItem("user");
//     const savedToken = localStorage.getItem("token");

//     if (savedUser && savedToken) {
//       setUser(JSON.parse(savedUser));
//       setToken(savedToken);
//     }

//     setLoadingUser(false);
//   }, []);

//   // ================= FETCH EXAM =================
//   const fetchExam = async () => {
//     try {
//       const { data } = await axios.get(
//         `${backendUrl}/api/exams/get-first-exam/`
//       );

//       if (data.success) {
//         setExam(data.exam);
//         fetchQuestions(data.exam.id);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const fetchQuestions = async (id) => {
//     try {
//       const { data } = await axios.get(
//         `${backendUrl}/api/exams/questions/${id}/`
//       );

//       if (data.success) {
//         const formatted = data.questions.map((q) => ({
//           ...q,
//           selectedOption: null
//         }));

//         setQuestions(formatted);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     fetchExam();
//   }, []);

//   // ================= START ATTEMPT =================
//   const startExamAttempt = async () => {
//     if (!exam?.id || !user?.id) return;

//     try {
//       await axios.post(`${backendUrl}/api/exams/start-exam/`, {
//         student: user.id,
//         exam: exam.id
//       });
//     } catch (err) {
//       console.log("Attempt already exists or error");
//     }
//   };

//   useEffect(() => {
//     if (exam?.id && user?.id) {
//       startExamAttempt();
//     }
//   }, [exam, user]);

//   // ================= SEND VIOLATION =================
//   const sendViolation = async (message, screenshot = null) => {
//     if (!exam?.id || !user?.id) return;

//     const violation = {
//       type: message,
//       screenshot,
//       timestamp: new Date().toISOString()
//     };

//     violationsRef.current.push(violation);

//     try {
//       await axios.post(`${backendUrl}/api/exams/add-violation/`, {
//         student: user.id,
//         exam: exam.id,
//         message,
//         screenshot
//       });
//     } catch (err) {
//       console.log("Violation send failed");
//     }
//   };

//   // ================= BLOCK COPY/PASTE =================
//   useEffect(() => {
//     const block = (e) => e.preventDefault();

//     document.addEventListener("copy", block);
//     document.addEventListener("paste", block);
//     document.addEventListener("cut", block);

//     return () => {
//       document.removeEventListener("copy", block);
//       document.removeEventListener("paste", block);
//       document.removeEventListener("cut", block);
//     };
//   }, []);

//   // ================= BLOCK DEVTOOLS =================
//   useEffect(() => {
//     const handleKey = (e) => {
//       if (
//         e.ctrlKey &&
//         ["c", "v", "x", "a", "u"].includes(e.key.toLowerCase())
//       )
//         e.preventDefault();

//       if (e.key === "F12") e.preventDefault();

//       if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "i")
//         e.preventDefault();
//     };

//     document.addEventListener("keydown", handleKey);
//     return () => document.removeEventListener("keydown", handleKey);
//   }, []);

//   // ================= SCREEN SHARE =================
//   useEffect(() => {
//     const start = async () => {
//       try {
//         const stream = await navigator.mediaDevices.getDisplayMedia({
//           video: true
//         });

//         setScreenStream(stream);

//         stream.getVideoTracks()[0].addEventListener("ended", () => {
//           sendViolation("Screen sharing stopped");
//           submitExam(); // Auto submit
//         });
//       } catch (err) {
//         alert("Screen sharing is required to start the exam.");
//       }
//     };

//     start();
//   }, []);

//   // ================= TAB SWITCH DETECTION =================
//   useEffect(() => {
//     const handleVisibility = async () => {
//       if (document.hidden) {
//         sendViolation("Tab switched or minimized");
//       }
//     };

//     document.addEventListener("visibilitychange", handleVisibility);
//     window.addEventListener("blur", handleVisibility);

//     return () => {
//       document.removeEventListener("visibilitychange", handleVisibility);
//       window.removeEventListener("blur", handleVisibility);
//     };
//   }, [exam, user]);

//   // ================= SUBMIT EXAM =================
//   const submitExam = async () => {
//     if (!exam?.id || !user?.id) return;

//     const score = questions.reduce(
//       (t, q) => (q.selectedOption === q.correct_answer ? t + 1 : t),
//       0
//     );

//     const payload = {
//       student: user.id,
//       exam: exam.id,
//       score,
//       violations: violationsRef.current,
//       recording: true
//     };

//     try {
//       await axios.post(`${backendUrl}/api/exams/submit-exam/`, payload);
//       toast.success("Exam submitted successfully");
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const value = {
//     token,
//     user,
//     loadingUser,
//     login,
//     exam,
//     questions,
//     setQuestions,
//     submitExam
//   };

//   return (
//     <AppContext.Provider value={value}>
//       {children}
//     </AppContext.Provider>
//   );
// };

// export default AppContext;


import React, { createContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [loadingUser, setLoadingUser] = useState(false);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [submitLoading, setSubmitLoading] = useState(false)
  const [status, setStatus] = useState(null)
  const [answers, setAnswers] = useState([])

  const navigate = useNavigate();

  // ================= LOGIN =================
  const login = async (userId, password) => {

    try {

      setLoadingUser(true);

      const { data } = await axios.post(
        `${backendUrl}/api/users/student-login/`,
        {
          candidateId: userId,
          password
        }
      );

      if (!data.success) {
        toast.error(data.message);
        setLoadingUser(false);
        return false;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setUser(data.user);
      setToken(data.token);

      navigate("/");

      return true;

    } catch (err) {
      console.log(err.response);
      
      toast.error("Login failed");
      return false;

    } finally {

      setLoadingUser(false);

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

        console.log(formatted);
        
        setQuestions(formatted);
      }

    } catch (error) {

      console.log(error);

    }
  };

  const fetchStatus = async() =>{
    try {
      const {data} = await axios.get(`${backendUrl}/api/exams/get-status/${user.id}/`)
      
      if(data.success){
        setStatus(data.status)
      }
    } catch (err) {
      console.log(err);
    }
  }
  useEffect(() => {

    if (user) {
      fetchExam();
      fetchStatus()
    }

  }, [user]);


  // ================= START ATTEMPT =================
  // const startExamAttempt = async () => {

  //   if (!exam?.id || !user?.id) return;

  //   try {

  //     await axios.post(`${backendUrl}/api/exams/start-exam/`, {
  //       student: user.id,
  //       exam: exam.id
  //     });

  //   } catch (err) {

  //     console.log("Attempt already exists");

  //   }
  // };

  // useEffect(() => {

  //   if (exam?.id && user?.id) {
  //     startExamAttempt();
  //   }

  // }, [exam, user]);

  // ================= SUBMIT EXAM =================
  const submitExam = async () => {
    setSubmitLoading(true)
    if (!exam?.id || !user?.id) return;

    const payload = {
      student: user.id,
      exam: exam.id,
      answers: answers
    };

    try {
      const {data} = await axios.post(`${backendUrl}/api/exams/submit-exam/`, payload);
      if(data.success){
        setSubmitLoading(false);
        toast.success("Exam Submitted")
        navigate("/")
        fetchStatus()
      } else{
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error);
      setSubmitLoading(false)
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
    submitExam,
    backendUrl,
    submitLoading, setSubmitLoading, status,
    answers, setAnswers
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;