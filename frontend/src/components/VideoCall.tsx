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
import { io } from "socket.io-client";

interface Message {
  userName: string;
  message: string;
}

const socket = io("http://localhost:3001");

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
    startRecording,
    stopRecording,
  } = useWebRTC(roomId);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [isCameraOn, setIsCameraOn] = useState<boolean>(true);
  const [isMicOn, setIsMicOn] = useState<boolean>(true);
  // const [codingNotes, setCodingNotes] = useState<string>("");
  const [privateNotes, setPrivateNotes] = useState<string>("");
  const [onlineCode, setOnlineCode] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const [showCompiler, setShowCompiler] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(0);
  const [isCallStarted, setIsCallStarted] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");

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
    if (isCallStarted) {
      const interval = setInterval(() => setTimer((prev) => prev + 1), 1000);
      return () => clearInterval(interval);
    }
  }, [isCallStarted]);

  useEffect(() => {
    socket.on("chatMessage", (message) => {
      setChatMessages((prev) => [...prev, message]);
    });
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
      socket.emit("saveCode", { roomId, code: onlineCode });
    } catch (error) {
      if(error instanceof Error)
      setOutput("Error compiling code.");
    }
  };

  const handleSendMessage = () => {
    socket.emit("chatMessage", { roomId, userName, message: newMessage });
    setNewMessage("");
  };

  const handleStartCall = () => {
    if (isExpert) {
      createOffer();
      setIsCallStarted(true);
      startRecording();
    }
  };

  const handleEndCall = () => {
    if (isExpert) {
      endCall();
      setIsCallStarted(false);
      stopRecording();
    }
  };

  const savePrivateNotes = () => {
    socket.emit("savePrivateNotes", { roomId, privateNotes });
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      <div className="flex items-center justify-between bg-gray-900 px-6 py-3">
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
          <div className="relative w-full h-2/3 border border-gray-600 rounded overflow-hidden">
            <video
              ref={remoteVideoRef}
              className="w-full h-full object-cover"
              autoPlay
              playsInline
              title="Remote Stream"
            />
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded">
              {expertName}
            </div>
            <div className="absolute bottom-2 right-2 w-1/4 h-1/4 border border-white">
              <video
                ref={localVideoRef}
                className="w-full h-full object-cover"
                autoPlay
                playsInline
                muted
                title="Local Stream"
              />
              <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 px-1 py-1 rounded text-sm">
                {userName}
              </div>
            </div>
          </div>

          <div className="flex justify-around mt-4">
            {isExpert && !isCallStarted && (
              <button
                onClick={handleStartCall}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex"
              >
                <BiSolidVideoPlus className="w-6 h-6" title="Start Call" />
              </button>
            )}

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

            {isExpert && isCallStarted && (
              <button
                onClick={handleEndCall}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                <MdCallEnd className="w-6 h-6 text-white" title="End Call" />
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col flex-1 bg-gray-800 p-4">
          <div className="flex-1 border p-4 mb-4">
            <h3 className="font-bold mb-2">Chat</h3>
            <div className="h-48 overflow-y-scroll bg-gray-700 p-2 rounded">
              {chatMessages.map((msg: Message, index) => (
                <div key={index} className="mb-1">
                  <strong>{msg.userName}:</strong> {msg.message}
                </div>
              ))}
            </div>
            <div className="flex mt-2">
              <input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 p-2 border rounded"
                placeholder="Type your message..."
              />
              <button
                onClick={handleSendMessage}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ml-2"
              >
                Send
              </button>
            </div>
          </div>

          {isExpert && (
            <div className="flex-1 border p-4 mb-4">
              <h3 className="font-bold mb-2">Private Notes (Expert Only)</h3>
              <textarea
                value={privateNotes}
                onChange={(e) => setPrivateNotes(e.target.value)}
                onBlur={savePrivateNotes}
                className="w-full h-full p-2 border rounded bg-gray-700 text-white"
                placeholder="Private notes for the expert..."
              />
            </div>
          )}

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
                  className="w-full h-2/3 p-2 border rounded bg-gray-700 text-white mb-2"
                  placeholder="Write code here..."
                />
                <button
                  onClick={compileCode}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mb-2"
                >
                  Compile Code
                </button>
                <div className="border p-2 rounded bg-gray-100 text-black">
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
