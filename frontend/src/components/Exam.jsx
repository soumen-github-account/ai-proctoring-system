import { useContext, useEffect, useRef, useState } from "react";
import LeftSidebar from "./LeftSidebar";
import Navbar from "./Navbar";
import QuestionPanel from "./QuestionPanel";
import RightSidebar from "./RightSidebar";
import { examData } from "../assets/data";
import {AppContext} from "../contexts/AppContext";
import axios from "axios";
import toast from "react-hot-toast";

const Exam = () => {
  const { questions, setQuestions, exam, backendUrl, answers, setAnswers } = useContext(AppContext);
  // const [questions, setQuestions] = useState(examData.questions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentQuestion = questions[currentIndex];
  const videoRef = useRef(null);
  const peerRef = useRef(null);
  const socketRef = useRef(null);

  const examId = exam?.id;
  const user = JSON.parse(localStorage.getItem("user"));
  const studentId = user.cId

  const [screenStream, setScreenStream] = useState(null);

  const violationsRef = useRef([]);
  const streamRef = useRef(null);
  
  const [cameraReady, setCameraReady] = useState(false);
  const [screenReady, setScreenReady] = useState(false);
  const [socketReady, setSocketReady] = useState(false);

  const examReady = cameraReady && screenReady && socketReady

  const goToQuestion = (id) => {
    const index = questions.findIndex((q) => q.id === id);
    setCurrentIndex(index);
  };

  // const saveAnswer = (optionIndex) =>{
  //     const updated = [...questions];
  //     updated[currentIndex] = {
  //         ...updated[currentIndex],
  //         selectedOption: optionIndex,
  //         status: "answered",
  //     };
  //     setQuestions(updated);
  // }

  // const saveAnswer = (optionIndex) => {
  //   setQuestions((prev) =>
  //     prev.map((q, i) =>
  //       i === currentIndex
  //         ? { ...q, selectedOption: optionIndex, status: "answered" }
  //         : q,
  //     ),
  //   );
  // };
  const saveAnswer = (questionId, selectedOption) => {
    setAnswers(prev => {
      const existing = prev.find(a => a.question_id === questionId)

      if (existing) {
        return prev.map(a =>
          a.question_id === questionId
            ? { ...a, selected_option: selectedOption }
            : a
        )
      } else {
        return [...prev, { question_id: questionId, selected_option: selectedOption }]
      }
    })
  }

  // const clearResponse = () => {
  //   const updated = [...questions];
  //   updated[currentIndex] = {
  //     ...updated[currentIndex],
  //     selectedOption: null,
  //     status: "visited",
  //   };
  //   setQuestions(updated);
  // };

  const clearResponse = (questionId) => {
    setAnswers(prev => prev.filter(a => a.question_id !== questionId))
  }

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  useEffect(() => {
    if (!questions.length) return;

    const responses = questions.map((q) => ({
      questionId: q.id,
      selectedOption: q.selectedOption,
      status: q.status,
    }));

    localStorage.setItem("examResponses", JSON.stringify(responses));
  }, [questions]);

  useEffect(() => {
    if (!exam?.id || !studentId) return;
    // `ws://localhost:8000/ws/proctoring/student/${examId}/${studentId}/`,
    const socket = new WebSocket(
      `wss://caviar-mumbo-squiggle.ngrok-free.dev/ws/proctoring/student/${examId}/${studentId}/`,
    );

    socketRef.current = socket;

    socket.onopen = async () => {
      console.log("✅ STUDENT SOCKET CONNECTED");
      setSocketReady(true);

      const peer = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      peerRef.current = peer;

      // const stream = await navigator.mediaDevices.getUserMedia({
      //   video: true,
      //   audio: false,
      // });
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      streamRef.current = stream;   

      videoRef.current.srcObject = stream;
      setCameraReady(true);

      stream.getTracks().forEach((track) => {
        peer.addTrack(track, stream);
      });

      peer.onicecandidate = (e) => {
        if (e.candidate) {
          socket.send(
            JSON.stringify({
              type: "ice-candidate",
              candidate: e.candidate,
              studentId,
            }),
          );
        }
      };

      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);

      socket.send(
        JSON.stringify({
          type: "offer",
          offer,
          studentId,
        }),
      );
    };

    socket.onmessage = async (e) => {
      const data = JSON.parse(e.data);

      if (data.type === "answer") {
        await peerRef.current.setRemoteDescription(data.answer);

        console.log("✅ ANSWER RECEIVED");
      }

      if (data.type === "ice-candidate") {
        try {
          await peerRef.current.addIceCandidate(data.candidate);
        } catch (err) {
          console.log("ICE ERROR", err);
        }
      }
    };

    return () => {
      socket.close();
      peerRef.current?.close();
    };
  }, [exam]);


    // ================= SCREENSHOT =================
  const captureScreenshot = async () => {

    if (!screenStream) return null;

    const video = document.createElement("video");
    video.srcObject = screenStream;

    await video.play();

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    return canvas.toDataURL("image/jpeg", 0.7);
  };

  // ================= SEND VIOLATION =================
  const sendViolation = async (type) => {

    if (!exam?.id || !user?.id) return;

    const screenshot = await captureScreenshot();

    const violation = {
      type,
      screenshot,
      timestamp: new Date().toISOString()
    };

    violationsRef.current.push(violation);

    try {

      await axios.post(`${backendUrl}/api/exams/add-violation/`, {
        student: user.id,
        exam: exam.id,
        type,
        screenshot
      });
      console.log("🚨 VIOLATION SENT:", type);

    } catch (err) {

      console.log("Violation send failed");

    }
  };

  // ================= BLOCK COPY/PASTE =================
  useEffect(() => {

    const block = async (e) => {

      e.preventDefault();

      toast.error("Copy/Paste not allowed");

      await sendViolation("COPY_ATTEMPT");

    };

    document.addEventListener("copy", block);
    document.addEventListener("paste", block);
    document.addEventListener("cut", block);

    return () => {

      document.removeEventListener("copy", block);
      document.removeEventListener("paste", block);
      document.removeEventListener("cut", block);

    };

  }, [exam, user, screenStream]);

  // ================= BLOCK DEVTOOLS =================
  useEffect(() => {

    const handleKey = (e) => {

      if (
        e.ctrlKey &&
        ["c", "v", "x", "a", "u"].includes(e.key.toLowerCase())
      ) {
        e.preventDefault();
      }

      if (e.key === "F12") e.preventDefault();

      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "i") {
        e.preventDefault();
      }

    };

    document.addEventListener("keydown", handleKey);

    return () => document.removeEventListener("keydown", handleKey);

  }, []);

  // ================= SCREEN SHARE =================
