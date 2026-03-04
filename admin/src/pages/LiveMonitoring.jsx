import { useEffect, useRef, useState } from "react";
import { Video } from "lucide-react";
import LiveCandidateCard from "../components/LiveCandidateCard";

const LiveMonitoring = () => {
  const [search, setSearch] = useState("");
  const [candidates, setCandidates] = useState([]);

  const socketRef = useRef(null);
  const peers = useRef({});
  const videoRefs = useRef({});
  const streams = useRef({});

  const examId = 123;

  useEffect(() => {
    const socket = new WebSocket(
      `ws://localhost:8000/ws/proctoring/admin/${examId}/`
    );

    socketRef.current = socket;

    socket.onopen = () => {
      console.log("✅ ADMIN CONNECTED");
      socket.send(JSON.stringify({ type: "request-offer" }));
    };

    socket.onmessage = async (e) => {
      const data = JSON.parse(e.data);
      const { type, studentId } = data;
      if (!studentId) return;

      // Add candidate once
      setCandidates((prev) =>
        prev.some((c) => c.id === studentId)
          ? prev
          : [...prev, { id: studentId }]
      );

      // ================= OFFER =================
      if (type === "offer") {
        console.log("📨 OFFER FROM:", studentId);

        // Cleanup old peer if exists
        if (peers.current[studentId]) {
          peers.current[studentId].close();
          delete peers.current[studentId];
        }

        const peer = new RTCPeerConnection({
          iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        });

        peers.current[studentId] = peer;

        peer.ontrack = (e) => {
          console.log("🎥 STREAM RECEIVED:", studentId);
          const stream = e.streams[0];
          streams.current[studentId] = stream;

          const video = videoRefs.current[studentId];
          if (video) {
            video.srcObject = stream;
            video.playsInline = true;
            video.autoplay = true;
            video.muted = true;
            video.play().catch(() => {});
          }
        };

        peer.onicecandidate = (e) => {
          if (e.candidate) {
            socket.send(
              JSON.stringify({
                type: "ice-candidate",
                studentId,
                candidate: e.candidate,
              })
            );
          }
        };

        await peer.setRemoteDescription(data.offer);
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);

        socket.send(
          JSON.stringify({
            type: "answer",
            studentId,
            answer,
          })
        );
      }

      // ================= ICE =================
      if (type === "ice-candidate") {
        const peer = peers.current[studentId];
        if (peer && data.candidate) {
          await peer.addIceCandidate(data.candidate);
        }
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
    String(c.id).includes(search)
  );

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold flex items-center gap-2">
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
            videoRef={(el) => {
              if (!el) return;

              videoRefs.current[c.id] = el;

              if (streams.current[c.id]) {
                el.srcObject = streams.current[c.id];
                el.playsInline = true;
                el.autoplay = true;
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