import { useEffect, useRef, useState } from "react";
import { Video } from "lucide-react";
import LiveCandidateCard from "../components/LiveCandidateCard";

const LiveMonitoring = () => {
  const [search, setSearch] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [violations, setViolations] = useState({});

  const socketRef = useRef(null);
  const peers = useRef({});
  const videoRefs = useRef({});
  const streams = useRef({});

  const examId = "699145092d5dd8d82d370a05";
  // `ws://localhost:8000/ws/proctoring/admin/${examId}/`,
  useEffect(() => {
    const socket = new WebSocket(
      `wss://caviar-mumbo-squiggle.ngrok-free.dev/ws/proctoring/admin/${examId}/`
    );

    socketRef.current = socket;

    socket.onopen = () => {
      console.log("✅ ADMIN CONNECTED");
      socket.send(JSON.stringify({ type: "request-offer" }));
    };

    socket.onmessage = async (e) => {
      const data = JSON.parse(e.data);

      const type = data.type;
      const studentId = String(data.studentId);

      if (!studentId) return;

      // ================= ADD CANDIDATE =================

      setCandidates((prev) =>
        prev.some((c) => String(c.id) === studentId)
          ? prev
          : [...prev, { id: studentId }],
      );

      // ================= VIOLATION =================

      if (type === "violation") {
        console.log("🚨 VIOLATION:", data);

        setViolations((prev) => ({
          ...prev,
          [studentId]: [
            ...(prev[studentId] || []),
            {
              code: data.violation,
              time: data.timestamp,
            },
          ],
        }));

        return;
      }

      // ================= OFFER =================

      if (type === "offer") {
        console.log("📨 OFFER FROM:", studentId);

        // close old peer if exists
        if (peers.current[studentId]) {
          peers.current[studentId].close();
          delete peers.current[studentId];
        }

        const peer = new RTCPeerConnection({
          iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        });

        // important
        peer.addTransceiver("video", { direction: "recvonly" });

        peers.current[studentId] = peer;

        // ===== VIDEO TRACK =====

        peer.ontrack = (event) => {
          console.log("🎥 VIDEO RECEIVED:", studentId);

          const stream = event.streams[0];

          streams.current[studentId] = stream;

          const video = videoRefs.current[studentId];

          if (video) {
            video.srcObject = stream;
            video.autoplay = true;
            video.playsInline = true;
            video.muted = true;

            video.play().catch(() => {});
          }
        };

        // ===== ICE =====

        peer.onicecandidate = (event) => {
          if (event.candidate) {
            socket.send(
              JSON.stringify({
                type: "ice-candidate",
                studentId: studentId,
                candidate: event.candidate,
              }),
            );
          }
        };

        await peer.setRemoteDescription(data.offer);

        const answer = await peer.createAnswer();

        await peer.setLocalDescription(answer);

        socket.send(
          JSON.stringify({
            type: "answer",
            studentId: studentId,
            answer: answer,
          }),
        );
      }

      // ================= ICE =================

      if (type === "ice-candidate") {
        const peer = peers.current[studentId];

        if (peer && data.candidate) {
          try {
            await peer.addIceCandidate(data.candidate);
          } catch (err) {
            console.log("ICE ERROR:", err);
          }
        }
      }

      // if (type === "student-ready") {
      //   const studentId = String(data.studentId);

      //   console.log("👨‍🎓 STUDENT READY", studentId);

      //   socket.send(
      //     JSON.stringify({
      //       type: "watch-student",
      //       studentId,
      //     }),
      //   );
      // }
      if (type === "student-ready") {
        const studentId = String(data.studentId);

        console.log("👨‍🎓 STUDENT READY", studentId);

        // 🔥 delay prevents race condition after refresh
        setTimeout(() => {
          socket.send(
            JSON.stringify({
              type: "watch-student",
              studentId,
            })
          );
        }, 500);
      }

      if (type === "violation") {
        console.log("🚨 VIOLATION RECEIVED:", data);
      }
    };

    return () => {
      console.log("❌ ADMIN DISCONNECTED");

      socket.close();

      Object.values(peers.current).forEach((p) => p.close());

      peers.current = {};
      streams.current = {};
    };
  }, []);

  const filteredCandidates = candidates.filter((c) =>
    String(c.id).includes(search),
  );

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      {/* Header */}

      <div className="flex justify-between mb-6">
        <h1 className="flex gap-2 text-xl font-semibold">
          <Video /> Live Monitoring
        </h1>

        <input
          className="border px-3 py-2 rounded"
          placeholder="Search candidate"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Grid */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredCandidates.map((c) => (
          <LiveCandidateCard
            key={c.id}
            candidate={c}
            violations={violations[c.id] || []}
            videoRef={(el) => {
              if (!el) return;

              videoRefs.current[c.id] = el;

              const stream = streams.current[c.id];

              if (stream) {
                el.srcObject = stream;

                el.autoplay = true;
                el.playsInline = true;
                el.muted = true;

                el.play().catch(() => {});
              }
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default LiveMonitoring;