//   useEffect(() => {

//   const startScreenShare = async () => {

//     try {

//       const stream = await navigator.mediaDevices.getDisplayMedia({
//         video: true
//       });

//       setScreenStream(stream);

//       toast.success("Screen sharing started");

//       stream.getVideoTracks()[0].addEventListener("ended", async () => {

//         await sendViolation("SCREEN_SHARE_STOPPED");

//         toast.error("Screen sharing stopped. Exam will be submitted.");

//         // optional: auto submit exam
//         // submitExam();

//       });

//     } catch (err) {

//       console.log("❌ Screen share denied");

//       await sendViolation("SCREEN_SHARE_DENIED");

//       toast.error("Screen sharing is required for the exam");

//       // redirect student
//       window.location.href = "/";

//     }

//   };

//   startScreenShare();

// }, []);

  // ================= SCREEN SHARE =================
useEffect(() => {

  const startScreenShare = async () => {

    try {

      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false
      });

      const track = stream.getVideoTracks()[0];
      const settings = track.getSettings();

      // settings.displaySurface can be: "monitor" | "window" | "browser"
      if (settings.displaySurface !== "monitor") {

        toast.error("❌ Please share your entire screen (Entire Screen), not a tab/window.");

        // stop stream
        stream.getTracks().forEach(t => t.stop());

        await sendViolation("SCREEN_SHARE_NOT_MONITOR");

        // redirect / block exam
        window.location.href = "/";
        return;
      }

      // OK → Entire screen shared
      setScreenStream(stream);
      setScreenReady(true);
      toast.success("Entire screen sharing started");

      track.addEventListener("ended", async () => {

        await sendViolation("SCREEN_SHARE_STOPPED");

        toast.error("Screen sharing stopped. Exam will be submitted.");

        // optional: submitExam();
      });

    } catch (err) {

      console.log("❌ Screen share denied");

      await sendViolation("SCREEN_SHARE_DENIED");

      toast.error("Screen sharing is required for the exam");

      window.location.href = "/";
    }
  };

  startScreenShare();

}, []);

  // ================= TAB SWITCH DETECTION =================
  useEffect(() => {

    const handleVisibility = async () => {

      if (document.hidden) {
        await sendViolation("TAB_SWITCHED");
      }

    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("blur", handleVisibility);

    return () => {

      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("blur", handleVisibility);

    };

  }, [exam, user, screenStream]);

useEffect(() => {

  if (!exam.id || !user.id || !examReady) {
    console.log("Waiting for proctoring setup...");
    return;
  }

  const startAttempt = async () => {

    try {

      console.log("🚀 Calling start-exam API");

      await axios.post(`${backendUrl}/api/exams/start-exam/`, {
        student: user.id,
        exam: exam.id
      }, {withCredentials: true});

      console.log("✅ Exam attempt created");

    } catch (err) {

      console.log("Attempt start error:", err);

    }

  };

  startAttempt();

}, [exam?.id, user?.id, examReady]);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <Navbar stopCamera={stopCamera}/>
      {currentQuestion && (
        <div className="flex flex-1 overflow-hidden">
          <LeftSidebar
            questions={questions}
            currentQuestionId={currentQuestion.id}
            onQuestionSelect={goToQuestion}
          />

          <QuestionPanel
            question={currentQuestion}
            questionNumber={currentIndex + 1}
            onSave={saveAnswer}
            onClear={clearResponse}
            onNext={nextQuestion}
            onPrev={prevQuestion}
          />
          <RightSidebar />
        </div>
      )}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="fixed bottom-4 right-4 w-40 border-2 border-red-500 rounded"
      />
    </div>
  );
};

export default Exam;
