import { useRef, useState } from "react";

export default function MobileCamera() {
  const videoRef = useRef(null);
  const [streaming, setStreaming] = useState(false);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      videoRef.current.srcObject = stream;
      setStreaming(true);
    } catch (err) {
      console.error("Camera error:", err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {!streaming && (
        <button
          onClick={startCamera}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Start Mobile Camera
        </button>
      )}

      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="mt-4 w-full max-w-md rounded"
      />
    </div>
  );
}