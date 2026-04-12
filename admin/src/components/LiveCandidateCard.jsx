const VIOLATION_LABELS = {
  MOBILE_PHONE_DETECTED: "📱 Mobile Phone",
  MULTIPLE_FACES_DETECTED: "❌ Multiple Faces",
  NO_FACE_DETECTED: "🙈 No Face",
  LOOKING_DOWN: "Looking down",
  LOOKING_RIGHT: "Looking Right",
  LOOKING_LEFT: "Looking Left"
};

const LiveCandidateCard = ({ candidate, videoRef, violations = [] }) => {
  const candidateId = String(candidate?.id || "");

  const latestViolations = violations.slice(-3);

  console.log("Violations for", candidateId, violations);

  return (
    <div className="relative bg-white rounded-xl shadow overflow-hidden">
      {/* VIDEO */}
      <video
        ref={videoRef}
        className="w-full h-48 object-cover bg-black"
        autoPlay
        muted
        playsInline
      />

      {/* 🚨 VIOLATION OVERLAY */}
      <div className="absolute bottom-10 left-2 flex flex-col gap-1 z-10">
        {latestViolations.map((v, i) => (
          <div
            key={i}
            className="bg-red-600 text-white text-xs px-2 py-1 rounded shadow"
          >
            {VIOLATION_LABELS[v.code] || v.code}
          </div>
        ))}
      </div>

      {/* FOOTER */}
      <div className="p-2 text-sm font-medium border-t bg-white z-20 relative">
        Candidate ID: {candidateId || "Unknown"}
      </div>
    </div>
  );
};

export default LiveCandidateCard;
