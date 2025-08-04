import React, { useRef, useEffect, useState } from 'react';
import { Camera, CheckCircle, XCircle, Loader } from 'lucide-react';
import { biometricService } from '../services/biometricService';
import { BiometricData } from '../types';

interface BiometricCaptureProps {
  onCapture: (data: BiometricData) => void;
  onError: (error: string) => void;
}

export const BiometricCapture: React.FC<BiometricCaptureProps> = ({ onCapture, onError }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureStatus, setCaptureStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');

  useEffect(() => {
    initializeCamera();
    return () => {
      if (stream) {
        biometricService.stopVideoStream(stream);
      }
    };
  }, []);

  const initializeCamera = async () => {
    try {
      const videoStream = await biometricService.startVideoStream();
      if (videoStream && videoRef.current) {
        setStream(videoStream);
        videoRef.current.srcObject = videoStream;
      } else {
        onError('Failed to access camera');
      }
    } catch (error) {
      onError('Camera access denied');
    }
  };

  const captureImage = async () => {
    if (!videoRef.current || !stream) {
      onError('Camera not ready');
      return;
    }

    setIsCapturing(true);
    setCaptureStatus('processing');

    try {
      const biometricData = await biometricService.captureFaceData(videoRef.current);
      
      if (biometricData) {
        setCaptureStatus('success');
        onCapture(biometricData);
        setTimeout(() => setCaptureStatus('idle'), 2000);
      } else {
        setCaptureStatus('error');
        onError('Failed to capture biometric data');
        setTimeout(() => setCaptureStatus('idle'), 2000);
      }
    } catch (error) {
      setCaptureStatus('error');
      onError('Biometric capture failed');
      setTimeout(() => setCaptureStatus('idle'), 2000);
    } finally {
      setIsCapturing(false);
    }
  };

  const getStatusIcon = () => {
    switch (captureStatus) {
      case 'processing':
        return <Loader className="w-6 h-6 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'error':
        return <XCircle className="w-6 h-6 text-red-500" />;
      default:
        return <Camera className="w-6 h-6 text-gray-500" />;
    }
  };

  const getStatusMessage = () => {
    switch (captureStatus) {
      case 'processing':
        return 'Processing biometric data...';
      case 'success':
        return 'Biometric data captured successfully!';
      case 'error':
        return 'Failed to capture biometric data';
      default:
        return 'Position your face in the center and click capture';
    }
  };

  return (
    <div className="cyber-panel neon-glow p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse"></div>
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-cyan-400 neon-text mb-2 font-mono">NEURAL PATTERN SCANNER</h3>
        <p className="text-cyan-300 font-mono">Align facial matrix within scanning perimeter</p>
      </div>

      <div className="relative mb-6">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-64 bg-black border-2 border-cyan-400 object-cover relative"
        />
        
        {/* Neural scanning overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-48 h-48 border-2 border-cyan-400 rounded-full opacity-70 animate-pulse neon-glow">
            <div className="absolute inset-4 border border-cyan-400 rounded-full animate-spin" style={{animationDuration: '3s'}}></div>
            <div className="absolute inset-8 border border-cyan-400 rounded-full animate-spin" style={{animationDuration: '2s', animationDirection: 'reverse'}}></div>
          </div>
          {/* Scanning lines */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-48 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-0.5 h-48 bg-gradient-to-b from-transparent via-cyan-400 to-transparent animate-pulse"></div>
          </div>
        </div>

        {/* Status overlay */}
        <div className="absolute bottom-4 left-4 right-4 cyber-panel border-cyan-400 p-3 flex items-center space-x-3">
          {getStatusIcon()}
          <span className="text-sm font-mono text-cyan-400">{getStatusMessage()}</span>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={captureImage}
          disabled={isCapturing || !stream}
          className="holo-button px-8 py-3 font-medium transition-all duration-300 flex items-center space-x-2 disabled:opacity-50"
        >
          <Camera className="w-5 h-5" />
          <span className="font-mono">{isCapturing ? 'SCANNING...' : 'INITIATE NEURAL SCAN'}</span>
        </button>
      </div>

      <div className="mt-4 text-xs text-cyan-300 text-center font-mono">
        <p>• Optimal illumination required</p>
        <p>• Direct neural pathway alignment</p>
        <p>• Remove optical interference devices</p>
      </div>
    </div>
  );
};