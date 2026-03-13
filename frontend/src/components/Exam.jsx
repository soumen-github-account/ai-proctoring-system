import { useContext, useEffect, useRef, useState } from "react";
import LeftSidebar from "./LeftSidebar";
import Navbar from "./Navbar";
import QuestionPanel from "./QuestionPanel";
import RightSidebar from "./RightSidebar";
import { examData } from "../assets/data";
import AppContext from "../contexts/AppContext";

const Exam = () => {
  const { questions, setQuestions } = useContext(AppContext);
  // const [questions, setQuestions] = useState(examData.questions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentQuestion = questions[currentIndex];
  const videoRef = useRef(null);
  const peerRef = useRef(null);
  const socketRef = useRef(null);

  const examId = 123;
  const user = JSON.parse(localStorage.getItem("user"));
  const studentId = user.cId

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

  const saveAnswer = (optionIndex) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === currentIndex
          ? { ...q, selectedOption: optionIndex, status: "answered" }
          : q,
      ),
    );
  };

  const clearResponse = () => {
    const updated = [...questions];
    updated[currentIndex] = {
      ...updated[currentIndex],
      selectedOption: null,
      status: "visited",
    };
    setQuestions(updated);
  };

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
    const socket = new WebSocket(
      `ws://localhost:8000/ws/proctoring/student/${examId}/${studentId}/`,
    );

    socketRef.current = socket;

    socket.onopen = async () => {
      console.log("✅ STUDENT SOCKET CONNECTED");

      const peer = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      peerRef.current = peer;

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      videoRef.current.srcObject = stream;

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
  }, []);

  return (
    <div className="h-screen flex flex-col">
      <Navbar />
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
