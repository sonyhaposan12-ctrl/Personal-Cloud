import React, { useRef, useEffect, useState } from 'react';
import CameraIcon from './icons/CameraIcon';

interface CameraViewProps {
  onCapture: (dataUrl: string) => void;
  onCancel: () => void;
}

const CameraView: React.FC<CameraViewProps> = ({ onCapture, onCancel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.warn("Could not get environment camera, falling back to default", err);
        try {
            stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setError(null);
            }
        } catch (fallbackErr) {
             console.error("Error accessing any camera:", fallbackErr);
             setError('Could not access camera. Please check permissions and ensure your device has a camera.');
        }
      }
    };
    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        onCapture(dataUrl);
      } else {
        setError("Could not process the image. Please try again.");
      }
    }
  };

  if (error) {
    return (
      <div className="p-6 flex flex-col items-center justify-center text-center">
        <p className="text-red-500">{error}</p>
        <button onClick={onCancel} className="mt-4 bg-slate-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-slate-500">
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-col items-center justify-center">
        <div className="relative w-full max-w-md aspect-[4/3] bg-black rounded-lg overflow-hidden shadow-lg">
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover"></video>
            <canvas ref={canvasRef} className="hidden"></canvas>
        </div>
        <div className="mt-6 flex items-center justify-center w-full">
            <button onClick={handleCapture} className="group flex items-center justify-center w-16 h-16 bg-white rounded-full border-4 border-slate-400 hover:border-brand-accent transition-colors focus:outline-none focus:ring-2 focus:ring-brand-accent">
                <div className="w-12 h-12 bg-white rounded-full group-hover:bg-brand-accent/20 transition-colors"></div>
            </button>
        </div>
        <button onClick={onCancel} className="mt-4 text-slate-300 hover:text-white">
          Cancel
        </button>
    </div>
  );
};

export default CameraView;
