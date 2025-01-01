import React, { useRef, useEffect, useState } from "react";
import { useWebRTC } from "../hooks/useWebRTC";
import { FaRegClock, FaUser, FaFileAlt } from "react-icons/fa";
import { MdCallEnd } from "react-icons/md";
import {
  BiSolidMicrophone,
  BiSolidMicrophoneOff,
  BiSolidVideoOff,
  BiSolidVideoPlus,
  BiSolidVideoRecording,
} from "react-icons/bi";

const VideoCall = ({
  roomId,
  userName,
  expertName,
  subject,
  isExpert,
}: {
  roomId: string;
  userName: string;
  expertName: string;
  subject: string;
  isExpert: boolean;
}) => {
  const {
    localStream,
    remoteStream,
    createOffer,
    toggleCamera,
    toggleMic,
    endCall,
  } = useWebRTC(roomId);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [codingNotes, setCodingNotes] = useState("");
  const [privateNotes, setPrivateNotes] = useState("");
  const [onlineCode, setOnlineCode] = useState("");
  const [output, setOutput] = useState("");
  const [showCompiler, setShowCompiler] = useState(false);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  useEffect(() => {
    const interval = setInterval(() => setTimer((prev) => prev + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const handleToggleCamera = () => {
    toggleCamera();
    setIsCameraOn((prev) => !prev);
  };

  const handleToggleMic = () => {
    toggleMic();
    setIsMicOn((prev) => !prev);
  };

  const compileCode = async () => {
    try {
      const response = await fetch("https://api.example.com/compile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: onlineCode }),
      });
      const data = await response.json();
      setOutput(data.output);
    } catch (error) {
      if (error instanceof Error) setOutput("Error compiling code.");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex items-center justify-between bg-blue-600 text-white px-6 py-3">
        <div className="flex items-center space-x-4">
          <FaUser size={20} />
          <span>{`Expert: ${expertName}`}</span>
        </div>
        <div className="flex items-center space-x-4">
          <FaRegClock size={20} />
          <span>{formatTime(timer)}</span>
        </div>
        <div className="flex items-center space-x-4">
          <FaFileAlt size={20} />
          <span>{`Subject: ${subject}`}</span>
        </div>
      </div>
      <div className="flex flex-1">
        <div className="flex flex-col flex-1 bg-black p-4">
          <div className="relative w-full h-2/3 border-2 border-gray-400 rounded overflow-hidden">
            <video
              ref={remoteVideoRef}
              className="w-full h-full object-cover"
              autoPlay
              playsInline
              title="Remote Stream"
            />
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
              {expertName}
            </div>
            <div className="absolute bottom-2 right-2 w-1/4 h-1/4 border-2 border-white">
              <video
                ref={localVideoRef}
                className="w-full h-full object-cover"
                autoPlay
                playsInline
                muted
                title="Local Stream"
              />
              <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white px-1 py-1 rounded text-sm">
                {userName}
              </div>
            </div>
          </div>

          <div className="flex justify-around mt-4">
            <button
              onClick={createOffer}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex"
            >
              <BiSolidVideoPlus className="w-6 h-6" title="Connect" />
            </button>
            <button
              onClick={handleToggleCamera}
              className={`px-4 py-2 rounded ${
                isCameraOn ? "bg-red-500" : "bg-blue-500"
              } hover:opacity-90`}
            >
              {isCameraOn ? (
                <BiSolidVideoOff
                  className="w-6 h-6 text-white"
                  title="Cam Off"
                />
              ) : (
                <BiSolidVideoRecording
                  className="w-6 h-6 text-white"
                  title="Cam On"
                />
              )}
            </button>
            <button
              onClick={handleToggleMic}
              className={`px-4 py-2 rounded ${
                isMicOn ? "bg-red-500" : "bg-blue-500"
              } hover:opacity-90`}
            >
              {isMicOn ? (
                <BiSolidMicrophoneOff
                  className="w-6 h-6 text-white"
                  title="Mute"
                />
              ) : (
                <BiSolidMicrophone
                  className="w-6 h-6 text-white"
                  title="Unmute"
                />
              )}
            </button>
            <button
              onClick={endCall}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              <MdCallEnd className="w-6 h-6 text-white" title="End Call" />
            </button>
          </div>
        </div>
        <div className="flex flex-col flex-1 bg-white p-4">
          {isExpert ? (
            <div className="flex-1 border p-4 mb-4">
              <h3 className="font-bold mb-2">Private Notes (Expert Only)</h3>
              <textarea
                value={privateNotes}
                onChange={(e) => setPrivateNotes(e.target.value)}
                className="w-full h-full p-2 border rounded"
                placeholder="Private notes for the expert..."
              />
            </div>
          ) : null}
          <div className="flex-1 border p-4 mb-4">
            <h3 className="font-bold mb-2">Coding Challenges</h3>
            <textarea
              value={codingNotes}
              onChange={(e) => setCodingNotes(e.target.value)}
              className="w-full h-full p-2 border rounded"
              placeholder="Collaborate on coding challenges here..."
            />
          </div>
          <div className="flex-1 border p-4">
            <button
              onClick={() => setShowCompiler((prev) => !prev)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-2"
            >
              {showCompiler ? "Hide Compiler" : "Show Compiler"}
            </button>
            {showCompiler && (
              <div>
                <textarea
                  value={onlineCode}
                  onChange={(e) => setOnlineCode(e.target.value)}
                  className="w-full h-2/3 p-2 border rounded mb-2"
                  placeholder="Write code here..."
                />
                <button
                  onClick={compileCode}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mb-2"
                >
                  Compile Code
                </button>
                <div className="border p-2 rounded bg-gray-100">
                  <h4 className="font-bold">Output:</h4>
                  <pre>{output}</pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCall;
