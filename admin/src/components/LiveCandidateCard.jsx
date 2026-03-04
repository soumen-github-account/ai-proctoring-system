
const riskStyles = {
  HIGH: "bg-gradient-to-r from-red-500 to-red-600 shadow-red-500/30",
  MEDIUM: "bg-gradient-to-r from-yellow-400 to-yellow-500 shadow-yellow-400/30",
  LOW: "bg-gradient-to-r from-green-500 to-emerald-600 shadow-green-500/30",
};


const LiveCandidateCard = ({ candidate, videoRef }) => {
  return (
    <div className="
      group relative rounded-2xl overflow-hidden
      bg-white
      shadow-sm hover:shadow-xl
      transition-all duration-300 ease-out
      hover:-translate-y-1
      border border-gray-100
    ">

      {/* Image */}
      {/* <img
        src={candidate.image}
        alt={candidate.name}
        className="w-full h-50 object-cover group-hover:scale-105 transition-transform duration-500"
      /> */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-50 object-cover"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

      {/* Risk Badge */}
      <span
        className={`
          absolute top-3 left-3
          text-white text-xs font-semibold
          px-3 py-1 rounded-full
          shadow-md
          ${riskStyles[candidate.risk]}
        `}
      >
        {candidate.risk} RISK
      </span>

      {/* FLAG */}
      {candidate.risk === "HIGH" && (
        <span className="
          absolute top-3 right-3
          bg-red-600 text-white text-[10px]
          px-2 py-1 rounded-md
          font-bold tracking-wide
          shadow-lg
        ">
          FLAG
        </span>
      )}

      {/* Footer */}
      <div className="
        absolute bottom-0 w-full
        px-4 py-3
        backdrop-blur-md
        bg-white/10
        text-white
      ">
        <p className="font-semibold text-sm leading-tight">
          {candidate.name}
        </p>

        <p className="text-xs text-white/80 mt-0.5">
          Trust Score:
          <span className="ml-1 font-bold text-white">
            {candidate.trustScore}
          </span>
        </p>
      </div>
    </div>
  );
};

export default LiveCandidateCard;
